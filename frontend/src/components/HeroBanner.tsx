"use client";

import React from "react";
import Image from "next/image";
import { Article } from "@/types/news";
import { Clock, Eye, ShieldCheck, Flame, ArrowUpRight, Calendar } from "lucide-react";

function formatDate(dateStr?: string) {
  if (!dateStr) return "Nov 9, 2026";
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  } catch {}
  return dateStr.replace(/GMT.*$/, "").trim().slice(0, 11) || "Nov 9, 2026";
}

interface HeroBannerProps {
  breakingArticles: Article[];
  onSelectArticle: (article: Article) => void;
  language?: "en" | "hi";
}

const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";

export default function HeroBanner({
  breakingArticles,
  onSelectArticle,
  language = "en",
}: HeroBannerProps) {
  const heroArticles =
    breakingArticles && breakingArticles.length > 0
      ? breakingArticles.slice(0, 10)
      : [];

  const getDisplayTitle = (art: Article) => {
    return language === "hi" && art.title_hi
      ? art.title_hi
      : art.title_en || art.title;
  };

  const getDisplaySummary = (art: Article) => {
    return language === "hi" && art.summary_hi
      ? art.summary_hi
      : art.summary_en || art.summary;
  };

  if (heroArticles.length === 0) return null;

  const renderCardBlock = (keyPrefix: string) => (
    <div className="flex items-stretch gap-5 shrink-0 py-2">
      {heroArticles.map((art, idx) => {
        const title = getDisplayTitle(art);
        const summary = getDisplaySummary(art);

        return (
          <div
            key={`${keyPrefix}-${art.id}-${idx}`}
            onClick={() => onSelectArticle(art)}
            className="w-[300px] sm:w-[350px] md:w-[380px] shrink-0 bg-white dark:bg-[#11192e] border border-slate-200 dark:border-cyan-500/30 hover:border-[#d32f2f] dark:hover:border-cyan-400 rounded-xl overflow-hidden flex flex-col justify-between cursor-pointer transition-all duration-300 group shadow-sm hover:shadow-lg dark:shadow-xl hover:scale-[1.01]"
          >
            {/* 16:9 Thumbnail Photo Header */}
            <div className="relative w-full h-44 sm:h-48 md:h-52 bg-slate-200 dark:bg-slate-900 overflow-hidden">
              <Image
                src={art.image_url || DEFAULT_FALLBACK_IMAGE}
                alt={art.image_alt || title}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 300px, 380px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Badges on Image */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#d32f2f] text-white px-2.5 py-0.5 rounded shadow-sm">
                  {art.category}
                </span>
                {art.fomo_badge && (
                  <span className="text-[10px] font-semibold bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded shadow">
                    {art.fomo_badge}
                  </span>
                )}
              </div>

              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded backdrop-blur-md bg-emerald-950/80 border border-emerald-500/40 text-[9px] font-bold text-emerald-300 shadow">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Verified</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#d32f2f] dark:group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug mb-2">
                  {title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300/90 line-clamp-2 leading-relaxed">
                  {summary}
                </p>
              </div>

              {/* Card Footer Credit with Source & Date */}
              <div className="pt-2 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-red-600 dark:text-red-400 truncate max-w-[65%]">
                    {art.source_name || "Official Wire"}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {formatDate(art.published_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <a
                    href="https://zestfeedx.com/about"
                    onClick={(e) => e.stopPropagation()}
                    className="font-medium text-slate-700 dark:text-slate-300 hover:text-[#d32f2f] dark:hover:text-red-400 underline decoration-slate-300 dark:decoration-slate-600 transition-colors"
                  >
                    By Pankhudi Sharma
                  </a>
                  <span className="flex items-center gap-1 text-slate-500 dark:text-cyan-400 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" /> {art.read_time || "4 min read"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full py-4 border-b border-slate-200 dark:border-slate-800/80 bg-slate-100/70 dark:bg-[#070b16] overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#d32f2f] animate-ping" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
            <span>⚡ 24×7 Continuous News Stream</span>
          </h2>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
          Gliding auto-feed • Hover to pause
        </span>
      </div>

      {/* Seamless Continuous Gliding Feed */}
      <div className="flex overflow-hidden whitespace-nowrap px-4 w-full">
        <div className="animate-hero-crawl flex items-center gap-5">
          {renderCardBlock("hero-track-1")}
          {renderCardBlock("hero-track-2")}
        </div>
      </div>
    </div>
  );
}
