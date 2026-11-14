import { db, schema, isDatabaseConfigured } from "@/db";
import { eq } from "drizzle-orm";
import { DEMO_AUTHORS, Author } from "@/data/demoContent";

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  if (isDatabaseConfigured && db) {
    try {
      const records = await db
        .select()
        .from(schema.authors)
        .where(eq(schema.authors.slug, slug))
        .limit(1);

      if (records && records.length > 0) {
        const a = records[0];
        return {
          id: a.id,
          name: a.name,
          slug: a.slug,
          role: a.roleTitle,
          bio: a.bio,
          avatar: a.avatarUrl,
          twitter: a.twitterHandle || undefined,
          email: a.email || undefined,
        };
      }
    } catch (err) {
      console.warn("DB query for author failed, falling back to static:", err);
    }
  }

  // Fallback to demo authors
  const found = Object.values(DEMO_AUTHORS).find((a) => a.slug === slug);
  return found || null;
}

export async function getAllAuthors(): Promise<Author[]> {
  if (isDatabaseConfigured && db) {
    try {
      const records = await db
        .select()
        .from(schema.authors)
        .where(eq(schema.authors.isActive, true));

      if (records && records.length > 0) {
        return records.map((a) => ({
          id: a.id,
          name: a.name,
          slug: a.slug,
          role: a.roleTitle,
          bio: a.bio,
          avatar: a.avatarUrl,
          twitter: a.twitterHandle || undefined,
          email: a.email || undefined,
        }));
      }
    } catch (err) {
      console.warn("DB query for authors failed, falling back to static:", err);
    }
  }

  return Object.values(DEMO_AUTHORS);
}
