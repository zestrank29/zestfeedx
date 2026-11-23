"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone, Send, CheckCircle2, AlertCircle } from "lucide-react";
import Footer from "@/components/Footer";

export default function ContactContent() {
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Information Cards */}
            <div className="space-y-4">
              <div className="p-5 rounded-xl border border-[#E8E4DC] dark:border-[#1E293B] bg-white dark:bg-[#0F172A]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-[#FF5A1F]/10 text-[#FF5A1F]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm">Editorial Bureau</h3>
                </div>
                <p className="text-xs text-[#525866] dark:text-[#94A3B8] leading-relaxed">
                  ZestFeedX Digital Newsroom<br />
                  Barakhamba Road, Connaught Place<br />
                  New Delhi 110001, India
                </p>
              </div>

              <div className="p-5 rounded-xl border border-[#E8E4DC] dark:border-[#1E293B] bg-white dark:bg-[#0F172A]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-[#0E7C86]/10 text-[#0E7C86]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm">Direct Desks</h3>
                </div>
                <div className="space-y-1.5 text-xs text-[#525866] dark:text-[#94A3B8]">
                  <p><span className="font-medium text-[#0B1020] dark:text-[#F1F5F9]">Newsroom Tips:</span> news@zestfeedx.com</p>
                  <p><span className="font-medium text-[#0B1020] dark:text-[#F1F5F9]">Corrections:</span> corrections@zestfeedx.com</p>
                  <p><span className="font-medium text-[#0B1020] dark:text-[#F1F5F9]">Partnerships:</span> ads@zestfeedx.com</p>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-[#E8E4DC] dark:border-[#1E293B] bg-white dark:bg-[#0F172A]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm">Operational Hours</h3>
                </div>
                <p className="text-xs text-[#525866] dark:text-[#94A3B8] leading-relaxed">
                  Monday – Friday: 08:30 – 21:00 IST<br />
                  Weekend Wire: 09:00 – 18:00 IST<br />
                  <span className="text-[10px] text-[#94A3B8] block mt-1">24x7 automated verified wire ingest</span>
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <div className="p-6 sm:p-8 rounded-xl border border-[#E8E4DC] dark:border-[#1E293B] bg-white dark:bg-[#0F172A]">
                {isSubmitted ? (
                  <div className="py-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 mb-4">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h2 className="font-display text-xl font-bold mb-2">Transmission Received</h2>
                    <p className="text-sm text-[#525866] dark:text-[#94A3B8] max-w-md mx-auto">
                      Thank you for contacting ZestFeedX. Your inquiry has been routed to the respective desk editor. Typical review response is within 4 business hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-[#0B1020] dark:text-[#F1F5F9]">
                        Full Name / Organization
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rohini Sen / Reuters Partner Desk"
                        className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#E8E4DC] dark:border-[#1E293B] bg-[#FAF8F4] dark:bg-[#080C16] focus:outline-hidden focus:border-[#FF5A1F]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-[#0B1020] dark:text-[#F1F5F9]">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="reporter@example.com"
                          className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#E8E4DC] dark:border-[#1E293B] bg-[#FAF8F4] dark:bg-[#080C16] focus:outline-hidden focus:border-[#FF5A1F]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1 text-[#0B1020] dark:text-[#F1F5F9]">
                          Target Desk
                        </label>
                        <select
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#E8E4DC] dark:border-[#1E293B] bg-[#FAF8F4] dark:bg-[#080C16] focus:outline-hidden focus:border-[#FF5A1F]"
                        >
                          <option value="editorial">Editorial Desk (Tips & Pitches)</option>
                          <option value="corrections">Corrections & Fact Verification</option>
                          <option value="advertising">Commercial & Sponsorships</option>
                          <option value="legal">Legal & Grievance Officer</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1 text-[#0B1020] dark:text-[#F1F5F9]">
                        Subject
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Brief summary of matter"
                        className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#E8E4DC] dark:border-[#1E293B] bg-[#FAF8F4] dark:bg-[#080C16] focus:outline-hidden focus:border-[#FF5A1F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1 text-[#0B1020] dark:text-[#F1F5F9]">
                        Message Details
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Provide primary documentation links, details or tip specifics..."
                        className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#E8E4DC] dark:border-[#1E293B] bg-[#FAF8F4] dark:bg-[#080C16] focus:outline-hidden focus:border-[#FF5A1F]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-[#0B1020] dark:bg-[#F1F5F9] text-white dark:text-[#0B1020] font-semibold text-xs rounded-lg hover:bg-[#FF5A1F] dark:hover:bg-[#FF5A1F] dark:hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Message to Newsroom Desk</span>
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
