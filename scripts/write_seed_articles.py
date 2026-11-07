import json

with open("scripts/ani_seed_articles_complete.json", encoding="utf-8") as f:
    articles = json.load(f)

header = """import { Article } from "@/types/news";

export const SEED_ARTICLES: Article[] = [
"""

footer = """];
"""

body = []
for art in articles:
    block = "  {\n"
    for k, v in art.items():
        if isinstance(v, (int, float)):
            block += f"    {k}: {v},\n"
        elif isinstance(v, str):
            clean_str = v.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
            block += f"    {k}: `{clean_str}`,\n"
        elif isinstance(v, bool):
            block += f"    {k}: {'true' if v else 'false'},\n"
    block += "  },"
    body.append(block)

full_ts = header + "\n".join(body) + "\n" + footer

with open("frontend/src/data/seedArticles.ts", "w", encoding="utf-8") as f:
    f.write(full_ts)

print(f"Successfully wrote {len(articles)} articles to frontend/src/data/seedArticles.ts")

