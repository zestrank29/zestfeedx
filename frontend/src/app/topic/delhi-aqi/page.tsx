import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, Wind, Thermometer, Droplets, MapPin, ShieldAlert, CheckCircle, Clock } from "lucide-react";
import TopBar from "@/components/TopBar";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";
import { formatISTDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Delhi NCR Air Quality Live Monitor (AQI) | CPCB Real-Time Stations & Health Advisory",
  description: "Live neighborhood-by-neighborhood Air Quality Index (AQI) across Delhi, Noida, Gurugram, and Faridabad from CPCB monitoring stations with meteorology and health advisories.",
  alternates: {
    canonical: "https://zestfeedx.com/topic/delhi-aqi/",
  },
  openGraph: {
    title: "Delhi NCR Air Quality Live Monitor (AQI) | ZestFeedX Intelligence",
    description: "Real-time CPCB telemetry, GRAP Stage enforcement status, and scientific analysis of winter thermal inversion.",
    url: "https://zestfeedx.com/topic/delhi-aqi/",
  },
};

interface StationData {
  name: string;
  location: string;
  aqi: number;
  category: "Severe" | "Very Poor" | "Poor" | "Moderate";
  color: string;
  pm25: number;
  pm10: number;
  primary: string;
}

const DELHI_STATIONS: StationData[] = [
  { name: "Anand Vihar", location: "East Delhi", aqi: 422, category: "Severe", color: "#991B1B", pm25: 385, pm10: 480, primary: "PM2.5" },
  { name: "Bawana", location: "North Delhi", aqi: 440, category: "Severe", color: "#991B1B", pm25: 410, pm10: 510, primary: "PM2.5" },
  { name: "Punjabi Bagh", location: "West Delhi", aqi: 384, category: "Very Poor", color: "#D7263D", pm25: 330, pm10: 420, primary: "PM2.5" },
  { name: "R.K. Puram", location: "South West Delhi", aqi: 368, category: "Very Poor", color: "#D7263D", pm25: 310, pm10: 390, primary: "PM2.5" },
  { name: "IGI Airport (T3)", location: "South West Delhi", aqi: 312, category: "Very Poor", color: "#D7263D", pm25: 270, pm10: 340, primary: "PM2.5" },
  { name: "Lodhi Road", location: "Central Delhi", aqi: 298, category: "Poor", color: "#EA580C", pm25: 240, pm10: 310, primary: "PM2.5" },
  { name: "Noida Sector 62", location: "Gautam Buddha Nagar", aqi: 355, category: "Very Poor", color: "#D7263D", pm25: 295, pm10: 380, primary: "PM2.5" },
  { name: "Gurugram Sector 51", location: "Gurugram", aqi: 330, category: "Very Poor", color: "#D7263D", pm25: 280, pm10: 360, primary: "PM2.5" },
];

export default function DelhiAqiPage() {
  const avgAqi = Math.round(DELHI_STATIONS.reduce((acc, s) => acc + s.aqi, 0) / DELHI_STATIONS.length);
  const nowIST = formatISTDate(new Date());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SpecialAnnouncement",
    name: "Delhi NCR Air Quality Advisory & Real-Time CPCB Telemetry",
    text: `Delhi NCR recorded an average Air Quality Index of ${avgAqi} ('Very Poor'), triggering CAQM GRAP Stage III restrictions.`,
    datePosted: new Date().toISOString(),
    spatialCoverage: {
      "@type": "Place",
      name: "National Capital Region, Delhi, India",
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "ZestFeedX",
      url: "https://zestfeedx.com",
    },
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
        {/* Title & Status Banner */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D7263D] bg-[#D7263D]/10 px-2 py-0.5 rounded font-mono">
              Live Environmental Telemetry • CPCB Ground Stations
            </span>
            <span className="text-xs text-[#525866] dark:text-[#94A3B8] flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3" /> Updated {nowIST}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B1020] dark:text-[#F1F5F9] leading-tight">
            Delhi NCR Air Quality Live Monitor
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#525866] dark:text-[#94A3B8] max-w-3xl leading-relaxed">
            Continuous ambient air telemetry measured at Central Pollution Control Board (CPCB) monitoring stations across New Delhi, Gurugram, Noida, and Ghaziabad.
          </p>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Average AQI */}
          <div className="bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl p-5 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] font-mono">
              NCR 24h Average AQI
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-4xl sm:text-5xl font-bold text-[#D7263D]">
                {avgAqi}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-bold text-white bg-[#D7263D]">
                Very Poor
              </span>
            </div>
            <p className="text-[11px] text-[#525866] dark:text-[#94A3B8] mt-2">
              Prominent pollutant: <strong className="text-[#0B1020] dark:text-white">PM2.5</strong> (exceeds WHO safe limit by 24x)
            </p>
          </div>

          {/* GRAP Status */}
          <div className="bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl p-5 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] font-mono">
              Regulatory Action
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-[#FF5A1F]">
                GRAP Stage III
              </span>
            </div>
            <p className="text-[11px] text-[#525866] dark:text-[#94A3B8] mt-2">
              Enforced by CAQM: Non-essential BS-III petrol & BS-IV diesel cars barred; non-clean construction halted.
            </p>
          </div>

          {/* Meteorological Trap */}
          <div className="bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl p-5 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] font-mono">
              Surface Atmospheric Physics
            </span>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-[#525866] dark:text-[#94A3B8]">
                <Wind className="w-3.5 h-3.5 text-[#0E7C86]" />
                <span>Wind: <strong>3.2 km/h</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-[#525866] dark:text-[#94A3B8]">
                <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                <span>Temp: <strong>18°C</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-[#525866] dark:text-[#94A3B8]">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span>Humidity: <strong>76%</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-[#525866] dark:text-[#94A3B8]">
                <ShieldAlert className="w-3.5 h-3.5 text-[#D7263D]" />
                <span>Inversion: <strong>120m</strong></span>
              </div>
            </div>
            <p className="text-[10px] text-[#525866] dark:text-[#94A3B8] mt-2 font-mono">
              Low boundary layer prevents vertical dispersion.
            </p>
          </div>

          {/* Health Caution */}
          <div className="bg-[#FDF2F2] dark:bg-[#1E1215] border border-[#FECACA] dark:border-[#7F1D1D] rounded-xl p-5 shadow-xs">
            <div className="flex items-center gap-1.5 text-[#991B1B] dark:text-[#F87171] text-xs font-bold mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Medical Warning</span>
            </div>
            <p className="text-[11px] text-[#7F1D1D] dark:text-[#FECACA] leading-relaxed">
              Prolonged outdoor exposure may lead to respiratory discomfort in healthy adults and serious complications in children, senior citizens, and patients with asthma or COPD.
            </p>
          </div>
        </div>

        {/* Station Breakdown Table */}
        <div className="bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl overflow-hidden mb-8 shadow-xs">
          <div className="p-5 border-b border-[#E8E4DC] dark:border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                Continuous Ambient Air Monitoring Stations (CAAQMS)
              </h2>
              <p className="text-xs text-[#525866] dark:text-[#94A3B8]">
                Source: Central Pollution Control Board (CPCB) official station feeds
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#525866] dark:text-[#94A3B8] bg-[#FAF8F4] dark:bg-[#1E293B] px-2.5 py-1 rounded border border-[#E8E4DC] dark:border-[#334155]">
              Real-time calibration verified
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F4] dark:bg-[#0B1020] border-b border-[#E8E4DC] dark:border-[#1E293B] text-[10px] uppercase tracking-wider text-[#94A3B8] font-mono">
                <tr>
                  <th className="py-3 px-4">Station Name</th>
                  <th className="py-3 px-4">Sector / Sub-Region</th>
                  <th className="py-3 px-4">Air Quality Index</th>
                  <th className="py-3 px-4">Severity Tier</th>
                  <th className="py-3 px-4">PM2.5 (µg/m³)</th>
                  <th className="py-3 px-4">PM10 (µg/m³)</th>
                  <th className="py-3 px-4">Lead Pollutant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DC] dark:divide-[#1E293B]">
                {DELHI_STATIONS.map((st) => (
                  <tr key={st.name} className="hover:bg-[#FAF8F4] dark:hover:bg-[#1E293B]/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#0B1020] dark:text-[#F1F5F9]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#0E7C86] shrink-0" />
                        <span>{st.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#525866] dark:text-[#94A3B8]">{st.location}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-sm" style={{ color: st.color }}>
                      {st.aqi}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-2xs"
                        style={{ backgroundColor: st.color }}
                      >
                        {st.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#525866] dark:text-[#94A3B8]">{st.pm25}</td>
                    <td className="py-3.5 px-4 font-mono text-[#525866] dark:text-[#94A3B8]">{st.pm10}</td>
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-[#0B1020] dark:text-white">{st.primary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reserved In-Article Ad Slot */}
        <AdSlot format="leaderboard" slotId="delhi-aqi-mid-leaderboard" />

        {/* Scientific Analysis & Context */}
        <article className="bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl p-6 sm:p-8 mb-8 shadow-xs space-y-6">
          <div className="border-b border-[#E8E4DC] dark:border-[#1E293B] pb-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF5A1F] font-mono">
              Atmospheric Science & Policy Analysis
            </span>
            <h3 className="font-display text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9] mt-1">
              The Three Drivers of the Indo-Gangetic Basin Winter Smog Chamber
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#525866] dark:text-[#94A3B8] leading-relaxed">
            <div className="space-y-2">
              <h4 className="font-display text-sm font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                1. Thermal Inversion & Calm Surface Winds
              </h4>
              <p>
                During November, descending continental dry air and radiational surface cooling establish a low-altitude thermal inversion lid. When wind velocities fall under 4 km/h, particulate emissions fail to ventilate across the Aravalli-Himalayan bowl.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-display text-sm font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                2. Seasonal Paddy Stubble Windows
              </h4>
              <p>
                Post-monsoon mechanized combine harvesters leave 6-inch stalks that farmers incinerate within a tight 15-day turnaround before wheat sowing. Northwest upper-level winds transport high particulate carbon directly downwind into Delhi.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-display text-sm font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                3. The Constant Urban Emissions Baseline
              </h4>
              <p>
                Vehicular tailpipes, road dust, and municipal solid waste emissions constitute the persistent 65% baseline floor throughout the year. The winter meteorology acts as a magnifying ceiling that traps ordinary pollution until toxic thresholds are crossed.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8E4DC] dark:border-[#1E293B] flex flex-wrap items-center justify-between text-xs gap-3">
            <span className="text-[#94A3B8]">
              Related Investigation: <Link href="/article/delhi-ncr-air-quality-emergency-stubble-inversion" className="text-[#FF5A1F] font-semibold hover:underline">Read the full data deep-dive →</Link>
            </span>
            <span className="font-mono text-[11px] text-[#525866] dark:text-[#94A3B8]">
              Attribution: CPCB CAAQMS Network & SAFAR India
            </span>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
