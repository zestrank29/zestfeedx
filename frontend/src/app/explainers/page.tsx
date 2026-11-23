import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Lightbulb, ArrowRight, BookOpen, Clock } from "lucide-react";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";
import { EXPLAINER_STORIES } from "@/data/demoContent";

export const metadata: Metadata = {
  title: "The Explainer Desk | Policy, Tech & Finance Primers",
  description:
    "Comprehensive explanatory journalism breaking down complex Indian laws, financial shifts, and scientific phenomena simply and authoritatively.",
  alternates: {
    canonical: "https://zestfeedx.com/explainers/",
  },
  openGraph: {
    title: "The Explainer Desk | Policy, Tech & Finance Primers",
    description:
      "Comprehensive explanatory journalism breaking down complex Indian laws, financial shifts, and scientific phenomena simply and authoritatively.",
    url: "https://zestfeedx.com/explainers/",
    siteName: "ZestFeedX",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "The Explainer Desk - ZestFeedX",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Explainer Desk | Policy, Tech & Finance Primers",
    description:
      "Comprehensive explanatory journalism breaking down complex Indian laws, financial shifts, and scientific phenomena simply and authoritatively.",
    images: ["https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"],
  },
};

export default function ExplainersIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "The Explainer Desk | ZestFeedX",
    description: "In-depth primers translating complicated Indian regulatory filings, constitutional rulings, and macroeconomic transitions.",
    url: "https://zestfeedx.com/explainers/",
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "ZestFeedX",
      url: "https://zestfeedx.com/",
      logo: {
        "@type": "ImageObject",
        url: "https://zestfeedx.com/favicon.ico",
      },
    },
    hasPart: EXPLAINER_STORIES.map((item) => ({
      "@type": "Article",
      headline: item.title,
      description: item.subtitle,
      url: `https://zestfeedx.com/article/${item.slug}/`,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] dark:bg-[#080C16] text-[#0B1020] dark:text-[#F1F5F9] transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Banner */}
        <div className="mb-8 border-b-2 border-[#0B1020] dark:border-[#F1F5F9] pb-6">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-[#FF5A1F]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF5A1F] font-mono">
              The Explainer Desk • Analytical Primers
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B1020] dark:text-[#F1F5F9]">
            Understanding the Shift
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#525866] dark:text-[#94A3B8] max-w-3xl leading-relaxed">
            In-depth primers translating complicated Indian regulatory filings, constitutional rulings, and macroeconomic transitions into structured, practical intelligence.
          </p>
        </div>

        {/* Explainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {EXPLAINER_STORIES.map((item) => (
            <article
              key={item.id}
              className="bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl p-6 flex flex-col justify-between hover:border-[#FF5A1F] transition-all hover:shadow-xs group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5A1F] bg-[#FF5A1F]/10 px-2 py-0.5 rounded font-mono">
                    {item.badge}
                  </span>
                  <span className="text-[11px] text-[#94A3B8] font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.read_time}
                  </span>
                </div>

                <Link href={`/article/${item.slug}/`} className="block">
                  <h2 className="font-display text-lg font-bold text-[#0B1020] dark:text-[#F1F5F9] leading-snug group-hover:text-[#FF5A1F] transition-colors mb-2">
                    {item.title}
                  </h2>
                </Link>

                <p className="text-xs text-[#525866] dark:text-[#94A3B8] leading-relaxed">
                  {item.subtitle}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F0ECE1] dark:border-[#1E293B] mt-6 flex items-center justify-between text-xs">
                <span className="text-[#94A3B8] text-[11px]">{item.date}</span>
                <Link
                  href={`/article/${item.slug}/`}
                  className="font-bold text-[#FF5A1F] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Read Primer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* AdSlot */}
        <AdSlot format="leaderboard" slotId="explainers-hub-bottom" />
      </main>

      <Footer />
    </div>
  );
}
