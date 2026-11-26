"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw, ExternalLink, Trophy, Radio } from "lucide-react";

interface LiveCricketMatch {
  id: string;
  title: string;
  teamA: string;
  teamB: string;
  isLive: boolean;
  link: string;
}

export default function LiveCricketWidget({ compact = false }: { compact?: boolean }) {
  const [matches, setMatches] = useState<LiveCricketMatch[]>([]);
  const [liveCount, setLiveCount] = useState(0);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchScores = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch("/api/cricket/live", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches || []);
        setLiveCount(data.live_count || 0);
        setUpdatedAt(data.updated_at || new Date().toISOString());
      }
    } catch {
      // Keep previous state on transient network error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchScores();
    const timer = setInterval(() => fetchScores(false), 30000);
    return () => clearInterval(timer);
  }, [fetchScores]);

  const displayMatches = compact ? matches.slice(0, 4) : matches.slice(0, 9);

  if (!loading && matches.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Live Cricket Scoreboard"
      className={`rounded-xl border border-[#E8E4DC] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] shadow-2xs overflow-hidden ${
        compact ? "my-6 p-4" : "mb-8 p-5 sm:p-6"
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 mb-4 border-b border-[#E8E4DC] dark:border-[#1E293B]">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#D7263D] text-white">
            <Radio className="w-3 h-3 animate-pulse" />
            Live Cricket
          </span>
          <h2 className="font-display font-bold text-base sm:text-lg text-[#0B1020] dark:text-white flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-[#FF5A1F]" />
            {compact ? "Live Match Scoreboard" : `Live Cricket Score Feed (${liveCount} Active)`}
          </h2>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[#525866] dark:text-[#94A3B8]">
          {updatedAt && (
            <span>
              Updated{" "}
              {new Date(updatedAt).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </span>
          )}
          <button
            type="button"
            onClick={() => fetchScores(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[#E8E4DC] dark:border-[#1E293B] hover:border-[#FF5A1F] font-semibold text-[#0B1020] dark:text-white transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Matches Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-20 rounded-lg bg-[#FAF8F4] dark:bg-[#080C16] animate-pulse border border-[#E8E4DC] dark:border-[#1E293B]"
            />
          ))}
        </div>
      ) : (
        <div className={`grid grid-cols-1 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"} gap-3`}>
          {displayMatches.map((m) => (
            <a
              key={m.id}
              href={m.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3.5 rounded-lg bg-[#FAF8F4] dark:bg-[#080C16] border border-[#E8E4DC] dark:border-[#1E293B] hover:border-[#D7263D] transition-all flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    m.isLive
                      ? "bg-red-500/15 text-[#D7263D] dark:text-red-400"
                      : "bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {m.isLive && <span className="w-1.5 h-1.5 rounded-full bg-[#D7263D] animate-ping" />}
                  {m.isLive ? "LIVE" : "MATCH"}
                </span>
                <ExternalLink className="w-3 h-3 text-[#525866] group-hover:text-[#D7263D] transition-colors" />
              </div>

              <div className="space-y-1 text-xs font-semibold text-[#0B1020] dark:text-[#F1F5F9]">
                <div className="leading-snug">{m.teamA}</div>
                {m.teamB && (
                  <div className="leading-snug text-[#525866] dark:text-[#CBD5E1]">
                    vs {m.teamB}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
