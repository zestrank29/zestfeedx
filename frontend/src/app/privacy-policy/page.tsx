import React from "react";
import Link from "next/link";
import { ArrowLeft, Lock, ShieldCheck, UserCheck, FileCheck, HelpCircle } from "lucide-react";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy (DPDP Act 2023 & GDPR) | ZestFeedX",
  description:
    "Review ZestFeedX’s privacy practices compliant with India’s Digital Personal Data Protection (DPDP) Act 2023 and the EU GDPR.",
  alternates: {
    canonical: "https://zestfeedx.com/privacy-policy/",
  },
};

export default function PrivacyPolicyPage() {
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
              Data Sovereignty & Legal Disclosures
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
              Privacy Policy
            </h1>
            <p className="mt-2 text-base text-[#525866] dark:text-[#94A3B8] max-w-2xl">
              Compliance with India’s Digital Personal Data Protection (DPDP) Act 2023 and the General Data Protection Regulation (GDPR).
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none text-[#525866] dark:text-[#94A3B8] leading-relaxed space-y-8">
            <section>
              <h2 className="font-display text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                1. Data Fiduciary Commitment
              </h2>
              <p>
                ZestFeedX (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates as a registered Data Fiduciary under the provisions of the <strong>Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023)</strong>. We respect your sovereign right to digital personal privacy and collect only the minimum personal data required to deliver our news services.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                2. Information We Collect
              </h2>
              <ul>
                <li><strong>Newsletter Subscribers:</strong> When subscribing to &ldquo;The Dispatch,&rdquo; we store your email address solely to transmit editorial digests and periodic dispatches. We do not sell, rent, or syndicate our email rosters to third-party data brokers.</li>
                <li><strong>Advertisers & Guest Post Authors:</strong> For commercial bookings via our Advertiser Marketplace, we collect company name, billing GSTIN, contact representative, and payment reconciliation metadata processed via RBI-compliant payment gateways.</li>
                <li><strong>Technical & Analytical Telemetry:</strong> Anonymized server logs, browser type, regional location (state/city level), and reading completion metrics to optimize layout delivery and maintain uptime.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                3. Your Rights as a Data Principal (DPDP Act 2023)
              </h2>
              <p>
                Under the DPDP Act 2023 and the GDPR, you enjoy the following statutory rights regarding your digital data:
              </p>
              <ul>
                <li><strong>Right to Access:</strong> You may request an itemized summary of personal data processed by ZestFeedX.</li>
                <li><strong>Right to Correction & Erasure:</strong> You may instruct us to rectify inaccurate data or delete your subscriber profile from our active databases.</li>
                <li><strong>Right to Grievance Redressal:</strong> You have the right to register a complaint directly with our Data Protection Officer, who must respond within statutory time limits.</li>
                <li><strong>Right to Nominate:</strong> You may designate another individual to exercise your data rights in the event of death or incapacity.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                4. Advertising & Cookie Disclosures
              </h2>
              <p>
                ZestFeedX partners with Google AdSense and accredited digital ad networks. These services may use non-sensitive browser cookies to serve relevant contextual advertisements. Readers may manage or disable marketing cookies anytime through our on-site cookie manager or via your browser settings.
              </p>
            </section>

            <section className="p-6 bg-white dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl not-prose">
              <h3 className="font-display text-lg font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0E7C86]" /> Data Protection Officer (DPO) Contact
              </h3>
              <p className="text-xs sm:text-sm text-[#525866] dark:text-[#94A3B8]">
                For any inquiries, consent revocation, or statutory grievance redressal under the DPDP Act 2023, contact our designated Grievance Officer:
              </p>
              <div className="mt-3 text-xs font-mono text-[#0B1020] dark:text-[#F1F5F9] space-y-1">
                <p><strong>Officer:</strong> Editorial Grievance & Compliance Cell</p>
                <p><strong>Email:</strong> news@zestfeedx.com</p>
                <p><strong>Address:</strong> ZestFeedX Digital Media, Barakhamba Road, Connaught Place, New Delhi 110001, India</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
