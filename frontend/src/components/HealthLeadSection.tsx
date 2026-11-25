import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  ShieldCheck,
  ChevronRight,
  Clock,
  CheckCircle2,
  Wind,
  Heart,
  Apple,
  Users,
  AlertCircle,
  FileText,
  Sparkles,
} from "lucide-react";
import { OriginalArticle } from "@/data/demoContent";
import { formatRelativeTimeIST } from "@/lib/utils";

interface HealthLeadSectionProps {
  articles: OriginalArticle[];
  currentLanguage: "en" | "hi";
}

const HEALTH_TOPICS = [
  { id: "all", label: "All Health", label_hi: "सभी स्वास्थ्य", href: "/category/health/" },
  { id: "air-pollution", label: "Air Pollution & AQI", label_hi: "वायु प्रदूषण एवं AQI", href: "/topic/delhi-aqi/" },
  { id: "seasonal-illnesses", label: "Seasonal Illnesses", label_hi: "मौसमी बीमारियां (डेंगू/मलेरिया)", href: "/category/health/?topic=seasonal-illnesses" },
  { id: "diabetes", label: "Diabetes & Metabolic", label_hi: "डायबिटीज एवं मेटाबॉलिक", href: "/category/health/?topic=diabetes" },
  { id: "heart-health", label: "Heart Health", label_hi: "हृदय स्वास्थ्य", href: "/category/health/?topic=heart-health" },
  { id: "mental-health", label: "Mental Health", label_hi: "मानसिक स्वास्थ्य", href: "/category/health/?topic=mental-health" },
  { id: "nutrition", label: "Nutrition & Food Safety", label_hi: "पोषण एवं खाद्य सुरक्षा", href: "/category/health/?topic=nutrition" },
  { id: "womens-health", label: "Women's Health", label_hi: "महिला स्वास्थ्य", href: "/category/health/?topic=womens-health" },
  { id: "public-health", label: "Public Health Policy", label_hi: "सार्वजनिक स्वास्थ्य नीतियां", href: "/category/health/?topic=public-health" },
];

export default function HealthLeadSection({
  articles,
  currentLanguage,
}: HealthLeadSectionProps) {
  const isHindi = currentLanguage === "hi";

  // Filter health articles
  const healthArticles = articles.filter(
    (a) => a.category === "health" || (a.tags && a.tags.some((t: string) => t.toLowerCase().includes("health")))
  );

  const leadHealth = healthArticles[0];
  const companionHealth = healthArticles.slice(1, 4);

  if (!leadHealth) return null;

  return (
    <section className="py-10 bg-[#FAF8F4] dark:bg-[#060911] border-b border-[#E8E4DC] dark:border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-[#E8E4DC] dark:border-[#1E293B]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0E7C86]/10 text-[#0E7C86] dark:bg-[#0E7C86]/20 dark:text-[#2DD4BF] border border-[#0E7C86]/30">
                <Activity className="w-3.5 h-3.5" />
                {isHindi ? "लीड श्रेणी: स्वास्थ्य एवं चिकित्सा" : "Lead Category: Health & Medicine Bureau"}
              </span>
              <span className="text-xs text-[#525866] dark:text-[#94A3B8] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {isHindi ? "ICMR एवं MoHFW द्वारा सत्यापित" : "ICMR & MoHFW Verified"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1020] dark:text-white">
              {isHindi ? "प्राथमिक स्वास्थ्य अन्वेषण एवं चिकित्सा टेलीमेट्री" : "Priority Health Investigations & Clinical Telemetry"}
            </h2>
            <p className="text-xs sm:text-sm text-[#525866] dark:text-[#94A3B8] mt-1 max-w-2xl">
              {isHindi
                ? "प्रमाण-आधारित चिकित्सा रिपोर्टिंग, आईसीएमआर अध्ययन, वायु गुणवत्ता एवं संचारी रोगों पर विशेष कवरेज।"
                : "Evidence-based clinical reporting, atmospheric pollution telemetry, ICMR research breakthroughs, and public health advisories."}
            </p>
          </div>

          <Link
            href="/category/health/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E7C86] hover:text-[#0E7C86]/80 transition-colors"
          >
            <span>{isHindi ? "पूरा स्वास्थ्य बुलेटिन देखें" : "View All Health Dispatches"}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Crawlable Topic Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {HEALTH_TOPICS.map((topic) => (
            <Link
              key={topic.id}
              href={topic.href}
              className={`shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all ${
                topic.id === "all"
                  ? "bg-[#0E7C86] text-white border-[#0E7C86] shadow-2xs font-semibold"
                  : "bg-white dark:bg-[#0F172A] text-[#525866] dark:text-[#94A3B8] border-[#E8E4DC] dark:border-[#1E293B] hover:border-[#0E7C86] hover:text-[#0E7C86]"
              }`}
            >
              {isHindi ? topic.label_hi : topic.label}
            </Link>
          ))}
        </div>

        {/* Lead Health Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Lead Card (7 Cols) */}
          <article className="lg:col-span-7 bg-white dark:bg-[#0F172A] rounded-xl border border-[#E8E4DC] dark:border-[#1E293B] overflow-hidden shadow-2xs hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div>
              <Link
                href={`/article/${leadHealth.slug}/`}
                className="relative block w-full aspect-16/9 overflow-hidden bg-[#ECE7DE] dark:bg-[#1E293B]"
              >
                <Image
                  src={leadHealth.hero_image}
                  alt={leadHealth.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span className="bg-[#0E7C86] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-xs">
                    Lead Health Investigation
                  </span>
                  {leadHealth.medical_reviewed && (
                    <span className="bg-emerald-600/95 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded shadow-xs flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Clinically Reviewed
                    </span>
                  )}
                </div>
              </Link>

              <div className="p-6">
                <div className="flex items-center gap-2 text-[11px] text-[#525866] dark:text-[#94A3B8] mb-2 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatRelativeTimeIST(leadHealth.published_at)}</span>
                  <span>•</span>
                  <span className="text-[#0E7C86] font-semibold">
                    {leadHealth.citations?.[0]?.publisher || "MoHFW / ICMR Verified"}
                  </span>
                </div>

                <Link href={`/article/${leadHealth.slug}/`}>
                  <h3 className="font-serif text-2xl font-bold text-[#0B1020] dark:text-white leading-tight group-hover:text-[#0E7C86] transition-colors">
                    {isHindi && leadHealth.title_hi ? leadHealth.title_hi : leadHealth.title}
                  </h3>
                </Link>

                <p className="mt-2.5 text-sm text-[#525866] dark:text-[#94A3B8] leading-relaxed line-clamp-3">
                  {isHindi && leadHealth.deck_hi ? leadHealth.deck_hi : leadHealth.deck}
                </p>

                {/* Reader-Focused Strategic Callouts */}
                <div className="mt-4 p-3.5 rounded-lg bg-[#FAF8F4] dark:bg-[#080C16] border border-[#E8E4DC] dark:border-[#1E293B] space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-[#0E7C86] shrink-0">Why It Matters Today:</span>
                    <span className="text-[#0B1020] dark:text-[#E2E8F0]">
                      {leadHealth.why_it_matters_today || leadHealth.why_it_matters || "Direct clinical and statutory implications for citizen health."}
                    </span>
                  </div>
                  {leadHealth.who_is_affected && (
                    <div className="flex items-start gap-2 pt-1 border-t border-[#E8E4DC] dark:border-[#1E293B]">
                      <span className="font-bold text-[#FF5A1F] shrink-0">Who Is Affected:</span>
                      <span className="text-[#0B1020] dark:text-[#E2E8F0]">{leadHealth.who_is_affected}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F4] dark:bg-[#080C16] border-t border-[#E8E4DC] dark:border-[#1E293B] flex items-center justify-between text-xs">
              <span className="font-medium text-[#525866] dark:text-[#94A3B8]">
                By {leadHealth.author.name}
              </span>
              <Link
                href={`/article/${leadHealth.slug}/`}
                className="font-bold text-[#0E7C86] inline-flex items-center gap-1 hover:underline"
              >
                <span>Read Full Clinical Dispatch</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </article>

          {/* Right Column: 3 Companion Health Stories (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#525866] dark:text-[#94A3B8] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0E7C86]" />
              Latest Health & Clinical Wire
            </h4>

            {companionHealth.map((item) => (
              <article
                key={item.id}
                className="p-4 bg-white dark:bg-[#0F172A] rounded-xl border border-[#E8E4DC] dark:border-[#1E293B] hover:border-[#0E7C86] transition-all flex gap-4 group"
              >
                <Link
                  href={`/article/${item.slug}/`}
                  className="relative w-28 h-24 shrink-0 rounded-lg overflow-hidden bg-[#ECE7DE] dark:bg-[#1E293B]"
                >
                  <Image
                    src={item.hero_image}
                    alt={item.title}
                    fill
                    sizes="112px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[10px] text-[#525866] dark:text-[#94A3B8] mb-1 font-mono">
                    <span>{formatRelativeTimeIST(item.published_at)}</span>
                    {item.medical_reviewed && (
                      <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        Reviewed
                      </span>
                    )}
                  </div>

                  <Link href={`/article/${item.slug}/`}>
                    <h5 className="font-serif text-sm font-bold text-[#0B1020] dark:text-white leading-snug group-hover:text-[#0E7C86] transition-colors line-clamp-2">
                      {isHindi && item.title_hi ? item.title_hi : item.title}
                    </h5>
                  </Link>

                  <p className="text-[11px] text-[#525866] dark:text-[#94A3B8] mt-1 line-clamp-2 leading-relaxed">
                    {isHindi && item.deck_hi ? item.deck_hi : item.deck}
                  </p>
                </div>
              </article>
            ))}

            {/* Live Delhi AQI Fast Pill */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-teal-900/10 to-emerald-900/10 border border-[#0E7C86]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0E7C86]/20 flex items-center justify-center text-[#0E7C86]">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <h6 className="text-xs font-bold text-[#0B1020] dark:text-white">
                    Live Delhi NCR AQI Tracker
                  </h6>
                  <p className="text-[10px] text-[#525866] dark:text-[#94A3B8]">
                    Real-time CPCB telemetry across Anand Vihar, IGI & NCR
                  </p>
                </div>
              </div>
              <Link
                href="/topic/delhi-aqi/"
                className="px-3 py-1.5 rounded-lg bg-[#0E7C86] text-white text-[11px] font-bold hover:bg-[#0E7C86]/90 transition-colors shadow-2xs"
              >
                View AQI
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
