import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const SEED_FILE = path.join(process.cwd(), "src/data/seedArticles.ts");

interface ParsedBlock {
  id: number;
  start: number;
  end: number;
  raw: string;
  title: string;
  slug: string;
  category: string;
  language: "en" | "hi";
  published_at: string;
  author_name: string;
  source_name: string;
  image_url: string;
  summary: string;
  content: string;
}

function extractField(block: string, field: string): string {
  const re = new RegExp(`["']?${field}["']?:\\s*([\`"'])([\\s\\S]*?)\\1`, "m");
  const m = block.match(re);
  if (!m) return "";
  return m[2].replace(/\\`/g, "`").replace(/\\\$\{/g, "${").replace(/\\\\/g, "\\");
}

function parseSeedBlocks(text: string): ParsedBlock[] {
  const blocks: ParsedBlock[] = [];
  const startMarker = text.indexOf("export const SEED_ARTICLES");
  if (startMarker === -1) return blocks;

  const arrStart = text.indexOf("[", startMarker);
  if (arrStart === -1) return blocks;

  // Match top-level object blocks `\n  {\n ... \n  },`
  const objRegex = /\n  \{\r?\n([\s\S]*?)\r?\n  \},?/g;
  objRegex.lastIndex = arrStart;

  let match: RegExpExecArray | null;
  while ((match = objRegex.exec(text)) !== null) {
    const raw = match[0];
    const body = match[1];
    const idMatch = body.match(/["']?id["']?:\s*(\d+)/);
    const id = idMatch ? parseInt(idMatch[1], 10) : 0;
    if (!id) continue;

    const title = extractField(body, "title");
    const langField = extractField(body, "language");
    const hasDevanagari = /[\u0900-\u097F]/.test(title);
    const language: "en" | "hi" = langField === "hi" || hasDevanagari ? "hi" : "en";

    blocks.push({
      id,
      start: match.index,
      end: match.index + raw.length,
      raw,
      title,
      slug: extractField(body, "slug"),
      category: extractField(body, "category") || "india",
      language,
      published_at: extractField(body, "published_at"),
      author_name: extractField(body, "author_name") || "ZestFeedX Desk",
      source_name: extractField(body, "source_name") || "",
      image_url: extractField(body, "image_url") || "",
      summary: extractField(body, "summary") || "",
      content: extractField(body, "content") || "",
    });
  }
  return blocks;
}

function escapeTemplate(val: string): string {
  return (val || "").replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function replaceFieldInBlock(block: string, field: string, newVal: string): string {
  const escaped = escapeTemplate(newVal);
  const re = new RegExp(`(["']?${field}["']?:\\s*)([\`"'])([\\s\\S]*?)\\2`);
  if (re.test(block)) {
    return block.replace(re, `$1\`${escaped}\``);
  }
  return block;
}

export async function GET(req: NextRequest) {
  try {
    if (!fs.existsSync(SEED_FILE)) {
      return NextResponse.json({ articles: [], total: 0 });
    }
    const text = fs.readFileSync(SEED_FILE, "utf-8");
    const all = parseSeedBlocks(text);

    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") || "all";
    const category = (searchParams.get("category") || "all").toLowerCase();
    const search = (searchParams.get("search") || "").trim().toLowerCase();

    const filtered = all.filter((a) => {
      if (lang !== "all" && a.language !== lang) return false;
      if (category !== "all" && a.category.toLowerCase() !== category) return false;
      if (search) {
        const hay = `${a.title} ${a.summary} ${a.author_name} ${a.source_name} ${a.slug}`.toLowerCase();
        if (!hay.includes(search)) return false;
      }
      return true;
    });

    const categories = Array.from(new Set(all.map((a) => a.category.toLowerCase()))).sort();

    return NextResponse.json({
      articles: filtered.map(({ raw, start, end, ...rest }) => rest),
      total: all.length,
      filtered_total: filtered.length,
      en_count: all.filter((a) => a.language === "en").length,
      hi_count: all.filter((a) => a.language === "hi").length,
      categories,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load articles" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const id = Number(body.id);
    if (!id) {
      return NextResponse.json({ error: "Article id is required" }, { status: 400 });
    }

    const text = fs.readFileSync(SEED_FILE, "utf-8");
    const blocks = parseSeedBlocks(text);
    const target = blocks.find((b) => b.id === id);
    if (!target) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    let updatedBlock = target.raw;
    const isHi = (body.language || target.language) === "hi";

    if (typeof body.title === "string") {
      updatedBlock = replaceFieldInBlock(updatedBlock, "title", body.title.trim());
      updatedBlock = replaceFieldInBlock(updatedBlock, isHi ? "title_hi" : "title_en", body.title.trim());
    }
    if (typeof body.summary === "string") {
      updatedBlock = replaceFieldInBlock(updatedBlock, "summary", body.summary.trim());
      updatedBlock = replaceFieldInBlock(updatedBlock, isHi ? "summary_hi" : "summary_en", body.summary.trim());
    }
    if (typeof body.content === "string") {
      updatedBlock = replaceFieldInBlock(updatedBlock, "content", body.content.trim());
      updatedBlock = replaceFieldInBlock(updatedBlock, isHi ? "content_hi" : "content_en", body.content.trim());
    }
    if (typeof body.category === "string") {
      updatedBlock = replaceFieldInBlock(updatedBlock, "category", body.category.trim().toLowerCase());
    }
    if (body.language === "en" || body.language === "hi") {
      updatedBlock = replaceFieldInBlock(updatedBlock, "language", body.language);
    }
    if (typeof body.image_url === "string" && body.image_url.trim()) {
      updatedBlock = replaceFieldInBlock(updatedBlock, "image_url", body.image_url.trim());
    }
    if (typeof body.author_name === "string" && body.author_name.trim()) {
      updatedBlock = replaceFieldInBlock(updatedBlock, "author_name", body.author_name.trim());
    }
    updatedBlock = replaceFieldInBlock(updatedBlock, "updated_at", new Date().toISOString());

    const updatedText = text.slice(0, target.start) + updatedBlock + text.slice(target.end);
    fs.writeFileSync(SEED_FILE, updatedText, "utf-8");

    return NextResponse.json({ ok: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const ids: number[] = Array.isArray(body.ids)
      ? body.ids.map(Number).filter(Boolean)
      : body.id
      ? [Number(body.id)]
      : [];

    if (ids.length === 0) {
      return NextResponse.json({ error: "No article id(s) provided" }, { status: 400 });
    }

    const idSet = new Set(ids);
    const text = fs.readFileSync(SEED_FILE, "utf-8");
    const blocks = parseSeedBlocks(text);
    const toRemove = blocks.filter((b) => idSet.has(b.id)).sort((a, b) => b.start - a.start);

    if (toRemove.length === 0) {
      return NextResponse.json({ error: "Matching articles not found" }, { status: 404 });
    }

    let updatedText = text;
    for (const blk of toRemove) {
      updatedText = updatedText.slice(0, blk.start) + updatedText.slice(blk.end);
    }

    fs.writeFileSync(SEED_FILE, updatedText, "utf-8");
    return NextResponse.json({ ok: true, deleted_count: toRemove.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete articles" }, { status: 500 });
  }
}
