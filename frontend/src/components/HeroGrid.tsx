"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, User, ArrowUpRight, ChevronRight } from "lucide-react";
import { OriginalArticle, CuratedBrief } from "@/data/demoContent";
import { formatRelativeTimeIST } from "@/lib/utils";

interface HeroGridProps {
  leadStory: OriginalArticle;
  secondaryStories: OriginalArticle[];
  curatedReads: CuratedBrief[];
  currentLanguage: "en" | "hi";
}

export default function HeroGrid({
  leadStory,
  secondaryStories,
  curatedReads,
  currentLanguage,
}: HeroGridProps) {
  const isHindi = currentLanguage === "hi";

  return (
    <section className="py-6 border-b border-[#E8E4DC] dark:border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Lead Story (7 Cols) */}
          <article className="lg:col-span-7 flex flex-col group">
            {/* Category & Freshness */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF5A1F] bg-[#FF5A1F]/10 px-2 py-0.5 rounded">
                {isHindi ? `विशेष अन्वेषण • ${leadStory.category.toUpperCase()}` : `Lead Investigation • ${leadStory.category.toUpperCase()}`}
              </span>
              <span className="text-[11px] text-[#525866] dark:text-[#94A3B8] flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" />
                {formatRelativeTimeIST(leadStory.published_at)}
              </span>
            </div>

            {/* Headline */}
            <Link href={`/article/${leadStory.slug}`} className="block focus:outline-hidden">
              <h2 className={`font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B1020] dark:text-[#F1F5F9] leading-[1.18] group-hover:text-[#FF5A1F] transition-colors ${isHindi ? "font-hindi leading-[1.35]!" : ""}`}>
                {isHindi && leadStory.title_hi
                  ? leadStory.title_hi
                  : leadStory.title}
              </h2>
            </Link>

            {/* Deck / Subtitle */}
            <p className={`mt-2.5 text-sm sm:text-base text-[#525866] dark:text-[#94A3B8] leading-relaxed ${isHindi ? "font-hindi leading-[1.65]!" : ""}`}>
              {isHindi && leadStory.deck_hi ? leadStory.deck_hi : leadStory.deck}
            </p>

            {/* Author Byline */}
            <div className="flex items-center gap-3 my-4 py-2 border-y border-[#E8E4DC] dark:border-[#1E293B]">
              <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#DDD7CD] dark:border-[#334155]">
                <Image
                  src={leadStory.author.avatar}
                  alt={leadStory.author.name}
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
              <div className="text-xs">
                <Link
                  href={`/author/${leadStory.author.slug}`}
                  className="font-semibold text-[#0B1020] dark:text-[#F1F5F9] hover:underline"
                >
                  {isHindi ? `लेखक: ${leadStory.author.name}` : `By ${leadStory.author.name}`}
                </Link>
                <p className="text-[10px] text-[#525866] dark:text-[#94A3B8]">
                  {leadStory.author.role} • {leadStory.reading_time_mins} {isHindi ? "मिनट पठन" : "min read"}
                </p>
              </div>
            </div>

            {/* Hero Image Container */}
            <Link
              href={`/article/${leadStory.slug}`}
              className="relative w-full aspect-16/9 rounded-lg overflow-hidden bg-[#ECE7DE] dark:bg-[#1E293B] block focus:outline-hidden"
            >
              <Image
                src={leadStory.hero_image}
                alt={leadStory.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-[1.015] transition-transform duration-500 ease-out"
              />
            </Link>
            <figcaption className="text-[11px] text-[#525866] dark:text-[#94A3B8] mt-1.5 flex items-center justify-between">
              <span className="truncate pr-2">{leadStory.hero_image_caption}</span>
              <span className="shrink-0 font-mono text-[10px] text-[#94A3B8] dark:text-[#64748B]">
                Photo: {leadStory.hero_image_credit}
              </span>
            </figcaption>
          </article>

          {/* RIGHT: 2 Secondary Stories + Top 5 Curated (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:pl-6 lg:border-l lg:border-[#E8E4DC] lg:dark:border-[#1E293B]">
            {/* Secondary Stories Section */}
            <div className="space-y-5">
              {secondaryStories.map((art) => (
                <article
                  key={art.id}
                  className="group pb-5 border-b border-[#E8E4DC] dark:border-[#1E293B] last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#0E7C86] bg-[#0E7C86]/10 px-1.5 py-0.5 rounded">
                      {art.category.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-[#525866] dark:text-[#94A3B8] font-mono">
                      {formatRelativeTimeIST(art.published_at)}
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Link href={`/article/${art.slug}`} className="block">
                        <h3 className={`font-display text-base sm:text-lg font-bold text-[#0B1020] dark:text-[#F1F5F9] leading-snug group-hover:text-[#FF5A1F] transition-colors ${isHindi ? "font-hindi leading-[1.35]!" : ""}`}>
                          {isHindi && art.title_hi ? art.title_hi : art.title}
                        </h3>
                      </Link>
                      <p className={`mt-1 text-xs text-[#525866] dark:text-[#94A3B8] line-clamp-2 ${isHindi ? "font-hindi leading-[1.6]!" : ""}`}>
                        {isHindi && art.deck_hi ? art.deck_hi : art.deck}
                      </p>
                      <div className="mt-2 text-[10px] text-[#525866] dark:text-[#94A3B8]">
                        <span className="font-semibold text-[#0B1020] dark:text-[#F1F5F9]">
                          {art.author.name}
                        </span>{" "}
                        • {art.reading_time_mins} {isHindi ? "मिनट पठन" : "min read"}
                      </div>
                    </div>

                    <Link
                      href={`/article/${art.slug}`}
                      className="relative w-24 h-20 rounded-md overflow-hidden bg-[#ECE7DE] dark:bg-[#1E293B] shrink-0"
                    >
                      <Image
                        src={art.hero_image}
                        alt={art.title}
                        fill
                        sizes="100px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Top 5 Reads / Wire Briefs */}
            <div className="pt-4 border-t-2 border-[#0B1020] dark:border-[#F1F5F9]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-[#0B1020] dark:text-[#F1F5F9]">
                  {isHindi ? "प्रमुख ५ सत्यापित समाचार" : "Top 5 Curated Dispatches"}
                </h4>
                <span className="text-[10px] font-mono text-[#525866] dark:text-[#94A3B8]">
                  {isHindi ? "सत्यापित स्रोत" : "Verified Sources"}
                </span>
              </div>

              <div className="divide-y divide-[#E8E4DC] dark:divide-[#1E293B]">
                {curatedReads.slice(0, 5).map((brief, idx) => (
                  <div key={brief.id} className="py-2.5 flex items-start gap-3 group">
                    <span className="font-display text-lg font-bold text-[#FF5A1F] shrink-0 w-4">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <a
                        href={brief.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-medium text-xs text-[#0B1020] dark:text-[#F1F5F9] group-hover:text-[#FF5A1F] transition-colors leading-snug block ${isHindi ? "font-hindi leading-[1.4]!" : ""}`}
                      >
                        {isHindi && brief.title_hi ? brief.title_hi : brief.title}
                      </a>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-[#525866] dark:text-[#94A3B8]">
                        <span className="font-semibold text-[#0E7C86]">{brief.source_name}</span>
                        <span>•</span>
                        <span>{formatRelativeTimeIST(brief.published_at)}</span>
                        <ArrowUpRight className="w-2.5 h-2.5 text-[#94A3B8] inline" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
          </div >
        </div >
      </div >
    </section >
  );
}
