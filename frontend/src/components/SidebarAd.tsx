"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Newspaper, TrendingUp, Sparkles, UserCheck, ExternalLink, Zap } from "lucide-react";
import GoogleNewsFollowBadge from "./GoogleNewsFollowBadge";

export default function SidebarAd() {
  return (
    <div className="sticky top-20 bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-2xl text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Label */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Newspaper className="w-3.5 h-3.5 text-[#d32f2f]" />
          Editorial Desk
        </span>
        <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800/80 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          Verified Wire
        </span>
      </div>

      {/* Recommended Hosting Partner: Hostinger Referral Card */}
      <div className="p-4 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-[#121028] dark:via-[#1a1438] dark:to-[#0f172a] border border-violet-200 dark:border-violet-500/40 rounded-xl mb-5 shadow-sm dark:shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 bg-violet-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-bl shadow">
          Up to 75% OFF
        </div>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center font-black text-white text-sm shadow-md">
            <Zap className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs leading-tight">
              Hostinger Cloud Hosting
            </h4>
            <span className="text-[10px] text-violet-700 dark:text-violet-300 font-medium">
              Recommended Hosting Partner
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
          High-performance LiteSpeed cloud servers, NVMe storage, and 99.9% uptime for newsrooms &amp; high-traffic websites.
        </p>

        <div className="bg-white/80 dark:bg-[#0b0a1a]/80 p-2.5 rounded-lg border border-violet-200 dark:border-violet-900/50 mb-3 space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
          <div className="flex items-center justify-between text-violet-800 dark:text-violet-200 font-semibold">
            <span>Special Reader Discount</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">75% OFF</span>
          </div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>Free Domain &amp; SSL</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">Included</span>
          </div>
        </div>

        <a
          href="https://www.hostinger.com/in?REFERRALCODE=1ROHIT89"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block w-full py-2.5 px-3 bg-violet-600 hover:bg-violet-700 text-white text-center font-bold text-xs rounded transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Claim Hostinger Deal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Google Preferred News Source Card */}
      <GoogleNewsFollowBadge variant="card" className="mb-4" />

      {/* Featured Editorial Dispatch */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-900/90 border-l-4 border-l-[#d32f2f] rounded-r mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#d32f2f] block mb-1">
          Investigative Desk Notice
        </span>
        <p className="font-serif text-sm font-bold text-slate-900 dark:text-white leading-snug">
          Long-Form Broadsheet Journalism &amp; Multi-Agency Verification
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
          Google News India and ANI News wires synchronized hourly. Claims corroborated against official bulletins, press archives, and Grok AI intelligence desks.
        </p>
      </div>

      {/* Author & Editorial Lead Attribution Box */}
      <div className="p-3.5 bg-slate-50 dark:bg-[#0a0f1d] border border-slate-200 dark:border-slate-800 rounded mb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <Link href="/about" className="text-xs font-bold text-slate-900 dark:text-white hover:text-[#d32f2f] underline transition-colors">
            Editorial Lead: Pankhudi Sharma
          </Link>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
          Veteran media professional with over 15 years of experience in investigative journalism and digital storytelling at <strong className="text-slate-900 dark:text-slate-200">ZestFeedX</strong>.
        </p>
        <Link
          href="/about"
          className="inline-block mt-2 text-[11px] font-bold text-[#d32f2f] dark:text-emerald-400 hover:underline"
        >
          View Author Profile →
        </Link>
      </div>

      <div className="space-y-3 pt-2 text-xs text-slate-300">
        <div className="flex items-start gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
          <p>
            <strong>Zero Misinformation Policy:</strong> We uphold Section 52(1)(a)(iii) of the Indian Copyright Act, ensuring strict fair-use attribution.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Dual-Language AI:</strong> Comprehensive long-form English and engaging Hinglish reporting with one click.
          </p>
        </div>
      </div>
    </div>
  );
}
