"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header, { CATEGORIES } from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import BreakingTicker from "@/components/BreakingTicker";
import InfiniteNewsFeed from "@/components/InfiniteNewsFeed";
import ArticleModal from "@/components/ArticleModal";
import { Article, NewsResponse, TrendingResponse } from "@/types/news";
import { SEED_ARTICLES } from "@/data/seedArticles";

const CATEGORY_DISPLAY_TITLES: { [key: string]: string } = {
  all: "Latest Long-Form Broadsheet Reports",
  politics: "Politics & National Affairs",
  india: "Politics & National Affairs",
  ramayana: "Ramayana & Cultural Heritage",
  culture: "Ramayana & Cultural Heritage",
  health: "Health & Science",
  tech: "AI & Modern Technology",
  business: "Business & Financial Markets",
  world: "World Affairs & Global Diplomacy",
  sports: "Sports & Athletics",
  entertainment: "Movies & Entertainment",
  science: "Space & Frontier Science",
  food: "Food & Gastronomy",
};

export default function HomePage() {
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "hi">("en");
  const [articles, setArticles] = useState<Article[]>(SEED_ARTICLES);
  const [breakingArticles, setBreakingArticles] = useState<Article[]>(SEED_ARTICLES.slice(0, 10));
  const [trendingTags, setTrendingTags] = useState<string[]>([
    "Politics2026", "HealthTech", "AIRevolution", "NationalPolicy", "Markets", "CancerTherapy"
  ]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Sync category from URL search parameters on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat) {
        setSelectedCategory(cat.toLowerCase());
      }
    }
  }, []);

  // Fetch Trending / Breaking on initial load
  useEffect(() => {
    async function loadTrending() {
      if (typeof window !== "undefined" && window.location.hostname === "localhost") {
        try {
          const res = await fetch("http://127.0.0.1:8000/api/trending");
          if (res.ok) {
            const data: TrendingResponse = await res.json();
            if (data.breaking && data.breaking.length > 0) {
              setBreakingArticles(data.breaking);
            }
            if (data.tags && data.tags.length > 0) {
              setTrendingTags(data.tags);
            }
          }
        } catch {}
      }
    }
    loadTrending();
  }, []);

  // Category matcher that supports synonyms like politics / india, tech / ai, etc.
  const matchCategory = (artCat: string, targetCat: string) => {
    const a = (artCat || "").toLowerCase();
    const t = (targetCat || "").toLowerCase();
    if (t === "all") return true;
    if (t === "politics" || t === "india" || t === "national") {
      return a === "politics" || a === "india" || a === "national";
    }
    if (t === "ramayana" || t === "culture") {
      return a === "ramayana" || a === "culture";
    }
    if (t === "entertainment" || t === "movies") {
      return a === "entertainment" || a === "movies";
    }
    if (t === "tech" || t === "ai" || t === "technology") {
      return a === "tech" || a === "ai" || a === "technology";
    }
    return a === t;
  };

  // Fetch News Feed
  const fetchNews = useCallback(
    async (pageNum: number, category: string, search: string, append: boolean = false) => {
      setIsLoading(true);
      try {
        let loaded = false;
        if (typeof window !== "undefined" && window.location.hostname === "localhost") {
          try {
            const queryParams = new URLSearchParams({
              page: pageNum.toString(),
              limit: "9",
            });
            if (category && category !== "all") queryParams.append("category", category);
            if (search.trim()) queryParams.append("search", search.trim());

            const res = await fetch(`http://127.0.0.1:8000/api/news?${queryParams.toString()}`);
            if (res.ok) {
              const data: NewsResponse = await res.json();
              if (data?.items && data.items.length > 0) {
                if (append) {
                  setArticles((prev) => [...prev, ...data.items]);
                } else {
                  setArticles(data.items);
                }
                setHasMore(data.has_more);
                loaded = true;
              }
            }
          } catch {}
        }

        if (!loaded) {
          // Client-side filtering across all 45+ seed long-form articles
          let filtered = [...SEED_ARTICLES];
          if (category && category !== "all") {
            filtered = filtered.filter((a) => matchCategory(a.category, category));
          }
          if (search && search.trim()) {
            const q = search.toLowerCase();
            filtered = filtered.filter((a) =>
              a.title.toLowerCase().includes(q) ||
              a.content.toLowerCase().includes(q) ||
              (a.tags && a.tags.toLowerCase().includes(q))
            );
          }
          setArticles(filtered);
          setHasMore(false);
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Trigger fetch when category or search changes
  useEffect(() => {
    setPage(1);
    fetchNews(1, selectedCategory, searchQuery, false);
  }, [selectedCategory, searchQuery, fetchNews]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (typeof window !== "undefined") {
      const url = cat === "all" ? window.location.pathname : `?category=${cat}`;
      window.history.pushState({}, "", url);

      // Smoothly scroll down to the news section so the user sees the category news immediately
      const newsSection = document.getElementById("categorized-news-section");
      if (newsSection && cat !== "all") {
        newsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleLoadMore = () => {
    if (isLoading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(nextPage, selectedCategory, searchQuery, true);
  };

  const handleTriggerScrape = async () => {
    setIsScraping(true);
    try {
      if (typeof window !== "undefined" && window.location.hostname === "localhost") {
        const res = await fetch("http://127.0.0.1:8000/api/scrape/trigger", {
          method: "POST",
        });
        if (res.ok) {
          setPage(1);
          await fetchNews(1, selectedCategory, searchQuery, false);
        }
      } else {
        await new Promise((r) => setTimeout(r, 1200));
        setPage(1);
        await fetchNews(1, selectedCategory, searchQuery, false);
      }
    } catch (err) {
      console.error("Error triggering scrape:", err);
    } finally {
      setIsScraping(false);
    }
  };

  const currentCategoryTitle =
    CATEGORY_DISPLAY_TITLES[selectedCategory.toLowerCase()] ||
    selectedCategory.toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 overflow-x-hidden font-sans p-0 m-0 transition-colors duration-200">
      {/* 1. Top Header & Navigation (Zero Gap) */}
      <Header
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onTriggerScrape={handleTriggerScrape}
        isScraping={isScraping}
        currentLanguage={currentLanguage}
        onToggleLanguage={setCurrentLanguage}
      />

      {/* 2. Top Breaking News Continuous Marquee Ticker */}
      <div className="p-0 m-0">
        <BreakingTicker
          breakingArticles={breakingArticles}
          tags={trendingTags}
          onSelectArticle={setSelectedArticle}
          language={currentLanguage}
        />
      </div>

      {/* 2.5 AdSense Leaderboard Placement (728x90 Native Responsive Slot) */}
      <div
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-3 flex flex-col items-center justify-center min-h-[90px] overflow-hidden"
        data-ad-slot="adsense-leaderboard-728x90"
      >
        <div className="w-full max-w-[728px] h-[90px] rounded border border-dashed border-slate-300 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/30 flex flex-col items-center justify-center text-center">
          <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono">
            Advertisement
          </span>
          <span className="text-xs text-slate-400 font-serif">
            [Google AdSense Responsive Leaderboard — 728×90]
          </span>
        </div>
      </div>

      {/* 3. Hero Section: Side-by-Side Auto-Running Latest News */}
      <section aria-label="Lead Editorial Stories" className="w-full p-0 m-0">
        <HeroBanner
          breakingArticles={breakingArticles}
          onSelectArticle={setSelectedArticle}
          language={currentLanguage}
        />
      </section>

      {/* 4. Categorized Long-Form News Feed (Starts Directly Below Hero) */}
      <main
        id="categorized-news-section"
        className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Section Heading & Category Filter Bar */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-[#d32f2f] rounded-xs shadow-xs" />
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
              {currentCategoryTitle}
            </h2>
            <span className="text-xs bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700 px-3 py-1 rounded font-mono shadow-xs">
              {articles.length} Dispatches
            </span>
          </div>

          {/* Quick Category Selector Pills directly above news */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((c) => {
              const isActive = selectedCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => handleCategorySelect(c.id)}
                  aria-label={`Filter dispatches by ${c.label}`}
                  className={`px-3.5 py-1.5 text-xs rounded font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-[#d32f2f] text-white shadow-xs"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white border border-slate-300 dark:border-slate-800"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main News Feed Grid */}
        <InfiniteNewsFeed
          articles={articles}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          onSelectArticle={setSelectedArticle}
          language={currentLanguage}
        />
      </main>

      {/* 5. Article Detail Reading Modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onSelectRelated={(art) => setSelectedArticle(art)}
          defaultLanguage={currentLanguage}
        />
      )}
    </div>
  );
}
