import { db, schema, isDatabaseConfigured } from "@/db";
import { eq, asc } from "drizzle-orm";
import { CATEGORIES } from "@/components/Masthead";

export interface CategoryData {
  id: string;
  slug: string;
  nameEn: string;
  nameHi: string | null;
  description: string | null;
  displayOrder: number;
}

export async function getAllCategories(): Promise<CategoryData[]> {
  if (isDatabaseConfigured && db) {
    try {
      const records = await db
        .select()
        .from(schema.categories)
        .orderBy(asc(schema.categories.displayOrder));
      if (records && records.length > 0) {
        return records;
      }
    } catch (err) {
      console.warn("DB query for categories failed, falling back to static config:", err);
    }
  }

  // Fallback to static category registry
  return CATEGORIES.map((cat, idx) => ({
    id: `cat-${cat.id}`,
    slug: cat.id,
    nameEn: cat.label,
    nameHi: cat.label_hi,
    description: `Verified reporting on ${cat.label} for India and diaspora readers.`,
    displayOrder: idx,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<CategoryData | null> {
  const all = await getAllCategories();
  return all.find((c) => c.slug.toLowerCase() === slug.toLowerCase()) || null;
}
