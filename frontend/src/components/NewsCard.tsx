"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { Clock, Eye, Share2, Check, ShieldCheck, UserCheck, Flame, Zap, Sparkles, ArrowUpRight, Calendar } from "lucide-react";
import { Article } from "@/types/news";

function formatDate(dateStr?: string) {
  if (!dateStr) return "Nov 9, 2026";
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
  } catch {}
  return dateStr.replace(/GMT.*$/, "").trim() || "Nov 9, 2026";
}

interface NewsCardProps {
  article: Article;
  onSelect: (article: Article) => void;
  language?: "en" | "hi";
}

const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";

const CATEGORY_COLORS: Record<string, {
  border: string;
  glow: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  gradientText: string;
  accentBar: string;
}> = {
  politics: {
    border: "border-rose-500/30 hover:border-rose-400",
    glow: "hover:shadow-[0_12px_35px_-8px_rgba(244,63,94,0.35)]",
    badgeBg: "bg-rose-500/20",
    badgeBorder: "border-rose-500/50",
    badgeText: "text-rose-300",
    gradientText: "from-rose-400 to-amber-400",
    accentBar: "bg-rose-500",
  },
  tech: {
    border: "border-cyan-500/30 hover:border-cyan-400",
    glow: "hover:shadow-[0_12px_35px_-8px_rgba(6,182,212,0.35)]",
    badgeBg: "bg-cyan-500/20",
    badgeBorder: "border-cyan-500/50",
    badgeText: "text-cyan-300",
    gradientText: "from-cyan-400 to-blue-400",
    accentBar: "bg-cyan-400",
  },
  health: {
    border: "border-emerald-500/30 hover:border-emerald-400",
    glow: "hover:shadow-[0_12px_35px_-8px_rgba(16,185,129,0.35)]",
    badgeBg: "bg-emerald-500/20",
    badgeBorder: "border-emerald-500/50",
    badgeText: "text-emerald-300",
    gradientText: "from-emerald-400 to-teal-400",
    accentBar: "bg-emerald-400",
  },
  business: {
    border: "border-amber-500/30 hover:border-amber-400",
    glow: "hover:shadow-[0_12px_35px_-8px_rgba(245,158,11,0.35)]",
    badgeBg: "bg-amber-500/20",
    badgeBorder: "border-amber-500/50",
    badgeText: "text-amber-300",
    gradientText: "from-amber-400 to-orange-400",
    accentBar: "bg-amber-400",
  },
  world: {
    border: "border-sky-500/30 hover:border-sky-400",
    glow: "hover:shadow-[0_12px_35px_-8px_rgba(14,165,233,0.35)]",
    badgeBg: "bg-sky-500/20",
    badgeBorder: "border-sky-500/50",
    badgeText: "text-sky-300",
    gradientText: "from-sky-400 to-indigo-400",
    accentBar: "bg-sky-400",
  },
  sports: {
    border: "border-purple-500/30 hover:border-purple-400",
    glow: "hover:shadow-[0_12px_35px_-8px_rgba(168,85,247,0.35)]",
    badgeBg: "bg-purple-500/20",
    badgeBorder: "border-purple-500/50",
    badgeText: "text-purple-300",
    gradientText: "from-purple-400 to-fuchsia-400",
    accentBar: "bg-purple-400",
  },
  entertainment: {
    border: "border-pink-500/30 hover:border-pink-400",
    glow: "hover:shadow-[0_12px_35px_-8px_rgba(236,72,153,0.35)]",
    badgeBg: "bg-pink-500/20",
    badgeBorder: "border-pink-500/50",
    badgeText: "text-pink-300",
    gradientText: "from-pink-400 to-rose-400",
    accentBar: "bg-pink-400",
  },
  science: {
    border: "border-indigo-500/30 hover:border-indigo-400",
    glow: "hover:shadow-[0_12px_35px_-8px_rgba(99,102,241,0.35)]",
    badgeBg: "bg-indigo-500/20",
    badgeBorder: "border-indigo-500/50",
    badgeText: "text-indigo-300",
    gradientText: "from-indigo-400 to-cyan-400",
    accentBar: "bg-indigo-400",
  },
  food: {
    border: "border-orange-500/30 hover:border-orange-400",
    glow: "hover:shadow-[0_12px_35px_-8px_rgba(249,115,22,0.35)]",
    badgeBg: "bg-orange-500/20",
    badgeBorder: "border-orange-500/50",
    badgeText: "text-orange-300",
    gradientText: "from-orange-400 to-amber-400",
    accentBar: "bg-orange-400",
  },
};

export default function NewsCard({ article, onSelect, language = "en" }: NewsCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [reactions, setReactions] = useState<{ fire: number; shock: number; boost: number }>({
    fire: Math.floor((article.views_count % 100) + 12),
    shock: Math.floor((article.views_count % 60) + 7),
    boost: Math.floor((article.views_count % 80) + 15),
  });

  // 3D Tilt State
  const [tiltStyle, setTiltStyle] = useState({
    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    glareX: "50%",
    glareY: "50%",
    isHovered: false,
  });

  const catStyle = CATEGORY_COLORS[article.category.toLowerCase()] || CATEGORY_COLORS.politics;

  const rawImage = article.image_url || DEFAULT_FALLBACK_IMAGE;
  const initialDisplayImage = rawImage.startsWith("http") ? rawImage : DEFAULT_FALLBACK_IMAGE;
  const currentDisplayImage = imgSrc || initialDisplayImage;

  const displayTitle =
    language === "hi" && article.title_hi
      ? article.title_hi
      : article.title_en || article.title;

  const displaySummary =
    language === "hi" && article.summary_hi
      ? article.summary_hi
      : article.summary_en || article.summary;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6.5; // Up to 6.5deg tilt
    const rotateY = ((x - centerX) / centerX) * 6.5;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
      glareX: `${((x / rect.width) * 100).toFixed(0)}%`,
      glareY: `${((y / rect.height) * 100).toFixed(0)}%`,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      glareX: "50%",
      glareY: "50%",
      isHovered: false,
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/article/${article.slug}/`;
    const shareText = `${displayTitle}\n\n${shareUrl}`;

    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.8 },
    });

    if (navigator.share) {
      navigator.share({
        title: displayTitle,
        text: shareText,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReaction = (e: React.MouseEvent, type: "fire" | "shock" | "boost") => {
    e.stopPropagation();
    setReactions((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    confetti({
      particleCount: 15,
      spread: 45,
      ticks: 150,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      },
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(article)}
      style={{
        transform: tiltStyle.transform,
        transition: tiltStyle.isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
      }}
      className={`relative group rounded-xl p-4 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-lg dark:shadow-xl`}
    >
      {/* 3D Holographic Glare Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20"
        style={{
          opacity: tiltStyle.isHovered ? 0.15 : 0,
          background: `radial-gradient(circle 300px at ${tiltStyle.glareX} ${tiltStyle.glareY}, rgba(255,255,255,0.2), transparent 70%)`,
        }}
      />

      {/* Top Accent Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-[#d32f2f] opacity-80`} />

      <div>
        {/* Editorial Photo Container */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-900 mb-3 border border-slate-200 dark:border-slate-800 shadow-inner">
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton-loader z-0" />
          )}
          <Image
            src={currentDisplayImage}
            alt={article.image_alt || displayTitle}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImgSrc(DEFAULT_FALLBACK_IMAGE)}
            className={`object-cover transition-transform duration-500 ease-out group-hover:scale-105 z-10 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
          {/* Floating Category Pill with LED beacon */}
          <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full backdrop-blur-md bg-slate-900/85 border border-white/20 shadow-md">
            <span className={`w-2 h-2 rounded-full bg-[#d32f2f] animate-pulse`} />
            <span className={`text-[10px] font-black uppercase tracking-wider text-white`}>
              {article.category}
            </span>
          </div>

          {/* Verification Badge */}
          <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full backdrop-blur-md bg-emerald-950/85 border border-emerald-500/40 text-[9px] font-bold text-emerald-300 shadow">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Verified</span>
          </div>
        </div>

        {/* Photo Attribution Courtesy */}
        {article.image_courtesy && (
          <p className="text-[10px] text-slate-500 dark:text-slate-500 italic truncate mb-2">
            {article.image_courtesy}
          </p>
        )}

        {/* High-Contrast Bold Headline */}
        <h3 className="font-serif text-base sm:text-lg font-bold text-slate-950 dark:text-white leading-snug group-hover:text-[#d32f2f] dark:group-hover:text-cyan-300 transition-colors line-clamp-2">
          {displayTitle}
        </h3>

        {/* Summary Snippet */}
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300/90 line-clamp-2 leading-relaxed font-sans font-normal">
          {displaySummary}
        </p>
      </div>

      {/* Footer Section: Reactions, Author & Metas */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2.5">
        {/* Interactive Reaction Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={(e) => handleReaction(e, "fire")}
            aria-label="React with fire to breaking news"
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-rose-950/80 border border-slate-200 dark:border-slate-700/60 text-[10px] text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-300 transition-colors cursor-pointer"
            title="React: Fire Breaking News"
          >
            <span>🔥</span>
            <span className="font-mono font-semibold">{reactions.fire}</span>
          </button>
          <button
            onClick={(e) => handleReaction(e, "shock")}
            aria-label="React with shock to trending curiosity"
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-amber-950/80 border border-slate-200 dark:border-slate-700/60 text-[10px] text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-300 transition-colors cursor-pointer"
            title="React: Trending Curiosity"
          >
            <span>⚡</span>
            <span className="font-mono font-semibold">{reactions.shock}</span>
          </button>
          <button
            onClick={(e) => handleReaction(e, "boost")}
            aria-label="React with insight to deep analysis"
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-cyan-950/80 border border-slate-200 dark:border-slate-700/60 text-[10px] text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors cursor-pointer"
            title="React: Deep Insight"
          >
            <span>💡</span>
            <span className="font-mono font-semibold">{reactions.boost}</span>
          </button>
        </div>

        {/* Explicit News Date & Single Source Attribution */}
        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <span className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-1 truncate max-w-[60%]">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400 shrink-0" />
            <span className="truncate">{article.source_name || "Official Wire"}</span>
          </span>
          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 shrink-0 text-[10px] font-mono">
            <Calendar className="w-3 h-3 text-slate-500 dark:text-slate-400 shrink-0" />
            {formatDate(article.published_at)}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
          <a
            href="https://zestfeedx.com/about"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-[#d32f2f] dark:hover:text-red-400 underline decoration-slate-300 dark:decoration-slate-600 transition-colors font-medium"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            By {article.author_name || "Pankhudi Sharma"}
          </a>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500 dark:text-slate-400" />
              {article.read_time}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-slate-500 dark:text-slate-400" />
              {article.views_count.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Read Dispatch CTA Bar */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] font-semibold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Read Full Dispatch
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
          <button
            onClick={handleShare}
            aria-label="Share article link"
            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Share Story & Launch Confetti"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
