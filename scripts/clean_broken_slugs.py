import re

with open("frontend/src/data/seedArticles.ts", "r", encoding="utf-8") as f:
    content = f.read()

blocks = re.findall(r'(\{\s*id:\s*\d+,.*?\}\s*,)', content, re.DOTALL)
new_content = content
fixed_count = 0

for b in blocks:
    slug_m = re.search(r'slug:\s*[`\'\"]([^`\'\"]+)[`\'\"]', b)
    if not slug_m:
        continue
    slug = slug_m.group(1)
    
    # If slug is broken (e.g., starts with '-' or is just '-2026')
    if slug.startswith("-") or slug == "2026" or len(slug.replace("-", "").replace("2026", "")) < 3:
        id_m = re.search(r'id:\s*(\d+)', b)
        cat_m = re.search(r'category:\s*[`\'\"]([^`\'\"]+)[`\'\"]', b)
        art_id = id_m.group(1) if id_m else "0"
        cat = cat_m.group(1) if cat_m else "news"
        
        new_slug = f"{cat}-breaking-dispatch-{art_id}-2026"
        new_b = re.sub(r'slug:\s*[`\'\"][^`\'\"]+[`\'\"]', f'slug: `{new_slug}`', b)
        new_content = new_content.replace(b, new_b)
        fixed_count += 1
        print(f"Fixed broken slug: '{slug}' -> '{new_slug}'")

if fixed_count > 0:
    with open("frontend/src/data/seedArticles.ts", "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Successfully fixed {fixed_count} broken slugs in seedArticles.ts!")
else:
    print("No broken slugs found.")
