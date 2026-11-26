import React from "react";
import { Metadata } from "next";

export const revalidate = 60;
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Home, Sparkles, Clock, CheckCircle2, Eye, ChevronRight } from "lucide-react";
import Footer from "@/components/Footer";
import ReaderCounter from "@/components/ReaderCounter";
import { SEED_ARTICLES } from "@/data/seedArticles";
import { ORIGINAL_ARTICLES } from "@/data/demoContent";
import CategoryFeed, { CategoryFeedArticle } from "./CategoryFeed";
import LiveCricketWidget from "@/components/LiveCricketWidget";

const CATEGORIES = [
  "health",
  "cricket",
  "markets",
  "tech",
  "india",
  "politics",
  "world",
  "sports",
  "festivals",
  "entertainment",
  "ramayana",
  "explainers",
];

const CATEGORY_TITLES: Record<string, { title: string; subtitle: string }> = {
  health: {
    title: "Health, Medicine & Climate",
    subtitle: "Atmospheric telemetry, public health infrastructure, and epidemiological research.",
  },
  cricket: {
    title: "Cricket & Live Match Centre",
    subtitle: "Official scorecards, BCCI & ICC announcements, squad updates, and verified tournament results.",
  },
  markets: {
    title: "Markets & Macroeconomics",
    subtitle: "Monetary policy, capital flows, corporate earnings, and Indian industrial expansion.",
  },
  tech: {
    title: "Frontier Tech & Artificial Intelligence",
    subtitle: "Semiconductor fabs, sovereign compute, AI deployments, and digital infrastructure.",
  },
  india: {
    title: "National Policy & Governance",
    subtitle: "Parliamentary gazettes, regional infrastructure corridors, and strategic developments.",
  },
  politics: {
    title: "Politics & National Affairs",
    subtitle: "Electoral accountability, state governance, administrative decisions, and policy reform.",
  },
  world: {
    title: "World Affairs & Global Diaspora",
    subtitle: "Geopolitics, trade corridors, immigration policy, and the 32-million Indian diaspora.",
  },
  sports: {
    title: "Sports & Athletics",
    subtitle: "Cricket diplomacy, Olympic federations, domestic leagues, and athletic governance.",
  },
  festivals: {
    title: "Festivals, Observances & Calendar",
    subtitle: "Advance editorial previews, gazetted dates, public ceremony timings, and regional traditions.",
  },
  entertainment: {
    title: "Culture, Cinema & Arts",
    subtitle: "Indian creative economy, streaming regulation, heritage preservation, and global cinema.",
  },
  ramayana: {
    title: "Civilizational Heritage & Ramayana",
    subtitle: "Archaeological history, sacred architecture, literary traditions, and classical heritage.",
  },
  explainers: {
    title: "Verified In-Depth Explainers",
    subtitle: "Why this matters, regulatory breakdowns, and step-by-step guides for citizens.",
  },
};

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({
    category: c,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const catKey = category.toLowerCase();
  const info = CATEGORY_TITLES[catKey] || {
    title: `${category.toUpperCase()} Wire`,
    subtitle: "Verified investigative reporting and macro analysis.",
  };
  const canonicalUrl = `https://zestfeedx.com/category/${catKey}/`;
  const seoTitle = `${info.title} | ZestFeedX`;

  return {
    title: seoTitle,
    description: info.subtitle,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoTitle,
      description: info.subtitle,
      url: canonicalUrl,
      siteName: "ZestFeedX",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: info.subtitle,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const catKey = category.toLowerCase();

  const isMatch = (artCat: string, targetCat: string) => {
    const a = (artCat || "").toLowerCase();
    const t = targetCat.toLowerCase();
    if (t === "cricket") return a === "cricket" || (a === "sports" && Boolean(a));
    if (t === "festivals") return a === "festivals" || a === "ramayana";
    if (t === "india" || t === "politics") return a === "india" || a === "politics";
    if (t === "markets" || t === "money" || t === "economy") return a === "markets" || a === "economy" || a === "money";
    if (t === "ramayana" || t === "culture") return a === "ramayana" || a === "culture" || a === "festivals";
    if (t === "entertainment" || t === "movies" || t === "arts") return a === "entertainment" || a === "movies" || a === "culture";
    if (t === "tech" || t === "ai") return a === "tech" || a === "ai";
    if (t === "health" || t === "climate") return a === "health" || a === "climate";
    if (t === "world" || t === "diaspora") return a === "world" || a === "diaspora";
    if (t === "explainers") return a === "explainers" || a === "analysis";
    return a === t;
  };

  // Pull matching original articles first
  const originals: CategoryFeedArticle[] = ORIGINAL_ARTICLES.filter((a) => isMatch(a.category, catKey)).map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    summary: a.deck,
    category: a.category,
    image_url: a.hero_image,
    author: a.author.name,
    read_time: `${a.reading_time_mins} min read`,
    language: "en",
    is_original: true,
    event_date: a.event_date,
    event_date_formatted: a.event_date_formatted,
    event_type: a.event_type,
    is_preview: a.is_preview,
    is_live_cricket: a.is_live_cricket,
    live_score: a.live_score,
    match_status: a.match_status,
  }));

  // Pull matching seed articles (freshest hourly dispatches)
  const seeds: CategoryFeedArticle[] = SEED_ARTICLES.filter((a) => isMatch(a.category, catKey)).map((a: any) => {
    const isHi = a.language === "hi" || /[\u0900-\u097F]/.test(a.title || "");
    return {
      id: a.id,
      slug: a.slug,
      title: isHi ? (a.title_hi || a.title) : (a.title_en || a.title),
      summary: isHi ? (a.summary_hi || a.summary) : (a.summary_en || a.summary),
      category: a.category,
      topic: a.topic || "",
      medical_reviewed: a.medical_reviewed || false,
      published_at: a.published_at,
      why_it_matters_today: a.why_it_matters_today,
      who_is_affected: a.who_is_affected,
      image_photographer: a.image_photographer,
      image_license: a.image_license,
      image_url: a.image_url,
      author: a.author_name || (isHi ? "वरिष्ठ डिजिटल संपादक" : "Pankhudi Sharma"),
      read_time: a.read_time,
      language: isHi ? "hi" : "en",
      is_original: false,
      event_date: a.event_date,
      event_date_formatted: a.event_date_formatted,
      event_type: a.event_type,
      is_preview: a.is_preview,
      is_live_cricket: a.is_live_cricket,
      live_score: a.live_score,
      match_status: a.match_status,
    };
  });

  // Sort strictly by actual ZestFeedX published_at timestamp descending
  const allArticles = [...seeds, ...originals].sort((a, b) => {
    const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
    const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
    return dateB - dateA;
  });

  if (allArticles.length === 0) {
    notFound();
  }

  const catMeta = CATEGORY_TITLES[catKey] || {
    title: catKey.toUpperCase(),
    subtitle: "Verified investigative reporting and macro analysis.",
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] dark:bg-[#080C16] text-[#0B1020] dark:text-[#F1F5F9] transition-colors">
      {/* Main Content */}
      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#525866] dark:text-[#94A3B8] mb-6">
            <Link href="/" className="hover:text-[#0B1020] dark:hover:text-white flex items-center gap-1">
              <Home className="w-3 h-3 text-[#FF5A1F]" /> Front Page
            </Link>
            <ChevronRight className="w-3 h-3 text-[#DDD7CD] dark:text-[#334155]" />
            <span className="font-bold text-[#FF5A1F] uppercase tracking-wider">{catMeta.title}</span>
          </nav>

          {/* Section Heading Banner */}
          <div className="border-b-2 border-[#0B1020] dark:border-[#F1F5F9] pb-5 mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-widest block mb-1">
                Verified Beat Coverage
              </span>
              <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#0B1020] dark:text-[#F1F5F9]">
                {catMeta.title}
              </h1>
              <p className="mt-2 text-sm text-[#525866] dark:text-[#94A3B8] max-w-2xl leading-relaxed">
                {catMeta.subtitle}
              </p>
            </div>
          </div>

          {/* Live Cricket Scoreboard Widget on Cricket & Sports Sections */}
          {(catKey === "cricket" || catKey === "sports") && <LiveCricketWidget />}

          {/* Interactive Category Feed with Language Separation */}
          <React.Suspense fallback={<div className="py-10 text-center text-sm text-[#94A3B8]">Loading dispatches...</div>}>
            <CategoryFeed articles={allArticles} categoryTitle={catMeta.title} />
          </React.Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
