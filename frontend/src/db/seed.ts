import "dotenv/config";
import crypto from "crypto";
import { db, schema, isDatabaseConfigured } from "./index";
import { CATEGORIES } from "../components/Masthead";
import { DEMO_AUTHORS, ORIGINAL_ARTICLES, CURATED_BRIEFS } from "../data/demoContent";

function sha256(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export async function runSeed() {
  if (!isDatabaseConfigured || !db) {
    console.log("DATABASE_URL is not configured. Skipping live database seed.");
    return;
  }

  console.log("🌱 Starting ZestFeedX Database Seeding...");

  // 1. Seed Categories
  console.log("Seeding broadsheet categories...");
  const categoryMap = new Map<string, string>(); // slug -> id

  for (let i = 0; i < CATEGORIES.length; i++) {
    const cat = CATEGORIES[i];
    const inserted = await db
      .insert(schema.categories)
      .values({
        slug: cat.id,
        nameEn: cat.label,
        nameHi: cat.label_hi,
        description: `Verified reporting on ${cat.label} for India and diaspora readers.`,
        displayOrder: i,
      })
      .onConflictDoUpdate({
        target: schema.categories.slug,
        set: {
          nameEn: cat.label,
          nameHi: cat.label_hi,
          displayOrder: i,
        },
      })
      .returning({ id: schema.categories.id, slug: schema.categories.slug });

    if (inserted[0]) {
      categoryMap.set(inserted[0].slug, inserted[0].id);
    }
  }

  // 2. Seed Authors & Users
  console.log("Seeding editorial team...");
  const authorMap = new Map<string, string>(); // slug -> id

  for (const auth of Object.values(DEMO_AUTHORS)) {
    // Upsert User
    const user = await db
      .insert(schema.users)
      .values({
        email: auth.email || `${auth.slug}@zestfeedx.com`,
        name: auth.name,
        role: "editor",
        avatarUrl: auth.avatar,
      })
      .onConflictDoUpdate({
        target: schema.users.email,
        set: { name: auth.name, avatarUrl: auth.avatar },
      })
      .returning({ id: schema.users.id });

    const userId = user[0]?.id;

    // Upsert Author Profile
    const authorRecord = await db
      .insert(schema.authors)
      .values({
        userId,
        name: auth.name,
        slug: auth.slug,
        roleTitle: auth.role,
        bio: auth.bio,
        avatarUrl: auth.avatar,
        twitterHandle: auth.twitter,
        email: auth.email,
        isActive: true,
      })
      .onConflictDoUpdate({
        target: schema.authors.slug,
        set: {
          roleTitle: auth.role,
          bio: auth.bio,
          avatarUrl: auth.avatar,
          isActive: true,
        },
      })
      .returning({ id: schema.authors.id, slug: schema.authors.slug });

    if (authorRecord[0]) {
      authorMap.set(authorRecord[0].slug, authorRecord[0].id);
    }
  }

  // 3. Seed Feed Sources
  console.log("Seeding Tier-1, Tier-2, Tier-3 Source Adapters...");
  const sources = [
    {
      name: "Press Information Bureau (PIB)",
      slug: "pib-india",
      tier: 1,
      adapterType: "rss_scraper",
      licenseNotes: "Government of India official press releases. Fair attribution required.",
    },
    {
      name: "Reserve Bank of India (RBI)",
      slug: "rbi-bulletin",
      tier: 1,
      adapterType: "rss_scraper",
      licenseNotes: "Official central banking regulatory notifications.",
    },
    {
      name: "Central Pollution Control Board (CPCB)",
      slug: "cpcb-air",
      tier: 1,
      adapterType: "api_rest",
      licenseNotes: "National ambient air quality index live telemetry.",
    },
    {
      name: "NewsData.io Ingestion Hub",
      slug: "newsdata-io",
      tier: 2,
      adapterType: "api_rest",
      licenseNotes: "Headline, publisher name, canonical link, and timestamp only. Never store full body.",
    },
  ];

  const sourceMap = new Map<string, string>();
  for (const src of sources) {
    const inserted = await db
      .insert(schema.feedSources)
      .values(src)
      .onConflictDoUpdate({
        target: schema.feedSources.slug,
        set: { tier: src.tier, licenseNotes: src.licenseNotes },
      })
      .returning({ id: schema.feedSources.id, slug: schema.feedSources.slug });
    if (inserted[0]) {
      sourceMap.set(inserted[0].slug, inserted[0].id);
    }
  }

  // 4. Seed Original Articles
  console.log("Seeding original investigative articles...");
  for (const art of ORIGINAL_ARTICLES) {
    const authorId = authorMap.get(art.author.slug) || Array.from(authorMap.values())[0];
    const categoryId = categoryMap.get(art.category) || categoryMap.get("india") || Array.from(categoryMap.values())[0];

    if (authorId && categoryId) {
      await db
        .insert(schema.articles)
        .values({
          slug: art.slug,
          title: art.title,
          titleHi: art.title_hi,
          deck: art.deck,
          bodyMarkdown: art.content_markdown,
          categoryId,
          authorId,
          articleType: "original",
          status: "published",
          publishedAt: new Date(art.published_at),
          readingTimeMins: art.reading_time_mins,
          wordCount: art.word_count,
          heroImage: art.hero_image,
          heroImageCaption: art.hero_image_caption,
          heroImageCredit: art.hero_image_credit,
          keyTakeaways: art.key_takeaways,
          whyItMatters: art.why_it_matters,
          citations: art.citations,
          isLeadStory: Boolean(art.is_lead_story),
          isSecondaryStory: Boolean(art.is_secondary_story),
          isIndexable: true,
          relTag: "dofollow",
        })
        .onConflictDoUpdate({
          target: schema.articles.slug,
          set: {
            title: art.title,
            deck: art.deck,
            bodyMarkdown: art.content_markdown,
            keyTakeaways: art.key_takeaways,
            whyItMatters: art.why_it_matters,
            heroImage: art.hero_image,
          },
        });
    }
  }

  // 5. Seed Curated Briefs
  console.log("Seeding curated outbound briefs...");
  const defaultSourceId = sourceMap.get("newsdata-io");
  for (const brief of CURATED_BRIEFS) {
    const categoryId = categoryMap.get(brief.category) || categoryMap.get("india") || Array.from(categoryMap.values())[0];
    const urlHash = sha256(brief.source_url);

    if (categoryId) {
      await db
        .insert(schema.curatedBriefs)
        .values({
          title: brief.title,
          titleHi: brief.title_hi,
          summary: brief.summary,
          sourceName: brief.source_name,
          sourceUrl: brief.source_url,
          sourceUrlHash: urlHash,
          categoryId,
          feedSourceId: defaultSourceId,
          publishedAt: new Date(brief.published_at),
        })
        .onConflictDoUpdate({
          target: schema.curatedBriefs.sourceUrlHash,
          set: {
            title: brief.title,
            summary: brief.summary,
            publishedAt: new Date(brief.published_at),
          },
        });
    }
  }

  console.log("✅ ZestFeedX Database Seeding Completed Successfully.");
}

// Auto-run when executed directly via tsx/node
if (require.main === module) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Seed failed:", err);
      process.exit(1);
    });
}
