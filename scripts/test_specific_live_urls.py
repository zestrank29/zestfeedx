import urllib.request

test_urls = [
    "https://zestfeedx.com/article/survey-of-the-affected-areas-is-being-conducted-karnataka-cm-siddaramiah-2026",
    "https://zestfeedx.com/article/pm-narendra-modi-welcomed-with-krishna-bhajan-upon-his-arrival-at-hotel-korston-in-2026",
    "https://zestfeedx.com/article/cricket-not-to-be-part-of-commowealth-games-2026-2026",
    "https://zestfeedx.com/news-sitemap.xml",
    "https://zestfeedx.com/rss-politics.xml",
    "https://zestfeedx.com/rss-world.xml"
]

for u in test_urls:
    req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            print(f"[{r.status}] {u}")
    except Exception as e:
        print(f"[FAIL] {u} -> {e}")

