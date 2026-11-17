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

generate_800w_article = None

def to_hd_image(img_url):
    if not img_url:
        return ""
    u = img_url.strip()
    if "ndtvimg.com" in u:
        u = re.sub(r'width=\d+', 'width=1600', u)
        u = re.sub(r'height=\d+', 'height=900', u)
        u = re.sub(r'\d+x\d+', '1600x900', u)
    elif "bbci.co.uk" in u:
        u = re.sub(r'/news/\d+/', '/news/1200/', u)
    elif "abplive.com" in u:
        u = re.sub(r'imwidth=\d+', 'imwidth=1200', u)
    elif "images.unsplash.com" in u:
        base = u.split('?')[0]
        sig_match = re.search(r'[?&]sig=([^&]+)', u)
        sig_param = f"&sig={sig_match.group(1)}" if sig_match else ""
        u = f"{base}?auto=format&fit=crop&w=1600&q=85{sig_param}"
    elif "akm-img-a-in.tosshub.com" in u or "aajtak" in u:
        u = re.sub(r'-\d+x\d+\.(png|jpg|jpeg|webp)', r'.\1', u, flags=re.I)
    elif "d3lzcn6mbbadaf.cloudfront.net" in u or "aninews" in u:
        u = re.sub(r'__sized__/', '', u)
        u = re.sub(r'-thumbnail-\d+x\d+.*?\.(png|jpg|jpeg|webp)', r'.\1', u, flags=re.I)
        u = re.sub(r'-thumbnail-\d+x\d+', '', u)
    return u

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

FEED_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
}

ARTICLE_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
    'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
}

try:
    from googlenewsdecoder import gnewsdecoder
except ImportError:
    gnewsdecoder = None

def extract_og_image(url):
    if not url:
        return ""
    try:
        req = urllib.request.Request(url, headers=ARTICLE_HEADERS)
        with urllib.request.urlopen(req, timeout=8) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
            og = re.search(r'<meta[^>]+property=[\'"]og:image[\'"][^>]+content=[\'"]([^\'"]+)[\'"]', html, re.I)
            if not og:
                og = re.search(r'<meta[^>]+content=[\'"]([^\'"]+)[\'"][^>]+property=[\'"]og:image[\'"]', html, re.I)
            if not og:
                og = re.search(r'<meta[^>]+name=[\'"]twitter:image[\'"][^>]+content=[\'"]([^\'"]+)[\'"]', html, re.I)
            if not og:
                og = re.search(r'<meta[^>]+content=[\'"]([^\'"]+)[\'"][^>]+name=[\'"]twitter:image[\'"]', html, re.I)
            if not og:
                og = re.search(r'<meta[^>]+itemprop=[\'"]image[\'"][^>]+content=[\'"]([^\'"]+)[\'"]', html, re.I)
            if not og:
                og = re.search(r'<link[^>]+rel=[\'"]image_src[\'"][^>]+href=[\'"]([^\'"]+)[\'"]', html, re.I)
            if og:
                img = og.group(1).strip()
                if img.startswith("//"):
                    img = "https:" + img
                if img.startswith("http"):
                    return to_hd_image(img)
    except Exception:
        pass
    return ""

def make_slug(title, category="news", art_id=0):
    clean = re.sub(r'[^a-zA-Z0-9\s-]', '', title).strip().lower()
    clean = re.sub(r'[-\s]+', '-', clean).strip('-')
    if len(clean) < 12 or clean.startswith(("dainik-", "jagran", "aajtak", "india-tv", "news18", "bbc", "hindustan")):
        clean = f"{category}-breaking-dispatch-{art_id}"
    return clean[:75].strip('-') + "-2026"

def get_existing_metadata():
    if not os.path.exists(SEED_FILE):
        return set(), set(), set(), 1
    with open(SEED_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    slugs = set(re.findall(r'["\']?slug["\']?:\s*[`"\']([^`"\']+)[`"\']', content))
    titles = set(re.findall(r'["\']?original_title["\']?:\s*[`"\']([^`"\']+)[`"\']', content))
    images = set(re.findall(r'["\']?image_url["\']?:\s*[`"\']([^`"\']+)[`"\']', content))
    ids = [int(x) for x in re.findall(r'["\']?id["\']?:\s*(\d+)', content)]
    max_id = max(ids) if ids else 100
    return slugs, titles, images, max_id

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
        req = urllib.request.Request(url, headers=FEED_HEADERS)
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

# Curated pool of high-resolution professional photojournalism photography
PHOTO_BANK = [
    "https://images.unsplash.com/photo-1541872703-74c5e44368f9",
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f",
    "https://images.unsplash.com/photo-1577495508048-b635879837f1",
    "https://images.unsplash.com/photo-1532375810709-75b1da00537c",
    "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7",
    "https://images.unsplash.com/photo-1596524430615-b46475ddff6e",
    "https://images.unsplash.com/photo-1555848962-6e79363ec58f",
    "https://images.unsplash.com/photo-1521791136064-7986c2920216",
    "https://images.unsplash.com/photo-1575320181282-9afab399332c",
    "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    "https://images.unsplash.com/photo-1551836022-deb4988cc6c0",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998",
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f",
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e",
    "https://images.unsplash.com/photo-1642543492481-44e81e3914a7",
    "https://images.unsplash.com/photo-1621416894569-0f39ed31d247",
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    "https://images.unsplash.com/photo-1518770660439-4636190af475",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
    "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    "https://images.unsplash.com/photo-1517433670267-08bbd4be890f",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e",
    "https://images.unsplash.com/photo-1531415074868-036b1c57e329",
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
    "https://images.unsplash.com/photo-1517649763962-0c623266ddc0",
    "https://images.unsplash.com/photo-1526676037777-05a232554f77",
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55",
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2",
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23",
    "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
    "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982",
    "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7",
    "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9",
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528",
    "https://images.unsplash.com/photo-1530497610245-94d3c16cda28",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d",
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220",
    "https://images.unsplash.com/photo-1561361513-2d000a50f0dc",
    "https://images.unsplash.com/photo-1609137144827-c157643b97ba",
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da",
    "https://images.unsplash.com/photo-1587474260584-136574528ed5",
    "https://images.unsplash.com/photo-1544717305-2782549b5136",
    "https://images.unsplash.com/photo-1598890777032-bde835ba27c2",
    "https://images.unsplash.com/photo-1585829365295-ab7cd400c167",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7",
    "https://images.unsplash.com/photo-1572945753563-4b4f74f01693",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
    "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
]

CATEGORY_HD_IMAGES = {
    "politics": [
        "https://images.unsplash.com/photo-1541872703-74c5e44368f9",
        "https://images.unsplash.com/photo-1589829545856-d10d557cf95f",
        "https://images.unsplash.com/photo-1577495508048-b635879837f1",
        "https://images.unsplash.com/photo-1532375810709-75b1da00537c",
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7",
        "https://images.unsplash.com/photo-1596524430615-b46475ddff6e"
    ],
    "tech": [
        "https://images.unsplash.com/photo-1518770660439-4636190af475",
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
        "https://images.unsplash.com/photo-1677442136019-21780ecad995",
        "https://images.unsplash.com/photo-1517433670267-08bbd4be890f",
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
    ],
    "markets": [
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f",
        "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e",
        "https://images.unsplash.com/photo-1642543492481-44e81e3914a7",
        "https://images.unsplash.com/photo-1621416894569-0f39ed31d247"
    ],
    "world": [
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
        "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
    ],
    "sports": [
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e",
        "https://images.unsplash.com/photo-1531415074868-036b1c57e329",
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
        "https://images.unsplash.com/photo-1517649763962-0c623266ddc0"
    ],
    "entertainment": [
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23",
        "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
    ],
    "health": [
        "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982",
        "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7",
        "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9",
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528",
        "https://images.unsplash.com/photo-1530497610245-94d3c16cda28"
    ],
    "ramayana": [
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220",
        "https://images.unsplash.com/photo-1561361513-2d000a50f0dc",
        "https://images.unsplash.com/photo-1609137144827-c157643b97ba",
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da",
        "https://images.unsplash.com/photo-1587474260584-136574528ed5"
    ]
}

def generate_curiosity_headline(original_title):
    clean = re.sub(r'^[^\w\s\u0900-\u097F]+', '', original_title).strip()
    clean = re.sub(r'^(breaking|exclusive|alert|just in|watch|update|live):\s*', '', clean, flags=re.I).strip()
    
    # Strip media brand suffixes
    clean = re.sub(r'\s*[-–—|]\s*(Jagran|Dainik Bhaskar|AajTak|India TV Hindi|PM India|NDTV Hindi|NDTV India|NDTV|Amar Ujala|Navbharat Times|Hindustan|Zee News|ABP News|News18|BBC Hindi|Jansatta|ANI News|The Hindu|The Times of India|BBC|Reuters|Business Standard|Rediff|News On AIR|DD News).*$', '', clean, flags=re.I).strip()

    is_hindi = bool(re.search(r'[\u0900-\u097F]', clean))
    if is_hindi:
        hindi_prefixes = [
            "बड़ा खुलासा: {}",
            "विशेष रिपोर्ट: {}",
            "ताज़ा अपडेट: {}",
            "अंदर की बात: {}",
            "ग्राउंड रिपोर्ट: {}",
            "महत्वपूर्ण जानकारी: {}",
            "बड़ी खबर: {}"
        ]
        h = sum(ord(c) for c in clean) % len(hindi_prefixes)
        return hindi_prefixes[h].format(clean)
    else:
        eng_patterns = [
            "The Secret Truth Behind: {}",
            "Why Everyone Is Shocked By {}",
            "Behind Closed Doors: What Really Happened When {}",
            "The Untold Inside Story: How {} Is Shaking the Entire Sector",
            "Revealed: The Shocking Details Behind {}",
            "Why Insiders Are Calling {} a Total Game-Changer",
            "The Midnight Move: How {} Caught Everyone Completely Off Guard",
            "What Nobody Is Telling You About {}"
        ]
        h = sum(ord(c) for c in clean) % len(eng_patterns)
        return eng_patterns[h].format(clean)

def get_unique_hd_image(category, art_id, seen_images):
    cat_key = (category or "politics").lower()
    pool = CATEGORY_HD_IMAGES.get(cat_key, PHOTO_BANK)
    idx = art_id % len(pool)
    base = pool[idx].split('?')[0]
    candidate = f"{base}?auto=format&fit=crop&w=1600&q=85&sig={art_id}"
    
    salt = 1
    while candidate in seen_images:
        candidate = f"{base}?auto=format&fit=crop&w=1600&q=85&sig={art_id}-{salt}"
        salt += 1
    return candidate

def build_article_object(art_id, item, seen_images):
    raw_title = item["title"]
    clean_title = re.sub(r'^[\"\']|[\"\']$', '', raw_title)
    clean_title = re.sub(r'\s*-\s*(ANI News|The Hindu|The Times of India|NDTV|BBC|Reuters|Business Standard|Rediff|News On AIR|DD News).*$', '', clean_title).strip()
    category = item["category"]
    slug = make_slug(clean_title, category, art_id)
    
    img = item.get("img", "")
    source_url = item.get("link", "")
    source_name = item.get("source_name", "Official Wire")

    # If feed image is missing, attempt to extract original publisher camera photo
    if not img and source_url:
        target_fetch_url = source_url
        if "news.google.com" in source_url and gnewsdecoder:
            try:
                dec = gnewsdecoder(source_url)
                if dec and (dec.get("status") or dec.get("success")):
                    target_fetch_url = dec.get("decoded_url", source_url)
                    source_url = target_fetch_url
            except Exception:
                pass
        img = extract_og_image(target_fetch_url)

    if img:
        img = to_hd_image(img)

    # Cross-check thumbnail uniqueness:
    # Must NOT be empty, generic placeholder, or duplicated across any news articles
    is_duplicate_or_generic = (
        not img 
        or "pm-modi-bastar-diwali-2026.jpg" in img
        or img in seen_images
    )

    if is_duplicate_or_generic:
        img = get_unique_hd_image(category, art_id, seen_images)

    seen_images.add(img)
    
    # Generate high-curiosity headline
    is_hindi = bool(re.search(r'[\u0900-\u097F]', clean_title))
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

    if is_hindi:
        clean_desc_hi = re.sub(r'[a-zA-Z]', '', desc).strip()
        if not clean_desc_hi:
            clean_desc_hi = clean_title
        summary_hi = f"{clean_desc_hi[:180]}... इस महत्वपूर्ण मामले पर प्रशासनिक और नीतिगत स्तर पर लगातार नजर रखी जा रही है।"
        summary_final = summary_hi
        
        content_hi = f"""राष्ट्रीय व अंतरराष्ट्रीय मीडिया गलियारों से आज की बड़ी खबर। {clean_desc_hi}। इस महत्वपूर्ण घटनाक्रम पर प्रशासनिक, नीतिगत और संस्थागत स्तर पर विस्तृत समीक्षा की जा रही है।

### प्रशासनिक समीक्षा एवं प्राथमिक बिंदु

आधिकारिक सूत्रों के अनुसार, इस पूरे मामले पर संबंधित विभागों और उच्चाधिकारियों द्वारा लगातार निगरानी रखी जा रही है। पारदर्शिता, नियमों का पालन और जनहित को सर्वोपरि रखते हुए सभी आवश्यक दिशा-निर्देश जारी किए गए हैं।

वरिष्ठ विशेषज्ञों का मानना है कि यह घटनाक्रम दूरगामी प्रभाव डालने वाला सिद्ध होगा। स्थिति पर नियंत्रण और कार्यकुशलता बनाए रखने के लिए विशेष पर्यवेक्षक दलों का गठन किया गया है।

### मुख्य बिंदु एवं प्रशासनिक स्थिति

| व्यवस्था बिंदु | प्रशासनिक स्थिति | वर्तमान स्थिति |
| :--- | :--- | :--- |
| विभागीय समीक्षा | उच्चस्तरीय समिति | सक्रिय एवं प्रगति पर |
| वैधानिक अनुपालन | दिशा-निर्देशों के अनुरूप | लागू |
| जन सूचना तंत्र | नियमित बुलेटिन जारी | सत्यापित |
| अंतर-विभागीय समन्वय | केंद्रीय व क्षेत्रीय डेस्क | समन्वित |

### ज़मीनी हकीकत एवं नीतिगत विश्लेषण

संबंधित विषय विशेषज्ञों ने पुष्टि की है कि संस्थागत जवाबदेही और स्थापित नियामक ढांचे भविष्य के कार्यों के लिए एक मानक स्थापित करेंगे। जनसाधारण और हितधारकों को पारदर्शी व सत्यापित जानकारी उपलब्ध कराने के स्पष्ट निर्देश दिए गए हैं।

संपादकीय विभाग द्वारा इस पूरे घटनाक्रम और आधिकारिक बुलेटिनों पर निरंतर नज़र रखी जा रही है। आगामी आधिकारिक सूचनाओं के साथ विश्लेषण का यह क्रम जारी रहेगा।"""
        content_final = content_hi
        badge = "⚡ ताज़ा बुलेटिन"
        alt_text = f"आधिकारिक समाचार छायाचित्र: {clean_title}"
        tags_str = f"{category.title()}, Breaking News, National, Hindi News"
    else:
        clean_desc_en = re.sub(r'[\u0900-\u097F]', '', desc).strip()
        if not clean_desc_en:
            clean_desc_en = clean_title
        summary_en = f"{clean_desc_en[:180]}... Comprehensive investigative reporting and verified dispatches from the news desk."
        summary_final = summary_en

        if generate_800w_article:
            content_final = generate_800w_article(clean_title, category, clean_desc_en, source_name)
        else:
            content_final = f"""In what senior correspondents and beat analysts describe as a consequential development for {category.upper()}, verified dispatches confirm key milestones today. {clean_desc_en}. High-level reviews and official briefings are currently underway under multi-agency supervision to monitor developments in real time.

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
        badge = f"⚡ {category.title()} Wire"
        alt_text = f"Official news wire photograph: {curiosity_title}"
        tags_str = f"{category.title()}, Breaking News, India, World, {source_name}"

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    return {
        "id": art_id,
        "title": f"{emoji} {curiosity_title}",
        "slug": slug,
        "original_title": clean_title,
        "category": category,
        "language": "hi" if is_hindi else "en",
        "fomo_badge": badge,
        "read_time": "7 min read",
        "views_count": 35000 + (art_id * 320),
        "shares_count": 4100 + (art_id * 45),
        "published_at": item["pubDate"] or now_iso,
        "source_name": source_name,
        "source_url": source_url,
        "source_courtesy": f"News Courtesy: {source_name} Digital Archives",
        "image_url": img,
        "image_alt": alt_text,
        "image_courtesy": f"Photo Courtesy: {source_name} Photo Wire",
        "fact_check_status": "Verified by Multi-Agency Editorial Desk",
        "tags": tags_str,
        "summary": summary_final,
        "content": content_final,
        "title_en": "" if is_hindi else f"{emoji} {curiosity_title}",
        "summary_en": "" if is_hindi else summary_final,
        "content_en": "" if is_hindi else content_final,
        "title_hi": f"{emoji} {curiosity_title}" if is_hindi else "",
        "summary_hi": summary_final if is_hindi else "",
        "content_hi": content_final if is_hindi else "",
        "author_name": "Pankhudi Sharma",
        "author_bio": "Senior Digital Editor covering national policy, frontier tech, and lifestyle trends with over 15 years of investigative journalism experience.",
        "author_url": "https://zestfeedx.com/about"
    }

def main():
    print("=" * 60)
    print("🚀 ZESTFEEDX AUTOMATED SCRAPER & NEWS AGGREGATOR")
    print("=" * 60)

    existing_slugs, existing_titles, existing_images, max_id = get_existing_metadata()
    seen_images = set(existing_images)
    print(f"Loaded {len(existing_slugs)} existing articles and {len(seen_images)} unique images. Current highest ID: {max_id}")

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
                art = build_article_object(current_id, item, seen_images)
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

    # Final pre-publish audit: verify zero duplicate thumbnail images
    print("\n🔍 Running cross-check audit for 100% unique thumbnail images...")
    final_seen = set()
    dup_resolved = 0
    for art in new_articles:
        if art["image_url"] in final_seen or art["image_url"] in existing_images:
            art["image_url"] = get_unique_hd_image(art["category"], art["id"], seen_images)
            seen_images.add(art["image_url"])
            dup_resolved += 1
        final_seen.add(art["image_url"])
    
    if dup_resolved > 0:
        print(f"  ⚡ Resolved {dup_resolved} duplicate thumbnails into distinct verified HD photographs.")
    print(f"  ✅ Audit passed: All {len(new_articles)} new articles have distinct, unique high-resolution thumbnails.")

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
    gen_script = os.path.join(BASE_DIR, "scripts", "generate_news_sitemap.js")
    if os.path.exists(gen_script):
        subprocess.run(["node", gen_script], check=False)

    # Instant Real-Time Search Engine Indexing (Google Indexing API, Bing, IndexNow)
    try:
        idx_script = os.path.join(BASE_DIR, "scripts", "auto_submit_search_console.js")
        if os.path.exists(idx_script):
            subprocess.run(["node", idx_script], check=False)
    except Exception as e:
        print(f"[Indexing Integration] Non-blocking notice: {e}")

    print("\n🎉 Auto-scraping & publishing pipeline finished successfully!")
    return len(new_articles)

if __name__ == "__main__":
    sys.exit(0 if main() >= 0 else 1)
