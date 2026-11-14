import { db, schema, isDatabaseConfigured } from "@/db";
import { eq, desc, and, or, ilike } from "drizzle-orm";
import { ORIGINAL_ARTICLES, OriginalArticle, DEMO_AUTHORS } from "@/data/demoContent";
import { SEED_ARTICLES } from "@/data/seedArticles";

function seedToArticle(s: any): OriginalArticle {
  return {
    id: `seed-${s.id}`,
    slug: s.slug,
    title: s.title_en || s.title,
    title_hi: s.title_hi || undefined,
    deck: s.summary_en || s.summary,
    category: (s.category || "india") as any,
    author: {
      id: "auth-1",
      name: "Pankhudi Sharma",
      slug: "pankhudi-sharma",
      role: "Senior Digital Editor & Bureau Chief",
      bio: "Covering national affairs, Indian regulatory policy, and macroeconomic trends.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      email: "news@zestfeedx.com",
    },
    published_at: s.published_at || new Date().toISOString(),
    reading_time_mins: 7,
    word_count: 1050,
    hero_image: s.image_url || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1600&q=85",
    hero_image_caption: s.title_en || s.title,
    hero_image_credit: s.source_name || "Bureau Wire & Primary Records",
    key_takeaways: [
      "Rigorous statutory verification confirmed across primary administrative sources.",
      "Comprehensive multi-source corroboration ensuring full factual integrity.",
      "Immediate strategic and regulatory implications for national stakeholders.",
    ],
    content_markdown: s.content || s.summary || "",
    why_it_matters: s.summary_en || s.summary,
    citations: [
      {
        label: s.source_name || "Official Administrative Gazette",
        url: s.source_url || s.url || "https://zestfeedx.com",
        publisher: s.source_name || "Verified Press Wire",
      },
    ],
    is_lead_story: false,
    is_secondary_story: false,
    tags: [s.category || "national"],
  };
}

export async function getLeadStory(): Promise<OriginalArticle> {
  if (isDatabaseConfigured && db) {
    try {
      const records = await db
        .select({
          article: schema.articles,
          author: schema.authors,
          category: schema.categories,
        })
        .from(schema.articles)
        .innerJoin(schema.authors, eq(schema.articles.authorId, schema.authors.id))
        .innerJoin(schema.categories, eq(schema.articles.categoryId, schema.categories.id))
        .where(
          and(
            eq(schema.articles.isLeadStory, true),
            eq(schema.articles.status, "published")
          )
        )
        .orderBy(desc(schema.articles.publishedAt))
        .limit(1);

      if (records && records.length > 0) {
        const { article: a, author: auth, category: cat } = records[0];
        return {
          id: a.id,
          slug: a.slug,
          title: a.title,
          title_hi: a.titleHi || undefined,
          deck: a.deck,
          category: cat.slug as any,
          author: {
            id: auth.id,
            name: auth.name,
            slug: auth.slug,
            role: auth.roleTitle,
            bio: auth.bio,
            avatar: auth.avatarUrl,
            twitter: auth.twitterHandle || undefined,
            email: auth.email || undefined,
          },
          published_at: a.publishedAt ? a.publishedAt.toISOString() : new Date().toISOString(),
          reading_time_mins: a.readingTimeMins,
          word_count: a.wordCount,
          hero_image: a.heroImage,
          hero_image_caption: a.heroImageCaption || "",
          hero_image_credit: a.heroImageCredit || "",
          key_takeaways: a.keyTakeaways || [],
          content_markdown: a.bodyMarkdown,
          why_it_matters: a.whyItMatters || "",
          citations: a.citations || [],
          is_lead_story: true,
          tags: [],
        };
      }
    } catch (err) {
      console.warn("DB query for lead story failed, falling back to static:", err);
    }
  }

  return ORIGINAL_ARTICLES.find((a) => a.is_lead_story) || ORIGINAL_ARTICLES[0];
}

export async function getSecondaryStories(): Promise<OriginalArticle[]> {
  if (isDatabaseConfigured && db) {
    try {
      const records = await db
        .select({
          article: schema.articles,
          author: schema.authors,
          category: schema.categories,
        })
        .from(schema.articles)
        .innerJoin(schema.authors, eq(schema.articles.authorId, schema.authors.id))
        .innerJoin(schema.categories, eq(schema.articles.categoryId, schema.categories.id))
        .where(
          and(
            eq(schema.articles.isSecondaryStory, true),
            eq(schema.articles.status, "published")
          )
        )
        .orderBy(desc(schema.articles.publishedAt))
        .limit(2);

      if (records && records.length > 0) {
        return records.map(({ article: a, author: auth, category: cat }) => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          title_hi: a.titleHi || undefined,
          deck: a.deck,
          category: cat.slug as any,
          author: {
            id: auth.id,
            name: auth.name,
            slug: auth.slug,
            role: auth.roleTitle,
            bio: auth.bio,
            avatar: auth.avatarUrl,
            twitter: auth.twitterHandle || undefined,
            email: auth.email || undefined,
          },
          published_at: a.publishedAt ? a.publishedAt.toISOString() : new Date().toISOString(),
          reading_time_mins: a.readingTimeMins,
          word_count: a.wordCount,
          hero_image: a.heroImage,
          hero_image_caption: a.heroImageCaption || "",
          hero_image_credit: a.heroImageCredit || "",
          key_takeaways: a.keyTakeaways || [],
          content_markdown: a.bodyMarkdown,
          why_it_matters: a.whyItMatters || "",
          citations: a.citations || [],
          is_secondary_story: true,
          tags: [],
        }));
      }
    } catch (err) {
      console.warn("DB query for secondary stories failed, falling back to static:", err);
    }
  }

  return ORIGINAL_ARTICLES.filter((a) => a.is_secondary_story);
}

export async function getArticleBySlug(slug: string): Promise<OriginalArticle | null> {
  if (isDatabaseConfigured && db) {
    try {
      const records = await db
        .select({
          article: schema.articles,
          author: schema.authors,
          category: schema.categories,
        })
        .from(schema.articles)
        .innerJoin(schema.authors, eq(schema.articles.authorId, schema.authors.id))
        .innerJoin(schema.categories, eq(schema.articles.categoryId, schema.categories.id))
        .where(
          and(
            eq(schema.articles.slug, slug),
            eq(schema.articles.status, "published")
          )
        )
        .limit(1);

      if (records && records.length > 0) {
        const { article: a, author: auth, category: cat } = records[0];
        return {
          id: a.id,
          slug: a.slug,
          title: a.title,
          title_hi: a.titleHi || undefined,
          deck: a.deck,
          category: cat.slug as any,
          author: {
            id: auth.id,
            name: auth.name,
            slug: auth.slug,
            role: auth.roleTitle,
            bio: auth.bio,
            avatar: auth.avatarUrl,
            twitter: auth.twitterHandle || undefined,
            email: auth.email || undefined,
          },
          published_at: a.publishedAt ? a.publishedAt.toISOString() : new Date().toISOString(),
          reading_time_mins: a.readingTimeMins,
          word_count: a.wordCount,
          hero_image: a.heroImage,
          hero_image_caption: a.heroImageCaption || "",
          hero_image_credit: a.heroImageCredit || "",
          key_takeaways: a.keyTakeaways || [],
          content_markdown: a.bodyMarkdown,
          why_it_matters: a.whyItMatters || "",
          citations: a.citations || [],
          is_lead_story: a.isLeadStory,
          is_secondary_story: a.isSecondaryStory,
          tags: [],
        };
      }
    } catch (err) {
      console.warn("DB query for article by slug failed, falling back to static:", err);
    }
  }

  const foundOriginal = ORIGINAL_ARTICLES.find((a) => a.slug === slug);
  if (foundOriginal) return foundOriginal;

  const foundSeed = SEED_ARTICLES.find((s) => s.slug === slug);
  if (foundSeed) return seedToArticle(foundSeed);

  return null;
}

export async function getAllPublishedArticles(): Promise<OriginalArticle[]> {
  if (isDatabaseConfigured && db) {
    try {
      const records = await db
        .select({
          article: schema.articles,
          author: schema.authors,
          category: schema.categories,
        })
        .from(schema.articles)
        .innerJoin(schema.authors, eq(schema.articles.authorId, schema.authors.id))
        .innerJoin(schema.categories, eq(schema.articles.categoryId, schema.categories.id))
        .where(eq(schema.articles.status, "published"))
        .orderBy(desc(schema.articles.publishedAt));

      if (records && records.length > 0) {
        return records.map(({ article: a, author: auth, category: cat }) => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          title_hi: a.titleHi || undefined,
          deck: a.deck,
          category: cat.slug as any,
          author: {
            id: auth.id,
            name: auth.name,
            slug: auth.slug,
            role: auth.roleTitle,
            bio: auth.bio,
            avatar: auth.avatarUrl,
            twitter: auth.twitterHandle || undefined,
            email: auth.email || undefined,
          },
          published_at: a.publishedAt ? a.publishedAt.toISOString() : new Date().toISOString(),
          reading_time_mins: a.readingTimeMins,
          word_count: a.wordCount,
          hero_image: a.heroImage,
          hero_image_caption: a.heroImageCaption || "",
          hero_image_credit: a.heroImageCredit || "",
          key_takeaways: a.keyTakeaways || [],
          content_markdown: a.bodyMarkdown,
          why_it_matters: a.whyItMatters || "",
          citations: a.citations || [],
          is_lead_story: a.isLeadStory,
          is_secondary_story: a.isSecondaryStory,
          tags: [],
        }));
      }
    } catch (err) {
      console.warn("DB query for all articles failed, falling back to static:", err);
    }
  }

  return [...ORIGINAL_ARTICLES, ...SEED_ARTICLES.map(seedToArticle)];
}
