"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Globe } from "lucide-react";
import ReaderCounter from "@/components/ReaderCounter";

export interface CategoryFeedArticle {
  id: number | string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  image_url: string;
  author: string;
  read_time: string;
  language: "en" | "hi";
  is_original?: boolean;
}

interface CategoryFeedProps {
  articles: CategoryFeedArticle[];
  categoryTitle: string;
}

export default function CategoryFeed({ articles, categoryTitle }: CategoryFeedProps) {
  const searchParams = useSearchParams();
  const initialLang = searchParams?.get("lang") === "hi" ? "hi" : "en";
  const [activeLang, setActiveLang] = useState<"all" | "en" | "hi">(initialLang);

  const englishArticles = articles.filter((a) => a.language === "en");
  const hindiArticles = articles.filter((a) => a.language === "hi");

  const displayedArticles = activeLang === "all"
    ? articles
    : activeLang === "hi"
    ? (hindiArticles.length > 0 ? hindiArticles : articles)
    : (englishArticles.length > 0 ? englishArticles : articles);

  return (
    <div>
      {/* Language Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E8E4DC] dark:border-[#1E293B]">
        <div className="flex items-center gap-1.5 bg-[#FAF8F4] dark:bg-[#080C16] p-1 rounded-lg border border-[#E8E4DC] dark:border-[#1E293B]">
          <button
            onClick={() => setActiveLang("en")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeLang === "en"
                ? "bg-[#0B1020] dark:bg-white text-white dark:text-[#0B1020] shadow-xs"
                : "text-[#525866] dark:text-[#94A3B8] hover:text-[#0B1020] dark:hover:text-white"
            }`}
          >
            English News ({englishArticles.length})
          </button>
          <button
            onClick={() => setActiveLang("hi")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold font-hindi transition-all ${
              activeLang === "hi"
                ? "bg-[#FF5A1F] text-white shadow-xs"
                : "text-[#525866] dark:text-[#94A3B8] hover:text-[#0B1020] dark:hover:text-white"
            }`}
          >
            हिन्दी समाचार ({hindiArticles.length})
          </button>
          <button
            onClick={() => setActiveLang("all")}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium text-[#525866] dark:text-[#94A3B8] hover:text-[#0B1020] dark:hover:text-white transition-all ${
              activeLang === "all" ? "underline" : ""
            }`}
          >
            All ({articles.length})
          </button>
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#0E7C86]/10 text-[#0E7C86] dark:bg-[#0E7C86]/20 dark:text-[#2DD4BF] border border-[#0E7C86]/30">
          {displayedArticles.length} Verified Reports
        </span>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedArticles.map((article) => {
          const isArtHindi = article.language === "hi";
          return (
            <article
              key={article.id}
              className={`group bg-white dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] hover:border-[#FF5A1F] rounded-xl overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-300 ${
                isArtHindi ? "font-hindi" : ""
              }`}
            >
              <div>
                <Link
                  href={`/article/${article.slug}/`}
                  className="relative w-full aspect-16/10 block overflow-hidden bg-[#ECE7DE] dark:bg-[#1E293B]"
                >
                  <Image
                    src={article.image_url}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md backdrop-blur-md bg-[#0B1020]/80 text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
                    <span>{article.category}</span>
                  </div>
                </Link>

                <div className="p-5">
                  <div className="flex items-center justify-between text-[11px] text-[#525866] dark:text-[#94A3B8] mb-2">
                    <span className="font-semibold text-[#0E7C86]">{article.read_time}</span>
                    <ReaderCounter slug={article.slug} compact={true} />
                  </div>

                  <Link href={`/article/${article.slug}/`} className="block">
                    <h2 className={`font-display text-lg font-bold text-[#0B1020] dark:text-[#F1F5F9] leading-snug group-hover:text-[#FF5A1F] transition-colors line-clamp-2 ${
                      isArtHindi ? "leading-[1.4]!" : ""
                    }`}>
                      {article.title}
                    </h2>
                  </Link>

                  <p className={`mt-2.5 text-xs text-[#525866] dark:text-[#94A3B8] line-clamp-3 leading-relaxed ${
                    isArtHindi ? "leading-[1.65]!" : ""
                  }`}>
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-[#F0ECE1] dark:border-[#1E293B] flex items-center justify-between text-xs">
                <span className="font-medium text-[#0B1020] dark:text-[#F1F5F9]">
                  {isArtHindi ? "संवाददाता: " + article.author : `By ${article.author}`}
                </span>
                <Link
                  href={`/article/${article.slug}/`}
                  className="text-[#FF5A1F] font-semibold text-xs flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>{isArtHindi ? "पूरा पढ़ें" : "Read Full News"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
