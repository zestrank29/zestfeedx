import React from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Eye, Shield } from "lucide-react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy & Data Protection | ZestFeedX",
  description: "Review our transparent Privacy Policy, DPDP Act compliance, cookie usage, and reader data safeguards governing ZestFeedX.",
  alternates: {
    canonical: "https://zestfeedx.com/privacy-policy/",
  },
  openGraph: {
    title: "Privacy Policy & Data Protection | ZestFeedX",
    description: "Review our transparent Privacy Policy, DPDP Act compliance, cookie usage, and reader data safeguards governing ZestFeedX.",
    url: "https://zestfeedx.com/privacy-policy/",
    siteName: "ZestFeedX",
    images: [
      {
        url: "https://zestfeedx.com/google-news/wide-logo-light.png",
        width: 600,
        height: 60,
        alt: "ZestFeedX Privacy Policy",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy & Data Protection | ZestFeedX",
    description: "Review our transparent Privacy Policy, DPDP Act compliance, cookie usage, and reader data safeguards governing ZestFeedX.",
  },
};

export default function PrivacyPolicyPage() {
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
            Data Protection & Privacy Rigour
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-white">
            Privacy Policy (DPDP Act Compliant)
          </h1>
        </div>

        <div className="prose max-w-none text-slate-300 leading-relaxed space-y-6">
          <p className="text-lg font-serif text-slate-200">
            ZestFeedX respects your privacy. We are committed to adhering to the Digital Personal Data Protection Act, 2023 (DPDP Act) and global privacy standards.
          </p>

          <h2 className="font-serif text-xl font-bold text-white border-b border-slate-800 pb-2 pt-4">
            1. Information We Do Not Collect
          </h2>
          <p>
            We do not require user accounts to browse news. We do not sell personal data or track users across external third-party sites.
          </p>

          <h2 className="font-serif text-xl font-bold text-white border-b border-slate-800 pb-2 pt-4">
            2. On-Device Speech Processing
          </h2>
          <p>
            Our interactive Indian Audio Reader utilizes your client device's native Web Speech API. Audio synthesis occurs locally on your browser or device silicon without transmitting audio streams to external servers.
          </p>

          <h2 className="font-serif text-xl font-bold text-white border-b border-slate-800 pb-2 pt-4">
            3. Inquiries
          </h2>
          <p>
            For privacy inquiries, contact our Data Protection Officer at: <a href="mailto:news@zestfeedx.com" className="text-emerald-400 underline font-semibold">news@zestfeedx.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
