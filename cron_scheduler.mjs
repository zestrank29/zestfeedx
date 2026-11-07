/**
 * ZestFeedX Hourly Cron Scheduler (Node.js)
 * Configured to execute the fetch_and_publish trigger exactly every 60 minutes (0 * * * *)
 */

const API_ENDPOINT = process.env.API_ENDPOINT || "http://127.0.0.1:8000/api/scrape/trigger";

async function executeFetchAndPublish() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ⏰ Executing hourly fetch_and_publish (0 * * * *)...`);
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    if (response.ok) {
      const data = await response.json();
      console.log(`[${timestamp}] ✅ fetch_and_publish completed:`, data);
    } else {
      console.error(`[${timestamp}] ❌ Trigger returned status ${response.status}`);
    }
  } catch (error) {
    console.error(`[${timestamp}] ❌ Error running fetch_and_publish:`, error.message);
  }
}

// Function to calculate ms until next hour (0 * * * *)
function scheduleNextHourlyRun() {
  const now = new Date();
  const nextHour = new Date(now);
  nextHour.setHours(now.getHours() + 1, 0, 0, 0);
  const delay = nextHour.getTime() - now.getTime();

  console.log(`🚀 [Cron Scheduler] Initialized. Next hourly run scheduled in ${Math.round(delay / 1000 / 60)} minutes (0 * * * *).`);

  setTimeout(() => {
    executeFetchAndPublish();
    // Run every 60 minutes thereafter
    setInterval(executeFetchAndPublish, 60 * 60 * 1000);
  }, delay);
}

scheduleNextHourlyRun();

