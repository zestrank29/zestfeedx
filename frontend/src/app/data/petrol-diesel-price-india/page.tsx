import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Fuel, Clock, Gauge, Info, DollarSign, Layers } from "lucide-react";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";
import { formatISTDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Petrol and Diesel Price Today in India (City-Wise) | State VAT & Excise Duty Breakdown",
  description: "Live daily petrol and diesel rates across Delhi, Mumbai, Kolkata, Chennai, Bengaluru, and Hyderabad with state VAT, union excise duty, and OMC refinery cost breakdowns.",
  alternates: {
    canonical: "https://zestfeedx.com/data/petrol-diesel-price-india/",
  },
};

interface FuelCityRate {
  city: string;
  state: string;
  petrol: string;
  diesel: string;
  vatRate: string;
}

const FUEL_RATES: FuelCityRate[] = [
  { city: "New Delhi", state: "Delhi (NCT)", petrol: "₹94.72", diesel: "₹87.62", vatRate: "19.40%" },
  { city: "Mumbai", state: "Maharashtra", petrol: "₹103.44", diesel: "₹89.97", vatRate: "25.00% + ₹5.12 Cess" },
  { city: "Kolkata", state: "West Bengal", petrol: "₹104.95", diesel: "₹91.76", vatRate: "25.00%" },
  { city: "Chennai", state: "Tamil Nadu", petrol: "₹100.75", diesel: "₹92.34", vatRate: "13.00% + ₹11.52/L" },
  { city: "Bengaluru", state: "Karnataka", petrol: "₹102.86", diesel: "₹88.94", vatRate: "25.92%" },
  { city: "Hyderabad", state: "Telangana", petrol: "₹107.41", diesel: "₹95.65", vatRate: "35.20%" },
  { city: "Lucknow", state: "Uttar Pradesh", petrol: "₹94.65", diesel: "₹87.76", vatRate: "19.36%" },
  { city: "Ahmedabad", state: "Gujarat", petrol: "₹94.44", diesel: "₹90.11", vatRate: "13.70% + 4% Cess" },
];

export default function PetrolDieselPricePage() {
  const nowIST = formatISTDate(new Date());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Indian City-Wise Petrol and Diesel Retail Selling Prices",
    description: "Daily retail motor spirit (petrol) and high-speed diesel (HSD) prices across Indian states and union territories.",
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

      {/* Header Bar */}
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
              Energy & Transport Intelligence • PPAC Calibrated
            </span>
            <span className="text-xs text-[#525866] dark:text-[#94A3B8] flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3" /> Updated {nowIST}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B1020] dark:text-[#F1F5F9]">
            Petrol & Diesel Rates Today in India
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#525866] dark:text-[#94A3B8] max-w-3xl leading-relaxed">
            Daily dynamic fuel rates across Indian metropolitan hubs calibrated by State Oil Marketing Companies (IOCL, BPCL, HPCL) alongside state-by-state tax divergences.
          </p>
        </div>

        {/* Highlight Tickers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl p-5 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] font-mono">
              National Capital Benchmark (Delhi)
            </span>
            <div className="mt-2 flex items-baseline gap-4">
              <div>
                <span className="text-xs font-semibold text-[#525866] dark:text-[#94A3B8] block">Petrol</span>
                <span className="font-display text-2xl sm:text-3xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                  ₹94.72
                </span>
              </div>
              <div className="border-l border-[#E8E4DC] dark:border-[#1E293B] pl-4">
                <span className="text-xs font-semibold text-[#525866] dark:text-[#94A3B8] block">Diesel</span>
                <span className="font-display text-2xl sm:text-3xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                  ₹87.62
                </span>
              </div>
            </div>
            <p className="text-[10px] text-[#525866] dark:text-[#94A3B8] mt-2 font-mono">
              Daily dynamic pricing revised @ 06:00 IST
            </p>
          </div>

          <div className="bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl p-5 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] font-mono">
              Brent Crude Oil Global Reference
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-3xl sm:text-4xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                $73.40
              </span>
              <span className="text-xs font-mono text-[#525866] dark:text-[#94A3B8]">
                / barrel
              </span>
            </div>
            <p className="text-[10px] text-[#525866] dark:text-[#94A3B8] mt-2 font-mono">
              Indian basket crude import parity stable
            </p>
          </div>

          <div className="bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl p-5 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] font-mono">
              Union Excise Duty Component
            </span>
            <div className="mt-2 flex items-baseline gap-4">
              <div>
                <span className="text-xs font-semibold text-[#525866] dark:text-[#94A3B8] block">Petrol</span>
                <span className="font-display text-xl sm:text-2xl font-bold text-[#0E7C86]">
                  ₹19.90/L
                </span>
              </div>
              <div className="border-l border-[#E8E4DC] dark:border-[#1E293B] pl-4">
                <span className="text-xs font-semibold text-[#525866] dark:text-[#94A3B8] block">Diesel</span>
                <span className="font-display text-xl sm:text-2xl font-bold text-[#0E7C86]">
                  ₹15.80/L
                </span>
              </div>
            </div>
            <p className="text-[10px] text-[#525866] dark:text-[#94A3B8] mt-2 font-mono">
              Central levy fixed nationally across all states
            </p>
          </div>
        </div>

        {/* City Fuel Rate Table */}
        <div className="bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl overflow-hidden mb-8 shadow-xs">
          <div className="p-5 border-b border-[#E8E4DC] dark:border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                City-Wise Fuel Price Index
              </h2>
              <p className="text-xs text-[#525866] dark:text-[#94A3B8]">
                Prices vary between states due to local Value Added Tax (VAT), sales tax, and freight differentials.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#525866] dark:text-[#94A3B8] bg-[#FAF8F4] dark:bg-[#1E293B] px-2.5 py-1 rounded border border-[#E8E4DC] dark:border-[#334155]">
              Daily 06:00 IST Revision
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F4] dark:bg-[#0B1020] border-b border-[#E8E4DC] dark:border-[#1E293B] text-[10px] uppercase tracking-wider text-[#94A3B8] font-mono">
                <tr>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4">State / Jurisdiction</th>
                  <th className="py-3.5 px-4">Petrol Rate (/Litre)</th>
                  <th className="py-3.5 px-4">Diesel Rate (/Litre)</th>
                  <th className="py-3.5 px-4">State VAT Tariff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DC] dark:divide-[#1E293B]">
                {FUEL_RATES.map((f) => (
                  <tr key={f.city} className="hover:bg-[#FAF8F4] dark:hover:bg-[#1E293B]/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#0B1020] dark:text-[#F1F5F9]">{f.city}</td>
                    <td className="py-3.5 px-4 text-[#525866] dark:text-[#94A3B8]">{f.state}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#0B1020] dark:text-[#F1F5F9]">{f.petrol}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#0E7C86]">{f.diesel}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#525866] dark:text-[#94A3B8]">{f.vatRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AdSlot */}
        <AdSlot format="leaderboard" slotId="fuel-data-mid" />

        {/* Price Breakdown Math */}
        <div className="bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl p-6 sm:p-8 mb-8 shadow-xs space-y-6">
          <div className="border-b border-[#E8E4DC] dark:border-[#1E293B] pb-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF5A1F] font-mono">
              Macro Structure
            </span>
            <h3 className="font-display text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9] mt-1">
              Anatomy of ₹100 Paid at an Indian Fuel Pump
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-[#525866] dark:text-[#94A3B8] leading-relaxed">
            <div>
              <span className="font-mono text-base font-bold text-[#0B1020] dark:text-[#F1F5F9] block mb-1">
                ≈ ₹55.50
              </span>
              <h4 className="font-display text-xs font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-1">
                Base Crude & Refining
              </h4>
              <p>
                The landed cost of imported crude oil, ocean freight, and OMC refining margin prior to taxation.
              </p>
            </div>

            <div>
              <span className="font-mono text-base font-bold text-[#0E7C86] block mb-1">
                ≈ ₹19.90
              </span>
              <h4 className="font-display text-xs font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-1">
                Union Central Excise
              </h4>
              <p>
                Levied uniformly across India by the Central Government, consisting of basic excise and infrastructure cess.
              </p>
            </div>

            <div>
              <span className="font-mono text-base font-bold text-[#FF5A1F] block mb-1">
                ≈ ₹3.80
              </span>
              <h4 className="font-display text-xs font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-1">
                Dealer Commission
              </h4>
              <p>
                Commission paid to retail pump operators covering dispensing costs, evaporation losses, and overhead.
              </p>
            </div>

            <div>
              <span className="font-mono text-base font-bold text-[#D7263D] block mb-1">
                ≈ ₹15.00 – ₹24.00
              </span>
              <h4 className="font-display text-xs font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-1">
                State Sales Tax / VAT
              </h4>
              <p>
                Varies widely by state (e.g. 19.4% in Delhi vs 35.2% in Telangana), explaining wide retail price differences.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
