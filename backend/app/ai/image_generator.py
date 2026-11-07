import os
import urllib.parse
import random
import httpx
from typing import Optional
from PIL import Image, ImageDraw, ImageFont

STATIC_IMAGES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "static", "images")
os.makedirs(STATIC_IMAGES_DIR, exist_ok=True)

class AIImageGenerator:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY", "")

    async def generate_and_save_thumbnail(self, keyword: str, slug: str, category: str = "viral") -> str:
        """
        Generates an AI image from the keyword, saves it locally as a JPEG thumbnail,
        and returns the relative URL `/static/images/{filename}`.
        """
        filename = f"{slug}.jpg"
        local_filepath = os.path.join(STATIC_IMAGES_DIR, filename)

        # Build optimized prompt for photorealistic AI imagery
        refined_prompt = (
            f"photorealistic 8k cinematic shot of {keyword}, dramatic neon lighting, vibrant cyber colors, "
            f"unreal engine 5 render, depth of field, high detail, trending, 16:9 aspect ratio"
        )

        # 1. Try Pollinations.ai (Instant real-time high-quality AI generator, no key needed!)
        success = await self._generate_via_pollinations(refined_prompt, local_filepath)
        if success and os.path.exists(local_filepath) and os.path.getsize(local_filepath) > 1024:
            return f"/static/images/{filename}"

        # 2. Try OpenAI DALL-E 3 if API key available
        if self.openai_api_key:
            try:
                success_dalle = await self._generate_via_dalle(refined_prompt, local_filepath)
                if success_dalle and os.path.exists(local_filepath) and os.path.getsize(local_filepath) > 1024:
                    return f"/static/images/{filename}"
            except Exception as e:
                print(f"[DALL-E Error]: {e}")

        # 3. Royalty-free curated tech/viral fallback or styled banner creation
        await self._create_styled_fallback_image(keyword, category, local_filepath)
        return f"/static/images/{filename}"

    async def _generate_via_pollinations(self, prompt: str, save_path: str) -> bool:
        encoded_prompt = urllib.parse.quote(prompt[:120])
        seed = random.randint(1000, 999999)
        url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1200&height=675&nologo=true&seed={seed}&model=flux"
        try:
            async with httpx.AsyncClient(timeout=25.0, follow_redirects=True) as client:
                resp = await client.get(url)
                if resp.status_code == 200 and len(resp.content) > 5000:
                    with open(save_path, "wb") as f:
                        f.write(resp.content)
                    return True
        except Exception as e:
            print(f"[Pollinations AI Error]: {e}")
        return False

    async def _generate_via_dalle(self, prompt: str, save_path: str) -> bool:
        async with httpx.AsyncClient(timeout=35.0) as client:
            resp = await client.post(
                "https://api.openai.com/v1/images/generations",
                headers={
                    "Authorization": f"Bearer {self.openai_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "dall-e-3",
                    "prompt": prompt,
                    "n": 1,
                    "size": "1024x1024",
                    "response_format": "url"
                }
            )
            if resp.status_code == 200:
                img_url = resp.json()["data"][0]["url"]
                img_resp = await client.get(img_url)
                if img_resp.status_code == 200:
                    with open(save_path, "wb") as f:
                        f.write(img_resp.content)
                    return True
        return False

    async def _create_styled_fallback_image(self, keyword: str, category: str, save_path: str):
        """
        Creates a high-resolution dark cyber gradient thumbnail with title overlay
        as guaranteed offline-resilient fallback.
        """
        width, height = 1200, 675
        colors = {
            "tech": ((10, 15, 30), (0, 240, 255)),
            "bollywood": ((30, 10, 25), (255, 0, 128)),
            "viral": ((20, 10, 35), (255, 90, 0)),
            "sports": ((10, 25, 20), (0, 255, 128)),
            "crypto": ((25, 20, 10), (255, 200, 0)),
            "desh": ((15, 20, 30), (255, 120, 0))
        }
        bg_color, accent_color = colors.get(category.lower(), ((15, 15, 25), (0, 200, 255)))

        img = Image.new("RGB", (width, height), color=bg_color)
        draw = ImageDraw.Draw(img)

        # Draw decorative cyber glow circles and grids
        for r in range(400, 50, -50):
            alpha = int(255 * (1 - r / 400) * 0.15)
            glow_color = (accent_color[0], accent_color[1], accent_color[2])
            draw.ellipse([width//2 - r, height//2 - r, width//2 + r, height//2 + r], outline=glow_color, width=2)

        # Draw border
        draw.rectangle([10, 10, width - 10, height - 10], outline=accent_color, width=3)

        # Draw text badge
        badge_text = f"BUZZNEWS EXCLUSIVE // {category.upper()}"
        draw.text((60, 60), badge_text, fill=accent_color)

        # Display topic
        topic_text = (keyword[:60] + "...") if len(keyword) > 60 else keyword
        draw.text((60, height - 120), topic_text.upper(), fill=(255, 255, 255))
        draw.text((60, height - 70), "🔥 VIRAL HINGLISH EDITION • LIVE REPORT", fill=(180, 180, 190))

        img.save(save_path, "JPEG", quality=85)

image_generator = AIImageGenerator()

