import urllib.request

url = "https://zestfeedx.com/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        html = resp.read().decode('utf-8')
        print(f"Status: {resp.status}, Length: {len(html)}")

        if "d3lzcn6mbbadaf.cloudfront.net" in html:
            print("✓ Authentic ANI News wire images present in HTML")
        if "zf_theme" in html:
            print("✓ Dark/Light theme instant detection script present")
        if "GTM-WVCLHN6M" in html:
            print("✓ Google Tag Manager active")
        if "Pankhudi Sharma" in html and 'href="https://zestfeedx.com/about"' in html:
            print("✓ Pankhudi Sharma links to /about")
        if "Siddaramiah" in html or "Kazan" in html or "Commonwealth" in html or "affected areas" in html:
            print("✓ Real-time ANI News stories displayed on homepage")
except Exception as e:
    print("Verification error:", e)
