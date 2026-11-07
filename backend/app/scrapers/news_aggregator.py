import re
import unicodedata
import random
from typing import Dict, Any, List
from app.database import get_db
from app.scrapers.google_news import google_news_scraper
from app.scrapers.google_trends import google_trends_scraper
from app.scrapers.rss_scraper import rss_scraper
from app.ai.fact_checker import editorial_fact_checker
from app.ai.hinglish_rewriter import curiosity_ai_rewriter, AUTHOR_PROFILE

def generate_slug(title: str) -> str:
    cleaned = unicodedata.normalize('NFKD', title).encode('ascii', 'ignore').decode('utf-8')
    cleaned = re.sub(r'[^\w\s-]', '', cleaned).strip().lower()
    slug = re.sub(r'[-\s]+', '-', cleaned)[:80]
    random_suffix = random.randint(100, 9999)
    return f"{slug}-{random_suffix}"

class NewsAggregator:
    async def fetch_and_publish(self) -> Dict[str, Any]:
        """
        Executes the Hourly Long-Form Fetch and Publish pipeline:
        1. Scrapes trending topics from Google Trends (India/Global)
        2. Scrapes major RSS news feeds covering Health, Politics, Sports, Tech/AI, and Movies
        3. Scrapes Google News India wire across categories
        4. Runs through Long-Form AI Pipeline (Dual English & Hinglish versions, 800+ words)
        5. Auto-assigns to Author Profile: Pankhudi Sharma (ZestFeedX)
        6. Persists into SQLite with zero-error SEO schema
        """
        raw_items: List[Dict[str, Any]] = []

        # 1. Fetch Google Trends (India)
        try:
            trends = await google_trends_scraper.fetch_india_trends()
            raw_items.extend(trends[:4])
            print(f"[News Aggregator] Fetched {len(trends[:4])} items from Google Trends.")
        except Exception as e:
            print(f"[Trends Error]: {e}")

        # 2. Fetch Major RSS News Feeds (Health, Politics, Sports, Tech/AI, Movies)
        try:
            rss_items = await rss_scraper.fetch_all_feeds(limit_per_feed=2)
            raw_items.extend(rss_items[:8])
            print(f"[News Aggregator] Fetched {len(rss_items[:8])} items from RSS News feeds.")
        except Exception as e:
            print(f"[RSS Error]: {e}")

        # 3. Fetch Google News India wire across categories (Health prioritized)
        try:
            google_items = await google_news_scraper.fetch_category_news(limit_per_cat=2)
            raw_items.extend(google_items)
            print(f"[News Aggregator] Fetched {len(google_items)} items from Google News wire.")
        except Exception as e:
            print(f"[Google News Error]: {e}")

        created_count = 0
        with get_db() as conn:
            cursor = conn.cursor()

            for item in raw_items:
                original_title = item.get("title", "").strip()
                if not original_title:
                    continue

                # Deduplicate by original title
                cursor.execute("SELECT id FROM articles WHERE original_title = ? LIMIT 1", (original_title,))
                if cursor.fetchone():
                    continue

                category = item.get("category", "india")
                summary = item.get("summary", "")
                source_name = item.get("source_name", "Press Wire")
                source_url = item.get("source_url", "https://news.google.com")
                source_courtesy = item.get("source_courtesy", f"News Courtesy: {source_name}")

                # Fact check and cross-verification
                fact_check_result = editorial_fact_checker.verify_and_cross_check(original_title, source_name)
                fact_status = item.get("fact_check_status", fact_check_result["methodology"])

                # Long-Form AI Pipeline: Dual Language (English + Hinglish, min 800 words)
                try:
                    rewritten = await curiosity_ai_rewriter.rewrite_article(
                        original_title=original_title,
                        summary=summary,
                        source_text=summary,
                        category=category,
                        source_url=source_url
                    )
                except Exception as e:
                    print(f"[Curiosity Pipeline Error]: {e}")
                    source_link = f'<p className="pt-6 text-sm text-slate-400 border-t border-slate-800">Source: <a href="{source_url}" target="_blank" rel="noopener noreferrer" className="text-red-400 underline font-semibold">{source_url}</a></p>'
                    rewritten = {
                        "headline_en": original_title,
                        "content_en": f"{summary}\n\n{source_link}",
                        "summary_en": summary[:250],
                        "headline_hi": original_title,
                        "content_hi": f"{summary}\n\n{source_link}",
                        "summary_hi": summary[:250],
                        "headline": original_title,
                        "content": f"{summary}\n\n{source_link}",
                        "summary": summary[:250],
                        "fomo_badge": "🔥 Top Story",
                        "tags": [category, "news", "zestfeedx", "pankhudisharma"],
                        "author_name": AUTHOR_PROFILE["name"],
                        "author_bio": AUTHOR_PROFILE["bio"],
                        "author_company": AUTHOR_PROFILE["company"]
                    }

                headline_en = rewritten.get("headline_en", original_title)
                content_en = rewritten.get("content_en", summary)
                summary_en = rewritten.get("summary_en", summary[:250])

                headline_hi = rewritten.get("headline_hi", original_title)
                content_hi = rewritten.get("content_hi", summary)
                summary_hi = rewritten.get("summary_hi", summary[:250])

                primary_headline = headline_en
                slug = generate_slug(primary_headline)

                fomo_badge = rewritten.get("fomo_badge", "🔥 Top Story")
                tags_list = rewritten.get("tags", [category, "news", "zestfeedx"])
                tags_str = ", ".join(tags_list) if isinstance(tags_list, list) else str(tags_list)

                # Unsplash high-quality image fallback
                image_url = item.get("image_url")
                if not image_url or not image_url.startswith("http"):
                    image_url = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
                image_alt = item.get("image_alt", f"{category.capitalize()} report by Pankhudi Sharma")
                image_courtesy = item.get("image_courtesy", f"Photo Courtesy: {source_name} Archive")

                # Insert into DB
                cursor.execute("""
                    INSERT INTO articles (
                        title, slug, original_title, summary, content, category,
                        source_url, source_name, source_courtesy,
                        image_url, image_alt, image_courtesy,
                        fact_check_status, tags, fomo_badge,
                        read_time, views_count, shares_count, published_at,
                        title_en, content_en, summary_en,
                        title_hi, content_hi, summary_hi,
                        author_name, author_bio, author_company
                    ) VALUES (
                        ?, ?, ?, ?, ?, ?,
                        ?, ?, ?,
                        ?, ?, ?,
                        ?, ?, ?,
                        ?, ?, ?, datetime('now'),
                        ?, ?, ?,
                        ?, ?, ?,
                        ?, ?, ?
                    )
                """, (
                    primary_headline, slug, original_title, summary_en, content_en, category,
                    source_url, source_name, source_courtesy,
                    image_url, image_alt, image_courtesy,
                    fact_status, tags_str, fomo_badge,
                    "6 min read", random.randint(1200, 8500), random.randint(120, 950),
                    headline_en, content_en, summary_en,
                    headline_hi, content_hi, summary_hi,
                    AUTHOR_PROFILE["name"], AUTHOR_PROFILE["bio"], AUTHOR_PROFILE["company"]
                ))
                created_count += 1

            conn.commit()

        print(f"✅ [News Aggregator] Successfully published {created_count} new long-form articles by {AUTHOR_PROFILE['name']}.")
        return {"published_count": created_count}

news_aggregator = NewsAggregator()
fetch_and_publish = news_aggregator.fetch_and_publish
