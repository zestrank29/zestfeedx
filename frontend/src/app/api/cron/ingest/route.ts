import { NextRequest, NextResponse } from "next/server";
import { FEED_SOURCES_REGISTRY } from "@/lib/pipeline/sources.config";
import {
  RawFeedItem,
  normalizeFeedItem,
  deduplicateItems,
  NormalizedBriefItem,
} from "@/lib/pipeline/normalize";
import { classifyArticle } from "@/lib/pipeline/classifier";
import { clusterStories, StoryCluster } from "@/lib/pipeline/clustering";
import { db, schema, isDatabaseConfigured } from "@/db";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const startTime = Date.now();

  // 1. Validate Secret Authorization Token
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "development-secret";
  const urlSecret = req.nextUrl.searchParams.get("secret");

  const isAuthorized =
    authHeader === `Bearer ${cronSecret}` ||
    urlSecret === cronSecret ||
    process.env.NODE_ENV === "development";

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Sample raw mock feed batch representing Tier 1 (PIB, RBI, CPCB) & Tier 2 wires
  // This demonstrates end-to-end normalization, deduplication, 48h cut-off, and clustering.
  const rawSampleBatch: RawFeedItem[] = [
    {
      title: "<b>Dimagi Naxals</b> have taken control: PM Modi warns during Diwali address in Bastar",
      summary: "<p>Prime Minister Narendra Modi addressed a large gathering in Chhattisgarh's Bastar region, warning that ideological enablers have captured institutions while announcing new tribal welfare corridors.</p>",
      url: "https://timesofindia.indiatimes.com/videos/news/dimagi-naxals-have-taken-control-pm-modi-warns-during-diwali-address-in-bastar/videoshow/135656592.cms?utm_source=twitter&ref=rss",
      published_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), // 3 hours ago
      source_name: "The Times of India",
      source_slug: "toi",
    },
    {
      // Duplicate of Bastar speech from another syndicate (should be clustered or deduped)
      title: "PM Modi Bastar Diwali Address: Warning against intellectual sympathizers of extremism",
      summary: "Prime Minister Modi delivered a crucial Diwali address in Bastar, signaling zero tolerance for urban extremism facilitators.",
      url: "https://thehindu.com/news/national/pm-modi-diwali-bastar-speech-tribal-development.ece",
      published_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      source_name: "The Hindu",
      source_slug: "the-hindu",
    },
    {
      // Stale item > 48h (must be rejected by Rule 3)
      title: "Old Election Commission press release on bye-poll scheduling from last month",
      summary: "The Election Commission of India issued detailed notices regarding previous assembly polls.",
      url: "https://pib.gov.in/PressReleasePage.aspx?PRID=199999",
      published_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString(), // 72 hours ago
      source_name: "Press Information Bureau",
      source_slug: "pib-india",
    },
    {
      // Market story (must be classified as markets, not politics)
      title: "Sensex closes 40 points higher as Nifty stabilizes near 24,985; IT and auto stocks lead gains",
      summary: "Indian equity benchmark indices ended flat with a positive bias on Thursday following steady foreign institutional inflows and stable bond yields.",
      url: "https://ndtvprofit.com/markets/sensex-nifty-closing-bell-nov-14?utm_campaign=finance",
      published_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      source_name: "NDTV Profit",
      source_slug: "ndtv-profit",
    },
    {
      // Health / AQI story
      title: "Delhi Air Quality Index touches 342 in 'Very Poor' category amid post-Diwali smog trap",
      summary: "Central Pollution Control Board recorded an average AQI of 342 across the National Capital Region as calm surface winds trapped particulate matter.",
      url: "https://indianexpress.com/cities/delhi/delhi-air-quality-cpcb-very-poor-aqi-342.html",
      published_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
      source_name: "The Indian Express",
      source_slug: "indian-express",
    },
  ];

  // 2. Normalization & 48-Hour Filter
  const normalizedList: (NormalizedBriefItem & { category: string })[] = [];
  let rejectedCount = 0;

  for (const raw of rawSampleBatch) {
    const norm = normalizeFeedItem(raw);
    if (!norm) {
      rejectedCount++;
      continue;
    }
    const cat = classifyArticle(norm.title, norm.summary);
    normalizedList.push({ ...norm, category: cat });
  }

  // 3. Deduplicate by URL Hash & Trigram Similarity (>= 0.85)
  const dedupedList = deduplicateItems(normalizedList, 0.85);
  const duplicatesDropped = normalizedList.length - dedupedList.length;

  // 4. Multi-Outlet Clustering
  const clusters = clusterStories(dedupedList);

  // 5. Store in Database if configured
  let savedToDbCount = 0;
  if (isDatabaseConfigured && db) {
    try {
      for (const item of dedupedList) {
        // Resolve category id
        const catRecord = await db
          .select({ id: schema.categories.id })
          .from(schema.categories)
          .where(eq(schema.categories.slug, item.category))
          .limit(1);

        const categoryId = catRecord[0]?.id;
        if (categoryId) {
          await db
            .insert(schema.curatedBriefs)
            .values({
              title: item.title,
              summary: item.summary,
              sourceName: item.source_name,
              sourceUrl: item.source_url,
              sourceUrlHash: item.source_url_hash,
              categoryId,
              publishedAt: new Date(item.published_at),
            })
            .onConflictDoNothing({ target: schema.curatedBriefs.sourceUrlHash });
          savedToDbCount++;
        }
      }
    } catch (err) {
      console.warn("DB Ingestion write error:", err);
    }
  }

  const durationMs = Date.now() - startTime;

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    metrics: {
      raw_items_processed: rawSampleBatch.length,
      rejected_older_than_48h_or_invalid: rejectedCount,
      duplicates_dropped_by_hash_or_similarity: duplicatesDropped,
      valid_items_accepted: dedupedList.length,
      clusters_formed: clusters.length,
      database_persisted: savedToDbCount,
      execution_time_ms: durationMs,
    },
    active_sources: FEED_SOURCES_REGISTRY.filter((s) => s.isActive).map((s) => ({
      name: s.name,
      tier: s.tier,
      category: s.category,
      license: s.licenseNotes,
    })),
    clusters_sample: clusters.slice(0, 3).map((c) => ({
      headline: c.headline,
      category: c.category,
      story_count: c.story_count,
      outlets: c.outlets,
    })),
    accepted_briefs_sample: dedupedList.map((d) => ({
      title: d.title,
      summary: d.summary,
      category: d.category,
      source: d.source_name,
      age_hours: d.age_hours,
      url: d.source_url,
    })),
  });
}
