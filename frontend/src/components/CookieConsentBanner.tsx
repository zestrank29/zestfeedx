"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Cookie, X } from "lucide-react";

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("zest_cookie_consent");
      if (!consent) {
        // Show after a brief delay for smooth entrance
        const timer = setTimeout(() => setShowBanner(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const handleConsent = (choice: "all" | "essential") => {
    try {
      localStorage.setItem("zest_cookie_consent", choice);
    } catch {}
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#DDD7CD] dark:border-[#1E293B] rounded-xl p-5 shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-[#FF5A1F]/10 text-[#FF5A1F] shrink-0 mt-0.5">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-display text-sm font-bold text-[#0B1020] dark:text-[#F1F5F9]">
              Data Privacy & Cookie Consent
            </h4>
            <button
              onClick={() => handleConsent("essential")}
              aria-label="Close"
              className="text-[#94A3B8] hover:text-[#0B1020] dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-[#525866] dark:text-[#94A3B8] leading-relaxed">
            In compliance with India&rsquo;s <strong>Digital Personal Data Protection (DPDP) Act 2023</strong> and GDPR, ZestFeedX uses essential cookies and anonymized telemetry to deliver news intelligence and secure ad delivery.
          </p>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs">
            <Link
              href="/privacy-policy"
              className="text-[#0E7C86] dark:text-[#14B8A6] font-semibold underline underline-offset-2 hover:text-[#FF5A1F]"
            >
              Privacy Policy
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleConsent("essential")}
                className="px-3 py-1.5 rounded text-[11px] font-semibold text-[#525866] dark:text-[#94A3B8] hover:bg-[#ECE7DE] dark:hover:bg-[#1E293B] border border-[#DDD7CD] dark:border-[#334155] transition"
              >
                Essential Only
              </button>
              <button
                onClick={() => handleConsent("all")}
                className="px-3.5 py-1.5 rounded text-[11px] font-semibold bg-[#0B1020] dark:bg-[#F1F5F9] text-white dark:text-[#0B1020] hover:bg-[#FF5A1F] dark:hover:bg-[#FF5A1F] dark:hover:text-white transition shadow-xs"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
