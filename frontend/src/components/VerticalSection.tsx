"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock, ChevronRight } from "lucide-react";
import { OriginalArticle, CuratedBrief } from "@/data/demoContent";
import { formatRelativeTimeIST } from "@/lib/utils";

interface VerticalSectionProps {
  id: string;
  title: string;
  title_hi?: string;
  tagline: string;
  originalArticles: OriginalArticle[];
  curatedBriefs: CuratedBrief[];
  currentLanguage: "en" | "hi";
}

export default function VerticalSection({
  id,
  title,
  title_hi,
  tagline,
  originalArticles,
  curatedBriefs,
  currentLanguage,
}: VerticalSectionProps) {
  const displayTitle = currentLanguage === "hi" && title_hi ? title_hi : title;

  return (
    <section id={id} className="py-8 border-b border-[#E8E4DC] dark:border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between pb-3 border-b-2 border-[#0B1020] dark:border-[#F1F5F9] mb-6">
          <div>
            <h3 className="font-display text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9] tracking-tight">
              {displayTitle}
            </h3>
            <p className="text-xs text-[#525866] dark:text-[#94A3B8] mt-0.5">{tagline}</p>
          </div>
          <Link
            href={`/category/${id}`}
            className="text-xs font-semibold text-[#FF5A1F] hover:underline flex items-center gap-1 group"
          >
            <span>Explore all</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 1. Original Deep-Dive Articles (Internal Indexable) */}
        {originalArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {originalArticles.map((art) => (
              <article
                key={art.id}
                className="group bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#FF5A1F] transition-all hover:shadow-xs"
              >
                <div>
                  <Link
                    href={`/article/${art.slug}`}
                    className="relative w-full aspect-16/10 block overflow-hidden bg-[#ECE7DE] dark:bg-[#1E293B]"
                  >
                    <Image
                      src={art.hero_image}
                      alt={art.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80";
                      }}
                    />
                  </Link>

                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2 text-[10px] text-[#525866] dark:text-[#94A3B8]">
                      <span className="font-bold uppercase tracking-wider text-[#0E7C86]">
                        Original Report
                      </span>
                      <span>•</span>
                      <span>{art.reading_time_mins} min read</span>
                    </div>

                    <Link href={`/article/${art.slug}`} className="block">
                      <h4 className="font-display text-base font-bold text-[#0B1020] dark:text-[#F1F5F9] leading-snug group-hover:text-[#FF5A1F] transition-colors">
                        {currentLanguage === "hi" && art.title_hi ? art.title_hi : art.title}
                      </h4>
                    </Link>

                    <p className="mt-2 text-xs text-[#525866] dark:text-[#94A3B8] line-clamp-2 leading-relaxed">
                      {art.deck}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-[#F0ECE1] dark:border-[#1E293B] mt-2 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#0B1020] dark:text-[#F1F5F9]">
                    By {art.author.name}
                  </span>
                  <span className="text-[#94A3B8] font-mono text-[10px]">
                    {formatRelativeTimeIST(art.published_at)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 2. "More From Around the Web" Row (Curated Outbound Briefs) */}
        {curatedBriefs.length > 0 && (
          <div className="bg-[#FAF8F4] dark:bg-[#080C16] border border-[#E8E4DC] dark:border-[#1E293B] rounded-lg p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E8E4DC] dark:border-[#1E293B]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0E7C86]" />
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#0B1020] dark:text-[#F1F5F9]">
                  Wire Dispatch & External Sources
                </h4>
              </div>
              <span className="text-[10px] font-mono text-[#525866] dark:text-[#94A3B8]">
                Links out to publisher • Verified metadata
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {curatedBriefs.map((brief) => (
                <div
                  key={brief.id}
                  className="p-3.5 bg-white dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-md flex flex-col justify-between group hover:border-[#0E7C86] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-1.5">
                      <span className="font-bold text-[#0E7C86]">{brief.source_name}</span>
                      <span className="text-[#94A3B8] font-mono">
                        {formatRelativeTimeIST(brief.published_at)}
                      </span>
                    </div>

                    <a
                      href={brief.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-xs text-[#0B1020] dark:text-[#F1F5F9] group-hover:text-[#0E7C86] transition-colors block mb-1.5 leading-snug"
                    >
                      {brief.title}
                    </a>

                    <p className="text-[11px] text-[#525866] dark:text-[#94A3B8] leading-relaxed line-clamp-2">
                      {brief.summary}
                    </p>
                  </div>

                  <a
                    href={brief.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-[10px] font-semibold text-[#0E7C86] flex items-center gap-1 hover:underline"
                  >
                    <span>Read on {brief.source_name}</span>
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
