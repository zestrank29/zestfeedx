import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import defaultCalendar from "@/data/editorial_calendar.json";
import defaultCricketTelemetry from "@/data/cricket_telemetry.json";
import defaultSourceRegistry from "@/data/source_registry.json";
import defaultGeminiUsage from "@/data/gemini_usage.json";

export const dynamic = "force-dynamic";

const STATUS_FILE = path.join(process.cwd(), "src/data/publishing_status.json");
const QUEUE_FILE = path.join(process.cwd(), "src/data/publishing_queue.json");
const CALENDAR_FILE = path.join(process.cwd(), "src/data/editorial_calendar.json");
const CRICKET_FILE = path.join(process.cwd(), "src/data/cricket_telemetry.json");

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

    let calendarData = (defaultCalendar as any[]) || [];
    if (fs.existsSync(CALENDAR_FILE)) {
      try {
        calendarData = JSON.parse(fs.readFileSync(CALENDAR_FILE, "utf-8"));
      } catch { }
    }

    let cricketData = (defaultCricketTelemetry as any) || {
      monitoring_intervals: {
        live_cricket: "2–5 minutes",
        other_cricket: "5–15 minutes",
        general_categories: "15–30 minutes",
      },
      measured_pipeline_delay_seconds: 1.45,
    };
    if (fs.existsSync(CRICKET_FILE)) {
      try {
        cricketData = JSON.parse(fs.readFileSync(CRICKET_FILE, "utf-8"));
      } catch { }
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
      editorial_calendar: calendarData,
      cricket_telemetry: cricketData,
      source_registry: defaultSourceRegistry,
      gemini_usage: defaultGeminiUsage,
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
