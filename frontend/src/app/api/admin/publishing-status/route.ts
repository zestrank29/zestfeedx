import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const STATUS_FILE = path.join(process.cwd(), "src/data/publishing_status.json");
const QUEUE_FILE = path.join(process.cwd(), "src/data/publishing_queue.json");

export async function GET(req: NextRequest) {
  try {
    let statusData = {
      last_run_at: new Date().toISOString(),
      last_run_ist: "Not yet run",
      next_scheduled_run_ist: "10:00 AM IST",
      timezone: "Asia/Kolkata (IST, UTC+05:30)",
      configured_daily_time_ist: "10:00 AM IST",
      status: "healthy",
      approved_queue_size: 0,
      published_count: 0,
      failure_count: 0,
      recent_errors: [],
      last_run_summary: "Status initializing.",
    };

    if (fs.existsSync(STATUS_FILE)) {
      try {
        statusData = JSON.parse(fs.readFileSync(STATUS_FILE, "utf-8"));
      } catch (err) {
        console.error("Error reading STATUS_FILE:", err);
      }
    }

    let queueData = { collected: [], approved: [], published_history: [] };
    if (fs.existsSync(QUEUE_FILE)) {
      try {
        queueData = JSON.parse(fs.readFileSync(QUEUE_FILE, "utf-8"));
      } catch (err) {
        console.error("Error reading QUEUE_FILE:", err);
      }
    }

    // Determine alerts
    const now = Date.now();
    const lastRunTime = statusData.last_run_at ? new Date(statusData.last_run_at).getTime() : 0;
    const hoursSinceLastRun = (now - lastRunTime) / (1000 * 3600);

    const alerts = [];
    if (hoursSinceLastRun > 3) {
      alerts.push({
        type: "warning",
        message: `Publishing window delayed: Last publishing run was ${Math.round(hoursSinceLastRun * 10) / 10} hours ago (threshold: 3 hours).`,
      });
    }

    if (statusData.failure_count >= 3) {
      alerts.push({
        type: "error",
        message: `Repeated feed failures detected (${statusData.failure_count} errors logged). Check error details below.`,
      });
    }

    if (statusData.approved_queue_size === 0) {
      alerts.push({
        type: "info",
        message: "No approved stories currently waiting in the upcoming slot queue. The harvester will populate them at the next hourly checkpoint.",
      });
    }

    return NextResponse.json({
      ...statusData,
      alerts,
      queue_preview: {
        approved_count: queueData.approved.length,
        collected_count: queueData.collected.length,
        recent_published_slugs: (queueData.published_history || []).slice(-5),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch publishing status", details: error.message },
      { status: 500 }
    );
  }
}
