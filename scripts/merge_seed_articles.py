import json
import re

with open("scripts/all_new_10_articles.json", encoding="utf-8") as f:
    new_articles = json.load(f)

with open("frontend/src/data/seedArticles.ts", encoding="utf-8") as f:
    seed_content = f.read()

# Build TS objects
ts_blocks = []
for art in new_articles:
    ts_code = "  {\n"
    for key, val in art.items():
        if isinstance(val, (int, float)):
            ts_code += f"    {key}: {val},\n"
        elif isinstance(val, str):
            # Escape backticks and dollar signs if multiline
            clean_str = val.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
            ts_code += f"    {key}: `{clean_str}`,\n"
        elif isinstance(val, bool):
            ts_code += f"    {key}: {'true' if val else 'false'},\n"
    ts_code += "  },"
    ts_blocks.append(ts_code)

merged_insert = "\n".join(ts_blocks)

# Prepend inside export const SEED_ARTICLES: Article[] = [
pattern = r'(export const SEED_ARTICLES: Article\[\] = \[\s*)'
replacement = r'\1' + "\n" + merged_insert + "\n"

new_seed_content = re.sub(pattern, replacement, seed_content, count=1)

with open("frontend/src/data/seedArticles.ts", "w", encoding="utf-8") as f:
    f.write(new_seed_content)

print("Successfully merged 10 new articles into frontend/src/data/seedArticles.ts")

