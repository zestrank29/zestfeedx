"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BREAKING_DISPATCH } from "@/data/demoContent";
import { SEED_ARTICLES } from "@/data/seedArticles";

interface BreakingStripProps {
  currentLanguage: "en" | "hi";
}

export default function BreakingStrip({ currentLanguage }: BreakingStripProps) {
  const isHindi = currentLanguage === "hi";

  // Pull freshest 5 breaking dispatches directly from hourly verified feed
  const tickerItems = (SEED_ARTICLES && SEED_ARTICLES.length > 0)
    ? SEED_ARTICLES.slice(0, 5).map((art) => ({
        headline: art.title_en || art.title,
        headline_hi: art.title_hi || art.title,
        slug: art.slug,
        source: art.source_name || "Bureau Wire",
      }))
    : [
        {
          headline: BREAKING_DISPATCH.headline,
          headline_hi: BREAKING_DISPATCH.headline_hi,
          slug: BREAKING_DISPATCH.slug,
          source: BREAKING_DISPATCH.source_note,
        },
      ];

  return (
    <aside
      aria-label="Breaking News Alert"
      className="w-full bg-[#FAF8F4] dark:bg-[#080C16] border-b border-[#E8E4DC] dark:border-[#1E293B] py-2 overflow-hidden transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
        {/* Pulsing Breaking Badge */}
        <div className="shrink-0 flex items-center gap-1.5 bg-[#D7263D] text-white px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          <span>{isHindi ? "ताज़ा ख़बर" : "Breaking"}</span>
        </div>

        {/* Ticker Content */}
        <div className="relative flex-1 overflow-hidden whitespace-nowrap">
          <div className="animate-marquee inline-flex items-center gap-8 text-xs font-medium text-[#0B1020] dark:text-[#F1F5F9]">
            {tickerItems.map((item, idx) => {
              const activeHeadline = isHindi && item.headline_hi ? item.headline_hi : item.headline;
              return (
                <React.Fragment key={`${item.slug}-${idx}`}>
                  <Link
                    href={`/article/${item.slug}`}
                    className="hover:text-[#FF5A1F] transition-colors flex items-center gap-2 group"
                  >
                    <span className={`font-semibold underline-offset-4 group-hover:underline ${isHindi ? "font-hindi text-sm" : ""}`}>
                      {activeHeadline}
                    </span>
                    <span className="text-[10px] text-[#525866] dark:text-[#94A3B8] font-mono">
                      [{item.source}]
                    </span>
                    <ArrowRight className="w-3 h-3 text-[#FF5A1F] group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <span className="text-[#DDD7CD] dark:text-[#334155]">✦</span>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
