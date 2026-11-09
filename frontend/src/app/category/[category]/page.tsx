import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Home, ShieldCheck, Clock, Eye, Sparkles } from "lucide-react";
import SidebarAd from "@/components/SidebarAd";
import SafeImage from "@/components/SafeImage";
import { SEED_ARTICLES } from "@/data/seedArticles";

const CATEGORIES = [
  "politics",
  "tech",
  "health",
  "world",
  "sports",
  "entertainment",
  "ramayana",
];

const CATEGORY_TITLES: { [key: string]: string } = {
  politics: "Politics & National Affairs",
  ramayana: "Ramayana & Cultural Heritage",
  health: "Health & Medical News",
  tech: "Frontier Tech & AI News",
  entertainment: "Movies & Entertainment",
  sports: "Sports & Athletics",
  world: "World & Global Diplomacy",
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
  const catName = CATEGORY_TITLES[category.toLowerCase()] || category;
  const canonicalUrl = `https://zestfeedx.com/category/${category.toLowerCase()}/`;
  const seoTitle = `${catName} | ZestFeedX`;
  const metaDesc = `Latest fact-checked investigative journalism and comprehensive long-form reports on ${catName} by Pankhudi Sharma.`;

  return {
    title: seoTitle,
    description: metaDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoTitle,
      description: metaDesc,
      url: canonicalUrl,
      siteName: "ZestFeedX",
      images: [
        {
          url: "https://zestfeedx.com/google-news/wide-logo-light.png",
          width: 600,
          height: 60,
          alt: `${catName} Wire - ZestFeedX`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: metaDesc,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const catKey = category.toLowerCase();

  const isMatch = (artCat: string, targetCat: string) => {
    const a = artCat.toLowerCase();
    const t = targetCat.toLowerCase();
    if (t === "politics" || t === "india") return a === "politics" || a === "india";
    if (t === "ramayana" || t === "culture") return a === "ramayana" || a === "culture";
    if (t === "entertainment" || t === "movies") return a === "entertainment" || a === "movies";
    if (t === "tech" || t === "ai") return a === "tech" || a === "ai";
    return a === t;
  };

  const articles = SEED_ARTICLES.filter((a) => isMatch(a.category, catKey));

  if (articles.length === 0) {
    notFound();
  }

  const categoryTitle = CATEGORY_TITLES[catKey] || catKey.toUpperCase();

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 font-sans p-0 m-0">
      {/* Top Reading Navigation */}
      <div className="bg-[#0b1224]/90 backdrop-blur-md border-b border-cyan-500/20 sticky top-0 z-30 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2 chromatic-text"
          >
            <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f0ff] animate-pulse" />
            ZESTFEEDX
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" /> Back to 3D Newsroom
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link href="/" className="hover:text-cyan-400 flex items-center gap-1 transition-colors">
            <Home className="w-3 h-3 text-cyan-400" /> Home
          </Link>
          <span>/</span>
          <span className="font-bold text-cyan-400 uppercase tracking-wider">{categoryTitle}</span>
        </nav>

        {/* Section Heading */}
        <div className="border-b border-cyan-500/20 pb-4 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              Category Beat Wire
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-black text-white tracking-tight">
              {categoryTitle}
            </h1>
          </div>
          <span className="text-xs font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 px-3.5 py-1.5 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            {articles.length} In-Depth Reports
          </span>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Link key={article.id} href={`/article/${article.slug}/`} className="block group">
                  <div className="p-4 bg-gradient-to-b from-[#11192e] to-[#0c1222] border border-cyan-500/30 hover:border-cyan-400 rounded-2xl shadow-xl hover:shadow-[0_12px_35px_-8px_rgba(6,182,212,0.35)] transition-all duration-300 h-full flex flex-col justify-between group-hover:scale-[1.02]">
                    <div>
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-900 mb-3 border border-slate-800 shadow-inner">
                        <SafeImage
                          src={article.image_url}
                          alt={article.image_alt || article.title}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                        <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md bg-slate-950/85 border border-white/20 shadow">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <h2 className="font-serif text-base font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {article.title_en || article.title}
                      </h2>
                      <p className="mt-2 text-xs text-slate-300/90 line-clamp-2 leading-relaxed">
                        {article.summary_en || article.summary}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span className="text-emerald-400 font-semibold">Pankhudi Sharma</span>
                      <span className="text-cyan-400">{article.read_time}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <SidebarAd />
          </aside>
        </div>
      </div>
    </div>
  );
}
