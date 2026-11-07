import { NextResponse } from "next/server";
import { SEED_ARTICLES } from "@/data/seedArticles";

export async function GET() {
  // 1. Try local backend first
  try {
    const backendRes = await fetch("http://127.0.0.1:8000/api/trending", {
      cache: "no-store",
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data && data.breaking && data.breaking.length > 0) {
        return NextResponse.json(data);
      }
    }
  } catch {
    // Backend offline / deployed standalone
  }

  // 2. Fallback
  return NextResponse.json({
    breaking: SEED_ARTICLES.slice(0, 5),
    tags: ["Gemini2AI", "ViratKohli", "BengaluruChaiDrone", "BitcoinATH", "SRKNext", "ISROSpacePlane"]
  });
}
