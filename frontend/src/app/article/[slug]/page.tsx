import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";
import {
  Clock,
  Calendar,
  Share2,
  Bookmark,
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { OriginalArticle } from "@/data/demoContent";
import { getArticleBySlug, getAllPublishedArticles } from "@/db/queries/articles";
import { formatISTDate } from "@/lib/utils";
import ReadingProgressBar from "./ReadingProgressBar";
import ArticleShareBar from "./ArticleShareBar";
import ReaderCounter from "@/components/ReaderCounter";
import AiSummarizer from "@/components/AiSummarizer";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const all = await getAllPublishedArticles();
  return all.map((a) => ({
    slug: a.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | ZestFeedX",
      description: "Verified investigative journalism and macro analysis.",
    };
  }

  const canonicalUrl = `https://zestfeedx.com/article/${article.slug}`;

  return {
    title: `${article.title} | ZestFeedX`,
    description: article.deck,
    authors: [{ name: article.author.name, url: `https://zestfeedx.com/author/${article.author.slug}` }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.deck,
      url: canonicalUrl,
      type: "article",
      publishedTime: article.published_at,
      authors: [article.author.name],
      images: [
        {
          url: article.hero_image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.deck,
      images: [article.hero_image],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = await getAllPublishedArticles();
  const related = allArticles.filter((a) => a.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.deck,
    image: [article.hero_image],
    datePublished: article.published_at,
    dateModified: article.published_at,
    author: {
      "@type": "Person",
      name: article.author.name,
      jobTitle: article.author.role,
      url: `https://zestfeedx.com/author/${article.author.slug}`,
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "ZestFeedX",
      url: "https://zestfeedx.com",
      logo: {
        "@type": "ImageObject",
        url: "https://zestfeedx.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://zestfeedx.com/article/${article.slug}`,
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] dark:bg-[#080C16] text-[#0B1020] dark:text-[#F1F5F9] transition-colors">
      {/* Scroll Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main Article Container */}
      <main className="flex-1 py-8">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1.5 text-xs text-[#525866] dark:text-[#94A3B8]">
              <li>
                <Link href="/" className="hover:text-[#0B1020] dark:hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3 h-3 text-[#DDD7CD] dark:text-[#334155]" />
              </li>
              <li>
                <Link
                  href={`/#${article.category}`}
                  className="hover:text-[#0B1020] dark:hover:text-white uppercase font-bold text-[10px] text-[#0E7C86]"
                >
                  {article.category}
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3 h-3 text-[#DDD7CD] dark:text-[#334155]" />
              </li>
              <li className="truncate max-w-[200px] text-[#94A3B8]">Report</li>
            </ol>
          </nav>

          {/* Article Header */}
          <header className="mb-6">
            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B1020] dark:text-[#F1F5F9] leading-[1.15]">
              {article.title}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[#525866] dark:text-[#94A3B8] leading-relaxed">
              {article.deck}
            </p>

            {/* Author Byline & Metadata Strip */}
            <div className="mt-6 pt-4 pb-4 border-y border-[#E8E4DC] dark:border-[#1E293B] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#DDD7CD] dark:border-[#334155] shrink-0">
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <Link
                    href={`/author/${article.author.slug}`}
                    className="font-display text-sm font-bold text-[#0B1020] dark:text-[#F1F5F9] hover:underline"
                  >
                    {article.author.name}
                  </Link>
                  <p className="text-[11px] text-[#525866] dark:text-[#94A3B8]">
                    {article.author.role}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:items-end text-xs text-[#525866] dark:text-[#94A3B8]">
                <div className="flex items-center gap-1 font-mono font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#FF5A1F]" />
                  <span>Published {formatISTDate(article.published_at)}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.reading_time_mins} min read</span>
                  </span>
                  <span>•</span>
                  <span>{article.word_count} words</span>
                </div>
                <div className="mt-1.5">
                  <ReaderCounter slug={article.slug} />
                </div>
              </div>
            </div>

            {/* Interactive Share & Bookmark Bar */}
            <ArticleShareBar title={article.title} url={`https://zestfeedx.com/article/${article.slug}`} />

            {/* AI Animated & Highlighted Article Summarizer */}
            <AiSummarizer
              title={article.title}
              deck={article.deck}
              takeaways={article.key_takeaways}
              whyItMatters={article.why_it_matters}
              category={article.category}
              wordCount={article.word_count}
            />
          </header>

          {/* Hero Image */}
          <figure className="mb-8">
            <div className="relative w-full aspect-16/9 rounded-lg overflow-hidden bg-[#ECE7DE] dark:bg-[#1E293B]">
              <Image
                src={article.hero_image}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
            </div>
            <figcaption className="text-xs text-[#525866] dark:text-[#94A3B8] mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E4DC] dark:border-[#1E293B] pb-2">
              <span>{article.hero_image_caption}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-[10px] text-[#94A3B8] dark:text-[#64748B]">
                  Photo Source: {article.hero_image_credit}
                </span>
                {article.citations && article.citations.length > 0 && article.citations[0].url && (
                  <a
                    href={article.citations[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-semibold text-[#FF5A1F] hover:underline flex items-center gap-0.5"
                    title="View original primary source report"
                  >
                    <span>Source Link</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </figcaption>
          </figure>

          {/* Key Takeaways Box */}
          <section
            aria-label="Key Takeaways"
            className="mb-8 p-5 sm:p-6 bg-[#F6F2EA] dark:bg-[#0F172A] border-l-4 border-[#FF5A1F] rounded-r-lg"
          >
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-[#FF5A1F]" />
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-[#0B1020] dark:text-[#F1F5F9]">
                Executive Takeaways
              </h2>
            </div>
            <ul className="space-y-2.5">
              {article.key_takeaways.map((point, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#0B1020] dark:text-[#F1F5F9] leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-[#0E7C86] shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Article Main Text Content */}
          <div className="text-base leading-relaxed text-[#0B1020] dark:text-[#F1F5F9] space-y-6 first-letter-dropcap">
            {article.content_markdown
              .trim()
              .replace(/â€”/g, "—")
              .replace(/âš¡/g, "⚡")
              .replace(/communiquÃ©s/g, "communiqués")
              .split("\n\n")
              .map((rawBlock, i) => {
                const block = rawBlock.trim();
                if (block.startsWith("## ")) {
                  return (
                    <h2
                      key={i}
                      className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1020] dark:text-[#F1F5F9] pt-6 pb-2 border-b border-[#E8E4DC] dark:border-[#1E293B]"
                    >
                      {block.replace("## ", "")}
                    </h2>
                  );
                }
                if (block.startsWith("### ")) {
                  return (
                    <h3
                      key={i}
                      className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#FF5A1F] dark:text-[#FF5A1F] pt-4"
                    >
                      {block.replace("### ", "")}
                    </h3>
                  );
                }
                if (block.startsWith("> ")) {
                  return (
                    <blockquote
                      key={i}
                      className="border-l-4 border-[#FF5A1F] pl-4 italic text-sm sm:text-base text-[#525866] dark:text-[#94A3B8] my-4 bg-[#F6F2EA]/60 dark:bg-[#1E293B]/40 py-2 rounded-r"
                    >
                      {block.replace(/> /g, "").replace(/\n/g, " ")}
                    </blockquote>
                  );
                }
                if (block.includes("|") && block.includes("---")) {
                  const lines = block.split("\n").filter((l) => l.trim().startsWith("|"));
                  if (lines.length >= 2) {
                    const headers = lines[0].split("|").map((c) => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
                    const rows = lines.slice(2).map((l) => l.split("|").map((c) => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1));
                    return (
                      <div key={i} className="my-6 overflow-x-auto rounded-lg border border-[#E8E4DC] dark:border-[#1E293B]">
                        <table className="w-full text-left text-xs sm:text-sm">
                          <thead className="bg-[#ECE7DE] dark:bg-[#1E293B] text-[#0B1020] dark:text-[#F1F5F9] font-bold">
                            <tr>
                              {headers.map((h, hi) => (
                                <th key={hi} className="p-3 border-b border-[#E8E4DC] dark:border-[#334155]">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E8E4DC] dark:divide-[#1E293B]">
                            {rows.map((row, ri) => (
                              <tr key={ri} className={ri % 2 === 0 ? "bg-white dark:bg-[#080C16]" : "bg-[#FAF8F4] dark:bg-[#0F172A]"}>
                                {row.map((cell, ci) => (
                                  <td key={ci} className="p-3 font-medium text-[#525866] dark:text-[#94A3B8]">
                                    {cell.replace(/\*\*(.*?)\*\*/g, "$1")}
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
                // Paragraph with bold parsing
                const parts = block.split(/(\*\*.*?\*\*)/g);
                return (
                  <p key={i} className="text-sm sm:text-base leading-relaxed">
                    {parts.map((p, pi) => {
                      if (p.startsWith("**") && p.endsWith("**")) {
                        return <strong key={pi} className="font-semibold text-[#0B1020] dark:text-[#F1F5F9]">{p.slice(2, -2)}</strong>;
                      }
                      return p;
                    })}
                  </p>
                );
              })}
          </div>

          {/* Reserved In-Article Ad Slot (Zero CLS) */}
          <div className="my-8">
            <AdSlot format="leaderboard" slotId="article-inline-leaderboard" />
          </div>

          {/* "Why This Matters" Editorial Box */}
          <section className="my-8 p-5 bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-lg">
            <h3 className="font-display text-base font-bold text-[#FF5A1F] uppercase tracking-wider mb-2">
              Why This Matters
            </h3>
            <p className="text-xs sm:text-sm text-[#525866] dark:text-[#94A3B8] leading-relaxed">
              {article.why_it_matters}
            </p>
          </section>

          {/* Transparent Citations & Official Sources */}
          {article.citations.length > 0 && (
            <section className="my-8 p-4 bg-[#FAF8F4] dark:bg-[#080C16] border border-[#E8E4DC] dark:border-[#1E293B] rounded-lg">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#0B1020] dark:text-[#F1F5F9] mb-2.5">
                Primary Sources & Citations
              </h4>
              <ul className="space-y-1.5 text-xs">
                {article.citations.map((c, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="text-[#0E7C86] font-mono text-[10px]">[{i + 1}]</span>
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF5A1F] hover:underline flex items-center gap-1"
                    >
                      <span>{c.label} ({c.publisher})</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Author Bio Box */}
          <section className="my-10 p-6 bg-[#F6F2EA] dark:bg-[#0F172A] border border-[#E0D8CB] dark:border-[#1E293B] rounded-xl flex flex-col sm:flex-row items-start gap-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-[#FF5A1F]">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display text-base font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                    About {article.author.name}
                  </h4>
                  <p className="text-[11px] text-[#0E7C86] font-semibold">{article.author.role}</p>
                </div>
                <Link
                  href={`/author/${article.author.slug}`}
                  className="text-xs font-bold text-[#FF5A1F] hover:underline"
                >
                  View Desk Archive →
                </Link>
              </div>
              <p className="mt-2 text-xs text-[#525866] dark:text-[#94A3B8] leading-relaxed">
                {article.author.bio}
              </p>
            </div>
          </section>

          {/* Related Stories */}
          {related.length > 0 && (
            <section className="my-12 pt-8 border-t-2 border-[#0B1020] dark:border-[#F1F5F9]">
              <h3 className="font-display text-xl font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-6">
                Related Investigative Dispatches
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {related.map((rel) => (
                  <article key={rel.id} className="group">
                    <Link
                      href={`/article/${rel.slug}`}
                      className="relative w-full aspect-16/10 rounded-md overflow-hidden bg-[#ECE7DE] dark:bg-[#1E293B] block mb-2.5"
                    >
                      <Image
                        src={rel.hero_image}
                        alt={rel.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <span className="text-[10px] font-bold uppercase text-[#0E7C86]">
                      {rel.category}
                    </span>
                    <Link href={`/article/${rel.slug}`} className="block">
                      <h4 className="font-display text-xs font-bold text-[#0B1020] dark:text-[#F1F5F9] group-hover:text-[#FF5A1F] transition-colors leading-snug line-clamp-2 mt-1">
                        {rel.title}
                      </h4>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
