"use client";

import React, { useEffect, useRef } from "react";
import NewsCard from "@/components/NewsCard";
import SidebarAd from "@/components/SidebarAd";
import { Article } from "@/types/news";
import { Loader2 } from "lucide-react";

interface InfiniteNewsFeedProps {
  articles: Article[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onSelectArticle: (article: Article) => void;
  language?: "en" | "hi";
}

export default function InfiniteNewsFeed({
  articles,
  isLoading,
  hasMore,
  onLoadMore,
  onSelectArticle,
  language = "en",
}: InfiniteNewsFeedProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!observerTarget.current || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: "300px" }
    );

    observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <div className="w-full max-w-7xl mx-auto py-6">
      {/* Editorial Section Header */}
      <div className="border-b border-slate-300 dark:border-slate-800 pb-2.5 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-red-600 rounded-full" />
          <h2 className="font-serif font-black text-xl sm:text-2xl text-slate-900 dark:text-white uppercase tracking-tight">
            Latest Wire & Beat Dispatches
          </h2>
        </div>
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          Continuous Wire Feed
        </span>
      </div>

      {/* Main Grid Layout: Stories + Editorial Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* News Stream (8 cols on desktop) */}
        <div className="lg:col-span-8">
          {articles.length === 0 && !isLoading ? (
            <div className="p-12 text-center bg-slate-100 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-800 rounded-lg">
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">No Stories Found</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Try selecting a different category or click "Refresh News" above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {articles.map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  onSelect={onSelectArticle}
                  language={language}
                />
              ))}
            </div>
          )}

          {/* Infinite Scroll Trigger */}
          <div ref={observerTarget} className="w-full py-8 flex flex-col items-center justify-center">
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                <span>Loading more stories...</span>
              </div>
            )}

            {!hasMore && articles.length > 0 && (
              <div className="p-4 bg-slate-100 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-800 rounded text-center text-xs text-slate-600 dark:text-slate-400 w-full">
                You have reached the end of today's primary wire reports. Check back hourly for updates.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar (4 cols on desktop) */}
        <aside className="lg:col-span-4 space-y-6">
          <SidebarAd />
        </aside>
      </div>
    </div>
  );
}
