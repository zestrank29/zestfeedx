const fs = require('fs');
const path = require('path');

const SEED_FILE = path.join(__dirname, '../frontend/src/data/seedArticles.ts');
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
  const regex = /\{\s*id:\s*(\d+),[\s\S]*?\n\s*\}(?=,|\s*\])/g;

  const entries = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    const block = match[0];
    const slugMatch = block.match(/slug:\s*[`'"]([\s\S]*?)[`'"]/);
    const titleMatch = block.match(/title:\s*[`'"]([\s\S]*?)[`'"]/);
    const dateMatch = block.match(/published_at:\s*[`'"]([\s\S]*?)[`'"]/);

    if (slugMatch && titleMatch) {
      const slug = slugMatch[1].trim();
      const title = titleMatch[1].trim().replace(/^[^\w\s]+/, '').trim();
      const pubDate = dateMatch ? toIso8601(dateMatch[1]) : new Date().toISOString();

      entries.push(`  <url>
    <loc>https://zestfeedx.com/article/${slug}/</loc>
    <news:news>
      <news:publication>
        <news:name>ZestFeedX</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(title)}</news:title>
    </news:news>
  </url>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${entries.join('\n')}
</urlset>`;

  fs.writeFileSync(OUTPUT_FILE, xml, 'utf8');
  console.log(`Successfully generated clean Google News sitemap with ${entries.length} articles to: ${OUTPUT_FILE}`);
}

run();
