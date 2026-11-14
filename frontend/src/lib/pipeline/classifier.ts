export type ValidCategory =
  | "markets"
  | "tech"
  | "health"
  | "sports"
  | "entertainment"
  | "world"
  | "india";

interface CategoryRule {
  category: ValidCategory;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  weight: number;
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    category: "markets",
    weight: 2.0, // High priority so market-price stories don't accidentally fall into politics
    primaryKeywords: [
      "sensex",
      "nifty",
      "bse",
      "nse",
      "rbi",
      "repo rate",
      "inflation",
      "rupee",
      "usdinr",
      "gold price",
      "silver price",
      "mcx",
      "mutual fund",
      "sebi",
      "bond yield",
      "gdp growth",
      "quarterly earnings",
      "fdi",
      "cbdc",
      "digital rupee",
      "foreign exchange",
      "forex reserves",
      "treasury bills",
      "disinvestment",
      "remittance",
    ],
    secondaryKeywords: [
      "shares",
      "stocks",
      "investors",
      "rally",
      "bear market",
      "bull market",
      "banking",
      "fintech",
      "crude oil",
      "interest rates",
      "dividend",
      "valuation",
      "market cap",
    ],
  },
  {
    category: "tech",
    weight: 1.8,
    primaryKeywords: [
      "semiconductor",
      "microchip",
      "foundry",
      "fab",
      "artificial intelligence",
      "ai model",
      "genai",
      "nvidia",
      "gpu",
      "isro",
      "chandrayaan",
      "gaganyaan",
      "satellite",
      "quantum computing",
      "cybersecurity",
      "robotics",
      "meity",
      "deeptech",
      "open source",
    ],
    secondaryKeywords: [
      "google",
      "microsoft",
      "apple",
      "meta",
      "software",
      "app",
      "algorithm",
      "smartphone",
      "telecom",
      "5g",
      "hardware",
      "cloud computing",
      "startup",
    ],
  },
  {
    category: "health",
    weight: 1.8,
    primaryKeywords: [
      "aqi",
      "air quality",
      "pollution",
      "smog",
      "pm2.5",
      "pm10",
      "cpcb",
      "thermal inversion",
      "stubble burning",
      "cancer therapy",
      "vaccine",
      "icmr",
      "aiims",
      "hospital",
      "clinical trial",
      "dengue",
      "chikungunya",
      "pandemic",
    ],
    secondaryKeywords: [
      "health",
      "medical",
      "doctor",
      "disease",
      "patient",
      "fitness",
      "mental health",
      "diet",
      "nutrition",
      "sanitation",
      "clean air",
    ],
  },
  {
    category: "sports",
    weight: 1.9,
    primaryKeywords: [
      "cricket",
      "bcci",
      "ranji trophy",
      "ipl",
      "test match",
      "icc",
      "wpl",
      "badminton",
      "hockey",
      "olympics",
      "fifa",
      "football",
      "world cup",
      "tennis",
      "wimbledon",
      "grand slam",
      "asian games",
    ],
    secondaryKeywords: [
      "tournament",
      "coach",
      "captain",
      "score",
      "wicket",
      "century",
      "goal",
      "athlete",
      "championship",
      "medal",
    ],
  },
  {
    category: "entertainment",
    weight: 1.7,
    primaryKeywords: [
      "bollywood",
      "cinema",
      "box office",
      "actor",
      "actress",
      "director",
      "film",
      "oscar",
      "filmfare",
      "trailer",
      "ott",
      "netflix",
      "theatre",
    ],
    secondaryKeywords: [
      "movie",
      "music video",
      "song",
      "celebrity",
      "hollywood",
      "album",
      "drama",
      "web series",
    ],
  },
  {
    category: "world",
    weight: 1.5,
    primaryKeywords: [
      "united nations",
      "white house",
      "us congress",
      "pentagon",
      "brics",
      "g20 summit",
      "geopolitics",
      "diplomacy",
      "middle east",
      "ukraine",
      "russia",
      "taiwan strait",
      "israel",
      "gaza",
      "bilateral treaty",
    ],
    secondaryKeywords: [
      "foreign ministry",
      "ambassador",
      "washington",
      "beijing",
      "london",
      "european union",
      "international",
    ],
  },
  {
    category: "india",
    weight: 1.2,
    primaryKeywords: [
      "parliament",
      "lok sabha",
      "rajya sabha",
      "supreme court",
      "high court",
      "cabinet",
      "pmo",
      "narendra modi",
      "amit shah",
      "election commission",
      "eci",
      "tribal affairs",
      "naxal",
      "bastar",
      "governance",
      "chief minister",
    ],
    secondaryKeywords: [
      "state government",
      "police",
      "assembly",
      "minister",
      "policy",
      "delhi",
      "chhattisgarh",
      "bihar",
      "uttar pradesh",
      "maharashtra",
    ],
  },
];

/**
 * Classifies an article/brief into one of the core broadsheet categories.
 * Strict Rule 5: Deterministic keyword rules with prioritized weights.
 */
export function classifyArticle(title: string, summary?: string): ValidCategory {
  const fullText = `${title} ${summary || ""}`.toLowerCase();

  let highestScore = 0;
  let bestCategory: ValidCategory = "india"; // Default fallback category

  for (const rule of CATEGORY_RULES) {
    let score = 0;

    // Check primary keywords (weight: 3 points each)
    for (const kw of rule.primaryKeywords) {
      if (fullText.includes(kw)) {
        score += 3 * rule.weight;
      }
    }

    // Check secondary keywords (weight: 1 point each)
    for (const kw of rule.secondaryKeywords) {
      if (fullText.includes(kw)) {
        score += 1 * rule.weight;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestCategory = rule.category;
    }
  }

  return bestCategory;
}
