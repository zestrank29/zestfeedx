"use client";

import React, { useState } from "react";
import { Mail, Check, ArrowRight } from "lucide-react";

export default function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubscribed(true);
    }
  };

  return (
    <section id="newsletter" className="py-12 bg-[#FAF8F4] dark:bg-[#080C16]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B1020] text-white rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-md">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#FF5A1F]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#FF5A1F] text-[10px] font-bold uppercase tracking-widest mb-3">
              <Mail className="w-3 h-3" />
              Daily Morning Intelligence
            </span>

            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              The ZestFeedX Dispatch
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Essential macro trends, policy movements, and technological shifts across India and the diaspora. Delivered every morning at 07:00 IST. Strictly zero spam.
            </p>

            {subscribed ? (
              <div className="flex items-center justify-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-lg text-xs font-semibold">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>You are subscribed to The Dispatch. Check your inbox for confirmation.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-[#FF5A1F]"
                />
                <button
                  type="submit"
                  className="bg-[#FF5A1F] hover:bg-[#e04e17] text-white px-5 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 shrink-0"
                >
                  <span>Subscribe Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <span>Presented with support from</span>
              <span className="font-semibold text-slate-200">ZestFeedX Corporate Partners</span>
              <span>•</span>
              <a href="/privacy-policy" className="underline hover:text-white">
                DPDP 2023 Compliant
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
