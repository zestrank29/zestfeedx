const https = require('https');
const fs = require('fs');
const path = require('path');

const SEED_FILE = path.join(__dirname, '../frontend/src/data/seedArticles.ts');
const HOST = 'zestfeedx.com';
const INDEXNOW_KEY = '3c6e94f8a12948bb95d0df8a8c91a0b3';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

// 1. Ping Google and Bing sitemap endpoints
function pingSitemap(engine, pingUrl) {
  return new Promise((resolve) => {
    https.get(pingUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`[${engine} Ping] Status: ${res.statusCode} | URL: ${pingUrl}`);
        resolve({ engine, status: res.statusCode });
      });
    }).on('error', (err) => {
      console.warn(`[${engine} Ping Failed] ${err.message}`);
      resolve({ engine, status: 'error', error: err.message });
    });
  });
}

// 2. Submit URLs to IndexNow (Bing, Yandex, Seznam, Naver)
function submitToIndexNow(urls) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls
    });

    const options = {
      hostname: 'www.bing.com',
      port: 443,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let respData = '';
      res.on('data', chunk => respData += chunk);
      res.on('end', () => {
        console.log(`[IndexNow Submission] Status: ${res.statusCode} (Submitted ${urls.length} URLs for instant indexing)`);
        resolve({ status: res.statusCode, data: respData });
      });
    });

    req.on('error', (e) => {
      console.warn(`[IndexNow Error] ${e.message}`);
      resolve({ status: 'error', error: e.message });
    });

    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log("==================================================");
  console.log("🚀 INITIATING AUTOMATED SEARCH CONSOLE & ENGINE SUBMISSION");
  console.log("==================================================");

  // Read URLs from seedArticles
  const raw = fs.readFileSync(SEED_FILE, 'utf8');
  const slugRegex = /slug:\s*[`'"]([^`'"]+)[`'"]/g;
  const urls = [
    `https://${HOST}/`,
    `https://${HOST}/en/`,
    `https://${HOST}/hi/`,
    `https://${HOST}/explainers/`,
    `https://${HOST}/category/markets/`,
    `https://${HOST}/category/tech/`,
    `https://${HOST}/category/india/`,
    `https://${HOST}/category/world/`,
    `https://${HOST}/category/health/`,
    `https://${HOST}/category/sports/`,
    `https://${HOST}/category/entertainment/`,
    `https://${HOST}/category/ramayana/`,
    `https://${HOST}/topic/delhi-aqi/`,
    `https://${HOST}/data/gold-silver-price-india/`,
    `https://${HOST}/data/petrol-diesel-price-india/`
  ];

  let match;
  while ((match = slugRegex.exec(raw)) !== null) {
    urls.push(`https://${HOST}/article/${match[1]}/`);
  }

  console.log(`Discovered ${urls.length} total URLs to submit.`);

  // 1. Google Search Console sitemap pings
  console.log("\n📡 Pinging Google Search Console Sitemaps...");
  await pingSitemap('Google (Main Sitemap)', `https://www.google.com/ping?sitemap=https://${HOST}/sitemap.xml`);
  await pingSitemap('Google (News Sitemap)', `https://www.google.com/ping?sitemap=https://${HOST}/news-sitemap.xml`);

  // 2. Bing / Yahoo sitemap pings
  console.log("\n📡 Pinging Microsoft Bing Sitemaps...");
  await pingSitemap('Bing (Main Sitemap)', `https://www.bing.com/ping?sitemap=https://${HOST}/sitemap.xml`);
  await pingSitemap('Bing (News Sitemap)', `https://www.bing.com/ping?sitemap=https://${HOST}/news-sitemap.xml`);

  // 3. IndexNow real-time push
  console.log("\n⚡ Submitting URLs to IndexNow Protocol for Instant Crawl...");
  // IndexNow accepts batches up to 10,000 URLs
  await submitToIndexNow(urls.slice(0, 500));

  console.log("\n✅ Automated Search Console & Engine submission completed successfully!");
}

main();
