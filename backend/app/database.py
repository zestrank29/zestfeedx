import sqlite3
import os
from contextlib import contextmanager
from typing import Generator

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "buzznews.db")

def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, timeout=30.0)
    conn.row_factory = sqlite3.Row
    return conn

@contextmanager
def get_db() -> Generator[sqlite3.Connection, None, None]:
    conn = get_db_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_db():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                original_title TEXT,
                content TEXT NOT NULL,
                summary TEXT,
                category TEXT NOT NULL DEFAULT 'india',
                source_url TEXT,
                source_name TEXT,
                source_courtesy TEXT DEFAULT 'Google News India',
                image_url TEXT,
                image_alt TEXT,
                image_courtesy TEXT DEFAULT 'Editorial Press Archive / Unsplash CC',
                image_prompt TEXT,
                tags TEXT,
                fomo_badge TEXT DEFAULT '🔥 Top Story',
                read_time TEXT DEFAULT '2 min read',
                views_count INTEGER DEFAULT 0,
                shares_count INTEGER DEFAULT 0,
                fact_check_status TEXT DEFAULT 'Verified by Editorial Desk',
                title_en TEXT,
                content_en TEXT,
                summary_en TEXT,
                title_hi TEXT,
                content_hi TEXT,
                summary_hi TEXT,
                author_name TEXT DEFAULT 'Pankhudi Sharma',
                author_bio TEXT DEFAULT 'Veteran media professional with over 15 years of experience in investigative journalism and digital storytelling, delivering high-impact news and trending global insights.',
                author_company TEXT DEFAULT 'ZestFeedX',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Add migration columns if they do not exist
        migration_columns = [
            ("source_courtesy", "TEXT DEFAULT 'Google News India'"),
            ("image_alt", "TEXT"),
            ("image_courtesy", "TEXT DEFAULT 'Editorial Press Archive / Unsplash CC'"),
            ("fact_check_status", "TEXT DEFAULT 'Verified by Editorial Desk'"),
            ("title_en", "TEXT"),
            ("content_en", "TEXT"),
            ("summary_en", "TEXT"),
            ("title_hi", "TEXT"),
            ("content_hi", "TEXT"),
            ("summary_hi", "TEXT"),
            ("author_name", "TEXT DEFAULT 'Pankhudi Sharma'"),
            ("author_bio", "TEXT DEFAULT 'Veteran media professional with over 15 years of experience in investigative journalism and digital storytelling, delivering high-impact news and trending global insights.'"),
            ("author_company", "TEXT DEFAULT 'ZestFeedX'")
        ]

        for col_name, col_type in migration_columns:
            try:
                cursor.execute(f"ALTER TABLE articles ADD COLUMN {col_name} {col_type}")
            except sqlite3.OperationalError:
                pass  # column already exists

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS scrape_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                source TEXT,
                items_scraped INTEGER,
                items_created INTEGER,
                status TEXT,
                error_message TEXT,
                ran_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
