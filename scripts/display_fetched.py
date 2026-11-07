import json

with open("scripts/fetched_feeds.json", encoding="utf-8") as f:
    data = json.load(f)

print("POLITICS HEADLINES:")
for idx, item in enumerate(data["politics"][:7], 1):
    print(f"{idx}. {item['title']} | Source: {item['source']}")

print("\nRAMAYANA HEADLINES:")
for idx, item in enumerate(data["ramayana"][:7], 1):
    print(f"{idx}. {item['title']} | Source: {item['source']}")

