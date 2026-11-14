import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Home, Sparkles, Clock, CheckCircle2, Eye, ChevronRight } from "lucide-react";
import Footer from "@/components/Footer";
import ReaderCounter from "@/components/ReaderCounter";
import { SEED_ARTICLES } from "@/data/seedArticles";
import { ORIGINAL_ARTICLES } from "@/data/demoContent";

const CATEGORIES = [
  "markets",
  "tech",
  "india",
  "politics",
  "world",
  "health",
  "sports",
  "entertainment",
  "ramayana",
  "explainers",
];

const CATEGORY_TITLES: Record<string, { title: string; subtitle: string }> = {
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
  health: {
    title: "Health, Medicine & Climate",
    subtitle: "Atmospheric telemetry, public health infrastructure, and epidemiological research.",
  },
  sports: {
    title: "Sports & Athletics",
    subtitle: "Cricket diplomacy, Olympic federations, domestic leagues, and athletic governance.",
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
    if (t === "india" || t === "politics") return a === "india" || a === "politics";
    if (t === "markets" || t === "money" || t === "economy") return a === "markets" || a === "economy" || a === "money";
    if (t === "ramayana" || t === "culture") return a === "ramayana" || a === "culture";
    if (t === "entertainment" || t === "movies" || t === "arts") return a === "entertainment" || a === "movies" || a === "culture";
    if (t === "tech" || t === "ai") return a === "tech" || a === "ai";
    if (t === "health" || t === "climate") return a === "health" || a === "climate";
    if (t === "world" || t === "diaspora") return a === "world" || a === "diaspora";
    if (t === "explainers") return a === "explainers" || a === "analysis";
    return a === t;
  };

  // Pull matching original articles first
  const originals = ORIGINAL_ARTICLES.filter((a) => isMatch(a.category, catKey)).map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    summary: a.deck,
    category: a.category,
    image_url: a.hero_image,
    author: a.author.name,
    read_time: `${a.reading_time_mins} min read`,
    is_original: true,
  }));

  // Pull matching seed articles
  const seeds = SEED_ARTICLES.filter((a) => isMatch(a.category, catKey)).map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title_en || a.title,
    summary: a.summary_en || a.summary,
    category: a.category,
    image_url: a.image_url,
    author: "Pankhudi Sharma",
    read_time: a.read_time,
    is_original: false,
  }));

  const allArticles = [...originals, ...seeds];

  if (allArticles.length === 0) {
    notFound();
  }

  const catMeta = CATEGORY_TITLES[catKey] || {
    title: catKey.toUpperCase(),
    subtitle: "Verified investigative reporting and macro analysis.",
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] dark:bg-[#080C16] text-[#0B1020] dark:text-[#F1F5F9] transition-colors">
      {/* Top Header */}
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
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#0E7C86]/10 text-[#0E7C86] dark:bg-[#0E7C86]/20 dark:text-[#2DD4BF] border border-[#0E7C86]/30">
                {allArticles.length} Verified Reports
              </span>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allArticles.map((article) => (
              <article
                key={article.id}
                className="group bg-white dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] hover:border-[#FF5A1F] rounded-xl overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-300"
              >
                <div>
                  <Link
                    href={`/article/${article.slug}/`}
                    className="relative w-full aspect-16/10 block overflow-hidden bg-[#ECE7DE] dark:bg-[#1E293B]"
                  >
                    <Image
                      src={article.image_url}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md backdrop-blur-md bg-[#0B1020]/80 text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
                      <span>{article.category}</span>
                    </div>
                  </Link>

                  <div className="p-5">
                    <div className="flex items-center justify-between text-[11px] text-[#525866] dark:text-[#94A3B8] mb-2">
                      <span className="font-semibold text-[#0E7C86]">{article.read_time}</span>
                      <ReaderCounter slug={article.slug} compact={true} />
                    </div>

                    <Link href={`/article/${article.slug}/`} className="block">
                      <h2 className="font-display text-lg font-bold text-[#0B1020] dark:text-[#F1F5F9] leading-snug group-hover:text-[#FF5A1F] transition-colors line-clamp-2">
                        {article.title}
                      </h2>
                    </Link>

                    <p className="mt-2.5 text-xs text-[#525866] dark:text-[#94A3B8] line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-[#F0ECE1] dark:border-[#1E293B] flex items-center justify-between text-xs">
                  <span className="font-medium text-[#0B1020] dark:text-[#F1F5F9]">
                    By {article.author}
                  </span>
                  <Link
                    href={`/article/${article.slug}/`}
                    className="text-[#FF5A1F] font-semibold text-xs flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Read Full News</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
