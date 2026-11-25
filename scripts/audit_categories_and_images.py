import re, json, urllib.request, ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Read seedArticles.ts
with open('frontend/src/data/seedArticles.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Match objects or extract using regex
# We can parse the array or extract fields
articles = []
pattern = re.compile(r'\{\s*"id":\s*(\d+|"[^"]+"),\s*"title":\s*"([^"]+)",\s*"slug":\s*"([^"]+)"', re.DOTALL)

# Let's inspect the first 20 articles and their published_at, category, image_url
print("Analyzing seed articles...")
cat_articles = {}
category_pattern = re.compile(r'\{\s*"id":\s*(\d+|"[^"]+").*?"title":\s*"([^"]+)".*?"slug":\s*"([^"]+)".*?"published_at":\s*"([^"]+)".*?"category":\s*"([^"]+)".*?"image_url":\s*"([^"]+)"', re.DOTALL)

# Let's run a python script to parse seedArticles.ts properly
with open('frontend/src/data/seedArticles.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract SEED_ARTICLES JSON-like structure
start = content.find('export const SEED_ARTICLES: SeedArticle[] = [')
if start != -1:
    content = content[start + len('export const SEED_ARTICLES: SeedArticle[] = ['):]
    end = content.rfind('];')
    if end != -1:
        content = content[:end]

# Split by top-level object separation
blocks = content.split('\n  {\n')
print(f"Total article blocks identified: {len(blocks)}")

parsed_articles = []
for b in blocks:
    def get_field(field):
        m = re.search(r'"' + field + r'":\s*("([^"\\]*(\\.[^"\\]*)*)"|(\d+)|true|false)', b)
        if m:
            val = m.group(1)
            if val.startswith('"') and val.endswith('"'):
                return val[1:-1].replace('\\"', '"').replace('\\n', '\n')
            return val
        return None

    slug = get_field('slug')
    if not slug:
        continue
    parsed_articles.append({
        'id': get_field('id'),
        'title': get_field('title'),
        'slug': slug,
        'category': (get_field('category') or 'india').lower(),
        'published_at': get_field('published_at'),
        'image_url': get_field('image_url'),
        'image_alt': get_field('image_alt'),
        'is_preview': get_field('is_preview'),
        'event_date': get_field('event_date')
    })

print(f"Successfully parsed {len(parsed_articles)} articles.")

# Group by category
by_cat = {}
for a in parsed_articles:
    cat = a['category']
    if cat not in by_cat:
        by_cat[cat] = []
    by_cat[cat].append(a)

for cat, items in sorted(by_cat.items()):
    # Find newest by published_at
    sorted_by_pub = sorted(items, key=lambda x: str(x['published_at']), reverse=True)
    newest = sorted_by_pub[0] if sorted_by_pub else None
    first_in_array = items[0] if items else None
    print(f"\nCategory: '{cat}' (Total in DB: {len(items)})")
    if newest:
        print(f"  Newest published_at: {newest['published_at']} | Title: {newest['title'][:60]}... | Slug: {newest['slug']}")
        print(f"  First in array:      {first_in_array['published_at']} | Title: {first_in_array['title'][:60]}... | Slug: {first_in_array['slug']}")
        print(f"  Hero Image: {newest['image_url']}")
