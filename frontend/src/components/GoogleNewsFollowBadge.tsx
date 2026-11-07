import React from "react";

interface GoogleNewsFollowBadgeProps {
  variant?: "pill" | "banner" | "card";
  className?: string;
}

export default function GoogleNewsFollowBadge({
  variant = "pill",
  className = "",
}: GoogleNewsFollowBadgeProps) {
  const googleNewsUrl =
    "https://news.google.com/search?q=site%3Azestfeedx.com&hl=en-IN&gl=IN&ceid=IN%3Aen";

  if (variant === "card") {
    return (
      <div
        className={`p-4 bg-gradient-to-br from-[#0c162d] to-[#0f172a] border border-blue-900/60 rounded-xl shadow-lg ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 p-1.5 flex items-center justify-center shrink-0 border border-white/10">
            <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
              <path
                d="M40 8H8c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h32c2.2 0 4-1.8 4-4V12c0-2.2-1.8-4-4-4z"
                fill="#fff"
              />
              <path d="M12 18h14v12H12z" fill="#4285F4" />
              <path d="M28 18h8v3h-8z" fill="#EA4335" />
              <path d="M28 23h8v3h-8z" fill="#FBBC05" />
              <path d="M28 28h8v3h-8z" fill="#34A853" />
            </svg>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-0.5">
              Google Preferred Source
            </span>
            <h4 className="text-sm font-bold text-white leading-snug">
              Follow ZestFeedX on Google News
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Add ZestFeedX to your preferred news sources to get real-time investigative dispatches and alerts on your Google News app.
            </p>
          </div>
        </div>
        <a
          href={googleNewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3.5 inline-flex items-center justify-center w-full gap-2 px-3.5 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold rounded-lg transition-colors shadow-md cursor-pointer"
        >
          <span>⭐ Add to Google Preferred Sources</span>
        </a>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <a
        href={googleNewsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2.5 px-4 py-2 bg-[#0e172a] hover:bg-[#1e293b] border border-blue-500/40 hover:border-blue-400 rounded-lg transition-all text-xs text-slate-200 group ${className}`}
        title="Follow ZestFeedX on Google News"
      >
        <div className="w-5 h-5 shrink-0">
          <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
            <path
              d="M40 8H8c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h32c2.2 0 4-1.8 4-4V12c0-2.2-1.8-4-4-4z"
              fill="#fff"
            />
            <path d="M12 18h14v12H12z" fill="#4285F4" />
            <path d="M28 18h8v3h-8z" fill="#EA4335" />
            <path d="M28 23h8v3h-8z" fill="#FBBC05" />
            <path d="M28 28h8v3h-8z" fill="#34A853" />
          </svg>
        </div>
        <span className="font-semibold text-white group-hover:text-blue-300 transition-colors">
          Follow on Google News
        </span>
        <span className="text-[10px] bg-blue-950/90 text-blue-300 border border-blue-800 px-1.5 py-0.5 rounded font-bold">
          Preferred Source
        </span>
      </a>
    );
  }

  // Default "pill"
  return (
    <a
      href={googleNewsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/60 rounded text-[11px] font-medium text-slate-200 hover:text-white transition-all group ${className}`}
      title="Add ZestFeedX to Google Preferred Sources"
    >
      <div className="w-3.5 h-3.5 shrink-0">
        <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
          <path
            d="M40 8H8c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h32c2.2 0 4-1.8 4-4V12c0-2.2-1.8-4-4-4z"
            fill="#fff"
          />
          <path d="M12 18h14v12H12z" fill="#4285F4" />
          <path d="M28 18h8v3h-8z" fill="#EA4335" />
          <path d="M28 23h8v3h-8z" fill="#FBBC05" />
          <path d="M28 28h8v3h-8z" fill="#34A853" />
        </svg>
      </div>
      <span className="group-hover:text-blue-300 transition-colors">Google News</span>
      <span className="text-[9px] bg-blue-950 text-blue-400 border border-blue-800/80 px-1 py-0.2 rounded font-bold">
        Follow
      </span>
    </a>
  );
}

