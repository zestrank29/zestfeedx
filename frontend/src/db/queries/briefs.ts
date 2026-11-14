import { db, schema, isDatabaseConfigured } from "@/db";
import { eq, desc } from "drizzle-orm";
import { CURATED_BRIEFS, CuratedBrief } from "@/data/demoContent";

export async function getCuratedBriefs(limit = 10, categorySlug?: string): Promise<CuratedBrief[]> {
  if (isDatabaseConfigured && db) {
    try {
      let query = db
        .select({
          brief: schema.curatedBriefs,
          category: schema.categories,
        })
        .from(schema.curatedBriefs)
        .innerJoin(schema.categories, eq(schema.curatedBriefs.categoryId, schema.categories.id))
        .orderBy(desc(schema.curatedBriefs.publishedAt))
        .limit(limit);

      const records = await query;
      if (records && records.length > 0) {
        return records.map(({ brief: b, category: cat }) => ({
          id: b.id,
          title: b.title,
          title_hi: b.titleHi || undefined,
          summary: b.summary,
          source_name: b.sourceName,
          source_url: b.sourceUrl,
          published_at: b.publishedAt.toISOString(),
          category: cat.slug as any,
        }));
      }
    } catch (err) {
      console.warn("DB query for briefs failed, falling back to static:", err);
    }
  }

  if (categorySlug && categorySlug !== "all") {
    return CURATED_BRIEFS.filter((b) => b.category === categorySlug).slice(0, limit);
  }
  return CURATED_BRIEFS.slice(0, limit);
}

export async function isBriefUrlHashExists(hash: string): Promise<boolean> {
  if (isDatabaseConfigured && db) {
    try {
      const records = await db
        .select({ id: schema.curatedBriefs.id })
        .from(schema.curatedBriefs)
        .where(eq(schema.curatedBriefs.sourceUrlHash, hash))
        .limit(1);

      return records.length > 0;
    } catch (err) {
      console.warn("Dedupe hash check failed:", err);
    }
  }
  return false;
}
