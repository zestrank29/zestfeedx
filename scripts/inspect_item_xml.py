import urllib.request
import xml.etree.ElementTree as ET

url = "https://aninews.in/rss/feed/category/national.xml"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
with urllib.request.urlopen(req, timeout=12) as resp:
    root = ET.fromstring(resp.read())
    item = root.find('channel').find('item')
    print("Tags in item:")
    for child in item:
        print(f"  Tag: {child.tag}, attribs: {child.attrib}, text snippet: {(child.text or '')[:100]}")

