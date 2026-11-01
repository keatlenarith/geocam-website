import type { VercelRequest, VercelResponse } from "@vercel/node";
import listedCompaniesFallback from "../data/listed-companies.json" with { type: "json" };

interface QuoteResult {
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean | null;
  currency: string;
}

// Map each company's ticker to Yahoo Finance / ASX market symbols
const SYMBOL_MAP: Record<string, string> = {
  EMR: "EMR.AX",
  ANK: "ANK.V",
  UM1: "UM1.AX",
  "0914 / 600585": "0914.HK",
  "06655": "6655.HK",
  "3918": "3918.HK",
  SCCC: "SCCC.BK",
};

async function fetchYahooQuote(symbol: string): Promise<QuoteResult | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const meta = data?.chart?.result?.[0]?.meta;
    if (!meta || typeof meta.regularMarketPrice !== "number") return null;

    const rawPrice = meta.regularMarketPrice;
    const rawChange = typeof meta.fulldayChange === "number" ? meta.fulldayChange : meta.regularMarketPrice - (meta.chartPreviousClose || meta.regularMarketPrice);
    const rawPct = typeof meta.regularMarketChangePercent === "number" ? meta.regularMarketChangePercent : (rawChange / (meta.chartPreviousClose || 1)) * 100;

    const precision = rawPrice < 1 ? 4 : 2;
    const changePrecision = rawPrice < 1 ? 4 : 2;

    const price = rawPrice.toFixed(precision);
    const changeSign = rawChange > 0 ? "+" : rawChange < 0 ? "-" : "";
    const change = `${changeSign}${Math.abs(rawChange).toFixed(changePrecision)}`;
    const pctSign = rawPct > 0 ? "+" : rawPct < 0 ? "-" : "";
    const changePercent = `${pctSign}${Math.abs(rawPct).toFixed(2)}%`;
    const isPositive = rawChange > 0 ? true : rawChange < 0 ? false : null;

    return {
      symbol,
      price,
      change,
      changePercent,
      isPositive,
      currency: meta.currency || "",
    };
  } catch {
    return null;
  }
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, s-maxage=120, stale-while-revalidate=300");

  try {
    // Query Yahoo Finance / ASX in parallel
    const tickers = Object.keys(SYMBOL_MAP);
    const fetchPromises = tickers.map(async (ticker) => {
      const ySymbol = SYMBOL_MAP[ticker];
      const quote = await fetchYahooQuote(ySymbol);
      return { ticker, quote };
    });

    const results = await Promise.all(fetchPromises);
    const quotesByTicker = new Map(results.map((r) => [r.ticker, r.quote]));

    // Merge live quotes with JSON metadata
    const merged = listedCompaniesFallback.map((item) => {
      const liveQuote = quotesByTicker.get(item.ticker);
      if (liveQuote) {
        return {
          ...item,
          price: liveQuote.price,
          change: liveQuote.change,
          changePercent: liveQuote.changePercent,
          isPositive: liveQuote.isPositive,
          currency: liveQuote.currency || item.currency,
          lastChecked: new Date().toISOString().slice(0, 10),
        };
      }
      return item;
    });

    return res.status(200).json({
      success: true,
      updatedAt: new Date().toISOString(),
      source: "ASX / Yahoo Finance / CSX",
      companies: merged,
    });
  } catch (error: any) {
    return res.status(200).json({
      success: true,
      updatedAt: new Date().toISOString(),
      source: "fallback",
      companies: listedCompaniesFallback,
    });
  }
}
