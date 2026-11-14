"use client";

import React from "react";
import Link from "next/link";
import { HelpCircle, ArrowRight, Lightbulb } from "lucide-react";
import { EXPLAINER_STORIES } from "@/data/demoContent";

interface ExplainerCarouselProps {
  currentLanguage?: "en" | "hi";
}

export default function ExplainerCarousel({ currentLanguage = "en" }: ExplainerCarouselProps) {
  const isHindi = currentLanguage === "hi";

  return (
    <section className="py-8 border-b border-[#E8E4DC] dark:border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-[#0B1020] dark:border-[#F1F5F9]">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#FF5A1F]" />
            <div>
              <h3 className={`font-display text-xl sm:text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9] ${isHindi ? "font-hindi" : ""}`}>
                {isHindi ? "विश्लेषण एवं तथ्य डेस्क" : "The Explainer Desk"}
              </h3>
              <p className={`text-xs text-[#525866] dark:text-[#94A3B8] ${isHindi ? "font-hindi" : ""}`}>
                {isHindi
                  ? "नागरिकों और निवेशकों के लिए बुनियादी नियम, नीतियां और गहन विश्लेषण"
                  : "Context, regulatory shifts, and fundamental primers for citizens & investors"}
              </p>
            </div>
          </div>

          <Link
            href="/explainers"
            className="text-xs font-semibold text-[#FF5A1F] hover:underline flex items-center gap-1"
          >
            <span>{isHindi ? "सभी विश्लेषण" : "All explainers"}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EXPLAINER_STORIES.map((item) => (
            <div
              key={item.id}
              className="bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-lg p-5 flex flex-col justify-between hover:border-[#FF5A1F] transition-all group hover:shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5A1F] bg-[#FF5A1F]/10 px-2 py-0.5 rounded">
                    {item.badge}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] font-mono">
                    {item.read_time.replace("min read", isHindi ? "मिनट" : "min read")}
                  </span>
                </div>

                <Link href={`/article/${item.slug}`} className="block">
                  <h4 className={`font-display text-base font-bold text-[#0B1020] dark:text-[#F1F5F9] leading-snug group-hover:text-[#FF5A1F] transition-colors mb-2 ${isHindi ? "font-hindi leading-[1.35]!" : ""}`}>
                    {isHindi && item.title_hi ? item.title_hi : item.title}
                  </h4>
                </Link>

                <p className={`text-xs text-[#525866] dark:text-[#94A3B8] leading-relaxed ${isHindi ? "font-hindi leading-[1.6]!" : ""}`}>
                  {isHindi && item.subtitle_hi ? item.subtitle_hi : item.subtitle}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F0ECE1] dark:border-[#1E293B] mt-4 flex items-center justify-between text-[11px]">
                <span className="text-[#94A3B8]">{item.date}</span>
                <Link
                  href={`/article/${item.slug}`}
                  className="font-semibold text-[#FF5A1F] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>{isHindi ? "पूरा विश्लेषण पढ़ें" : "Read primer"}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
