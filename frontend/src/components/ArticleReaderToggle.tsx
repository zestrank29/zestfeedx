"use client";

import React, { useState } from "react";
import { Zap, BookOpen, CheckCircle, Users, HelpCircle } from "lucide-react";

interface ArticleReaderToggleProps {
  isHindi: boolean;
  deck: string;
  takeaways: string[];
  whyItMatters?: string;
  whoIsAffected?: string;
  contentMarkdown: string;
  children: React.ReactNode;
}

export default function ArticleReaderToggle({
  isHindi,
  deck,
  takeaways,
  whyItMatters,
  whoIsAffected,
  contentMarkdown,
  children,
}: ArticleReaderToggleProps) {
  const [mode, setMode] = useState<"full" | "brief">("full");

  const faqMatches = Array.from(
    (contentMarkdown || "").matchAll(
      /\*\*Q\d*[:.]?\s*([^\n*]+)\*\*\s*\n+(?:\*\*A\d*[:.]?\*\*\s*)?([^\n]+(?:\n(?!\*\*Q)[^\n]+)*)/gi
    )
  ).slice(0, 4);

  return (
    <div>
      {/* Unique 60-Second Brief vs Full Deep-Dive Mode Switcher */}
      <div className="mb-6 p-2 rounded-xl bg-[#F6F2EA] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#525866] dark:text-[#94A3B8] px-2">
          {isHindi ? "रीडिंग मोड" : "Reading Mode"}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMode("full")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === "full"
                ? "bg-[#0B1020] dark:bg-white text-white dark:text-[#0B1020] shadow-xs"
                : "text-[#525866] dark:text-[#94A3B8] hover:text-[#0B1020] dark:hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {isHindi ? "पूरी खबर (Full Story)" : "Full Deep Dive"}
          </button>
          <button
            type="button"
            onClick={() => setMode("brief")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === "brief"
                ? "bg-[#FF5A1F] text-white shadow-xs"
                : "text-[#525866] dark:text-[#94A3B8] hover:text-[#FF5A1F]"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {isHindi ? "60-सेकंड सारांश" : "60-Second Brief"}
          </button>
        </div>
      </div>

      {/* 60-Second Brief View */}
      {mode === "brief" && (
        <div className="mb-8 space-y-5 p-6 rounded-xl bg-white dark:bg-[#0F172A] border-2 border-[#FF5A1F]/40 shadow-sm">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#FF5A1F]">
              {isHindi ? "60-सेकंड मुख्य सारांश" : "60-Second Intelligence Brief"}
            </span>
            <p className="mt-2 text-base font-medium leading-relaxed text-[#0B1020] dark:text-[#F1F5F9]">
              {deck}
            </p>
          </div>

          {takeaways.length > 0 && (
            <div className="pt-4 border-t border-[#E8E4DC] dark:border-[#1E293B]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#525866] dark:text-[#94A3B8] mb-3">
                {isHindi ? "मुख्य बिंदु" : "Key Facts"}
              </h3>
              <ul className="space-y-2">
                {takeaways.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-[#0E7C86] shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(whyItMatters || whoIsAffected) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E8E4DC] dark:border-[#1E293B] text-xs">
              {whyItMatters && (
                <div className="p-3.5 rounded-lg bg-[#FAF8F4] dark:bg-[#080C16]">
                  <div className="font-bold text-[#FF5A1F] mb-1">
                    {isHindi ? "यह क्यों महत्वपूर्ण है" : "Why It Matters"}
                  </div>
                  <p className="text-[#525866] dark:text-[#CBD5E1] leading-relaxed">{whyItMatters}</p>
                </div>
              )}
              {whoIsAffected && (
                <div className="p-3.5 rounded-lg bg-[#FAF8F4] dark:bg-[#080C16]">
                  <div className="font-bold text-[#0E7C86] mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {isHindi ? "कौन प्रभावित होगा" : "Who Is Affected"}
                  </div>
                  <p className="text-[#525866] dark:text-[#CBD5E1] leading-relaxed">{whoIsAffected}</p>
                </div>
              )}
            </div>
          )}

          {faqMatches.length > 0 && (
            <div className="pt-4 border-t border-[#E8E4DC] dark:border-[#1E293B] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#525866] dark:text-[#94A3B8] flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#FF5A1F]" />
                {isHindi ? "अक्सर पूछे जाने वाले सवाल" : "Quick FAQs"}
              </h3>
              {faqMatches.map((m, i) => (
                <div key={i} className="text-xs space-y-1">
                  <div className="font-bold text-[#0B1020] dark:text-white">{m[1].trim()}</div>
                  <div className="text-[#525866] dark:text-[#CBD5E1]">{m[2].replace(/\*\*/g, "").trim()}</div>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setMode("full")}
            className="text-xs font-bold text-[#FF5A1F] hover:underline"
          >
            {isHindi ? "पूरी विस्तृत खबर पढ़ें →" : "Read Full Deep-Dive Article →"}
          </button>
        </div>
      )}

      {/* Keep Full Story always in DOM for SEO crawlers; hide visually only when in brief mode */}
      <div className={mode === "brief" ? "hidden" : "block"}>{children}</div>
    </div>
  );
}
