import urllib.request, ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

sample_images = [
    ("Aaj Tak", "https://akm-img-a-in.tosshub.com/aajtak/images/story/202611/6afdb90b77c1d-subhash-ahirwar-samay-raina-184114239.jpg"),
    ("Amar Ujala", "https://staticimg.amarujala.com/assets/images/2021/10/12/panchkula_1634042987.jpeg?w=1200&dpr=1.0"),
    ("The Hindu", "https://th-i.thgim.com/public/incoming/dvoaok/article71716515.ece/alternates/LANDSCAPE_1200/20261118109L.jpg"),
    ("Hindustan", "https://www.livehindustan.com/lh-img/smart/img/smart/2026/11/18/1600x900/logo/Cameron_Bancroft_on_Ball_Tampering_1794995413097_EuPc_1794995417687_1CNh_a5fc6aed-c2c3-413f-a603-bb8f17c3a446_UdDS.jpg"),
    ("Bhaskar", "https://images.bhaskarassets.com/thumb/730x0/web2images/521/2026/11/18/comp_1__17_1795021277199.gif"),
    ("Unsplash Tech", "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=85")
]

for label, url in sample_images:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://zestfeedx.com/"
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=8, context=ctx) as resp:
            content_type = resp.headers.get("Content-Type", "")
            print(f"[{label}] Status: {resp.status}, Content-Type: {content_type}, Length: {len(resp.read())}")
    except Exception as e:
        print(f"[{label}] FAILED with Referer https://zestfeedx.com/: {e}")
