import React from "react";
import Link from "next/link";
import { ArrowLeft, Scale, ShieldCheck } from "lucide-react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service & User Agreement | ZestFeedX",
  description: "Terms and conditions, statutory compliance, and user agreement governing reader access and usage of ZestFeedX digital dispatches.",
  alternates: {
    canonical: "https://zestfeedx.com/terms/",
  },
  openGraph: {
    title: "Terms of Service & User Agreement | ZestFeedX",
    description: "Terms and conditions, statutory compliance, and user agreement governing reader access and usage of ZestFeedX digital dispatches.",
    url: "https://zestfeedx.com/terms/",
    siteName: "ZestFeedX",
    images: [
      {
        url: "https://zestfeedx.com/google-news/wide-logo-light.png",
        width: 600,
        height: 60,
        alt: "ZestFeedX Terms of Service",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service & User Agreement | ZestFeedX",
    description: "Terms and conditions, statutory compliance, and user agreement governing reader access and usage of ZestFeedX digital dispatches.",
  },
};

export default function TermsPage() {
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
            Terms of Agreement & Digital Usage
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-white">
            Terms of Service
          </h1>
        </div>

        <div className="prose max-w-none text-slate-300 leading-relaxed space-y-6">
          <p className="text-lg font-serif text-slate-200">
            Welcome to <strong>ZestFeedX</strong>. By accessing or using our website, APIs, or content feeds, you agree to comply with and be bound by these Terms of Service.
          </p>

          <h2 className="font-serif text-xl font-bold text-white border-b border-slate-800 pb-2 pt-4">
            1. Informational & Educational Use
          </h2>
          <p>
            ZestFeedX provides aggregated news summaries, long-form investigative analyses, and multimodal reports for general informational purposes.
          </p>

          <h2 className="font-serif text-xl font-bold text-white border-b border-slate-800 pb-2 pt-4">
            2. Intellectual Property & Fair Use
          </h2>
          <p>
            Headline summaries and fair-use excerpts are cited under Section 52(1)(a)(iii) of the Indian Copyright Act, 1957. Original long-form journalistic commentary and architectural assets are copyright © 2026 ZestFeedX Digital Media.
          </p>

          <h2 className="font-serif text-xl font-bold text-white border-b border-slate-800 pb-2 pt-4">
            3. Contact & Notices
          </h2>
          <p>
            For legal notices, email: <a href="mailto:news@zestfeedx.com" className="text-emerald-400 underline font-semibold">news@zestfeedx.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
