import os
import sys
import json
import re
import time
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone, timedelta
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
QUEUE_FILE = os.path.join(BASE_DIR, "frontend", "src", "data", "publishing_queue.json")
STATUS_FILE = os.path.join(BASE_DIR, "frontend", "src", "data", "publishing_status.json")
LOCK_FILE = os.path.join(BASE_DIR, ".publishing.lock")

# IST Timezone Helper (UTC+05:30)
IST_OFFSET = timedelta(hours=5, minutes=30)
IST_TZ = timezone(IST_OFFSET, name="IST")

def now_ist():
    return datetime.now(IST_TZ)

def now_utc():
    return datetime.now(timezone.utc)

def format_ist(dt=None):
    if dt is None:
        dt = now_ist()
    elif dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc).astimezone(IST_TZ)
    return dt.strftime("%Y-%m-%d %H:%M:%S IST")

# Lock Management with 15-minute Stale Clearing
def acquire_lock():
    if os.path.exists(LOCK_FILE):
        try:
            mtime = os.path.getmtime(LOCK_FILE)
            age_secs = time.time() - mtime
            if age_secs < 900: # 15 minutes
                print(f"[Lock] Active publishing job in progress (lock age: {int(age_secs)}s). Exiting cleanly.")
                return False
            else:
                print(f"[Lock] Found stale lock ({int(age_secs)}s old). Removing and acquiring new lock.")
                os.remove(LOCK_FILE)
        except Exception as e:
            print(f"[Lock] Error inspecting existing lock: {e}")
    try:
        with open(LOCK_FILE, "w", encoding="utf-8") as f:
            f.write(f"PID: {os.getpid()}\nStarted: {format_ist()}\n")
        return True
    except Exception as e:
        print(f"[Lock] Failed to create lock file: {e}")
        return False

def release_lock():
    try:
        if os.path.exists(LOCK_FILE):
            os.remove(LOCK_FILE)
    except Exception as e:
        print(f"[Lock] Warning: could not remove lock file: {e}")

# High-resolution image helper
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

# Curated High-Definition Unsplash Pool (>=1600px wide, Rights-cleared for editorial web use)
CATEGORY_HD_IMAGES = {
    "health": [
        {"url": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982", "photographer": "Unsplash Stock Illustration", "license": "Unsplash License", "topic": "public-health"},
        {"url": "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7", "photographer": "Unsplash Stock Illustration", "license": "Unsplash License", "topic": "heart-health"},
        {"url": "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9", "photographer": "Ella Olsson / Unsplash", "license": "Unsplash License", "topic": "nutrition"},
        {"url": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528", "photographer": "Unsplash Stock Illustration", "license": "Unsplash License", "topic": "diabetes"},
        {"url": "https://images.unsplash.com/photo-1530497610245-94d3c16cda28", "photographer": "Ani Kolleshi / Unsplash", "license": "Unsplash License", "topic": "air-pollution"},
        {"url": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d", "photographer": "Unsplash Stock Illustration", "license": "Unsplash License", "topic": "seasonal-illnesses"},
        {"url": "https://images.unsplash.com/photo-1527613426441-4da17471b66d", "photographer": "Unsplash Stock Illustration", "license": "Unsplash License", "topic": "womens-health"},
        {"url": "https://images.unsplash.com/photo-1516549655169-df83a0774514", "photographer": "Unsplash Stock Illustration", "license": "Unsplash License", "topic": "mental-health"}
    ],
    "politics": [
        {"url": "https://images.unsplash.com/photo-1541872703-74c5e44368f9", "photographer": "Unsplash Stock Illustration", "license": "Unsplash License"},
        {"url": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f", "photographer": "Unsplash Stock Illustration", "license": "Unsplash License"},
        {"url": "https://images.unsplash.com/photo-1532375810709-75b1da00537c", "photographer": "Unsplash Stock Illustration", "license": "Unsplash License"},
        {"url": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7", "photographer": "Unsplash Stock Illustration", "license": "Unsplash License"}
    ],
    "markets": [
        {"url": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3", "photographer": "Unsplash Stock Illustration", "license": "Unsplash License"},
        {"url": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f", "photographer": "Unsplash Stock Illustration", "license": "Unsplash License"},
        {"url": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e", "photographer": "Unsplash Stock Illustration", "license": "Unsplash License"}
    ],
    "tech": [
        {"url": "https://images.unsplash.com/photo-1518770660439-4636190af475", "photographer": "Unsplash Stock Illustration", "license": "Unsplash License"},
        {"url": "https://images.unsplash.com/photo-1677442136019-21780ecad995", "photographer": "Unsplash Stock Illustration", "license": "Unsplash License"},
        {"url": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b", "photographer": "Unsplash Stock Illustration", "license": "Unsplash License"}
    ],
    "world": [
        {"url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa", "photographer": "Unsplash Stock Illustration", "license": "Unsplash License"},
        {"url": "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4", "photographer": "Unsplash Stock Illustration", "license": "Unsplash License"}
    ],
    "sports": [
        {"url": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e", "photographer": "Unsplash Stock Illustration", "license": "Unsplash License"},
        {"url": "https://images.unsplash.com/photo-1531415074868-036b1c57e329", "photographer": "Unsplash Stock Illustration", "license": "Unsplash License"}
    ],
    "entertainment": [
        {"url": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba", "photographer": "Unsplash Stock Illustration", "license": "Unsplash License"}
    ],
    "ramayana": [
        {"url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220", "photographer": "Unsplash Stock Illustration", "license": "Unsplash License"}
    ]
}

# Strictly separated English and Hindi feeds per category so languages never mix
FEEDS = {
    "health": {
        "en": [
            "https://news.google.com/rss/search?q=ICMR+health+India+when:3d&hl=en-IN&gl=IN&ceid=IN:en",
            "https://news.google.com/rss/search?q=%22Ministry+of+Health%22+India+when:3d&hl=en-IN&gl=IN&ceid=IN:en",
            "https://news.google.com/rss/search?q=%22air+pollution%22+OR+%22AQI%22+Delhi+when:2d&hl=en-IN&gl=IN&ceid=IN:en",
            "https://aninews.in/rss/feed/category/health.xml",
        ],
        "hi": [
            "https://news.google.com/rss/headlines/section/topic/HEALTH?hl=hi&gl=IN&ceid=IN:hi",
        ],
    },
    "politics": {
        "en": [
            "https://news.google.com/rss/headlines/section/topic/NATION?hl=en-IN&gl=IN&ceid=IN:en",
            "https://aninews.in/rss/feed/category/national.xml",
        ],
        "hi": [
            "https://news.google.com/rss/headlines/section/topic/NATION?hl=hi&gl=IN&ceid=IN:hi",
        ],
    },
    "tech": {
        "en": [
            "https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-IN&gl=IN&ceid=IN:en",
            "https://aninews.in/rss/feed/category/tech.xml",
        ],
        "hi": [
            "https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=hi&gl=IN&ceid=IN:hi",
        ],
    },
    "world": {
        "en": [
            "https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-IN&gl=IN&ceid=IN:en",
            "https://aninews.in/rss/feed/category/world.xml",
        ],
        "hi": [
            "https://news.google.com/rss/headlines/section/topic/WORLD?hl=hi&gl=IN&ceid=IN:hi",
        ],
    },
    "sports": {
        "en": [
            "https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-IN&gl=IN&ceid=IN:en",
            "https://aninews.in/rss/feed/category/sports.xml",
        ],
        "hi": [
            "https://news.google.com/rss/headlines/section/topic/SPORTS?hl=hi&gl=IN&ceid=IN:hi",
        ],
    },
    "entertainment": {
        "en": [
            "https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=en-IN&gl=IN&ceid=IN:en",
        ],
        "hi": [
            "https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=hi&gl=IN&ceid=IN:hi",
        ],
    },
    "ramayana": {
        "en": [
            "https://news.google.com/rss/search?q=Ramayana+culture+India+when:7d&hl=en-IN&gl=IN&ceid=IN:en",
        ],
        "hi": [
            "https://news.google.com/rss/search?q=%E0%A4%B0%E0%A4%BE%E0%A4%AE%E0%A4%BE%E0%A4%AF%E0%A4%A3&hl=hi&gl=IN&ceid=IN:hi",
        ],
    },
}

FEED_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
}

ARTICLE_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
}

try:
    from googlenewsdecoder import gnewsdecoder
except ImportError:
    gnewsdecoder = None

try:
    from bs4 import BeautifulSoup
except ImportError:
    BeautifulSoup = None

def clean_html(text):
    if not text:
        return ""
    clean = text.replace("\u2028", " ").replace("\u2029", " ")
    clean = re.sub(r'<[^>]+>', ' ', clean)
    clean = re.sub(r'&[a-zA-Z0-9#]+;', ' ', clean)
    clean = re.sub(r'\s+', ' ', clean)
    return clean.strip()

# Collision-Proof Slug Generation
def make_slug(title, category="news", art_id=0):
    clean = re.sub(r'[^a-zA-Z0-9\s-]', '', title).strip().lower()
    clean = re.sub(r'[-\s]+', '-', clean).strip('-')
    
    # If title was Hindi or non-latin characters, clean is empty
    if len(clean) < 8 or clean.startswith(("dainik-", "jagran", "aajtak", "india-tv", "news18", "bbc", "hindustan")):
        # Calculate consistent character checksum from title
        h = abs(hash(title)) % 100000
        clean = f"{category}-breaking-report-{h}-{art_id}"
    
    slug = f"{clean[:70].strip('-')}-2026"
    return slug

def detect_health_topic(title, desc):
    text = f"{title} {desc}".lower()
    if any(k in text for k in ["aqi", "air pollution", "smog", "pollution", "cpcb", "air quality", "pm2.5"]):
        return "air-pollution"
    elif any(k in text for k in ["dengue", "malaria", "chikungunya", "viral", "influenza", "fever", "seasonal"]):
        return "seasonal-illnesses"
    elif any(k in text for k in ["diabetes", "insulin", "blood sugar", "metabolic"]):
        return "diabetes"
    elif any(k in text for k in ["heart", "cardio", "hypertension", "blood pressure", "cardiac"]):
        return "heart-health"
    elif any(k in text for k in ["mental", "depression", "anxiety", "psychiatry", "stress"]):
        return "mental-health"
    elif any(k in text for k in ["diet", "nutrition", "food", "fssai", "vitamin", "protein"]):
        return "nutrition"
    elif any(k in text for k in ["women", "maternal", "pcos", "pregnancy", "breast cancer"]):
        return "womens-health"
    else:
        return "public-health"

def needs_medical_review(category, title, desc):
    if category != "health":
        return False
    text = f"{title} {desc}".lower()
    clinical_keywords = [
        "treatment", "dosage", "dosage", "drug", "medicine", "vaccine", "clinical trial",
        "symptoms", "therapy", "surgery", "diagnosis", "cure", "prescribe", "icmr study"
    ]
    return any(k in text for k in clinical_keywords)

def decode_source_url(url):
    if not url or "news.google.com" not in url:
        return url
    if gnewsdecoder is not None:
        try:
            res = gnewsdecoder(url, interval=0.5)
            if isinstance(res, dict) and (res.get("success") or res.get("status")) and res.get("decoded_url"):
                return res["decoded_url"]
        except Exception:
            pass
    return url

NOISE_PHRASES = (
    "इमेज स्रोत", "image caption", "copyright", "all rights reserved",
    "subscribe", "also read", "read more:", "advertisement", "cookie",
    "follow us on", "download app", "click here", "sign up"
)

def extract_source_content_and_image(url):
    """Fetch original og:image and full article paragraphs from the decoded source URL."""
    if not url or "news.google.com" in url or "zestfeedx.com" in url:
        return "", []
    bad_patterns = ("google-news", "googleusercontent.com/s2", "gstatic.com", "favicon", "default-image", "placeholder", "/logo", "site-logo", "1x1", "pixel.gif")
    img_url = ""
    paragraphs = []
    try:
        req = urllib.request.Request(url, headers=ARTICLE_HEADERS)
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read(1500000).decode("utf-8", errors="ignore")
            if BeautifulSoup is not None:
                soup = BeautifulSoup(html, "html.parser")
                og = (
                    soup.find("meta", property="og:image")
                    or soup.find("meta", attrs={"name": "twitter:image"})
                    or soup.find("meta", attrs={"property": "twitter:image"})
                )
                if og and og.get("content"):
                    cand = og["content"].strip().replace("&amp;", "&")
                    if cand.startswith("//"):
                        cand = "https:" + cand
                    if cand.startswith("http") and not any(b in cand.lower() for b in bad_patterns):
                        img_url = to_hd_image(cand)

                for tag in soup(["script", "style", "nav", "footer", "aside"]):
                    tag.decompose()

                def extract_from(node):
                    out = []
                    seen_p = set()
                    for p in node.find_all(["p", "h2", "h3"]):
                        txt = p.get_text(" ", strip=True).replace("\u2028", " ").replace("\u2029", " ")
                        if len(txt) < 35:
                            continue
                        low = txt.lower()
                        if any(np in low for np in NOISE_PHRASES):
                            continue
                        if txt in seen_p:
                            continue
                        seen_p.add(txt)
                        out.append(f"### {txt}" if p.name in ("h2", "h3") else txt)
                    return out

                for cand_node in (soup.find("article"), soup.find("main"), soup):
                    if cand_node is not None:
                        paras = extract_from(cand_node)
                        if len(paras) >= 3:
                            break
            else:
                for pat in [
                    r'<meta[^>]+property=[\'"]og:image[\'"][^>]+content=[\'"]([^\'"]+)[\'"]',
                    r'<meta[^>]+content=[\'"]([^\'"]+)[\'"][^>]+property=[\'"]og:image[\'"]',
                ]:
                    og = re.search(pat, html, re.I)
                    if og:
                        cand = og.group(1).strip().replace("&amp;", "&")
                        if cand.startswith("//"):
                            cand = "https:" + cand
                        if cand.startswith("http") and not any(b in cand.lower() for b in bad_patterns):
                            img_url = to_hd_image(cand)
                            break
    except Exception:
        pass
    return img_url, paragraphs[:30]

def download_source_image_local(img_url, slug):
    if not img_url or not img_url.startswith("http"):
        return ""
    try:
        images_dir = os.path.join(BASE_DIR, "frontend", "public", "images", "articles")
        os.makedirs(images_dir, exist_ok=True)
        req = urllib.request.Request(img_url, headers=ARTICLE_HEADERS)
        with urllib.request.urlopen(req, timeout=10) as resp:
            ctype = resp.headers.get("Content-Type", "").lower()
            if resp.status != 200 or "image" not in ctype:
                return ""
            data = resp.read(5 * 1024 * 1024)
            if len(data) < 5000:
                return ""
            ext = ".webp" if "webp" in ctype else (".png" if "png" in ctype else ".jpg")
            safe_slug = re.sub(r'[^a-zA-Z0-9_-]', '', slug)[:80] or "article"
            filename = f"{safe_slug}{ext}"
            with open(os.path.join(images_dir, filename), "wb") as f:
                f.write(data)
            return f"/images/articles/{filename}"
    except Exception:
        return ""

def get_existing_metadata():
    if not os.path.exists(SEED_FILE):
        return set(), set(), set(), 100
    with open(SEED_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    slugs = set(re.findall(r'["\']?slug["\']?:\s*[`"\']([^`"\']+)[`"\']', content))
    titles = set(re.findall(r'["\']?original_title["\']?:\s*[`"\']([^`"\']+)[`"\']', content))
    images = set(re.findall(r'["\']?image_url["\']?:\s*[`"\']([^`"\']+)[`"\']', content))
    ids = [int(x) for x in re.findall(r'["\']?id["\']?:\s*(\d+)', content)]
    max_id = max(ids) if ids else 100
    return slugs, titles, images, max_id

def fetch_feed_items(url, category, error_log):
    items = []
    try:
        req = urllib.request.Request(url, headers=FEED_HEADERS)
        with urllib.request.urlopen(req, timeout=10) as resp:
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

                img_url = ""
                enclosure = it.find('enclosure')
                if enclosure is not None and 'url' in enclosure.attrib:
                    img_url = enclosure.attrib['url']

                src = it.find('source')
                source_name = src.text.strip() if src is not None and src.text else "Official Wire"
                lower_link = link.lower()
                if "pib.gov.in" in lower_link:
                    source_name = "Press Information Bureau (PIB)"
                elif "icmr.gov.in" in lower_link or "icmr" in title.lower():
                    source_name = "Indian Council of Medical Research (ICMR)"
                elif "thehindu.com" in lower_link:
                    source_name = "The Hindu"
                elif "indianexpress.com" in lower_link:
                    source_name = "The Indian Express"
                elif "timesofindia" in lower_link:
                    source_name = "The Times of India"
                elif "aninews.in" in lower_link:
                    source_name = "ANI News"

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
        error_msg = f"Failed fetching feed {url}: {e}"
        print(f"[Scraper] {error_msg}")
        error_log.append({
            "timestamp": format_ist(),
            "source": url,
            "error": str(e)
        })
    return items

def build_complete_article(art_id, item, seen_images):
    raw_title = item["title"]
    clean_title = re.sub(r'^[\"\']|[\"\']$', '', raw_title)
    clean_title = re.sub(r'\s*-\s*(ANI News|The Hindu|The Times of India|NDTV|BBC|Reuters|Business Standard|Rediff|News On AIR|DD News|PIB).*$', '', clean_title).strip()
    category = item["category"]
    slug = make_slug(clean_title, category, art_id)
    
    img = item.get("img", "")
    source_url = decode_source_url(item.get("link", ""))
    source_name = item.get("source_name", "Official Wire")
    topic = detect_health_topic(clean_title, item.get("desc", "")) if category == "health" else ""
    is_med_review = needs_medical_review(category, clean_title, item.get("desc", ""))

    # 1. Fetch original source image (og:image / twitter:image) AND full article paragraphs
    extracted_img, extracted_paras = extract_source_content_and_image(source_url)
    if not img and extracted_img:
        img = extracted_img
    if img and img.startswith("http"):
        local_img = download_source_image_local(img, slug)
        if local_img:
            img = local_img

    # 2. Fallback ONLY within the SAME category pool (never cross-contaminate e.g. health image on ramayana)
    seen_bases = {u.split("?")[0] for u in seen_images}
    img_meta = None
    if not img or img.split("?")[0] in seen_bases:
        pool = CATEGORY_HD_IMAGES.get(category, CATEGORY_HD_IMAGES["politics"])
        selected = next((c for c in pool if c["url"].split("?")[0] not in seen_bases), pool[art_id % len(pool)])
        base_url = selected["url"].split('?')[0]
        img = f"{base_url}?auto=format&fit=crop&w=1600&q=85"
        img_meta = selected
    
    seen_images.add(img)

    photographer = img_meta["photographer"] if img_meta else f"{source_name}"
    img_license = img_meta["license"] if img_meta else "External Source Attribution"

    is_hindi = bool(re.search(r'[\u0900-\u097F]', clean_title))
    now_iso = now_utc().strftime("%Y-%m-%dT%H:%M:%SZ")
    desc_text = (item.get("desc") or "").strip()
    if not desc_text or desc_text.lower() == clean_title.lower():
        desc_text = clean_title

    body_text = "\n\n".join(extracted_paras) if extracted_paras else desc_text
    word_count = max(1, len(body_text.split()))
    read_mins = max(1, round(word_count / 200))

    if is_hindi:
        why_it_matters = f"{category.capitalize()} श्रेणी से जुड़ी यह रिपोर्ट {source_name} के प्राथमिक समाचार बुलेटिन पर आधारित है।"
        who_is_affected = "संबंधित पाठक, नागरिक एवं नीति-निर्माता।"
        readers_searching = f"पाठक {clean_title} से जुड़ी आधिकारिक जानकारी और ताज़ा अपडेट देख रहे हैं।"
        content_markdown = f"""{body_text}

---

**मूल स्रोत (Original Source):** [{source_name}]({source_url})"""
        summary_text = (extracted_paras[0] if extracted_paras and not extracted_paras[0].startswith("###") else desc_text)[:240]
    else:
        why_it_matters = f"Full report attributed to {source_name}."
        who_is_affected = "Readers tracking verified news updates across India."
        readers_searching = f"Complete coverage and source attribution for {clean_title}."
        content_markdown = f"""{body_text}

---

**Original Source:** [{source_name}]({source_url})"""
        summary_text = (extracted_paras[0] if extracted_paras and not extracted_paras[0].startswith("###") else desc_text)[:240]

    article_obj = {
        "id": art_id,
        "title": clean_title,
        "slug": slug,
        "original_title": clean_title,
        "category": category,
        "topic": topic,
        "language": "hi" if is_hindi else "en",
        "fomo_badge": "स्वास्थ्य वायर" if (is_hindi and category == "health") else ("न्यूज़ वायर" if is_hindi else ("Health Wire" if category == "health" else "News Wire")),
        "read_time": f"{read_mins} min read",
        "views_count": 0,
        "shares_count": 0,
        "published_at": now_iso,
        "updated_at": now_iso,
        "source_name": source_name,
        "source_url": source_url,
        "source_courtesy": f"Source: {source_name}",
        "image_url": img,
        "image_alt": clean_title,
        "image_courtesy": f"Image: {photographer} ({img_license})",
        "image_photographer": photographer,
        "image_license": img_license,
        "fact_check_status": "Wire Summary — Attributed to Primary Source",
        "tags": f"{category.title()}, News, India",
        "summary": summary_text,
        "content": content_markdown,
        "title_en": "" if is_hindi else clean_title,
        "summary_en": "" if is_hindi else summary_text,
        "content_en": "" if is_hindi else content_markdown,
        "title_hi": clean_title if is_hindi else "",
        "summary_hi": summary_text if is_hindi else "",
        "content_hi": content_markdown if is_hindi else "",
        "author_name": "ZestFeedX न्यूज़ डेस्क" if is_hindi else "ZestFeedX Wire Desk",
        "author_bio": "Aggregated wire summary attributed to primary news sources." if not is_hindi else "प्राथमिक समाचार स्रोतों पर आधारित संपादकीय वायर डेस्क।",
        "author_url": "https://zestfeedx.com/about/",
        "medical_reviewed": False,
        "medical_reviewer_name": "",
        "medical_reviewer_credentials": "",
        "why_it_matters_today": why_it_matters,
        "who_is_affected": who_is_affected,
        "what_readers_are_searching_for": readers_searching,
        "primary_source": source_name
    }
    return article_obj

# Load and Save Queue
def load_queue():
    if not os.path.exists(QUEUE_FILE):
        return {"collected": [], "approved": [], "published_history": []}
    try:
        with open(QUEUE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {"collected": [], "approved": [], "published_history": []}

def save_queue(queue_data):
    try:
        with open(QUEUE_FILE, "w", encoding="utf-8") as f:
            json.dump(queue_data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"[Queue] Error saving queue: {e}")

# Load and Update Status
def update_status(status_update):
    current = {}
    if os.path.exists(STATUS_FILE):
        try:
            with open(STATUS_FILE, "r", encoding="utf-8") as f:
                current = json.load(f)
        except Exception:
            current = {}
    current.update(status_update)
    try:
        with open(STATUS_FILE, "w", encoding="utf-8") as f:
            json.dump(current, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"[Status] Error saving status: {e}")

def main():
    print("=" * 65)
    print("🚀 ZESTFEEDX RESILIENT PUBLISHING & HEALTH LEAD ENGINE")
    print("=" * 65)

    if not acquire_lock():
        sys.exit(0)

    recent_errors = []
    published_count = 0

    try:
        existing_slugs, existing_titles, existing_images, max_id = get_existing_metadata()
        seen_images = set(existing_images)
        queue = load_queue()

        print(f"Loaded {len(existing_slugs)} published articles. Current max ID: {max_id}")
        print(f"Queue Status: {len(queue.get('approved', []))} approved pending, {len(queue.get('collected', []))} collected.")

        # Step 1: Collect fresh stories from feeds
        print("\n--- PHASE 1: STORY COLLECTION & VERIFICATION ---")
        current_id = max_id + 1
        collected_this_run = []

        for cat, lang_feeds in FEEDS.items():
            for lang in ("en", "hi"):
                urls = lang_feeds.get(lang, [])
                if not urls:
                    continue
                print(f"Checking {cat.upper()} [{lang.upper()}] ({len(urls)} feeds)...")
                lang_collected = 0
                for url in urls:
                    items = fetch_feed_items(url, cat, recent_errors)
                    for item in items:
                        title = item["title"]
                        has_devanagari = bool(re.search(r'[\u0900-\u097F]', title))
                        # Enforce strict language separation at ingestion time
                        if lang == "en" and has_devanagari:
                            continue
                        if lang == "hi" and not has_devanagari:
                            continue

                        if title in existing_titles or any(c["title"] == title for c in queue.get("collected", [])):
                            continue

                        test_slug = make_slug(title, cat, current_id)
                        if test_slug in existing_slugs or any(a.get("slug") == test_slug for a in queue.get("approved", [])):
                            continue

                        art = build_complete_article(current_id, item, seen_images)
                        collected_this_run.append(art)
                        existing_slugs.add(art["slug"])
                        existing_titles.add(title)
                        current_id += 1
                        lang_collected += 1
                        print(f"  ✓ Collected: [{cat.upper()}/{lang.upper()}] {art['title'][:60]}... ({art['source_name']})")

                        if lang_collected >= 2:
                            break
                    if lang_collected >= 2:
                        break

        # Step 2: Editorial Approval Pipeline
        print(f"\n--- PHASE 2: EDITORIAL APPROVAL & SCHEDULING ({len(collected_this_run)} items) ---")
        now_dt = now_utc()
        approved_items = queue.get("approved", [])

        for art in collected_this_run:
            # Set scheduled publishing time: immediately or at target 10:00 AM IST slot
            art["scheduled_for"] = now_dt.strftime("%Y-%m-%dT%H:%M:%SZ")
            art["editorial_approved"] = True
            art["approved_at"] = now_dt.strftime("%Y-%m-%dT%H:%M:%SZ")
            approved_items.append(art)
            print(f"  ✓ Approved: {art['slug']} (Scheduled for: {art['scheduled_for']})")

        queue["approved"] = approved_items

        # Step 3: Process Overdue & Scheduled Publishing
        print("\n--- PHASE 3: SCHEDULED PUBLISHING & RETRY PROCESSING ---")
        now_iso = now_utc().strftime("%Y-%m-%dT%H:%M:%SZ")
        to_publish = []
        remaining_approved = []

        for item in approved_items:
            # If item scheduled_for <= now, publish it! (Guarantees missed runs are processed immediately)
            if item.get("scheduled_for", "") <= now_iso:
                to_publish.append(item)
            else:
                remaining_approved.append(item)

        if to_publish:
            print(f"Publishing {len(to_publish)} approved stories (including overdue queue)...")
            # Format into TypeScript blocks
            new_blocks = []
            for art in to_publish:
                block = "  {\n"
                for k, v in art.items():
                    if k in ["editorial_approved", "approved_at", "scheduled_for"]:
                        continue # Internal queue fields
                    if isinstance(v, bool):
                        block += f"    {k}: {'true' if v else 'false'},\n"
                    elif isinstance(v, (int, float)):
                        block += f"    {k}: {v},\n"
                    elif isinstance(v, str):
                        clean_str = v.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
                        block += f"    {k}: `{clean_str}`,\n"
                block += "  },"
                new_blocks.append(block)

            insert_str = "\n".join(new_blocks) + "\n"

            # Prepend into SEED_ARTICLES
            with open(SEED_FILE, "r", encoding="utf-8") as f:
                old_content = f.read()

            pattern = r'(export const SEED_ARTICLES: Article\[\] = \[\s*)'
            updated_content = re.sub(pattern, r'\1\n' + insert_str, old_content, count=1)

            with open(SEED_FILE, "w", encoding="utf-8") as f:
                f.write(updated_content)

            published_count = len(to_publish)
            print(f"✅ Successfully wrote {published_count} new articles to {SEED_FILE}")

            # Keep published history
            queue["published_history"] = (queue.get("published_history", []) + [a["slug"] for a in to_publish])[-100:]
            queue["approved"] = remaining_approved
            save_queue(queue)

            # Step 4: Advance Festival Previews & Fast Cricket Monitoring
            print("\n--- PHASE 4: FESTIVAL CALENDAR & CRICKET MONITOR ---")
            try:
                fest_script = os.path.join(SCRIPTS_DIR, "festival_publisher.py")
                if os.path.exists(fest_script):
                    subprocess.run([sys.executable, fest_script], check=False)
            except Exception as e:
                print(f"[Festival Publisher] Notice: {e}")

            try:
                cricket_script = os.path.join(SCRIPTS_DIR, "cricket_monitor.py")
                if os.path.exists(cricket_script):
                    subprocess.run([sys.executable, cricket_script], check=False)
            except Exception as e:
                print(f"[Cricket Monitor] Notice: {e}")

            # Step 5: Regenerate sitemaps & feeds
            print("\n--- PHASE 5: SITEMAP & DISCOVERY CACHE REFRESH ---")
            gen_script = os.path.join(SCRIPTS_DIR, "generate_news_sitemap.js")
            if os.path.exists(gen_script):
                subprocess.run(["node", gen_script], check=False)
            
            # Step 6: Instant Engine Submission (IndexNow & Google)
            idx_script = os.path.join(SCRIPTS_DIR, "auto_submit_search_console.js")
            if os.path.exists(idx_script):
                subprocess.run(["node", idx_script], check=False)

        else:
            print("No items scheduled for publication in this exact window.")
            save_queue(queue)

        # Calculate next scheduled run in IST
        now_i = now_ist()
        # Next hourly slot at :25, and owner's fixed daily slot at 10:00 AM IST
        next_hourly = (now_i + timedelta(hours=1)).replace(minute=25, second=0, microsecond=0)
        daily_10am = now_i.replace(hour=10, minute=0, second=0, microsecond=0)
        if now_i >= daily_10am:
            daily_10am += timedelta(days=1)

        next_str = f"{format_ist(next_hourly)} (Hourly slot) & {format_ist(daily_10am)} (Owner 10:00 AM slot)"

        update_status({
            "last_run_at": now_utc().strftime("%Y-%m-%dT%H:%M:%SZ"),
            "last_run_ist": format_ist(),
            "next_scheduled_run_ist": next_str,
            "timezone": "Asia/Kolkata (IST, UTC+05:30)",
            "configured_daily_time_ist": "10:00 AM IST",
            "status": "healthy" if len(recent_errors) < 3 else "warning",
            "approved_queue_size": len(queue.get("approved", [])),
            "published_count": len(existing_slugs) + published_count,
            "failure_count": len(recent_errors),
            "recent_errors": recent_errors[-10:],
            "last_run_summary": f"Published {published_count} new articles. {len(queue.get('approved', []))} items currently in approved queue."
        })

        print(f"\n🎉 Publishing cycle completed! Published: {published_count}, Queue: {len(queue.get('approved', []))}")

    finally:
        release_lock()

    return published_count

if __name__ == "__main__":
    main()
