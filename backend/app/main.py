import os
from contextlib import asynccontextmanager
from typing import Optional
from fastapi import FastAPI, Query, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

load_dotenv()

from app.database import init_db, get_db
from app.scheduler import start_scheduler, stop_scheduler
from app.scrapers.news_aggregator import news_aggregator

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema
    init_db()
    
    # Auto-seed if empty
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM articles")
        count = cursor.fetchone()[0]
        if count < 5:
            print("🌱 Initializing Buzz Engine seed articles...")
            await news_aggregator.run_pipeline()

    # Start 60-minute scheduler
    start_scheduler()
    yield
    stop_scheduler()

app = FastAPI(
    title="BuzzNews API - Viral Hinglish News Engine",
    description="Automated AI-powered 3D news aggregation and Hinglish rewriting platform.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static images
STATIC_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
os.makedirs(os.path.join(STATIC_DIR, "images"), exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.get("/api/health")
def health_check():
    return {"status": "ok", "engine": "BuzzNews Viral Engine 2.0"}

@app.get("/api/news")
def get_news(
    category: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(9, ge=1, le=50),
    search: Optional[str] = None
):
    offset = (page - 1) * limit
    params = []
    where_clauses = []

    if category and category.lower() != "all":
        where_clauses.append("category = ?")
        params.append(category.lower())

    if search:
        where_clauses.append("(title LIKE ? OR content LIKE ? OR tags LIKE ?)")
        search_pattern = f"%{search}%"
        params.extend([search_pattern, search_pattern, search_pattern])

    where_sql = ("WHERE " + " AND ".join(where_clauses)) if where_clauses else ""

    with get_db() as conn:
        cursor = conn.cursor()
        
        # Get total count
        count_query = f"SELECT COUNT(*) FROM articles {where_sql}"
        cursor.execute(count_query, params)
        total_items = cursor.fetchone()[0]

        # Get paginated articles
        query = f"""
            SELECT id, title, slug, summary, content, category,
                   source_url, source_name, source_courtesy, image_url, image_alt, image_courtesy,
                   fact_check_status, tags, fomo_badge, read_time, views_count, shares_count,
                   published_at, title_en, content_en, summary_en, title_hi, content_hi, summary_hi,
                   author_name, author_bio, author_company
            FROM articles
            {where_sql}
            ORDER BY published_at DESC
            LIMIT ? OFFSET ?
        """
        cursor.execute(query, params + [limit, offset])
        rows = cursor.fetchall()

        items = [dict(row) for row in rows]
        total_pages = (total_items + limit - 1) // limit

        return {
            "items": items,
            "total": total_items,
            "page": page,
            "limit": limit,
            "total_pages": total_pages,
            "has_more": page < total_pages
        }

@app.get("/api/news/{slug}")
def get_article_by_slug(slug: str):
    with get_db() as conn:
        cursor = conn.cursor()
        # Increment view count
        cursor.execute("UPDATE articles SET views_count = views_count + 1 WHERE slug = ?", (slug,))
        
        cursor.execute("""
            SELECT id, title, slug, original_title, summary, content, category,
                   source_url, source_name, source_courtesy, image_url, image_alt, image_courtesy,
                   image_prompt, fact_check_status, tags, fomo_badge, read_time, views_count,
                   shares_count, published_at, title_en, content_en, summary_en, title_hi, content_hi, summary_hi,
                   author_name, author_bio, author_company
            FROM articles
            WHERE slug = ?
            LIMIT 1
        """, (slug,))
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Article not found")

        article = dict(row)

        # Related articles
        cursor.execute("""
            SELECT id, title, slug, summary, category, image_url, fomo_badge, read_time
            FROM articles
            WHERE slug != ? AND (category = ? OR category = 'viral')
            ORDER BY published_at DESC
            LIMIT 3
        """, (slug, article["category"]))
        related = [dict(r) for r in cursor.fetchall()]

        return {
            "article": article,
            "related": related
        }

@app.get("/api/trending")
def get_trending_buzz():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, title, slug, summary, category, image_url, fomo_badge, read_time, views_count
            FROM articles
            ORDER BY views_count DESC, published_at DESC
            LIMIT 5
        """)
        breaking = [dict(r) for r in cursor.fetchall()]

        # Extract popular tags
        cursor.execute("SELECT tags FROM articles ORDER BY published_at DESC LIMIT 20")
        all_tags = set()
        for r in cursor.fetchall():
            if r["tags"]:
                for t in r["tags"].split(","):
                    cleaned = t.strip()
                    if cleaned and len(cleaned) > 2:
                        all_tags.add(cleaned)

        return {
            "breaking": breaking,
            "tags": list(all_tags)[:12]
        }

@app.post("/api/scrape/trigger")
async def trigger_scrape():
    """Manual trigger endpoint for testing or forced updates."""
    result = await news_aggregator.run_pipeline()
    return result

@app.get("/api/stats")
def get_buzz_stats():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM articles")
        total_articles = cursor.fetchone()[0]

        cursor.execute("SELECT SUM(views_count), SUM(shares_count) FROM articles")
        sums = cursor.fetchone()
        total_views = sums[0] or 0
        total_shares = sums[1] or 0

        cursor.execute("SELECT ran_at, items_created, status FROM scrape_logs ORDER BY ran_at DESC LIMIT 1")
        last_log = cursor.fetchone()

        return {
            "total_articles": total_articles,
            "total_views": total_views,
            "total_shares": total_shares,
            "last_scrape": dict(last_log) if last_log else None
        }

@app.get("/sitemap.xml")
def generate_sitemap():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT slug, published_at FROM articles ORDER BY published_at DESC LIMIT 100")
        rows = cursor.fetchall()

    base_url = "http://localhost:3000"
    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        f'  <url><loc>{base_url}/</loc><changefreq>hourly</changefreq><priority>1.0</priority></url>'
    ]

    for row in rows:
        slug = row["slug"]
        pub = row["published_at"] or "2026-11-02"
        xml_lines.append(f'  <url>')
        xml_lines.append(f'    <loc>{base_url}/article/{slug}</loc>')
        xml_lines.append(f'    <lastmod>{pub[:10]}</lastmod>')
        xml_lines.append(f'    <changefreq>daily</changefreq>')
        xml_lines.append(f'    <priority>0.8</priority>')
        xml_lines.append(f'  </url>')

    xml_lines.append('</urlset>')
    return Response(content="\n".join(xml_lines), media_type="application/xml")

@app.get("/robots.txt")
def generate_robots():
    content = "User-agent: *\nAllow: /\n\nSitemap: http://localhost:3000/sitemap.xml\n"
    return Response(content=content, media_type="text/plain")

