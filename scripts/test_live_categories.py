import urllib.request
import re
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

categories = ['health', 'cricket', 'markets', 'tech', 'india', 'entertainment', 'politics', 'sports', 'world']

for cat in categories:
    url = f"https://zestfeedx.com/category/{cat}/"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            html = resp.read().decode('utf-8')
            # Extract links to /article/
            articles = re.findall(r'href=["\'](/article/[^"\']+)["\']', html)
            unique_articles = []
            for a in articles:
                if a not in unique_articles:
                    unique_articles.append(a)
            top_3 = unique_articles[:3] if unique_articles else []
            print(f"[{cat.upper()}] Top Article: {top_3[0] if top_3 else 'None'}")
            if len(top_3) > 1:
                print(f"  2nd: {top_3[1]}")
    except Exception as e:
        print(f"[{cat.upper()}] Error: {e}")
