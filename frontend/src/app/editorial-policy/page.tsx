import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldAlert, Award, AlertCircle, RefreshCw, Sparkles, Scale } from "lucide-react";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Policy, AI Disclosure & Corrections | ZestFeedX",
  description:
    "Read the editorial guidelines, AI-assistance disclosures, multi-tier fact checking, and formal corrections policy governing ZestFeedX.",
  alternates: {
    canonical: "https://zestfeedx.com/editorial-policy/",
  },
};

export default function EditorialPolicyPage() {
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
              Ethical Code & Journalistic Integrity
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
              Editorial Policy & Standards
            </h1>
            <p className="mt-2 text-base text-[#525866] dark:text-[#94A3B8] max-w-2xl">
              Our principles on original reporting, source verification, AI usage disclosure, and corrections management.
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none text-[#525866] dark:text-[#94A3B8] leading-relaxed space-y-8">
            {/* 1. Core Principles */}
            <section>
              <h2 className="font-display text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                1. Journalistic Accuracy & Verification
              </h2>
              <p>
                ZestFeedX is dedicated to providing truth-grounded intelligence for citizens, policymakers, and business leaders. We adhere strictly to the following reporting principles:
              </p>
              <ul>
                <li><strong>Primary Sourcing:</strong> Whenever covering official announcements, regulatory actions, or statistical trends, reporters must verify claims against primary documents (e.g., Press Information Bureau gazettes, Reserve Bank of India notifications, SEBI filings, CPCB atmospheric telemetry).</li>
                <li><strong>No Aggregated Scrapes:</strong> We reject full-text duplication of third-party reporting. Curated wire briefs provide only headline, an original 40-word analytical summary, and direct outbound links to the originating news organization.</li>
                <li><strong>Named Human Bylines:</strong> All indexable articles carry the verified name, role, and bio of an editorial staff member. We prohibit synthetic bylines, boilerplate author personas, or anonymous attribution for institutional reports.</li>
              </ul>
            </section>

            {/* 2. AI-Assisted Disclosure */}
            <section className="p-6 bg-white dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl not-prose">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[#FF5A1F]" />
                <h3 className="font-display text-lg font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                  2. AI-Assisted Editorial Disclosure
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#525866] dark:text-[#94A3B8] leading-relaxed">
                In adherence to transparent publishing standards, ZestFeedX openly discloses its usage of computational and generative AI technologies:
              </p>
              <ul className="mt-3 space-y-2 text-xs text-[#525866] dark:text-[#94A3B8] list-disc list-inside">
                <li><strong>Feed Processing:</strong> Machine learning algorithms assist our news desk in categorizing incoming press feeds, filtering out duplicate dispatches (trigram similarity $\ge 0.85$), and clustering multi-outlet coverage.</li>
                <li><strong>Human-in-the-Loop Gate:</strong> AI models may generate initial data outlines for recurring daily summaries (e.g., Morning Brief drafts). However, <strong>every sentence published on ZestFeedX is reviewed, fact-checked, edited, and approved by a named human editor</strong>.</li>
                <li><strong>Zero Autonomous Publishing:</strong> No artificial intelligence agent possesses automated publishing rights on our production CMS. Human editors remain legally and journalistically responsible for all published material.</li>
              </ul>
            </section>

            {/* 3. Corrections Policy */}
            <section id="corrections">
              <h2 className="font-display text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                3. Corrections & Retractions Policy
              </h2>
              <p>
                When errors of fact occur, ZestFeedX corrects them promptly and transparently. We do not quietly delete or alter stories without notification:
              </p>
              <ul>
                <li><strong>Correction Footnote:</strong> When an article is updated to correct a factual error, an italicized footnote is appended at the base of the article detailing what was changed, why, and the exact timestamp of correction.</li>
                <li><strong>Major Retractions:</strong> In the rare event that an entire premise of a report is found to be fundamentally flawed, an editor&rsquo;s note is prominently placed at the top of the article, explaining the withdrawal while preserving archival integrity.</li>
                <li><strong>Editorial Grievance Desk:</strong> If you believe a fact in a ZestFeedX dispatch is inaccurate, email our desk directly at <a href="mailto:corrections@zestfeedx.com" className="text-[#FF5A1F] font-semibold">corrections@zestfeedx.com</a>. Every reported dispute is acknowledged within 24 hours.</li>
              </ul>
            </section>

            {/* 4. Commercial & Sponsored Content Disclosure */}
            <section>
              <h2 className="font-display text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                4. Separation of Church & State: Commercial Content
              </h2>
              <p>
                ZestFeedX maintains an impenetrable firewall between commercial advertising and editorial reporting:
              </p>
              <ul>
                <li><strong>Mandatory Sponsored Labels:</strong> All paid guest posts, sponsored features, and press releases carry prominent &ldquo;Sponsored&rdquo; or &ldquo;Guest Post&rdquo; headers and a disclosure box.</li>
                <li><strong>Link Attribute Mandate:</strong> In compliance with Google Webmaster and AdSense policies, all commercial links within guest posts automatically receive <code>rel=&quot;sponsored nofollow&quot;</code> tags.</li>
                <li><strong>Editorial Veto:</strong> Our editors reserve the unconditional right to reject any submitted sponsor copy that promotes predatory loans, unverified medical claims, gambling, or deceptive marketing.</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
