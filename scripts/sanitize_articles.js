const fs = require('fs');
const vm = require('vm');

console.log("Starting Seed Articles Sanitization...");

const filePath = 'frontend/src/data/seedArticles.ts';
let code = fs.readFileSync(filePath, 'utf8');
code = code.replace(/import\s+.*?;/, '');
code = code.replace(/export\s+const\s+SEED_ARTICLES:\s*Article\[\]\s*=/, 'const SEED_ARTICLES =');
code += '\nSEED_ARTICLES;';

const rawArticles = vm.runInNewContext(code);
console.log(`Loaded ${rawArticles.length} articles from seedArticles.ts`);

const HINDI_EMOJIS = ["🚨", "⚡", "📌", "🔥", "🔴", "🎯", "📢"];
const HINDI_PREFIXES = [
  "बड़ा खुलासा:",
  "विशेष रिपोर्ट:",
  "ताज़ा अपडेट:",
  "अंदर की बात:",
  "ग्राउंड रिपोर्ट:",
  "महत्वपूर्ण जानकारी:",
  "बड़ी खबर:"
];

const ENG_PATTERNS = [
  "The Secret Truth Behind: {}",
  "Why Everyone Is Shocked By {}",
  "Behind Closed Doors: What Really Happened When {}",
  "The Untold Inside Story: How {} Is Shaking the Entire Sector",
  "Revealed: The Shocking Details Behind {}",
  "Why Insiders Are Calling {} a Total Game-Changer",
  "The Midnight Move: How {} Caught Everyone Completely Off Guard",
  "What Nobody Is Telling You About {}"
];

function cleanHindiTitle(rawTitle, originalTitle) {
  let t = (originalTitle || rawTitle || "").trim();
  
  // Strip emojis from beginning
  t = t.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\s]+/u, '').trim();

  // Strip known English curiosity patterns that wrapped Hindi
  t = t.replace(/^(Why Insiders Are Calling|What Nobody Is Telling You About|The Secret Truth Behind:|Behind Closed Doors: What Really Happened When|The Untold Inside Story: How|Revealed: The Shocking Details Behind|Why Everyone Is Shocked By|The Midnight Move: How)\s*/i, '');
  t = t.replace(/\s*(a Total Game-Changer|Is Shaking the Entire Sector|Caught Everyone Completely Off Guard).*$/i, '');

  // Strip news source suffixes
  t = t.replace(/\s*[-–—|]\s*(Jagran|Dainik Bhaskar|AajTak|India TV Hindi|PM India|NDTV Hindi|NDTV India|NDTV|Amar Ujala|Navbharat Times|Hindustan|Zee News|ABP News|News18|BBC Hindi|Jansatta).*$/i, '');
  
  // Strip leading punctuation
  t = t.replace(/^[^\u0900-\u097F\w]+/, '').trim();
  return t;
}

function cleanEnglishTitle(rawTitle, originalTitle) {
  let t = (originalTitle || rawTitle || "").trim();
  t = t.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\s]+/u, '').trim();

  // Strip existing patterns if already applied
  t = t.replace(/^(The Secret Truth Behind:|Why Everyone Is Shocked By|Behind Closed Doors: What Really Happened When|The Untold Inside Story: How|Revealed: The Shocking Details Behind|Why Insiders Are Calling|The Midnight Move: How|What Nobody Is Telling You About)\s*/i, '');
  t = t.replace(/\s*(a Total Game-Changer|Is Shaking the Entire Sector|Caught Everyone Completely Off Guard).*$/i, '');

  // Strip news source suffixes
  t = t.replace(/\s*[-–—|]\s*(The Hindu|DD News|NDTV|BBC|Reuters|Business Standard|Rediff|News On AIR|ANI News|The Times of India|Hindustan Times|Indian Express|Mint|Economic Times|Livemint).*$/i, '');
  
  t = t.replace(/^[^\w\s]+/, '').trim();
  return t;
}

function generateCleanHindiBody(title, desc) {
  const cleanDesc = desc.replace(/[a-zA-Z]/g, '').replace(/\s+/g, ' ').trim() || title;
  return `राष्ट्रीय व अंतरराष्ट्रीय मीडिया गलियारों से आज की बड़ी खबर। ${cleanDesc}। इस महत्वपूर्ण घटनाक्रम पर प्रशासनिक, नीतिगत और संस्थागत स्तर पर विस्तृत समीक्षा की जा रही है।

### प्रशासनिक समीक्षा एवं प्राथमिक बिंदु

आधिकारिक सूत्रों के अनुसार, इस पूरे मामले पर संबंधित विभागों और उच्चाधिकारियों द्वारा लगातार निगरानी रखी जा रही है। पारदर्शिता, नियमों का पालन और जनहित को सर्वोपरि रखते हुए सभी आवश्यक दिशा-निर्देश जारी किए गए हैं।

वरिष्ठ विशेषज्ञों का मानना है कि यह घटनाक्रम दूरगामी प्रभाव डालने वाला सिद्ध होगा। स्थिति पर नियंत्रण और कार्यकुशलता बनाए रखने के लिए विशेष पर्यवेक्षक दलों का गठन किया गया है।

### मुख्य बिंदु एवं प्रशासनिक स्थिति

| व्यवस्था बिंदु | प्रशासनिक स्थिति | वर्तमान स्थिति |
| :--- | :--- | :--- |
| विभागीय समीक्षा | उच्चस्तरीय समिति | सक्रिय एवं प्रगति पर |
| वैधानिक अनुपालन | दिशा-निर्देशों के अनुरूप | लागू |
| जन सूचना तंत्र | नियमित बुलेटिन जारी | सत्यापित |
| अंतर-विभागीय समन्वय | केंद्रीय व क्षेत्रीय डेस्क | समन्वित |

### ज़मीनी हकीकत एवं नीतिगत विश्लेषण

संबंधित विषय विशेषज्ञों ने पुष्टि की है कि संस्थागत जवाबदेही और स्थापित नियामक ढांचे भविष्य के कार्यों के लिए एक मानक स्थापित करेंगे। जनसाधारण और हितधारकों को पारदर्शी व सत्यापित जानकारी उपलब्ध कराने के स्पष्ट निर्देश दिए गए हैं।

संपादकीय विभाग द्वारा इस पूरे घटनाक्रम और आधिकारिक बुलेटिनों पर निरंतर नज़र रखी जा रही है। आगामी आधिकारिक सूचनाओं के साथ विश्लेषण का यह क्रम जारी रहेगा।`;
}

function generateCleanEnglishBody(cleanTitle, category, desc, sourceName) {
  const cleanDesc = desc.replace(/[\u0900-\u097F]/g, '').trim() || cleanTitle;
  return `In what senior correspondents and beat analysts describe as a consequential development for ${(category || "India").toUpperCase()}, verified dispatches confirm key milestones today. ${cleanDesc}. High-level reviews and official briefings are currently underway under multi-agency supervision to monitor developments in real time.

### Strategic Overview & Institutional Directives

Official communiqués released by administrative secretariats confirm that comprehensive inter-departmental coordination, protocol monitoring, and regulatory compliance have been prioritized to oversee this proceeding regarding ${cleanTitle}. Parliamentary observers emphasize that all standard operating procedures are being executed with strict adherence to established statutory guidelines, ensuring complete accountability, civic protection, and operational transparency across government ministries.

Addressing press correspondents during the morning briefing, senior spokespersons underscored that state apparatuses, ground intelligence desks, and verification mechanisms are maintaining round-the-clock surveillance to facilitate seamless public administration and maintain civil order across key jurisdictions.

### Ground Dynamics & Sectoral Realities

An examination of ground realities reveals that **Institutional Governance and Accountability** have reshaped the broader discourse surrounding ${cleanTitle}. Senior sector analysts note that this represents a coordinated institutional alignment aimed at safeguarding stakeholder welfare, regional stability, and legislative representation under constitutional norms.

Simultaneously, civic leaders, municipal authorities, and field observers have highlighted heightened public engagement across regional administrative circles. Verified ground assessments affirm that multi-agency supervisory committees are actively monitoring compliance metrics to uphold institutional confidence at every operational level.

### Sectoral Milestones & Governance Assessment

| Governance Parameter | Operational Benchmark | Statutory Status |
| :--- | :--- | :--- |
| Inter-Agency Oversight | Multi-Tier Secretariat Review | Verified & Active |
| Statutory Compliance | Strict Adherence to Legislative Mandate | Enforced |
| Public Transparency Index | High-Frequency Field Dispatches | Documented |
| Jurisdictional Coordination | National & Regional Secretariat Desk | Coordinated |

### Why This Matters: Strategic Impact & Policy Analysis

Beyond the immediate headlines, this development carries profound systemic implications for policy formulation and governance architecture. Independent legal scholars and political strategists point out that the institutional precedents established today create an authoritative framework that will guide future statutory implementations. By establishing clear accountability metrics, authorities are setting a vital benchmark that balances executive responsiveness with long-term systemic durability.

Furthermore, the decision directly impacts broader socio-economic dynamics, signaling to market participants, civic institutions, and the electorate that regulatory standards will be rigorously preserved. Analysts project that the ripple effects will influence parliamentary discussions in the upcoming session, creating renewed momentum for comprehensive institutional modernizations.

### Strategic Outlook & Long-Term Trajectory

Constitutional experts and senior commentators point out that the multi-tiered supervisory framework guarantees that administrative commitments translate into tangible legislative actions and grassroots representation. High-level secretariats have already initiated preliminary scheduling for subsequent review cycles to ensure persistent policy momentum.

Official bulletins and statutory filings will continue to be monitored by the editorial desk as verified reports and institutional documentations are finalized by competent authorities.`;
}

const sanitized = rawArticles.map((art) => {
  const rawTitle = art.original_title || art.title;
  const isHindi = /[\u0900-\u097F]/.test(rawTitle);

  if (isHindi) {
    const pureHindi = cleanHindiTitle(art.title, art.original_title);
    const prefixIdx = Math.abs(art.id || 0) % HINDI_PREFIXES.length;
    const emojiIdx = Math.abs(art.id || 0) % HINDI_EMOJIS.length;
    const finalTitle = `${HINDI_EMOJIS[emojiIdx]} ${HINDI_PREFIXES[prefixIdx]} ${pureHindi}`;

    // Clean summary: pure Hindi, no English trailing snippet
    let cleanDesc = (art.summary_hi || art.summary || pureHindi)
      .replace(/[a-zA-Z]/g, '')
      .replace(/Comprehensive investigative.*$/i, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (cleanDesc.length > 180) {
      cleanDesc = cleanDesc.slice(0, 180) + '...';
    }
    const finalSummary = `${cleanDesc} इस महत्वपूर्ण मामले पर प्रशासनिक और नीतिगत स्तर पर लगातार नजर रखी जा रही है।`;
    const finalContent = generateCleanHindiBody(pureHindi, cleanDesc);

    return {
      ...art,
      language: "hi",
      title: finalTitle,
      title_hi: finalTitle,
      title_en: "",
      original_title: pureHindi,
      summary: finalSummary,
      summary_hi: finalSummary,
      summary_en: "",
      content: finalContent,
      content_hi: finalContent,
      content_en: "",
      fomo_badge: "⚡ ताज़ा बुलेटिन",
      image_alt: `आधिकारिक समाचार छायाचित्र: ${pureHindi}`,
      tags: `${art.category || "India"}, Breaking News, National, Hindi News`
    };
  } else {
    // English Article
    const pureEnglish = cleanEnglishTitle(art.title, art.original_title);
    const patternIdx = Math.abs(art.id || 0) % ENG_PATTERNS.length;
    const emojiIdx = Math.abs(art.id || 0) % HINDI_EMOJIS.length;
    const finalTitle = `${HINDI_EMOJIS[emojiIdx]} ${ENG_PATTERNS[patternIdx].replace('{}', pureEnglish)}`;

    let cleanDesc = (art.summary_en || art.summary || pureEnglish)
      .replace(/[\u0900-\u097F]/g, '')
      .replace(/\.\.\.\s*Comprehensive investigative.*$/i, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (cleanDesc.length > 180) {
      cleanDesc = cleanDesc.slice(0, 180) + '...';
    }
    const finalSummary = `${cleanDesc} Comprehensive investigative reporting and verified dispatches from the news desk.`;
    const finalContent = generateCleanEnglishBody(pureEnglish, art.category, cleanDesc, art.source_name || "Bureau Wire");

    return {
      ...art,
      language: "en",
      title: finalTitle,
      title_en: finalTitle,
      title_hi: "",
      original_title: pureEnglish,
      summary: finalSummary,
      summary_en: finalSummary,
      summary_hi: "",
      content: finalContent,
      content_en: finalContent,
      content_hi: "",
      fomo_badge: `⚡ ${(art.category || "India").toUpperCase()} Wire`,
      image_alt: `Official news wire photograph: ${finalTitle}`,
      tags: `${(art.category || "India").toUpperCase()}, Breaking News, India, World, ${art.source_name || "Bureau"}`
    };
  }
});

// Format as valid TypeScript file
const header = `import { Article } from "@/types/news";\n\nexport const SEED_ARTICLES: Article[] = [\n`;
const itemsStr = sanitized.map(item => `  ${JSON.stringify(item, null, 2).replace(/\n/g, '\n  ')},`).join('\n');
const footer = `\n];\n`;

fs.writeFileSync(filePath, header + itemsStr + footer, 'utf8');

console.log("Sanitization complete!");
const hindiFinal = sanitized.filter(a => a.language === "hi");
const engFinal = sanitized.filter(a => a.language === "en");
console.log(`Summary: ${hindiFinal.length} pure Hindi articles, ${engFinal.length} pure English articles.`);
console.log("Sample Hindi Headline:", hindiFinal[0].title);
console.log("Sample English Headline:", engFinal[0].title);
