import { NextRequest, NextResponse } from "next/server";
import { SEED_ARTICLES } from "@/data/seedArticles";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "8", 10);

  // 1. Try local backend first
  try {
    const backendRes = await fetch(`http://127.0.0.1:8000/api/news?${searchParams.toString()}`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" }
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data && data.items && data.items.length > 0) {
        return NextResponse.json(data);
      }
    }
  } catch {
    // Backend offline / deployed standalone
  }

  // 2. Fallback to resilient seed database
  let items = [...SEED_ARTICLES];

  if (category && category !== "all") {
    items = items.filter((art) => art.category.toLowerCase() === category.toLowerCase());
  }

  if (search && search.trim()) {
    const q = search.toLowerCase();
    items = items.filter((art) =>
      art.title.toLowerCase().includes(q) ||
      art.content.toLowerCase().includes(q) ||
      (art.tags && art.tags.toLowerCase().includes(q))
    );
  }

  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginated = items.slice(offset, offset + limit);

  return NextResponse.json({
    items: paginated,
    total,
    page,
    limit,
    total_pages: totalPages,
    has_more: page < totalPages
  });
}
