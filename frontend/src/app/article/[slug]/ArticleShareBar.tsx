"use client";

import React, { useState } from "react";
import { Bookmark, Check, Link2, MessageCircle } from "lucide-react";

interface ArticleShareBarProps {
  title: string;
  url: string;
}

export default function ArticleShareBar({ title, url }: ArticleShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {}
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}&via=ZestFeedX`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const shareOnWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${title} - ${url}`
    )}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="py-2.5 flex items-center justify-between text-xs text-[#525866] dark:text-[#94A3B8]">
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8]">
          Share Story:
        </span>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="p-1.5 rounded hover:bg-[#ECE7DE] dark:hover:bg-[#1E293B] hover:text-[#0B1020] dark:hover:text-white transition flex items-center gap-1 text-[11px]"
          title="Copy Article Link"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Link2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{copied ? "Copied!" : "Copy Link"}</span>
        </button>

        {/* X */}
        <button
          onClick={shareOnTwitter}
          className="p-1.5 rounded hover:bg-[#ECE7DE] dark:hover:bg-[#1E293B] hover:text-[#0B1020] dark:hover:text-white transition flex items-center gap-1 text-[11px]"
          title="Share to X"
        >
          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="hidden sm:inline">Post</span>
        </button>

        {/* WhatsApp */}
        <button
          onClick={shareOnWhatsApp}
          className="p-1.5 rounded hover:bg-[#ECE7DE] dark:hover:bg-[#1E293B] hover:text-emerald-600 transition flex items-center gap-1 text-[11px]"
          title="Share to WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">WhatsApp</span>
        </button>
      </div>

      {/* Bookmark */}
      <button
        onClick={() => setBookmarked(!bookmarked)}
        className={`flex items-center gap-1 px-2.5 py-1 rounded transition text-[11px] ${
          bookmarked
            ? "bg-[#FF5A1F]/10 text-[#FF5A1F] font-bold"
            : "hover:bg-[#ECE7DE] dark:hover:bg-[#1E293B] text-[#525866] dark:text-[#94A3B8]"
        }`}
      >
        <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-[#FF5A1F]" : ""}`} />
        <span>{bookmarked ? "Saved" : "Save Story"}</span>
      </button>
    </div>
  );
}
