"use client";

import React, { useState, useEffect } from "react";
import { Search, RotateCw, Clock, UserCheck, TrendingUp, Sun, Moon } from "lucide-react";
import GoogleNewsFollowBadge from "./GoogleNewsFollowBadge";

interface HeaderProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTriggerScrape: () => Promise<void>;
  isScraping: boolean;
  currentLanguage?: "en" | "hi";
  onToggleLanguage?: (lang: "en" | "hi") => void;
}

export const CATEGORIES = [
  { id: "all", label: "All News", color: "rose", dot: "bg-red-500" },
  { id: "politics", label: "National & Politics", color: "red", dot: "bg-red-500" },
  { id: "ramayana", label: "Ramayana & Culture", color: "amber", dot: "bg-amber-500" },
  { id: "tech", label: "AI & Technology", color: "cyan", dot: "bg-cyan-400" },
  { id: "sports", label: "Sports", color: "purple", dot: "bg-purple-400" },
  { id: "world", label: "World", color: "sky", dot: "bg-sky-400" },
  { id: "entertainment", label: "Entertainment", color: "pink", dot: "bg-pink-400" },
  { id: "health", label: "Health & Medicine", color: "teal", dot: "bg-teal-400" },
];

export default function Header({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onTriggerScrape,
  isScraping,
  currentLanguage = "en",
  onToggleLanguage,
}: HeaderProps) {
  const [istTimeStr, setIstTimeStr] = useState<string>("");
  const [showSearch, setShowSearch] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Read initial theme from document element class
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (typeof window !== "undefined") {
      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      try {
        localStorage.setItem("zf_theme", nextTheme);
      } catch {}
    }
  };

  // Real-time live digital clock locked to Indian Standard Time (IST)
  useEffect(() => {
    const updateIstClock = () => {
      const now = new Date();
      const timePart = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      const datePart = now.toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      setIstTimeStr(`${datePart} • ${timePart} IST`);
    };

    updateIstClock();
    const interval = setInterval(updateIstClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-white dark:bg-[#0a0f1d] border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 p-0 m-0 shadow-xs dark:shadow-2xl transition-colors duration-200">
      {/* 1. Times of India (TOI) Market Pulse & Real-Time IST Digital Strip */}
      <div className="border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#060a14] px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Financial Pulse & IST Clock */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Live IST Clock */}
          <div className="flex items-center gap-1.5 font-mono text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-slate-900/90 border border-emerald-300 dark:border-emerald-500/30 px-2.5 py-0.5 rounded shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{istTimeStr || "Loading IST..."}</span>
          </div>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>

          {/* SENSEX Pulse */}
          <div className="hidden md:flex items-center gap-1.5 font-mono text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-bold">SENSEX:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> 83,450.20 (+412.10)
            </span>
          </div>

          <span className="text-slate-300 dark:text-slate-700 hidden lg:inline">|</span>

          {/* NIFTY 50 Pulse */}
          <div className="hidden lg:flex items-center gap-1.5 font-mono text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-bold">NIFTY:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> 25,620.45 (+128.30)
            </span>
          </div>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>

          {/* New Delhi Weather */}
          <div className="hidden sm:flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>New Delhi 26°C</span>
          </div>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>

          {/* Edition Tag */}
          <div className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-300 dark:border-slate-700">
            EDITION: INDIA
          </div>
        </div>

        {/* Right: Theme Toggle, Language & Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Dark / Light Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded border transition-all cursor-pointer bg-white text-slate-800 border-slate-300 hover:bg-slate-50 dark:bg-slate-900 dark:text-amber-300 dark:border-slate-700 dark:hover:bg-slate-800 shadow-xs"
            title={theme === "dark" ? "Switch to Light Broadsheet Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span>Dark</span>
              </>
            )}
          </button>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>

          {/* Dual Language Switcher */}
          {onToggleLanguage && (
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-0.5 text-[11px] font-bold shadow-xs">
              <button
                onClick={() => onToggleLanguage("en")}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  currentLanguage === "en"
                    ? "bg-[#d32f2f] text-white font-black shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="English Long-Form Broadsheet Mode"
              >
                🇬🇧 EN
              </button>
              <button
                onClick={() => onToggleLanguage("hi")}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  currentLanguage === "hi"
                    ? "bg-amber-600 text-white font-black shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Trendy Hinglish Broadsheet Mode"
              >
                🇮🇳 HI
              </button>
            </div>
          )}

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>

          {/* Google News Preferred Source Pill */}
          <GoogleNewsFollowBadge variant="pill" className="hidden sm:inline-flex" />

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>

          {/* Hourly Refresh Button */}
          <button
            onClick={onTriggerScrape}
            disabled={isScraping}
            className="flex items-center gap-1.5 text-[11px] text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-semibold px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 transition-colors cursor-pointer"
            title="Trigger hourly fetch & publish"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isScraping ? "animate-spin text-red-600 dark:text-red-400" : ""}`} />
            <span className="hidden sm:inline">{isScraping ? "Syncing..." : "Hourly Refresh"}</span>
          </button>
        </div>
      </div>

      {/* 2. Times of India Broadsheet Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-slate-200 dark:border-slate-800 relative bg-white dark:bg-[#0a0f1d] transition-colors duration-200">
        <div className="flex flex-col items-center justify-center text-center">
          <div
            onClick={() => { onSelectCategory("all"); onSearchChange(""); }}
            className="cursor-pointer group flex flex-col items-center"
          >
            {/* Masthead Title */}
            <div className="flex items-center justify-center gap-2.5">
              <span className="w-3.5 h-3.5 bg-[#d32f2f] rounded-xs shadow-md" />
              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-950 dark:text-white uppercase select-none transition-transform group-hover:scale-[1.01]">
                ZESTFEEDX
              </h1>
              <span className="w-3.5 h-3.5 bg-[#d32f2f] rounded-xs shadow-md" />
            </div>

            {/* Tagline */}
            <p className="text-[10px] sm:text-xs font-serif uppercase tracking-[0.25em] text-slate-600 dark:text-slate-300 mt-1.5 flex items-center gap-2">
              <span className="h-[1px] w-12 bg-slate-300 dark:bg-slate-700" />
              <span>THE TIMES OF DIGITAL JOURNALISM • INDEPENDENT INVESTIGATIVE INTELLIGENCE</span>
              <span className="h-[1px] w-12 bg-slate-300 dark:bg-slate-700" />
            </p>

            {/* Editor Byline (Strict: links to /about, zero mention of ZestRank) */}
            <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Lead Editor:</span>
                <a
                  href="https://zestfeedx.com/about/"
                  onClick={(e) => e.stopPropagation()}
                  className="text-slate-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 underline font-semibold transition-colors"
                >
                  Pankhudi Sharma
                </a>
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span>Daily Broadsheet Edition</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Times of India (TOI) Red Section Navigation Bar */}
      <div className="bg-white dark:bg-[#0b1224] text-slate-800 dark:text-slate-200 sticky top-0 z-40 border-b-2 border-[#d32f2f] shadow-md p-0 m-0 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Category Tabs */}
          <nav className="flex items-center overflow-x-auto no-scrollbar py-0">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                    isActive
                      ? "bg-[#d32f2f] text-white border-white shadow-sm"
                      : "text-slate-700 dark:text-slate-300 hover:text-[#d32f2f] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 border-transparent"
                  }`}
                >
                  <span>{cat.label.toUpperCase()}</span>
                </button>
              );
            })}
          </nav>

          {/* Search Toggle */}
          <div className="flex items-center pl-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded transition-all cursor-pointer ${
                showSearch
                  ? "bg-[#d32f2f] text-white"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
              title="Search news stories"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Search Input Bar */}
      {showSearch && (
        <div className="bg-slate-100 dark:bg-[#070d1a] border-b border-slate-300 dark:border-red-500/30 p-3 shadow-inner">
          <div className="max-w-2xl mx-auto relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-red-600 dark:text-red-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search National Politics, Ramayana, Tech, Health, World..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-[#d32f2f] rounded text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
