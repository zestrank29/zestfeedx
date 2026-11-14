"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone, Send, CheckCircle2, AlertCircle } from "lucide-react";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "editorial",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] dark:bg-[#080C16] text-[#0B1020] dark:text-[#F1F5F9] transition-colors">
      <header className="border-b border-[#E8E4DC] dark:border-[#1E293B] sticky top-0 z-30 bg-[#FAF8F4]/95 dark:bg-[#080C16]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-bold tracking-tight text-[#0B1020] dark:text-[#F1F5F9]">
            ZestFeed<span className="text-[#FF5A1F] italic font-serif">X</span>
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold text-[#525866] dark:text-[#94A3B8] hover:text-[#FF5A1F] flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Front Page
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b-2 border-[#0B1020] dark:border-[#F1F5F9] pb-4 mb-8">
            <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-widest block mb-1">
              Editorial Bureau & Public Directory
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
              Contact the Newsroom
            </h1>
            <p className="mt-2 text-base text-[#525866] dark:text-[#94A3B8] max-w-2xl">
              Connect with our reporters, submit factual tips, report corrections, or inquire about institutional partnerships.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Department Directory (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 bg-white dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl space-y-4">
                <h3 className="font-display text-base font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                  Newsroom Directory
                </h3>

                <div className="space-y-3 text-xs text-[#525866] dark:text-[#94A3B8]">
                  <div>
                    <span className="font-semibold text-[#0B1020] dark:text-[#F1F5F9] block">Editorial Inquiries & News Desk</span>
                    <a href="mailto:editorial@zestfeedx.com" className="text-[#FF5A1F] font-mono hover:underline">
                      editorial@zestfeedx.com
                    </a>
                  </div>

                  <div>
                    <span className="font-semibold text-[#0B1020] dark:text-[#F1F5F9] block">Fact-Checking & Corrections</span>
                    <a href="mailto:corrections@zestfeedx.com" className="text-[#0E7C86] font-mono hover:underline">
                      corrections@zestfeedx.com
                    </a>
                  </div>

                  <div>
                    <span className="font-semibold text-[#0B1020] dark:text-[#F1F5F9] block">Press Releases & Official Statements</span>
                    <a href="mailto:press@zestfeedx.com" className="font-mono text-[#525866] dark:text-[#94A3B8] hover:underline">
                      press@zestfeedx.com
                    </a>
                  </div>

                  <div>
                    <span className="font-semibold text-[#0B1020] dark:text-[#F1F5F9] block">Commercial Advertising & Sponsored Posts</span>
                    <a href="mailto:ads@zestfeedx.com" className="text-[#FF5A1F] font-mono hover:underline">
                      ads@zestfeedx.com
                    </a>
                  </div>

                  <div>
                    <span className="font-semibold text-[#0B1020] dark:text-[#F1F5F9] block">Data Protection Officer (DPDP Act)</span>
                    <a href="mailto:dpo@zestfeedx.com" className="font-mono text-[#525866] dark:text-[#94A3B8] hover:underline">
                      dpo@zestfeedx.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Physical Office Address */}
              <div className="p-6 bg-white dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl space-y-3 text-xs">
                <h3 className="font-display text-base font-bold text-[#0B1020] dark:text-[#F1F5F9] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FF5A1F]" /> Central Bureau Location
                </h3>
                <p className="text-[#525866] dark:text-[#94A3B8] leading-relaxed">
                  <strong>ZestFeedX Digital Media Pvt Ltd</strong><br />
                  Statesman House, Barakhamba Road<br />
                  Connaught Place, New Delhi 110001<br />
                  National Capital Territory of Delhi, India
                </p>
                <p className="text-[11px] text-[#94A3B8] font-mono">
                  Operational Hours: Monday - Friday, 08:00 - 20:00 IST
                </p>
              </div>
            </div>

            {/* Right: Interactive Contact Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 bg-white dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl shadow-xs">
                {isSubmitted ? (
                  <div className="text-center py-10 space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h3 className="font-display text-xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                      Message Dispatched to Editorial Desk
                    </h3>
                    <p className="text-xs text-[#525866] dark:text-[#94A3B8] max-w-md mx-auto">
                      Thank you for contacting ZestFeedX. Your inquiry has been routed to the relevant desk. A member of our editorial staff will respond within 24 business hours.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="mt-4 px-4 py-2 rounded text-xs font-semibold bg-[#FF5A1F] text-white"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-display text-lg font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-3">
                      Dispatch an Inquiry
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Vikramaditya Rathore"
                          className="w-full bg-[#FAF8F4] dark:bg-[#080C16] border border-[#DDD7CD] dark:border-[#1E293B] rounded-lg px-3 py-2 text-xs focus:border-[#FF5A1F] outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="vikram@example.com"
                          className="w-full bg-[#FAF8F4] dark:bg-[#080C16] border border-[#DDD7CD] dark:border-[#1E293B] rounded-lg px-3 py-2 text-xs focus:border-[#FF5A1F] outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-1">
                          Target Desk *
                        </label>
                        <select
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          className="w-full bg-[#FAF8F4] dark:bg-[#080C16] border border-[#DDD7CD] dark:border-[#1E293B] rounded-lg px-3 py-2 text-xs focus:border-[#FF5A1F] outline-hidden"
                        >
                          <option value="editorial">Editorial Desk / Tips</option>
                          <option value="corrections">Corrections & Fact Check</option>
                          <option value="advertising">Commercial & Sponsored Ads</option>
                          <option value="privacy">Privacy & DPDP Officer</option>
                          <option value="syndication">Syndication & Rights</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-1">
                          Subject *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="Brief topic summary"
                          className="w-full bg-[#FAF8F4] dark:bg-[#080C16] border border-[#DDD7CD] dark:border-[#1E293B] rounded-lg px-3 py-2 text-xs focus:border-[#FF5A1F] outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-1">
                        Message / Tip Details *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Provide relevant facts, dates, links, or documentation..."
                        className="w-full bg-[#FAF8F4] dark:bg-[#080C16] border border-[#DDD7CD] dark:border-[#1E293B] rounded-lg p-3 text-xs focus:border-[#FF5A1F] outline-hidden"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#0B1020] dark:bg-[#F1F5F9] text-white dark:text-[#0B1020] hover:bg-[#FF5A1F] dark:hover:bg-[#FF5A1F] dark:hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Message</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
