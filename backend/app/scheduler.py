import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from app.scrapers.news_aggregator import fetch_and_publish

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("zestfeedx_scheduler")

scheduler = AsyncIOScheduler()

async def scheduled_scraping_job():
    logger.info("⏰ [Cron Scheduler] Executing 60-Minute Curiosity AI Fetch & Publish (0 * * * *)...")
    try:
        result = await fetch_and_publish()
        logger.info(f"✅ [Cron Scheduler] Pipeline execution completed successfully: {result}")
    except Exception as e:
        logger.error(f"❌ [Cron Scheduler] Pipeline execution failed: {e}", exc_info=True)

def start_scheduler():
    """
    Cron Scheduler: Configured to execute the fetch_and_publish function
    exactly every 60 minutes at minute 0 (0 * * * *).
    """
    scheduler.add_job(
        scheduled_scraping_job,
        trigger=CronTrigger.from_crontab("0 * * * *"),
        id="hourly_fetch_and_publish",
        name="Hourly News Scraper & Dual-Language Rewriter",
        replace_existing=True
    )
    scheduler.start()
    logger.info("🚀 [Scheduler] ZestFeedX 60-Minute Cron (0 * * * *) started successfully!")

def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown()
        logger.info("🛑 [Scheduler] ZestFeedX Cron Scheduler stopped.")
