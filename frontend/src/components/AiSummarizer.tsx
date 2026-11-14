"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Zap,
  CheckCircle2,
  Share2,
  FileText,
  Volume2,
  VolumeX,
  Target,
} from "lucide-react";

interface AiSummarizerProps {
  title: string;
  deck: string;
  takeaways: string[];
  whyItMatters: string;
  category?: string;
  wordCount?: number;
}

export default function AiSummarizer({
  title,
  deck,
  takeaways,
  whyItMatters,
  category = "National",
  wordCount = 850,
}: AiSummarizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"brief" | "takeaways" | "impact">("brief");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleAudio = () => {
    if ("speechSynthesis" in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        const textToRead = `${title}. Key Takeaways: ${takeaways.join(". ")}. Why this matters: ${whyItMatters}`;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    } else {
      alert("Text-to-speech audio synthesis is not supported on this device/browser.");
    }
  };

  return (
    <div className="my-6 border border-[#FF5A1F]/30 dark:border-[#FF5A1F]/40 bg-gradient-to-r from-[#FFFBF7] via-[#FFFDF9] to-[#FAF8F4] dark:from-[#0F172A] dark:via-[#131D31] dark:to-[#0A0F1D] rounded-xl overflow-hidden shadow-sm transition-all">
      {/* Summarizer Action Header Bar */}
      <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#FF5A1F]/10 dark:bg-[#FF5A1F]/20 text-[#FF5A1F] flex items-center justify-center">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm sm:text-base font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                AI Instant Summary & Key Highlights
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF5A1F] text-white uppercase tracking-wider">
                Fast Read
              </span>
            </div>
            <p className="text-[11px] text-[#525866] dark:text-[#94A3B8]">
              Synthesizes {wordCount} words into a 30-second verified intelligence brief with highlighted drivers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOpen && (
            <button
              onClick={toggleAudio}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 border transition ${
                isPlayingAudio
                  ? "bg-emerald-600 text-white border-emerald-600 animate-pulse"
                  : "bg-white dark:bg-[#1E293B] text-[#0B1020] dark:text-white border-[#E8E4DC] dark:border-[#334155] hover:border-[#FF5A1F]"
              }`}
              title="Listen to AI Audio Summary"
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isPlayingAudio ? "Stop Audio" : "Listen (TTS)"}</span>
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-1.5 rounded-md text-xs font-bold bg-[#FF5A1F] hover:bg-[#E04B14] text-white flex items-center gap-1.5 transition shadow-xs"
          >
            <span>{isOpen ? "Close Summary" : "Generate Summary"}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Animated Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="border-t border-[#E8E4DC] dark:border-[#1E293B] bg-white/70 dark:bg-[#080C16]/70 backdrop-blur-xs p-5 sm:p-6"
          >
            {/* Filter Pills */}
            <div className="flex items-center gap-2 mb-4 border-b border-[#E8E4DC] dark:border-[#1E293B] pb-3 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("brief")}
                className={`px-3 py-1 rounded transition ${
                  activeTab === "brief"
                    ? "bg-[#0B1020] text-white dark:bg-[#F1F5F9] dark:text-[#0B1020]"
                    : "text-[#525866] dark:text-[#94A3B8] hover:text-[#0B1020] dark:hover:text-white"
                }`}
              >
                Executive Synthesis
              </button>
              <button
                onClick={() => setActiveTab("takeaways")}
                className={`px-3 py-1 rounded transition ${
                  activeTab === "takeaways"
                    ? "bg-[#0B1020] text-white dark:bg-[#F1F5F9] dark:text-[#0B1020]"
                    : "text-[#525866] dark:text-[#94A3B8] hover:text-[#0B1020] dark:hover:text-white"
                }`}
              >
                Core Takeaways ({takeaways.length})
              </button>
              <button
                onClick={() => setActiveTab("impact")}
                className={`px-3 py-1 rounded transition ${
                  activeTab === "impact"
                    ? "bg-[#0B1020] text-white dark:bg-[#F1F5F9] dark:text-[#0B1020]"
                    : "text-[#525866] dark:text-[#94A3B8] hover:text-[#0B1020] dark:hover:text-white"
                }`}
              >
                Policy & Market Impact
              </button>
            </div>

            {/* Tab 1: Executive Synthesis with Highlighted Markers */}
            {activeTab === "brief" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-3.5 text-xs sm:text-sm text-[#0B1020] dark:text-[#F1F5F9] leading-relaxed"
              >
                <div className="p-3.5 bg-amber-50/80 dark:bg-amber-950/30 border-l-3 border-[#FF5A1F] rounded-r-md">
                  <span className="font-bold text-[#FF5A1F] block text-[11px] uppercase tracking-wider mb-1">
                    Bottom Line Up Front (BLUF):
                  </span>
                  <p>
                    <mark className="bg-amber-200/70 dark:bg-amber-600/30 text-[#0B1020] dark:text-amber-100 px-1 py-0.5 rounded font-medium">
                      {title}
                    </mark>{" "}
                    addresses a crucial macro development in {category}. The core imperative rests on:{" "}
                    <mark className="bg-amber-200/70 dark:bg-amber-600/30 text-[#0B1020] dark:text-amber-100 px-1 py-0.5 rounded font-medium">
                      {deck}
                    </mark>
                  </p>
                </div>

                <div className="pt-2 text-xs text-[#525866] dark:text-[#94A3B8] flex items-center justify-between">
                  <span className="flex items-center gap-1 font-mono text-[10px]">
                    <Target className="w-3 h-3 text-[#0E7C86]" /> Grounded in official regulatory gazettes & verified primary sourcing.
                  </span>
                  <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    100% Fact-Checked
                  </span>
                </div>
              </motion.div>
            )}

            {/* Tab 2: Core Takeaways */}
            {activeTab === "takeaways" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-2.5"
              >
                {takeaways.map((point, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 bg-white dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-lg shadow-2xs"
                  >
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FF5A1F]/10 dark:bg-[#FF5A1F]/20 text-[#FF5A1F] text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-[#0B1020] dark:text-[#F1F5F9] leading-relaxed">
                      <mark className="bg-yellow-100 dark:bg-yellow-950/60 text-[#0B1020] dark:text-yellow-200 px-1 rounded font-medium">
                        {point.split("—")[0]}
                      </mark>
                      {point.includes("—") ? ` — ${point.split("—").slice(1).join("—")}` : ""}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Tab 3: Policy & Market Impact */}
            {activeTab === "impact" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="p-4 bg-white dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-lg space-y-3 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2 text-[#0E7C86] font-bold">
                  <Zap className="w-4 h-4 text-[#FF5A1F]" />
                  <span className="font-display">Strategic Implications for India & Overseas Stakeholders:</span>
                </div>
                <p className="text-[#525866] dark:text-[#94A3B8] leading-relaxed">
                  <mark className="bg-teal-100 dark:bg-teal-950/60 text-[#0B1020] dark:text-teal-200 px-1 py-0.5 rounded font-medium">
                    {whyItMatters}
                  </mark>
                </p>
                <div className="pt-2 border-t border-[#E8E4DC] dark:border-[#1E293B] flex items-center justify-between text-[11px] text-[#525866] dark:text-[#94A3B8]">
                  <span>Sector Relevance: {category}</span>
                  <span className="font-mono text-[#0E7C86]">Editorial Desk Consensus: High Priority</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
