import urllib.request, json, ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = [
    'https://zestfeedx.com/',
    'https://zestfeedx.com/category/cricket/',
    'https://zestfeedx.com/category/festivals/',
    'https://zestfeedx.com/category/health/',
    'https://zestfeedx.com/article/constitution-day-2026-in-india-date-history-and-significance-of-samvidhan-divas-2026/',
    'https://zestfeedx.com/article/us-thanksgiving-2026-date-origins-and-how-it-is-observed-2026/',
    'https://zestfeedx.com/article/guru-nanak-jayanti-2026-gurpurab-date-akhand-path-and-sacred-traditions-2026/',
    'https://zestfeedx.com/api/admin/publishing-status/'
]

for url in urls:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req, timeout=20, context=ctx) as resp:
            content = resp.read().decode('utf-8', errors='ignore')
            print(f'STATUS {resp.status} for {url} ({len(content)} bytes)')
            if 'admin' in url:
                data = json.loads(content)
                print(f"  [Admin Telemetry] events: {len(data.get('calendar_events', []))}, alerts: {len(data.get('alerts', []))}, cricket_feed: {data.get('cricket_telemetry', {}).get('active_match_feed')}")
            elif 'constitution-day' in url:
                has_event_date = 'November 26, 2026' in content
                has_badge = 'Advance Verified Preview' in content
                has_file_photo = 'File Photo' in content
                print(f"  [Article Check] Event Date in body: {has_event_date}, Badge: {has_badge}, File photo label: {has_file_photo}")
            elif url == 'https://zestfeedx.com/':
                has_cricket_nav = '/category/cricket/' in content
                has_health_nav = '/category/health/' in content
                has_festivals_nav = '/category/festivals/' in content
                has_drawer = 'mobile-categories-drawer' in content
                print(f"  [Home Header Check] Cricket link: {has_cricket_nav}, Health link: {has_health_nav}, Festivals link: {has_festivals_nav}, Drawer id: {has_drawer}")
    except Exception as e:
        print(f'FAILED {url}: {e}')
