import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Article } from "@/types/news";
import {
  Eye,
  Clock,
  Calendar,
  ArrowLeft,
  Home,
  ShieldCheck,
  PlayCircle,
  Video,
  UserCheck,
  Zap,
  AlertCircle,
  Mail,
  ExternalLink
} from "lucide-react";
import SidebarAd from "@/components/SidebarAd";
import GoogleNewsFollowBadge from "@/components/GoogleNewsFollowBadge";
import SafeImage from "@/components/SafeImage";
import { SEED_ARTICLES } from "@/data/seedArticles";

interface Props {
  params: Promise<{ slug: string }>;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "Nov 9, 2026";
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
  } catch {}
  return dateStr.replace(/GMT.*$/, "").trim() || "Nov 9, 2026";
}

export function generateStaticParams() {
  return SEED_ARTICLES.map((a) => ({
    slug: a.slug,
  }));
}

async function fetchArticle(slug: string): Promise<{ article: Article; related: Article[] } | null> {
  const found = SEED_ARTICLES.find((a) => a.slug === slug);
  if (found) {
    const related = SEED_ARTICLES.filter((a) => a.slug !== slug).slice(0, 8);
    return { article: found, related };
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchArticle(slug);

  if (!data?.article) {
    return {
      title: "Article Not Found | ZestFeedX",
      description: "Breaking news, ground reports, and in-depth investigative analysis.",
    };
  }

  const art = data.article;
  const canonicalUrl = `https://zestfeedx.com/article/${art.slug}/`;
  const rawImage =
    art.image_url ||
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";

  // Strict SEO Length Optimization (< 60 chars for title, 120-150 chars for description)
  const cleanTitle = (art.original_title || art.title).replace(/^[^\w\s]+/, "").trim();
  const shortTitle = cleanTitle.length > 46 ? `${cleanTitle.slice(0, 43)}...` : cleanTitle;
  const seoTitle = `${shortTitle} | ZestFeedX`;

  let rawDesc = (art.summary_en || art.summary || cleanTitle).replace(/<[^>]+>/g, "").split("...")[0].trim();
  let metaDesc = rawDesc;
  if (metaDesc.length > 150) {
    metaDesc = `${metaDesc.slice(0, 147)}...`;
  } else if (metaDesc.length < 120) {
    metaDesc = `${metaDesc} - Ground report and verified analysis from ZestFeedX Editorial Desk.`;
    if (metaDesc.length > 150) metaDesc = `${metaDesc.slice(0, 147)}...`;
  }

  return {
    title: seoTitle,
    description: metaDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: art.tags ? art.tags.split(",") : ["news", "india", "investigative", "zestfeedx", "pankhudisharma"],
    openGraph: {
      title: seoTitle,
      description: metaDesc,
      url: canonicalUrl,
      siteName: "ZestFeedX",
      images: [
        {
          url: rawImage,
          width: 1200,
          height: 675,
          alt: art.image_alt || cleanTitle,
        },
      ],
      type: "article",
      publishedTime: art.published_at,
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: metaDesc,
      images: [rawImage],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const data = await fetchArticle(slug);

  if (!data?.article) {
    notFound();
  }

  const { article, related } = data;
  const canonicalUrl = `https://zestfeedx.com/article/${article.slug}/`;
  const rawImage =
    article.image_url ||
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";

  const cleanHeadline = (article.original_title || article.title).replace(/^[^\w\s]+/, "").trim().slice(0, 105);

  // 2026 Zero-Error Schema JSON-LD conforming strictly to Schema.org NewsArticle & Google Rich Results
  const schema2026 = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        "@id": `${canonicalUrl}#article`,
        "isPartOf": {
          "@type": "WebPage",
          "@id": canonicalUrl,
          "name": cleanHeadline,
          "url": canonicalUrl
        },
        "headline": cleanHeadline,
        "description": (article.summary_en || article.summary).slice(0, 150),
        "image": [rawImage],
        "datePublished": article.published_at,
        "dateModified": article.published_at,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": canonicalUrl
        },
        "author": {
          "@type": "Person",
          "name": "Pankhudi Sharma",
          "jobTitle": "Senior Digital Editor",
          "url": "https://zestfeedx.com/about/"
        },
        "publisher": {
          "@type": "NewsMediaOrganization",
          "name": "ZestFeedX",
          "url": "https://zestfeedx.com/",
          "logo": {
            "@type": "ImageObject",
            "url": "https://zestfeedx.com/google-news/wide-logo-light.png",
            "width": 600,
            "height": 60
          }
        },
        "articleSection": article.category,
        "inLanguage": "en-IN"
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://zestfeedx.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": article.category.toUpperCase(),
            "item": `https://zestfeedx.com/category/${article.category}/`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": cleanHeadline,
            "item": canonicalUrl
          }
        ]
      }
    ]
  };

  const renderFormattedInlineText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const extractBulletPoints = (para: string): string[] => {
    const points: string[] = [];
    const lines = para.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.includes("•")) {
        const parts = trimmed.split("•").map((p) => p.trim()).filter((p) => p.length > 0);
        points.push(...parts);
      } else if (trimmed.startsWith("-")) {
        points.push(trimmed.replace(/^-\s*/, ""));
      } else {
        points.push(trimmed);
      }
    }
    return points;
  };

  const displayTitle = article.title_en || article.title;
  const displaySummary = article.summary_en || article.summary;
  const displayContent = article.content_en || article.content;

  return (
    <article className="min-h-screen bg-[#090d16] text-slate-100 font-sans p-0 m-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema2026) }}
      />

      {/* Google News Subscribe with Google (SwG Basic / Reader Revenue Manager) */}
      <script
        async
        type="application/javascript"
        src="https://news.google.com/swg/js/v1/swg-basic.js"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `(self.SWG_BASIC = self.SWG_BASIC || []).push( basicSubscriptions => {
  basicSubscriptions.init({
    type: "NewsArticle",
    isPartOfType: ["Product"],
    isPartOfProductId: "CAow3KLIDA:openaccess",
    clientOptions: { theme: "light", lang: "en" },
  });
});`,
        }}
      />

      {/* Top Reading Navigation */}
      <div className="bg-[#0f172a] border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-xl sm:text-2xl font-black uppercase tracking-tight flex items-center gap-2 chromatic-text"
          >
            <span className="w-2.5 h-2.5 bg-gradient-to-tr from-cyan-400 to-rose-500 rounded-full shadow-[0_0_8px_#00f0ff] animate-pulse" />
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400 mb-4">
          <Link href="/" className="hover:text-white flex items-center gap-1">
            <Home className="w-3 h-3" /> Home
          </Link>
          <span>/</span>
          <Link href={`/?category=${article.category}`} className="font-bold text-red-500 uppercase hover:underline">
            {article.category}
          </Link>
          <span>/</span>
          <span className="text-slate-500 truncate max-w-[280px]">{displayTitle}</span>
        </nav>

        {/* AdSense Leaderboard Placement (728x90 Native Responsive Slot) */}
        <div
          className="w-full mb-6 flex flex-col items-center justify-center min-h-[90px] overflow-hidden"
          data-ad-slot="adsense-article-top-leaderboard-728x90"
        >
          <div className="w-full max-w-[728px] h-[90px] rounded border border-dashed border-slate-800 bg-[#0c1222]/60 flex flex-col items-center justify-center text-center">
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono">
              Advertisement
            </span>
            <span className="text-xs text-slate-400 font-serif">
              [Google AdSense Responsive Leaderboard — 728×90]
            </span>
          </div>
        </div>

        {/* 2-Column Article Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Story (8 cols) */}
          <div className="lg:col-span-8 bg-[#0f172a] border border-slate-800 p-6 sm:p-10 rounded-lg shadow-xl">
            {/* Category Kicker */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                  {article.category}
                </span>
                <span className="text-slate-700">•</span>
                <span className="text-xs text-slate-400 font-medium">
                  ZestFeedX Long-Form Dispatch
                </span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {article.fact_check_status || "Verified by Grok"}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
              {displayTitle}
            </h1>

            {/* Subheading Excerpt */}
            <p className="text-slate-300 text-lg leading-relaxed mb-6 font-medium">
              {displaySummary}
            </p>

            {/* Byline & Timestamps */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 py-3 border-y border-slate-800 mb-6 gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  By {article.author_name || "Pankhudi Sharma"}
                </span>
                <span className="text-slate-700">•</span>
                <span className="font-semibold text-red-400">
                  Source: {article.source_name || "Official Wire"}
                </span>
                <span className="text-slate-700">•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {formatDate(article.published_at)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {article.read_time}
                </span>
                <span className="text-slate-700">•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  {article.views_count.toLocaleString()} reads
                </span>
              </div>
            </div>

            {/* Editorial Photo */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded bg-slate-900 mb-2 border border-slate-800">
              <SafeImage
                src={rawImage}
                alt={article.image_alt || displayTitle}
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="text-[11px] text-slate-500 italic mb-6">
              <span>{article.image_courtesy || `Photo Courtesy: ${article.source_name || "Press Wire Archive"}`}</span>
            </div>

            {/* Google Preferred News Source Banner */}
            <div className="mb-6">
              <GoogleNewsFollowBadge variant="banner" className="w-full justify-between" />
            </div>

            {/* Fact Check Box */}
            <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded mb-6 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-300 uppercase tracking-wide mb-0.5">
                  Editorial Integrity &amp; Grok Fact-Check Verified
                </p>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  Verified across primary source feeds, official communiqués, and the Grok AI fact-checking engine. Content strictly adheres to Press Council standards.
                </p>
              </div>
            </div>

            {/* Health Category Medical Disclaimer (AdSense & E-E-A-T Compliant) */}
            {article.category?.toLowerCase() === "health" && (
              <div className="p-4 mb-6 rounded-lg bg-amber-950/40 border-l-4 border-amber-500 border-t border-r border-b border-amber-800/60 text-amber-200 text-xs sm:text-sm flex items-start gap-3 shadow-md">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold uppercase tracking-wider block text-amber-300 mb-0.5">
                    Medical &amp; Health Disclaimer
                  </span>
                  <p className="text-amber-200/90 leading-relaxed">
                    Disclaimer: The information provided is for educational purposes and should not substitute professional medical advice. Always consult a qualified physician or healthcare professional before making health-related decisions.
                  </p>
                </div>
              </div>
            )}

            {/* Key Takeaways (Executive TL;DR) */}
            <div className="my-6 p-5 rounded-lg bg-gradient-to-r from-red-950/40 via-[#0e172a] to-[#0f172a] border border-red-500/40 shadow-lg">
              <div className="flex items-center gap-2 mb-3 text-red-400">
                <Zap className="w-4 h-4 fill-red-500 text-red-500" />
                <h3 className="font-serif font-black text-xs sm:text-sm uppercase tracking-wider text-red-400">
                  Key Takeaways (Executive TL;DR)
                </h3>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0 shadow-[0_0_6px_#ef4444]" />
                  <span className="leading-relaxed">
                    <strong>Primary Event:</strong> {displayTitle.replace(/^[^\w\s]+/, "").trim()} verified through multi-agency communications and ground dispatches.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0 shadow-[0_0_6px_#ef4444]" />
                  <span className="leading-relaxed">
                    <strong>Institutional Oversight:</strong> Standard operating procedures and regulatory frameworks are actively monitored by supervisory desks.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0 shadow-[0_0_6px_#ef4444]" />
                  <span className="leading-relaxed">
                    <strong>Strategic Impact:</strong> Policy commentators and analysts emphasize measurable long-term significance across the {article.category.toUpperCase()} sector.
                  </span>
                </li>
              </ul>
            </div>

            {/* Longform Editorial Content with Rich In-Article Media */}
            <div className="text-slate-200 text-base sm:text-lg leading-relaxed font-sans space-y-6">
              {displayContent.split("\n\n").map((para, index) => {
                const trimmed = para.trim();
                if (!trimmed) return null;

                // 1. Embedded Image Figures: ![Caption](imageUrl) - omit duplicates of main image
                const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
                if (imgMatch) {
                  const [, caption, src] = imgMatch;
                  const cleanSrc = src.trim();
                  // Never show duplicate of main hero image in content body
                  if (cleanSrc === rawImage || cleanSrc === article.image_url) {
                    return null;
                  }
                  return (
                    <figure
                      key={index}
                      className="my-8 rounded-lg overflow-hidden border border-slate-800 bg-[#0c1322] shadow-xl"
                    >
                      <div className="relative w-full h-64 sm:h-80 md:h-[420px] bg-slate-900">
                        <SafeImage
                          src={cleanSrc}
                          alt={caption || "Editorial Photograph"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {caption && (
                        <figcaption className="p-3 text-xs text-slate-300 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-3">
                          <span className="font-medium text-slate-200">{caption}</span>
                          <span className="text-[11px] text-slate-400 shrink-0 uppercase tracking-wider">
                            Editorial Wire
                          </span>
                        </figcaption>
                      )}
                    </figure>
                  );
                }

                // 2. Structured Data Table (| Col 1 | Col 2 |)
                if (trimmed.startsWith("|") && trimmed.includes("\n|")) {
                  const rows = trimmed.split("\n").map(r => r.trim()).filter(r => r.startsWith("|"));
                  if (rows.length >= 2) {
                    const headerCells = rows[0].split("|").slice(1, -1).map(c => c.trim());
                    const dataRows = rows.slice(2).map(r => r.split("|").slice(1, -1).map(c => c.trim()));
                    return (
                      <div key={index} className="my-8 overflow-x-auto rounded-lg border border-slate-700 bg-slate-900/90 shadow-xl">
                        <table className="w-full text-left text-xs sm:text-sm text-slate-200">
                          <thead className="bg-slate-800/95 text-xs uppercase font-bold text-slate-200 border-b border-slate-700">
                            <tr>
                              {headerCells.map((h, hIdx) => (
                                <th key={hIdx} className="px-4 py-3 tracking-wider">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {dataRows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-800/50 transition-colors">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="px-4 py-3 text-slate-300 font-sans">
                                    {renderFormattedInlineText(cell)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                }

                // 3. Section Headings (### Section Name or ## Section Name)
                if (trimmed.startsWith("###") || trimmed.startsWith("##")) {
                  const headingText = trimmed.replace(/^#+\s*/, "");
                  return (
                    <h2
                      key={index}
                      className="font-serif text-xl sm:text-2xl font-bold text-white pt-6 border-b border-slate-800/80 pb-2.5 flex items-center gap-2.5"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block shrink-0" />
                      {headingText}
                    </h2>
                  );
                }

                // 4. Editorial Pull-Quotes (> Quote text)
                if (trimmed.startsWith(">")) {
                  const quoteText = trimmed.replace(/^>\s*/, "");
                  if (quoteText.includes("• ") || quoteText.startsWith("- ")) {
                    const points = extractBulletPoints(quoteText);
                    return (
                      <blockquote
                        key={index}
                        className="my-6 p-5 bg-[#0e172a] border-l-4 border-l-slate-700 rounded-r border-t border-r border-b border-slate-800 text-slate-200 text-base sm:text-lg"
                      >
                        <ul className="space-y-2 list-disc list-inside text-slate-300 pl-2">
                          {points.map((pt, pIdx) => (
                            <li key={pIdx} className="leading-relaxed">
                              {renderFormattedInlineText(pt)}
                            </li>
                          ))}
                        </ul>
                      </blockquote>
                    );
                  }
                  return (
                    <blockquote
                      key={index}
                      className="my-6 p-5 bg-[#0e172a] border-l-4 border-l-slate-700 rounded-r border-t border-r border-b border-slate-800 italic text-slate-200 font-serif text-base sm:text-lg"
                    >
                      {renderFormattedInlineText(quoteText)}
                    </blockquote>
                  );
                }

                // 5. Source HTML / text paragraph embedded in body - SKIP to prevent duplicate source!
                const lowerTrimmed = trimmed.toLowerCase();
                if (
                  lowerTrimmed.startsWith("source:") ||
                  lowerTrimmed.startsWith("source :") ||
                  lowerTrimmed.startsWith("**source:**") ||
                  lowerTrimmed.startsWith("*source:*") ||
                  lowerTrimmed.includes("<p className=") ||
                  (lowerTrimmed.startsWith("http://") || lowerTrimmed.startsWith("https://"))
                ) {
                  return null;
                }

                // 6. Ordered List (1. Item, 2. Item)
                if (/^\d+\.\s/.test(trimmed)) {
                  const items = trimmed.split("\n").map(l => l.replace(/^\d+\.\s*/, "").trim()).filter(Boolean);
                  return (
                    <ol key={index} className="my-4 space-y-2 list-decimal list-inside text-slate-300 pl-2">
                      {items.map((it, iIdx) => (
                        <li key={iIdx} className="leading-relaxed">
                          {renderFormattedInlineText(it)}
                        </li>
                      ))}
                    </ol>
                  );
                }

                // 7. Clean journalistic bullet list if any exist
                if (trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.includes("• ")) {
                  const points = extractBulletPoints(trimmed);
                  return (
                    <ul key={index} className="my-4 space-y-2 list-disc list-inside text-slate-300 pl-2">
                      {points.map((pt, pIdx) => (
                        <li key={pIdx} className="leading-relaxed">
                          {renderFormattedInlineText(pt)}
                        </li>
                      ))}
                    </ul>
                  );
                }

                // 8. Regular Journalistic In-Depth Paragraphs
                return (
                  <React.Fragment key={index}>
                    <p className="leading-relaxed text-slate-300 text-base sm:text-lg">
                      {renderFormattedInlineText(trimmed)}
                    </p>

                    {/* AdSense In-Article Responsive Slot (300x250 between paragraphs 3 and 4) */}
                    {index === 3 && (
                      <div
                        className="my-8 w-full max-w-[336px] mx-auto min-h-[250px] p-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 bg-[#0c1222]/80 text-center overflow-hidden"
                        data-ad-slot="adsense-in-article-300x250"
                      >
                        <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono mb-2">
                          Advertisement
                        </span>
                        <div className="w-[300px] h-[250px] flex items-center justify-center text-xs text-slate-500 font-serif border border-slate-800/60 rounded">
                          [Google AdSense Responsive Unit — 300×250]
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Transform Source Attribution in a Styled <cite> Block */}
            <cite className="block not-italic my-8 p-5 rounded-lg bg-[#0e172a] border-l-4 border-red-600 border-t border-r border-b border-slate-800 text-sm text-slate-300 font-serif shadow-md">
              <div className="flex items-center gap-2 mb-1.5 text-slate-400 font-sans text-xs uppercase tracking-wider font-semibold">
                <ExternalLink className="w-3.5 h-3.5 text-red-500" />
                Primary Source Attribution
              </div>
              <p className="leading-relaxed text-slate-200">
                Story curated and adapted from <strong className="text-white font-bold">{article.source_name || "Official Wire"}</strong>.{" "}
                <a
                  href={article.source_url || "https://news.google.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-300 underline font-semibold transition-colors break-all inline-flex items-center gap-1"
                >
                  Read the original report here &rarr;
                </a>
              </p>
            </cite>

            {/* Enhanced Author Profile Card (Pankhudi Sharma) */}
            <div className="my-8 p-6 bg-[#0a0f1d] border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xl">
              <div className="flex items-start sm:items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500/60 shadow-lg shrink-0 bg-slate-800">
                  <Image
                    src="/images/pankhudi-sharma.jpg"
                    alt="Pankhudi Sharma - Senior Digital Editor at ZestFeedX"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href="/about"
                      className="font-bold text-white hover:text-red-400 transition-colors text-base sm:text-lg underline"
                    >
                      Pankhudi Sharma
                    </Link>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-semibold">
                      Senior Digital Editor
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Senior Digital Editor covering national policy, frontier tech, and lifestyle trends with over 15 years of newsroom experience delivering high-impact investigative reporting and ground-reality journalism.
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 flex-wrap">
                    <span>Newsroom: <strong className="text-slate-200">ZestFeedX National Bureau</strong></span>
                    <span className="text-slate-600">•</span>
                    <a
                      href="mailto:news@zestfeedx.com"
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      news@zestfeedx.com
                    </a>
                  </div>
                </div>
              </div>
              <Link
                href="/about/"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded border border-slate-700 transition-colors flex items-center gap-1.5 shrink-0"
              >
                Author Profile &rarr;
              </Link>
            </div>

            {/* Video Broadcast Embed Preview */}
            <div className="my-8 p-5 bg-[#0a0f1d] text-white rounded border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  <Video className="w-6 h-6 text-red-500 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block">
                    Ground Wire Video Report
                  </span>
                  <p className="font-serif text-sm sm:text-base font-bold text-white">
                    Field footage & correspondent commentary
                  </p>
                  <p className="text-xs text-slate-400">
                    Broadcasted live from national correspondent desk
                  </p>
                </div>
              </div>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded transition-colors flex items-center gap-1.5 shrink-0"
              >
                <PlayCircle className="w-4 h-4" /> Watch Broadcast
              </button>
            </div>

            {/* Related Stories */}
            {related && related.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-800">
                <h3 className="font-serif font-black text-lg text-white uppercase tracking-tight mb-4">
                  Related Reports
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {related.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/article/${rel.slug}/`}
                      className="p-3.5 bg-[#0a0f1d] border border-slate-800 hover:border-slate-600 rounded transition-colors group"
                    >
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block mb-1">
                        {rel.category}
                      </span>
                      <h4 className="font-serif text-sm font-bold text-slate-200 group-hover:text-red-400 transition-colors line-clamp-2">
                        {rel.title_en || rel.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            <SidebarAd />
          </aside>
        </div>
      </div>
    </article>
  );
}
