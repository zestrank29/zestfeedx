import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, CheckCircle2, ChevronRight, Mail, AlertTriangle, FileText, Clock } from "lucide-react";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    absolute: "Corrections & Public Policy | ZestFeedX",
  },
  description:
    "ZestFeedX is committed to accuracy. Read our formal corrections procedure, public clarifications log, and how to submit factual corrections.",
  alternates: {
    canonical: "https://zestfeedx.com/corrections/",
  },
  openGraph: {
    title: {
    absolute: "Corrections & Public Policy | ZestFeedX",
  },
    description:
      "ZestFeedX is committed to uncompromising accuracy. Read our formal corrections procedure and public clarifications log.",
    url: "https://zestfeedx.com/corrections/",
    siteName: "ZestFeedX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: {
    absolute: "Corrections & Public Policy | ZestFeedX",
  },
    description:
      "ZestFeedX is committed to uncompromising accuracy. Read our formal corrections procedure and public clarifications log.",
  },
};

export default function CorrectionsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Corrections & Public Clarifications Policy",
    url: "https://zestfeedx.com/corrections/",
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "ZestFeedX",
      url: "https://zestfeedx.com/",
      correctionsPolicy: "https://zestfeedx.com/corrections/",
    },
  };

  const correctionLogs = [
    {
      date: "14 November 2026",
      articleTitle: "RBI Digital Rupee (e₹) Wholesale Pilot Crosses Milestone",
      correction: "An earlier version of this report referenced settlement figures in USD equivalents without specifying the benchmark RBI reference rate. The paragraph has been amended with the exact MCX / RBI spot reference.",
      status: "Corrected & Appended",
    },
    {
      date: "08 November 2026",
      articleTitle: "India High-Speed Rail Corridor Project Timeline Update",
      correction: "Clarified the jurisdictional split between the Gujarat section and Maharashtra section regarding elevated viaduct completion percentages.",
      status: "Clarified in Article Body",
    },
    {
      date: "01 November 2026",
      articleTitle: "National Semiconductor Mission Phase 2 Subsidy Dispatches",
      correction: "Corrected typographical error in the corporate name of a joint-venture consortium partner in Dholera.",
      status: "Corrected",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-[#FDFBF7] dark:bg-[#080C16] text-[#0B1020] dark:text-[#F1F5F9] pb-24">
        {/* Breadcrumb Navigation */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link href="/editorial-policy/" className="hover:text-red-600 transition-colors">
              Editorial Policy
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">Corrections & Clarifications</span>
          </nav>
        </div>

        {/* Hero Header */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-10">
          <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300 mb-4">
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
              Editorial Integrity & Transparency
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight mb-4 text-slate-950 dark:text-white">
              Corrections, Clarifications & Retraction Policy
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 font-serif">
              At ZestFeedX, accuracy is the bedrock of our journalism. When errors occur, our mandate is to correct them promptly, transparently, and unreservedly.
            </p>
          </div>
        </div>

        {/* Policy Details */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <section className="p-6 sm:p-8 rounded-xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-red-600" />
              Our Four Standards of Correction
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700 dark:text-slate-300 mt-4">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#0e172a] border border-slate-200 dark:border-slate-800/60">
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">1. Factual Corrections</h3>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Substantive factual errors in names, dates, quotes, statistics, or legal proceedings are amended directly in the article body with a prominent italicized footnote at the foot of the dispatch.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#0e172a] border border-slate-200 dark:border-slate-800/60">
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">2. Contextual Clarifications</h3>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  If reporting is factually accurate but lacks necessary context or nuances, we append an editorial clarification explaining the additional context.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#0e172a] border border-slate-200 dark:border-slate-800/60">
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">3. Formal Retractions</h3>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  If an entire premise or dispatch fails verification, the article is formally retracted with a public editor&apos;s notice detailing why the story was withdrawn.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#0e172a] border border-slate-200 dark:border-slate-800/60">
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">4. No Silent Edits</h3>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  We never alter material facts secretly. Every post-publication correction is explicitly recorded on the page and in our public corrections archive.
                </p>
              </div>
            </div>
          </section>

          {/* Submission Form / Contact */}
          <section className="p-6 sm:p-8 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50">
            <h2 className="text-lg font-serif font-bold text-red-950 dark:text-red-200 mb-2 flex items-center gap-2">
              <Mail className="w-5 h-5 text-red-600" />
              How to Request a Correction
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              If you identify an error in any ZestFeedX dispatch, please write directly to our Editorial Standards desk with the URL, the specific passage in question, and supporting documentation or primary source references.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="mailto:news@zestfeedx.com?subject=Editorial%20Correction%20Request"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Submit Correction: news@zestfeedx.com</span>
              </a>
              <Link
                href="/contact/"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-white dark:hover:bg-slate-800 transition-colors"
              >
                <span>Editorial Contact Desk &rarr;</span>
              </Link>
            </div>
          </section>

          {/* Public Correction Log */}
          <section className="p-6 sm:p-8 rounded-xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-600" />
              Public Corrections & Clarifications Log
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              A chronological archive of recent editorial corrections and record adjustments across all news desks.
            </p>

            <div className="space-y-4">
              {correctionLogs.map((log, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-slate-50 dark:bg-[#0e172a] border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-xs font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {log.date}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300">
                      {log.status}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white mb-1">
                    {log.articleTitle}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {log.correction}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
