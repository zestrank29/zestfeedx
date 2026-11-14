import { NextResponse } from "next/server";
import { ORIGINAL_ARTICLES } from "@/data/demoContent";
import { SEED_ARTICLES } from "@/data/seedArticles";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toIso8601(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString();
    }
  } catch {}
  return new Date().toISOString();
}

export async function GET() {
  const baseUrl = "https://zestfeedx.com";
  const now = Date.now();
  const twoDaysMs = 48 * 60 * 60 * 1000;

  // Filter articles published in the last 48 hours
  const allArticles = [
    ...ORIGINAL_ARTICLES.map((a) => ({
      slug: a.slug,
      title: a.title,
      published_at: a.published_at,
      lang: "en",
    })),
    ...SEED_ARTICLES.map((s) => ({
      slug: s.slug,
      title: s.title_en || s.title,
      published_at: s.published_at,
      lang: "en",
    })),
  ];

  const recent = allArticles.filter((a) => {
    const pub = new Date(a.published_at).getTime();
    return !isNaN(pub) && now - pub <= twoDaysMs * 7; // up to 7 days for rich initial index
  });

  const xmlEntries = recent
    .map(
      (a) => `  <url>
    <loc>${baseUrl}/article/${a.slug}/</loc>
    <news:news>
      <news:publication>
        <news:name>ZestFeedX</news:name>
        <news:language>${a.lang}</news:language>
      </news:publication>
      <news:publication_date>${toIso8601(a.published_at)}</news:publication_date>
      <news:title>${escapeXml(a.title)}</news:title>
    </news:news>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${xmlEntries}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
