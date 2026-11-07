import re
import urllib.request
import time

with open("frontend/src/data/seedArticles.ts", "r", encoding="utf-8") as f:
    text = f.read()

urls = re.findall(r'https://images\.unsplash\.com/[^\s\'\"\`\)]+', text)
unique_urls = list(dict.fromkeys(urls))
print(f"Total unique unsplash image URLs found: {len(unique_urls)}")

broken = []
working = []

for i, url in enumerate(unique_urls):
    clean_url = url.split('&quot;')[0].rstrip('",\'`')
    try:
        req = urllib.request.Request(clean_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=8) as resp:
            if resp.status == 200:
                working.append(clean_url)
            else:
                broken.append((clean_url, resp.status))
    except Exception as e:
        broken.append((clean_url, str(e)))

print(f"\nWorking URLs: {len(working)}")
print(f"Broken URLs: {len(broken)}")
for b, err in broken:
    print(f"BROKEN: {err} -> {b}")

