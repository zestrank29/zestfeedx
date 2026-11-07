import { NextRequest, NextResponse } from "next/server";
import { SEED_ARTICLES } from "@/data/seedArticles";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // 1. Try local backend first
  try {
    const backendRes = await fetch(`http://127.0.0.1:8000/api/news/${slug}`, {
      cache: "no-store",
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data);
    }
  } catch {
    // Backend offline / deployed standalone
  }

  // 2. Fallback to resilient seed database
  const article = SEED_ARTICLES.find((a) => a.slug === slug);
  if (!article) {
    return NextResponse.json({ detail: "Article not found" }, { status: 404 });
  }

  const related = SEED_ARTICLES.filter((a) => a.slug !== slug).slice(0, 3);

  return NextResponse.json({
    article,
    related
  });
}
