import feedparser
import httpx
from typing import List, Dict, Any

GOOGLE_TRENDS_IN_RSS = "https://trends.google.com/trending/rss?geo=IN"

class GoogleTrendsScraper:
    async def fetch_india_trends(self) -> List[Dict[str, Any]]:
        results = []
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.get(
                    GOOGLE_TRENDS_IN_RSS,
                    headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) BuzzNews/1.0"}
                )
                if resp.status_code == 200:
                    feed = feedparser.parse(resp.text)
                    for entry in feed.entries[:10]:
                        title = entry.get("title", "")
                        traffic = entry.get("ht_approx_traffic", "100K+ searches")
                        summary = entry.get("summary", "")
                        news_items = entry.get("ht_news_item", [])
                        
                        source_url = ""
                        source_snippet = summary
                        if isinstance(news_items, list) and len(news_items) > 0:
                            first_item = news_items[0]
                            if isinstance(first_item, dict):
                                source_url = first_item.get("ht_news_item_url", "")
                                source_snippet = first_item.get("ht_news_item_snippet", summary)

                        results.append({
                            "title": title,
                            "summary": f"{title} is currently trending with {traffic} in India. {source_snippet}",
                            "source_url": source_url or entry.get("link", ""),
                            "source_name": "Google Trends (India)",
                            "category": "viral"
                        })
        except Exception as e:
            print(f"[Google Trends Scraper Error]: {e}")
            
        return results

google_trends_scraper = GoogleTrendsScraper()

