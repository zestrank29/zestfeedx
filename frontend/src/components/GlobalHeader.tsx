"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
  ArrowUpRight,
  Globe,
  Moon,
  Sun,
  Flame,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
} from "lucide-react";
import {
  MARKET_TICKERS,
  CITY_METRICS,
  DIASPORA_TICKERS,
  DIASPORA_HUBS,
  MarketTicker,
} from "@/data/demoContent";

export const CATEGORIES = [
  { id: "all", label: "Front Page", label_hi: "मुख्य पृष्ठ", href: "/", icon: "📰" },
  { id: "health", label: "Health & Medicine", label_hi: "स्वास्थ्य एवं चिकित्सा", href: "/category/health/", icon: "🩺", badge: "Lead" },
  { id: "cricket", label: "Cricket", label_hi: "क्रिकेट", href: "/category/cricket/", icon: "🏏", badge: "Live" },
  { id: "festivals", label: "Festivals & Calendar", label_hi: "त्योहार एवं पंचांग", href: "/category/festivals/", icon: "🗓️" },
  { id: "markets", label: "Markets & Money", label_hi: "बाजार एवं वित्त", href: "/category/markets/", icon: "📈" },
  { id: "tech", label: "Tech & AI", label_hi: "तकनीक एवं एआई", href: "/category/tech/", icon: "⚡" },
  { id: "india", label: "India Policy", label_hi: "भारत एवं नीतियां", href: "/category/india/", icon: "🏛️" },
  { id: "world", label: "World Affairs", label_hi: "वैश्विक परिदृश्य", href: "/category/world/", icon: "🌐" },
  { id: "sports", label: "Sports", label_hi: "खेल जगत", href: "/category/sports/", icon: "🏅" },
  { id: "entertainment", label: "Culture & Arts", label_hi: "कला एवं संस्कृति", href: "/category/entertainment/", icon: "🎬" },
  { id: "ramayana", label: "Heritage", label_hi: "विरासत एवं संस्कृति", href: "/category/ramayana/", icon: "🏹" },
  { id: "explainers", label: "Deep Explainers", label_hi: "गहन विश्लेषण", href: "/explainers/", icon: "💡" },
];

export default function GlobalHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "hi">("en");
  const [currentEdition, setCurrentEdition] = useState<"india" | "world">("india");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeCityIdx, setActiveCityIdx] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [liveMarketTickers, setLiveMarketTickers] = useState<MarketTicker[]>(MARKET_TICKERS);
  const [isMarketLive, setIsMarketLive] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const categoryNavRef = useRef<HTMLUListElement>(null);
  const categoriesTriggerRef = useRef<HTMLButtonElement>(null);
  const drawerCloseBtnRef = useRef<HTMLButtonElement>(null);

  // Check horizontal scroll bounds
  const checkScrollButtons = useCallback(() => {
    if (!categoryNavRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = categoryNavRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);

  const scrollCategory = (direction: "left" | "right") => {
    if (!categoryNavRef.current) return;
    const distance = direction === "left" ? -280 : 280;
    categoryNavRef.current.scrollBy({ left: distance, behavior: "smooth" });
  };

  // Close mobile drawer on Escape and trap/return focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileDrawerOpen) {
        setMobileDrawerOpen(false);
        categoriesTriggerRef.current?.focus();
      }
    };
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      setTimeout(() => drawerCloseBtnRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileDrawerOpen]);

  // Sync language with pathname
  useEffect(() => {
    if (pathname?.startsWith("/hi")) {
      setCurrentLanguage("hi");
    } else {
      setCurrentLanguage("en");
    }
  }, [pathname]);

  // Fetch real-time market data (Sensex, Nifty 50, Gold, Silver, USD/INR)
  useEffect(() => {
    let isMounted = true;

    async function fetchLiveMarkets() {
      try {
        const res = await fetch("/api/markets/live", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data?.tickers && data.tickers.length > 0) {
          setLiveMarketTickers(data.tickers);
          setIsMarketLive(data.is_live ?? true);
        }
      } catch {
        // preserve current display on transient error
      }
    }

    fetchLiveMarkets();
    const interval = setInterval(fetchLiveMarkets, 20000); // 20s polling
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Detect current active category from pathname
  const getActiveCategory = () => {
    if (!pathname || pathname === "/" || pathname === "/en" || pathname === "/hi") return "all";
    if (pathname.includes("/category/health")) return "health";
    if (pathname.includes("/category/cricket")) return "cricket";
    if (pathname.includes("/category/festivals")) return "festivals";
    if (pathname.includes("/category/markets")) return "markets";
    if (pathname.includes("/category/tech")) return "tech";
    if (pathname.includes("/category/india")) return "india";
    if (pathname.includes("/category/world")) return "world";
    if (pathname.includes("/category/sports")) return "sports";
    if (pathname.includes("/category/entertainment")) return "entertainment";
    if (pathname.includes("/category/ramayana")) return "ramayana";
    if (pathname.includes("/explainers")) return "explainers";
    return "";
  };

  const activeCategory = getActiveCategory();

  // Auto-scroll active category into view
  useEffect(() => {
    checkScrollButtons();
    const activeEl = categoryNavRef.current?.querySelector('[data-active="true"]');
    if (activeEl) {
      (activeEl as HTMLElement).scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [pathname, checkScrollButtons]);

  // Dark mode init
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    }
  }, []);

  const toggleDarkMode = () => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.toggle("dark");
      setIsDarkMode(isDark);
      try {
        localStorage.setItem("zest_theme", isDark ? "dark" : "light");
      } catch { }
    }
  };

  const handleLanguageSwitch = (lang: "en" | "hi") => {
    setCurrentLanguage(lang);
    if (lang === "hi") {
      router.push("/hi");
    } else {
      router.push("/");
    }
  };

  const activeCityList = currentEdition === "world" ? DIASPORA_HUBS : CITY_METRICS;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCityIdx((prev) => (prev + 1) % activeCityList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeCityList.length]);

  const activeTickers = currentEdition === "world" ? DIASPORA_TICKERS : liveMarketTickers;
  const currentCity = CITY_METRICS[activeCityIdx % CITY_METRICS.length];
  const currentDiasporaHub = DIASPORA_HUBS[activeCityIdx % DIASPORA_HUBS.length];

  const todayIST = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="w-full bg-[#FAF8F4] dark:bg-[#080C16] border-b border-[#E8E4DC] dark:border-[#1E293B] transition-colors relative z-40">
      {/* 1. Slim Top Bar */}
      <div className="w-full bg-[#FAF8F4] dark:bg-[#080C16] border-b border-[#E8E4DC] dark:border-[#1E293B] text-[11px] font-medium tracking-tight text-[#525866] dark:text-[#94A3B8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
          {/* Left: Edition & Language & Weather/AQI */}
          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto py-0.5 scrollbar-none">
            {/* Edition Toggle */}
            <div className="flex items-center bg-[#ECE7DE] dark:bg-[#0F172A] rounded p-0.5 border border-[#DDD7CD] dark:border-[#1E293B]">
              <button
                onClick={() => setCurrentEdition("india")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${currentEdition === "india"
                    ? "bg-[#FFFFFF] dark:bg-[#1E293B] text-[#0B1020] dark:text-[#F1F5F9] shadow-xs"
                    : "text-[#525866] dark:text-[#94A3B8] hover:text-[#0B1020] dark:hover:text-[#FFFFFF]"
                  }`}
              >
                {currentLanguage === "hi" ? "भारत" : "India"}
              </button>
              <button
                onClick={() => setCurrentEdition("world")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${currentEdition === "world"
                    ? "bg-[#FFFFFF] dark:bg-[#1E293B] text-[#0B1020] dark:text-[#F1F5F9] shadow-xs"
                    : "text-[#525866] dark:text-[#94A3B8] hover:text-[#0B1020] dark:hover:text-[#FFFFFF]"
                  }`}
              >
                {currentLanguage === "hi" ? "प्रवासी" : "Diaspora"}
              </button>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center gap-1 border-l border-[#E8E4DC] dark:border-[#1E293B] pl-2 sm:pl-3">
              <Globe className="w-3 h-3 text-[#FF5A1F]" />
              <button
                onClick={() => handleLanguageSwitch("en")}
                className={`px-1.5 py-0.5 rounded transition ${currentLanguage === "en"
                    ? "font-bold text-[#FF5A1F] underline underline-offset-2"
                    : "hover:text-[#0B1020] dark:hover:text-white"
                  }`}
              >
                EN
              </button>
              <span className="text-[#DDD7CD] dark:text-[#334155]">/</span>
              <button
                onClick={() => handleLanguageSwitch("hi")}
                className={`px-1.5 py-0.5 rounded transition font-hindi ${currentLanguage === "hi"
                    ? "font-bold text-[#FF5A1F] underline underline-offset-2"
                    : "hover:text-[#0B1020] dark:hover:text-white"
                  }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Weather / AQI Chip */}
            <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-[#E8E4DC] dark:border-[#1E293B]">
              <span className="text-[#0B1020] dark:text-[#F1F5F9] font-semibold">
                {currentEdition === "world" ? currentDiasporaHub.city : currentCity.city}
              </span>
              <span>•</span>
              <span className="text-[#0E7C86] font-semibold">
                {currentEdition === "world" ? currentDiasporaHub.temp : currentCity.temp}
              </span>
              {currentEdition === "india" && (
                <>
                  <span>•</span>
                  <span className="text-[#525866] dark:text-[#94A3B8]">AQI:</span>
                  <span
                    className="font-mono font-bold px-1 py-0.2 rounded text-[10px] text-white"
                    style={{ backgroundColor: currentCity.aqi_color }}
                  >
                    {currentCity.aqi}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right: Real-time Live Financial Tickers & Dark Mode */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 overflow-x-auto scrollbar-none py-0.5">
              {/* Pulsing Live Badge for Markets */}
              <div className="flex items-center gap-1.5 mr-0.5 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[9px] font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                  LIVE
                </span>
              </div>

              {activeTickers.slice(0, 5).map((tick) => (
                <div key={tick.symbol} className="flex items-center gap-1.5 shrink-0 text-[10.5px]">
                  <span className="font-semibold text-[#0B1020] dark:text-[#F1F5F9]">{tick.symbol}</span>
                  <span className="font-mono font-medium">{tick.value}</span>
                  <span
                    className={`font-mono text-[9.5px] ${tick.is_positive ? "text-[#10B981]" : "text-[#D7263D]"
                      }`}
                  >
                    {tick.change}
                  </span>
                </div>
              ))}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle visual theme"
              className="p-1 rounded hover:bg-[#ECE7DE] dark:hover:bg-[#1E293B] text-[#0B1020] dark:text-[#F1F5F9] transition"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-[#FF5A1F]" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Masthead (Branding, Date, Search, Dispatch) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between">
          {/* Left Metadata in IST */}
          <div className="hidden sm:block text-[11px] text-[#525866] dark:text-[#94A3B8] font-serif leading-tight">
            <p className="font-semibold text-[#0B1020] dark:text-[#F1F5F9]">{todayIST}</p>
            <p className="text-[10px] tracking-wide text-[#FF5A1F] uppercase font-sans font-bold">
              New Delhi • London • Singapore • New York
            </p>
          </div>

          {/* Center Brand Logo */}
          <div className="text-center mx-auto sm:mx-0">
            <Link href="/" className="inline-block group focus:outline-hidden">
              <span className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B1020] dark:text-[#F1F5F9] hover:opacity-95 transition-opacity">
                ZestFeed<span className="text-[#FF5A1F] italic font-serif">X</span>
              </span>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-sans text-[#525866] dark:text-[#94A3B8] mt-0.5 font-medium">
                Journalism of Record for India & the Diaspora
              </p>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search articles"
              className="p-1.5 rounded-full hover:bg-[#ECE7DE] dark:hover:bg-[#1E293B] text-[#0B1020] dark:text-[#F1F5F9] transition"
            >
              <Search className="w-4 h-4" />
            </button>

            <Link
              href="/#newsletter"
              className="hidden sm:inline-flex items-center gap-1 bg-[#0B1020] dark:bg-[#F1F5F9] text-white dark:text-[#0B1020] hover:bg-[#FF5A1F] dark:hover:bg-[#FF5A1F] dark:hover:text-white px-3 py-1.5 rounded text-[11px] font-semibold tracking-wide transition-all shadow-xs"
            >
              <span>The Dispatch</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-1.5 rounded text-[#0B1020] dark:text-[#F1F5F9] hover:bg-[#ECE7DE] dark:hover:bg-[#1E293B]"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Search */}
        {searchOpen && (
          <div className="pt-3 pb-1 transition-all">
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search verified news, Sensex, AI chips, Bastar, RBI, cricket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                className="w-full bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#DDD7CD] dark:border-[#1E293B] rounded-lg px-3.5 py-2 pl-9 text-xs text-[#0B1020] dark:text-[#F1F5F9] placeholder-[#94A3B8] focus:outline-hidden focus:border-[#FF5A1F] shadow-xs"
                autoFocus
              />
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-2.5" />
            </div>
          </div>
        )}
      </div>

      {/* 3. PERMANENT STICKY CATEGORY NAVIGATION MENU (DESKTOP & MOBILE) */}
      <nav
        aria-label="Categories Navigation"
        className="w-full border-t border-[#E8E4DC] dark:border-[#1E293B] sticky top-0 z-40 bg-[#FAF8F4]/98 dark:bg-[#080C16]/98 backdrop-blur-md shadow-xs transition-all"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 flex items-center justify-between gap-1 sm:gap-2">
          {/* Mobile Categories Button (Clearly labelled, compact trigger) */}
          <div className="sm:hidden flex items-center gap-1.5 py-1.5 shrink-0">
            <button
              ref={categoriesTriggerRef}
              onClick={() => setMobileDrawerOpen(true)}
              aria-expanded={mobileDrawerOpen}
              aria-controls="mobile-categories-drawer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0B1020] dark:bg-white text-white dark:text-[#0B1020] text-xs font-bold shadow-xs focus-visible:ring-2 focus-visible:ring-[#FF5A1F] focus-visible:outline-none transition-transform active:scale-95"
            >
              <Menu className="w-3.5 h-3.5" />
              <span>{currentLanguage === "hi" ? "सभी श्रेणियां" : "Categories"}</span>
            </button>
          </div>

          {/* Desktop Left Scroll Chevron Button */}
          {canScrollLeft && (
            <button
              onClick={() => scrollCategory("left")}
              aria-label="Scroll categories left"
              className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-[#FAF8F4] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] text-[#525866] dark:text-[#94A3B8] hover:text-[#0B1020] dark:hover:text-white shadow-xs shrink-0 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Horizontal Scrollable Category Bar (Mouse, Touch & Keyboard Supported) */}
          <ul
            ref={categoryNavRef}
            onScroll={checkScrollButtons}
            tabIndex={0}
            aria-label="News categories list"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                scrollCategory("right");
              } else if (e.key === "ArrowLeft") {
                scrollCategory("left");
              }
            }}
            className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1.5 scrollbar-none text-xs font-medium flex-1 scroll-smooth focus-visible:ring-1 focus-visible:ring-[#FF5A1F] focus-visible:outline-none rounded"
          >
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;
              const title = currentLanguage === "hi" ? cat.label_hi : cat.label;
              return (
                <li key={cat.id} className="relative shrink-0">
                  <Link
                    href={cat.href}
                    data-active={isSelected ? "true" : "false"}
                    className={`px-3 py-1.5 rounded-md transition-all text-[11px] sm:text-xs font-semibold tracking-tight inline-flex items-center gap-1.5 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#FF5A1F] focus-visible:outline-none ${isSelected
                        ? "text-[#FF5A1F] bg-[#FF5A1F]/10 dark:bg-[#FF5A1F]/15 font-bold"
                        : "text-[#525866] dark:text-[#94A3B8] hover:text-[#0B1020] dark:hover:text-[#FFFFFF] hover:bg-[#ECE7DE]/50 dark:hover:bg-[#1E293B]/50"
                      }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{title}</span>
                    {cat.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider ${cat.badge === "Lead"
                            ? "bg-[#0E7C86] text-white"
                            : "bg-[#D7263D] text-white animate-pulse"
                          }`}
                      >
                        {cat.badge}
                      </span>
                    )}
                  </Link>
                  {isSelected && (
                    <motion.div
                      layoutId="globalActiveCategory"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#FF5A1F]"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {/* Desktop Right Scroll Chevron Button */}
          {canScrollRight && (
            <button
              onClick={() => scrollCategory("right")}
              aria-label="Scroll categories right"
              className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-[#FAF8F4] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] text-[#525866] dark:text-[#94A3B8] hover:text-[#0B1020] dark:hover:text-white shadow-xs shrink-0 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Categories Slide-Over Drawer (Accessible, Full Screen Height, Escape & Keyboard Trapping) */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setMobileDrawerOpen(false);
                categoriesTriggerRef.current?.focus();
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Drawer Panel */}
            <motion.div
              id="mobile-categories-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="All News Categories"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-xs sm:max-w-sm bg-[#FAF8F4] dark:bg-[#080C16] text-[#0B1020] dark:text-[#F1F5F9] shadow-2xl flex flex-col h-full z-10 border-l border-[#E8E4DC] dark:border-[#1E293B]"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-[#E8E4DC] dark:border-[#1E293B] flex items-center justify-between bg-white dark:bg-[#0F172A]">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0B1020] dark:text-white">
                    {currentLanguage === "hi" ? "सभी समाचार श्रेणियां" : "All Categories"}
                  </h3>
                  <p className="text-[11px] text-[#525866] dark:text-[#94A3B8]">
                    {currentLanguage === "hi" ? "प्रत्येक श्रेणी सीधे सुलभ है" : "Reachable & scrollable across mobile"}
                  </p>
                </div>
                <button
                  ref={drawerCloseBtnRef}
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    categoriesTriggerRef.current?.focus();
                  }}
                  aria-label="Close categories menu"
                  className="p-2 rounded-lg bg-[#FAF8F4] dark:bg-[#1E293B] text-[#525866] dark:text-[#94A3B8] hover:text-[#0B1020] dark:hover:text-white focus-visible:ring-2 focus-visible:ring-[#FF5A1F] focus-visible:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Content (Shows every category including below screen) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1.5 pb-20">
                {CATEGORIES.map((cat) => {
                  const isSelected = activeCategory === cat.id;
                  const title = currentLanguage === "hi" ? cat.label_hi : cat.label;
                  return (
                    <Link
                      key={cat.id}
                      href={cat.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all text-sm font-semibold min-h-[48px] focus-visible:ring-2 focus-visible:ring-[#FF5A1F] focus-visible:outline-none ${isSelected
                          ? "bg-[#FF5A1F] text-white shadow-xs"
                          : "bg-white dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] text-[#0B1020] dark:text-[#F1F5F9] hover:border-[#FF5A1F]"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{cat.icon}</span>
                        <div>
                          <span>{title}</span>
                          {currentLanguage !== "hi" && cat.label_hi && (
                            <span className="block text-[10px] text-opacity-80 font-normal">
                              {cat.label_hi}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {cat.badge && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${cat.badge === "Lead"
                                ? "bg-[#0E7C86] text-white"
                                : "bg-[#D7263D] text-white"
                              }`}
                          >
                            {cat.badge}
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 opacity-50" />
                      </div>
                    </Link>
                  );
                })}

                {/* Direct Telemetry & Calendar Admin Links */}
                <div className="pt-4 mt-4 border-t border-[#E8E4DC] dark:border-[#1E293B] space-y-2">
                  <Link
                    href="/admin/publishing-status/"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold bg-[#FAF8F4] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] text-[#525866] dark:text-[#94A3B8]"
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-[#0E7C86]" />
                      Publishing Status & Telemetry
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/category/health/"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold bg-[#0E7C86]/10 text-[#0E7C86] border border-[#0E7C86]/30"
                  >
                    <span>🩺 Health & Medicine Bureau</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/category/cricket/"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold bg-[#D7263D]/10 text-[#D7263D] border border-[#D7263D]/30"
                  >
                    <span>🏏 Cricket Match Centre</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Traditional Quick Dropdown for Search or Edition */}
    </header>
  );
}
