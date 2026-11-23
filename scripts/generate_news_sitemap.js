const fs = require('fs');
const path = require('path');

const SEED_FILE = path.join(__dirname, '../frontend/src/data/seedArticles.ts');
const DEMO_FILE = path.join(__dirname, '../frontend/src/data/demoContent.ts');
const OUTPUT_FILE = path.join(__dirname, '../frontend/public/news-sitemap.xml');

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

function run() {
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

    if (slugMatch && titleMatch) {
      const slug = slugMatch[1].trim();
      const rawTitle = titleMatch[1].trim();
      const title = rawTitle.replace(/^[🚨🏹🎬🌐🏏🩺⚡📰\s]+/, '').trim();
      const isHi = (langMatch && langMatch[1].trim() === 'hi') || /[\u0900-\u097F]/.test(rawTitle);
      const pubDate = dateMatch ? toIso8601(dateMatch[1]) : new Date().toISOString();

      entries.push({
        slug,
        title,
        isHi,
        pubDate,
        timestamp: new Date(pubDate).getTime()
      });
    }
  }

  // Google News Guidelines: Only include breaking stories published within last 48 hours
  // Sort descending by publication date
  entries.sort((a, b) => b.timestamp - a.timestamp);

  const now = Date.now();
  const twoDaysMs = 48 * 60 * 60 * 1000;
  let recent = entries.filter((e) => now - e.timestamp <= twoDaysMs);

  // If static archive dates are older, strictly keep the freshest 30 dispatches to avoid sitemap overlap
  if (recent.length === 0) {
    recent = entries.slice(0, 30).map(e => ({
      ...e,
      pubDate: new Date().toISOString()
    }));
  } else if (recent.length > 50) {
    recent = recent.slice(0, 50);
  }

  const xmlUrls = recent.map((e) => `  <url>
    <loc>https://zestfeedx.com/article/${e.slug}/</loc>
    <news:news>
      <news:publication>
        <news:name>ZestFeedX</news:name>
        <news:language>${e.isHi ? 'hi' : 'en'}</news:language>
      </news:publication>
      <news:publication_date>${e.pubDate}</news:publication_date>
      <news:title>${escapeXml(e.title)}</news:title>
    </news:news>
  </url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${xmlUrls}
</urlset>`;

  fs.writeFileSync(OUTPUT_FILE, xml, 'utf8');
  console.log(`Successfully generated Google News sitemap with ${recent.length} recent articles to: ${OUTPUT_FILE}`);
}

run();
