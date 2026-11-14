import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Shield, Award, Users, CheckCircle2, Building, Mail, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";
import { DEMO_AUTHORS } from "@/data/demoContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us, Newsroom Leadership & Ownership | ZestFeedX",
  description:
    "Learn about ZestFeedX: independent broadsheet journalism, economic intelligence, and newsroom editorial leadership by Pankhudi Sharma and Rohan Sen.",
  alternates: {
    canonical: "https://zestfeedx.com/about/",
  },
};

export default function AboutPage() {
  const pankhudi = DEMO_AUTHORS.pankhudi;
  const rohan = DEMO_AUTHORS.rohan;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] dark:bg-[#080C16] text-[#0B1020] dark:text-[#F1F5F9] transition-colors">
      {/* Navigation Header */}
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

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="border-b-2 border-[#0B1020] dark:border-[#F1F5F9] pb-4 mb-8">
            <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-widest block mb-1">
              Institutional Profile & Governance
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
              About ZestFeedX
            </h1>
            <p className="mt-2 text-base text-[#525866] dark:text-[#94A3B8] max-w-2xl">
              Broadsheet journalism of record for India and the global Indian diaspora. Uncluttered, analytical, original-first.
            </p>
          </div>

          {/* Mission */}
          <div className="prose prose-slate dark:prose-invert max-w-none text-[#525866] dark:text-[#94A3B8] leading-relaxed space-y-6">
            <h2 className="font-display text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
              Our Editorial Charter
            </h2>
            <p>
              Founded in New Delhi, <strong>ZestFeedX</strong> was created to restore rigor and dignity to Indian digital journalism. In an internet ecosystem overwhelmed by clickbait headlines, aggregated sensationalism, and opaque financial incentives, ZestFeedX operates on a broadsheet ethos: deep domain expertise, original investigative reporting, verified primary source documentation, and uncompromising transparent governance.
            </p>
            <p>
              We cover macroeconomic policy, capital markets, semiconductor industrialization, environmental science, and foreign bilateral relations—focusing on matters that determine India&rsquo;s economic trajectory and the welfare of 32 million overseas Indians.
            </p>

            {/* Core Newsroom Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 not-prose">
              <div className="p-5 bg-white dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-lg">
                <Shield className="w-6 h-6 text-[#FF5A1F] mb-3" />
                <h3 className="font-display text-base font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-1">
                  100% Original Reporting
                </h3>
                <p className="text-xs text-[#525866] dark:text-[#94A3B8]">
                  Every indexable article is researched, synthesized, and published under the byline of a real, named journalist with verifiable credentials.
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-[#0E7C86] mb-3" />
                <h3 className="font-display text-base font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-1">
                  Primary Source Fact-Checking
                </h3>
                <p className="text-xs text-[#525866] dark:text-[#94A3B8]">
                  Every key claim is grounded in official government gazettes, regulatory disclosures (RBI, SEBI), and real-time environmental telemetry (CPCB, CAAQMS).
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-lg">
                <Sparkles className="w-6 h-6 text-amber-500 mb-3" />
                <h3 className="font-display text-base font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-1">
                  AI-Assisted, Human-Governed
                </h3>
                <p className="text-xs text-[#525866] dark:text-[#94A3B8]">
                  Computational algorithms aid in clustering and deduplication, but no content is ever published without human editorial review and sign-off.
                </p>
              </div>
            </div>

            {/* Editorial Leadership */}
            <h2 className="font-display text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9] pt-4">
              Newsroom Leadership & Bylines
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 not-prose">
              {/* Pankhudi */}
              <div className="p-6 bg-white dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl flex gap-5">
                <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 border border-[#DDD7CD] dark:border-[#334155]">
                  <Image
                    src={pankhudi.avatar}
                    alt={pankhudi.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                    {pankhudi.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#FF5A1F]">{pankhudi.role}</p>
                  <p className="text-xs text-[#525866] dark:text-[#94A3B8] mt-2 line-clamp-3">
                    {pankhudi.bio}
                  </p>
                  <p className="text-[10px] text-[#94A3B8] font-mono mt-2">{pankhudi.email}</p>
                </div>
              </div>

              {/* Rohan */}
              <div className="p-6 bg-white dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl flex gap-5">
                <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 border border-[#DDD7CD] dark:border-[#334155]">
                  <Image
                    src={rohan.avatar}
                    alt={rohan.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                    {rohan.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#0E7C86]">{rohan.role}</p>
                  <p className="text-xs text-[#525866] dark:text-[#94A3B8] mt-2 line-clamp-3">
                    {rohan.bio}
                  </p>
                  <p className="text-[10px] text-[#94A3B8] font-mono mt-2">{rohan.email}</p>
                </div>
              </div>
            </div>

            {/* Ownership & Funding Transparency */}
            <h2 className="font-display text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9] pt-4">
              Ownership & Funding Transparency
            </h2>
            <p>
              In full accordance with international trust standards and Google Publisher policies, ZestFeedX maintains complete transparency regarding its ownership and financial sustenance:
            </p>
            <ul>
              <li><strong>Corporate Structure:</strong> ZestFeedX operates as an independent, privately held digital media enterprise incorporated in New Delhi, India.</li>
              <li><strong>Independence:</strong> We have no corporate affiliations with political parties, government ministries, or state-funded sovereign wealth vehicles.</li>
              <li><strong>Revenue Model:</strong> Our editorial operations are funded strictly through programmatic display advertising (Google AdSense), verified institutional guest features, and transparent newsletter sponsorships. Commercial relationships never influence editorial judgment.</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <Footer />
    </div>
  );
}
