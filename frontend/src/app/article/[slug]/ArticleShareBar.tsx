"use client";

import React, { useState } from "react";
import {
  Bookmark,
  Check,
  Link2,
  MessageCircle,
  Send,
} from "lucide-react";

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

  const shareOnLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`;
    window.open(linkedinUrl, "_blank", "noopener,noreferrer");
  };

  const shareOnFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    window.open(fbUrl, "_blank", "noopener,noreferrer");
  };

  const shareOnTelegram = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`;
    window.open(tgUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#525866] dark:text-[#94A3B8]">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] mr-1">
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

        {/* X / Twitter */}
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

        {/* LinkedIn */}
        <button
          onClick={shareOnLinkedIn}
          className="p-1.5 rounded hover:bg-[#ECE7DE] dark:hover:bg-[#1E293B] hover:text-blue-600 transition flex items-center gap-1 text-[11px]"
          title="Share to LinkedIn"
        >
          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
          <span className="hidden sm:inline">LinkedIn</span>
        </button>

        {/* Facebook */}
        <button
          onClick={shareOnFacebook}
          className="p-1.5 rounded hover:bg-[#ECE7DE] dark:hover:bg-[#1E293B] hover:text-blue-700 transition flex items-center gap-1 text-[11px]"
          title="Share to Facebook"
        >
          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
          </svg>
          <span className="hidden sm:inline">Facebook</span>
        </button>

        {/* Telegram */}
        <button
          onClick={shareOnTelegram}
          className="p-1.5 rounded hover:bg-[#ECE7DE] dark:hover:bg-[#1E293B] hover:text-sky-500 transition flex items-center gap-1 text-[11px]"
          title="Share to Telegram"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Telegram</span>
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
