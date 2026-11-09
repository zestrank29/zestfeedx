import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Award, Shield, Newspaper, CheckCircle2, Mail, ExternalLink } from "lucide-react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us & Editorial Leadership | ZestFeedX",
  description: "Learn about ZestFeedX: fact-checked investigative journalism, long-form reporting, and newsroom editorial leadership by Pankhudi Sharma.",
  alternates: {
    canonical: "https://zestfeedx.com/about/",
  },
  openGraph: {
    title: "About Us & Editorial Leadership | ZestFeedX",
    description: "Learn about ZestFeedX: fact-checked investigative journalism, long-form reporting, and newsroom editorial leadership by Pankhudi Sharma.",
    url: "https://zestfeedx.com/about/",
    siteName: "ZestFeedX",
    images: [
      {
        url: "https://zestfeedx.com/google-news/wide-logo-light.png",
        width: 600,
        height: 60,
        alt: "ZestFeedX Editorial Newsroom",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us & Editorial Leadership | ZestFeedX",
    description: "Learn about ZestFeedX: fact-checked investigative journalism, long-form reporting, and newsroom editorial leadership by Pankhudi Sharma.",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans p-0 m-0">
      {/* Top Reading Navigation */}
      <div className="bg-[#0f172a] border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-xl sm:text-2xl font-black uppercase tracking-tight flex items-center gap-2 chromatic-text"
          >
            <span className="w-2.5 h-2.5 bg-gradient-to-tr from-cyan-400 to-rose-500 rounded-full shadow-[0_0_8px_#00f0ff] animate-pulse" />
            ZESTFEEDX
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" /> Back to 3D Newsroom
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Section Header */}
        <div className="border-b border-slate-800 pb-3 mb-8">
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-1">
            Institutional Profile & Newsroom Leadership
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-white">
            About ZestFeedX
          </h1>
        </div>

        {/* AUTHOR BIO SPLIT-COLUMN SECTION (Phase 4 Spec) */}
        <section aria-label="Author Profile" className="my-8 p-6 sm:p-8 bg-[#0f172a] border border-slate-800 rounded-xl shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
            {/* Left Column: Author Portrait with Glassmorphism & Neon Border */}
            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden p-1 bg-linear-to-tr from-red-600 via-rose-500 to-amber-500 shadow-[0_0_25px_rgba(239,68,68,0.35)] border border-slate-700/60 group">
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-900">
                  <Image
                    src="/images/pankhudi-sharma.jpg"
                    alt="Pankhudi Sharma - Veteran Journalist and Editor at ZestFeedX"
                    fill
                    priority
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Name in prominent H2 tag, official bio and credentials */}
            <div className="md:col-span-8 flex flex-col justify-center space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-red-950 text-red-400 border border-red-800/80 uppercase tracking-wider">
                  Editorial Lead & Author
                </span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                  15+ Years Investigative Experience
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl font-black text-white tracking-tight">
                Pankhudi Sharma
              </h2>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                Veteran media professional with over 15 years of experience in investigative journalism and digital storytelling, delivering high-impact news and trending global insights.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span>
                  Newsroom: <strong className="text-white font-semibold">ZestFeedX Editorial Desk</strong>
                </span>
                <span className="text-slate-700">•</span>
                <a
                  href="mailto:news@zestfeedx.com"
                  className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <Mail className="w-3.5 h-3.5" /> news@zestfeedx.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Mission & Standards */}
        <div className="prose max-w-none text-slate-300 leading-relaxed space-y-6 my-10">
          <p className="text-lg font-serif text-slate-200 leading-relaxed">
            <strong>ZestFeedX</strong> is an autonomous, high-curiosity digital news aggregation and analysis engine delivering real-time, fact-checked breaking news, global affairs, technology breakthroughs, and cultural trends in comprehensive, long-form English and Hinglish formats.
          </p>

          <h3 className="font-serif text-2xl font-bold text-white border-b border-slate-800 pb-2 pt-4">
            Our Journalistic Mission: Truth Before Speed
          </h3>
          <p>
            In an era inundated with unverified viral claims and clickbait sensationalism, ZestFeedX adheres to broadsheet rigor: every wire dispatch ingested through our hourly automated aggregation from Google News India and top RSS feeds undergoes multi-stage algorithmic validation and Grok AI fact-checking before publication.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div className="p-5 bg-[#0f172a] border border-slate-800 rounded-lg">
              <Shield className="w-6 h-6 text-red-500 mb-2" />
              <h4 className="font-serif font-bold text-base text-white mb-1">Factual Integrity</h4>
              <p className="text-xs text-slate-400">Cross-verified against primary press bureaus, official communiqués, and Grok AI intelligence.</p>
            </div>
            <div className="p-5 bg-[#0f172a] border border-slate-800 rounded-lg">
              <Award className="w-6 h-6 text-red-500 mb-2" />
              <h4 className="font-serif font-bold text-base text-white mb-1">Long-Form Journalism</h4>
              <p className="text-xs text-slate-400">Comprehensive, structured 800+ word reporting with deep context and source attribution.</p>
            </div>
            <div className="p-5 bg-[#0f172a] border border-slate-800 rounded-lg">
              <Newspaper className="w-6 h-6 text-red-500 mb-2" />
              <h4 className="font-serif font-bold text-base text-white mb-1">Zero-Error Architecture</h4>
              <p className="text-xs text-slate-400">Engineered with 2026 Schema JSON-LD, automated XML sitemaps, and llms.txt compliance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
