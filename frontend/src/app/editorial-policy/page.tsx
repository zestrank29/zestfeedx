import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldAlert, Award } from "lucide-react";

export const metadata = {
  title: "Editorial Policy & Code of Ethics | ZestFeedX",
  description: "Read the editorial guidelines, verification protocols, and journalistic standards governing ZestFeedX.",
};

export default function EditorialPolicyPage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans p-0 m-0">
      <div className="bg-[#0f172a] border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl sm:text-2xl font-black tracking-tight text-white uppercase flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-red-600 rounded-full" />
            ZESTFEEDX
          </Link>
          <Link href="/" className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="border-b border-slate-800 pb-3 mb-8">
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-1">
            Ethical Code & Reporting Principles
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-white">
            Editorial Policy & Standards
          </h1>
        </div>

        <div className="prose max-w-none text-slate-300 leading-relaxed space-y-6">
          <p className="text-lg font-serif text-slate-200">
            At <strong>ZestFeedX</strong>, journalistic integrity, factual precision, and editorial transparency govern every report we publish. Operating under the leadership of <strong>Pankhudi Sharma</strong> (Senior Digital Editor &amp; Investigative Journalist), our digital newsroom combines computational newsroom automation with strict broadsheet journalistic standards to deliver high-impact, verified reporting.
          </p>

          <h2 className="font-serif text-xl font-bold text-white border-b border-slate-800 pb-2 pt-4">
            1. Content Curation & Primary Source Verification
          </h2>
          <p>
            News topics are monitored in real time across official government gazettes, press bureaus (such as ANI, PTI, and PIB), and primary institutional communiqués. Before any dispatch is drafted, our editorial desk cross-references claims against at least two independent primary records to prevent synthetic fiction, misquotes, or speculative rumors.
          </p>

          <h2 className="font-serif text-xl font-bold text-white border-b border-slate-800 pb-2 pt-4">
            2. In-Depth Analysis & Original Value-Add (800+ Words)
          </h2>
          <p>
            ZestFeedX does not engage in shallow content aggregation or automated rewriting. Every published report is transformed into a comprehensive 800+ word deep-dive that includes:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
            <li><strong>Key Takeaways (Executive TL;DR):</strong> Immediate, high-clarity bullet summaries placed at the top of the article.</li>
            <li><strong>Factual Timeline &amp; Context:</strong> Verified developments, official notifications, and verified quotes.</li>
            <li><strong>"Why This Matters &amp; Strategic Impact":</strong> Independent analytical commentary examining long-term economic, legislative, and societal implications.</li>
            <li><strong>Structured Data:</strong> Comparative tables, metrics, and milestones for enhanced reader accessibility.</li>
          </ul>

          <h2 className="font-serif text-xl font-bold text-white border-b border-slate-800 pb-2 pt-4">
            3. Explicit Source Attribution & Fair Dealing
          </h2>
          <p>
            Every story published on ZestFeedX includes an explicit, prominent source citation block acknowledging the originating news agency or official publisher (formatted as: <em>"Story curated and adapted from [Source Name]. Read the original report here."</em>). All aggregation operates under Section 52(1)(a)(iii) of the Indian Copyright Act, 1957 for fair dealing, reporting of current events, and public commentary.
          </p>

          <h2 className="font-serif text-xl font-bold text-white border-b border-slate-800 pb-2 pt-4">
            4. Corrections & Accountability Policy
          </h2>
          <p>
            We take factual accuracy seriously. When an error or clarification is warranted, our editorial desk updates the story promptly with an explicit editor&apos;s note detailing the amendment. Readers, stakeholders, and newsroom peers may submit corrections directly to our editor at <a href="mailto:news@zestfeedx.com" className="text-red-400 underline font-semibold">news@zestfeedx.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
