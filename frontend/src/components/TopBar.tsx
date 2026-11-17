"use client";

import React, { useState, useEffect } from "react";
import { Moon, Sun, Globe, TrendingUp, TrendingDown, CloudSun, MapPin, Building2, Radio } from "lucide-react";
import { MARKET_TICKERS, CITY_METRICS, DIASPORA_TICKERS, DIASPORA_HUBS, MarketTicker } from "@/data/demoContent";

interface TopBarProps {
  currentLanguage: "en" | "hi";
  onLanguageChange: (lang: "en" | "hi") => void;
  currentEdition: "india" | "world";
  onEditionChange: (edition: "india" | "world") => void;
}

export default function TopBar({
  currentLanguage,
  onLanguageChange,
  currentEdition,
  onEditionChange,
}: TopBarProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeCityIdx, setActiveCityIdx] = useState(0);
  const [liveMarketTickers, setLiveMarketTickers] = useState<MarketTicker[]>(MARKET_TICKERS);
  const [isMarketLive, setIsMarketLive] = useState(true);

  // Sync dark mode state with HTML class
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

  // Live Market Data Fetching (Sensex, Nifty, Gold, Silver, USD/INR)
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
        // keep previous tickers on non-blocking network failure
      }
    }

    fetchLiveMarkets();
    const marketInterval = setInterval(fetchLiveMarkets, 20000); // 20s live update

    return () => {
      isMounted = false;
      clearInterval(marketInterval);
    };
  }, []);

  const activeCityList = currentEdition === "world" ? DIASPORA_HUBS : CITY_METRICS;

  // Cycle through hubs/cities every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCityIdx((prev) => (prev + 1) % activeCityList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeCityList.length]);

  const currentCity = CITY_METRICS[activeCityIdx % CITY_METRICS.length];
  const currentDiasporaHub = DIASPORA_HUBS[activeCityIdx % DIASPORA_HUBS.length];
  const activeTickers = currentEdition === "world" ? DIASPORA_TICKERS : liveMarketTickers;

  return (
    <div className="w-full bg-[#FAF8F4] dark:bg-[#080C16] border-b border-[#E8E4DC] dark:border-[#1E293B] text-[11px] font-medium tracking-tight text-[#525866] dark:text-[#94A3B8] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left Side: Edition & Language & Weather/AQI */}
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto py-0.5 scrollbar-none">
          {/* Edition Toggle */}
          <div className="flex items-center bg-[#ECE7DE] dark:bg-[#0F172A] rounded p-0.5 border border-[#DDD7CD] dark:border-[#1E293B]">
            <button
              onClick={() => onEditionChange("india")}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${currentEdition === "india"
                ? "bg-[#FFFFFF] dark:bg-[#1E293B] text-[#0B1020] dark:text-[#F1F5F9] shadow-xs"
                : "text-[#525866] dark:text-[#94A3B8] hover:text-[#0B1020] dark:hover:text-[#FFFFFF]"
                }`}
            >
              {currentLanguage === "hi" ? "भारत संस्करण" : "India Edition"}
            </button>
            <button
              onClick={() => onEditionChange("world")}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${currentEdition === "world"
                ? "bg-[#FFFFFF] dark:bg-[#1E293B] text-[#0B1020] dark:text-[#F1F5F9] shadow-xs"
                : "text-[#525866] dark:text-[#94A3B8] hover:text-[#0B1020] dark:hover:text-[#FFFFFF]"
                }`}
            >
              {currentLanguage === "hi" ? "वैश्विक प्रवासी" : "Global Diaspora"}
            </button>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-1 border-l border-[#E8E4DC] dark:border-[#1E293B] pl-3">
            <Globe className="w-3 h-3 text-[#FF5A1F]" />
            <button
              onClick={() => onLanguageChange("en")}
              className={`px-1.5 py-0.5 rounded transition ${currentLanguage === "en"
                ? "font-bold text-[#FF5A1F] underline underline-offset-2"
                : "hover:text-[#0B1020] dark:hover:text-white"
                }`}
            >
              EN
            </button>
            <span className="text-[#DDD7CD] dark:text-[#334155]">/</span>
            <button
              onClick={() => onLanguageChange("hi")}
              className={`px-1.5 py-0.5 rounded transition font-hindi ${currentLanguage === "hi"
                ? "font-bold text-[#FF5A1F] underline underline-offset-2"
                : "hover:text-[#0B1020] dark:hover:text-white"
                }`}
            >
              हिंदी
            </button>
          </div>

          {/* Live City Weather & AQI Metrics */}
          {currentEdition === "india" ? (
            <div className="hidden md:flex items-center gap-2 border-l border-[#E8E4DC] dark:border-[#1E293B] pl-3">
              <span className="flex items-center gap-1 text-[#0B1020] dark:text-[#F1F5F9]">
                <MapPin className="w-3 h-3 text-[#FF5A1F]" />
                <span className="font-semibold">{currentCity.city}:</span>
              </span>
              <span className="flex items-center gap-1">
                <CloudSun className="w-3 h-3 text-amber-500" />
                <span>{currentCity.temp}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span>{currentLanguage === "hi" ? "वायु गुणवत्ता (AQI):" : "AQI:"}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${currentCity.aqi > 300
                    ? "bg-rose-500 text-white"
                    : currentCity.aqi > 200
                      ? "bg-amber-500 text-white"
                      : "bg-emerald-600 text-white"
                    }`}
                >
                  {currentCity.aqi}
                </span>
                <span className="text-[10px] text-[#525866] dark:text-[#94A3B8]">
                  ({currentCity.aqi_label})
                </span>
              </span>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 border-l border-[#E8E4DC] dark:border-[#1E293B] pl-3">
              <span className="flex items-center gap-1 text-[#0B1020] dark:text-[#F1F5F9]">
                <Building2 className="w-3 h-3 text-[#FF5A1F]" />
                <span className="font-semibold">{currentDiasporaHub.city}</span>
                <span className="text-[10px] text-[#0E7C86] font-mono">({currentDiasporaHub.label}):</span>
              </span>
              <span className="flex items-center gap-1">
                <CloudSun className="w-3 h-3 text-amber-500" />
                <span>{currentDiasporaHub.temp}</span>
              </span>
              <span className="bg-[#FF5A1F]/10 text-[#FF5A1F] text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                {currentLanguage === "hi" ? "प्रवासी डेस्क" : "Global Hub"}
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Live Market Ticker & Dark Mode */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          {/* Live Market Chips with Pulse Indicator */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-mono border-r border-[#E8E4DC] dark:border-[#1E293B] pr-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {currentLanguage === "hi" ? "लाइव बाजार" : "LIVE"}
              </span>
            </div>

            {activeTickers.slice(0, 4).map((item: MarketTicker) => (
              <div key={item.symbol} className="flex items-center gap-1">
                <span className="font-semibold text-[#0B1020] dark:text-[#F1F5F9]">{item.name}</span>
                <span>{item.value}</span>
                <span
                  className={`flex items-center text-[10px] font-bold ${item.is_positive ? "text-emerald-600 dark:text-emerald-400" : "text-[#D7263D]"
                    }`}
                >
                  {item.is_positive ? (
                    <TrendingUp className="w-2.5 h-2.5 mr-0.5 inline" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5 mr-0.5 inline" />
                  )}
                  {item.change}
                </span>
              </div>
            ))}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            className="flex items-center justify-center p-1 rounded-md text-[#525866] dark:text-[#94A3B8] hover:text-[#0B1020] dark:hover:text-[#F1F5F9] hover:bg-[#ECE7DE] dark:hover:bg-[#1E293B] transition"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
