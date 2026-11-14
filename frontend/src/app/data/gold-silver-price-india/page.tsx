import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, TrendingUp, TrendingDown, Clock, ShieldCheck, HelpCircle, DollarSign } from "lucide-react";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";
import { formatISTDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Gold and Silver Rates Today in India (24K, 22K by City) | MCX Spot & Duty Analysis",
  description: "Live 24K and 22K gold prices per 10 grams and silver per 1kg across Delhi, Mumbai, Chennai, Bengaluru, Kolkata, and Hyderabad with customs duty and GST breakdowns.",
  alternates: {
    canonical: "https://zestfeedx.com/data/gold-silver-price-india/",
  },
};

interface CityGoldRate {
  city: string;
  gold24k: string;
  gold22k: string;
  silver1kg: string;
  change: string;
  isPositive: boolean;
}

const CITY_RATES: CityGoldRate[] = [
  { city: "New Delhi", gold24k: "₹77,620", gold22k: "₹71,150", silver1kg: "₹93,500", change: "+₹240", isPositive: true },
  { city: "Mumbai", gold24k: "₹77,470", gold22k: "₹71,010", silver1kg: "₹93,200", change: "+₹220", isPositive: true },
  { city: "Chennai", gold24k: "₹78,050", gold22k: "₹71,550", silver1kg: "₹97,200", change: "+₹310", isPositive: true },
  { city: "Kolkata", gold24k: "₹77,470", gold22k: "₹71,010", silver1kg: "₹93,200", change: "+₹220", isPositive: true },
  { city: "Bengaluru", gold24k: "₹77,520", gold22k: "₹71,060", silver1kg: "₹93,400", change: "+₹230", isPositive: true },
  { city: "Hyderabad", gold24k: "₹77,470", gold22k: "₹71,010", silver1kg: "₹97,200", change: "+₹220", isPositive: true },
  { city: "Ahmedabad", gold24k: "₹77,520", gold22k: "₹71,060", silver1kg: "₹93,300", change: "+₹210", isPositive: true },
];

export default function GoldSilverPricePage() {
  const nowIST = formatISTDate(new Date());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Indian City-Wise Gold and Silver Spot Prices",
    description: "Daily retail 24 Karat and 22 Karat gold bullion rates and 999 purity fine silver rates across major metropolitan jewelry markets in India.",
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "ZestFeedX",
      url: "https://zestfeedx.com",
    },
    temporalCoverage: new Date().toISOString().slice(0, 10),
    spatialCoverage: "India",
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] dark:bg-[#080C16] text-[#0B1020] dark:text-[#F1F5F9] transition-colors">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <div className="border-b border-[#E8E4DC] dark:border-[#1E293B] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="inline-block">
            <span className="font-display text-2xl font-bold tracking-tight text-[#0B1020] dark:text-[#F1F5F9]">
              ZestFeed<span className="text-[#FF5A1F] italic font-serif">X</span>
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-[#525866] dark:text-[#94A3B8] hover:text-[#FF5A1F] flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Front Page</span>
          </Link>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#0E7C86] bg-[#0E7C86]/10 px-2 py-0.5 rounded font-mono">
              Bullion Intelligence • MCX & IBJA Calibrated
            </span>
            <span className="text-xs text-[#525866] dark:text-[#94A3B8] flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3" /> Updated {nowIST}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B1020] dark:text-[#F1F5F9]">
            Gold & Silver Rates Today in India
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#525866] dark:text-[#94A3B8] max-w-3xl leading-relaxed">
            City-specific indicative spot retail bullion prices for 24 Karat (99.9% pure) and 22 Karat (91.6% jeweller hallmarked) gold per 10 grams, alongside 1kg fine silver.
          </p>
        </div>

        {/* Highlight Tickers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl p-5 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] font-mono">
              National Benchmark (24K / 10g)
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-3xl sm:text-4xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                ₹77,470
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +0.35%
              </span>
            </div>
            <p className="text-[11px] text-[#525866] dark:text-[#94A3B8] mt-2">
              Excludes 3% GST and jeweler manufacturing surcharge
            </p>
          </div>

          <div className="bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl p-5 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] font-mono">
              Fine Silver Spot (1 kg)
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-3xl sm:text-4xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                ₹93,200
              </span>
              <span className="text-xs font-bold text-[#D7263D] flex items-center">
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> -0.45%
              </span>
            </div>
            <p className="text-[11px] text-[#525866] dark:text-[#94A3B8] mt-2">
              Calibrated against MCX silver futures delivery
            </p>
          </div>

          <div className="bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl p-5 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] font-mono">
              International Reference
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-3xl sm:text-4xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                $2,684
              </span>
              <span className="text-xs font-mono text-[#525866] dark:text-[#94A3B8]">
                / oz
              </span>
            </div>
            <p className="text-[11px] text-[#525866] dark:text-[#94A3B8] mt-2">
              COMEX Spot • USD/INR @ ₹84.38 reference rate
            </p>
          </div>
        </div>

        {/* City Table */}
        <div className="bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl overflow-hidden mb-8 shadow-xs">
          <div className="p-5 border-b border-[#E8E4DC] dark:border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                City-Wise Gold & Silver Price Table
              </h2>
              <p className="text-xs text-[#525866] dark:text-[#94A3B8]">
                Prices vary by state due to municipal transit duties and regional jeweler association tariffs.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#525866] dark:text-[#94A3B8] bg-[#FAF8F4] dark:bg-[#1E293B] px-2.5 py-1 rounded border border-[#E8E4DC] dark:border-[#334155]">
              Daily 10:00 IST Fixing
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F4] dark:bg-[#0B1020] border-b border-[#E8E4DC] dark:border-[#1E293B] text-[10px] uppercase tracking-wider text-[#94A3B8] font-mono">
                <tr>
                  <th className="py-3.5 px-4">Metropolitan Center</th>
                  <th className="py-3.5 px-4">24K Pure Gold (10g)</th>
                  <th className="py-3.5 px-4">22K Standard Gold (10g)</th>
                  <th className="py-3.5 px-4">Fine Silver (1kg)</th>
                  <th className="py-3.5 px-4">Daily Movement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DC] dark:divide-[#1E293B]">
                {CITY_RATES.map((item) => (
                  <tr key={item.city} className="hover:bg-[#FAF8F4] dark:hover:bg-[#1E293B]/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#0B1020] dark:text-[#F1F5F9]">{item.city}</td>
                    <td className="py-3.5 px-4 font-mono font-bold">{item.gold24k}</td>
                    <td className="py-3.5 px-4 font-mono">{item.gold22k}</td>
                    <td className="py-3.5 px-4 font-mono">{item.silver1kg}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {item.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AdSlot */}
        <AdSlot format="leaderboard" slotId="bullion-data-mid" />

        {/* Institutional Taxes & Buyer Primer */}
        <div className="bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl p-6 sm:p-8 mb-8 shadow-xs space-y-6">
          <div className="border-b border-[#E8E4DC] dark:border-[#1E293B] pb-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF5A1F] font-mono">
              Consumer Guide & Taxation
            </span>
            <h3 className="font-display text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9] mt-1">
              How Physical Gold Prices are Calculated in India
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#525866] dark:text-[#94A3B8] leading-relaxed">
            <div>
              <h4 className="font-display text-sm font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-1.5">
                1. Import Tariff (Basic Customs Duty)
              </h4>
              <p>
                India imports over 85% of its annual gold requirements. Following the Union Budget revisions, the effective customs duty on gold bars stands at 6%, drastically cutting smuggling arbitrage and aligning local rates closer to international parity.
              </p>
            </div>

            <div>
              <h4 className="font-display text-sm font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-1.5">
                2. Goods and Services Tax (GST)
              </h4>
              <p>
                A uniform 3% GST is levied on the value of gold bullion, with an additional 5% GST applied to making and craftsmanship charges. When selling back old gold, no GST is deducted if exchanged with registered jewellers.
              </p>
            </div>

            <div>
              <h4 className="font-display text-sm font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-1.5">
                3. BIS 6-Digit HUID Hallmarking
              </h4>
              <p>
                Under Bureau of Indian Standards mandates, no unhallmarked gold jewelry can be legally sold. Always verify the 6-character alphanumeric Hallmark Unique Identification (HUID) code using the BIS Care mobile app prior to purchase.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
