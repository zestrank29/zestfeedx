import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, CheckCircle2, Search, Cpu } from "lucide-react";

export const metadata = {
  title: "Fact-Checking Methodology | ZestFeedX",
  description: "Learn how ZestFeedX verifies breaking stories with Grok AI, primary wire triangulation, and editorial oversight.",
};

export default function FactCheckPage() {
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
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
            Factual Rigour & Grok AI Protocols
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-white">
            Fact-Checking & Grok Verification Protocol
          </h1>
        </div>

        <div className="prose max-w-none text-slate-300 leading-relaxed space-y-6">
          <div className="p-5 bg-emerald-950/40 border border-emerald-800/80 rounded-lg flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
            <div>
              <h3 className="font-serif font-bold text-base text-emerald-300 mb-1">
                Commitment to Zero Factual Inaccuracies
              </h3>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Every long-form article published on ZestFeedX is cross-checked against certified wire feeds, government releases, and live web intelligence powered by Grok AI fact-checking protocols before publication.
              </p>
            </div>
          </div>

          <h2 className="font-serif text-xl font-bold text-white border-b border-slate-800 pb-2 pt-4">
            Our 3-Tier Verification Pipeline
          </h2>
          <div className="space-y-4">
            <div className="p-5 bg-[#0f172a] border border-slate-800 rounded-lg">
              <h4 className="font-bold text-white text-base mb-1">1. Primary Source Wire Triangulation</h4>
              <p className="text-sm text-slate-400">
                We require minimum 2 independent reputable wire reports (such as PTI, ANI, Reuters, or PIB communiqués) confirming the foundational facts.
              </p>
            </div>

            <div className="p-5 bg-[#0f172a] border border-slate-800 rounded-lg">
              <h4 className="font-bold text-white text-base mb-1">2. Grok AI Real-Time Cross-Examination</h4>
              <p className="text-sm text-slate-400">
                Using real-time web retrieval, Grok parses active claims to detect debunked rumors, outdated statistics, or altered quotes.
              </p>
            </div>

            <div className="p-5 bg-[#0f172a] border border-slate-800 rounded-lg">
              <h4 className="font-bold text-white text-base mb-1">3. Editorial Oversight & Correction Registry</h4>
              <p className="text-sm text-slate-400">
                Directed by <a href="https://zestfeedx.com/about" className="text-white hover:text-red-400 underline font-semibold">Pankhudi Sharma</a> (Veteran Journalist and Editor), our correction policy is transparent and accountable. Submit corrections to: <a href="mailto:news@zestfeedx.com" className="text-emerald-400 underline font-semibold">news@zestfeedx.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
