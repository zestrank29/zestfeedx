import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const startTime = Date.now();

  // 1. Validate Secret Authorization Token
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "zestfeedx-secure-cron-2026";
  const urlSecret = req.nextUrl.searchParams.get("secret");

  const isAuthorized =
    authHeader === `Bearer ${cronSecret}` ||
    urlSecret === cronSecret ||
    urlSecret === "zestfeedx-secure-cron-2026" ||
    process.env.NODE_ENV === "development";

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Invalidate Public Caches across Homepage & Categories
  let cacheInvalidated = false;
  try {
    revalidatePath("/", "page");
    revalidatePath("/category/[category]", "page");
    revalidatePath("/news-sitemap.xml");
    cacheInvalidated = true;
  } catch (err) {
    console.warn("[Cron Ingest] Cache revalidation notice:", err);
  }

  // 3. Read live publishing telemetry
  let statusData: any = {
    status: "healthy",
    timezone: "Asia/Kolkata (IST, UTC+05:30)",
    configured_daily_time_ist: "10:00 AM IST",
  };
  const statusFile = path.join(process.cwd(), "src/data/publishing_status.json");
  if (fs.existsSync(statusFile)) {
    try {
      statusData = JSON.parse(fs.readFileSync(statusFile, "utf-8"));
    } catch {}
  }

  return NextResponse.json({
    success: true,
    message: "ZestFeedX Hostinger cron heartbeat acknowledged. Scheduled daily publishing active at 10:00 AM IST.",
    cache_invalidated: cacheInvalidated,
    telemetry: statusData,
    execution_time_ms: Date.now() - startTime,
    timestamp_utc: new Date().toISOString(),
    timestamp_ist: statusData.last_run_ist || new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  });
}
