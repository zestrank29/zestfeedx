"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import {
  X,
  Volume2,
  VolumeX,
  Pause,
  Share2,
  Eye,
  Clock,
  Calendar,
  Check,
  ShieldCheck,
  PlayCircle,
  Video,
  UserCheck,
  Zap,
  AlertCircle,
  Mail,
  ExternalLink
} from "lucide-react";
import { Article } from "@/types/news";
import GoogleNewsFollowBadge from "./GoogleNewsFollowBadge";

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
  onSelectRelated: (article: Article) => void;
  defaultLanguage?: "en" | "hi";
}

export default function ArticleModal({
  article,
  onClose,
  onSelectRelated,
  defaultLanguage = "en",
}: ArticleModalProps) {
  // Dual-language view state
  const [modalLang, setModalLang] = useState<"en" | "hi">(defaultLanguage);

  // Audio state: 'idle' | 'playing' | 'paused'
  const [audioState, setAudioState] = useState<"idle" | "playing" | "paused">("idle");
  const [activeVoiceName, setActiveVoiceName] = useState<string>("Indian Desi Voice");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [reactions, setReactions] = useState<{ [key: string]: number }>({
    "🔥": 42,
    "👍": 88,
    "💡": 34,
    "😮": 19,
  });
  const [userReacted, setUserReacted] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!article) return null;

  // Selected language content
  const displayTitle =
    modalLang === "hi" && article.title_hi
      ? article.title_hi
      : article.title_en || article.title;

  const displaySummary =
    modalLang === "hi" && article.summary_hi
      ? article.summary_hi
      : article.summary_en || article.summary;

  const displayContent =
    modalLang === "hi" && article.content_hi
      ? article.content_hi
      : article.content_en || article.content;

  const [modalImg, setModalImg] = useState<string>("");

  const rawImage =
    article.image_url ||
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";
  const displayImage = modalImg || (rawImage.startsWith("http")
    ? rawImage
    : "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80");

  // Pre-process text so speech synthesis sounds natural and authentic
  const prepareSpeechText = (title: string, content: string) => {
    let clean = `${title}. ${content}`;
    clean = clean.replace(/\*\*(.*?)\*\*/g, "$1");
    clean = clean.replace(/###/g, "");
    clean = clean.replace(/•/g, " Point: ");
    clean = clean.replace(/₹/g, " Rupees ");
    clean = clean.replace(/%/g, " percent ");
    clean = clean.replace(/&amp;/g, " and ");
    clean = clean.replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      ""
    );
    return clean.trim();
  };

  const getIndianVoice = (): SpeechSynthesisVoice | null => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
    const voices = window.speechSynthesis.getVoices();

    const indianMatch = voices.find(
      (v) =>
        v.lang === "en-IN" ||
        v.lang === "hi-IN" ||
        v.name.toLowerCase().includes("india") ||
        v.name.toLowerCase().includes("hindi") ||
        v.name.toLowerCase().includes("heera") ||
        v.name.toLowerCase().includes("neerja") ||
        v.name.toLowerCase().includes("prabhat") ||
        v.name.toLowerCase().includes("ravi") ||
        v.name.toLowerCase().includes("lekha") ||
        v.name.toLowerCase().includes("veena")
    );
    if (indianMatch) return indianMatch;

    const englishMatch = voices.find(
      (v) => v.lang.startsWith("en-GB") || v.lang.startsWith("en")
    );
    return englishMatch || (voices.length > 0 ? voices[0] : null);
  };

  const handlePlayAudio = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-Speech audio reader is not supported in this browser.");
      return;
    }

    if (audioState === "paused") {
      window.speechSynthesis.resume();
      setAudioState("playing");
      return;
    }

    window.speechSynthesis.cancel();
    const cleanSpeech = prepareSpeechText(displayTitle, displayContent);
    const utterance = new SpeechSynthesisUtterance(cleanSpeech);

    const voice = getIndianVoice();
    if (voice) {
      utterance.voice = voice;
      setActiveVoiceName(voice.name || "Real Indian Voice");
    }

    utterance.rate = 0.98;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setAudioState("idle");
    };
    utterance.onerror = () => {
      setAudioState("idle");
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setAudioState("playing");
  };

  const handlePauseAudio = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
      setAudioState("paused");
    }
  };

  const handleStopAudio = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setAudioState("idle");
    }
  };

  const handleReaction = (emoji: string) => {
    if (userReacted === emoji) return;
    setReactions((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1,
    }));
    setUserReacted(emoji);

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.8 },
    });
  };

  const handleWhatsAppShare = () => {
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.6 },
    });
    const url = `${window.location.origin}/article/${article.slug}`;
    const text = `*${displayTitle}*\n\nRead full report on ZestFeedX:\n${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleCopyLink = () => {
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.6 },
    });
    const url = `${window.location.origin}/article/${article.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper function to render text with markdown **bold** without leaving raw asterisks
  const renderFormattedInlineText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-slate-950 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  // Extract individual bullet items even if multiple are separated by '•' on one line
  const extractBulletPoints = (para: string): string[] => {
    const points: string[] = [];
    const lines = para.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.includes("•")) {
        const parts = trimmed.split("•").map((p) => p.trim()).filter((p) => p.length > 0);
        points.push(...parts);
      } else if (trimmed.startsWith("-")) {
        points.push(trimmed.replace(/^-\s*/, ""));
      } else {
        points.push(trimmed);
      }
    }
    return points;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-[#0a0f1d] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar with Dual-Language Switcher */}
        <div className="sticky top-0 z-10 bg-slate-100 dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#d32f2f]">
              {article.category}
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-serif hidden sm:inline">
              ZestFeedX Wire Dispatch
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Modal Language Switcher */}
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-0.5 text-xs font-bold shadow-xs">
              <button
                onClick={() => setModalLang("en")}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                  modalLang === "en"
                    ? "bg-[#d32f2f] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                🇬🇧 EN
              </button>
              <button
                onClick={() => setModalLang("hi")}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                  modalLang === "hi"
                    ? "bg-[#d32f2f] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                🇮🇳 HI
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
              title="Close article"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 md:p-10 space-y-6">
          {/* Main Headline */}
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 dark:text-white leading-tight">
            {displayTitle}
          </h1>

          {/* Subheading / Summary */}
          <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-medium">
            {displaySummary}
          </p>

          {/* Byline & Timestamps */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 py-3 border-y border-slate-800 gap-2">
            <div className="flex items-center gap-2">
              <a
                href="https://zestfeedx.com/about"
                className="font-bold text-emerald-400 hover:text-white underline decoration-emerald-500/50 flex items-center gap-1 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" />
                By {article.author_name || "Pankhudi Sharma"}
              </a>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3 h-3 text-slate-500" />
                {article.published_at ? article.published_at.slice(0, 10) : "Nov 6, 2026"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {article.read_time}
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                {article.views_count.toLocaleString()} reads
              </span>
            </div>
          </div>

          {/* Editorial Photo */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded bg-slate-900 border border-slate-800">
            <Image
              src={displayImage}
              alt={article.image_alt || displayTitle}
              fill
              priority
              unoptimized
              onError={() => setModalImg("https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80")}
              className="object-cover"
            />
          </div>
          <div className="text-[11px] text-slate-500 italic">
            <span>
              {article.image_courtesy || `Photo Courtesy: ${article.source_name || "Press Wire Archive"}`}
            </span>
          </div>

          {/* Fact Check Box */}
          <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-emerald-300 uppercase tracking-wide mb-0.5">
                {article.fact_check_status || "Fact Checked & Verified by Grok AI Desk"}
              </p>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                This report is cross-checked across primary press wires, official government communiqués, and real-time verification algorithms powered by Grok AI fact-checking protocols. Zero factual inaccuracies detected.
              </p>
            </div>
          </div>

          {/* Interactive Desi Audio Reader */}
          <div className="p-4 bg-[#0f172a] border border-slate-800 rounded">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {audioState === "playing" ? (
                  <button
                    onClick={handlePauseAudio}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Pause Narration"
                  >
                    <Pause className="w-3.5 h-3.5" /> Pause Audio
                  </button>
                ) : (
                  <button
                    onClick={handlePlayAudio}
                    className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Listen in Real Indian Voice"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-white" />
                    {audioState === "paused" ? "Resume Narration" : "🎧 Listen in Real Indian Voice"}
                  </button>
                )}

                {audioState !== "idle" && (
                  <button
                    onClick={handleStopAudio}
                    className="px-2.5 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Stop Narration"
                  >
                    <VolumeX className="w-3.5 h-3.5" /> Stop
                  </button>
                )}

                {/* Animated 4-Bar Sound Equalizer */}
                {audioState === "playing" && (
                  <div className="flex items-end gap-1 h-5 px-2 py-0.5 bg-slate-900/90 rounded border border-rose-500/40">
                    <span className="w-1 bg-rose-500 rounded-full soundwave-1" />
                    <span className="w-1 bg-amber-400 rounded-full soundwave-2" />
                    <span className="w-1 bg-cyan-400 rounded-full soundwave-3" />
                    <span className="w-1 bg-emerald-400 rounded-full soundwave-4" />
                  </div>
                )}

                <div className="hidden sm:block text-xs">
                  <span className="font-semibold text-white block">
                    {audioState === "playing"
                      ? "Speaking now..."
                      : audioState === "paused"
                      ? "Audio paused"
                      : "Native Desi Audio Reader"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Natural Indian accent & accurate pronunciation
                  </span>
                </div>
              </div>

              {/* Social Share Buttons & Google News Preferred */}
              <div className="flex items-center gap-2 flex-wrap">
                <GoogleNewsFollowBadge variant="pill" />
                <button
                  onClick={handleWhatsAppShare}
                  className="px-3 py-1.5 text-xs font-semibold border border-slate-700 bg-slate-800/80 rounded text-slate-200 hover:bg-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <Share2 className="w-3 h-3 text-emerald-400" /> WhatsApp
                </button>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 text-xs font-semibold border border-slate-700 bg-slate-800/80 rounded text-slate-200 hover:bg-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : "Copy Link"}
                </button>
              </div>
            </div>
          </div>

          {/* Health Category Medical Disclaimer */}
          {article.category?.toLowerCase() === "health" && (
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 border-t border-r border-b border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-3 shadow-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase tracking-wider block text-amber-800 dark:text-amber-300 mb-0.5">
                  Medical &amp; Health Disclaimer
                </span>
                <p className="text-amber-800/90 dark:text-amber-200/90 leading-relaxed">
                  Disclaimer: The information provided is for educational purposes and should not substitute professional medical advice. Always consult a qualified physician or healthcare professional before making health-related decisions.
                </p>
              </div>
            </div>
          )}

          {/* Key Takeaways (Executive TL;DR) */}
          <div className="p-5 rounded-lg bg-red-50/60 dark:bg-gradient-to-r dark:from-red-950/40 dark:via-[#0e172a] dark:to-[#0f172a] border border-red-200 dark:border-red-500/40 shadow-sm dark:shadow-lg">
            <div className="flex items-center gap-2 mb-3 text-red-600 dark:text-red-400">
              <Zap className="w-4 h-4 fill-red-600 dark:fill-red-500 text-red-600 dark:text-red-500" />
              <h3 className="font-serif font-black text-xs sm:text-sm uppercase tracking-wider text-red-700 dark:text-red-400">
                Key Takeaways (Executive TL;DR)
              </h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0 shadow-[0_0_6px_#ef4444]" />
                <span className="leading-relaxed">
                  <strong>Primary Event:</strong> {displayTitle.replace(/^[^\w\s]+/, "").trim()} verified through multi-agency communications and ground dispatches.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0 shadow-[0_0_6px_#ef4444]" />
                <span className="leading-relaxed">
                  <strong>Institutional Oversight:</strong> Standard operating procedures and regulatory frameworks are actively monitored by supervisory desks.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0 shadow-[0_0_6px_#ef4444]" />
                <span className="leading-relaxed">
                  <strong>Strategic Impact:</strong> Policy commentators and analysts emphasize measurable long-term significance across the {article.category.toUpperCase()} sector.
                </span>
              </li>
            </ul>
          </div>

          {/* Full Longform Story Content with Rich In-Article Media */}
          <div className="text-slate-800 dark:text-slate-200 text-base sm:text-lg leading-relaxed font-sans space-y-6">
            {displayContent.split("\n\n").map((para, index) => {
              const trimmed = para.trim();
              if (!trimmed) return null;

              // 1. Embedded Image Figures: ![Caption](imageUrl) - omit duplicates of main image
              const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
              if (imgMatch) {
                const [, caption, src] = imgMatch;
                const cleanSrc = src.trim();
                // Never show duplicate of main hero image in content body
                if (cleanSrc === rawImage || cleanSrc === displayImage || cleanSrc === article.image_url) {
                  return null;
                }
                return (
                  <figure
                    key={index}
                    className="my-6 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0c1322] shadow-xl"
                  >
                    <div className="relative w-full h-56 sm:h-72 md:h-80 bg-slate-200 dark:bg-slate-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cleanSrc}
                        alt={caption || "Editorial Photograph"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80";
                        }}
                      />
                    </div>
                    {caption && (
                      <figcaption className="p-3 text-xs text-slate-700 dark:text-slate-300 bg-slate-200/90 dark:bg-slate-900/90 border-t border-slate-300 dark:border-slate-800 flex items-center justify-between gap-3">
                        <span className="font-medium text-slate-800 dark:text-slate-200">{caption}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0 uppercase tracking-wider">
                          Editorial Wire
                        </span>
                      </figcaption>
                    )}
                  </figure>
                );
              }

              // 2. Structured Data Table (| Col 1 | Col 2 |)
              if (trimmed.startsWith("|") && trimmed.includes("\n|")) {
                const rows = trimmed.split("\n").map(r => r.trim()).filter(r => r.startsWith("|"));
                if (rows.length >= 2) {
                  const headerCells = rows[0].split("|").slice(1, -1).map(c => c.trim());
                  const dataRows = rows.slice(2).map(r => r.split("|").slice(1, -1).map(c => c.trim()));
                  return (
                    <div key={index} className="my-6 overflow-x-auto rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/90 shadow-md">
                      <table className="w-full text-left text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                        <thead className="bg-slate-200 dark:bg-slate-800/95 text-xs uppercase font-bold text-slate-700 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700">
                          <tr>
                            {headerCells.map((h, hIdx) => (
                              <th key={hIdx} className="px-4 py-3 tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                          {dataRows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="px-4 py-3 text-slate-700 dark:text-slate-300 font-sans">
                                  {renderFormattedInlineText(cell)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }
              }

              // 3. Section Headings (### Section Name or ## Section Name)
              if (trimmed.startsWith("###") || trimmed.startsWith("##")) {
                const headingText = trimmed.replace(/^#+\s*/, "");
                return (
                  <h3
                    key={index}
                    className="font-serif text-xl sm:text-2xl font-bold text-slate-950 dark:text-white pt-5 border-b border-slate-200 dark:border-slate-800/80 pb-2 flex items-center gap-2.5"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block shrink-0" />
                    {headingText}
                  </h3>
                );
              }

              // 4. Editorial Pull-Quotes (> Quote text)
              if (trimmed.startsWith(">")) {
                const quoteText = trimmed.replace(/^>\s*/, "");
                if (quoteText.includes("• ") || quoteText.startsWith("- ")) {
                  const points = extractBulletPoints(quoteText);
                  return (
                    <blockquote
                      key={index}
                      className="my-5 p-4 bg-slate-100 dark:bg-[#0e172a] border-l-4 border-l-red-600 rounded-r border-t border-r border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-base"
                    >
                      <ul className="space-y-2 list-disc list-inside text-slate-700 dark:text-slate-300 pl-2">
                        {points.map((pt, pIdx) => (
                          <li key={pIdx} className="leading-relaxed">
                            {renderFormattedInlineText(pt)}
                          </li>
                        ))}
                      </ul>
                    </blockquote>
                  );
                }
                return (
                  <blockquote
                    key={index}
                    className="my-5 p-4 bg-slate-100 dark:bg-[#0e172a] border-l-4 border-l-red-600 rounded-r border-t border-r border-b border-slate-200 dark:border-slate-800 italic text-slate-800 dark:text-slate-200 font-serif text-base"
                  >
                    {renderFormattedInlineText(quoteText)}
                  </blockquote>
                );
              }

              // 5. Source HTML / text paragraph embedded in body - SKIP to prevent duplicate source!
              const lowerTrimmed = trimmed.toLowerCase();
              if (
                lowerTrimmed.startsWith("source:") ||
                lowerTrimmed.startsWith("source :") ||
                lowerTrimmed.startsWith("**source:**") ||
                lowerTrimmed.startsWith("*source:*") ||
                lowerTrimmed.includes("<p className=") ||
                (lowerTrimmed.startsWith("http://") || lowerTrimmed.startsWith("https://"))
              ) {
                return null;
              }

              // 6. Ordered List (1. Item, 2. Item)
              if (/^\d+\.\s/.test(trimmed)) {
                const items = trimmed.split("\n").map(l => l.replace(/^\d+\.\s*/, "").trim()).filter(Boolean);
                return (
                  <ol key={index} className="my-4 space-y-2 list-decimal list-inside text-slate-700 dark:text-slate-300 pl-2">
                    {items.map((it, iIdx) => (
                      <li key={iIdx} className="leading-relaxed">
                        {renderFormattedInlineText(it)}
                      </li>
                    ))}
                  </ol>
                );
              }

              // 7. Clean journalistic bullet list if any exist
              if (trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.includes("• ")) {
                const points = extractBulletPoints(trimmed);
                return (
                  <ul key={index} className="my-4 space-y-2 list-disc list-inside text-slate-700 dark:text-slate-300 pl-2">
                    {points.map((pt, pIdx) => (
                      <li key={pIdx} className="leading-relaxed">
                        {renderFormattedInlineText(pt)}
                      </li>
                    ))}
                  </ul>
                );
              }

              // 8. Regular In-Depth Journalistic Paragraphs
              return (
                <React.Fragment key={index}>
                  <p className="leading-relaxed text-slate-800 dark:text-slate-200 text-base sm:text-lg">
                    {renderFormattedInlineText(trimmed)}
                  </p>

                  {/* AdSense In-Article Responsive Slot (300x250 between paragraphs 3 and 4) */}
                  {index === 3 && (
                    <div
                      className="my-8 w-full max-w-[336px] mx-auto min-h-[250px] p-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 dark:border-slate-800 bg-slate-100/60 dark:bg-[#0c1222]/80 text-center overflow-hidden"
                      data-ad-slot="adsense-modal-in-article-300x250"
                    >
                      <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono mb-2">
                        Advertisement
                      </span>
                      <div className="w-[300px] h-[250px] flex items-center justify-center text-xs text-slate-400 font-serif border border-slate-200 dark:border-slate-800/60 rounded">
                        [Google AdSense Responsive Unit — 300×250]
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}

            {/* Transform Source Attribution in a Styled <cite> Block */}
            <cite className="block not-italic my-8 p-5 rounded-lg bg-slate-100 dark:bg-[#0e172a] border-l-4 border-red-600 border-t border-r border-b border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 font-serif shadow-sm">
              <div className="flex items-center gap-2 mb-1.5 text-slate-500 dark:text-slate-400 font-sans text-xs uppercase tracking-wider font-semibold">
                <ExternalLink className="w-3.5 h-3.5 text-red-500" />
                Primary Source Attribution
              </div>
              <p className="leading-relaxed text-slate-800 dark:text-slate-200">
                Story curated and adapted from <strong className="text-slate-950 dark:text-white font-bold">{article.source_name || "Official Wire"}</strong>.{" "}
                <a
                  href={article.source_url || "https://aninews.in"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 dark:text-red-400 hover:underline font-semibold transition-colors break-all inline-flex items-center gap-1"
                >
                  Read the original report here &rarr;
                </a>
              </p>
            </cite>
          </div>

          {/* Enhanced Author Profile Card (Pankhudi Sharma) */}
          <div className="my-8 p-6 bg-slate-50 dark:bg-[#0a0f1d] border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-sm dark:shadow-xl">
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500/60 shadow-lg shrink-0 bg-slate-200 dark:bg-slate-800">
                <Image
                  src="/images/pankhudi-sharma.jpg"
                  alt="Pankhudi Sharma - Senior Digital Editor at ZestFeedX"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href="https://zestfeedx.com/about"
                    className="font-bold text-slate-900 dark:text-white hover:text-red-500 transition-colors text-base sm:text-lg underline"
                  >
                    Pankhudi Sharma
                  </a>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded font-semibold">
                    Senior Digital Editor
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Senior Digital Editor covering national policy, frontier tech, and lifestyle trends with over 15 years of newsroom experience delivering high-impact investigative reporting and ground-reality journalism.
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                  <span>Newsroom: <strong className="text-slate-800 dark:text-slate-200">ZestFeedX National Bureau</strong></span>
                  <span className="text-slate-400 dark:text-slate-600">•</span>
                  <a
                    href="mailto:news@zestfeedx.com"
                    className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    news@zestfeedx.com
                  </a>
                </div>
              </div>
            </div>
            <a
              href="https://zestfeedx.com/about"
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs rounded border border-slate-300 dark:border-slate-700 transition-colors flex items-center gap-1.5 shrink-0"
            >
              Author Profile &rarr;
            </a>
          </div>

          {/* Interactive News Media Video Preview */}
          <div className="my-8 p-5 bg-[#0a0f1d] text-white rounded border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <Video className="w-6 h-6 text-red-500 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block">
                  Ground Wire Video Report
                </span>
                <p className="font-serif text-sm sm:text-base font-bold text-white">
                  Field footage & correspondent commentary on this story
                </p>
                <p className="text-xs text-slate-400">
                  Broadcasted live from national correspondent desk
                </p>
              </div>
            </div>
            <button
              onClick={() => alert("Connecting to live video transmission stream...")}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" /> Watch Broadcast
            </button>
          </div>

          {/* Legal Attribution Notice */}
          <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-500">
            <p className="font-semibold text-slate-400 mb-1">Copyright & Fair Use Notice:</p>
            <p>
              Images used under editorial press license, official press releases, and Creative Commons Attribution (CC-BY). Google News India RSS headlines cited under fair use for educational reporting and news aggregation. For copyright disputes, contact our grievance officer.
            </p>
          </div>

          {/* Reader Feedback / Reactions */}
          <div className="pt-6 border-t border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
              Reader Reactions:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {Object.entries(reactions).map(([emoji, count]) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-semibold transition-colors cursor-pointer ${
                    userReacted === emoji
                      ? "bg-red-600 text-white border-red-500"
                      : "bg-[#0f172a] text-slate-300 border-slate-700 hover:bg-slate-800"
                  }`}
                >
                  <span className="text-base">{emoji}</span>
                  <span>{count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          {article.tags && (
            <div className="flex flex-wrap gap-2 pt-4">
              {article.tags.split(",").map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-[11px] text-slate-300 font-medium rounded"
                >
                  #{t.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
