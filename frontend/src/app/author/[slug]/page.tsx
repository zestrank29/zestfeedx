import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Mail, Globe, ShieldCheck, ArrowLeft, BookOpen, Clock, Calendar, ChevronRight } from "lucide-react";
import Footer from "@/components/Footer";
import { DEMO_AUTHORS, Author } from "@/data/demoContent";
import { SEED_ARTICLES } from "@/data/seedArticles";
import { ORIGINAL_ARTICLES } from "@/data/demoContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return [
    { slug: "pankhudi-sharma" },
    { slug: "rohan-sen" },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const authorKey = Object.keys(DEMO_AUTHORS).find((k) => DEMO_AUTHORS[k].slug === slug);
  const author: Author = authorKey
    ? DEMO_AUTHORS[authorKey]
    : {
        id: "auth-default",
        name: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        slug,
        role: "Senior Digital Editor & Investigative Lead",
        bio: "Senior journalist and investigative reporter leading digital coverage across Indian national policy, economic intelligence, and cultural affairs.",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        email: "news@zestfeedx.com",
      };

  const canonicalUrl = `https://zestfeedx.com/author/${author.slug}/`;

  return {
    title: `${author.name} | Senior Editorial Desk | ZestFeedX`,
    description: author.bio,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${author.name} — ZestFeedX Editorial Desk`,
      description: author.bio,
      url: canonicalUrl,
      type: "profile",
      images: [
        {
          url: author.avatar,
          width: 400,
          height: 400,
          alt: author.name,
        },
      ],
    },
  };
}

export default async function AuthorProfilePage({ params }: Props) {
  const { slug } = await params;
  const authorKey = Object.keys(DEMO_AUTHORS).find((k) => DEMO_AUTHORS[k].slug === slug);

  const author: Author = authorKey
    ? DEMO_AUTHORS[authorKey]
    : {
        id: "auth-default",
        name: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        slug,
        role: "Senior Digital Editor & Macro Lead",
        bio: "Senior journalist covering Indian economic policy, regulatory frameworks, and national dispatches. Based in New Delhi, leading investigative desk reporting for ZestFeedX.",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        email: "news@zestfeedx.com",
        twitter: "https://twitter.com/zestfeedx",
      };

  // Find articles published by this author
  const originalArticles = ORIGINAL_ARTICLES.filter(
    (a) => a.author.slug === author.slug || author.slug === "pankhudi-sharma"
  );
  const seedArticles = SEED_ARTICLES.slice(0, 18);

  const authorJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.role,
    worksFor: {
      "@type": "NewsMediaOrganization",
      name: "ZestFeedX",
      url: "https://zestfeedx.com/",
    },
    description: author.bio,
    image: author.avatar,
    email: author.email || "news@zestfeedx.com",
    sameAs: author.twitter ? [author.twitter] : ["https://twitter.com/zestfeedx"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorJsonLd) }}
      />

      <main className="min-h-screen bg-[#FDFBF7] dark:bg-[#080C16] text-[#0B1020] dark:text-[#F1F5F9] pb-24">
        {/* Breadcrumb Navigation */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link href="/about" className="hover:text-red-600 transition-colors">
              Editorial Desk
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">{author.name}</span>
          </nav>
        </div>

        {/* Author Bio Header Card */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
          <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 border-2 border-red-500/80 shadow-md">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  fill
                  sizes="(max-width: 640px) 112px, 144px"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300 mb-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                  Verified ZestFeedX Editorial Byline
                </div>

                <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight mb-2 text-slate-950 dark:text-white">
                  {author.name}
                </h1>

                <p className="text-sm sm:text-base font-semibold text-teal-700 dark:text-teal-400 mb-3">
                  {author.role}
                </p>

                <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 max-w-3xl mb-5">
                  {author.bio}
                </p>

                {/* Contact & Verification Row */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                  <a
                    href="mailto:news@zestfeedx.com"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0e172a] text-slate-700 dark:text-slate-300 hover:border-red-500 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-red-500" />
                    <span>news@zestfeedx.com</span>
                  </a>

                  {author.twitter && (
                    <a
                      href={author.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0e172a] text-slate-700 dark:text-slate-300 hover:border-red-500 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 text-sky-500" />
                      <span>Follow on X</span>
                    </a>
                  )}

                  <Link
                    href="/editorial-policy"
                    className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:underline"
                  >
                    <span>Editorial Standards & Fact-Check Policy &rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Investigative Reports Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
          <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-slate-900 dark:border-slate-100">
            <h2 className="text-lg sm:text-xl font-serif font-bold tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-red-600" />
              Flagship Investigative Reports
            </h2>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
              Peer-Reviewed Dispatches
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {originalArticles.map((art) => (
              <article
                key={art.id}
                className="group p-5 rounded-xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 hover:border-red-500/70 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4 bg-slate-100 dark:bg-slate-900">
                    <Image
                      src={art.hero_image}
                      alt={art.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/80 text-white backdrop-blur-sm">
                      {art.category}
                    </div>
                  </div>

                  <Link href={`/article/${art.slug}`}>
                    <h3 className="font-serif font-bold text-lg leading-snug group-hover:text-red-600 transition-colors mb-2 text-slate-900 dark:text-white">
                      {art.title}
                    </h3>
                  </Link>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                    {art.deck}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {art.reading_time_mins} min read
                  </span>
                  <Link
                    href={`/article/${art.slug}`}
                    className="font-sans font-bold text-red-600 hover:underline"
                  >
                    Read Analysis &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Daily Dispatches Archive */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-300 dark:border-slate-800">
            <h2 className="text-base sm:text-lg font-serif font-bold tracking-tight">
              Recent Verified Dispatches ({seedArticles.length})
            </h2>
            <span className="text-xs font-mono text-slate-500">Desk Coverage Archive</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {seedArticles.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 hover:border-slate-400 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full h-36 rounded-lg overflow-hidden mb-3 bg-slate-100 dark:bg-slate-900">
                    <Image
                      src={s.image_url}
                      alt={s.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <Link href={`/article/${s.slug}`}>
                    <h3 className="font-serif font-bold text-sm sm:text-base leading-snug hover:text-red-600 transition-colors line-clamp-2 mb-2 text-slate-900 dark:text-white">
                      {s.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                    {s.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-500">
                  <span>{s.category.toUpperCase()}</span>
                  <Link href={`/article/${s.slug}`} className="text-red-600 font-sans font-semibold hover:underline">
                    Read &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
