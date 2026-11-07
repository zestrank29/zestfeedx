import urllib.request

test_paths = [
    "https://aninews.in/media/details/__sized__/ANI-20241022093617-thumbnail-320x180-70.jpg",
    "https://d3lzcn6mbbadaf.cloudfront.net/media/details/__sized__/ANI-20241022093617-thumbnail-320x180-70.jpg",
    "https://aninews.in/media/details/ANI-20241022093617.jpg",
    "https://d3lzcn6mbbadaf.cloudfront.net/media/details/ANI-20241022093617.jpg"
]

for p in test_paths:
    req = urllib.request.Request(p, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            print(f"[{resp.status}] {p} - size: {len(resp.read())}")
    except Exception as e:
        print(f"[FAIL] {p} -> {e}")

