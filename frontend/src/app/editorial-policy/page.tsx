import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldAlert, Award } from "lucide-react";

export const metadata = {
  title: "Editorial Policy & Code of Ethics | ZestFeedX",
  description: "Read the editorial guidelines, verification protocols, and journalistic standards governing ZestFeedX.",
};

export default function EditorialPolicyPage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans p-0 m-0">
      <div className="bg-[#0f172a] border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl sm:text-2xl font-black tracking-tight text-white uppercase flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-red-600 rounded-full" />
            ZESTFEEDX
          </Link>
          <Link href="/" className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="border-b border-slate-800 pb-3 mb-8">
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-1">
            Ethical Code & Reporting Principles
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-white">
            Editorial Policy & Standards
          </h1>
        </div>

        <div className="prose max-w-none text-slate-300 leading-relaxed space-y-6">
          <p className="text-lg font-serif text-slate-200">
            At <strong>ZestFeedX</strong>, journalistic integrity and factual precision govern every report. Founded under the editorial leadership of <a href="https://zestfeedx.com/about" className="text-white hover:text-red-400 underline font-semibold">Pankhudi Sharma</a> (Veteran Journalist and Editor), our news desk fuses computational rigor with broadsheet ethics.
          </p>

          <h2 className="font-serif text-xl font-bold text-white border-b border-slate-800 pb-2 pt-4">
            1. Automated Hourly Ingestion with Algorithmic Verification
          </h2>
          <p>
            News items ingested through our 60-minute scheduler (Google Trends, Google News India, and certified RSS feeds) undergo real-time cross-referencing against verified wire reports. No synthetic fiction or ungrounded claims are ever published.
          </p>

          <h2 className="font-serif text-xl font-bold text-white border-b border-slate-800 pb-2 pt-4">
            2. Long-Form Investigative Journalism (800+ Words)
          </h2>
          <p>
            Every dispatch produced under Pankhudi Sharma's editorial direction provides comprehensive analysis, breaking the story into detailed sections with takeaways and an explicit clickable link pointing back to the original primary source.
          </p>

          <h2 className="font-serif text-xl font-bold text-white border-b border-slate-800 pb-2 pt-4">
            3. Strict Fair Use Attribution
          </h2>
          <p>
            Under Section 52(1)(a)(iii) of the Indian Copyright Act, 1957, all headline citations and excerpts are presented strictly for informational commentary, educational reporting, and news aggregation. Full attribution to original source publishers is permanently maintained. For queries, contact: <a href="mailto:news@zestfeedx.com" className="text-red-400 underline">news@zestfeedx.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
