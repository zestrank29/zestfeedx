import re
import collections

with open('frontend/src/data/seedArticles.ts', encoding='utf-8') as f:
    text = f.read()

cats = collections.Counter(re.findall(r'category:\s*[`"]([^`"]+)[`"]', text))
print("Categories:", cats)
slugs = re.findall(r'slug:\s*[`"]([^`"]+)[`"]', text)
print(f"Total articles: {len(slugs)}")
print("Sample first 5 slugs:", slugs[:5])
