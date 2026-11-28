"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Trophy, Wind, Coins, Fuel, Radio } from "lucide-react";

interface MarketItem {
  symbol: string;
  name: string;
  value: string;
  change: string;
  is_positive: boolean;
}

interface CricketItem {
  title: string;
  isLive: boolean;
}

export default function LiveIndiaPulse({ currentLanguage }: { currentLanguage: "en" | "hi" }) {
  const isHindi = currentLanguage === "hi";
  const [markets, setMarkets] = useState<MarketItem[]>([]);
  const [topMatch, setTopMatch] = useState<CricketItem | null>(null);

  useEffect(() => {
    fetch("/api/markets/live")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.tickers) setMarkets(d.tickers);
        else if (Array.isArray(d)) setMarkets(d);
      })
      .catch(() => {});

    fetch("/api/cricket/live")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.matches?.length > 0) setTopMatch(d.matches[0]);
      })
      .catch(() => {});
  }, []);

  const sensex = markets.find((m) => m.symbol === "SENSEX");
  const nifty = markets.find((m) => m.symbol === "NIFTY");
  const gold = markets.find((m) => m.symbol === "GOLD");

  return (
    <div className="w-full bg-white dark:bg-[#0B1020] border-b border-[#E8E4DC] dark:border-[#1E293B] py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3 overflow-x-auto scrollbar-none text-[11px] font-medium">
        <span className="shrink-0 font-bold uppercase tracking-wider text-[#FF5A1F] flex items-center gap-1">
          <Radio className="w-3 h-3 animate-pulse" />
          {isHindi ? "लाइव पल्स" : "India Pulse"}
        </span>

        <span className="text-[#DDD7CD] dark:text-[#334155]">|</span>

        {/* Live Cricket Pill */}
        <Link
          href="/category/cricket/"
          className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF8F4] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] hover:border-[#D7263D] transition-colors"
        >
          <Trophy className="w-3 h-3 text-[#D7263D]" />
          <span className="font-semibold text-[#0B1020] dark:text-[#F1F5F9] max-w-[230px] truncate">
            {topMatch ? topMatch.title : isHindi ? "लाइव क्रिकेट स्कोर" : "Live Cricket Scores"}
          </span>
        </Link>

        {/* Sensex & Nifty */}
        {sensex && (
          <Link
            href="/category/markets/"
            className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF8F4] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] hover:border-[#FF5A1F] transition-colors"
          >
            <span className="font-bold text-[#0B1020] dark:text-white">SENSEX</span>
            <span>{sensex.value}</span>
            <span className={`inline-flex items-center font-bold ${sensex.is_positive ? "text-emerald-600" : "text-red-600"}`}>
              {sensex.is_positive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
              {sensex.change}
            </span>
          </Link>
        )}

        {nifty && (
          <Link
            href="/category/markets/"
            className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF8F4] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] hover:border-[#FF5A1F] transition-colors"
          >
            <span className="font-bold text-[#0B1020] dark:text-white">NIFTY</span>
            <span>{nifty.value}</span>
            <span className={`font-bold ${nifty.is_positive ? "text-emerald-600" : "text-red-600"}`}>{nifty.change}</span>
          </Link>
        )}

        {/* Gold */}
        <Link
          href="/data/gold-silver-price-india/"
          className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF8F4] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] hover:border-amber-500 transition-colors"
        >
          <Coins className="w-3 h-3 text-amber-500" />
          <span>{gold ? `Gold ${gold.value}` : isHindi ? "सोना-चांदी भाव" : "Gold & Silver"}</span>
        </Link>

        {/* Delhi AQI */}
        <Link
          href="/topic/delhi-aqi/"
          className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF8F4] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] hover:border-[#0E7C86] transition-colors"
        >
          <Wind className="w-3 h-3 text-[#0E7C86]" />
          <span>{isHindi ? "दिल्ली AQI" : "Delhi AQI"}</span>
        </Link>

        {/* Fuel */}
        <Link
          href="/data/petrol-diesel-price-india/"
          className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF8F4] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] hover:border-[#FF5A1F] transition-colors"
        >
          <Fuel className="w-3 h-3 text-[#FF5A1F]" />
          <span>{isHindi ? "पेट्रोल-डीज़ल" : "Fuel Rates"}</span>
        </Link>
      </div>
    </div>
  );
}
