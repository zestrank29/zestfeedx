"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Mail, MapPin, ExternalLink, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full bg-[#FAF8F4] dark:bg-[#05080F] border-t-2 border-[#0B1020] dark:border-[#1E293B] text-[#525866] dark:text-[#94A3B8] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#E8E4DC] dark:border-[#1E293B]">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="inline-block focus:outline-hidden">
              <span className="font-display text-2xl font-bold tracking-tight text-[#0B1020] dark:text-[#F1F5F9]">
                ZestFeed<span className="text-[#FF5A1F] italic font-serif">X</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-sm">
              An independent, original-first digital broadsheet delivering verified investigative journalism, macroeconomics, tech policy, and cultural intelligence for India and the global diaspora.
            </p>
            <div className="text-[11px] space-y-1 pt-1 font-mono">
              <p className="flex items-center gap-1.5 text-[#0B1020] dark:text-[#F1F5F9]">
                <MapPin className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span>Editorial Bureau: Connaught Place, New Delhi 110001, India</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#0E7C86]" />
                <span>Tips & Inquiries: editorial@zestfeedx.com</span>
              </p>
            </div>
          </div>

          {/* Col 3: Editorial & Trust Standards */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#0B1020] dark:text-[#F1F5F9] mb-3">
              Editorial Standards
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-[#FF5A1F] transition-colors">
                  About ZestFeedX
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="hover:text-[#FF5A1F] transition-colors">
                  Editorial & Ethics Policy
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy#ai-disclosure" className="hover:text-[#FF5A1F] transition-colors">
                  AI Assistance Disclosure
                </Link>
              </li>
              <li>
                <Link href="/fact-check" className="hover:text-[#FF5A1F] transition-colors">
                  Fact-Checking Guidelines
                </Link>
              </li>
              <li>
                <Link href="/fact-check#corrections" className="hover:text-[#FF5A1F] transition-colors">
                  Corrections Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Commercial & Partnerships */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#0B1020] dark:text-[#F1F5F9] mb-3">
              Commercial & Community
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/advertise" className="hover:text-[#FF5A1F] transition-colors">
                  Advertise & Media Kit
                </Link>
              </li>
              <li>
                <Link href="/advertise#sponsored-posts" className="hover:text-[#FF5A1F] transition-colors">
                  Sponsored Post Guidelines
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FF5A1F] transition-colors">
                  Pitch a Story / Write for Us
                </Link>
              </li>
              <li>
                <Link href="#newsletter" className="hover:text-[#FF5A1F] transition-colors">
                  Newsletter Archive
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & Compliance */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#0B1020] dark:text-[#F1F5F9] mb-3">
              Compliance & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy-policy" className="hover:text-[#FF5A1F] transition-colors">
                  Privacy Policy (DPDP Act)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#FF5A1F] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/copyright-disclaimer" className="hover:text-[#FF5A1F] transition-colors">
                  Copyright & Fair Use Notice
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FF5A1F] transition-colors">
                  Grievance Officer (IT Rules)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-3">
          <p>
            © {new Date().getFullYear()} ZestFeedX Media Group. All rights reserved. Registered under the Press and Registration of Periodicals Act.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 font-semibold text-[#0B1020] dark:text-[#F1F5F9] hover:text-[#FF5A1F] transition"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
