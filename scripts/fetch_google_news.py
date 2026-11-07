import urllib.request
import xml.etree.ElementTree as ET
import json
import re

politics_url = "https://news.google.com/rss/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRFZxYUdjU0JXVnVMVWRDR2dKSlRpZ0FQAQ?hl=en-IN&gl=IN&ceid=IN:en"
ramayana_url = "https://news.google.com/rss/topics/CAAqJQgKIh9DQkFTRVFvSUwyMHZNR014ZDIwU0JXVnVMVWRDS0FBUAE?hl=en-IN&gl=IN&ceid=IN:en"

def fetch_feed(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    with urllib.request.urlopen(req, timeout=12) as resp:
        root = ET.fromstring(resp.read())
        items = root.find('channel').findall('item')
        parsed = []
        for it in items:
            title = it.find('title').text or ""
            link = it.find('link').text or ""
            pub = it.find('pubDate').text or ""
            desc = it.find('description').text or ""
            source = it.find('source').text if it.find('source') is not None else "Google News Wire"
            source_url = it.find('source').attrib.get('url', '') if it.find('source') is not None else ""
            parsed.append({
                "title": title,
                "link": link,
                "pubDate": pub,
                "desc": desc,
                "source": source,
                "source_url": source_url or link
            })
        return parsed

pol_items = fetch_feed(politics_url)
ram_items = fetch_feed(ramayana_url)

print(f"Fetched {len(pol_items)} politics items and {len(ram_items)} ramayana items.")

with open("scripts/fetched_feeds.json", "w", encoding="utf-8") as f:
    json.dump({"politics": pol_items[:10], "ramayana": ram_items[:10]}, f, indent=2)

print("Saved top items to scripts/fetched_feeds.json")

