import re

with open('frontend/src/data/seedArticles.ts', encoding='utf-8') as f:
    text = f.read()

# find first article definition
match = re.search(r'export const SEED_ARTICLES: Article\[\] = \[\s*\{([^}]+)\}', text)
if match:
    print("First article sample fields:")
    for line in match.group(1).splitlines()[:20]:
        print(line)

