import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const SEED_FILE = path.join(process.cwd(), "src/data/seedArticles.ts");
const SUBMISSIONS_FILE = path.join(process.cwd(), "src/data/guest_submissions.json");

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  health: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1600&q=85",
  india: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1600&q=85",
  markets: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=85",
  tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=85",
  world: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85",
  sports: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1600&q=85",
  entertainment: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=85",
  festivals: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85",
  explainers: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1600&q=85",
};

export interface SubmissionRecord {
  submission_id: string;
  submission_type: "editorial" | "guest";
  status: "pending" | "published" | "rejected";
  submitted_at: string;
  published_at?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  language: "en" | "hi";
  image_url: string;
  source_name: string;
  source_url: string;
  tags: string;
  author_name: string;
  author_bio: string;
  author_email?: string;
}

function readSubmissions(): SubmissionRecord[] {
  if (!fs.existsSync(SUBMISSIONS_FILE)) return [];
  try {
    const raw = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSubmissions(items: SubmissionRecord[]) {
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(items, null, 2), "utf-8");
}

function makeSlug(title: string, category: string): string {
  const clean = title
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const suffix = Date.now().toString().slice(-6);
  const base = clean.length >= 8 ? clean.slice(0, 60).replace(/-+$/g, "") : `${category}-dispatch-${suffix}`;
  return `${base}-${suffix}`;
}

function escapeTemplateStr(val: string): string {
  return (val || "").replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function prependToSeedArticles(sub: SubmissionRecord): number {
  if (!fs.existsSync(SEED_FILE)) {
    throw new Error("seedArticles.ts not found");
  }
  const content = fs.readFileSync(SEED_FILE, "utf-8");
  const idMatches = Array.from(content.matchAll(/["']?id["']?:\s*(\d+)/g)).map((m) => parseInt(m[1], 10));
  const nextId = (idMatches.length > 0 ? Math.max(...idMatches) : 100) + 1;
  const nowIso = new Date().toISOString();
  const isHi = sub.language === "hi";
  const isGuest = sub.submission_type === "guest";
  const wordCount = Math.max(1, sub.content.trim().split(/\s+/).length);
  const readMins = Math.max(1, Math.ceil(wordCount / 200));

  const guestDisclosure = isGuest
    ? `\n\n---\n*Contributor Note: This is a guest submission contributed by ${sub.author_name}. Views expressed are the author's own and reviewed by the ZestFeedX editorial desk.*`
    : "";

  const fullContent = `${sub.content.trim()}${guestDisclosure}`;

  const articleObj: Record<string, string | number | boolean> = {
    id: nextId,
    title: sub.title,
    slug: sub.slug,
    original_title: sub.title,
    category: sub.category,
    topic: "",
    language: sub.language,
    fomo_badge: isGuest ? (isHi ? "अतिथि लेख" : "Guest Column") : (isHi ? "संपादकीय डेस्क" : "Editorial Desk"),
    read_time: `${readMins} min read`,
    views_count: 0,
    shares_count: 0,
    published_at: nowIso,
    updated_at: nowIso,
    source_name: sub.source_name || (isGuest ? `Guest Contributor: ${sub.author_name}` : "ZestFeedX Editorial Desk"),
    source_url: sub.source_url || `https://zestfeedx.com/article/${sub.slug}/`,
    source_courtesy: isGuest ? `Guest Post by ${sub.author_name}` : `Published by ${sub.author_name}`,
    image_url: sub.image_url,
    image_alt: sub.title,
    image_courtesy: "Submitted Editorial Media",
    image_photographer: sub.author_name,
    image_license: "Editorial Submission",
    fact_check_status: isGuest ? "Guest Post — Editorial Reviewed" : "Published by ZestFeedX Editorial Desk",
    tags: sub.tags || `${sub.category}, ${isGuest ? "Guest Post" : "News"}`,
    summary: sub.summary,
    content: fullContent,
    title_en: isHi ? "" : sub.title,
    summary_en: isHi ? "" : sub.summary,
    content_en: isHi ? "" : fullContent,
    title_hi: isHi ? sub.title : "",
    summary_hi: isHi ? sub.summary : "",
    content_hi: isHi ? fullContent : "",
    author_name: sub.author_name,
    author_bio: sub.author_bio || (isGuest ? "Guest contributor to ZestFeedX." : "ZestFeedX Editorial Desk."),
    author_url: "https://zestfeedx.com/about/",
    medical_reviewed: false,
    medical_reviewer_name: "",
    medical_reviewer_credentials: "",
    why_it_matters_today: sub.summary,
    who_is_affected: isHi ? "सभी संबंधित पाठक" : "Readers following this beat",
    what_readers_are_searching_for: sub.title,
    primary_source: sub.source_name || sub.author_name,
  };

  let block = "  {\n";
  for (const [k, v] of Object.entries(articleObj)) {
    if (typeof v === "boolean") {
      block += `    ${k}: ${v ? "true" : "false"},\n`;
    } else if (typeof v === "number") {
      block += `    ${k}: ${v},\n`;
    } else {
      block += `    ${k}: \`${escapeTemplateStr(v)}\`,\n`;
    }
  }
  block += "  },\n";

  const pattern = /(export const SEED_ARTICLES: Article\[\] = \[\s*)/;
  if (!pattern.test(content)) {
    throw new Error("Could not locate SEED_ARTICLES array in seedArticles.ts");
  }
  const updated = content.replace(pattern, `$1\n${block}`);
  fs.writeFileSync(SEED_FILE, updated, "utf-8");
  return nextId;
}

export async function GET() {
  try {
    const submissions = readSubmissions();
    return NextResponse.json({
      submissions,
      counts: {
        total: submissions.length,
        pending: submissions.filter((s) => s.status === "pending").length,
        published: submissions.filter((s) => s.status === "published").length,
        rejected: submissions.filter((s) => s.status === "rejected").length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load submissions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = (body.title || "").trim();
    const summary = (body.summary || "").trim();
    const content = (body.content || "").trim();
    const category = (body.category || "india").trim().toLowerCase();
    const language: "en" | "hi" = body.language === "hi" ? "hi" : "en";
    const submission_type: "editorial" | "guest" = body.submission_type === "guest" ? "guest" : "editorial";
    const publish_immediately = Boolean(body.publish_immediately);
    const author_name = (body.author_name || (submission_type === "guest" ? "Guest Contributor" : "ZestFeedX Editorial Desk")).trim();
    const author_bio = (body.author_bio || "").trim();
    const author_email = (body.author_email || "").trim();
    const source_name = (body.source_name || "").trim();
    const source_url = (body.source_url || "").trim();
    const tags = (body.tags || `${category}, ${submission_type === "guest" ? "Guest Post" : "News"}`).trim();
    const image_url = (body.image_url || "").trim() || CATEGORY_FALLBACK_IMAGES[category] || CATEGORY_FALLBACK_IMAGES.india;

    if (!title || !summary || !content) {
      return NextResponse.json({ error: "Title, summary, and article content are required." }, { status: 400 });
    }

    const hasDevanagari = /[\u0900-\u097F]/.test(title);
    if (language === "en" && hasDevanagari) {
      return NextResponse.json(
        { error: "Hindi (Devanagari) headline detected while English is selected. Please switch Language to Hindi (hi) so English and Hindi sections stay separate." },
        { status: 400 }
      );
    }

    const slug = makeSlug(title, category);
    const record: SubmissionRecord = {
      submission_id: `sub-${Date.now()}`,
      submission_type,
      status: publish_immediately ? "published" : "pending",
      submitted_at: new Date().toISOString(),
      published_at: publish_immediately ? new Date().toISOString() : undefined,
      title,
      slug,
      summary,
      content,
      category,
      language,
      image_url,
      source_name,
      source_url,
      tags,
      author_name,
      author_bio,
      author_email,
    };

    if (publish_immediately) {
      prependToSeedArticles(record);
    }

    const existing = readSubmissions();
    writeSubmissions([record, ...existing]);

    return NextResponse.json({
      ok: true,
      submission: record,
      article_url: `/article/${record.slug}/`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit article" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { submission_id, action } = body;
    if (!submission_id || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid submission_id or action" }, { status: 400 });
    }

    const items = readSubmissions();
    const idx = items.findIndex((s) => s.submission_id === submission_id);
    if (idx === -1) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const target = items[idx];
    if (action === "approve") {
      if (target.status !== "published") {
        prependToSeedArticles(target);
      }
      target.status = "published";
      target.published_at = new Date().toISOString();
    } else {
      target.status = "rejected";
    }

    items[idx] = target;
    writeSubmissions(items);

    return NextResponse.json({ ok: true, submission: target });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update submission" }, { status: 500 });
  }
}
