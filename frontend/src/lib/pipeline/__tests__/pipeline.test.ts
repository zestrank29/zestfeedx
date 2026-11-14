import {
  cleanText,
  truncateWords,
  canonicalizeUrl,
  calculateTrigramSimilarity,
  normalizeFeedItem,
  deduplicateItems,
} from "../normalize";
import { classifyArticle } from "../classifier";
import { clusterStories } from "../clustering";

function runTests() {
  console.log("🧪 Running Pipeline & Normalization Test Suite...\n");
  let passed = 0;
  let failed = 0;

  function assert(desc: string, condition: boolean) {
    if (condition) {
      console.log(`  ✓ ${desc}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${desc}`);
      failed++;
    }
  }

  // 1. HTML Stripping
  const dirtyHtml = "<p>Breaking: <b>Sensex</b> jumps &amp; hits new record!</p>";
  const cleaned = cleanText(dirtyHtml);
  assert("cleanText strips HTML tags and decodes entities", cleaned === "Breaking: Sensex jumps & hits new record!");

  // 2. Max 40 Words Truncation (Strict Rule 1)
  const longText = Array(60).fill("word").join(" ");
  const truncated = truncateWords(longText, 40);
  const wordCount = truncated.replace("...", "").trim().split(/\s+/).length;
  assert("truncateWords caps at 40 words", wordCount === 40);

  // 3. Canonical URL & Hash
  const rawUrl = "https://example.com/news/modi-bastar/?utm_source=twitter&ref=share&fbclid=123";
  const { canonicalUrl, urlHash } = canonicalizeUrl(rawUrl);
  assert("canonicalizeUrl strips UTM and tracking params", canonicalUrl === "https://example.com/news/modi-bastar");
  assert("canonicalizeUrl produces 64-char SHA256 hex hash", urlHash.length === 64);

  // 4. Trigram Similarity
  const title1 = "Dimagi Naxals have taken control: PM Modi Bastar Diwali speech";
  const title2 = "Dimagi Naxals have taken control: PM Modi Bastar Diwali address";
  const titleDifferent = "Sensex falls 400 points as foreign investors exit IT stocks";

  const simHigh = calculateTrigramSimilarity(title1, title2);
  const simLow = calculateTrigramSimilarity(title1, titleDifferent);
  assert("Trigram similarity is high (>= 0.85) for minor word variations", simHigh >= 0.85);
  assert("Trigram similarity is low (< 0.2) for completely different topics", simLow < 0.2);

  // 5. 48-Hour Freshness Cutoff (Strict Rule 3)
  const recentItem = normalizeFeedItem({
    title: "Recent economic survey released by Union Finance Ministry",
    url: "https://pib.gov.in/test-recent",
    published_at: new Date(Date.now() - 10 * 3600 * 1000).toISOString(), // 10h ago
    source_name: "PIB",
  });
  const staleItem = normalizeFeedItem({
    title: "Ancient economic survey released last month",
    url: "https://pib.gov.in/test-stale",
    published_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString(), // 72h ago (> 48h)
    source_name: "PIB",
  });
  assert("Recent item (< 48h) is accepted", recentItem !== null);
  assert("Stale item (> 48h) is strictly rejected", staleItem === null);

  // 6. Classification Accuracy (Strict Rule 5: Markets vs Politics)
  const marketHeadline = "Sensex, Nifty hit fresh all-time highs as RBI pauses repo rate hikes";
  const marketCategory = classifyArticle(marketHeadline);
  assert("Market price / RBI headline strictly categorised as 'markets'", marketCategory === "markets");

  const techHeadline = "Tata Electronics and PSMC break ground on Dholera 28nm silicon foundry";
  const techCategory = classifyArticle(techHeadline);
  assert("Semiconductor / foundry headline categorised as 'tech'", techCategory === "tech");

  const aqiHeadline = "Delhi AQI stays in severe category at 410 as farm fire smoke accumulates";
  const healthCategory = classifyArticle(aqiHeadline);
  assert("AQI / pollution headline categorised as 'health'", healthCategory === "health");

  // 7. Deduplication Test
  const itemsToDedupe = [
    recentItem!,
    { ...recentItem!, source_url: "https://pib.gov.in/test-recent?utm_source=fb" }, // Duplicate URL
  ];
  const deduped = deduplicateItems(itemsToDedupe);
  assert("deduplicateItems drops duplicate URL hashes", deduped.length === 1);

  // 8. Story Clustering Test
  const clusterItems = [
    {
      title: "PM Modi addresses Diwali rally in Bastar, highlights tribal infrastructure",
      summary: "Prime minister speaks in Chhattisgarh.",
      source_name: "The Hindu",
      source_url: "https://thehindu.com/bastar-modi-1",
      source_url_hash: "hash1",
      published_at: new Date().toISOString(),
      age_hours: 1,
      category: "india",
    },
    {
      title: "Modi addresses Diwali rally in Bastar, warns of ideological extremism",
      summary: "PM Modi in Bastar.",
      source_name: "The Indian Express",
      source_url: "https://indianexpress.com/bastar-modi-2",
      source_url_hash: "hash2",
      published_at: new Date().toISOString(),
      age_hours: 2,
      category: "india",
    },
  ];
  const clusters = clusterStories(clusterItems);
  assert("clusterStories groups related multi-outlet dispatches into one cluster", clusters.length === 1);
  assert("Cluster contains both distinct news outlets", clusters[0].outlets.length === 2);
  assert("Cluster has story_count = 2", clusters[0].story_count === 2);

  console.log(`\n========================================`);
  console.log(`Result: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runTests();
