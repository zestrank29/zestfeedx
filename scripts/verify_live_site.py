import urllib.request
import re
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache"
}

def check_url(url):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            status = resp.status
            html = resp.read().decode('utf-8', errors='ignore')
            return status, html
    except Exception as e:
        return 0, str(e)

def main():
    endpoints = [
        ("Homepage", "https://zestfeedx.com/"),
        ("Health Category", "https://zestfeedx.com/category/health/"),
        ("Cricket Category", "https://zestfeedx.com/category/cricket/"),
        ("Markets Category", "https://zestfeedx.com/category/markets/"),
        ("Tech Category", "https://zestfeedx.com/category/tech/"),
        ("India Category", "https://zestfeedx.com/category/india/"),
        ("Admin Status", "https://zestfeedx.com/admin/publishing-status/"),
        ("News Sitemap", "https://zestfeedx.com/news-sitemap.xml"),
    ]

    print("Verifying live endpoints...")
    for label, url in endpoints:
        status, html = check_url(url)
        print(f"[{label}] {url} -> Status {status}, Length: {len(html)}")
        
        # Check specific strings
        if "Health" in label:
            has_lead = "delhi-ncr-air-quality-severe" in html or "AQI 428" in html or "GRAP-IV" in html
            print(f"  -> Health Lead Article present: {has_lead}")
        elif "Cricket" in label:
            has_lead = "border-gavaskar-trophy-2026-perth-test" in html or "Jaiswal" in html
            print(f"  -> Cricket Lead Article present: {has_lead}")
        elif "Admin" in label:
            has_reg = "Source Registry" in html or "gemini-1.5-flash" in html or "Times of India" in html
            print(f"  -> Admin Telemetry present: {has_reg}")
        elif "Homepage" in label:
            has_fresh = "delhi-ncr-air-quality-severe" in html or "Jaiswal" in html
            print(f"  -> Fresh Stories on Homepage: {has_fresh}")

if __name__ == "__main__":
    main()
