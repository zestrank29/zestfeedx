import re, json
from datetime import datetime

with open('frontend/src/data/seedArticles.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Pattern matching articles
pattern = re.compile(
    r'\{\s*id:\s*(\d+|`[^`]+`).*?'
    r'title:\s*`([^`]+)`.*?'
    r'slug:\s*`([^`]+)`.*?'
    r'category:\s*`([^`]+)`.*?'
    r'published_at:\s*`([^`]+)`.*?'
    r'image_url:\s*`([^`]+)`',
    re.DOTALL
)

matches = pattern.findall(text)
print(f"Total parsed articles: {len(matches)}")

by_cat = {}
for m in matches:
    art_id, title, slug, cat, pub_at, img_url = m
    cat = cat.lower()
    if cat not in by_cat:
        by_cat[cat] = []
    by_cat[cat].append({
        "id": art_id,
        "title": title,
        "slug": slug,
        "category": cat,
        "published_at": pub_at,
        "image_url": img_url
    })

print("\n=== LATEST ARTICLE BY CATEGORY ===")
for cat, arts in sorted(by_cat.items()):
    # Sort by published_at
    sorted_arts = sorted(arts, key=lambda a: a["published_at"], reverse=True)
    newest = sorted_arts[0]
    second = sorted_arts[1] if len(sorted_arts) > 1 else None
    print(f"\n[{cat.upper()}] Total: {len(arts)}")
    print(f"  NEWEST: {newest['published_at']} | {newest['title'][:60]}...")
    print(f"  URL: https://zestfeedx.com/article/{newest['slug']}/")
    print(f"  IMAGE: {newest['image_url'][:70]}...")
    if second:
        print(f"  PREVIOUS: {second['published_at']} | {second['title'][:60]}...")
