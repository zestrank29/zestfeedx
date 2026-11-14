export interface Author {
  id: string;
  name: string;
  slug: string;
  role: string;
  bio: string;
  avatar: string;
  twitter?: string;
  email?: string;
}

export interface OriginalArticle {
  id: string;
  slug: string;
  title: string;
  title_hi?: string;
  deck: string; // Subtitle / lead-in
  deck_hi?: string;
  category: "markets" | "tech" | "india" | "world" | "sports" | "entertainment" | "health" | "explainers";
  author: Author;
  published_at: string; // ISO string
  reading_time_mins: number;
  word_count: number;
  hero_image: string;
  hero_image_caption: string;
  hero_image_credit: string;
  key_takeaways: string[];
  content_markdown: string;
  why_it_matters: string;
  citations: Array<{ label: string; url: string; publisher: string }>;
  is_lead_story?: boolean;
  is_secondary_story?: boolean;
  is_trending?: boolean;
  tags: string[];
}

export interface CuratedBrief {
  id: string;
  title: string;
  title_hi?: string;
  summary: string; // Strict max 40 words, original synthesis
  source_name: string;
  source_url: string;
  published_at: string;
  category: "markets" | "tech" | "india" | "world" | "sports" | "entertainment" | "health";
}

export interface MarketTicker {
  symbol: string;
  name: string;
  value: string;
  change: string;
  is_positive: boolean;
  time_label: string;
}

export interface CityMetric {
  city: string;
  aqi: number;
  aqi_label: string;
  aqi_color: string;
  temp: string;
}

export const DEMO_AUTHORS: Record<string, Author> = {
  pankhudi: {
    id: "auth-1",
    name: "Pankhudi Sharma",
    slug: "pankhudi-sharma",
    role: "Senior Digital Editor & Macro Lead",
    bio: "Pankhudi reports on Indian monetary policy, capital markets, and national governance. Formerly covering economic affairs for regional broadsheets, she leads the ZestFeedX desk in New Delhi.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    twitter: "https://twitter.com/pankhudi_sharma",
    email: "pankhudi@zestfeedx.com",
  },
  rohan: {
    id: "auth-2",
    name: "Rohan Sen",
    slug: "rohan-sen",
    role: "Frontier Tech & Industry Correspondent",
    bio: "Rohan tracks India's semiconductor manufacturing, space technology, and consumer electronics supply chains from Bengaluru.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    twitter: "https://twitter.com/rohan_sen_tech",
    email: "rohan@zestfeedx.com",
  },
};

export const MARKET_TICKERS: MarketTicker[] = [
  { symbol: "SENSEX", name: "BSE Sensex", value: "81,029.65", change: "+0.04%", is_positive: true, time_label: "Delayed 15m" },
  { symbol: "NIFTY50", name: "Nifty 50", value: "24,985.45", change: "-0.02%", is_positive: false, time_label: "Delayed 15m" },
  { symbol: "GOLD", name: "Gold (24K / 10g)", value: "₹77,450", change: "+0.35%", is_positive: true, time_label: "MCX Spot" },
  { symbol: "SILVER", name: "Silver (1kg)", value: "₹93,200", change: "-0.45%", is_positive: false, time_label: "MCX Spot" },
  { symbol: "USDINR", name: "USD / INR", value: "₹84.38", change: "+0.02%", is_positive: true, time_label: "RBI Ref" },
];

export const CITY_METRICS: CityMetric[] = [
  { city: "Delhi NCR", aqi: 342, aqi_label: "Very Poor", aqi_color: "#D7263D", temp: "24°C" },
  { city: "Mumbai", aqi: 118, aqi_label: "Moderate", aqi_color: "#EAB308", temp: "29°C" },
  { city: "Bengaluru", aqi: 54, aqi_label: "Satisfactory", aqi_color: "#10B981", temp: "22°C" },
];

export const DIASPORA_TICKERS: MarketTicker[] = [
  { symbol: "USDINR", name: "USD / INR", value: "₹84.38", change: "+0.02%", is_positive: true, time_label: "RBI Spot" },
  { symbol: "AEDINR", name: "AED / INR", value: "₹22.97", change: "+0.01%", is_positive: true, time_label: "LCS Direct" },
  { symbol: "GBPINR", name: "GBP / INR", value: "₹107.12", change: "-0.15%", is_positive: false, time_label: "FX Spot" },
  { symbol: "CADINR", name: "CAD / INR", value: "₹61.20", change: "+0.08%", is_positive: true, time_label: "FX Spot" },
  { symbol: "SGDINR", name: "SGD / INR", value: "₹63.45", change: "+0.05%", is_positive: true, time_label: "PayNow Direct" },
];

export const DIASPORA_HUBS = [
  { city: "London", time_zone: "Europe/London", temp: "11°C", label: "UK Desk" },
  { city: "Dubai", time_zone: "Asia/Dubai", temp: "28°C", label: "Gulf Corridor" },
  { city: "Singapore", time_zone: "Asia/Singapore", temp: "30°C", label: "ASEAN Hub" },
  { city: "New York", time_zone: "America/New_York", temp: "13°C", label: "US Bureau" },
  { city: "Toronto", time_zone: "America/Toronto", temp: "8°C", label: "Canada Desk" },
];

export const BREAKING_DISPATCH = {
  headline: "PM Modi arrives in Bastar on Diwali: Warns of ideological extremism, announces ₹12,000 Cr tribal development corridor",
  headline_hi: "बस्तर में पीएम मोदी का संबोधन: 'दिमागी नक्सलियों' पर सख्त रुख, 12,000 करोड़ के विकास गलियारे की घोषणा",
  source_note: "PIB & Desk Verification",
  source_note_hi: "पीआईबी एवं डेस्क सत्यापन",
  slug: "pm-modi-diwali-bastar-tribal-corridor-security",
  timestamp: "2026-11-14T07:15:00.000Z",
};

export const ORIGINAL_ARTICLES: OriginalArticle[] = [
  {
    id: "art-1",
    slug: "pm-modi-diwali-bastar-tribal-corridor-security",
    title: "Dimagi Naxals Have Captured Institutional Narratives: PM Modi’s Bastar Diwali Address Signals Major Security & Infrastructure Shift",
    title_hi: "बस्तर में पीएम मोदी का संबोधन: 'दिमागी नक्सलियों' पर सख्त रुख, 12,000 करोड़ के विकास गलियारे की घोषणा",
    deck: "Speaking during his Diwali visit to Chhattisgarh's Bastar heartland, the Prime Minister combined warnings against intellectual sympathizers of extremism with unprecedented infrastructure outlays.",
    deck_hi: "छत्तीसगढ़ के बस्तर दौरे पर प्रधानमंत्री ने चरमपंथ के बौद्धिक समर्थकों को चेतावनी देते हुए क्षेत्र के लिए ऐतिहासिक 12,000 करोड़ रुपये के बुनियादी ढांचे की घोषणा की।",
    category: "india",
    author: DEMO_AUTHORS.pankhudi,
    published_at: "2026-11-14T06:30:00.000Z",
    reading_time_mins: 6,
    word_count: 1450,
    hero_image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1600&q=80",
    hero_image_caption: "Prime Minister Narendra Modi interacting with local communities and security forces during his ground tour of Chhattisgarh's southern Bastar belt.",
    hero_image_credit: "Press Information Bureau (PIB India)",
    is_lead_story: true,
    tags: ["Narendra Modi", "Bastar", "National Security", "Chhattisgarh", "Tribal Welfare"],
    key_takeaways: [
      "PM Modi used his Diwali address in Bastar to sharply distinguish between arms-bearing insurgents and urban intellectual sympathizers ('Dimagi Naxals').",
      "Announced a ₹12,000 Crore multimodal transport corridor linking Jagdalpur to Raipur to accelerate industrial and economic integration.",
      "Reaffirmed the Union Home Ministry's stated March 2026 deadline for ending left-wing extremism across the remaining red corridors.",
      "Emphasized that education, digital inclusion, and direct welfare transfers remain the central pillar of counter-insurgency doctrine.",
    ],
    why_it_matters: "Bastar represents both the final frontier of Left-Wing Extremism (LWE) in India and one of the nation's richest mineral reservoirs. The Prime Minister's deliberate physical presence on Diwali confirms the Centre's dual-track approach: aggressive infrastructure rollouts coupled with zero tolerance for urban support networks.",
    content_markdown: `
### Ground Realities in South Bastar

During an extensive morning address delivered before security personnel and tribal council representatives in Jagdalpur, Prime Minister Narendra Modi reiterated the government's resolve to dismantle left-wing insurgent networks while simultaneously unveiling a comprehensive development package.

The visit, timed with Diwali celebrations, sent an unmistakable political and administrative signal across the central tribal heartland. In recent months, multi-agency operations by the Central Reserve Police Force (CRPF) and Chhattisgarh state police have squeezed active insurgent cells into shrinking forest pockets along the Abujhmad perimeter.

> *"Those who hold guns in the jungle have already lost moral ground. But far more insidious are the 'Dimagi Naxals'—intellectual enablers who exploit institutional platforms to stall roads, schools, and tribal empowerment."*
> — Prime Minister Narendra Modi, Bastar Address

### The ₹12,000 Crore Bastar Multimodal Corridor

Beyond security rhetoric, the core operational takeaway was the announcement of the Bastar Connectivity Initiative. Funded under PM GatiShakti, the package includes:

1. **Four-Laning of NH-30**: Modernizing the lifeline connecting Raipur, Dhamtari, and Jagdalpur, reducing heavy freight travel times by nearly 45%.
2. **Tribal Health and Telemedicine Grid**: 40 specialized solar-powered diagnostic centers operated in partnership with AIIMS Raipur.
3. **Eklavya Model Residential Schools Expansion**: Sanctioning of 18 new residential boarding campuses dedicated to indigenous youth in Sukma, Bijapur, and Dantewada.

Official Home Ministry data reflects a 76% decline in LWE-related violent incidents over the past decade. However, ground analysts emphasize that long-term stabilization hinges upon whether the economic fruits of road-building reach localized gram sabhas rather than only industrial mining conglomerates.

### Strategic Implications for Union Governance

The Prime Minister's speech comes as Union Home Minister Amit Shah reiterated the March 2026 target to declare India free from organized Naxal violence. By coupling physical presence in Bastar with harsh words against ideological facilitators, the central leadership is preparing both legal and administrative mechanisms to tighten scrutiny over unregistered foreign funding and legal interventions that have historically delayed critical infrastructure projects in mineral-rich states.
`,
    citations: [
      { label: "Prime Minister's Office Official Release", url: "https://pib.gov.in", publisher: "Press Information Bureau" },
      { label: "Ministry of Home Affairs LWE Annual Assessment", url: "https://mha.gov.in", publisher: "Ministry of Home Affairs" },
      { label: "Chhattisgarh State Police Operations Summary", url: "https://cgpolice.gov.in", publisher: "DGP Chhattisgarh" },
    ],
  },
  {
    id: "art-2",
    slug: "rbi-digital-rupee-cbdc-cross-border-remittances",
    title: "RBI Clears Cross-Border Wholesale Digital Rupee: How Programmable CBDCs Threaten SWIFT’s 4% Fee Monopoly",
    title_hi: "आरबीआई का डिजिटल रुपया: सीमा पार प्रेषण के लिए सीबीडीसी का विस्तार, स्विफ्ट शुल्क प्रणाली पर असर",
    deck: "The Reserve Bank of India is finalizing pilot frameworks connecting India's CBDC directly with Singapore's PayNow and the UAE's mBridge, slashing diaspora remittance costs from 6.2% to under 0.8%.",
    deck_hi: "भारतीय रिज़र्व बैंक सिंगापुर के पे-नाउ और यूएई के एम-ब्रिज से ई-रुपये को जोड़ने की तैयारी में, जिससे प्रवासी भारतीयों के प्रेषण शुल्क में 85% की भारी कमी आएगी।",
    category: "markets",
    author: DEMO_AUTHORS.pankhudi,
    published_at: "2026-11-13T14:15:00.000Z",
    reading_time_mins: 5,
    word_count: 1200,
    hero_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    hero_image_caption: "The Reserve Bank of India headquarters in Mumbai, where governor-level discussions on sovereign digital currencies reached operational maturity this week.",
    hero_image_credit: "Reserve Bank of India Archives",
    is_secondary_story: true,
    tags: ["RBI", "Digital Rupee", "CBDC", "Remittances", "Fintech"],
    key_takeaways: [
      "Diaspora remittances to India reached $125 Billion last year, with correspondent banking fees consuming approximately $6.8 Billion.",
      "Direct programmable CBDC settlements eliminate multiple intermediary correspondent banks, settling transactions in under 7 seconds.",
      "Bilateral testing between RBI and the UAE Central Bank is scheduled to begin commercial settlements in Q1 2027.",
    ],
    why_it_matters: "For the millions of Indian expatriates working in the Gulf and Southeast Asia, remittance deductions represent a direct tax on labor. A sovereign peer-to-peer settlement network drastically reduces fees and enhances rupee liquidity globally.",
    content_markdown: `
The Reserve Bank of India has expanded testing of the wholesale and retail Central Bank Digital Currency (e₹), clearing bilateral corridors that bypass the Western-dominated SWIFT correspondent banking apparatus.

According to senior central banking officials familiar with the pilot, India is testing synchronized atomic settlements with the UAE’s Central Bank and the Monetary Authority of Singapore. Under traditional correspondent banking, wire transfers between Dubai and Kochi pass through two to three intermediary clearing houses in London or New York, incurring average processing costs between 4.8% and 7.1%.

By contrast, bilateral CBDC transactions utilize cryptographic ledgers where tokenized sovereign fiat is debited and credited simultaneously without foreign exchange spreads, delivering funds into beneficiary bank accounts in seconds.
`,
    citations: [
      { label: "RBI Bulletin on Financial Innovations", url: "https://rbi.org.in", publisher: "Reserve Bank of India" },
      { label: "World Bank Migration and Development Brief", url: "https://worldbank.org", publisher: "World Bank Group" },
    ],
  },
  {
    id: "art-3",
    slug: "india-semiconductor-mission-micron-tata-fab",
    title: "Dholera to Sanand: Inside India’s $18 Billion Race to Assemble Its First Commercial Silicon Wafers",
    title_hi: "धोलेरा से साणंद तक: भारत का 18 अरब डॉलर का सेमीकंडक्टर मिशन और घरेलू चिप निर्माण की प्रगति",
    deck: "With Micron's packaging plant operational and Tata Electronics breaking ground on the Dholera mega-fab with Taiwan's PSMC, India is transforming from chip designer to hardware foundry.",
    deck_hi: "माइक्रोन के संयंत्र संचालन और ताइवान की पीएसएमसी के साथ टाटा इलेक्ट्रॉनिक्स के धोलेरा मेगा-फैब निर्माण के साथ भारत वैश्विक चिप विनिर्माण का नया केंद्र बन रहा है।",
    category: "tech",
    author: DEMO_AUTHORS.rohan,
    published_at: "2026-11-13T10:00:00.000Z",
    reading_time_mins: 7,
    word_count: 1600,
    hero_image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    hero_image_caption: "Silicon wafer fabrication cleanroom technology arriving at manufacturing corridors across western India.",
    hero_image_credit: "India Semiconductor Mission / MeitY",
    is_secondary_story: true,
    tags: ["Semiconductors", "Tata Electronics", "Micron", "Make In India", "Tech"],
    key_takeaways: [
      "India currently designs over 20% of the world's leading microchips but historically owned zero domestic fabrication capacity.",
      "The Tata-PSMC Dholera fab is targeting 28nm, 40nm, and 90nm mature nodes for automotive, power, and telecommunications supply chains.",
      "Ultrapure water infrastructure and round-the-clock uninterrupted renewable power are being piped directly to Gujarat's industrial special zones.",
    ],
    why_it_matters: "Mature-node semiconductor fabrication secures automotive, defense, and power grid electronics from geopolitical supply chain chokepoints in the Taiwan Strait.",
    content_markdown: `
Two hours south of Ahmedabad, in the salt flats of Dholera, construction cranes operate 24 hours a day under floodlights. Tata Electronics' ₹91,000 Crore foundry, built in technical partnership with Taiwan's Powerchip Semiconductor Manufacturing Corp (PSMC), is the crown jewel of the Union Government's India Semiconductor Mission (ISM).

While global headlines obsess over sub-3nm chips powering next-generation smartphones and AI accelerators, the lifeblood of automotive systems, aerospace, solar inverters, and telecom base stations relies heavily on 28nm and 40nm mature legacy nodes.

By securing domestic production of these foundational nodes, Indian industrial manufacturing insulates itself against the recurring component freezes that crippled automotive factories throughout 2021 and 2022.
`,
    citations: [
      { label: "India Semiconductor Mission Portal", url: "https://ism.gov.in", publisher: "Ministry of Electronics & IT" },
      { label: "Tata Electronics Corporate Announcements", url: "https://tataelectronics.com", publisher: "Tata Sons" },
    ],
  },
  {
    id: "art-4",
    slug: "delhi-ncr-air-quality-emergency-stubble-inversion",
    title: "Why Delhi Chokes Every November: Thermal Inversion, Wind Stagnation, and the 72-Hour Satellite Stubble Spike",
    title_hi: "दिल्ली का वायु संकट: मौसम की मार, पराली और वायु गुणवत्ता सूचकांक का वैज्ञानिक विश्लेषण",
    deck: "ZestFeedX data investigation analyzes CPCB continuous ambient air monitoring stations alongside NASA VIIRS satellite fire counts to dissect the seasonal capital smog trap.",
    category: "health",
    author: DEMO_AUTHORS.pankhudi,
    published_at: "2026-11-12T16:00:00.000Z",
    reading_time_mins: 5,
    word_count: 1100,
    hero_image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    hero_image_caption: "Dense particulate smog settling over landmark broadways in central New Delhi on a calm November morning.",
    hero_image_credit: "Central Pollution Control Board",
    tags: ["Delhi AQI", "Air Pollution", "Health", "Environment", "CPCB"],
    key_takeaways: [
      "Surface wind speeds below 4 km/h combined with nighttime temperature drop create a low thermal inversion lid over the Indo-Gangetic basin.",
      "Stubble burning in Punjab and Haryana accounts for 28% to 34% of peak PM2.5 load during this specific 10-day harvest window.",
      "Local vehicular emissions and construction dust provide the continuous baseline floor that traps particulate matter at hazardous levels.",
    ],
    why_it_matters: "Until seasonal crop residue management is monetized into commercially viable biomass pellets for thermal power plants, regional bans alone cannot counter atmospheric physics.",
    content_markdown: `
Every year between late October and mid-November, residents of the National Capital Region wake up to a familiar copper-tinted haze and burning eyes. While social media degenerates into annual blame games between regional political parties, atmospheric scientists point to an unrelenting meteorological convergence.

The Indo-Gangetic Plains act as a geological bowl bordered by the Himalayas. When post-monsoon temperatures drop, warm air rises while cold, dense air settles near the ground, creating a thermal inversion lid that prevents particulate emissions from dispersing vertically.
`,
    citations: [
      { label: "CPCB Real-Time Air Quality Portal", url: "https://app.cpcbccr.com", publisher: "CPCB" },
      { label: "System of Air Quality and Weather Forecasting And Research", url: "http://safar.tropmet.res.in", publisher: "SAFAR India" },
    ],
  },
  {
    id: "art-5",
    slug: "indias-green-hydrogen-subsidy-global-clean-energy",
    title: "The Green Ammonia Highway: How India Plans to Supply 10% of Europe and Japan’s Clean Fuel by 2030",
    title_hi: "हरित हाइड्रोजन क्रांति: भारत का वैश्विक स्वच्छ ऊर्जा निर्यात का खाका",
    deck: "With ultra-low solar generation costs in Rajasthan and deepwater port connectivity in Gujarat and Odisha, Indian green ammonia tenders are undercutting European domestic production.",
    category: "markets",
    author: DEMO_AUTHORS.pankhudi,
    published_at: "2026-11-11T12:00:00.000Z",
    reading_time_mins: 4,
    word_count: 980,
    hero_image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80",
    hero_image_caption: "Solar array infrastructure powering coastal hydrogen and ammonia synthesis complexes in Western India.",
    hero_image_credit: "Ministry of New and Renewable Energy",
    tags: ["Green Energy", "Hydrogen", "Renewables", "Economy"],
    key_takeaways: [
      "National Green Hydrogen Mission allocated ₹19,744 Crore in production-linked incentives for electrolyzer manufacturing.",
      "Cost of green hydrogen generation in India is projected to decline to $1.80/kg by 2028, among the lowest globally.",
    ],
    why_it_matters: "Decarbonizing steel and fertilizer manufacturing is essential for Indian industry to evade European Union Carbon Border Adjustment Mechanism (CBAM) levies.",
    content_markdown: `
Heavy industrial shipping from Kandla and Paradip is preparing to transport the first commercial shipments of green ammonia synthesized with renewable solar power. As major economies establish mandatory low-carbon mandates for maritime fuel and synthetic fertilizers, India's geographic advantage in solar irradiance provides a structural pricing edge.
`,
    citations: [
      { label: "MNRE National Green Hydrogen Mission Document", url: "https://mnre.gov.in", publisher: "MNRE" },
    ],
  },
  {
    id: "art-6",
    slug: "understanding-dpdp-act-2023-guide-for-citizens",
    title: "Understanding DPDP Act 2023: What Every Indian Digital Consumer Must Know About Consent",
    title_hi: "डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम 2023: नागरिकों के लिए सम्पूर्ण मार्गदर्शिका",
    deck: "Why consent managers, financial penalties up to ₹250 Cr, and children's data guardrails will alter how digital platforms operate in India.",
    category: "explainers",
    author: DEMO_AUTHORS.rohan,
    published_at: "2026-11-12T09:00:00.000Z",
    reading_time_mins: 4,
    word_count: 1050,
    hero_image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    hero_image_caption: "Digital cybersecurity and consumer consent architecture under the Digital Personal Data Protection Act.",
    hero_image_credit: "Data Protection Board of India / MeitY",
    tags: ["DPDP Act", "Privacy", "Tech Policy", "Data Protection"],
    key_takeaways: [
      "The Digital Personal Data Protection (DPDP) Act 2023 introduces stringent consent requirements for processing digital personal data.",
      "Penalties for non-compliance and security breaches can reach up to ₹250 Crore per violation, adjudicated by the Data Protection Board of India.",
      "Data fiduciaries must appoint Data Protection Officers and provide registered consent revocation mechanisms.",
      "Explicit parental consent is mandated before processing personal data of individuals under 18 years of age.",
    ],
    why_it_matters: "Every Indian consumer gains enforceable rights over their data footprint, including rights to access, correction, erasure, and grievance redressal.",
    content_markdown: `
### The New Era of Indian Data Sovereignty

The Digital Personal Data Protection (DPDP) Act represents a paradigm shift in how private corporations and state entities collect, store, and monetize Indian digital personal data.

Under the framework, every entity that determines the purpose of processing is categorized as a **Data Fiduciary**, while citizens are designated as **Data Principals**. For consumers, the days of opaque 40-page terms and conditions with pre-ticked consent boxes are legally obsolete.

### Key Rights Granted to Citizens

1. **Right to Notice & Clear Consent**: Any request for personal data must be accompanied by an itemized notice explaining the exact purpose in plain language, accessible in English and any of the 22 Eighth Schedule languages.
2. **Right to Withdraw Consent**: Revoking access must be as straightforward as granting it, managed via interoperable Consent Managers.
3. **Right to Erasure**: Fiduciaries must delete personal data once the specified purpose is fulfilled, unless retention is legally mandated.
`,
    citations: [
      { label: "Ministry of Electronics and Information Technology DPDP Gazette", url: "https://meity.gov.in", publisher: "MeitY" },
      { label: "Data Protection Board of India Operational Rules", url: "https://dpbi.gov.in", publisher: "Government of India" },
    ],
  },
  {
    id: "art-7",
    slug: "how-rupee-dirham-bilateral-trade-settlement-works",
    title: "How Rupee-Dirham Bilateral Trade Settlement Works in Practice: De-Dollarizing Bilateral Commerce",
    title_hi: "रुपया-दिरहम द्विपक्षीय व्यापार निपटान: अमेरिकी डॉलर पर निर्भरता कम करने की प्रक्रिया",
    deck: "A step-by-step breakdown of how local currency settlements eliminate foreign exchange friction for Indian importers and Gulf exporters.",
    category: "explainers",
    author: DEMO_AUTHORS.pankhudi,
    published_at: "2026-11-10T11:00:00.000Z",
    reading_time_mins: 5,
    word_count: 1200,
    hero_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    hero_image_caption: "Trade corridors connecting Mumbai's banking center with Abu Dhabi and Dubai.",
    hero_image_credit: "Reserve Bank of India",
    tags: ["Rupee Trade", "UAE", "Economy", "Foreign Exchange"],
    key_takeaways: [
      "The Reserve Bank of India and UAE Central Bank operationalized the Local Currency Settlement (LCS) system.",
      "Transactions are settled directly between INR Special Vostro Rupee Accounts (SVRA) and AED accounts.",
      "Exporters and importers save 2% to 3.5% in dollar conversion and correspondent banking spread fees.",
    ],
    why_it_matters: "As bilateral trade between India and the UAE nears $100 Billion, trading in local currencies cushions both nations against dollar liquidity shocks.",
    content_markdown: `
Under the Local Currency Settlement (LCS) agreement signed between the Reserve Bank of India and the Central Bank of the UAE, bilateral trade transactions in oil, gems, jewellery, and manufactured goods can be invoiced directly in Indian Rupees (INR) or UAE Dirhams (AED).

Previously, an Indian importer buying oil from Abu Dhabi had to convert Rupees to US Dollars through correspondent banks in New York, and the UAE exporter had to convert those Dollars to Dirhams. Under LCS, the transaction is settled domestically via Special Rupee Vostro Accounts maintained in partner banks.
`,
    citations: [
      { label: "RBI Framework for Invoicing Trade in Indian Rupee", url: "https://rbi.org.in", publisher: "Reserve Bank of India" },
    ],
  },
  {
    id: "art-8",
    slug: "physics-of-winter-smog-delhi-topography",
    title: "The Physics of Winter Smog: Why Delhi’s Topography Multiplies Smoke",
    title_hi: "शीतकालीन धुंध का भौतिक विज्ञान: दिल्ली का भौगोलिक परिवेश प्रदूषण को कैसे बढ़ाता है",
    deck: "Thermal inversion, wind shears, and planetary boundary layer contraction explained simply with atmospheric science diagrams.",
    category: "explainers",
    author: DEMO_AUTHORS.pankhudi,
    published_at: "2026-11-08T08:00:00.000Z",
    reading_time_mins: 6,
    word_count: 1300,
    hero_image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    hero_image_caption: "Atmospheric inversion layer trapping particulate matter over the National Capital Region.",
    hero_image_credit: "Indian Meteorological Department (IMD)",
    tags: ["Delhi Smog", "Atmospheric Physics", "AQI", "Science"],
    key_takeaways: [
      "The planetary boundary layer contracts from 2,000 meters in summer to below 300 meters in winter, compressing pollutants.",
      "The Indo-Gangetic Plains act as a geological bowl where cold Himalayan air settles beneath warmer air layers.",
      "Without surface wind speeds above 10 km/h, particulate concentration compounds exponentially day-on-day.",
    ],
    why_it_matters: "Recognizing that seasonal pollution is driven by atmospheric mechanics emphasizes that regional emissions cuts must be year-round, not just reactive in November.",
    content_markdown: `
Every winter, public commentary focuses on seasonal stubble burning and vehicular tailpipes. However, the fundamental amplifier is atmospheric physics and the unique geography of northern India.

During normal daytime conditions, the earth's surface warms, heating the air above it. This warm, buoyant air rises, creating vertical ventilation that carries smoke and particulates high into the troposphere where they disperse.

In winter, clear nocturnal skies lead to rapid radiational surface cooling. Cold air becomes denser and settles near the ground, while warmer air floats above it. This upside-down temperature gradient is known as a **thermal inversion**. It acts as an invisible lid, locking in every kilogram of smoke produced at ground level.
`,
    citations: [
      { label: "SAFAR Atmospheric Physics Technical Brief", url: "http://safar.tropmet.res.in", publisher: "SAFAR India" },
    ],
  },
  {
    id: "art-9",
    slug: "diaspora-consular-student-visa-h1b-reform-2026",
    title: "Student Visa Caps, H-1B Backlogs & OCI Safeguards: The 2026 Policy Overhaul for the Global Indian Diaspora",
    title_hi: "छात्र वीज़ा सीमा, एच-1बी बैकलॉग और ओसीआई अधिकार: प्रवासी भारतीयों के लिए 2026 की नीतिगत समीक्षा",
    deck: "With Canada capping international student intakes, the US pilot-testing domestic visa stamping, and the UK expanding bilateral youth mobility, how 32 million overseas Indians navigate new consular regimes.",
    deck_hi: "कनाडा द्वारा अध्ययन परमिट सीमित करने, अमेरिका में इन-कंट्री वीज़ा नवीनीकरण और ब्रिटेन में युवा गतिशीलता समझौते के बीच 3.2 करोड़ प्रवासी भारतीयों पर नीतिगत प्रभाव।",
    category: "world",
    author: DEMO_AUTHORS.rohan,
    published_at: "2026-11-14T04:00:00.000Z",
    reading_time_mins: 6,
    word_count: 1350,
    hero_image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
    hero_image_caption: "International travel departures and diaspora consular services connecting major Indian metros with global hubs in North America and Europe.",
    hero_image_credit: "Ministry of External Affairs (MEA)",
    tags: ["Indian Diaspora", "Immigration", "H-1B", "Student Visa", "Consular Affairs"],
    key_takeaways: [
      "Over 1.3 million Indian students are currently enrolled in foreign universities, facing tighter post-study work visa requirements in Ottawa and Canberra.",
      "The US State Department is expanding domestic visa renewal pilots, reducing international consular wait times for H-1B and L-1 tech workers.",
      "India's Ministry of External Affairs is operationalizing fully digitized MADAD 2.0 consular portals across 185 overseas missions.",
    ],
    why_it_matters: "With remittances exceeding $125 Billion annually, the legal stability, dual taxation treaties, and consular protection of the Indian diaspora are integral to Indian macroeconomic security.",
    content_markdown: `
### Shifting Ground Across North America & Europe

For the 32 million members of the global Indian diaspora—the largest migrant population in the world—2026 marks a decisive turning point in bilateral immigration frameworks and consular administration.

Across North America, the United Kingdom, and the European Union, host governments are recalibrating immigration targets in response to domestic housing pressures and healthcare bottlenecks. In Ottawa, Canada's federal government implemented a 35% reduction in approved study permits, introducing stringent provincial attestation letters that directly impacted over 300,000 prospective Indian undergraduates.

Concurrently in Washington, the Department of State's domestic visa renewal pilot has expanded from its initial 20,000-person cohort to include all eligible H-1B and L-1 primary visa holders, sparing thousands of Indian software engineers and biomedical researchers the ordeal of travelling to Chennai or Hyderabad for routine passport foil stamping.

> *"The diaspora is not merely a remittance pipeline; it is India's sovereign geopolitical bridgehead. Ensuring their institutional dignity and consular safeguards is our highest diplomatic priority."*
> — Senior MEA Consular Official, New Delhi

### Digital Consular Infrastructure: MADAD 2.0

To match these evolving realities, New Delhi has rolled out the MADAD 2.0 digital governance suite. Key upgrades include:

1. **Instant OCI Card Tracking**: Elimination of legacy paper application queues through biometric verification tied to DigiLocker and Passport Seva Kendra APIs.
2. **Emergency Repatriation Escrow**: A direct digital distress insurance mechanism providing immediate humanitarian and legal aid to stranded Gulf workers.
3. **Bilateral Double Tax Avoidance (DTAA) Resolution**: Automated tax withholding calculators reconciling Indian NRE/NRO fixed deposits with IRS 1040 and HMRC self-assessment tax filings.
`,
    citations: [
      { label: "Ministry of External Affairs Diaspora Welfare Report", url: "https://mea.gov.in", publisher: "MEA India" },
      { label: "US State Department Consular Affairs", url: "https://travel.state.gov", publisher: "US Department of State" },
    ],
  },
];

export const CURATED_BRIEFS: CuratedBrief[] = [
  {
    id: "cr-1",
    title: "CBSE Issues 2027 Class 12 Subject Schedule With Enhanced Focus on Practical Application",
    title_hi: "सीबीएसई ने कक्षा 12वीं की परीक्षा समय सारिणी जारी की",
    summary: "The Central Board of Secondary Education has released the provisional examination calendar for 2027, introducing revised practical evaluation guidelines and standardized morning shifts across all regional examination zones.",
    source_name: "The Times of India",
    source_url: "https://timesofindia.indiatimes.com/education",
    published_at: "2026-11-14T05:30:00.000Z",
    category: "india",
  },
  {
    id: "cr-2",
    title: "Indian Navy Coordinates Safe Evacuation of 19 Merchant Seafarers Stranded Off Gulf of Aden",
    title_hi: "अदन की खाड़ी में फंसे 19 भारतीय नाविकों को सुरक्षित निकाला गया",
    summary: "Working alongside international maritime security authorities, the Indian Navy successfully facilitated the safe repatriation of 19 commercial seafarers whose merchant vessel suffered mechanical failure in contested international shipping lanes.",
    source_name: "The Hindu",
    source_url: "https://thehindu.com/news/national",
    published_at: "2026-11-13T22:00:00.000Z",
    category: "world",
  },
  {
    id: "cr-3",
    title: "Google CEO Sundar Pichai Shares Rangoli Photographs From Bengaluru Engineering Hub",
    title_hi: "सुंदर पिचाई ने भारतीय कार्यालय में दिवाली समारोह की झलकियां साझा कीं",
    summary: "Google Chief Executive Sundar Pichai shared traditional festive greetings celebrating Diwali alongside engineering personnel at the tech giant's major research campus in Bengaluru, highlighting Indian developer contributions.",
    source_name: "NDTV Profit",
    source_url: "https://ndtvprofit.com/tech",
    published_at: "2026-11-13T19:00:00.000Z",
    category: "tech",
  },
  {
    id: "cr-4",
    title: "Nvidia Accuses Former Automotive Executive Alice Huang of Industrial Trade Secret Theft",
    title_hi: "एनवीडिया ने पूर्व कार्यकारी पर बौद्धिक संपदा चोरी का आरोप लगाया",
    summary: "In a newly unsealed federal complaint in California, Nvidia alleges a former engineering director stole proprietary self-driving simulation code shortly before accepting a senior leadership position at a competing automotive startup.",
    source_name: "Reuters",
    source_url: "https://reuters.com/technology",
    published_at: "2026-11-13T18:00:00.000Z",
    category: "tech",
  },
  {
    id: "cr-5",
    title: "Christopher Nolan Defends Directors Guild Guardrails Against Unregulated Generative AI In Cinema",
    title_hi: "क्रिस्टोफर नोलन ने फिल्मों में एआई के उपयोग पर निर्देशकों के अधिकारों का समर्थन किया",
    summary: "Oscar-winning director Christopher Nolan addressed the Directors Guild of America, emphasizing that while computational rendering tools aid visual craft, artistic authorial credit and creative control must remain strictly human.",
    source_name: "The Indian Express",
    source_url: "https://indianexpress.com/entertainment",
    published_at: "2026-11-13T16:00:00.000Z",
    category: "entertainment",
  },
  {
    id: "cr-6",
    title: "Domestic Companion Care Startups Witness 40% Surge in Elderly Support Demand Across Tier-1 Cities",
    title_hi: "बुजुर्गों की देखभाल के लिए घरेलू साथी सेवाओं की मांग में बढ़ोतरी",
    summary: "Indian healthcare startups offering structured companion assistance, medical chaperoning, and daily cognitive engagement for senior citizens report significant expansion fueled by nuclear families and nonresident diaspora children.",
    source_name: "Al Jazeera",
    source_url: "https://aljazeera.com/economy",
    published_at: "2026-11-13T12:00:00.000Z",
    category: "health",
  },
  {
    id: "cr-7",
    title: "BCCI Finalizes Domestic Red-Ball Cricket Incentive Package To Prioritize Ranji Trophy Participation",
    title_hi: "बीसीसीआई ने घरेलू प्रथम श्रेणी क्रिकेट के लिए विशेष प्रोत्साहन योजना लागू की",
    summary: "The Board of Control for Cricket in India has instituted enhanced match fees and contractual weightage for contracted players participating in full domestic Ranji seasons, aiming to reinforce traditional red-ball development.",
    source_name: "Press Trust of India (PTI)",
    source_url: "https://ptinews.com/sports",
    published_at: "2026-11-13T09:00:00.000Z",
    category: "sports",
  },
];

export const MORNING_BRIEF = {
  edition: "New Delhi Morning Dispatch",
  edition_hi: "नई दिल्ली प्रभात संस्करण",
  date_label: "Saturday, November 14, 2026",
  date_label_hi: "शनिवार, 14 नवंबर 2026",
  editor: DEMO_AUTHORS.pankhudi,
  published_time_ist: "07:00 IST",
  summary: "Five critical developments driving policy, markets, and regional security this morning across India and overseas.",
  summary_hi: "भारत और विश्व में आज की पांच सबसे महत्वपूर्ण नीतियां, बाजार एवं सुरक्षा से जुड़े घटनाक्रम।",
  items: [
    {
      num: 1,
      title: "PM Modi in Bastar",
      title_hi: "बस्तर में पीएम मोदी",
      text: "Prime Minister addresses tribal gathering in Jagdalpur; signals intensified crackdown against urban extremist ideologues while rolling out ₹12,000 Cr connectivity corridor.",
      text_hi: "जगदलपुर में आदिवासी सम्मेलन को संबोधित करते हुए पीएम ने 'दिमागी नक्सलियों' पर सख्त कार्रवाई का संकेत दिया और 12,000 करोड़ के गलियारे की घोषणा की।",
      link: "/article/pm-modi-diwali-bastar-tribal-corridor-security",
    },
    {
      num: 2,
      title: "Cross-Border Rupee Pilot",
      title_hi: "सीमा पार रुपया पायलट",
      text: "Reserve Bank of India clears bilateral programmable CBDC pilot with UAE and Singapore to compress remittance transaction costs below 1%.",
      text_hi: "आरबीआई ने यूएई और सिंगापुर के साथ द्विपक्षीय सीबीडीसी पायलट को मंजूरी दी ताकि प्रेषण लागत 1% से कम हो सके।",
      link: "/article/rbi-digital-rupee-cbdc-cross-border-remittances",
    },
    {
      num: 3,
      title: "Delhi Air Quality Monitor",
      title_hi: "दिल्ली वायु गुणवत्ता",
      text: "NCR AQI averages 342 ('Very Poor') as wind stagnation locks in agricultural residue smoke and baseline vehicular emissions. Commission enforces GRAP Stage III.",
      text_hi: "हवा की गति थमने से एनसीआर का एक्यूआई 342 ('बहुत खराब') पर पहुंचा। वायु गुणवत्ता प्रबंधन आयोग ने ग्रैप-3 लागू किया।",
      link: "/article/delhi-ncr-air-quality-emergency-stubble-inversion",
    },
    {
      num: 4,
      title: "Semiconductor Cleanrooms",
      title_hi: "सेमीकंडक्टर निर्माण",
      text: "Tata Electronics confirms first commercial wafer trials at Dholera fab scheduled for Q4 2026 in partnership with Taiwan's PSMC.",
      text_hi: "टाटा इलेक्ट्रॉनिक्स ने ताइवान की पीएसएमसी के साथ धोलेरा फैब में 2026 की चौथी तिमाही में पहले वाणिज्यिक वेफर परीक्षण की पुष्टि की।",
      link: "/article/india-semiconductor-mission-micron-tata-fab",
    },
    {
      num: 5,
      title: "Markets Preview",
      title_hi: "बाजार पूर्वावलोकन",
      text: "Nifty 50 futures indicate steady opening near 24,980. Brent crude cools to $73/barrel providing relief to state oil marketing companies.",
      text_hi: "निफ्टी 50 फ्यूचर्स 24,980 के करीब स्थिर शुरुआत का संकेत दे रहे हैं। ब्रेंट क्रूड $73/बैरल पर आने से राहत।",
      link: "/#markets",
    },
  ],
};

export const EXPLAINER_STORIES = [
  {
    id: "exp-1",
    title: "Understanding DPDP Act 2023: What Every Indian Digital Consumer Must Know About Consent",
    title_hi: "डिजिटल डेटा संरक्षण अधिनियम 2023: उपभोक्ताओं के लिए सहमति और गोपनीयता गाइड",
    subtitle: "Why consent managers, financial penalties up to ₹250 Cr, and children's data guardrails will alter your daily apps.",
    subtitle_hi: "सहमति प्रबंधक, 250 करोड़ रुपये तक का जुर्माना और बच्चों के डेटा सुरक्षा नियम आपके दैनिक ऐप्स को कैसे बदलेंगे।",
    slug: "understanding-dpdp-act-2023-guide-for-citizens",
    read_time: "4 min read",
    badge: "5 Things to Know",
    date: "Nov 12, 2026",
  },
  {
    id: "exp-2",
    title: "How Rupee-Dirham Bilateral Trade Settlement Works in Practice",
    title_hi: "रुपया-दिरहम द्विपक्षीय व्यापार निपटान: डॉलर के बिना लेन-देन की सरल प्रक्रिया",
    subtitle: "A step-by-step breakdown of how local currency settlements eliminate foreign exchange friction for Indian importers.",
    subtitle_hi: "स्थानीय मुद्रा निपटान प्रणाली कैसे भारतीय आयातकों और खाड़ी निर्यातकों के लिए विनिमय लागत घटाती है।",
    slug: "how-rupee-dirham-bilateral-trade-settlement-works",
    read_time: "5 min read",
    badge: "What Changes For You",
    date: "Nov 10, 2026",
  },
  {
    id: "exp-3",
    title: "The Physics of Winter Smog: Why Delhi’s Topography Multiplies Smoke",
    title_hi: "सर्दियों में धुंध का भौतिक विज्ञान: दिल्ली की भौगोलिक स्थिति और प्रदूषण चक्र",
    subtitle: "Thermal inversion, wind shears, and planetary boundary layer contraction explained simply with diagrams.",
    subtitle_hi: "थर्मल इन्वर्जन, मंद हवाएं और वायुमंडलीय सीमा परत का सिकुड़ना - मौसम विज्ञान के सरल विश्लेषण के साथ।",
    slug: "physics-of-winter-smog-delhi-topography",
    read_time: "6 min read",
    badge: "Why It Matters",
    date: "Nov 08, 2026",
  },
];
