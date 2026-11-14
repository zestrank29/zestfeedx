"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TopBar from "@/components/TopBar";
import Masthead from "@/components/Masthead";
import BreakingStrip from "@/components/BreakingStrip";
import HeroGrid from "@/components/HeroGrid";
import AdSlot from "@/components/AdSlot";
import MorningBriefCard from "@/components/MorningBriefCard";
import VerticalSection from "@/components/VerticalSection";
import ExplainerCarousel from "@/components/ExplainerCarousel";
import NewsletterBanner from "@/components/NewsletterBanner";
import Footer from "@/components/Footer";
import { Globe, PlaneTakeoff } from "lucide-react";

import {
  ORIGINAL_ARTICLES,
  CURATED_BRIEFS,
  OriginalArticle,
  CuratedBrief,
} from "@/data/demoContent";

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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Handle language switch and update URL without hard reload
  const handleLanguageChange = (newLang: "en" | "hi") => {
    setCurrentLanguage(newLang);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (newLang === "hi") {
        url.searchParams.set("lang", "hi");
      } else {
        url.searchParams.delete("lang");
      }
      window.history.pushState({}, "", url.toString());
    }
  };

  // Handle edition switch and update URL
  const handleEditionChange = (newEdition: "india" | "world") => {
    setCurrentEdition(newEdition);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (newEdition === "world") {
        url.searchParams.set("edition", "world");
      } else {
        url.searchParams.delete("edition");
      }
      window.history.pushState({}, "", url.toString());
    }
  };

  // Edition-specific story prioritization
  // In World/Diaspora mode: prioritize cross-border remittances (art-2), student visas (art-9), and silicon fabs (art-3)
  const leadStory =
    currentEdition === "world"
      ? ORIGINAL_ARTICLES.find((a) => a.id === "art-2") || ORIGINAL_ARTICLES[0]
      : ORIGINAL_ARTICLES.find((a) => a.is_lead_story) || ORIGINAL_ARTICLES[0];

  const secondaryStories =
    currentEdition === "world"
      ? [
          ORIGINAL_ARTICLES.find((a) => a.id === "art-9") || ORIGINAL_ARTICLES[1],
          ORIGINAL_ARTICLES.find((a) => a.id === "art-3") || ORIGINAL_ARTICLES[2],
        ]
      : ORIGINAL_ARTICLES.filter((a) => a.is_secondary_story);

  // Group by vertical for Section 7
  const marketsOriginal = ORIGINAL_ARTICLES.filter((a) => a.category === "markets");
  const marketsCurated = CURATED_BRIEFS.filter((b) => b.category === "markets" || b.category === "tech");

  const techOriginal = ORIGINAL_ARTICLES.filter((a) => a.category === "tech");
  const techCurated = CURATED_BRIEFS.filter((b) => b.category === "tech");

  const indiaOriginal = ORIGINAL_ARTICLES.filter((a) => a.category === "india" || a.category === "health");
  const indiaCurated = CURATED_BRIEFS.filter((b) => b.category === "india" || b.category === "health" || b.category === "world");

  // Search filter if user types in search
  const filteredOriginal = searchQuery
    ? ORIGINAL_ARTICLES.filter(
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
                    className="p-4 bg-white dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-lg"
                  >
                    <span className="text-[10px] uppercase font-bold text-[#FF5A1F]">
                      {art.category}
                    </span>
                    <a href={`/article/${art.slug}`}>
                      <h3 className="font-display text-base font-bold mt-1 hover:text-[#FF5A1F]">
                        {isHindi && art.title_hi ? art.title_hi : art.title}
                      </h3>
                    </a>
                    <p className="text-xs text-[#525866] dark:text-[#94A3B8] mt-2 line-clamp-2">
                      {isHindi && art.deck_hi ? art.deck_hi : art.deck}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#525866] dark:text-[#94A3B8]">
                {isHindi
                  ? "कोई सत्यापित रिपोर्ट नहीं मिली। 'बस्तर', 'आरबीआई' या 'सेमीकंडक्टर' जैसे कीवर्ड खोजें।"
                  : "No matching verified reports found. Try keywords like 'Bastar', 'RBI', or 'Semiconductor'."}
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
              curatedReads={CURATED_BRIEFS}
              currentLanguage={currentLanguage}
            />

            {/* 5. Leaderboard ad slot (reserved height, zero CLS) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AdSlot format="leaderboard" slotId="home-leaderboard-top" />
            </div>

            {/* 6. Morning Brief card (original, editor-approved) */}
            <MorningBriefCard currentLanguage={currentLanguage} />

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
