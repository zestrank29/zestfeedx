import re

with open('frontend/src/data/seedArticles.ts', 'r', encoding='utf-8') as f:
    text = f.read()

urls = re.findall(r'"image_url":\s*"([^"]+)"', text)
domains = {}
for u in urls:
    m = re.search(r'https?://([^/]+)', u)
    if m:
        d = m.group(1)
        domains[d] = domains.get(d, 0) + 1

print(f"Total image URLs found: {len(urls)}")
for d, count in sorted(domains.items(), key=lambda x: x[1], reverse=True):
    print(f"  {d}: {count}")
