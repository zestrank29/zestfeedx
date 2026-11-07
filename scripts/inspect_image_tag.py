import urllib.request
import xml.etree.ElementTree as ET

url = "https://aninews.in/rss/feed/category/national.xml"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
with urllib.request.urlopen(req, timeout=12) as resp:
    root = ET.fromstring(resp.read())
    items = root.find('channel').findall('item')
    for i, it in enumerate(items[:3]):
        img_elem = it.find('image')
        print(f"Item {i}: img_elem = {img_elem}")
        if img_elem is not None:
            print("  image text:", img_elem.text)
            print("  image attrib:", img_elem.attrib)
            for sub in img_elem:
                print(f"    subtag: {sub.tag}, text: {sub.text}")
        print("  link:", it.find('link').text)

