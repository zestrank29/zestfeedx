"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass, CheckCircle2 } from "lucide-react";
import { MORNING_BRIEF } from "@/data/demoContent";

interface MorningBriefCardProps {
  currentLanguage?: "en" | "hi";
}

export default function MorningBriefCard({ currentLanguage = "en" }: MorningBriefCardProps) {
  const brief = MORNING_BRIEF;

  const isHindi = currentLanguage === "hi";
  const editionTitle = isHindi && brief.edition_hi ? brief.edition_hi : brief.edition;
  const dateLabel = isHindi && brief.date_label_hi ? brief.date_label_hi : brief.date_label;
  const summaryText = isHindi && brief.summary_hi ? brief.summary_hi : brief.summary;

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F6F2EA] dark:bg-[#0F172A] border border-[#E0D8CB] dark:border-[#1E293B] rounded-xl p-6 sm:p-8 shadow-xs">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E0D8CB] dark:border-[#1E293B] gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center font-serif text-lg font-bold shadow-xs">
                Z
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF5A1F] font-mono">
                    {isHindi ? "संपादकीय बुलेटिन" : "Official Executive Intelligence"}
                  </span>
                  <span className="text-[10px] text-[#525866] dark:text-[#94A3B8]">
                    • {dateLabel}
                  </span>
                </div>
                <h3 className={`font-display text-xl sm:text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9] ${isHindi ? "font-hindi" : ""}`}>
                  {editionTitle}
                </h3>
              </div>
            </div>

            {/* Editor Signature */}
            <div className="flex items-center gap-3 bg-[#EAE3D5] dark:bg-[#1E293B] px-3.5 py-1.5 rounded-lg border border-[#DDD7CD] dark:border-[#334155]">
              <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0">
                <Image
                  src={brief.editor.avatar}
                  alt={brief.editor.name}
                  fill
                  sizes="28px"
                  className="object-cover"
                />
              </div>
              <div className="text-[11px]">
                <p className="font-semibold text-[#0B1020] dark:text-[#F1F5F9]">
                  {isHindi ? `संपादक: ${brief.editor.name}` : `Curated by ${brief.editor.name}`}
                </p>
                <p className="text-[9px] text-[#525866] dark:text-[#94A3B8] font-mono">
                  {isHindi ? `डेस्क प्रेषण @ ${brief.published_time_ist}` : `Desk Dispatch @ ${brief.published_time_ist}`}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className={`mt-4 text-xs sm:text-sm text-[#525866] dark:text-[#94A3B8] max-w-3xl leading-relaxed ${isHindi ? "font-hindi" : ""}`}>
            {summaryText}
          </p>

          {/* 5 Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
            {brief.items.map((item) => (
              <div
                key={item.num}
                className="bg-[#FFFFFF] dark:bg-[#080C16] border border-[#E8E4DC] dark:border-[#1E293B] rounded-lg p-3.5 flex flex-col justify-between group hover:border-[#FF5A1F] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-[#FF5A1F]">
                      0{item.num}
                    </span>
                    <Compass className="w-3 h-3 text-[#94A3B8] group-hover:rotate-45 transition-transform" />
                  </div>
                  <h4 className={`font-display text-xs font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-1 line-clamp-1 ${isHindi ? "font-hindi" : ""}`}>
                    {isHindi && item.title_hi ? item.title_hi : item.title}
                  </h4>
                  <p className={`text-[11px] text-[#525866] dark:text-[#94A3B8] leading-snug line-clamp-3 ${isHindi ? "font-hindi" : ""}`}>
                    {isHindi && item.text_hi ? item.text_hi : item.text}
                  </p>
                </div>

                <Link
                  href={item.link}
                  className="mt-3 text-[10px] font-bold text-[#0E7C86] dark:text-[#14B8A6] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>{isHindi ? "पूरी रिपोर्ट पढ़ें" : "Read report"}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
