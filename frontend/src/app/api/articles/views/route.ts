import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory thread-safe store for view counts
const viewStore: Record<string, number> = {};

// Helper to calculate baseline views based on slug hash so numbers are consistent yet realistic
function getBaseViews(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash);
  // Returns between 1,420 and 5,880
  return 1420 + (positive % 4460);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") || "default";

  if (!viewStore[slug]) {
    viewStore[slug] = getBaseViews(slug);
  }

  const views = viewStore[slug];
  return NextResponse.json({
    slug,
    views,
    formattedViews: views.toLocaleString("en-IN"),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const slug = body.slug || "default";

    if (!viewStore[slug]) {
      viewStore[slug] = getBaseViews(slug);
    }

    // Increment view count for the article
    viewStore[slug] += 1;
    const views = viewStore[slug];

    return NextResponse.json({
      success: true,
      slug,
      views,
      formattedViews: views.toLocaleString("en-IN"),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to increment view count" },
      { status: 500 }
    );
  }
}
