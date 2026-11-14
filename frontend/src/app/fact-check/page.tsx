import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, Database, FileText, Search } from "lucide-react";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fact-Checking Methodology & Protocols | ZestFeedX",
  description:
    "Explore the rigorous multi-tier fact-checking protocols, regulatory verification chains, and data auditing standards governing ZestFeedX.",
  alternates: {
    canonical: "https://zestfeedx.com/fact-check/",
  },
};

export default function FactCheckPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] dark:bg-[#080C16] text-[#0B1020] dark:text-[#F1F5F9] transition-colors">
      <header className="border-b border-[#E8E4DC] dark:border-[#1E293B] sticky top-0 z-30 bg-[#FAF8F4]/95 dark:bg-[#080C16]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-bold tracking-tight text-[#0B1020] dark:text-[#F1F5F9]">
            ZestFeed<span className="text-[#FF5A1F] italic font-serif">X</span>
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold text-[#525866] dark:text-[#94A3B8] hover:text-[#FF5A1F] flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Front Page
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b-2 border-[#0B1020] dark:border-[#F1F5F9] pb-4 mb-8">
            <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-widest block mb-1">
              Verification Standards
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
              Fact-Checking Policy
            </h1>
            <p className="mt-2 text-base text-[#525866] dark:text-[#94A3B8] max-w-2xl">
              How ZestFeedX verifies claims, audits datasets, and eliminates misinformation before publication.
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none text-[#525866] dark:text-[#94A3B8] leading-relaxed space-y-8">
            <section>
              <h2 className="font-display text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                The Three-Tier Verification Chain
              </h2>
              <p>
                In an era of viral social media rumors, algorithmic amplification, and synthetic media, ZestFeedX enforces a non-negotiable verification process prior to publishing any empirical assertion:
              </p>

              <div className="space-y-4 not-prose my-6">
                <div className="p-4 bg-white dark:bg-[#0F172A] border-l-4 border-[#FF5A1F] border-y border-r border-[#E8E4DC] dark:border-[#1E293B] rounded-r-lg">
                  <h3 className="font-display text-sm font-bold text-[#0B1020] dark:text-[#F1F5F9] flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#FF5A1F]" /> Tier 1: Primary Document Corroboration
                  </h3>
                  <p className="text-xs text-[#525866] dark:text-[#94A3B8] mt-1">
                    All policy claims must be grounded in primary administrative documentation—official Union gazettes, judicial rulings, Parliament answers, or direct regulatory circulars (RBI, SEBI, IRDAI).
                  </p>
                </div>

                <div className="p-4 bg-white dark:bg-[#0F172A] border-l-4 border-[#0E7C86] border-y border-r border-[#E8E4DC] dark:border-[#1E293B] rounded-r-lg">
                  <h3 className="font-display text-sm font-bold text-[#0B1020] dark:text-[#F1F5F9] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#0E7C86]" /> Tier 2: Multi-Source Independent Cross-Referencing
                  </h3>
                  <p className="text-xs text-[#525866] dark:text-[#94A3B8] mt-1">
                    When reporting from wire dispatches or field developments, our pipeline clusters coverage from at least 3 distinct institutional publishers to identify discrepancies before writing our original 40-word brief.
                  </p>
                </div>

                <div className="p-4 bg-white dark:bg-[#0F172A] border-l-4 border-emerald-600 border-y border-r border-[#E8E4DC] dark:border-[#1E293B] rounded-r-lg">
                  <h3 className="font-display text-sm font-bold text-[#0B1020] dark:text-[#F1F5F9] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" /> Tier 3: Senior Editorial Fact-Check Sign-off
                  </h3>
                  <p className="text-xs text-[#525866] dark:text-[#94A3B8] mt-1">
                    Every long-form investigation undergoes a secondary desk review by the Senior Digital Editor to audit quotes, context, dates, and quantitative claims.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                Zero Tolerance for Speculative Rumors
              </h2>
              <p>
                ZestFeedX does not cover unconfirmed social media chatter, anonymous WhatsApp forwards, or speculative entertainment rumors. If a story cannot be corroborated through official administrative channels, credible industry spokespersons, or scientific telemetry, it does not appear on our broadsheet.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
