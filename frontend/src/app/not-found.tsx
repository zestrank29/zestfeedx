import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, FileQuestion, Sparkles } from "lucide-react";

export const metadata = {
  title: "404 - Page Not Found | ZestFeedX",
  description: "The requested news dispatch or investigative report could not be found in our digital archives. Return to the ZestFeedX newsroom.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 font-sans p-0 m-0 flex flex-col justify-between">
      {/* Top Header */}
      <div className="bg-[#0b1224]/90 backdrop-blur-md border-b border-cyan-500/20 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2 chromatic-text"
          >
            <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f0ff] animate-pulse" />
            ZESTFEEDX
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" /> Back to Newsroom
          </Link>
        </div>
      </div>

      {/* Main 404 Body */}
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex p-4 rounded-full bg-red-950/40 border border-red-500/30 mb-6 text-red-400">
          <FileQuestion className="w-12 h-12" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-red-500 block mb-2">
          HTTP 404 Error
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Story Or Dispatch Not Found
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
          The news dispatch, historical report, or category beat you requested could not be located in our current live newsroom archives. It may have been updated, rescheduled, or relocated under a revised editorial headline.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg bg-[#d32f2f] hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-all"
          >
            <Home className="w-4 h-4" /> Go to Front Page
          </Link>
          <Link
            href="/category/politics/"
            className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition-colors"
          >
            National Politics Wire
          </Link>
          <Link
            href="/category/tech/"
            className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition-colors"
          >
            Frontier Tech Wire
          </Link>
          <Link
            href="/category/health/"
            className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition-colors"
          >
            Health &amp; Medicine
          </Link>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 max-w-lg mx-auto flex items-center gap-2 justify-center">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Real-time breaking news dispatches are published around the clock by our editorial desk.</span>
        </div>
      </main>

      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        &copy; 2026 ZestFeedX. All Rights Reserved.
      </div>
    </div>
  );
}
