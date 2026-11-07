"use client";

import React from "react";
import { Article } from "@/types/news";
import { Flame, Radio } from "lucide-react";

interface BreakingTickerProps {
  breakingArticles: Article[];
  tags: string[];
  onSelectArticle: (article: Article) => void;
  language?: "en" | "hi";
}

const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";

export default function BreakingTicker({
  breakingArticles,
  tags,
  onSelectArticle,
  language = "en",
}: BreakingTickerProps) {
  const getTitle = (art: Article) => {
    return language === "hi" && art.title_hi
      ? art.title_hi
      : art.title_en || art.title;
  };

  const articlesToDisplay =
    breakingArticles && breakingArticles.length > 0
      ? breakingArticles.slice(0, 10)
      : [];

  const renderItems = (keyPrefix: string) => (
    <div className="flex items-center gap-4 shrink-0">
      {articlesToDisplay.map((art) => {
        const title = getTitle(art);
        return (
          <div
            key={`${keyPrefix}-${art.id}`}
            onClick={() => onSelectArticle(art)}
            className="flex items-center gap-3 px-3 py-1.5 bg-white dark:bg-[#0f172a] hover:bg-slate-50 dark:hover:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer transition-all shadow-xs group shrink-0 hover:scale-[1.01]"
            title={title}
          >
            {/* Small News Thumbnail Box */}
            <div className="relative w-12 h-9 rounded overflow-hidden bg-slate-200 dark:bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-700/80 shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={art.image_url || DEFAULT_FALLBACK_IMAGE}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                }}
              />
            </div>

            {/* News Title & Category */}
            <div className="flex flex-col justify-center min-w-0 pr-1">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-wider text-red-700 dark:text-rose-300 bg-red-50 dark:bg-rose-950/80 px-1.5 py-0.2 rounded border border-red-200 dark:border-rose-800/60 shadow-xs">
                  {art.category}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-cyan-400 font-mono">
                  {art.read_time || "4 min"}
                </span>
              </div>
              <span className="font-serif text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#d32f2f] dark:group-hover:text-cyan-300 transition-colors truncate max-w-[260px] sm:max-w-[340px] md:max-w-[420px] mt-0.5">
                {title}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full bg-slate-100 dark:bg-[#080d1a] border-b border-slate-200 dark:border-slate-800 py-2 overflow-hidden flex items-center text-slate-900 dark:text-slate-100 shadow-xs dark:shadow-md transition-colors duration-200">
      {/* TOI Style Red Breaking News Badge */}
      <div className="shrink-0 flex items-center gap-2 px-4 py-1.5 text-xs font-black uppercase tracking-wider bg-[#d32f2f] text-white z-10 shadow-md">
        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
        <span className="font-serif font-black tracking-wider text-white">
          BREAKING NEWS
        </span>
      </div>

      {/* Ticker Stream - Slow Continuous Infinite Crawl with Thumbnail Boxes */}
      <div className="flex overflow-hidden whitespace-nowrap pl-3 w-full">
        <div className="animate-marquee-slow flex items-center gap-4 text-xs text-slate-700 dark:text-slate-300">
          {renderItems("ticker-block-1")}
          {renderItems("ticker-block-2")}
        </div>
      </div>
    </div>
  );
}
