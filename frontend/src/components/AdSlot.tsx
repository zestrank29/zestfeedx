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

  return (
    <div
      className={`my-6 mx-auto flex flex-col items-center justify-center ${config.widthClass} ${className}`}
      data-ad-slot={slotId}
    >
      <div className="w-full flex items-center justify-between pb-1 px-1">
        <span className="text-[9px] uppercase tracking-widest font-mono text-[#94A3B8] dark:text-[#64748B]">
          Advertisement
        </span>
        <span className="text-[8px] uppercase tracking-wider text-[#CBD5E1] dark:text-[#475569]">
          Direct Partner
        </span>
      </div>

      <div
        className={`w-full ${config.minHeight} bg-[#ECE7DE]/50 dark:bg-[#0F172A]/70 border border-dashed border-[#DDD7CD] dark:border-[#1E293B] rounded-lg flex flex-col items-center justify-center p-4 text-center transition-colors group hover:border-[#FF5A1F]`}
      >
        <span className="text-[10px] font-mono text-[#525866] dark:text-[#94A3B8] uppercase tracking-wider mb-1">
          ZestFeedX Sponsor Network
        </span>
        <p className="text-xs font-semibold text-[#0B1020] dark:text-[#F1F5F9] max-w-sm mb-2">
          Connect with 250k+ founders, investors, and policymakers in India and the global diaspora.
        </p>
        <Link
          href="/advertise"
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF5A1F] group-hover:underline underline-offset-2"
        >
          <span>Reserve this placement</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
