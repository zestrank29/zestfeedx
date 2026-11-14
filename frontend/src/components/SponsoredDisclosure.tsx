"use client";

import React from "react";
import { Info, ShieldCheck, ExternalLink } from "lucide-react";

interface SponsoredDisclosureProps {
  sponsorName: string;
  sponsorUrl?: string;
  isGuestPost?: boolean;
}

export default function SponsoredDisclosure({
  sponsorName,
  sponsorUrl,
  isGuestPost = false,
}: SponsoredDisclosureProps) {
  return (
    <aside
      aria-label="Commercial Content Disclosure"
      className="my-6 p-4 sm:p-5 bg-[#FAF8F4] dark:bg-[#0F172A] border-l-4 border-amber-500 rounded-r-lg text-xs text-[#525866] dark:text-[#94A3B8] shadow-2xs"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 font-mono text-[10px]">
          <Info className="w-3.5 h-3.5" />
          <span>{isGuestPost ? "Guest Contributor Disclosure" : "Sponsored Editorial Content"}</span>
        </div>
        <span className="text-[10px] font-mono text-[#94A3B8]">
          ASCI & Google Search Compliant
        </span>
      </div>

      <p className="leading-relaxed text-[11px] sm:text-xs">
        {isGuestPost ? (
          <>
            This article was contributed by an external author and approved by the ZestFeedX Editorial Desk. All commercial references carry strict{" "}
            <code className="text-[10px] font-mono bg-white dark:bg-black/30 px-1 py-0.5 rounded border border-[#E8E4DC] dark:border-[#334155]">
              rel=&quot;sponsored nofollow&quot;
            </code>{" "}
            attributes in full compliance with Google Webmaster and ASCI guidelines.
          </>
        ) : (
          <>
            This feature was published in commercial partnership with{" "}
            {sponsorUrl ? (
              <a
                href={sponsorUrl}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="font-bold text-[#0B1020] dark:text-[#F1F5F9] underline decoration-amber-500 underline-offset-2 hover:text-[#FF5A1F]"
              >
                {sponsorName}
              </a>
            ) : (
              <strong className="text-[#0B1020] dark:text-[#F1F5F9]">{sponsorName}</strong>
            )}
            . ZestFeedX maintains strict editorial guidelines: advertisers do not direct final factual reporting or investigative findings.
          </>
        )}
      </p>
    </aside>
  );
}
