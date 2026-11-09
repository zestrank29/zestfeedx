import os
import re
import html
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEED_FILE = os.path.join(BASE_DIR, "frontend", "src", "data", "seedArticles.ts")
PUBLIC_DIR = os.path.join(BASE_DIR, "frontend", "public")
GN_DIR = os.path.join(PUBLIC_DIR, "google-news")
os.makedirs(GN_DIR, exist_ok=True)

def parse_articles():
    with open(SEED_FILE, "r", encoding="utf-8") as f:
        text = f.read()

    # Split into object blocks
    # Each article object starts with { and has an id
    raw_blocks = re.split(r'\n\s*\{\s*\n\s*id:\s*', text)
    articles = []

    for block in raw_blocks[1:]:
        def extract(field, default=""):
            m = re.search(rf'{field}:\s*([\"\'`])(.*?)\1', block, re.DOTALL)
            return m.group(2).strip() if m else default

        slug = extract('slug')
        if not slug:
            continue

        raw_title = extract('title_en') or extract('title')
        # Decode unicode escapes like \ud83d\udea8 if present
        try:
            title = raw_title.encode('utf-8').decode('unicode_escape')
        except Exception:
            title = raw_title
        # Remove leading emojis from news title for clean indexing
        clean_title = re.sub(r'^[\U00010000-\U0010ffff\u2600-\u27bf\ud800-\udbff\udc00-\udfff\s]+', '', title).strip()
        if not clean_title:
            clean_title = title

        category = extract('category', "general")
        summary = extract('summary_en') or extract('summary')
        pub_at = extract('published_at', "2026-11-06T08:00:00Z")
        img_url = extract('image_url')
        img_alt = extract('image_alt', clean_title)
        author = extract('author_name', "Pankhudi Sharma")

        # extract content
        content_match = re.search(r'content_en:\s*`([^`]+)`', block, re.DOTALL)
        if not content_match:
            content_match = re.search(r'content:\s*`([^`]+)`', block, re.DOTALL)
        content = content_match.group(1).strip() if content_match else summary

        articles.append({
            "slug": slug,
            "title": clean_title,
            "raw_title": title,
            "category": category,
            "summary": summary,
            "published_at": pub_at,
            "image_url": img_url,
            "image_alt": img_alt,
            "author": author,
            "content": content
        })

    return articles

def generate_news_sitemap(articles):
    # Google News sitemap standard (XML with <news:news>) - strictly recent breaking dispatches (< 48 hours)
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
    ]

    # Only include latest 25 recent breaking articles to prevent duplicate sitemap collisions
    recent_news = articles[:25]
    for art in recent_news:
        url = f"https://zestfeedx.com/article/{art['slug']}/"
        # Format date for W3C / ISO8601
        date_str = art['published_at']
        escaped_title = html.escape(art['title'])
        lines.append('  <url>')
        lines.append(f'    <loc>{url}</loc>')
        lines.append('    <news:news>')
        lines.append('      <news:publication>')
        lines.append('        <news:name>ZestFeedX</news:name>')
        lines.append('        <news:language>en</news:language>')
        lines.append('      </news:publication>')
        lines.append(f'      <news:publication_date>{date_str}</news:publication_date>')
        lines.append(f'      <news:title>{escaped_title}</news:title>')
        lines.append('    </news:news>')
        lines.append('  </url>')

    lines.append('</urlset>')
    output_path = os.path.join(PUBLIC_DIR, "news-sitemap.xml")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"Generated {output_path} with {len(recent_news)} entries.")

def format_rfc822(dt_str):
    try:
        # e.g. 2026-11-04T08:30:00Z
        clean = dt_str.replace("Z", "+00:00")
        dt = datetime.fromisoformat(clean)
    except Exception:
        dt = datetime.utcnow()
    return dt.strftime("%a, %d %b %Y %H:%M:%S +0000")

def generate_rss_xml(articles, filename="rss.xml", filter_category=None, feed_title="ZestFeedX - Breaking News & Investigative Reports"):
    filtered = [a for a in articles if filter_category is None or a["category"] == filter_category]
    now_rfc = datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S +0000")

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">',
        '  <channel>',
        f'    <title>{html.escape(feed_title)}</title>',
        '    <link>https://zestfeedx.com/</link>',
        f'    <atom:link href="https://zestfeedx.com/{filename}" rel="self" type="application/rss+xml" />',
        '    <description>Automated High-Impact Long-Form Journalism, Fact-Checked News, and Global Investigative Reports by Pankhudi Sharma.</description>',
        '    <language>en-in</language>',
        '    <managingEditor>news@zestfeedx.com (Pankhudi Sharma)</managingEditor>',
        '    <webMaster>news@zestfeedx.com (ZestFeedX Editorial Desk)</webMaster>',
        f'    <lastBuildDate>{now_rfc}</lastBuildDate>',
        '    <docs>https://cyber.harvard.edu/rss/rss.html</docs>',
        '    <image>',
        '      <url>https://zestfeedx.com/google-news/square-logo-512.png</url>',
        '      <title>ZestFeedX</title>',
        '      <link>https://zestfeedx.com/</link>',
        '    </image>',
    ]

    for art in filtered:
        url = f"https://zestfeedx.com/article/{art['slug']}/"
        rfc_date = format_rfc822(art['published_at'])
        escaped_title = html.escape(art['title'])
        escaped_desc = html.escape(art['summary'])
        content_html = f"<![CDATA[<div><img src=\"{art['image_url']}\" alt=\"{html.escape(art['image_alt'])}\" /><p>{art['summary']}</p>{art['content']}</div>]]>"

        lines.append('    <item>')
        lines.append(f'      <title>{escaped_title}</title>')
        lines.append(f'      <link>{url}</link>')
        lines.append(f'      <guid isPermaLink="true">{url}</guid>')
        lines.append(f'      <pubDate>{rfc_date}</pubDate>')
        lines.append(f'      <dc:creator>{html.escape(art["author"])}</dc:creator>')
        lines.append(f'      <category>{html.escape(art["category"].title())}</category>')
        lines.append(f'      <description>{escaped_desc}</description>')
        lines.append(f'      <content:encoded>{content_html}</content:encoded>')
        if art['image_url']:
            lines.append(f'      <enclosure url="{art["image_url"]}" type="image/jpeg" length="150000" />')
            lines.append(f'      <media:content url="{art["image_url"]}" medium="image">')
            lines.append(f'        <media:title>{escaped_title}</media:title>')
            lines.append('      </media:content>')
        lines.append('    </item>')

    lines.append('  </channel>')
    lines.append('</rss>')

    out_path = os.path.join(PUBLIC_DIR, filename)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"Generated {out_path} with {len(filtered)} items.")

def generate_brand_logos():
    # 1. Square Logo (512x512) for Google News Publisher Center
    # Requirement: 512x512 PNG, high contrast, branded emblem
    sq = Image.new("RGBA", (512, 512), (15, 23, 42, 255)) # Dark navy slate #0f172a
    draw = ImageDraw.Draw(sq)

    # Outer subtle rounded ring
    draw.rounded_rectangle([16, 16, 496, 496], radius=48, outline=(30, 41, 59, 255), width=4)
    # Inner accent dot (red)
    draw.ellipse([236, 120, 276, 160], fill=(220, 38, 38, 255))

    # Bold typography for "ZF"
    try:
        font_large = ImageFont.truetype("arialbd.ttf", 160)
        font_sub = ImageFont.truetype("arialbd.ttf", 36)
    except Exception:
        font_large = ImageFont.load_default()
        font_sub = ImageFont.load_default()

    draw.text((256, 260), "ZF", fill=(255, 255, 255, 255), anchor="mm", font=font_large)
    draw.text((256, 380), "ZESTFEEDX", fill=(226, 232, 240, 255), anchor="mm", font=font_sub)

    sq_path = os.path.join(GN_DIR, "square-logo-512.png")
    sq.save(sq_path, "PNG")
    print(f"Saved square logo: {sq_path}")

    # 2. Wide Logo (Dark Theme - White Text on Transparent Background)
    # Recommended: 400x60, transparent
    wide_dark = Image.new("RGBA", (400, 60), (0, 0, 0, 0))
    d_draw = ImageDraw.Draw(wide_dark)
    try:
        font_wide = ImageFont.truetype("georgiab.ttf", 34)
    except Exception:
        font_wide = ImageFont.load_default()

    # Red accent circle
    d_draw.ellipse([20, 22, 36, 38], fill=(220, 38, 38, 255))
    d_draw.text((50, 30), "ZESTFEEDX", fill=(255, 255, 255, 255), anchor="lm", font=font_wide)
    wide_dark_path = os.path.join(GN_DIR, "wide-logo-dark.png")
    wide_dark.save(wide_dark_path, "PNG")
    print(f"Saved wide logo dark: {wide_dark_path}")

    # 3. Wide Logo (Light Theme - Dark Slate Text on Transparent Background)
    wide_light = Image.new("RGBA", (400, 60), (0, 0, 0, 0))
    l_draw = ImageDraw.Draw(wide_light)
    l_draw.ellipse([20, 22, 36, 38], fill=(220, 38, 38, 255))
    l_draw.text((50, 30), "ZESTFEEDX", fill=(15, 23, 42, 255), anchor="lm", font=font_wide)
    wide_light_path = os.path.join(GN_DIR, "wide-logo-light.png")
    wide_light.save(wide_light_path, "PNG")
    print(f"Saved wide logo light: {wide_light_path}")

def main():
    articles = parse_articles()
    print(f"Parsed {len(articles)} articles from seed data.")
    generate_news_sitemap(articles)
    generate_rss_xml(articles, "rss.xml", None, "ZestFeedX - Main Editorial Newsfeed")
    generate_rss_xml(articles, "rss-politics.xml", "politics", "ZestFeedX Politics - National & Governance Wire")
    generate_rss_xml(articles, "rss-ramayana.xml", "ramayana", "ZestFeedX Culture - Ramayana & Sacred Heritage Wire")
    generate_rss_xml(articles, "rss-culture.xml", "ramayana", "ZestFeedX Culture - Ramayana & Sacred Heritage Wire")
    generate_rss_xml(articles, "rss-tech.xml", "tech", "ZestFeedX AI & Tech - Deep Tech & Frontier AI")
    generate_rss_xml(articles, "rss-health.xml", "health", "ZestFeedX Health & Medicine - Clinical & Wellness Wire")
    generate_rss_xml(articles, "rss-business.xml", "business", "ZestFeedX Business & Economy - Markets & Finance")
    generate_rss_xml(articles, "rss-sports.xml", "sports", "ZestFeedX Sports - Cricket & Athletics")
    generate_rss_xml(articles, "rss-entertainment.xml", "entertainment", "ZestFeedX Entertainment - Cinema & Media")
    generate_rss_xml(articles, "rss-world.xml", "world", "ZestFeedX World - Global Geopolitics & Foreign Affairs")
    generate_rss_xml(articles, "rss-science.xml", "science", "ZestFeedX Science - Space Exploration & Research")
    generate_rss_xml(articles, "rss-food.xml", "food", "ZestFeedX Food & Cuisine - Gastronomy & Nutrition")
    generate_brand_logos()
    print("Google News feeds and assets successfully generated!")

if __name__ == "__main__":
    main()
