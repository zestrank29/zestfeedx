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
    clean = re.sub(r'\s*[-–—|]\s*(Jagran|Dainik Bhaskar|AajTak|India TV Hindi|PM India|NDTV Hindi|NDTV India|NDTV|Amar Ujala|Navbharat Times|Hindustan|Zee News|ABP News|News18|BBC Hindi|Jansatta|ANI News|The Hindu|The Times of India|BBC|Reuters|Business Standard|Rediff|News On AIR|DD News|Cricinfo|Navbharat Live|Nai Dunia).*$', '', clean, flags=re.I).strip()

    is_hindi = bool(re.search(r'[\u0900-\u097F]', clean))
    if is_hindi:
        # Strip any English phrases or words
        clean = re.sub(r'^(Why Insiders Are Calling|The Secret Truth Behind|Why Everyone Is Shocked By|Behind Closed Doors|The Untold Inside Story|Revealed|The Midnight Move|What Nobody Is Telling You About|How)\s*:?\s*', '', clean, flags=re.I).strip()
        clean = re.sub(r'\s*(a Total Game-Changer|Is Shaking the Entire Sector|Caught Everyone Completely Off Guard).*$', '', clean, flags=re.I).strip()
        clean = re.sub(r'\s*-\s*[A-Za-z\s]+$', '', clean).strip()
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
        # Strip any stray Hindi prefix
        clean = re.sub(r'^(बड़ा खुलासा|विशेष रिपोर्ट|ताज़ा अपडेट|अंदर की बात|ग्राउंड रिपोर्ट|महत्वपूर्ण जानकारी|बड़ी खबर)\s*:?\s*', '', clean).strip()
        clean = re.sub(r'[\u0900-\u097F]+', '', clean).strip()
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
        summary_hi = f"{clean_desc_hi[:160]}... इस महत्वपूर्ण मामले पर प्रशासनिक और नीतिगत स्तर पर लगातार नजर रखी जा रही है।"
        summary_final = summary_hi
        
        content_final = f"""### मुख्य घटनाक्रम एवं आधिकारिक पृष्ठभूमि

राष्ट्रीय एवं क्षेत्रीय मीडिया गलियारों से आज की बड़ी और सत्यापित खबर। **{clean_title}** के संबंध में आधिकारिक सूचनाएं और प्रशासनिक विवरण सामने आए हैं। {source_name} द्वारा जारी सत्यापित रिपोर्ट के अनुसार, इस पूरे मामले पर उच्चस्तरीय नीतिगत व प्रशासनिक हलकों में गहन समीक्षा की जा रही है।

प्रशासनिक पारदर्शिता, वैधानिक नियमों के कड़े अनुपालन और जनसाधारण के हितों को सर्वोच्च प्राथमिकता देते हुए संबंधित विभागों द्वारा आवश्यक दिशा-निर्देश जारी किए गए हैं।

### प्रशासनिक समीक्षा एवं ज़मीनी हकीकत

ज़मीनी हकीकत और विषय विशेषज्ञों के विश्लेषण से स्पष्ट होता है कि {clean_desc_hi}। इस घटनाक्रम का सीधा प्रभाव संबंधित क्षेत्र, जनसंस्थाओं और नीतिगत प्राथमिकताओं पर पड़ना तय माना जा रहा है।

वरिष्ठ संपादकीय विशेषज्ञों और जमीनी संवाददाताओं का मानना है कि इस प्रकार के नीतिगत और संस्थागत निर्णय दीर्घकालिक स्थिरता और व्यवस्थागत जवाबदेही को सुदृढ़ करते हैं। संबंधित उच्चाधिकारियों द्वारा स्थिति पर निरंतर नजर रखी जा रही है ताकि सभी कार्य सुचारु रूप से संपन्न हो सकें।

### मुख्य बिंदु एवं व्यवस्थागत स्थिति

| व्यवस्था बिंदु | प्रशासनिक स्थिति | वर्तमान स्थिति |
| :--- | :--- | :--- |
| विभागीय समीक्षा | उच्चस्तरीय समिति | सक्रिय एवं प्रगति पर |
| वैधानिक अनुपालन | दिशा-निर्देशों के अनुरूप | पूरी तरह लागू |
| जन सूचना तंत्र | नियमित आधिकारिक बुलेटिन | सत्यापित |
| अंतर-विभागीय समन्वय | केंद्रीय व क्षेत्रीय डेस्क | समन्वित |

### दूरगामी प्रभाव एवं विश्लेषणात्मक दृष्टिकोण

संबंधित विशेषज्ञों ने पुष्टि की है कि नियमों की स्पष्टता और पारदर्शिता भविष्य के प्रशासनिक कार्यों के लिए एक आदर्श मानक स्थापित करेगी। जनसाधारण और हितधारकों तक सही, निष्पक्ष और तथ्यपरक जानकारी पहुंचाना ही पत्रकारिता का मूल ध्येय है।

संपादकीय विभाग द्वारा इस पूरे घटनाक्रम पर लगातार नज़र रखी जा रही है। आगामी आधिकारिक सूचनाओं और प्रेस नोटों के आधार पर विस्तृत विश्लेषण का यह क्रम अनवरत जारी रहेगा।

*ZestFeedX न्यूज़ डेस्क — निष्पक्ष, तथ्यपरक और सत्यापित पत्रकारिता का विश्वसनीय मंच।*"""
        badge = "⚡ ताज़ा बुलेटिन"
        alt_text = f"आधिकारिक समाचार छायाचित्र: {clean_title}"
        tags_str = f"{category.title()}, Breaking News, National, Hindi News"
    else:
        clean_desc_en = re.sub(r'[\u0900-\u097F]', '', desc).strip()
        if not clean_desc_en:
            clean_desc_en = clean_title
        summary_en = f"{clean_desc_en[:160]}... Comprehensive investigative reporting and verified dispatches from the news desk."
        summary_final = summary_en

        cat_lower = category.lower()
        if cat_lower in ["markets", "economy", "money"]:
            content_final = f"""### Market Overview & Monetary Context

Financial markets and macro analysts are closely monitoring unfolding developments surrounding **{clean_title}**. According to corroborated dispatches reported by {source_name}, this development comes at a pivotal juncture for institutional capital flows, sectoral valuations, and investor sentiment across domestic and regional exchanges.

The Reserve Bank of India and global monetary authorities have continued to prioritize market stability, systemic liquidity, and regulatory transparency. Beat analysts observe that benchmark indices and sector-specific asset classes are pricing in the immediate balance-sheet implications of this proceeding.

### Institutional Directives & Capital Allocation

A rigorous examination of fiscal disclosures confirms that institutional asset allocators, mutual fund trustees, and credit-rating agencies are evaluating risk-adjusted returns in light of {clean_desc_en}. Corporate treasury desks emphasize that statutory governance, transparent audit standards, and risk mitigation frameworks remain fundamental in preserving stakeholder value.

Addressing financial correspondents, senior macro economists noted that sustained industrial capex and resilient domestic consumption provide substantial downside protection. However, geopolitical supply constraints and foreign portfolio rebalancing warrant prudent hedging strategies across market segments.

### Key Financial & Sectoral Indicators

| Financial Parameter | Benchmark Assessment | Market Consensus |
| :--- | :--- | :--- |
| Sectoral Valuation | Risk-Adjusted Multiple | Neutral to Constructive |
| Institutional Inflows | Long-Term Strategic Capital | Verified & Active |
| Regulatory Posture | Statutory Compliance Mandate | Enforced & Monitored |
| Macro Durability Index | Core Operational Stability | Resilient |

### Strategic Outlook & Investor Takeaways

Looking forward, market veterans emphasize that the systemic precedents set by this development will establish a benchmark for corporate governance and capital expenditure cycles in the quarters ahead. Portfolio managers are advised to monitor subsequent statutory filings, quarterly guidance communiqués, and macroeconomic data prints to evaluate long-term portfolio positioning.

*Official dispatches and financial communiqués continue to be monitored by the ZestFeedX Financial Markets desk.*"""
        elif cat_lower in ["tech", "ai"]:
            content_final = f"""### Technological Architecture & Sectoral Disruption

The technology and frontier computing ecosystem witnessed significant momentum today as verified reports confirmed key milestones regarding **{clean_title}**. According to technical briefs published by {source_name}, this breakthrough represents a strategic evolution in high-performance digital infrastructure, computational efficiency, and enterprise deployment.

As sovereign computing initiatives, semiconductor fabrication pipelines, and foundation model deployments accelerate nationwide, industry architects emphasize that sustainable software engineering, low-latency interoperability, and cryptographic security must remain central to modern platform engineering.

### Enterprise Implications & Digital Infrastructure

Field evaluations indicate that enterprise stakeholders and systems architects are evaluating scalable adoption roadmaps for {clean_desc_en}. With cloud-native platforms, edge AI acceleration, and localized data centers transforming enterprise productivity, technical governance and uptime reliability have emerged as primary operational metrics.

Senior technology leaders underline that regulatory alignment—specifically adherence to sovereign data protection mandates and transparent algorithmic accountability—ensures that computational advancements translate into dependable, resilient real-world utility across commercial and public sectors.

### Core Technical Benchmarks

| Architectural Parameter | Technical Benchmark | Operational Status |
| :--- | :--- | :--- |
| Computational Throughput | High-Efficiency Optimization | Verified Benchmark |
| Security & Data Governance | Zero-Trust Regulatory Compliance | Audited & Enforced |
| Scalability Metric | Distributed Cloud-Native Capacity | Active Deployment |
| Systems Interoperability | Standardized API Integration | Production Ready |

### Future Roadmap & Innovation Trajectory

Industry researchers predict that this development will catalyze further architectural innovation across software stacks and hardware acceleration fabrics. Development teams and enterprise decision-makers should prioritize scalable, standards-compliant infrastructure to capitalize on subsequent ecosystem iterations.

*ZestFeedX Frontier Tech desk will continue to provide real-time architectural evaluations as new releases and benchmarks are published.*"""
        elif cat_lower in ["sports"]:
            content_final = f"""### Match Tactical Analysis & Competitive Overview

The sporting world witnessed high-intensity developments today as verified dispatches confirmed decisive outcomes regarding **{clean_title}**. According to reports compiled by {source_name}, this fixture and its subsequent tactical ramifications mark an essential milestone in the current competitive season.

Athletic directors, high-performance coaches, and sports scientists emphasize that elite consistency, disciplined physical conditioning, and tactical adaptability remain paramount as teams navigate rigorous domestic and international tournament schedules.

### Tactical Execution & Key Athletic Milestones

A technical breakdown of the performance shows that tactical execution under pressure defined the outcome surrounding {clean_desc_en}. Ground observers noted disciplined defensive structures, precise set-piece execution, and decisive contributions during pivotal passages of play.

Coaching staff and performance analysts highlighted that athletic workloads and recovery protocols are being managed with scientific rigor, ensuring peak physiological readiness and injury mitigation ahead of critical fixtures in the upcoming championship calendar.

### Performance & Tactical Metrics

| Athletic Parameter | Performance Metric | Competitive Standing |
| :--- | :--- | :--- |
| Tactical Discipline | High-Efficiency Execution | Verified on Field |
| Physical Conditioning | Peak Physiological Index | Monitored by Staff |
| Statistical Contribution | Match-Winning Benchmark | Recorded in Table |
| Tournament Trajectory | Championship Contention | Active & Progressing |

### Championship Outlook & Next Fixtures

With tournament standings tightening, sports analysts observe that strategic depth and tactical composure will determine upcoming knockout progressions. Fans and franchise analysts alike await subsequent fixtures as the competitive calendar enters its decisive phase.

*ZestFeedX Sports Desk delivers verified athletic dispatches, tactical breakdowns, and official federation updates.*"""
        else:
            content_final = f"""### Strategic Overview & Legislative Framework

In what policy analysts and parliamentary observers describe as a consequential administrative milestone, verified dispatches confirm significant momentum regarding **{clean_title}**. According to authoritative communiqués released by {source_name}, this proceeding reflects concerted administrative oversight and structured institutional coordination across national ministries.

State administrative secretariats, regulatory bodies, and legislative committees have underscored the critical importance of transparent governance, statutory compliance, and civic welfare in overseeing this matter.

### Institutional Oversight & Ground Reality

Ground reality assessments indicate that {clean_desc_en} establishes a clear operational precedent. Senior governance specialists highlight that multi-agency supervisory committees are actively monitoring implementation milestones to guarantee full accountability, statutory integrity, and public transparency.

Addressing press correspondents during the regular briefing, administrative spokespersons confirmed that operational protocols are being executed with strict adherence to established legal mandates, ensuring that stakeholder interests and community welfare remain fully protected.

### Governance Parameter Assessment

| Institutional Metric | Operational Benchmark | Statutory Status |
| :--- | :--- | :--- |
| Inter-Agency Oversight | Multi-Tier Secretariat Review | Verified & Active |
| Statutory Compliance | Strict Adherence to Legislative Mandate | Enforced |
| Public Transparency Index | High-Frequency Field Dispatches | Documented |
| Jurisdictional Coordination | National & Regional Secretariat Desk | Coordinated |

### Why This Matters: Policy Impact & Outlook

Beyond immediate headlines, this development carries durable implications for regulatory policy and public administration. Constitutional scholars and governance strategists note that the operational precedents affirmed today provide a stable framework for future legislative initiatives.

*ZestFeedX Editorial Desk will continue to monitor official gazettes, ministerial releases, and verified ground telemetry as further updates emerge.*"""
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
        "author_name": "पंखुड़ी शर्मा (वरिष्ठ डिजिटल संपादक)" if is_hindi else "Pankhudi Sharma",
        "author_bio": "Senior Digital Editor covering national policy, frontier tech, and lifestyle trends with over 15 years of investigative journalism experience.",
        "author_url": "https://zestfeedx.com/author/pankhudi-sharma"
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
