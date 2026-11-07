import json

with open("scripts/ani_full_stories.json", encoding="utf-8") as f:
    data = json.load(f)

for cat in data:
    print(f"\n=== CATEGORY: {cat.upper()} ===")
    for i, item in enumerate(data[cat][:5], 1):
        print(f"{i}. {item['title'][:70]}...")
        print(f"   Link: {item['link']}")
        print(f"   Img:  {item['img_thumb']}")

