const https = require('https');

const checks = [
  { url: 'https://zestfeedx.com/editorial-policy/', pattern: 'id="ai-disclosure"' },
  { url: 'https://zestfeedx.com/fact-check/', pattern: 'id="corrections"' },
  { url: 'https://zestfeedx.com/advertise/', pattern: 'id="sponsored-posts"' },
  { url: 'https://zestfeedx.com/contact/', pattern: 'id="newsletter"' },
  { url: 'https://zestfeedx.com/article/pm-modi-diwali-bastar-tribal-corridor-security/', pattern: 'news@zestfeedx.com' },
  { url: 'https://zestfeedx.com/article/pm-modi-diwali-bastar-tribal-corridor-security/', pattern: 'AI Instant Summary &amp; Key Highlights' },
  { url: 'https://zestfeedx.com/article/pm-modi-diwali-bastar-tribal-corridor-security/', pattern: 'Photo Source:' },
  { url: 'https://zestfeedx.com/article/pm-modi-diwali-bastar-tribal-corridor-security/', pattern: 'reading now' },
  { url: 'https://zestfeedx.com/category/markets/', pattern: 'Markets' },
  { url: 'https://zestfeedx.com/category/tech/', pattern: 'Technology' },
];

async function run() {
  for (const c of checks) {
    await new Promise((resolve) => {
      https.get(c.url, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          const found = body.includes(c.pattern);
          console.log(`[${found ? 'PASS' : 'FAIL'}] ${c.url} -> contains "${c.pattern}" (Status: ${res.statusCode})`);
          resolve();
        });
      }).on('error', (err) => {
        console.error(`[ERROR] ${c.url}: ${err.message}`);
        resolve();
      });
    });
  }
}

run();
