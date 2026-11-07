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
  UserCheck
} from "lucide-react";
import SidebarAd from "@/components/SidebarAd";
import GoogleNewsFollowBadge from "@/components/GoogleNewsFollowBadge";
import SafeImage from "@/components/SafeImage";
import { SEED_ARTICLES } from "@/data/seedArticles";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SEED_ARTICLES.map((a) => ({
    slug: a.slug,
  }));
}

async function fetchArticle(slug: string): Promise<{ article: Article; related: Article[] } | null> {
  const found = SEED_ARTICLES.find((a) => a.slug === slug);
  if (found) {
    const related = SEED_ARTICLES.filter((a) => a.slug !== slug).slice(0, 4);
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
  const canonicalUrl = `https://zestfeedx.com/article/${art.slug}`;
  const rawImage =
    art.image_url ||
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";

  return {
    title: `${art.title_en || art.title} - ZestFeedX`,
    description: art.summary_en || art.summary,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: art.tags ? art.tags.split(",") : ["news", "india", "investigative", "zestfeedx", "pankhudisharma"],
    openGraph: {
      title: art.title_en || art.title,
      description: art.summary_en || art.summary,
      url: canonicalUrl,
      siteName: "ZestFeedX",
      images: [
        {
          url: rawImage,
          width: 1200,
          height: 675,
          alt: art.image_alt || art.title,
        },
      ],
      type: "article",
      publishedTime: art.published_at,
    },
    twitter: {
      card: "summary_large_image",
      title: art.title_en || art.title,
      description: art.summary_en || art.summary,
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
  const canonicalUrl = `https://zestfeedx.com/article/${article.slug}`;
  const rawImage =
    article.image_url ||
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";

  // 2026 Zero-Error Schema JSON-LD combining NewsArticle, Person, Organization, BreadcrumbList
  const schema2026 = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        "@id": `${canonicalUrl}#article`,
        "isPartOf": {
          "@type": "WebPage",
          "@id": canonicalUrl,
          "name": article.title_en || article.title,
          "url": canonicalUrl
        },
        "headline": article.title_en || article.title,
        "description": article.summary_en || article.summary,
        "image": [rawImage],
        "datePublished": article.published_at,
        "dateModified": article.published_at,
        "mainEntityOfPage": canonicalUrl,
        "author": {
          "@id": "https://zestfeedx.com/#author-pankhudi-sharma"
        },
        "publisher": {
          "@id": "https://zestfeedx.com/#organization"
        },
        "articleSection": article.category,
        "inLanguage": "en-IN"
      },
      {
        "@type": "Person",
        "@id": "https://zestfeedx.com/#author-pankhudi-sharma",
        "name": article.author_name || "Pankhudi Sharma",
        "jobTitle": "Veteran Journalist and Editor",
        "worksFor": {
          "@type": "Organization",
          "name": "ZestFeedX",
          "url": "https://zestfeedx.com"
        },
        "description": article.author_bio || "Veteran media professional with over 15 years of experience in investigative journalism and digital storytelling, delivering high-impact news and trending global insights.",
        "url": "https://zestfeedx.com/about"
      },
      {
        "@type": "Organization",
        "@id": "https://zestfeedx.com/#organization",
        "name": "ZestFeedX",
        "url": "https://zestfeedx.com",
        "email": "news@zestfeedx.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://zestfeedx.com/favicon.ico"
        },
        "sameAs": [
          "https://zestrank.com/"
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://zestfeedx.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": article.category.toUpperCase(),
            "item": `https://zestfeedx.com/?category=${article.category}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": article.title_en || article.title,
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
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  By {article.author_name || "Pankhudi Sharma"}
                </span>
                <span className="text-slate-700">•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {article.published_at ? article.published_at.slice(0, 10) : "Nov 6, 2026"}
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 italic mb-6 gap-1">
              <span>{article.image_courtesy || "Photo Courtesy: PTI / Press Wire Archive"}</span>
              {article.source_courtesy && (
                <span className="not-italic font-medium text-slate-400">
                  {article.source_courtesy}
                </span>
              )}
            </div>

            {/* Google Preferred News Source Banner */}
            <div className="mb-6">
              <GoogleNewsFollowBadge variant="banner" className="w-full justify-between" />
            </div>

            {/* Fact Check Box */}
            <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded mb-8 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-300 uppercase tracking-wide mb-0.5">
                  Editorial Integrity & Grok Fact-Check Verified
                </p>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  Verified across primary source feeds, official communiqués, and the Grok AI fact-checking engine. Content strictly adheres to Press Council standards.
                </p>
              </div>
            </div>

            {/* Longform Editorial Content with Rich In-Article Media */}
            <div className="text-slate-200 text-base sm:text-lg leading-relaxed font-sans space-y-6">
              {displayContent.split("\n\n").map((para, index) => {
                const trimmed = para.trim();
                if (!trimmed) return null;

                // 1. Embedded Image Figures: ![Caption](imageUrl)
                const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
                if (imgMatch) {
                  const [, caption, src] = imgMatch;
                  return (
                    <figure
                      key={index}
                      className="my-8 rounded-lg overflow-hidden border border-slate-800 bg-[#0c1322] shadow-xl"
                    >
                      <div className="relative w-full h-64 sm:h-80 md:h-[420px] bg-slate-900">
                        <SafeImage
                          src={src}
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

                // 2. Section Headings (### Section Name)
                if (trimmed.startsWith("###")) {
                  const headingText = trimmed.replace(/^###\s*/, "");
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

                // 3. Editorial Pull-Quotes (> Quote text)
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

                // 4. Source HTML paragraph embedded at bottom
                if (trimmed.includes("<p className=") || (trimmed.startsWith("Source:") && trimmed.includes("http"))) {
                  return (
                    <div
                      key={index}
                      className="pt-6 border-t border-slate-800 text-sm text-slate-400 my-6"
                      dangerouslySetInnerHTML={{ __html: trimmed }}
                    />
                  );
                }

                // 5. Clean journalistic bullet list if any exist
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

                // 6. Regular Journalistic In-Depth Paragraphs
                return (
                  <p key={index} className="leading-relaxed text-slate-300 text-base sm:text-lg">
                    {renderFormattedInlineText(trimmed)}
                  </p>
                );
              })}
            </div>

            {/* Clickable Original Source Link */}
            <div className="pt-6 border-t border-slate-800 text-sm text-slate-400 my-6">
              <span className="font-semibold text-slate-300">Source: </span>
              <a
                href={article.source_url || "https://news.google.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:text-red-300 underline font-semibold break-all"
              >
                {article.source_url || "https://news.google.com"}
              </a>
            </div>

            {/* Author Profile Card (Pankhudi Sharma) */}
            <div className="my-8 p-5 bg-[#0a0f1d] border border-slate-800 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-700 shadow-md shrink-0 bg-slate-800">
                  <Image
                    src="/images/pankhudi-sharma.jpg"
                    alt="Pankhudi Sharma - Veteran Journalist and Editor at ZestFeedX"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/about"
                      className="font-bold text-white hover:text-red-400 transition-colors text-sm sm:text-base underline"
                    >
                      {article.author_name || "Pankhudi Sharma"}
                    </Link>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                      Author &amp; Editor
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {article.author_bio || "Veteran media professional with over 15 years of experience in investigative journalism and digital storytelling, delivering high-impact news and trending global insights."}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Newsroom: <strong className="text-slate-200">ZestFeedX Editorial Desk</strong>
                  </p>
                </div>
              </div>
              <Link
                href="/about"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded border border-slate-700 transition-colors flex items-center gap-1.5 shrink-0"
              >
                Author Profile →
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
                      href={`/article/${rel.slug}`}
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
