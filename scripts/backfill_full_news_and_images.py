"""
Backfills all existing articles in seedArticles.ts:
1. Decodes Google News source_url (using res.get('success') or res.get('status'))
2. Fetches original og:image from source and saves locally to frontend/public/images/articles/<slug>.<ext>
3. Extracts full article paragraphs from source and updates short/boilerplate articles to full news
   with Original Source attribution at the end.
"""

import os
import re
import ssl
import hashlib
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from bs4 import BeautifulSoup
from googlenewsdecoder import gnewsdecoder

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEED_FILE = os.path.join(BASE_DIR, "frontend", "src", "data", "seedArticles.ts")
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

BAD_IMG = ("google-news", "googleusercontent.com/s2", "gstatic.com", "favicon", "default-image", "placeholder", "/logo", "site-logo", "1x1", "pixel.gif")
NOISE_PHRASES = (
    "इमेज स्रोत", "image caption", "copyright", "all rights reserved",
    "subscribe", "also read", "read more:", "advertisement", "cookie",
    "follow us on", "download app", "click here", "sign up"
)


def decode_url(url: str) -> str:
    if not url or "news.google.com" not in url:
        return url
    try:
        res = gnewsdecoder(url, interval=0.3)
        if isinstance(res, dict) and (res.get("success") or res.get("status")) and res.get("decoded_url"):
            return res["decoded_url"]
    except Exception:
        pass
    return url


def fetch_source_data(url: str):
    if not url or "news.google.com" in url or "zestfeedx.com" in url:
        return "", []
    img_url = ""
    paras = []
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10, context=SSL_CTX) as resp:
            html = resp.read(1500000).decode("utf-8", errors="ignore")
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
                if cand.startswith("http") and not any(b in cand.lower() for b in BAD_IMG):
                    img_url = cand

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
    except Exception:
        pass
    return img_url, paras[:30]


def download_local(img_url: str, slug: str, seen_hashes: set) -> str:
    if not img_url or not img_url.startswith("http"):
        return ""
    try:
        req = urllib.request.Request(img_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10, context=SSL_CTX) as resp:
            ct = resp.headers.get("Content-Type", "").lower()
            if resp.status != 200 or "image" not in ct:
                return ""
            data = resp.read(5 * 1024 * 1024)
            if len(data) < 5000:
                return ""
            h = hashlib.sha256(data).hexdigest()
            if h in seen_hashes:
                return ""
            seen_hashes.add(h)
            ext = ".webp" if "webp" in ct else (".png" if "png" in ct else ".jpg")
            safe_slug = re.sub(r'[^a-zA-Z0-9_-]', '', slug)[:80] or "article"
            fn = f"{safe_slug}{ext}"
            with open(os.path.join(IMAGES_DIR, fn), "wb") as f:
                f.write(data)
            return f"/images/articles/{fn}"
    except Exception:
        return ""


def escape_tpl(val: str) -> str:
    return (val or "").replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")


def replace_field(body: str, field: str, new_val: str) -> str:
    esc = escape_tpl(new_val)
    pat = re.compile(rf'(["\']?{field}["\']?:\s*)([`"\'])([\s\S]*?)\2')
    if pat.search(body):
        return pat.sub(lambda m: f"{m.group(1)}`{esc}`", body, count=1)
    return body


def main():
    with open(SEED_FILE, "r", encoding="utf-8") as f:
        text = f.read()

    # Match each top-level object block inside SEED_ARTICLES
    obj_re = re.compile(r'(\n  \{\r?\n)([\s\S]*?)(\r?\n  \},?)')
    matches = list(obj_re.finditer(text))
    print(f"Found {len(matches)} article blocks in seedArticles.ts")

    tasks = []
    for idx, m in enumerate(matches):
        body = m.group(2)
        m_slug = re.search(r'slug:\s*[`"]([^`"]+)[`"]', body)
        m_src = re.search(r'source_url:\s*[`"]([^`"]+)[`"]', body)
        m_img = re.search(r'image_url:\s*[`"]([^`"]+)[`"]', body)
        m_sname = re.search(r'source_name:\s*[`"]([^`"]+)[`"]', body)
        m_lang = re.search(r'language:\s*[`"]([^`"]+)[`"]', body)
        m_content = re.search(r'content:\s*([`"\'])([\s\S]*?)\1', body)

        slug = m_slug.group(1) if m_slug else f"art-{idx}"
        src = m_src.group(1) if m_src else ""
        img = m_img.group(1) if m_img else ""
        sname = m_sname.group(1) if m_sname else "News Source"
        lang = m_lang.group(1) if m_lang else "en"
        content = m_content.group(2) if m_content else ""

        if src and "zestfeedx.com" not in src:
            tasks.append((idx, slug, src, img, sname, lang, content))

    print(f"Fetching decoded source URLs, original images, and full text for {len(tasks)} external-source articles...")

    def process_one(item):
        idx, slug, src, img, sname, lang, content = item
        dec = decode_url(src)
        og_img, paras = fetch_source_data(dec)
        return idx, dec, og_img, paras

    results = {}
    with ThreadPoolExecutor(max_workers=10) as ex:
        futs = [ex.submit(process_one, t) for t in tasks]
        for fut in as_completed(futs):
            idx, dec, og_img, paras = fut.result()
            results[idx] = (dec, og_img, paras)

    seen_hashes = set()
    img_updated = 0
    content_updated = 0

    # Rebuild text from back to front using match spans
    out_parts = []
    last_end = 0
    for idx, m in enumerate(matches):
        out_parts.append(text[last_end:m.start()])
        head, body, tail = m.group(1), m.group(2), m.group(3)

        if idx in results:
            dec, og_img, paras = results[idx]
            m_slug = re.search(r'slug:\s*[`"]([^`"]+)[`"]', body)
            m_img = re.search(r'image_url:\s*[`"]([^`"]+)[`"]', body)
            m_sname = re.search(r'source_name:\s*[`"]([^`"]+)[`"]', body)
            m_lang = re.search(r'language:\s*[`"]([^`"]+)[`"]', body)
            m_content = re.search(r'content:\s*([`"\'])([\s\S]*?)\1', body)

            slug = m_slug.group(1) if m_slug else f"art-{idx}"
            cur_img = m_img.group(1) if m_img else ""
            sname = m_sname.group(1) if m_sname else "News Source"
            lang = m_lang.group(1) if m_lang else "en"
            cur_content = m_content.group(2) if m_content else ""

            if dec and dec != cur_img and "news.google.com" not in dec:
                body = replace_field(body, "source_url", dec)

            # Replace image if not already a local downloaded source image
            if og_img and not cur_img.startswith("/images/articles/"):
                local_p = download_local(og_img, slug, seen_hashes)
                if local_p:
                    body = replace_field(body, "image_url", local_p)
                    body = replace_field(body, "image_photographer", sname)
                    body = replace_field(body, "image_license", "Original Source Media")
                    body = replace_field(body, "image_courtesy", f"Image Courtesy: {sname}")
                    img_updated += 1

            # Replace short/boilerplate content with full extracted news
            is_boilerplate = any(k in cur_content for k in (
                "Wire Dispatch Summary", "मुख्य समाचार सारांश",
                "Strategic Overview & Legislative Framework",
                "Clinical & Epidemiological Background"
            )) or len(cur_content) < 700

            if paras and len(paras) >= 3 and is_boilerplate:
                full_body = "\n\n".join(paras)
                src_label = "मूल स्रोत (Original Source)" if lang == "hi" else "Original Source"
                final_md = f"{full_body}\n\n---\n\n**{src_label}:** [{sname}]({dec})"
                wc = max(1, len(full_body.split()))
                mins = max(1, round(wc / 200))
                first_p = next((p for p in paras if not p.startswith("### ")), paras[0])[:240]

                body = replace_field(body, "content", final_md)
                body = replace_field(body, "content_hi" if lang == "hi" else "content_en", final_md)
                body = replace_field(body, "summary", first_p)
                body = replace_field(body, "summary_hi" if lang == "hi" else "summary_en", first_p)
                body = replace_field(body, "read_time", f"{mins} min read")
                content_updated += 1

        out_parts.append(head + body + tail)
        last_end = m.end()

    out_parts.append(text[last_end:])
    with open(SEED_FILE, "w", encoding="utf-8") as f:
        f.write("".join(out_parts))

    print(f"Backfill complete! Updated {img_updated} original source images and {content_updated} full-length articles.")


if __name__ == "__main__":
    main()
