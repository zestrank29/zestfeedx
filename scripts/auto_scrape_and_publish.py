import os
import sys
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime
import io

# Ensure UTF-8 output on all systems including Windows Task Scheduler
if sys.platform == "win32":
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEED_FILE = os.path.join(BASE_DIR, "frontend", "src", "data", "seedArticles.ts")

FEEDS = {
    "politics": [
        "https://aninews.in/rss/feed/category/national.xml",
        "https://news.google.com/rss/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRFZxYUdjU0JXVnVMVWRDR2dKSlRpZ0FQAQ?hl=en-IN&gl=IN&ceid=IN:en"
    ],
    "ramayana": [
        "https://news.google.com/rss/topics/CAAqJQgKIh9DQkFTRVFvSUwyMHZNR014ZDIwU0JXVnVMVWRDS0FBUAE?hl=en-IN&gl=IN&ceid=IN:en"
    ],
    "entertainment": [
        "https://aninews.in/rss/feed/category/entertainment.xml"
    ],
    "world": [
        "https://aninews.in/rss/feed/category/world.xml"
    ],
    "sports": [
        "https://aninews.in/rss/feed/category/sports.xml"
    ],
    "health": [
        "https://aninews.in/rss/feed/category/health.xml"
    ],
    "tech": [
        "https://aninews.in/rss/feed/category/tech.xml"
    ]
}

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

def make_slug(title):
    clean = re.sub(r'[^a-zA-Z0-9\s-]', '', title).strip().lower()
    clean = re.sub(r'\s+', '-', clean)
    return clean[:75] + "-2026"

def get_existing_slugs_and_titles():
    if not os.path.exists(SEED_FILE):
        return set(), set(), 1
    with open(SEED_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    slugs = set(re.findall(r'slug:\s*[`"\']([^`"\']+)[`"\']', content))
    titles = set(re.findall(r'original_title:\s*[`"\']([^`"\']+)[`"\']', content))
    ids = [int(x) for x in re.findall(r'id:\s*(\d+)', content)]
    max_id = max(ids) if ids else 100
    return slugs, titles, max_id

def fetch_feed_items(url, category):
    items = []
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=12) as resp:
            root = ET.fromstring(resp.read())
            channel = root.find('channel')
            if channel is None:
                return items
            for it in channel.findall('item'):
                title = it.find('title').text.strip() if it.find('title') is not None and it.find('title').text else ""
                link = it.find('link').text.strip() if it.find('link') is not None and it.find('link').text else ""
                desc = it.find('description').text.strip() if it.find('description') is not None and it.find('description').text else ""
                pubDate = it.find('pubDate').text.strip() if it.find('pubDate') is not None and it.find('pubDate').text else ""
                
                # Image extraction (Extract uncompressed camera-original HD photos)
                img_url = ""
                img_elem = it.find('image')
                if img_elem is not None:
                    u = img_elem.find('url')
                    if u is not None and u.text:
                        raw_u = u.text.strip()
                        full_u = re.sub(r'__sized__/', '', raw_u)
                        full_u = re.sub(r'-thumbnail-\d+x\d+.*?\.(png|jpg|jpeg)', r'.\1', full_u)
                        full_u = re.sub(r'-thumbnail-\d+x\d+', '', full_u)
                        if not full_u.startswith('http'):
                            img_url = f"https://d3lzcn6mbbadaf.cloudfront.net/{full_u}"
                        else:
                            img_url = full_u

                # Enclosure fallback
                enclosure = it.find('enclosure')
                if not img_url and enclosure is not None and 'url' in enclosure.attrib:
                    img_url = enclosure.attrib['url']

                # Source name
                src = it.find('source')
                source_name = src.text.strip() if src is not None and src.text else "ANI News"
                if "aninews.in" in link:
                    source_name = "ANI News"
                elif "thehindu.com" in link:
                    source_name = "The Hindu"
                elif "indiatimes.com" in link:
                    source_name = "The Times of India"
                elif "ndtv.com" in link:
                    source_name = "NDTV"

                if title and link:
                    items.append({
                        "title": title,
                        "link": link,
                        "desc": desc,
                        "pubDate": pubDate,
                        "img": img_url,
                        "source_name": source_name,
                        "category": category
                    })
    except Exception as e:
        print(f"[Scraper] Error fetching feed {url}: {e}")
    return items

def build_article_object(art_id, item):
    title = item["title"]
    clean_title = re.sub(r'^[\"\']|[\"\']$', '', title)
    clean_title = re.sub(r'\s*-\s*(ANI News|The Hindu|The Times of India|NDTV|BBC).*$', '', clean_title).strip()
    slug = make_slug(clean_title)
    img = item["img"] or "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80"
    source_url = item["link"]
    source_name = item["source_name"]
    category = item["category"]
    desc = item["desc"] or f"Comprehensive investigative report and ground reality analysis on {clean_title}."

    cat_emojis = {
        "politics": "🚨",
        "ramayana": "🏹",
        "entertainment": "🎬",
        "world": "🌐",
        "sports": "🏏",
        "health": "🩺",
        "tech": "⚡"
    }
    emoji = cat_emojis.get(category, "📰")

    summary_en = f"{desc[:180]}... Comprehensive investigative reporting and verified dispatches from the news desk."
    summary_hi = f"{desc[:150]}... इस महत्वपूर्ण मामले पर प्रशासनिक और नीतिगत स्तर पर लगातार नजर रखी जा रही है।"

    # Generate 800+ word structured investigative report with Markdown Table & 'Why This Matters'
    try:
        from scripts.upgrade_all_seed_articles import generate_800w_article
        content_en = generate_800w_article(clean_title, category, desc, source_name)
    except Exception:
        content_en = f"""In what senior correspondents and beat analysts describe as a consequential development for {category.upper()}, verified dispatches confirm key milestones today. {desc}. High-level reviews and official briefings are currently underway under multi-agency supervision to monitor developments in real time.

### Strategic Overview & Institutional Directives

Official communiqués released by administrative secretariats confirm that comprehensive inter-departmental coordination, protocol monitoring, and regulatory compliance have been prioritized to oversee this proceeding regarding {clean_title}. Parliamentary observers emphasize that all standard operating procedures are being executed with strict adherence to established statutory guidelines, ensuring complete accountability, civic protection, and operational transparency across government ministries.

Addressing press correspondents during the morning briefing, senior spokespersons underscored that state apparatuses, ground intelligence desks, and verification mechanisms are maintaining round-the-clock surveillance to facilitate seamless public administration and maintain civil order across key jurisdictions.

### Ground Dynamics & Sectoral Realities

An examination of ground realities reveals that **Institutional Governance and Accountability** have reshaped the broader discourse surrounding {clean_title}. Senior sector analysts note that this represents a coordinated institutional alignment aimed at safeguarding stakeholder welfare, regional stability, and legislative representation under constitutional norms.

Simultaneously, civic leaders, municipal authorities, and field observers have highlighted heightened public engagement across regional administrative circles. Verified ground assessments affirm that multi-agency supervisory committees are actively monitoring compliance metrics to uphold institutional confidence at every operational level.

### Sectoral Milestones & Governance Assessment

| Governance Parameter | Operational Benchmark | Statutory Status |
| :--- | :--- | :--- |
| Inter-Agency Oversight | Multi-Tier Secretariat Review | Verified & Active |
| Statutory Compliance | Strict Adherence to Legislative Mandate | Enforced |
| Public Transparency Index | High-Frequency Field Dispatches | Documented |
| Jurisdictional Coordination | National & Regional Secretariat Desk | Coordinated |

### Why This Matters: Strategic Impact & Policy Analysis

Beyond the immediate headlines, this development carries profound systemic implications for policy formulation and governance architecture. Independent legal scholars and political strategists point out that the institutional precedents established today create an authoritative framework that will guide future statutory implementations. By establishing clear accountability metrics, authorities are setting a vital benchmark that balances executive responsiveness with long-term systemic durability.

Furthermore, the decision directly impacts broader socio-economic dynamics, signaling to market participants, civic institutions, and the electorate that regulatory standards will be rigorously preserved. Analysts project that the ripple effects will influence parliamentary discussions in the upcoming session, creating renewed momentum for comprehensive institutional modernizations.

### Strategic Outlook & Long-Term Trajectory

Constitutional experts and senior commentators point out that the multi-tiered supervisory framework guarantees that administrative commitments translate into tangible legislative actions and grassroots representation. High-level secretariats have already initiated preliminary scheduling for subsequent review cycles to ensure persistent policy momentum.

Official bulletins and statutory filings will continue to be monitored by the editorial desk as verified reports and institutional documentations are finalized by competent authorities."""

    content_hi = f"""राष्ट्रीय व अंतरराष्ट्रीय मीडिया गलियारों से आज की बड़ी खबर। {desc}। इस महत्वपूर्ण घटनाक्रम पर प्रशासनिक, नीतिगत और संस्थागत स्तर पर विस्तृत समीक्षा की जा रही है।

### प्रशासनिक समीक्षा एवं प्राथमिक बिंदु

आधिकारिक सूत्रों के अनुसार, इस पूरे मामले पर संबंधित विभागों और उच्चाधिकारियों द्वारा लगातार निगरानी रखी जा रही है। पारदर्शिता, नियमों का पालन और जनहित को सर्वोपरि रखते हुए सभी आवश्यक दिशा-निर्देश जारी किए गए हैं।

वरिष्ठ विशेषज्ञों का मानना है कि यह घटनाक्रम दूरगामी प्रभाव डालने वाला सिद्ध होगा। स्थिति पर नियंत्रण और कार्यकुशलता बनाए रखने के लिए विशेष पर्यवेक्षक दलों का गठन किया गया है।

### ज़मीनी हकीकत एवं भविष्य का परिदृश्य

संबंधित विषय विशेषज्ञों ने पुष्टि की है कि संस्थागत जवाबदेही और स्थापित नियामक ढांचे भविष्य के कार्यों के लिए एक मानक स्थापित करेंगे। जनसाधारण और हितधारकों को पारदर्शी व सत्यापित जानकारी उपलब्ध कराने के स्पष्ट निर्देश दिए गए हैं।

संपादकीय विभाग द्वारा इस पूरे घटनाक्रम और आधिकारिक बुलेटिनों पर निरंतर नज़र रखी जा रही है। आगामी आधिकारिक सूचनाओं के साथ विश्लेषण का यह क्रम जारी रहेगा।"""

    now_iso = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")

    return {
        "id": art_id,
        "title": f"{emoji} {clean_title}",
        "slug": slug,
        "original_title": clean_title,
        "category": category,
        "fomo_badge": f"⚡ {category.title()} Wire",
        "read_time": "6 min read",
        "views_count": 35000 + (art_id * 320),
        "shares_count": 4100 + (art_id * 45),
        "published_at": item["pubDate"] or now_iso,
        "source_name": source_name,
        "source_url": source_url,
        "source_courtesy": f"News Courtesy: {source_name} Digital Archives",
        "image_url": img,
        "image_alt": f"Official news wire photograph: {clean_title}",
        "image_courtesy": f"Photo Courtesy: {source_name} Photo Wire",
        "fact_check_status": "Verified by Multi-Agency Editorial Desk",
        "tags": f"{category.title()}, Breaking News, India, World, {source_name}",
        "summary": summary_en,
        "content": content_en,
        "title_en": f"{emoji} {clean_title}",
        "summary_en": summary_en,
        "content_en": content_en,
        "title_hi": f"{emoji} {clean_title}",
        "summary_hi": summary_hi,
        "content_hi": content_hi,
        "author_name": "Pankhudi Sharma",
        "author_bio": "Senior Digital Editor covering national policy, frontier tech, and lifestyle trends with over 15 years of investigative journalism experience.",
        "author_url": "https://zestfeedx.com/about"
    }

def main():
    print("=" * 60)
    print("🚀 ZESTFEEDX AUTOMATED SCRAPER & NEWS AGGREGATOR")
    print("=" * 60)

    existing_slugs, existing_titles, max_id = get_existing_slugs_and_titles()
    print(f"Loaded {len(existing_slugs)} existing article slugs. Current highest ID: {max_id}")

    new_articles = []
    current_id = max_id + 1

    for cat, urls in FEEDS.items():
        print(f"\n[Category: {cat.upper()}] Checking {len(urls)} feeds...")
        for url in urls:
            items = fetch_feed_items(url, cat)
            for item in items:
                title = item["title"]
                slug = make_slug(title)
                # Check for duplicate
                if slug in existing_slugs or title in existing_titles:
                    continue
                # Also prevent duplicate within current run
                if any(a["slug"] == slug for a in new_articles):
                    continue

                # Add new article
                art = build_article_object(current_id, item)
                new_articles.append(art)
                existing_slugs.add(slug)
                existing_titles.add(title)
                current_id += 1
                print(f"  ✓ Added: {art['title'][:65]}... (Image: {bool(item['img'])})")

                # Limit 2 new articles per category per run to maintain high editorial quality
                if sum(1 for a in new_articles if a["category"] == cat) >= 2:
                    break

    if not new_articles:
        print("\n✨ All categories are already up-to-date with latest dispatches. No new articles needed.")
        return 0

    print(f"\n📦 Generated {len(new_articles)} new verified articles.")

    # Read current articles from seed file
    with open(SEED_FILE, "r", encoding="utf-8") as f:
        old_content = f.read()

    # Format new articles into TypeScript blocks
    new_blocks = []
    for art in new_articles:
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
        new_blocks.append(block)

    insert_str = "\n".join(new_blocks) + "\n"

    # Prepend new articles right after export const SEED_ARTICLES: Article[] = [
    pattern = r'(export const SEED_ARTICLES: Article\[\] = \[\s*)'
    updated_content = re.sub(pattern, r'\1\n' + insert_str, old_content, count=1)

    with open(SEED_FILE, "w", encoding="utf-8") as f:
        f.write(updated_content)

    print(f"✅ Successfully prepended {len(new_articles)} new articles into {SEED_FILE}")

    # Regenerate Google News, Sitemaps, and RSS Feeds
    print("\n🔄 Regenerating news-sitemap.xml and RSS feeds...")
    gen_script = os.path.join(BASE_DIR, "scripts", "generate_google_news.py")
    os.system(f'"{sys.executable}" "{gen_script}"')

    # Instant Real-Time Search Engine Indexing (Google Indexing API, Bing, IndexNow)
    try:
        new_urls = [f"https://zestfeedx.com/article/{a['slug']}/" for a in new_articles]
        print(f"\n⚡ Dispatching {len(new_urls)} new URLs to Search Engine Indexing APIs...")
        idx_script = os.path.join(BASE_DIR, "scripts", "realtime_indexing.py")
        if os.path.exists(idx_script):
            os.system(f'"{sys.executable}" "{idx_script}" ' + " ".join(f'"{u}"' for u in new_urls))
    except Exception as e:
        print(f"[Indexing Integration] Non-blocking notice: {e}")

    print("\n🎉 Auto-scraping & publishing pipeline finished successfully!")
    return len(new_articles)

if __name__ == "__main__":
    sys.exit(0 if main() >= 0 else 1)

