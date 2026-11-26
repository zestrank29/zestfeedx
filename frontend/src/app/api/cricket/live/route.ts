import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface LiveCricketMatch {
  id: string;
  title: string;
  teamA: string;
  teamB: string;
  isLive: boolean;
  link: string;
}

function decodeXmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function parseRssItems(xml: string): LiveCricketMatch[] {
  const matches: LiveCricketMatch[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let m: RegExpExecArray | null;
  let idx = 0;

  while ((m = itemRegex.exec(xml)) !== null) {
    const block = m[1];
    const titleMatch = block.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
    const linkMatch = block.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
    const guidMatch = block.match(/<guid[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/guid>/i);

    const rawTitle = titleMatch ? decodeXmlEntities(titleMatch[1]) : "";
    const link = linkMatch ? decodeXmlEntities(linkMatch[1]) : "https://www.espncricinfo.com/live-cricket-score";
    const id = guidMatch ? decodeXmlEntities(guidMatch[1]) : `match-${idx}`;

    if (!rawTitle) continue;
    const isLive = rawTitle.includes("*");
    const parts = rawTitle.split(/\s+v\s+/i);
    const teamA = (parts[0] || rawTitle).trim();
    const teamB = (parts[1] || "").trim();

    matches.push({
      id: `${id}-${idx}`,
      title: rawTitle,
      teamA,
      teamB,
      isLive,
      link,
    });
    idx++;
  }

  return matches;
}

export async function GET() {
  try {
    const res = await fetch("https://static.cricinfo.com/rss/livescores.xml", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      throw new Error(`Feed returned ${res.status}`);
    }

    const xml = await res.text();
    const matches = parseRssItems(xml);

    // Sort live matches (with *) first
    matches.sort((a, b) => Number(b.isLive) - Number(a.isLive));

    return NextResponse.json({
      matches,
      live_count: matches.filter((m) => m.isLive).length,
      total_count: matches.length,
      updated_at: new Date().toISOString(),
      source: "ESPNcricinfo Live Scores",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        matches: [],
        live_count: 0,
        total_count: 0,
        updated_at: new Date().toISOString(),
        error: error.message || "Unable to fetch live scores",
      },
      { status: 200 }
    );
  }
}
