"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type AdSlotFormat = "leaderboard" | "rectangle" | "halfpage" | "mobile-banner";

interface AdSlotProps {
  format: AdSlotFormat;
  className?: string;
  slotId?: string;
}

export default function AdSlot({ format, className = "", slotId = "default" }: AdSlotProps) {
  // Dimensions map to prevent Cumulative Layout Shift (CLS)
  const formatConfig: Record<
    AdSlotFormat,
    { widthClass: string; minHeight: string; label: string; desktopOnly?: boolean }
  > = {
    leaderboard: {
      widthClass: "w-full max-w-[728px]",
      minHeight: "min-h-[90px]",
      label: "728 × 90 Leaderboard",
    },
    rectangle: {
      widthClass: "w-full max-w-[300px]",
      minHeight: "min-h-[250px]",
      label: "300 × 250 Inline",
    },
    halfpage: {
      widthClass: "w-full max-w-[300px]",
      minHeight: "min-h-[600px]",
      label: "300 × 600 Half Page",
    },
    "mobile-banner": {
      widthClass: "w-full max-w-[320px]",
      minHeight: "min-h-[50px]",
      label: "320 × 50 Mobile Anchor",
    },
  };

  const config = formatConfig[format];
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (adsenseClient) {
    return (
      <div
        className={`my-6 mx-auto flex flex-col items-center justify-center ${config.widthClass} ${className}`}
        data-ad-slot={slotId}
      >
        <span className="text-[9px] uppercase tracking-widest font-mono text-slate-400 mb-1">
          Advertisement
        </span>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adsenseClient}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Pre-approval / Fallback State: High-value editorial briefing box (eliminates "empty ad placeholder" flag)
  return (
    <div
      className={`my-6 mx-auto flex flex-col items-center justify-center ${config.widthClass} ${className}`}
      data-editorial-slot={slotId}
    >
      <div
        className={`w-full ${config.minHeight} bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between p-5 text-left transition-colors shadow-sm`}
      >
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300">
              Executive Briefing
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              ZestFeedX Intelligence Wire
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
            Independent, fact-checked dispatches covering Indian macro policy, capital markets, and civilizational heritage.
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Read by over 250,000 leaders, analysts, and global diaspora readers daily.
          </p>
        </div>
        <Link
          href="/explainers"
          className="mt-3 sm:mt-0 shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-sm"
        >
          <span>Explore Explainers</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
