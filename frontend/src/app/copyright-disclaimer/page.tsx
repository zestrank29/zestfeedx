import React from "react";
import Link from "next/link";
import { ArrowLeft, Copyright, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Copyright Disclaimer & Fair Dealing Notice | ZestFeedX",
  description:
    "Review ZestFeedX copyright ownership, fair dealing standards under the Indian Copyright Act 1957, and DMCA/copyright notice takedown procedures.",
  alternates: {
    canonical: "https://zestfeedx.com/copyright-disclaimer/",
  },
};

export default function CopyrightDisclaimerPage() {
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
              Intellectual Property Notice
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
              Copyright & Fair Dealing
            </h1>
            <p className="mt-2 text-base text-[#525866] dark:text-[#94A3B8] max-w-2xl">
              Clarification of original authorial assets, external news wire curation, and copyright notice procedures.
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none text-[#525866] dark:text-[#94A3B8] leading-relaxed space-y-8">
            <section>
              <h2 className="font-display text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                1. Original Editorial Reporting
              </h2>
              <p>
                All investigative pieces, long-form articles, data analyses, and explainer primers designated under an author byline on ZestFeedX are the copyrighted original work of ZestFeedX. All rights are reserved. Reproduction in whole or substantial part without prior written permission is prohibited under Section 51 of the <strong>Indian Copyright Act, 1957</strong>.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                2. Curated Wire Briefs & Fair Dealing
              </h2>
              <p>
                In our &ldquo;Top 5 Curated Dispatches&rdquo; and &ldquo;More from around the web&rdquo; rows, ZestFeedX indexes timely developments from external national and international news media. In accordance with Section 52(1)(a) of the Indian Copyright Act, 1957 (Fair Dealing for the purpose of reporting of current events):
              </p>
              <ul>
                <li>We <strong>never reproduce full-text articles</strong> from third-party publications.</li>
                <li>Curated cards display only a factual headline, our own short original analytical synthesis (strictly under 40 words), the name of the source publisher, and a direct outbound link to the publisher&rsquo;s canonical website.</li>
                <li>No third-party media images are rehosted on our servers for wire brief cards.</li>
              </ul>
            </section>

            <section className="p-6 bg-white dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl not-prose">
              <h3 className="font-display text-lg font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-2 flex items-center gap-2">
                <Copyright className="w-5 h-5 text-[#FF5A1F]" /> Notice and Takedown Procedure
              </h3>
              <p className="text-xs sm:text-sm text-[#525866] dark:text-[#94A3B8]">
                If you are a copyright holder or authorized representative and believe that any material on ZestFeedX infringes your intellectual property rights, please send an official notification to our legal desk:
              </p>
              <div className="mt-3 text-xs font-mono text-[#0B1020] dark:text-[#F1F5F9] space-y-1">
                <p><strong>Legal Desk:</strong> Intellectual Property Compliance Officer</p>
                <p><strong>Email:</strong> news@zestfeedx.com</p>
                <p><strong>Review SLA:</strong> All verified notices are reviewed and resolved within 24 to 48 business hours.</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
