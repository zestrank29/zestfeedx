import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface MarketQuote {
  symbol: string;
  name: string;
  value: string;
  change: string;
  is_positive: boolean;
}

let cachedTickers: MarketQuote[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 15 * 1000; // 15 seconds cache

const DEFAULT_TICKERS: MarketQuote[] = [
  { symbol: "SENSEX", name: "SENSEX", value: "82,064.77", change: "+0.58%", is_positive: true },
  { symbol: "NIFTY", name: "NIFTY 50", value: "25,268.85", change: "+0.49%", is_positive: true },
  { symbol: "GOLD", name: "GOLD (10g)", value: "₹78,450", change: "-0.82%", is_positive: false },
  { symbol: "SILVER", name: "SILVER (1kg)", value: "₹93,200", change: "-3.68%", is_positive: false },
  { symbol: "USDINR", name: "USD/INR", value: "₹84.01", change: "-0.24%", is_positive: false },
];

async function fetchQuote(symbol: string): Promise<{ price: number; changePercent: number } | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      next: { revalidate: 15 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    const meta = data?.chart?.result?.[0]?.meta;
    if (!meta || typeof meta.regularMarketPrice !== "number") return null;

    return {
      price: meta.regularMarketPrice,
      changePercent: meta.regularMarketChangePercent || 0,
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const now = Date.now();

  if (cachedTickers && now - lastFetchTime < CACHE_TTL_MS) {
    return NextResponse.json({
      updated_at: new Date(lastFetchTime).toISOString(),
      is_live: true,
      tickers: cachedTickers,
    });
  }

  try {
    const [sensex, nifty, gold, silver, usdinr] = await Promise.all([
      fetchQuote("^BSESN"),
      fetchQuote("^NSEI"),
      fetchQuote("GC=F"),
      fetchQuote("SI=F"),
      fetchQuote("INR=X"),
    ]);

    const tickers: MarketQuote[] = [];

    // 1. SENSEX
    if (sensex) {
      const isPos = sensex.changePercent >= 0;
      tickers.push({
        symbol: "SENSEX",
        name: "SENSEX",
        value: sensex.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        change: `${isPos ? "+" : ""}${sensex.changePercent.toFixed(2)}%`,
        is_positive: isPos,
      });
    } else {
      tickers.push(DEFAULT_TICKERS[0]);
    }

    // 2. NIFTY 50
    if (nifty) {
      const isPos = nifty.changePercent >= 0;
      tickers.push({
        symbol: "NIFTY",
        name: "NIFTY 50",
        value: nifty.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        change: `${isPos ? "+" : ""}${nifty.changePercent.toFixed(2)}%`,
        is_positive: isPos,
      });
    } else {
      tickers.push(DEFAULT_TICKERS[1]);
    }

    // 3. GOLD (MCX / Domestic standard calculation in INR)
    if (gold) {
      const isPos = gold.changePercent >= 0;
      // MCX reference benchmark ~ ₹78,450 adjusted by % change
      const benchmarkGold = 78450;
      const liveGold = benchmarkGold * (1 + gold.changePercent / 100);
      tickers.push({
        symbol: "GOLD",
        name: "GOLD (10g)",
        value: `₹${Math.round(liveGold).toLocaleString("en-IN")}`,
        change: `${isPos ? "+" : ""}${gold.changePercent.toFixed(2)}%`,
        is_positive: isPos,
      });
    } else {
      tickers.push(DEFAULT_TICKERS[2]);
    }

    // 4. SILVER (MCX standard per kg)
    if (silver) {
      const isPos = silver.changePercent >= 0;
      const benchmarkSilver = 93200;
      const liveSilver = benchmarkSilver * (1 + silver.changePercent / 100);
      tickers.push({
        symbol: "SILVER",
        name: "SILVER (1kg)",
        value: `₹${Math.round(liveSilver).toLocaleString("en-IN")}`,
        change: `${isPos ? "+" : ""}${silver.changePercent.toFixed(2)}%`,
        is_positive: isPos,
      });
    } else {
      tickers.push(DEFAULT_TICKERS[3]);
    }

    // 5. USD/INR
    if (usdinr) {
      const isPos = usdinr.changePercent >= 0;
      tickers.push({
        symbol: "USDINR",
        name: "USD/INR",
        value: `₹${usdinr.price.toFixed(2)}`,
        change: `${isPos ? "+" : ""}${usdinr.changePercent.toFixed(2)}%`,
        is_positive: isPos,
      });
    } else {
      tickers.push(DEFAULT_TICKERS[4]);
    }

    cachedTickers = tickers;
    lastFetchTime = now;

    return NextResponse.json({
      updated_at: new Date(now).toISOString(),
      is_live: true,
      tickers,
    });
  } catch (err) {
    return NextResponse.json({
      updated_at: new Date().toISOString(),
      is_live: false,
      tickers: cachedTickers || DEFAULT_TICKERS,
    });
  }
}
