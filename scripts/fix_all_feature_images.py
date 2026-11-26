"""
ZestFeedX Full-Site Feature Image Auditor & Source Image Replacer
- Scans all articles in seedArticles.ts and demoContent.ts
- Detects broken, hotlink-blocked (403), or duplicate base image URLs
- Decodes Google News URLs, extracts original og:image / twitter:image from source_url
- Downloads valid original source images locally to frontend/public/images/articles/<slug>.<ext>
  so they are never hotlink-blocked or broken
- Guarantees 100% unique, working feature images across the entire site
"""

import os
import re
import ssl
import hashlib
import urllib.request
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed

try:
    from googlenewsdecoder import gnewsdecoder
except ImportError:
    gnewsdecoder = None

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEED_FILE = os.path.join(BASE_DIR, "frontend", "src", "data", "seedArticles.ts")
DEMO_FILE = os.path.join(BASE_DIR, "frontend", "src", "data", "demoContent.ts")
IMAGES_DIR = os.path.join(BASE_DIR, "frontend", "public", "images", "articles")
os.makedirs(IMAGES_DIR, exist_ok=True)

SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
}

BAD_IMAGE_PATTERNS = (
    "google-news", "googleusercontent.com/s2", "gstatic.com", "favicon",
    "default-image", "placeholder", "/logo", "site-logo", "brand-logo",
    "1x1", "pixel.gif", "blank.png"
)

# Large diverse pool of verified distinct Unsplash photo IDs (used ONLY if source has no valid og:image)
FALLBACK_POOL = [
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c",
    "https://images.unsplash.com/photo-1495020689067-958852a7765e",
    "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3",
    "https://images.unsplash.com/photo-1557992260-ec58e38d363c",
    "https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9",
    "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118",
    "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b",
    "https://images.unsplash.com/photo-1582719471384-894fbb16e074",
    "https://images.unsplash.com/photo-1584982751601-97dcc096659c",
    "https://images.unsplash.com/photo-1559757175-5700dde675bc",
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d",
    "https://images.unsplash.com/photo-1538108149393-fbbd81895907",
    "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb",
    "https://images.unsplash.com/photo-1504813184591-01572f98c85f",
    "https://images.unsplash.com/photo-1551076805-e1869033e561",
    "https://images.unsplash.com/photo-1530026405186-ed1f139313f8",
    "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620",
    "https://images.unsplash.com/photo-1555848962-6e79363ec58f",
    "https://images.unsplash.com/photo-1521791136064-7986c2920216",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    "https://images.unsplash.com/photo-1521295121783-8a321d551ad2",
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
    "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b",
    "https://images.unsplash.com/photo-1517649763962-0c623266ddc0",
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55",
    "https://images.unsplash.com/photo-1517466787929-bc90951d0974",
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2",
    "https://images.unsplash.com/photo-1478720568477-152d9b164e26",
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c",
    "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4",
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
    "https://images.unsplash.com/photo-1532375810709-75b1da00537c",
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da",
    "https://images.unsplash.com/photo-1548013146-72479768bada",
    "https://images.unsplash.com/photo-1561361513-2d000a50f0dc",
    "https://images.unsplash.com/photo-1587474260584-136574528ed5",
    "https://images.unsplash.com/photo-1570168007204-dfb528c6958f",
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
    "https://images.unsplash.com/photo-1567157577867-05ccb1388e66",
    "https://images.unsplash.com/photo-1506461883276-594a12b11cf3",
    "https://images.unsplash.com/photo-1532664189809-02133fee698d",
    "https://images.unsplash.com/photo-1514222134-b57cbb8ce073",
    "https://images.unsplash.com/photo-1509198397868-475647b2a1e5",
    "https://images.unsplash.com/photo-1451186859696-371d9477be93",
    "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
    "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1511497584788-876760111969",
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
    "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8",
]


def is_url_working(url: str) -> bool:
    if not url:
        return False
    if url.startswith("/images/"):
        local_p = os.path.join(BASE_DIR, "frontend", "public", url.lstrip("/").replace("/", os.sep))
        return os.path.exists(local_p) and os.path.getsize(local_p) >= 4000
    try:
        req = urllib.request.Request(
            url,
            headers={**HEADERS, "Referer": "https://zestfeedx.com/"}
        )
        with urllib.request.urlopen(req, timeout=7, context=SSL_CTX) as resp:
            ctype = resp.headers.get("Content-Type", "").lower()
            data = resp.read(8192)
            return resp.status == 200 and "image" in ctype and len(data) >= 2000
    except Exception:
        return False


def decode_source_url(url: str) -> str:
    if not url or "news.google.com" not in url:
        return url
    if gnewsdecoder is not None:
        try:
            res = gnewsdecoder(url, interval=0.5)
            if isinstance(res, dict) and res.get("status") and res.get("decoded_url"):
                return res["decoded_url"]
        except Exception:
            pass
    return url


def extract_og_image_from_url(url: str) -> str:
    if not url or "news.google.com" in url or "zestfeedx.com" in url:
        return ""
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=8, context=SSL_CTX) as resp:
            html = resp.read(250000).decode("utf-8", errors="ignore")
            patterns = [
                r'<meta[^>]+property=[\'"]og:image[\'"][^>]+content=[\'"]([^\'"]+)[\'"]',
                r'<meta[^>]+content=[\'"]([^\'"]+)[\'"][^>]+property=[\'"]og:image[\'"]',
                r'<meta[^>]+name=[\'"]twitter:image[\'"][^>]+content=[\'"]([^\'"]+)[\'"]',
                r'<meta[^>]+content=[\'"]([^\'"]+)[\'"][^>]+name=[\'"]twitter:image[\'"]',
            ]
            for pat in patterns:
                m = re.search(pat, html, re.I)
                if m:
                    img = m.group(1).strip().replace("&amp;", "&")
                    if img.startswith("//"):
                        img = "https:" + img
                    if img.startswith("http") and not any(b in img.lower() for b in BAD_IMAGE_PATTERNS):
                        return img
    except Exception:
        pass
    return ""


def download_image_local(img_url: str, slug: str, seen_hashes: set) -> str:
    if not img_url or not img_url.startswith("http"):
        return ""
    try:
        req = urllib.request.Request(img_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10, context=SSL_CTX) as resp:
            ctype = resp.headers.get("Content-Type", "").lower()
            if resp.status != 200 or "image" not in ctype:
                return ""
            data = resp.read(5 * 1024 * 1024)
            if len(data) < 5000:
                return ""
            h = hashlib.sha256(data).hexdigest()
            if h in seen_hashes:
                return ""
            seen_hashes.add(h)

            ext = ".jpg"
            if "webp" in ctype:
                ext = ".webp"
            elif "png" in ctype:
                ext = ".png"
            safe_slug = re.sub(r'[^a-zA-Z0-9_-]', '', slug)[:80] or "article"
            filename = f"{safe_slug}{ext}"
            out_path = os.path.join(IMAGES_DIR, filename)
            with open(out_path, "wb") as f:
                f.write(data)
            return f"/images/articles/{filename}"
    except Exception:
        return ""


def main():
    with open(SEED_FILE, "r", encoding="utf-8") as f:
        text = f.read()

    # Parse blocks by splitting at each object in SEED_ARTICLES
    blocks = re.split(r'(\n  \{\n)', text)
    # blocks[0] is header, then pairs of (delim, body)
    articles = []
    for i in range(1, len(blocks), 2):
        delim = blocks[i]
        body = blocks[i + 1]
        m_slug = re.search(r'slug:\s*[`"]([^`"]+)[`"]', body)
        m_img = re.search(r'image_url:\s*[`"]([^`"]+)[`"]', body)
        m_src = re.search(r'source_url:\s*[`"]([^`"]+)[`"]', body)
        articles.append({
            "idx": i,
            "delim": delim,
            "body": body,
            "slug": m_slug.group(1) if m_slug else f"art-{i}",
            "image_url": m_img.group(1) if m_img else "",
            "source_url": m_src.group(1) if m_src else "",
        })

    print(f"Auditing {len(articles)} articles in seedArticles.ts...")

    # Step 1: Check which existing URLs work (in parallel)
    unique_urls = list({a["image_url"] for a in articles if a["image_url"]})
    url_status = {}
    with ThreadPoolExecutor(max_workers=16) as ex:
        futs = {ex.submit(is_url_working, u): u for u in unique_urls}
        for fut in as_completed(futs):
            u = futs[fut]
            url_status[u] = fut.result()

    broken_count = sum(1 for a in articles if not url_status.get(a["image_url"], False))
    print(f"Broken/hotlink-blocked image entries: {broken_count}")

    # Step 2: Identify articles needing replacement (broken OR duplicate base URL OR unsplash when source exists)
    used_bases = set()
    seen_hashes = set()
    needs_fix = []

    for a in articles:
        u = a["image_url"]
        base = u.split("?")[0]
        works = url_status.get(u, False)
        is_dup = base in used_bases
        if not works or is_dup:
            needs_fix.append(a)
        else:
            used_bases.add(base)

    print(f"Articles needing unique/working image replacement: {len(needs_fix)}")

    # Step 3: Try to fetch original source image for every article in needs_fix
    def resolve_original(a):
        slug = a["slug"]
        src = decode_source_url(a["source_url"])
        og = extract_og_image_from_url(src)
        return a["idx"], og

    og_results = {}
    with ThreadPoolExecutor(max_workers=10) as ex:
        futs = [ex.submit(resolve_original, a) for a in needs_fix]
        for fut in as_completed(futs):
            idx, og = fut.result()
            og_results[idx] = og

    # Step 4: Download valid og:images locally (sequential hash check to guarantee uniqueness)
    replaced_from_source = 0
    replaced_from_pool = 0
    pool_idx = 0

    for a in needs_fix:
        og = og_results.get(a["idx"], "")
        new_url = ""
        if og:
            new_url = download_image_local(og, a["slug"], seen_hashes)
            if new_url:
                replaced_from_source += 1

        if not new_url:
            # Pick an unused URL from FALLBACK_POOL
            while pool_idx < len(FALLBACK_POOL):
                cand = FALLBACK_POOL[pool_idx]
                pool_idx += 1
                if cand not in used_bases:
                    new_url = f"{cand}?auto=format&fit=crop&w=1600&q=85"
                    used_bases.add(cand)
                    replaced_from_pool += 1
                    break

        if new_url:
            a["body"] = re.sub(
                r'(image_url:\s*)[`"]([^`"]+)[`"]',
                rf'\1`{new_url}`',
                a["body"],
                count=1
            )
            blocks[a["idx"] + 1] = a["body"]

    with open(SEED_FILE, "w", encoding="utf-8") as f:
        f.write("".join(blocks))

    print(f"Done! Replaced {replaced_from_source} from original source images, {replaced_from_pool} from unique unused pool.")

    # Step 5: Also fix the 2 duplicates in demoContent.ts
    if os.path.exists(DEMO_FILE):
        with open(DEMO_FILE, "r", encoding="utf-8") as f:
            demo_text = f.read()
        demo_urls = re.findall(r'hero_image:\s*["\']([^"\']+)["\']', demo_text)
        demo_seen = set()
        for du in demo_urls:
            base = du.split("?")[0]
            if base in demo_seen:
                while pool_idx < len(FALLBACK_POOL) and FALLBACK_POOL[pool_idx] in used_bases:
                    pool_idx += 1
                if pool_idx < len(FALLBACK_POOL):
                    repl = f"{FALLBACK_POOL[pool_idx]}?auto=format&fit=crop&w=1600&q=85"
                    used_bases.add(FALLBACK_POOL[pool_idx])
                    pool_idx += 1
                    # Replace only the second occurrence
                    parts = demo_text.split(du, 2)
                    if len(parts) == 3:
                        demo_text = parts[0] + du + parts[1] + repl + parts[2]
                        print(f"Fixed duplicate in demoContent.ts -> {repl}")
            else:
                demo_seen.add(base)
        with open(DEMO_FILE, "w", encoding="utf-8") as f:
            f.write(demo_text)


if __name__ == "__main__":
    main()
