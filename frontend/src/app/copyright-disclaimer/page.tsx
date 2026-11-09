import React from "react";
import Link from "next/link";
import { ArrowLeft, Copyright, ShieldAlert, FileText } from "lucide-react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA & Copyright Policy | ZestFeedX",
  description: "Learn about copyright policies, image credits, and Fair Use principles under Section 52(1)(a)(iii) governing ZestFeedX dispatches.",
  alternates: {
    canonical: "https://zestfeedx.com/copyright-disclaimer/",
  },
  openGraph: {
    title: "DMCA & Copyright Policy | ZestFeedX",
    description: "Learn about copyright policies, image credits, and Fair Use principles under Section 52(1)(a)(iii) governing ZestFeedX dispatches.",
    url: "https://zestfeedx.com/copyright-disclaimer/",
    siteName: "ZestFeedX",
    images: [
      {
        url: "https://zestfeedx.com/google-news/wide-logo-light.png",
        width: 600,
        height: 60,
        alt: "ZestFeedX Copyright Policies",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DMCA & Copyright Policy | ZestFeedX",
    description: "Learn about copyright policies, image credits, and Fair Use principles under Section 52(1)(a)(iii) governing ZestFeedX dispatches.",
  },
};

export default function CopyrightDisclaimerPage() {
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
            Legal Compliance & Statutory Fair Use
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-white">
            Copyright Notice & Fair Use Policy
          </h1>
        </div>

        <div className="prose max-w-none text-slate-300 leading-relaxed space-y-6">
          <p className="text-lg font-serif text-slate-200">
            This digital publication operates in strict compliance with the Copyright Act, 1957 (India) and the Digital Millennium Copyright Act (DMCA).
          </p>

          <h2 className="font-serif text-xl font-bold text-white border-b border-slate-800 pb-2 pt-4">
            1. Section 52(1)(a)(iii) Fair Dealing Protection
          </h2>
          <p>
            Under Section 52(1)(a)(iii) of the Indian Copyright Act, 1957, the reporting of current events and current affairs through automated aggregation or digital editorial analysis does not constitute copyright infringement.
          </p>

          <h2 className="font-serif text-xl font-bold text-white border-b border-slate-800 pb-2 pt-4">
            2. Photographic & Media Attribution
          </h2>
          <p>
            Photographs and graphics featured on ZestFeedX are acquired under Creative Commons (CC-BY, CC0), official government press releases (PIB), or corporate media kits. Explicit image courtesy attribution is permanently displayed beneath every asset.
          </p>

          <h2 className="font-serif text-xl font-bold text-white border-b border-slate-800 pb-2 pt-4">
            3. Notice & Takedown Procedure
          </h2>
          <p>
            If you are a copyright holder and believe your work is displayed without adequate authorization, contact our compliance desk at <a href="mailto:news@zestfeedx.com" className="text-red-400 underline font-semibold">news@zestfeedx.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
