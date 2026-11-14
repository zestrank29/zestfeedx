import React from "react";
import Link from "next/link";
import { ArrowLeft, Scale, FileText, AlertTriangle, ShieldCheck } from "lucide-react";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service & Advertiser Guidelines | ZestFeedX",
  description:
    "Review ZestFeedX terms of use, content syndication policies, intellectual property rights, and commercial advertiser guidelines.",
  alternates: {
    canonical: "https://zestfeedx.com/terms/",
  },
};

export default function TermsPage() {
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
              Legal Framework & Commercial Rules
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
              Terms of Service
            </h1>
            <p className="mt-2 text-base text-[#525866] dark:text-[#94A3B8] max-w-2xl">
              Terms governing digital broadsheet access, content copyright, and commercial advertiser marketplace obligations.
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none text-[#525866] dark:text-[#94A3B8] leading-relaxed space-y-8">
            <section>
              <h2 className="font-display text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing, reading, subscribing to, or submitting commercial content to ZestFeedX (&ldquo;the Website&rdquo;), you agree to be bound by these Terms of Service and all applicable laws and regulations of the Republic of India.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                2. Intellectual Property Rights
              </h2>
              <p>
                All original articles, investigative reports, analytical graphics, software code, and editorial commentary appearing on ZestFeedX are the exclusive intellectual property of ZestFeedX and protected under the Indian Copyright Act, 1957.
              </p>
              <ul>
                <li><strong>Permitted Sharing:</strong> You are encouraged to quote short excerpts (up to 75 words) with prominent textual attribution and a direct clickable hyperlink to the original article on ZestFeedX.</li>
                <li><strong>Prohibited Scraping:</strong> Automated scraping, unauthorized republishing of entire articles, or feeding our original reporting into unauthorized commercial LLMs without written consent is strictly prohibited.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                3. Advertiser & Sponsored Post Terms
              </h2>
              <p>
                All advertisers purchasing guest posts, press releases, or sponsorships via our Marketplace agree to:
              </p>
              <ul>
                <li><strong>Quality Standards:</strong> Submissions must exceed 600 words, provide substantive factual analysis, and pass our plagiarism and Google Safe Browsing audits.</li>
                <li><strong>Link Attribute Mandate:</strong> All commercial backlinks will automatically carry <code>rel=&quot;sponsored nofollow&quot;</code> in strict accordance with Google search engine quality guidelines.</li>
                <li><strong>Banned Industries:</strong> We strictly reject copy involving online gambling, betting apps, unlicensed pharmaceuticals, predatory micro-loans, adult entertainment, or counterfeit products.</li>
                <li><strong>Taxation:</strong> All domestic bookings are subject to 18% Goods and Services Tax (GST) with formal GST-compliant B2B tax invoices provided upon transaction clearance.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                4. Governing Law & Jurisdiction
              </h2>
              <p>
                These Terms of Service are governed by and construed in accordance with the laws of India. Any legal dispute or proceeding arising out of or related to ZestFeedX shall be subject to the exclusive jurisdiction of the competent courts of New Delhi, India.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
