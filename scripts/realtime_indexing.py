"""
ZestFeedX Real-Time Search Engine Indexing Engine
Implements:
1. Google Indexing API (URL_UPDATED notifications)
2. Bing Webmaster Batch Submission API
3. IndexNow Protocol (Instant Bing, Yandex, Seznam indexing)
4. Automated Search Engine Sitemap Pings (Fallback)
"""

import os
import sys
import json
import urllib.request
import urllib.error

INDEXNOW_KEY = "zf98b2c451da74e6f8319a2e37bc901a"
INDEXNOW_HOST = "zestfeedx.com"
INDEXNOW_KEY_LOCATION = f"https://{INDEXNOW_HOST}/{INDEXNOW_KEY}.txt"
INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow"

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVICE_ACCOUNT_PATH = os.path.join(BASE_DIR, "config", "google-service-account.json")

def get_google_access_token():
    """Extract and refresh OAuth2 bearer token from service account."""
    try:
        from google.oauth2 import service_account
        from google.auth.transport.requests import Request
    except ImportError:
        print("[Indexing] google-auth library not installed. Skipping Google Indexing API.")
        return None

    sa_file = None
    if os.path.exists(SERVICE_ACCOUNT_PATH):
        sa_file = SERVICE_ACCOUNT_PATH
    elif os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON"):
        sa_content = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON")
        temp_file = os.path.join(BASE_DIR, "config", "temp-sa.json")
        os.makedirs(os.path.dirname(temp_file), exist_ok=True)
        with open(temp_file, "w", encoding="utf-8") as f:
            f.write(sa_content)
        sa_file = temp_file

    if not sa_file or not os.path.exists(sa_file):
        return None

    try:
        creds = service_account.Credentials.from_service_account_file(
            sa_file,
            scopes=["https://www.googleapis.com/auth/indexing"]
        )
        creds.refresh(Request())
        return creds.token
    except Exception as e:
        print(f"[Google Indexing API] Token generation notice: {e}")
        return None

def submit_to_google(url, action="URL_UPDATED"):
    """POST to Google Indexing API v3 publish endpoint."""
    token = get_google_access_token()
    if not token:
        print(f"[Google Indexing API] Service account not configured. Skipping {url}")
        return False

    api_url = "https://indexing.googleapis.com/v3/urlNotifications:publish"
    payload = json.dumps({
        "url": url,
        "type": action
    }).encode("utf-8")

    req = urllib.request.Request(
        api_url,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read().decode("utf-8")
            print(f"[Google Indexing API] ✅ {resp.status} OK: Submitted {url}")
            return True
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        print(f"[Google Indexing API] HTTP {e.code} for {url}: {body}")
        return False
    except Exception as e:
        print(f"[Google Indexing API] Submission error for {url}: {e}")
        return False

def submit_to_bing(urls):
    """POST to Bing Webmaster batch submission endpoint."""
    api_key = os.environ.get("BING_API_KEY") or os.environ.get("BING_WEBMASTER_API_KEY")
    if not api_key:
        print("[Bing Webmaster API] BING_API_KEY not configured. Skipping Bing API batch.")
        return False

    url_list = urls if isinstance(urls, list) else [urls]
    api_url = f"https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey={api_key}"
    payload = json.dumps({
        "siteUrl": "https://zestfeedx.com/",
        "urlList": url_list
    }).encode("utf-8")

    req = urllib.request.Request(
        api_url,
        data=payload,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            print(f"[Bing Webmaster API] ✅ {resp.status} OK: Submitted {len(url_list)} URL(s)")
            return True
    except Exception as e:
        print(f"[Bing Webmaster API] Submission notice: {e}")
        return False

def submit_to_indexnow(urls):
    """POST to IndexNow API (Bing, Yandex, Seznam instant crawl notification)."""
    url_list = urls if isinstance(urls, list) else [urls]
    if not url_list:
        return True

    payload = json.dumps({
        "host": INDEXNOW_HOST,
        "key": INDEXNOW_KEY,
        "keyLocation": INDEXNOW_KEY_LOCATION,
        "urlList": url_list
    }).encode("utf-8")

    req = urllib.request.Request(
        INDEXNOW_ENDPOINT,
        data=payload,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            if resp.status in (200, 202):
                print(f"[IndexNow API] ✅ {resp.status} OK: Successfully submitted {len(url_list)} URL(s)")
                return True
            else:
                print(f"[IndexNow API] Status {resp.status}")
                return False
    except Exception as e:
        print(f"[IndexNow API] Submission notice: {e}")
        return False

def ping_sitemaps():
    """Ping search engine sitemap receivers."""
    sitemap_url = "https://zestfeedx.com/sitemap.xml"
    pings = [
        f"https://www.google.com/ping?sitemap={sitemap_url}",
        f"https://www.bing.com/ping?sitemap={sitemap_url}"
    ]
    for p in pings:
        try:
            req = urllib.request.Request(p, headers={"User-Agent": "ZestFeedX-Bot/2.0"})
            with urllib.request.urlopen(req, timeout=10) as resp:
                print(f"[Sitemap Ping] {p} -> HTTP {resp.status}")
        except Exception as e:
            print(f"[Sitemap Ping] {p} -> {e}")

def submit_urls_for_indexing(urls):
    """Orchestrates comprehensive multi-engine indexing."""
    url_list = urls if isinstance(urls, list) else [urls]
    print(f"\n⚡ INITIATING REAL-TIME SEARCH INDEXING FOR {len(url_list)} URL(S)...")

    # 1. Google Indexing API for each article
    for u in url_list:
        submit_to_google(u, action="URL_UPDATED")

    # 2. Bing Webmaster API
    submit_to_bing(url_list)

    # 3. IndexNow API
    submit_to_indexnow(url_list)

    # 4. Fallback sitemap pings
    ping_sitemaps()

    print("🏁 Real-time indexing requests completed.\n")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        target_urls = sys.argv[1:]
    else:
        # Default test ping with home and sample article
        target_urls = ["https://zestfeedx.com/"]
    submit_urls_for_indexing(target_urls)

