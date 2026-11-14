"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Menu,
  X,
  ArrowUpRight,
  Globe,
  Moon,
  Sun,
  Flame,
} from "lucide-react";
import {
  MARKET_TICKERS,
  CITY_METRICS,
  DIASPORA_TICKERS,
  DIASPORA_HUBS,
} from "@/data/demoContent";

export const CATEGORIES = [
  { id: "all", label: "Front Page", label_hi: "मुख्य पृष्ठ", href: "/" },
  { id: "markets", label: "Markets & Money", label_hi: "बाजार एवं वित्त", href: "/category/markets/" },
  { id: "tech", label: "Tech & AI", label_hi: "तकनीक एवं एआई", href: "/category/tech/" },
  { id: "india", label: "India Policy", label_hi: "भारत एवं नीतियां", href: "/category/india/" },
  { id: "world", label: "World Affairs", label_hi: "वैश्विक परिदृश्य", href: "/category/world/" },
  { id: "health", label: "Health & Climate", label_hi: "स्वास्थ्य एवं पर्यावरण", href: "/category/health/" },
  { id: "sports", label: "Sports", label_hi: "खेल जगत", href: "/category/sports/" },
  { id: "entertainment", label: "Culture & Arts", label_hi: "कला एवं संस्कृति", href: "/category/entertainment/" },
  { id: "ramayana", label: "Heritage", label_hi: "विरासत एवं संस्कृति", href: "/category/ramayana/" },
  { id: "explainers", label: "Deep Explainers", label_hi: "गहन विश्लेषण", href: "/explainers/" },
];

export default function GlobalHeader() {
  const pathname = usePathname();
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "hi">("en");
  const [currentEdition, setCurrentEdition] = useState<"india" | "world">("india");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeCityIdx, setActiveCityIdx] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Detect current active category from pathname
  const getActiveCategory = () => {
    if (!pathname || pathname === "/" || pathname === "/en" || pathname === "/hi") return "all";
    if (pathname.includes("/category/markets")) return "markets";
    if (pathname.includes("/category/tech")) return "tech";
    if (pathname.includes("/category/india")) return "india";
    if (pathname.includes("/category/world")) return "world";
    if (pathname.includes("/category/health")) return "health";
    if (pathname.includes("/category/sports")) return "sports";
    if (pathname.includes("/category/entertainment")) return "entertainment";
    if (pathname.includes("/category/ramayana")) return "ramayana";
    if (pathname.includes("/explainers")) return "explainers";
    return "";
  };

  const activeCategory = getActiveCategory();

  // Dark mode init
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
      if (pathname?.startsWith("/hi")) {
        setCurrentLanguage("hi");
      }
    }
  }, [pathname]);

  const toggleDarkMode = () => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.toggle("dark");
      setIsDarkMode(isDark);
      try {
        localStorage.setItem("zest_theme", isDark ? "dark" : "light");
      } catch {}
    }
  };

  const activeCityList = currentEdition === "world" ? DIASPORA_HUBS : CITY_METRICS;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCityIdx((prev) => (prev + 1) % activeCityList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeCityList.length]);

  const activeTickers = currentEdition === "world" ? DIASPORA_TICKERS : MARKET_TICKERS;
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
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                  currentEdition === "india"
                    ? "bg-[#FFFFFF] dark:bg-[#1E293B] text-[#0B1020] dark:text-[#F1F5F9] shadow-xs"
                    : "text-[#525866] dark:text-[#94A3B8] hover:text-[#0B1020] dark:hover:text-[#FFFFFF]"
                }`}
              >
                {currentLanguage === "hi" ? "भारत" : "India"}
              </button>
              <button
                onClick={() => setCurrentEdition("world")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                  currentEdition === "world"
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
                onClick={() => setCurrentLanguage("en")}
                className={`px-1.5 py-0.5 rounded transition ${
                  currentLanguage === "en"
                    ? "font-bold text-[#FF5A1F] underline underline-offset-2"
                    : "hover:text-[#0B1020] dark:hover:text-white"
                }`}
              >
                EN
              </button>
              <span className="text-[#DDD7CD] dark:text-[#334155]">/</span>
              <button
                onClick={() => setCurrentLanguage("hi")}
                className={`px-1.5 py-0.5 rounded transition font-hindi ${
                  currentLanguage === "hi"
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

          {/* Right: Delayed Financial Tickers & Dark Mode */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 overflow-x-auto scrollbar-none py-0.5">
              {activeTickers.slice(0, 4).map((tick) => (
                <div key={tick.symbol} className="flex items-center gap-1.5 shrink-0 text-[10.5px]">
                  <span className="font-semibold text-[#0B1020] dark:text-[#F1F5F9]">{tick.symbol}</span>
                  <span className="font-mono font-medium">{tick.value}</span>
                  <span
                    className={`font-mono text-[9.5px] ${
                      tick.is_positive ? "text-[#10B981]" : "text-[#D7263D]"
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

      {/* 3. PERMANENT STICKY CATEGORY NAVIGATION MENU */}
      <nav className="w-full border-t border-[#E8E4DC] dark:border-[#1E293B] sticky top-0 z-50 bg-[#FAF8F4]/95 dark:bg-[#080C16]/95 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1.5 scrollbar-none text-xs font-medium">
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;
              const title = currentLanguage === "hi" ? cat.label_hi : cat.label;
              return (
                <li key={cat.id} className="relative shrink-0">
                  <Link
                    href={cat.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-1.5 rounded-sm transition-colors text-[11px] sm:text-xs font-semibold tracking-tight inline-block ${
                      isSelected
                        ? "text-[#FF5A1F]"
                        : "text-[#525866] dark:text-[#94A3B8] hover:text-[#0B1020] dark:hover:text-[#FFFFFF]"
                    }`}
                  >
                    {title}
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
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#E8E4DC] dark:border-[#1E293B] bg-[#FAF8F4] dark:bg-[#0F172A] px-4 py-4 space-y-3">
          <p className="text-[10px] uppercase font-bold tracking-widest text-[#94A3B8]">Browse Categories</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-2.5 rounded block text-center ${
                  activeCategory === cat.id
                    ? "bg-[#FF5A1F] text-white font-bold"
                    : "text-[#525866] dark:text-[#94A3B8] bg-[#ECE7DE]/50 dark:bg-[#1E293B]/50 hover:bg-[#ECE7DE] dark:hover:bg-[#1E293B]"
                }`}
              >
                {currentLanguage === "hi" ? cat.label_hi : cat.label}
              </Link>
            ))}
          </div>
          <div className="pt-2 border-t border-[#E8E4DC] dark:border-[#1E293B]">
            <Link
              href="/#newsletter"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center bg-[#FF5A1F] text-white py-2 rounded text-xs font-semibold"
            >
              Subscribe to The Dispatch
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
