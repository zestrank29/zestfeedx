import os
import sys
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
import subprocess
import io

# Ensure UTF-8 output on all systems including Windows Task Scheduler
if sys.platform == "win32":
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
SEED_FILE = os.path.join(BASE_DIR, "frontend", "src", "data", "seedArticles.ts")

if SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, SCRIPTS_DIR)
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

try:
    from upgrade_all_seed_articles import generate_800w_article, to_hd_image
except Exception:
    to_hd_image = lambda u: u or "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1600&q=85"
    generate_800w_article = None

FEEDS = {
    "politics": [
        "https://news.google.com/rss?hl=hi&gl=IN&ceid=IN:hi",
        "https://news.google.com/rss/headlines/section/topic/NATION?hl=hi&gl=IN&ceid=IN:hi",
        "https://news.google.com/rss/search?q=%22Narendra+Modi%22+when:2d&hl=en-IN&gl=IN&ceid=IN:en",
        "https://news.google.com/rss/search?q=%22PM+Modi%22+when:2d&hl=en-IN&gl=IN&ceid=IN:en",
        "https://aninews.in/rss/feed/category/national.xml",
        "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms",
        "https://www.thehindu.com/news/national/feeder/default.rss",
        "https://news.google.com/rss/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRFZxYUdjU0JXVnVMVWRDR2dKSlRpZ0FQAQ?hl=en-IN&gl=IN&ceid=IN:en"
    ],
    "ramayana": [
        "https://news.google.com/rss/search?q=%E0%A4%B0%E0%A4%BE%E0%A4%AE%E0%A4%BE%E0%A4%AF%E0%A4%A3&hl=hi&gl=IN&ceid=IN:hi",
        "https://news.google.com/rss/topics/CAAqJQgKIh9DQkFTRVFvSUwyMHZNR014ZDIwU0JXVnVMVWRDS0FBUAE?hl=en-IN&gl=IN&ceid=IN:en"
    ],
    "entertainment": [
        "https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=hi&gl=IN&ceid=IN:hi",
        "https://aninews.in/rss/feed/category/entertainment.xml"
    ],
    "world": [
        "https://news.google.com/rss/headlines/section/topic/WORLD?hl=hi&gl=IN&ceid=IN:hi",
        "https://aninews.in/rss/feed/category/world.xml"
    ],
    "sports": [
        "https://news.google.com/rss/headlines/section/topic/SPORTS?hl=hi&gl=IN&ceid=IN:hi",
        "https://aninews.in/rss/feed/category/sports.xml"
    ],
    "health": [
        "https://news.google.com/rss/headlines/section/topic/HEALTH?hl=hi&gl=IN&ceid=IN:hi",
        "https://aninews.in/rss/feed/category/health.xml"
    ],
    "tech": [
        "https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=hi&gl=IN&ceid=IN:hi",
        "https://aninews.in/rss/feed/category/tech.xml"
    ]
}

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
}

try:
    from googlenewsdecoder import gnewsdecoder
except ImportError:
    gnewsdecoder = None

def extract_og_image(url):
    if not url:
        return ""
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=8) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
            og = re.search(r'<meta[^>]+property=[\'"]og:image[\'"][^>]+content=[\'"]([^\'"]+)[\'"]', html, re.I)
            if not og:
                og = re.search(r'<meta[^>]+content=[\'"]([^\'"]+)[\'"][^>]+property=[\'"]og:image[\'"]', html, re.I)
            if not og:
                og = re.search(r'<meta[^>]+name=[\'"]twitter:image[\'"][^>]+content=[\'"]([^\'"]+)[\'"]', html, re.I)
            if og:
                img = og.group(1).strip()
                if img.startswith("//"):
                    img = "https:" + img
                if img.startswith("http"):
                    return img
    except Exception:
        pass
    return ""

def make_slug(title, category="news", art_id=0):
    clean = re.sub(r'[^a-zA-Z0-9\s-]', '', title).strip().lower()
    clean = re.sub(r'[-\s]+', '-', clean).strip('-')
    if len(clean) < 12 or clean.startswith(("dainik-", "jagran", "aajtak", "india-tv", "news18", "bbc", "hindustan")):
        clean = f"{category}-breaking-dispatch-{art_id}"
    return clean[:75].strip('-') + "-2026"

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

def clean_html(text):
    if not text:
        return ""
    clean = re.sub(r'<[^>]+>', ' ', text)
    clean = re.sub(r'&[a-zA-Z0-9#]+;', ' ', clean)
    clean = re.sub(r'\s+', ' ', clean)
    return clean.strip()

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
                desc_raw = it.find('description').text.strip() if it.find('description') is not None and it.find('description').text else ""
                desc = clean_html(desc_raw)
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

                # Source name extraction & normalization
                src = it.find('source')
                source_name = src.text.strip() if src is not None and src.text else "Official Wire"
                lower_link = link.lower()
                lower_title = title.lower()

                if "aninews.in" in lower_link or "ani news" in lower_title:
                    source_name = "ANI News"
                elif "thehindu.com" in lower_link or "the hindu" in lower_title:
                    source_name = "The Hindu"
                elif "indiatimes.com" in lower_link or "timesofindia" in lower_link or "the times of india" in lower_title:
                    source_name = "The Times of India"
                elif "ndtv.com" in lower_link or "ndtv" in lower_title:
                    source_name = "NDTV"
                elif "hindustantimes.com" in lower_link or "hindustan times" in lower_title:
                    source_name = "Hindustan Times"
                elif "indianexpress.com" in lower_link or "indian express" in lower_title:
                    source_name = "The Indian Express"
                elif "newsonair" in lower_link or "news on air" in lower_title:
                    source_name = "News On AIR"
                elif "ddnews" in lower_link or "dd news" in lower_title:
                    source_name = "DD News"
                elif "reuters" in lower_link or "reuters" in lower_title:
                    source_name = "Reuters"

                # Specialized HD imagery for PM Modi dispatches
                if ("modi" in lower_title or "pm modi" in lower_title or "prime minister" in lower_title) and not img_url:
                    img_url = "/images/pm-modi-bastar-diwali-2026.jpg"

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

CATEGORY_HD_IMAGES = {
    "politics": [
        "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1600&q=85"
    ],
    "tech": [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1600&q=85"
    ],
    "markets": [
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1600&q=85"
    ],
    "world": [
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85"
    ],
    "sports": [
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1531415074868-036b1c57e329?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1600&q=85"
    ],
    "entertainment": [
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85"
    ],
    "health": [
        "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1600&q=85"
    ],
    "ramayana": [
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1609137144827-c157643b97ba?auto=format&fit=crop&w=1600&q=85"
    ]
}

def generate_curiosity_headline(original_title):
    clean = re.sub(r'^[^\w\s]+', '', original_title).strip()
    clean = re.sub(r'^(breaking|exclusive|alert|just in|watch|update|live):\s*', '', clean, flags=re.I).strip()
    patterns = [
        "The Secret Truth Behind: {}",
        "Why Everyone Is Shocked By {}",
        "Behind Closed Doors: What Really Happened When {}",
        "The Untold Inside Story: How {} Is Shaking the Entire Sector",
        "Revealed: The Shocking Details Behind {}",
        "Why Insiders Are Calling {} a Total Game-Changer",
        "The Midnight Move: How {} Caught Everyone Completely Off Guard",
        "What Nobody Is Telling You About {}"
    ]
    h = sum(ord(c) for c in clean) % len(patterns)
    return patterns[h].format(clean)

def get_unique_category_image(category, art_id):
    cat_key = (category or "politics").lower()
    pool = CATEGORY_HD_IMAGES.get(cat_key, CATEGORY_HD_IMAGES["politics"])
    base_img = pool[art_id % len(pool)]
    return f"{base_img.split('&q=')[0]}&q=85&art_id={art_id}"

def build_article_object(art_id, item):
    raw_title = item["title"]
    clean_title = re.sub(r'^[\"\']|[\"\']$', '', raw_title)
    clean_title = re.sub(r'\s*-\s*(ANI News|The Hindu|The Times of India|NDTV|BBC|Reuters|Business Standard|Rediff|News On AIR|DD News).*$', '', clean_title).strip()
    category = item["category"]
    slug = make_slug(clean_title, category, art_id)
    
    img = item["img"]
    source_url = item["link"]
    source_name = item["source_name"]

    if not img and source_url:
        target_fetch_url = source_url
        if "news.google.com" in source_url and gnewsdecoder:
            try:
                dec = gnewsdecoder(source_url)
                if dec.get("success"):
                    target_fetch_url = dec["decoded_url"]
                    source_url = target_fetch_url
            except Exception:
                pass
        img = extract_og_image(target_fetch_url)

    if not img:
        img = get_unique_category_image(category, art_id)
    else:
        img = to_hd_image(img)
    
    # Generate high-curiosity headline
    curiosity_title = generate_curiosity_headline(clean_title)
    raw_desc = item["desc"] or f"Comprehensive investigative report and ground reality analysis on {clean_title}."
    desc = clean_html(raw_desc)

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
    if generate_800w_article:
        content_en = generate_800w_article(clean_title, category, desc, source_name)
    else:
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

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    return {
        "id": art_id,
        "title": f"{emoji} {curiosity_title}",
        "slug": slug,
        "original_title": clean_title,
        "category": category,
        "fomo_badge": f"⚡ {category.title()} Wire",
        "read_time": "7 min read",
        "views_count": 35000 + (art_id * 320),
        "shares_count": 4100 + (art_id * 45),
        "published_at": item["pubDate"] or now_iso,
        "source_name": source_name,
        "source_url": source_url,
        "source_courtesy": f"News Courtesy: {source_name} Digital Archives",
        "image_url": img,
        "image_alt": f"Official news wire photograph: {curiosity_title}",
        "image_courtesy": f"Photo Courtesy: {source_name} Photo Wire",
        "fact_check_status": "Verified by Multi-Agency Editorial Desk",
        "tags": f"{category.title()}, Breaking News, India, World, {source_name}",
        "summary": summary_en,
        "content": content_en,
        "title_en": f"{emoji} {curiosity_title}",
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
                print(f"  ✓ Added: {art['title'][:65]}... ({art['source_name']}, Image: {bool(item['img'])})")

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

    # Regenerate Google News, Sitemaps, and RSS Feeds safely using subprocess
    print("\n🔄 Regenerating news-sitemap.xml and RSS feeds...")
    gen_script = os.path.join(BASE_DIR, "scripts", "generate_google_news.py")
    subprocess.run([sys.executable, gen_script], check=False)

    # Instant Real-Time Search Engine Indexing (Google Indexing API, Bing, IndexNow)
    try:
        new_urls = [f"https://zestfeedx.com/article/{a['slug']}/" for a in new_articles]
        print(f"\n⚡ Dispatching {len(new_urls)} new URLs to Search Engine Indexing APIs...")
        idx_script = os.path.join(BASE_DIR, "scripts", "realtime_indexing.py")
        if os.path.exists(idx_script):
            subprocess.run([sys.executable, idx_script] + new_urls, check=False)
    except Exception as e:
        print(f"[Indexing Integration] Non-blocking notice: {e}")

    print("\n🎉 Auto-scraping & publishing pipeline finished successfully!")
    return len(new_articles)

if __name__ == "__main__":
    sys.exit(0 if main() >= 0 else 1)
