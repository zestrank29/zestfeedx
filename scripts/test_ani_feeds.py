import urllib.request
import xml.etree.ElementTree as ET
import json

feeds = {
    "national": "https://aninews.in/rss/feed/category/national.xml",
    "entertainment": "https://aninews.in/rss/feed/category/entertainment.xml",
    "world": "https://aninews.in/rss/feed/category/world.xml",
    "sports": "https://aninews.in/rss/feed/category/sports.xml",
    "health": "https://aninews.in/rss/feed/category/health.xml",
    "tech": "https://aninews.in/rss/feed/category/tech.xml"
}

results = {}
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for cat, url in feeds.items():
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=12) as resp:
            content = resp.read()
            root = ET.fromstring(content)
            channel = root.find('channel')
            items = channel.findall('item')
            parsed = []
            for it in items[:4]:
                title = it.find('title').text if it.find('title') is not None else ""
                link = it.find('link').text if it.find('link') is not None else ""
                desc = it.find('description').text if it.find('description') is not None else ""
                pubDate = it.find('pubDate').text if it.find('pubDate') is not None else ""
                enclosure = it.find('enclosure')
                img = enclosure.attrib.get('url', '') if enclosure is not None else ""
                # Also check media:content or media:thumbnail if present
                for child in it:
                    if 'content' in child.tag or 'thumbnail' in child.tag:
                        if 'url' in child.attrib and not img:
                            img = child.attrib['url']
                parsed.append({
                    "title": title,
                    "link": link,
                    "img": img,
                    "pubDate": pubDate,
                    "desc_len": len(desc)
                })
            results[cat] = parsed
            print(f"[{cat}] Successfully fetched {len(items)} items. First image: {parsed[0]['img'] if parsed else 'None'}")
    except Exception as e:
        print(f"[{cat}] Error fetching {url}: {e}")

with open("scripts/ani_sample.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

