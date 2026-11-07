import urllib.request

endpoints = [
    "https://zestfeedx.com/article/sonia-gandhi-memoir-belonging-journey-love-politics-2026",
    "https://zestfeedx.com/article/nitesh-tiwari-4000-crore-ramayana-vfx-scriptural-fidelity-cinematic-epic-2026",
    "https://zestfeedx.com/news-sitemap.xml",
    "https://zestfeedx.com/rss-ramayana.xml",
    "https://zestfeedx.com/category/ramayana",
    "https://zestfeedx.com/category/politics"
]

for ep in endpoints:
    req = urllib.request.Request(ep, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            print(f"[{resp.status}] {ep}")
    except Exception as e:
        print(f"[FAIL] {ep} -> {e}")

