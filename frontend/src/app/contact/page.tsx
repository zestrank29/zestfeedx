import React from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, AlertCircle, UserCheck } from "lucide-react";

export const metadata = {
  title: "Contact Us & Editorial Bureaus | ZestFeedX",
  description: "Contact the editorial board, press grievance officer, and strategy team of ZestFeedX at news@zestfeedx.com.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans p-0 m-0">
      {/* Top Reading Navigation */}
      <div className="bg-[#0f172a] border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 bg-red-600 rounded-full" />
            ZESTFEEDX
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="border-b border-slate-800 pb-3 mb-8">
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-1">
            Editorial Directory & Grievance Redressal
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-white">
            Contact ZestFeedX
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Editorial Office */}
          <div className="p-6 sm:p-8 bg-[#0f172a] border border-slate-800 rounded-xl shadow-xl">
            <h2 className="font-serif font-bold text-xl text-white mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" /> Digital Media Headquarters
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              ZestFeedX Digital Media<br />
              Lead Editor & Author: <a href="https://zestfeedx.com/about" className="text-white hover:text-red-400 underline">Pankhudi Sharma</a><br />
              Cloud Editorial Network & National Dispatch
            </p>
            <div className="space-y-3 text-sm text-slate-300">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-white">General & Press Desk:</span>{" "}
                <a href="mailto:news@zestfeedx.com" className="text-emerald-400 hover:underline">
                  news@zestfeedx.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-white">Editorial Lead:</span>{" "}
                <a href="https://zestfeedx.com/about" className="text-white hover:text-red-400 underline">
                  Pankhudi Sharma
                </a>
              </p>
            </div>
          </div>

          {/* Grievance & Compliance */}
          <div className="p-6 sm:p-8 bg-[#0f172a] border border-slate-800 rounded-xl shadow-xl">
            <h2 className="font-serif font-bold text-xl text-white mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" /> Grievance & Fact-Check Redressal
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              In compliance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, all inquiries and factual corrections are addressed by our compliance desk.
            </p>
            <div className="space-y-3 text-sm text-slate-300">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-white">Grievance Officer:</span>{" "}
                <a href="mailto:news@zestfeedx.com" className="text-emerald-400 hover:underline">
                  news@zestfeedx.com
                </a>
              </p>
              <p className="text-xs text-slate-400">
                Official Response SLA: 24 to 48 business hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
