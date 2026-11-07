import re
from collections import Counter

with open("frontend/src/data/seedArticles.ts", "r", encoding="utf-8") as f:
    text = f.read()

categories = re.findall(r'category:\s*["\']([^"\']+)["\']', text)
print("Categories count:", Counter(categories))
print("Total articles:", len(categories))

