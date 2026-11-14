import crypto from "crypto";

export interface RawFeedItem {
  title: string;
  summary?: string;
  url: string;
  published_at: string | Date;
  source_name: string;
  source_slug?: string;
}

export interface NormalizedBriefItem {
  title: string;
  summary: string;
  source_name: string;
  source_url: string;
  source_url_hash: string;
  published_at: string; // Validated ISO string
  age_hours: number;
}

/**
 * Strips HTML tags, decodes common entities, and collapses excessive whitespace.
 */
export function cleanText(raw?: string): string {
  if (!raw) return "";
  return raw
    .replace(/<[^>]+>/g, " ") // Strip HTML tags
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Truncates text to a maximum word count (strictly <= 40 words as per Rule 1).
 */
export function truncateWords(text: string, maxWords = 40): string {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}

/**
 * Normalizes a URL by stripping tracking parameters (UTM, ref, fbclid)
 * and generates a SHA-256 hash for database deduplication.
 */
export function canonicalizeUrl(rawUrl: string): { canonicalUrl: string; urlHash: string } {
  try {
    const urlObj = new URL(rawUrl.trim());
    // Strip common tracking parameters
    const trackingParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "fbclid",
      "gclid",
      "_ga",
      "ref",
      "source",
    ];
    for (const param of trackingParams) {
      urlObj.searchParams.delete(param);
    }
    // Remove trailing slash for consistency
    let canonical = urlObj.toString().replace(/\/$/, "");
    const hash = crypto.createHash("sha256").update(canonical).digest("hex");
    return { canonicalUrl: canonical, urlHash: hash };
  } catch {
    const clean = rawUrl.trim().split("?")[0].replace(/\/$/, "");
    const hash = crypto.createHash("sha256").update(clean).digest("hex");
    return { canonicalUrl: clean, urlHash: hash };
  }
}

/**
 * Calculates character trigrams for title similarity comparison.
 */
function getTrigrams(str: string): Set<string> {
  const normalized = "  " + str.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ") + "  ";
  const trigrams = new Set<string>();
  for (let i = 0; i < normalized.length - 2; i++) {
    trigrams.add(normalized.slice(i, i + 3));
  }
  return trigrams;
}

/**
 * Computes Trigram similarity (Sørensen–Dice coefficient) between two strings.
 * Returns value between 0.0 (completely distinct) and 1.0 (identical).
 */
export function calculateTrigramSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a.toLowerCase().trim() === b.toLowerCase().trim()) return 1.0;

  const triA = getTrigrams(a);
  const triB = getTrigrams(b);
  if (triA.size === 0 || triB.size === 0) return 0;

  let intersection = 0;
  for (const tri of triA) {
    if (triB.has(tri)) {
      intersection++;
    }
  }

  return (2.0 * intersection) / (triA.size + triB.size);
}

/**
 * Normalizes, validates, and filters a raw feed item.
 * Drops items older than 48 hours (Strict Rule 3).
 * Returns null if the item is rejected.
 */
export function normalizeFeedItem(item: RawFeedItem): NormalizedBriefItem | null {
  const cleanTitle = cleanText(item.title);
  if (!cleanTitle || cleanTitle.length < 10) return null;

  // Strict 48-Hour Freshness Check
  const pubDate = new Date(item.published_at);
  if (isNaN(pubDate.getTime())) return null;

  const now = new Date();
  const diffMs = now.getTime() - pubDate.getTime();
  const ageHours = diffMs / (1000 * 60 * 60);

  // Reject if future date beyond 2 hours or older than 48 hours
  if (ageHours < -2 || ageHours > 48) {
    return null;
  }

  const { canonicalUrl, urlHash } = canonicalizeUrl(item.url);
  if (!canonicalUrl || !canonicalUrl.startsWith("http")) return null;

  const cleanSummary = truncateWords(cleanText(item.summary || cleanTitle), 40);

  return {
    title: cleanTitle,
    summary: cleanSummary,
    source_name: cleanText(item.source_name),
    source_url: canonicalUrl,
    source_url_hash: urlHash,
    published_at: pubDate.toISOString(),
    age_hours: Math.max(0, Math.round(ageHours * 10) / 10),
  };
}

/**
 * Deduplicates an array of items by URL hash and trigram similarity (>= 0.85).
 */
export function deduplicateItems<T extends NormalizedBriefItem>(items: T[], similarityThreshold = 0.85): T[] {
  const seenHashes = new Set<string>();
  const acceptedItems: T[] = [];

  for (const item of items) {
    // 1. Exact URL Hash Check
    if (seenHashes.has(item.source_url_hash)) {
      continue;
    }

    // 2. Title Trigram Similarity Check against previously accepted items
    const isDuplicateTitle = acceptedItems.some((accepted) => {
      const sim = calculateTrigramSimilarity(accepted.title, item.title);
      return sim >= similarityThreshold;
    });

    if (isDuplicateTitle) {
      continue;
    }

    seenHashes.add(item.source_url_hash);
    acceptedItems.push(item);
  }

  return acceptedItems;
}
