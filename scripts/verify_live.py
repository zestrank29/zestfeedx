import urllib.request
import re
import xml.etree.ElementTree as ET

def check_page(url, name):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8')
            status = resp.status

            title_m = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE)
            title = title_m.group(1) if title_m else 'NO_TITLE'

            desc_m = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\']', html, re.IGNORECASE)
            if not desc_m:
                desc_m = re.search(r'<meta[^>]*content=["\']([^"\']*)["\'][^>]*name=["\']description["\']', html, re.IGNORECASE)
            meta_desc = desc_m.group(1) if desc_m else 'NO_DESC'

            canon_m = re.search(r'<link[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']*)["\']', html, re.IGNORECASE)
            canon = canon_m.group(1) if canon_m else 'NO_CANONICAL'

            h1_m = re.findall(r'<h1[^>]*>(.*?)</h1>', html, re.IGNORECASE | re.DOTALL)
            og_m = re.search(r'<meta[^>]*property=["\']og:title["\'][^>]*content=["\']([^"\']*)["\']', html, re.IGNORECASE)
            og = og_m.group(1) if og_m else 'NO_OG'

            tw_m = re.search(r'<meta[^>]*name=["\']twitter:card["\'][^>]*content=["\']([^"\']*)["\']', html, re.IGNORECASE)
            tw = tw_m.group(1) if tw_m else 'NO_TW'

            schema_org = 'NewsMediaOrganization' in html
            logo_present = 'favicon.ico' in html and '"ImageObject"' in html

            print(f"=== {name}: {url} ===")
            print(f"Status: {status}")
            print(f"Title ({len(title)} chars): {title}")
            print(f"Meta Desc ({len(meta_desc)} chars): {meta_desc[:65]}...")
            print(f"Canonical: {canon}")
            print(f"H1 Count: {len(h1_m)}")
            print(f"OG Title: {og[:45]}...")
            print(f"Twitter Card: {tw}")
            print(f"Organization Schema with Logo: {schema_org and logo_present}")
            print()
    except Exception as e:
        print(f"Error fetching {url}: {e}")

def check_sitemaps():
    print("=== SITEMAP VERIFICATION ===")
    req1 = urllib.request.Request('https://zestfeedx.com/sitemap.xml', headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req1, timeout=15) as resp:
            content = resp.read().decode('utf-8')
            root = ET.fromstring(content)
            urls = [elem.text for elem in root.iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
            has_en = 'https://zestfeedx.com/en/' in urls
            has_politics = 'https://zestfeedx.com/category/politics/' in urls
            has_ramayana = 'https://zestfeedx.com/category/ramayana/' in urls
            print(f"sitemap.xml Total URLs: {len(urls)}")
            print(f"sitemap.xml contains non-canonical /en/: {has_en} (MUST BE False)")
            print(f"sitemap.xml contains politics category: {has_politics} (MUST BE True)")
            print(f"sitemap.xml contains ramayana category: {has_ramayana} (MUST BE True)")
    except Exception as e:
        print(f"Error checking sitemap.xml: {e}")

    req2 = urllib.request.Request('https://zestfeedx.com/news-sitemap.xml', headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req2, timeout=15) as resp:
            content = resp.read().decode('utf-8')
            root = ET.fromstring(content)
            urls = [elem.text for elem in root.iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
            print(f"news-sitemap.xml Total URLs: {len(urls)} (Expected ~30-50, NOT 889!)")
    except Exception as e:
        print(f"Error checking news-sitemap.xml: {e}")

if __name__ == '__main__':
    check_page('https://zestfeedx.com/', 'HOMEPAGE')
    check_page('https://zestfeedx.com/explainers/', 'EXPLAINERS')
    check_page('https://zestfeedx.com/contact/', 'CONTACT')
    check_page('https://zestfeedx.com/advertise/', 'ADVERTISE')
    check_page('https://zestfeedx.com/terms/', 'TERMS')
    check_page('https://zestfeedx.com/copyright-disclaimer/', 'COPYRIGHT')
    check_page('https://zestfeedx.com/data/gold-silver-price-india/', 'GOLD DATA')
    check_sitemaps()
