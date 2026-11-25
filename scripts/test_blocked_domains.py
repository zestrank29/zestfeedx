import urllib.request, ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

domains_to_test = [
    ("akm-img-a-in.tosshub.com", "https://akm-img-a-in.tosshub.com/aajtak/images/story/202611/6afdb90b77c1d-subhash-ahirwar-samay-raina-184114239.jpg"),
    ("images.bhaskarassets.com", "https://images.bhaskarassets.com/thumb/730x0/web2images/521/2026/11/18/comp_1__17_1795021277199.gif"),
    ("static.toiimg.com", "https://static.toiimg.com/thumb/msid-115456789,width-1070,height-580,imgsize-12345,resizemode-75,overlay-toi_sw,pt-32,y_pad-40/photo.jpg"),
    ("www.jagranimages.com", "https://www.jagranimages.com/images/newimg/18112026/18_11_2026-pm_modi_speech.jpg"),
    ("feeds.abplive.com", "https://feeds.abplive.com/onecms/images/uploaded-images/2026/11/18/smart-tv-buying-tips-tv-3.jpg")
]

for d, url in domains_to_test:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://zestfeedx.com/"
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=5, context=ctx) as resp:
            print(f"[{d}] Status: {resp.status}")
    except Exception as e:
        print(f"[{d}] BLOCKED / FAILED: {e}")
