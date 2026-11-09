import re

with open("frontend/src/data/seedArticles.ts", "r", encoding="utf-8") as f:
    text = f.read()

imgs = re.findall(r'image_url:\s*[`"\']([^`"\']+)[`"\']', text)
titles = re.findall(r'title:\s*[`"\']([^`"\']+)[`"\']', text)
sources = re.findall(r'source_name:\s*[`"\']([^`"\']+)[`"\']', text)
source_urls = re.findall(r'source_url:\s*[`"\']([^`"\']+)[`"\']', text)

unsplash_count = sum(1 for u in imgs if "unsplash" in u)
local_count = sum(1 for u in imgs if u.startswith("/"))
cdn_count = sum(1 for u in imgs if "cloudfront" in u or "ani" in u or "toi" in u or "hindu" in u)

print(f"Total articles: {len(imgs)}")
print(f"Unsplash images: {unsplash_count}")
print(f"Local images: {local_count}")
print(f"Direct Source CDN images: {cdn_count}")
print(f"Other: {len(imgs) - unsplash_count - local_count - cdn_count}")

print("\n--- ALL ARTICLES WITH UNRELEVANT / UNPSLASH IMAGES ---")
for i in range(len(imgs)):
    if "unsplash" in imgs[i]:
        print(f"[{i+1}] {titles[i]} | Source: {sources[i]} | URL: {source_urls[i] if i < len(source_urls) else ''}")
