"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BreakingStrip from "@/components/BreakingStrip";
import HeroGrid from "@/components/HeroGrid";
import AdSlot from "@/components/AdSlot";
import MorningBriefCard from "@/components/MorningBriefCard";
import VerticalSection from "@/components/VerticalSection";
import ExplainerCarousel from "@/components/ExplainerCarousel";
import NewsletterBanner from "@/components/NewsletterBanner";
import Footer from "@/components/Footer";
import ReaderCounter from "@/components/ReaderCounter";
import { Globe, Clock, CheckCircle2, Eye, Flame, ChevronRight, Sparkles } from "lucide-react";
import { formatRelativeTimeIST } from "@/lib/utils";

import {
  ORIGINAL_ARTICLES,
  CURATED_BRIEFS,
  OriginalArticle,
  CuratedBrief,
} from "@/data/demoContent";
import { SEED_ARTICLES } from "@/data/seedArticles";

function seedToOriginalArticle(art: any): OriginalArticle {
  const isHi = art.language === "hi" || /[\u0900-\u097F]/.test(art.title || "");
  const cat = (art.category || "india").toLowerCase();
  const validCat = ["markets", "tech", "india", "world", "sports", "entertainment", "health", "explainers"].includes(cat)
    ? cat
    : cat === "politics" ? "india" : "markets";

  return {
    id: `seed-${art.id}`,
    slug: art.slug,
    language: isHi ? "hi" : "en",
    title: isHi ? (art.title_hi || art.title) : (art.title_en || art.title),
    title_hi: art.title_hi || art.title,
    deck: isHi ? (art.summary_hi || art.summary || "") : (art.summary_en || art.summary || ""),
    deck_hi: art.summary_hi || art.summary || "",
    category: validCat as any,
    author: {
      id: "pankhudi-sharma",
      name: art.author_name || "Pankhudi Sharma",
      slug: "pankhudi-sharma",
      role: isHi ? "वरिष्ठ डिजिटल संपादक" : "Senior Digital Editor",
      bio: isHi
        ? "राष्ट्रीय नीति, प्रौद्योगिकी और आर्थिक रुझानों पर 15 वर्षों से अधिक के अनुभव के साथ खोजी पत्रकारिता।"
        : (art.author_bio || "Senior Digital Editor covering national policy, frontier tech, and lifestyle trends with over 15 years of investigative journalism experience."),
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      email: "news@zestfeedx.com",
    },
    published_at: art.published_at || new Date().toISOString(),
    reading_time_mins: parseInt(art.read_time) || 6,
    word_count: 1100,
    hero_image: art.image_url || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1600&q=85",
    hero_image_caption: art.image_alt || art.title,
    hero_image_credit: art.image_courtesy || "ZestFeedX Digital Archives",
    key_takeaways: isHi
      ? [
          "विभागीय समीक्षा एवं उच्चस्तरीय वैधानिक निगरानी सक्रिय।",
          "विधिक दिशा-निर्देशों के अनुरूप शत-प्रतिशत अनुपालन सुनिश्चित।",
          "संपादकीय अनुसंधान डेस्क द्वारा नीतिगत प्रभावों का लगातार विश्लेषण।",
        ]
      : [
          art.summary_en || art.summary || "Verified multi-source investigative dispatch.",
          "Primary agency and gazette cross-verification completed.",
          "Strategic implications monitored by editorial research desk.",
        ],
    content_markdown: isHi ? (art.content_hi || art.content || "") : (art.content_en || art.content || ""),
    why_it_matters: isHi ? (art.summary_hi || art.summary || "") : (art.summary_en || art.summary || ""),
    citations: [
      {
        label: art.source_name || "Verified Press Wire",
        url: art.source_url || `https://zestfeedx.com/article/${art.slug}`,
        publisher: art.source_name || "Official Wire",
      },
    ],
    tags: art.tags ? (typeof art.tags === "string" ? art.tags.split(",").map((t: string) => t.trim()) : art.tags) : [art.category, "Breaking"],
    is_lead_story: false,
    is_secondary_story: false,
    is_trending: true,
  };
}

interface HomePageContentProps {
  initialLanguage?: "en" | "hi";
  initialEdition?: "india" | "world";
}

export function HomePageContent({
  initialLanguage = "en",
  initialEdition = "india",
}: HomePageContentProps) {
  const searchParams = useSearchParams();
  const urlLang = searchParams?.get("lang") as "en" | "hi" | null;
  const urlEdition = searchParams?.get("edition") as "india" | "world" | null;

  const [currentLanguage, setCurrentLanguage] = useState<"en" | "hi">(urlLang || initialLanguage);
  const [currentEdition, setCurrentEdition] = useState<"india" | "world">(urlEdition || initialEdition);
  const [searchQuery, setSearchQuery] = useState("");
  const [wireCategoryFilter, setWireCategoryFilter] = useState("all");
  const [visibleWireCount, setVisibleWireCount] = useState(12);

  // Sync state when URL params change
  useEffect(() => {
    if (urlLang && (urlLang === "en" || urlLang === "hi")) {
      setCurrentLanguage(urlLang);
    }
  }, [urlLang]);

  useEffect(() => {
    if (urlEdition && (urlEdition === "india" || urlEdition === "world")) {
      setCurrentEdition(urlEdition);
    }
  }, [urlEdition]);

  // Merge newest seed articles (hourly verified scraper) with flagship original investigations
  const convertedSeeds = React.useMemo(() => {
    return (SEED_ARTICLES || []).map(seedToOriginalArticle);
  }, []);

  const allArticles = React.useMemo(() => {
    if (currentLanguage === "hi") {
      const hiSeeds = convertedSeeds.filter((a) => a.language === "hi");
      return hiSeeds.length > 0 ? hiSeeds : convertedSeeds;
    } else {
      const enSeeds = convertedSeeds.filter((a) => a.language === "en");
      return [...enSeeds, ...ORIGINAL_ARTICLES];
    }
  }, [convertedSeeds, currentLanguage]);

  // Edition-specific story prioritization
  const leadStory = React.useMemo(() => {
    if (currentEdition === "world") {
      return (
        allArticles.find((a) => a.category === "world") ||
        ORIGINAL_ARTICLES.find((a) => a.id === "art-2") ||
        allArticles[0]
      );
    }
    // Lead story is ALWAYS the newest hourly verified breaking dispatch
    return allArticles[0] || ORIGINAL_ARTICLES[0];
  }, [currentEdition, allArticles]);

  const secondaryStories = React.useMemo(() => {
    if (currentEdition === "world") {
      const worldArticles = allArticles.filter((a) => a.category === "world" && a.slug !== leadStory.slug);
      if (worldArticles.length >= 2) return worldArticles.slice(0, 2);
      return [
        ORIGINAL_ARTICLES.find((a) => a.id === "art-9") || allArticles[1],
        ORIGINAL_ARTICLES.find((a) => a.id === "art-3") || allArticles[2],
      ];
    }
    // Next 2 freshest stories
    return allArticles.filter((a) => a.slug !== leadStory.slug).slice(0, 2);
  }, [currentEdition, allArticles, leadStory]);

  // Top 5 Curated Reads on the right side of the Hero Grid
  const curatedReads: CuratedBrief[] = React.useMemo(() => {
    const rawSeeds = SEED_ARTICLES || [];
    const filteredSeeds = rawSeeds.filter((s) => {
      const isHi = s.language === "hi" || /[\u0900-\u097F]/.test(s.title || "");
      return currentLanguage === "hi" ? isHi : !isHi;
    });

    if (filteredSeeds.length >= 8) {
      return filteredSeeds.slice(3, 8).map((s) => ({
        id: `brief-${s.id}`,
        title: currentLanguage === "hi" ? (s.title_hi || s.title) : (s.title_en || s.title),
        title_hi: s.title_hi || s.title,
        summary: currentLanguage === "hi" ? (s.summary_hi || s.summary || "") : (s.summary_en || s.summary || ""),
        source_name: s.source_name || "Verified Press Wire",
        source_url: `/article/${s.slug}`,
        published_at: s.published_at || new Date().toISOString(),
        category: (s.category || "india") as any,
        language: currentLanguage,
      }));
    }
    return CURATED_BRIEFS;
  }, [currentLanguage]);

  // Group by vertical for Section 7 (Markets, Tech, India Policy)
  const marketsOriginal = React.useMemo(() => {
    return allArticles.filter((a) => a.category === "markets").slice(0, 3);
  }, [allArticles]);

  const techOriginal = React.useMemo(() => {
    return allArticles.filter((a) => a.category === "tech").slice(0, 3);
  }, [allArticles]);

  const indiaOriginal = React.useMemo(() => {
    return allArticles.filter((a) => a.category === "india" || a.category === "health").slice(0, 3);
  }, [allArticles]);

  const marketsCurated = React.useMemo(() => {
    return CURATED_BRIEFS.filter((b) => b.category === "markets" || b.category === "tech");
  }, []);

  const techCurated = React.useMemo(() => {
    return CURATED_BRIEFS.filter((b) => b.category === "tech");
  }, []);

  const indiaCurated = React.useMemo(() => {
    return CURATED_BRIEFS.filter((b) => b.category === "india" || b.category === "health" || b.category === "world");
  }, []);

  // Filter 24x7 Wire Dispatches
  const wireArticles = React.useMemo(() => {
    if (wireCategoryFilter === "all") return allArticles;
    return allArticles.filter((a) => {
      const c = a.category.toLowerCase();
      const target = wireCategoryFilter.toLowerCase();
      if (target === "india") return c === "india" || c === "politics";
      return c === target;
    });
  }, [allArticles, wireCategoryFilter]);

  // Search filter if user types in search
  const filteredOriginal = searchQuery
    ? allArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.deck.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (a.title_hi && a.title_hi.toLowerCase().includes(searchQuery.toLowerCase())) ||
          a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : null;

  const isHindi = currentLanguage === "hi";

  return (
    <div className={`min-h-screen flex flex-col bg-[#FAF8F4] dark:bg-[#080C16] text-[#0B1020] dark:text-[#F1F5F9] transition-colors ${isHindi ? "font-hindi" : ""}`}>
      {/* Breaking Strip */}
      <BreakingStrip currentLanguage={currentLanguage} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Edition Context Banner (Active when World Edition is Selected) */}
        {currentEdition === "world" && (
          <div className="bg-[#0B1020] text-white py-2 px-4 text-center text-xs border-b border-[#E8E4DC] dark:border-[#1E293B]">
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 font-medium">
              <Globe className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>
                {isHindi
                  ? "वैश्विक प्रवासी संस्करण सक्रिय • अमेरिका, खाड़ी, ब्रिटेन और कनाडा में 3.2 करोड़ भारतीयों के लिए प्रेषण, वीज़ा एवं नीतिगत रिपोर्ट"
                  : "Global Diaspora Edition Active • Prioritizing cross-border CBDC remittances, H-1B & student visa reforms, and bilateral trade pacts for 32M overseas Indians."}
              </span>
            </div>
          </div>
        )}

        {searchQuery ? (
          /* Search Results View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="font-display text-2xl font-bold mb-4">
              {isHindi ? `"${searchQuery}" के लिए खोज परिणाम` : `Search Results for "${searchQuery}"`} ({filteredOriginal?.length || 0} {isHindi ? "परिणाम" : "matches"})
            </h2>
            {filteredOriginal && filteredOriginal.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOriginal.map((art) => (
                  <article
                    key={art.id}
                    className="p-4 bg-white dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-lg flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#FF5A1F]">
                        {art.category}
                      </span>
                      <Link href={`/article/${art.slug}/`}>
                        <h3 className="font-display text-base font-bold mt-1 hover:text-[#FF5A1F] line-clamp-2">
                          {isHindi && art.title_hi ? art.title_hi : art.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#525866] dark:text-[#94A3B8] mt-2 line-clamp-2">
                        {isHindi && art.deck_hi ? art.deck_hi : art.deck}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#E8E4DC] dark:border-[#1E293B] flex items-center justify-between text-[11px] text-[#525866] dark:text-[#94A3B8]">
                      <span>{art.author.name}</span>
                      <ReaderCounter slug={art.slug} compact={true} />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#525866] dark:text-[#94A3B8]">
                {isHindi
                  ? "कोई सत्यापित रिपोर्ट नहीं मिली। 'बाजार', 'मोदी' या 'एआई' जैसे कीवर्ड खोजें।"
                  : "No matching verified reports found. Try keywords like 'Markets', 'Modi', or 'AI'."}
              </p>
            )}
          </div>
        ) : (
          /* Standard 10-Section Broadsheet Homepage */
          <>
            {/* 4. Lead story + 2 secondary stories + Top 5 reads */}
            <HeroGrid
              leadStory={leadStory}
              secondaryStories={secondaryStories}
              curatedReads={curatedReads}
              currentLanguage={currentLanguage}
            />

            {/* 5. Leaderboard ad slot (reserved height, zero CLS) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AdSlot format="leaderboard" slotId="home-leaderboard-top" />
            </div>

            {/* 6. Morning Brief card (original, editor-approved) */}
            <MorningBriefCard currentLanguage={currentLanguage} />

            {/* 24x7 Verified Continuous News Wire (Hourly Updated) */}
            <section className="py-10 bg-white dark:bg-[#0B1020] border-y border-[#E8E4DC] dark:border-[#1E293B]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-2.5 h-2.5 bg-[#D7263D] rounded-full animate-pulse" />
                      <span className="text-xs uppercase font-bold tracking-widest text-[#D7263D]">
                        {isHindi ? "24x7 लाइव वायर" : "24x7 Live News Wire"}
                      </span>
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                      {isHindi ? "ताज़ा सत्यापित समाचार बुलेटिन" : "Hourly Verified Wire Dispatches"}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#525866] dark:text-[#94A3B8] mt-1">
                      {isHindi
                        ? "प्रत्येक घंटे अपडेट होने वाली सत्यापित राष्ट्रीय एवं अंतर्राष्ट्रीय खबरें"
                        : "Continuously refreshed from primary press wires, verified by editorial desk."}
                    </p>
                  </div>

                  {/* Wire Category Filter Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF8F4] dark:bg-[#080C16] p-1.5 rounded-lg border border-[#E8E4DC] dark:border-[#1E293B]">
                    {["all", "india", "markets", "tech", "world", "sports", "entertainment"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setWireCategoryFilter(cat);
                          setVisibleWireCount(12);
                        }}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors capitalize ${
                          wireCategoryFilter === cat
                            ? "bg-[#0B1020] dark:bg-white text-white dark:text-[#0B1020] shadow-xs"
                            : "text-[#525866] dark:text-[#94A3B8] hover:text-[#0B1020] dark:hover:text-white"
                        }`}
                      >
                        {cat === "all" ? (isHindi ? "सभी" : "All Stories") : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wire Stories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wireArticles.slice(0, visibleWireCount).map((article) => (
                    <article
                      key={article.id}
                      className="group bg-[#FAF8F4] dark:bg-[#080C16] border border-[#E8E4DC] dark:border-[#1E293B] rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#FF5A1F] transition-all hover:shadow-md"
                    >
                      <div>
                        {/* Image */}
                        <Link href={`/article/${article.slug}/`} className="block relative w-full h-44 overflow-hidden bg-[#ECE7DE] dark:bg-[#1E293B]">
                          <Image
                            src={article.hero_image}
                            alt={article.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-2.5 left-2.5 bg-[#0B1020]/90 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                            {article.category}
                          </span>
                        </Link>

                        {/* Content */}
                        <div className="p-4">
                          <div className="flex items-center gap-2 text-[10px] text-[#525866] dark:text-[#94A3B8] mb-2 font-mono">
                            <Clock className="w-3 h-3" />
                            <span>{formatRelativeTimeIST(article.published_at)}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-[#0E7C86] font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              {article.citations[0]?.publisher || "Verified"}
                            </span>
                          </div>

                          <Link href={`/article/${article.slug}/`}>
                            <h3 className="font-display text-base font-bold text-[#0B1020] dark:text-[#F1F5F9] leading-snug group-hover:text-[#FF5A1F] transition-colors line-clamp-2">
                              {isHindi && article.title_hi ? article.title_hi : article.title}
                            </h3>
                          </Link>

                          <p className="mt-2 text-xs text-[#525866] dark:text-[#94A3B8] leading-relaxed line-clamp-2">
                            {isHindi && article.deck_hi ? article.deck_hi : article.deck}
                          </p>
                        </div>
                      </div>

                      {/* Footer Byline & Stats */}
                      <div className="px-4 py-3 bg-white dark:bg-[#0F172A] border-t border-[#E8E4DC] dark:border-[#1E293B] flex items-center justify-between text-[11px] text-[#525866] dark:text-[#94A3B8]">
                        <span className="font-medium text-[#0B1020] dark:text-[#F1F5F9]">
                          {article.author.name}
                        </span>
                        <div className="flex items-center gap-3">
                          <ReaderCounter slug={article.slug} compact={true} />
                          <Link
                            href={`/article/${article.slug}/`}
                            className="text-[#FF5A1F] font-bold inline-flex items-center gap-0.5 hover:underline"
                          >
                            <span>Read</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Load More Button */}
                {visibleWireCount < wireArticles.length && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setVisibleWireCount((prev) => prev + 12)}
                      className="inline-flex items-center gap-2 bg-[#0B1020] dark:bg-white text-white dark:text-[#0B1020] px-6 py-2.5 rounded-md font-display font-semibold text-xs tracking-wider uppercase hover:bg-[#FF5A1F] dark:hover:bg-[#FF5A1F] dark:hover:text-white transition-all shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isHindi ? "और समाचार लोड करें" : "Load More Dispatches"} ({wireArticles.length - visibleWireCount} more)</span>
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* 7. Vertical sections: Markets & Money, Tech & AI, India Policy */}
            <VerticalSection
              id="markets"
              title="Markets & Economy"
              title_hi="बाजार एवं अर्थव्यवस्था"
              tagline="Monetary policy, rupee liquidity, capital markets, and industrial expansion"
              originalArticles={marketsOriginal}
              curatedBriefs={marketsCurated}
              currentLanguage={currentLanguage}
            />

            <VerticalSection
              id="tech"
              title="Tech, AI & Frontiers"
              title_hi="तकनीक, कृत्रिम बुद्धिमत्ता एवं भविष्य"
              tagline="Semiconductor fabs, sovereign AI compute, and digital public infrastructure"
              originalArticles={techOriginal}
              curatedBriefs={techCurated}
              currentLanguage={currentLanguage}
            />

            <VerticalSection
              id="india"
              title="India Policy & Health"
              title_hi="भारत नीतियां, स्वास्थ्य एवं पर्यावरण"
              tagline="Cabinet decisions, environmental air monitoring, and national security"
              originalArticles={indiaOriginal}
              curatedBriefs={indiaCurated}
              currentLanguage={currentLanguage}
            />

            {/* 8. Explainers carousel */}
            <ExplainerCarousel currentLanguage={currentLanguage} />

            {/* 9. Newsletter signup with sponsor slot */}
            <NewsletterBanner />
          </>
        )}
      </main>

      {/* 10. Institutional Footer */}
      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F4] dark:bg-[#080C16]" />}>
      <HomePageContent />
    </Suspense>
  );
}
