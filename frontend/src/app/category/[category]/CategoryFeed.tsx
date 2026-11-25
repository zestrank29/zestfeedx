"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Globe, ShieldCheck, CheckCircle2, Clock, Activity, Wind, Heart, Apple, Users } from "lucide-react";
import ReaderCounter from "@/components/ReaderCounter";
import { formatRelativeTimeIST, formatISTDate } from "@/lib/utils";

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
  topic?: string;
  medical_reviewed?: boolean;
  published_at?: string;
  why_it_matters_today?: string;
  who_is_affected?: string;
  image_photographer?: string;
  image_license?: string;
  event_date?: string;
  event_date_formatted?: string;
  event_type?: string;
  is_preview?: boolean;
  is_live_cricket?: boolean;
  live_score?: string;
  match_status?: string;
}

interface CategoryFeedProps {
  articles: CategoryFeedArticle[];
  categoryTitle: string;
}

const HEALTH_SUBTOPICS = [
  { id: "all", label: "All Health", label_hi: "सभी विषय", href: "/category/health/" },
  { id: "air-pollution", label: "Air Pollution & AQI", label_hi: "वायु प्रदूषण एवं AQI", href: "/category/health/?topic=air-pollution" },
  { id: "seasonal-illnesses", label: "Seasonal Illnesses", label_hi: "मौसमी बीमारियां", href: "/category/health/?topic=seasonal-illnesses" },
  { id: "diabetes", label: "Diabetes & Metabolic", label_hi: "डायबिटीज", href: "/category/health/?topic=diabetes" },
  { id: "heart-health", label: "Heart Health", label_hi: "हृदय स्वास्थ्य", href: "/category/health/?topic=heart-health" },
  { id: "mental-health", label: "Mental Health", label_hi: "मानसिक स्वास्थ्य", href: "/category/health/?topic=mental-health" },
  { id: "nutrition", label: "Nutrition & Food Safety", label_hi: "पोषण एवं आहार", href: "/category/health/?topic=nutrition" },
  { id: "womens-health", label: "Women's Health", label_hi: "महिला स्वास्थ्य", href: "/category/health/?topic=womens-health" },
  { id: "public-health", label: "Public Health", label_hi: "सार्वजनिक स्वास्थ्य", href: "/category/health/?topic=public-health" },
];

export default function CategoryFeed({ articles, categoryTitle }: CategoryFeedProps) {
  const searchParams = useSearchParams();
  const initialLang = searchParams?.get("lang") === "hi" ? "hi" : "en";
  const initialTopic = searchParams?.get("topic") || "all";

  const [activeLang, setActiveLang] = useState<"all" | "en" | "hi">(initialLang);
  const [activeTopic, setActiveTopic] = useState<string>(initialTopic);

  useEffect(() => {
    const t = searchParams?.get("topic");
    if (t) setActiveTopic(t);
  }, [searchParams]);

  const isHealthCategory = categoryTitle.toLowerCase().includes("health");

  // Step 1: Filter by topic if active and category is health
  const topicFilteredArticles = isHealthCategory && activeTopic !== "all"
    ? articles.filter((a) => {
        const t = (a.topic || "").toLowerCase();
        const full = `${a.title} ${a.summary}`.toLowerCase();
        if (activeTopic === "air-pollution") return t === "air-pollution" || full.includes("aqi") || full.includes("pollution");
        if (activeTopic === "seasonal-illnesses") return t === "seasonal-illnesses" || full.includes("dengue") || full.includes("malaria") || full.includes("viral");
        if (activeTopic === "diabetes") return t === "diabetes" || full.includes("diabetes") || full.includes("sugar");
        if (activeTopic === "heart-health") return t === "heart-health" || full.includes("heart") || full.includes("cardio");
        if (activeTopic === "mental-health") return t === "mental-health" || full.includes("mental") || full.includes("depression");
        if (activeTopic === "nutrition") return t === "nutrition" || full.includes("diet") || full.includes("nutrition");
        if (activeTopic === "womens-health") return t === "womens-health" || full.includes("women") || full.includes("maternal");
        if (activeTopic === "public-health") return t === "public-health" || full.includes("icmr") || full.includes("mohfw");
        return true;
      })
    : articles;

  const englishArticles = topicFilteredArticles.filter((a) => a.language === "en");
  const hindiArticles = topicFilteredArticles.filter((a) => a.language === "hi");

  const displayedArticles = activeLang === "all"
    ? topicFilteredArticles
    : activeLang === "hi"
    ? (hindiArticles.length > 0 ? hindiArticles : topicFilteredArticles)
    : (englishArticles.length > 0 ? englishArticles : topicFilteredArticles);

  return (
    <div>
      {/* Crawlable Health Subtopic Filter Bar */}
      {isHealthCategory && (
        <div className="mb-6 pb-4 border-b border-[#E8E4DC] dark:border-[#1E293B]">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-[#0E7C86]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0E7C86]">
              Crawlable Health Subtopic Filters
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {HEALTH_SUBTOPICS.map((sub) => (
              <Link
                key={sub.id}
                href={sub.href}
                onClick={(e) => {
                  setActiveTopic(sub.id);
                }}
                className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                  activeTopic === sub.id
                    ? "bg-[#0E7C86] text-white border-[#0E7C86] shadow-2xs"
                    : "bg-white dark:bg-[#0F172A] text-[#525866] dark:text-[#94A3B8] border-[#E8E4DC] dark:border-[#1E293B] hover:border-[#0E7C86] hover:text-[#0E7C86]"
                }`}
              >
                {activeLang === "hi" ? sub.label_hi : sub.label}
              </Link>
            ))}
          </div>
        </div>
      )}

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
            All ({topicFilteredArticles.length})
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
                  <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1.5">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md backdrop-blur-md bg-[#0B1020]/80 text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
                      <span>{article.topic || article.category}</span>
                    </div>
                    {article.medical_reviewed && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md backdrop-blur-md bg-emerald-700/90 text-white text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Reviewed</span>
                      </div>
                    )}
                    {article.event_date_formatted && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md backdrop-blur-md bg-amber-600/90 text-white text-[10px] font-bold">
                        <span>🗓️ {article.event_date_formatted}</span>
                      </div>
                    )}
                    {article.is_live_cricket && article.live_score && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md backdrop-blur-md bg-red-600/90 text-white text-[10px] font-bold font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        <span>{article.live_score}</span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-5">
                  <div className="flex items-center justify-between text-[11px] text-[#525866] dark:text-[#94A3B8] mb-2 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.published_at ? formatRelativeTimeIST(article.published_at) : article.read_time}
                    </span>
                    <ReaderCounter slug={article.slug} compact={true} />
                  </div>

                  <Link href={`/article/${article.slug}/`} className="block">
                    <h2 className={`font-serif text-lg font-bold text-[#0B1020] dark:text-[#F1F5F9] leading-snug group-hover:text-[#FF5A1F] transition-colors line-clamp-2 ${
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

                  {article.why_it_matters_today && (
                    <div className="mt-3 p-2 rounded bg-[#FAF8F4] dark:bg-[#080C16] border border-[#E8E4DC] dark:border-[#1E293B] text-[11px] text-[#525866] dark:text-[#94A3B8]">
                      <strong className="text-[#0E7C86]">Why It Matters: </strong>
                      {article.why_it_matters_today}
                    </div>
                  )}
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
                  <span>{isArtHindi ? "पढ़ें" : "Read Full"}</span>
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
