import json
import urllib.request

with open("scripts/ani_full_stories.json", encoding="utf-8") as f:
    data = json.load(f)

for cat in data:
    first_story = data[cat][0]
    img = first_story['img_thumb']
    try:
        req = urllib.request.Request(img, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            print(f"[{cat}] Image OK ({resp.status}): {first_story['title'][:50]} -> {img[:60]}...")
    except Exception as e:
        print(f"[{cat}] Image FAIL: {e}")

