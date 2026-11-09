"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Mail, MapPin } from "lucide-react";
import GoogleNewsFollowBadge from "./GoogleNewsFollowBadge";

const ALL_CATEGORIES = [
  { id: "politics", label: "National & Politics" },
  { id: "tech", label: "AI & Technology" },
  { id: "health", label: "Health & Medicine" },
  { id: "world", label: "World Affairs" },
  { id: "sports", label: "Sports & Athletics" },
  { id: "entertainment", label: "Movies & Entertainment" },
  { id: "ramayana", label: "Ramayana & Cultural Heritage" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-[#070b14] pt-10 pb-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto">
        {/* Top Footer Masthead & Verification */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
          <div>
            <Link
              href="/"
              className="font-serif text-2xl font-black uppercase tracking-tight flex items-center gap-2 chromatic-text"
            >
              <span className="w-2.5 h-2.5 bg-gradient-to-tr from-cyan-400 to-rose-500 rounded-full shadow-[0_0_8px_#00f0ff] animate-pulse" />
              ZESTFEEDX
            </Link>
            <p className="text-xs text-slate-400 font-serif mt-1">
              Automated Long-Form News & Investigative Analysis • Lead Editor: Pankhudi Sharma
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/80">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Grok AI Fact-Check Verified Desk
            </span>
            <span className="text-slate-700">|</span>
            <a
              href="mailto:news@zestfeedx.com"
              className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              news@zestfeedx.com
            </a>
            <span className="text-slate-700">|</span>
            <a href="/sitemap.xml" className="hover:text-red-400 transition-colors">
              XML Sitemap
            </a>
            <span className="text-slate-700">|</span>
            <a href="/news-sitemap.xml" className="hover:text-red-400 transition-colors">
              Google News Sitemap
            </a>
            <span className="text-slate-700">|</span>
            <a href="/rss.xml" className="hover:text-red-400 transition-colors">
              RSS Feed
            </a>
            <span className="text-slate-700">|</span>
            <a href="/robots.txt" className="hover:text-red-400 transition-colors">
              Robots.txt
            </a>
            <span className="text-slate-700">|</span>
            <a href="/llms.txt" className="hover:text-emerald-400 text-slate-300 transition-colors">
              llms.txt
            </a>
          </div>

          <div className="mt-3 md:mt-0">
            <GoogleNewsFollowBadge variant="banner" />
          </div>
        </div>

        {/* Multi-Column Footer Directory */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10">
          {/* Column 1: Core Priority Sections */}
          <div>
            <h4 className="font-serif font-black text-sm uppercase tracking-wider text-white border-b border-slate-800 pb-1.5 mb-3">
              National & Tech
            </h4>
            <ul className="space-y-2 text-xs">
              {ALL_CATEGORIES.slice(0, 3).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/category/${c.id}`}
                    className="text-slate-400 hover:text-red-400 transition-colors text-left font-medium block"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: World & Athletics */}
          <div>
            <h4 className="font-serif font-black text-sm uppercase tracking-wider text-white border-b border-slate-800 pb-1.5 mb-3">
              Global & Sports
            </h4>
            <ul className="space-y-2 text-xs">
              {ALL_CATEGORIES.slice(3, 5).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/category/${c.id}`}
                    className="text-slate-400 hover:text-red-400 transition-colors text-left font-medium block"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Culture & Entertainment */}
          <div>
            <h4 className="font-serif font-black text-sm uppercase tracking-wider text-white border-b border-slate-800 pb-1.5 mb-3">
              Culture & Media
            </h4>
            <ul className="space-y-2 text-xs">
              {ALL_CATEGORIES.slice(5, 7).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/category/${c.id}`}
                    className="text-slate-400 hover:text-red-400 transition-colors text-left font-medium block"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Institutional & Editorial */}
          <div>
            <h4 className="font-serif font-black text-sm uppercase tracking-wider text-white border-b border-slate-800 pb-1.5 mb-3">
              Editorial & Transparency
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-red-400 transition-colors">
                  About Us & Author Persona
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="text-slate-400 hover:text-red-400 transition-colors font-semibold">
                  Editorial Policy & Ethics
                </Link>
              </li>
              <li>
                <Link href="/fact-check" className="text-slate-400 hover:text-emerald-400 transition-colors font-semibold">
                  Fact-Checking Methodology
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-red-400 transition-colors">
                  Contact Newsroom Bureaus
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Legal & Disclaimers */}
          <div>
            <h4 className="font-serif font-black text-sm uppercase tracking-wider text-white border-b border-slate-800 pb-1.5 mb-3">
              Legal & Compliance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/copyright-disclaimer" className="text-slate-400 hover:text-red-400 transition-colors font-semibold">
                  DMCA & Copyright Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-slate-400 hover:text-red-400 transition-colors">
                  Privacy Policy (DPDP Act)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-red-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="https://zestrank.com/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Network: ZestRank
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Attribution Notice & Exact Copyright Format */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="text-[11px] text-slate-500 space-y-1">
            <p>
              Headlines aggregated under Section 52(1)(a)(iii) of the Indian Copyright Act, 1957. All journalistic dispatches edited under the direction of Pankhudi Sharma. Inquiries: <a href="mailto:news@zestfeedx.com" className="text-slate-400 hover:underline">news@zestfeedx.com</a>
            </p>
          </div>

          {/* Exact Required Footer Attribution HTML */}
          <div className="shrink-0 text-xs text-slate-300">
            <p>&copy; 2026 ZestFeedX. Website created by <a href="https://zestrank.com/" target="_blank" rel="noopener" className="text-white hover:text-emerald-400 underline font-semibold transition-colors">ZestRank</a>.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

