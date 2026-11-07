import feedparser
import httpx
from bs4 import BeautifulSoup
from typing import List, Dict, Any

RSS_FEEDS = [
    # Health Category (Aggressively targeted)
    {
        "url": "https://feeds.feedburner.com/ndtvhealth-latest",
        "category": "health",
        "name": "NDTV Health"
    },
    {
        "url": "https://timesofindia.indiatimes.com/rssfeeds/3908999.cms",
        "category": "health",
        "name": "TOI Health & Fitness"
    },
    # Tech & AI Feeds
    {
        "url": "https://techcrunch.com/category/artificial-intelligence/feed/",
        "category": "tech",
        "name": "TechCrunch AI"
    },
    {
        "url": "https://www.theverge.com/rss/index.xml",
        "category": "tech",
        "name": "The Verge"
    },
    # Politics & National
    {
        "url": "https://feeds.feedburner.com/ndtvnews-top-stories",
        "category": "india",
        "name": "NDTV News National"
    },
    {
        "url": "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms",
        "category": "india",
        "name": "Times of India Politics"
    },
    # Movies & Entertainment
    {
        "url": "https://feeds.feedburner.com/ndtvmovies-latest",
        "category": "entertainment",
        "name": "NDTV Movies"
    },
    {
        "url": "https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms",
        "category": "entertainment",
        "name": "TOI Entertainment"
    },
    # Sports
    {
        "url": "https://feeds.feedburner.com/ndtvsports-latest",
        "category": "sports",
        "name": "NDTV Sports"
    }
]

def clean_html(raw_html: str) -> str:
    if not raw_html:
        return ""
    soup = BeautifulSoup(raw_html, "html.parser")
    return soup.get_text().strip()

class RSSScraper:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }

    async def fetch_feed(self, feed_meta: Dict[str, str], limit: int = 5) -> List[Dict[str, Any]]:
        articles = []
        try:
            async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
                resp = await client.get(feed_meta["url"], headers=self.headers)
                if resp.status_code == 200:
                    parsed = feedparser.parse(resp.text)
                    for entry in parsed.entries[:limit]:
                        summary = clean_html(entry.get("summary", ""))
                        if not summary:
                            summary = entry.get("title", "")
                        
                        articles.append({
                            "title": entry.get("title", ""),
                            "original_title": entry.get("title", ""),
                            "summary": summary,
                            "category": feed_meta["category"],
                            "source_name": feed_meta["name"],
                            "source_url": entry.get("link", ""),
                            "published_at": entry.get("published", "")
                        })
        except Exception as e:
            print(f"Error fetching RSS {feed_meta['name']}: {e}")
        return articles

    async def fetch_all_feeds(self, limit_per_feed: int = 3) -> List[Dict[str, Any]]:
        all_articles = []
        for meta in RSS_FEEDS:
            articles = await self.fetch_feed(meta, limit=limit_per_feed)
            all_articles.extend(articles)
        return all_articles

rss_scraper = RSSScraper()
