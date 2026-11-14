export interface FeedSourceConfig {
  id: string;
  name: string;
  slug: string;
  tier: 1 | 2 | 3;
  category: "india" | "markets" | "health" | "tech" | "world" | "sports" | "entertainment";
  adapterType: "rss" | "api" | "html_official";
  endpoint: string;
  isActive: boolean;
  licenseNotes: string;
  refreshIntervalMins: number;
}

export const FEED_SOURCES_REGISTRY: FeedSourceConfig[] = [
  // TIER 1: Primary Official Government & Regulatory Feeds (Direct Facts & Dispatches)
  {
    id: "src-pib-all",
    name: "Press Information Bureau (PIB India)",
    slug: "pib-india",
    tier: 1,
    category: "india",
    adapterType: "rss",
    endpoint: "https://pib.gov.in/RssMain.aspx?ModId=6",
    isActive: true,
    licenseNotes: "Government of India official press releases. Free for public factual reporting with clear attribution.",
    refreshIntervalMins: 15,
  },
  {
    id: "src-pib-pm",
    name: "PMO India Press Releases (PIB)",
    slug: "pib-pmo",
    tier: 1,
    category: "india",
    adapterType: "rss",
    endpoint: "https://pib.gov.in/RssMain.aspx?ModId=1",
    isActive: true,
    licenseNotes: "Prime Minister's Office official press dispatches. Free for editorial reporting with clear attribution.",
    refreshIntervalMins: 15,
  },
  {
    id: "src-rbi-press",
    name: "Reserve Bank of India (RBI Notifications)",
    slug: "rbi-bulletin",
    tier: 1,
    category: "markets",
    adapterType: "rss",
    endpoint: "https://rbi.org.in/rss/rss_pressreleases.xml",
    isActive: true,
    licenseNotes: "Official central banking regulatory notifications. Public domain factual reporting.",
    refreshIntervalMins: 30,
  },
  {
    id: "src-cpcb-air",
    name: "Central Pollution Control Board (CPCB AQI)",
    slug: "cpcb-air",
    tier: 1,
    category: "health",
    adapterType: "api",
    endpoint: "https://api.cpcb.gov.in/caaqms/v1/realtime",
    isActive: true,
    licenseNotes: "National ambient air quality index live telemetry.",
    refreshIntervalMins: 60,
  },

  // TIER 2: Discovery APIs (Metadata Only: Headline + Publisher + Canonical URL + IST Timestamp)
  {
    id: "src-newsdata-in",
    name: "NewsData.io India Multi-Language Wire",
    slug: "newsdata-io",
    tier: 2,
    category: "india",
    adapterType: "api",
    endpoint: "https://newsdata.io/api/1/news?country=in",
    isActive: true,
    licenseNotes: "Discovery API. Store headline, canonical publisher link, and real publish time only. Never store full body.",
    refreshIntervalMins: 15,
  },
  {
    id: "src-gnews-backup",
    name: "GNews India Secondary Discovery",
    slug: "gnews-backup",
    tier: 2,
    category: "india",
    adapterType: "api",
    endpoint: "https://gnews.io/api/v4/top-headlines?country=in",
    isActive: false, // Inactive by default, used as failover
    licenseNotes: "Secondary discovery failover. Metadata only.",
    refreshIntervalMins: 30,
  },

  // TIER 3: Market Quotes
  {
    id: "src-market-quotes",
    name: "Indian Capital & Commodity Quotes",
    slug: "market-quotes",
    tier: 3,
    category: "markets",
    adapterType: "api",
    endpoint: "https://api.marketdata.internal/quotes",
    isActive: true,
    licenseNotes: "Delayed 15-minute indicative quotes for Sensex, Nifty, MCX Gold, MCX Silver, USD-INR.",
    refreshIntervalMins: 10,
  },
];
