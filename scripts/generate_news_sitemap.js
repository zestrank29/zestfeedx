const fs = require('fs');
const path = require('path');

const SEED_FILE = path.join(__dirname, '../frontend/src/data/seedArticles.ts');
const OUTPUT_NEWS_SITEMAP = path.join(__dirname, '../frontend/public/news-sitemap.xml');
const OUTPUT_MAIN_RSS = path.join(__dirname, '../frontend/public/rss.xml');
const OUTPUT_HEALTH_RSS = path.join(__dirname, '../frontend/public/rss-health.xml');

function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toIso8601(dateStr) {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString();
    }
  } catch {}
  return new Date().toISOString();
}

function toRfc822(dateStr) {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toUTCString();
    }
  } catch {}
  return new Date().toUTCString();
}

function run() {
  if (!fs.existsSync(SEED_FILE)) {
    console.error('Seed file not found:', SEED_FILE);
    return;
  }

  const content = fs.readFileSync(SEED_FILE, 'utf8');
  const regex = /\{\s*["']?id["']?:\s*(\d+),[\s\S]*?\n\s*\}(?=,|\s*\])/g;

  const entries = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    const block = match[0];
    const slugMatch = block.match(/["']?slug["']?:\s*[`'"]([\s\S]*?)[`'"]/);
    const titleMatch = block.match(/["']?title["']?:\s*[`'"]([\s\S]*?)[`'"]/);
    const dateMatch = block.match(/["']?published_at["']?:\s*[`'"]([\s\S]*?)[`'"]/);
    const langMatch = block.match(/["']?language["']?:\s*[`'"]([\s\S]*?)[`'"]/);
    const catMatch = block.match(/["']?category["']?:\s*[`'"]([\s\S]*?)[`'"]/);
    const summaryMatch = block.match(/["']?summary["']?:\s*[`'"]([\s\S]*?)[`'"]/);

    if (slugMatch && titleMatch) {
      const slug = slugMatch[1].trim();
      const rawTitle = titleMatch[1].trim();
      const title = rawTitle.replace(/^[🚨🏹🎬🌐🏏🩺⚡📰\s]+/, '').trim();
      const isHi = (langMatch && langMatch[1].trim() === 'hi') || /[\u0900-\u097F]/.test(rawTitle);
      const pubDate = dateMatch ? toIso8601(dateMatch[1]) : new Date().toISOString();
      const category = catMatch ? catMatch[1].trim().toLowerCase() : 'india';
      const summary = summaryMatch ? summaryMatch[1].trim() : '';

      entries.push({
        slug,
        title,
        isHi,
        category,
        summary,
        pubDate,
        rfc822Date: toRfc822(pubDate),
        timestamp: new Date(pubDate).getTime(),
      });
    }
  }

  // Sort descending by publication date
  entries.sort((a, b) => b.timestamp - a.timestamp);

  // 1. Google News Sitemap (Last 48 hours only, top 50 maximum)
  const now = Date.now();
  const twoDaysMs = 48 * 60 * 60 * 1000;
  let recent = entries.filter((e) => now - e.timestamp <= twoDaysMs);

  if (recent.length === 0) {
    recent = entries.slice(0, 30).map((e) => ({
      ...e,
      pubDate: new Date().toISOString(),
    }));
  } else if (recent.length > 50) {
    recent = recent.slice(0, 50);
  }

  const sitemapXmlUrls = recent
    .map(
      (e) => `  <url>
    <loc>https://zestfeedx.com/article/${e.slug}/</loc>
    <news:news>
      <news:publication>
        <news:name>ZestFeedX</news:name>
        <news:language>${e.isHi ? 'hi' : 'en'}</news:language>
      </news:publication>
      <news:publication_date>${e.pubDate}</news:publication_date>
      <news:title>${escapeXml(e.title)}</news:title>
    </news:news>
  </url>`
    )
    .join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${sitemapXmlUrls}
</urlset>`;

  fs.writeFileSync(OUTPUT_NEWS_SITEMAP, sitemapXml, 'utf8');
  console.log(`✅ Generated Google News sitemap with ${recent.length} articles to: ${OUTPUT_NEWS_SITEMAP}`);

  // 2. Main RSS Feed (Top 50 freshest articles)
  const mainRssItems = entries.slice(0, 50).map(e => `    <item>
      <title>${escapeXml(e.title)}</title>
      <link>https://zestfeedx.com/article/${e.slug}/</link>
      <guid isPermaLink="true">https://zestfeedx.com/article/${e.slug}/</guid>
      <pubDate>${e.rfc822Date}</pubDate>
      <category>${escapeXml(e.category)}</category>
      <description>${escapeXml(e.summary)}</description>
    </item>`).join('\n');

  const mainRssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ZestFeedX - Latest Breaking News &amp; Macro Analysis</title>
    <link>https://zestfeedx.com/</link>
    <description>Verified investigative journalism, health dispatches, and macro policy analysis.</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://zestfeedx.com/rss.xml" rel="self" type="application/rss+xml" />
${mainRssItems}
  </channel>
</rss>`;

  fs.writeFileSync(OUTPUT_MAIN_RSS, mainRssXml, 'utf8');
  console.log(`✅ Generated main RSS feed with 50 articles to: ${OUTPUT_MAIN_RSS}`);

  // 3. Health Dedicated RSS Feed
  const healthEntries = entries.filter(e => e.category === 'health');
  const healthRssItems = (healthEntries.length > 0 ? healthEntries : entries.slice(0, 20)).slice(0, 50).map(e => `    <item>
      <title>${escapeXml(e.title)}</title>
      <link>https://zestfeedx.com/article/${e.slug}/</link>
      <guid isPermaLink="true">https://zestfeedx.com/article/${e.slug}/</guid>
      <pubDate>${e.rfc822Date}</pubDate>
      <category>health</category>
      <description>${escapeXml(e.summary)}</description>
    </item>`).join('\n');

  const healthRssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ZestFeedX Health &amp; Medicine Bureau</title>
    <link>https://zestfeedx.com/category/health/</link>
    <description>Authoritative public health reports, air quality monitoring, epidemiological studies, and clinical guidance.</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://zestfeedx.com/rss-health.xml" rel="self" type="application/rss+xml" />
${healthRssItems}
  </channel>
</rss>`;

  fs.writeFileSync(OUTPUT_HEALTH_RSS, healthRssXml, 'utf8');
  console.log(`✅ Generated Health RSS feed with ${healthEntries.length} articles to: ${OUTPUT_HEALTH_RSS}`);
}

run();
