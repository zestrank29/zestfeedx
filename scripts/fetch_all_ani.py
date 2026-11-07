import urllib.request
import xml.etree.ElementTree as ET
import json
import re

feeds = {
    "politics": "https://aninews.in/rss/feed/category/national.xml",
    "entertainment": "https://aninews.in/rss/feed/category/entertainment.xml",
    "world": "https://aninews.in/rss/feed/category/world.xml",
    "sports": "https://aninews.in/rss/feed/category/sports.xml",
    "health": "https://aninews.in/rss/feed/category/health.xml",
    "tech": "https://aninews.in/rss/feed/category/tech.xml"
}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
all_stories = {}

for cat, url in feeds.items():
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=12) as resp:
            root = ET.fromstring(resp.read())
            items = root.find('channel').findall('item')
            stories = []
            for it in items:
                title = it.find('title').text.strip() if it.find('title') is not None and it.find('title').text else ""
                link = it.find('link').text.strip() if it.find('link') is not None and it.find('link').text else ""
                desc = it.find('description').text.strip() if it.find('description') is not None and it.find('description').text else ""
                pubDate = it.find('pubDate').text.strip() if it.find('pubDate') is not None and it.find('pubDate').text else ""
                
                # Image extraction
                img_url = ""
                img_elem = it.find('image')
                if img_elem is not None:
                    u = img_elem.find('url')
                    if u is not None and u.text:
                        raw_u = u.text.strip()
                        # try full res
                        full_u = re.sub(r'__sized__/', '', raw_u)
                        full_u = re.sub(r'-thumbnail-\d+x\d+-\d+', '', full_u)
                        if not raw_u.startswith('http'):
                            img_url = f"https://d3lzcn6mbbadaf.cloudfront.net/{raw_u}"
                            high_res = f"https://d3lzcn6mbbadaf.cloudfront.net/{full_u}"
                        else:
                            img_url = raw_u
                            high_res = full_u
                stories.append({
                    "title": title,
                    "link": link,
                    "desc": desc,
                    "pubDate": pubDate,
                    "img_thumb": img_url,
                    "img_highres": high_res if img_url else ""
                })
            all_stories[cat] = stories
            print(f"[{cat}] Found {len(stories)} stories. Sample 1st: {stories[0]['title'][:60]} | Img: {stories[0]['img_thumb'][:60]}")
    except Exception as e:
        print(f"Error on {cat}: {e}")

with open("scripts/ani_full_stories.json", "w", encoding="utf-8") as f:
    json.dump(all_stories, f, indent=2)
print("Saved to scripts/ani_full_stories.json")

