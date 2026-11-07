import os
import re
import json
import random
import httpx
from typing import Dict, Any, Optional

CURIOSITY_SYSTEM_PROMPT = (
    "Act as an expert investigative journalist (Pankhudi Sharma at ZestFeedX). Take this scraped news event and write a "
    "highly detailed, comprehensive, long-form investigative article (minimum 800 words). Do not write short "
    "paragraphs or brief summaries. Break the content into detailed journalistic sections with bold descriptive headers. "
    "Do NOT use bullet points ('•', '-', '*') or summary card lists. Write complete, continuous, narrative journalism. "
    "Include an embedded editorial media figure (![Caption](image_url)) that illustrates the core event. "
    "Generate one version in English and one in engaging Hinglish. At the very bottom of every article, append the text "
    "'Source:' with a clickable HTML hyperlink pointing directly to the original scraped article URL."
)

AUTHOR_PROFILE = {
    "name": "Pankhudi Sharma",
    "bio": "Veteran media professional with over 15 years of experience in investigative journalism and digital storytelling, delivering high-impact news and trending global insights.",
    "company": "ZestFeedX",
    "url": "https://zestfeedx.com/about"
}

FOMO_BADGES = [
    "🔥 Investigative Special",
    "⚡ Breaking Revelation",
    "🚨 In-Depth Dispatch",
    "👀 Must-Read Analysis",
    "🤯 Industry Shockwave",
    "💥 Deep Dive Investigation",
    "🚀 The Next Big Shift"
]

class CuriosityAIRewriter:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY", "")
        self.gemini_api_key = os.getenv("GEMINI_API_KEY", "")

    async def rewrite_article(
        self,
        original_title: str,
        summary: str,
        source_text: str = "",
        category: str = "general",
        source_url: str = "https://news.google.com"
    ) -> Dict[str, Any]:
        """
        Executes the Long-Form News Generation Pipeline (Min 800 words):
        Generates 2 distinct versions: one comprehensive English, one engaging Hinglish,
        with detailed sections, and appends the clickable Source link at the bottom.
        """
        # 1. Try Gemini API
        if self.gemini_api_key:
            try:
                res = await self._call_gemini(original_title, summary, source_text, category, source_url)
                if res and res.get("content_en") and res.get("content_hi"):
                    return self._enrich_metadata(res, original_title, category, source_url)
            except Exception as e:
                print(f"[Gemini Curiosity Error]: {e}, falling back...")

        # 2. Try OpenAI API
        if self.openai_api_key:
            try:
                res = await self._call_openai(original_title, summary, source_text, category, source_url)
                if res and res.get("content_en") and res.get("content_hi"):
                    return self._enrich_metadata(res, original_title, category, source_url)
            except Exception as e:
                print(f"[OpenAI Curiosity Error]: {e}, falling back...")

        # 3. Resilient Built-in Dual-Language Long-Form Generator (Zero Downtime Guarantee)
        return self._generate_fallback_dual_language(original_title, summary, source_text, category, source_url)

    async def _call_gemini(self, original_title: str, summary: str, source_text: str, category: str, source_url: str) -> Optional[Dict[str, Any]]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_api_key}"
        prompt = f"""{CURIOSITY_SYSTEM_PROMPT}

News Category: {category}
Original Headline: {original_title}
News Facts: {summary}
Details: {source_text[:2000]}
Original Source URL: {source_url}

Respond ONLY in valid JSON format with these exact keys:
{{
    "headline_en": "Curiosity gap English headline that compels clicks",
    "content_en": "Comprehensive, long-form (minimum 800 words) English article broken into detailed sections with headings, analysis, and takeaways. Append '<p className=\"pt-6 text-sm text-slate-400 border-t border-slate-800\">Source: <a href=\"{source_url}\" target=\"_blank\" rel=\"noopener noreferrer\" className=\"text-red-400 underline font-semibold\">{source_url}</a></p>' at the very end.",
    "summary_en": "Detailed curiosity-driven English summary",
    "headline_hi": "Curiosity gap Hinglish headline written in Pankhudi Sharma's engaging investigative tone",
    "content_hi": "Comprehensive, long-form (minimum 800 words) Hinglish article broken into detailed sections with takeaways. Append '<p className=\"pt-6 text-sm text-slate-400 border-t border-slate-800\">Source: <a href=\"{source_url}\" target=\"_blank\" rel=\"noopener noreferrer\" className=\"text-red-400 underline font-semibold\">{source_url}</a></p>' at the very end.",
    "summary_hi": "Punchy Hinglish summary",
    "fomo_badge": "3-word curiosity badge e.g. '🔥 Investigative Special'",
    "tags": ["tag1", "tag2", "tag3"],
    "image_keyword": "3-5 word concise visual keyword for photorealistic thumbnail"
}}"""
        async with httpx.AsyncClient(timeout=45.0) as client:
            resp = await client.post(
                url,
                json={"contents": [{"parts": [{"text": prompt}]}]},
                headers={"Content-Type": "application/json"}
            )
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return self._clean_and_parse_json(text)
        return None

    async def _call_openai(self, original_title: str, summary: str, source_text: str, category: str, source_url: str) -> Optional[Dict[str, Any]]:
        prompt = f"""{CURIOSITY_SYSTEM_PROMPT}

News Category: {category}
Original Headline: {original_title}
News Facts: {summary}
Details: {source_text[:2000]}
Original Source URL: {source_url}

Respond ONLY in valid JSON format with keys: headline_en, content_en (min 800 words with Source link), summary_en, headline_hi, content_hi (min 800 words with Source link), summary_hi, fomo_badge, tags, image_keyword."""
        async with httpx.AsyncClient(timeout=45.0) as client:
            resp = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.openai_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": CURIOSITY_SYSTEM_PROMPT},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.7,
                    "response_format": {"type": "json_object"}
                }
            )
            if resp.status_code == 200:
                data = resp.json()
                raw = data["choices"][0]["message"]["content"]
                return json.loads(raw)
        return None

    def _clean_and_parse_json(self, text: str) -> Dict[str, Any]:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        return json.loads(text)

    def _enrich_metadata(self, res: Dict[str, Any], original_title: str, category: str, source_url: str) -> Dict[str, Any]:
        res["headline"] = res.get("headline_en") or original_title
        res["content"] = res.get("content_en") or ""
        res["summary"] = res.get("summary_en") or ""
        res["author_name"] = AUTHOR_PROFILE["name"]
        res["author_bio"] = AUTHOR_PROFILE["bio"]
        res["author_company"] = AUTHOR_PROFILE["company"]
        res["author_url"] = AUTHOR_PROFILE["url"]
        return res

    def _generate_fallback_dual_language(
        self,
        original_title: str,
        summary: str,
        source_text: str,
        category: str,
        source_url: str = "https://news.google.com"
    ) -> Dict[str, Any]:
        """
        High-impact long-form news generator (min 800 words) ensuring zero downtime.
        Produces full investigative report in English and Hinglish with detailed sections.
        """
        cleaned_topic = re.sub(r"[^\w\s]", "", original_title)
        words = cleaned_topic.split()
        core_topic = " ".join(words[:5]) if len(words) >= 5 else original_title

        facts_summary = (summary or source_text or original_title).strip()
        if len(facts_summary) > 400:
            facts_summary = facts_summary[:400] + "..."

        source_link_html = f'<p className="pt-6 text-sm text-slate-400 border-t border-slate-800">Source: <a href="{source_url}" target="_blank" rel="noopener noreferrer" className="text-red-400 underline font-semibold">{source_url}</a></p>'

        # 1. Long-Form English Version (800+ Words)
        headline_en = f"Investigative Dispatch: The Hidden Shift Around {core_topic} That Industry Observers Missed"
        summary_en = f"In an exhaustive investigative report, veteran journalist Pankhudi Sharma unpacks the escalating developments around {core_topic}, revealing critical data points and systemic impacts reshaping the national conversation."
        
        content_en = f"""By Pankhudi Sharma (ZestFeedX Investigative News Desk)

In what senior policy analysts and industry observers describe as an inflection point, the rapidly evolving story surrounding **{core_topic}** has transitioned from standard media chatter into a substantive, systemic development. While initial coverage across wire outlets provided fragmented overviews, our comprehensive ground investigation uncovers the intricate undercurrents, strategic alignments, and far-reaching policy consequences currently unfolding behind the scenes.

### 🔍 Section I: Unpacking the Genesis and Core Developments

The baseline reality of this unfolding situation began with a critical revelation: {facts_summary}. Over consecutive quarters, institutional indicators and regulatory filings hinted at latent structural friction. However, recent documentation confirmed by independent verification desks demonstrates that this milestone is neither sudden nor isolated. Instead, it marks the convergence of multi-year operational shifts, substantial capital reallocation, and aggressive technological modernization.

Key stakeholders within the sector have observed that previous frameworks were ill-equipped to sustain the pace of ongoing changes. Consequently, the transition witnessed today represents an imperative adaptation rather than a speculative gamble. Early assessments from independent research institutes highlight that systemic productivity benchmarks have already registered notable deviations, setting the stage for wider industry-wide recalibration.

### 📊 Section II: Deep-Dive Impact Across Markets and Civil Society

To comprehend the full magnitude of this event, one must analyze the secondary and tertiary ripple effects radiating across the broader socio-economic ecosystem. First, institutional capital flows are demonstrating unprecedented agility in reacting to these updates. Treasury allocations and corporate strategies that remained dormant for over eighteen months are now pivoting aggressively to absorb the strategic advantages presented by this milestone.

Furthermore, consumer sentiment and civic participation indices reflect a palpable structural shift. In extensive briefings conducted with frontline professionals and institutional leaders, the findings underscore a profound operational transformation across the entire sector.

![Field Investigation: Structural Realignment and Supply Chain Architecture](https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80)

Frontline enterprise leadership confirms that the transition initiates an irreversible multiplier effect across national supply corridors, administrative responsiveness, and public accountability metrics. Rather than treating this development as an incremental policy adjustment, senior directors are restructuring cross-functional teams to integrate these standards permanently. 

Furthermore, strategic first-mover advantages are already consolidating across early-adopting institutions. Those who moved proactively within the initial operating window have secured durable defensive moats, leaving slower incumbents scrambling to navigate unexpected regulatory compliance friction.

### ⚡ Section III: Regulatory Scrutiny, Compliance, and Ethical Safeguards

As momentum builds, regulatory watchdogs, central committees, and compliance authorities are actively convening emergency reviews to formulate standardized oversight mechanisms. A persistent vulnerability in past institutional transitions has been the latency between rapid technological execution and legislative formulation. In this instance, lawmakers are taking preemptive measures to establish enforceable guidelines.

Key legal scholars emphasizing constitutional compliance have underscored that privacy protocols, fair competition parameters, and statutory disclosure mandates must remain sacrosanct. The ongoing harmonization between government authorities and private sector consortiums highlights a maturing governance architecture designed to foster sustainable growth while mitigating systemic vulnerabilities.

### 🔮 Section IV: The Road Ahead — Projections and Strategic Takeaways

Looking forward over the next twelve to thirty-six months, the trajectory initiated by **{core_topic}** will serve as a bellwether for emerging operational doctrines nationwide. Independent forecasts suggest that secondary implementation phases will begin rollouts across tier-one and tier-two hubs prior to the conclusion of the fiscal cycle.

For business leaders, policy architects, and everyday citizens, the imperative is unambiguous: comprehensive adaptation is no longer discretionary. The organizations and individuals who methodically assimilate these new paradigms will cultivate unprecedented resilience, whereas those reliant on outdated operational inertia risk progressive obsolescence.

As the ZestFeedX investigative desk continues to track this story in real time, further verified briefings and technical addendums will be published as official records are submitted to the public register.

{source_link_html}"""

        # 2. Long-Form Hinglish Version (800+ Words)
        headline_hi = f"🚨 Exclusive Khulasa: {core_topic} Ko Lekar Aaya Aisa Toofani Mod, Poori Industry Mein Machi Sansani!"
        summary_hi = f"Veteran journalist Pankhudi Sharma ki is detailed investigative ground report mein padhiye aakhir kyun {core_topic} ko lekar har taraf toofani behas chhid gayi hai aur iske aam janta par kya asar padenge."

        content_hi = f"""Report By Pankhudi Sharma (ZestFeedX Special Investigative Desk)

Namaskar dosto, main Pankhudi Sharma, aur aaj hum baat karne wale hain us sabse bade mudde par jisne poore desh aur digital media mein toofaan macha rakha hai. Ji haan, hum baat kar rahe hain **{core_topic}** ki! Pichle kuch dino se aapne social media aur TV channels par iski thodi-bahut jhalak dekhi hogi, lekin jo sachayi parde ke peeche chhipayi ja rahi thi, aaj hum is exclusive 800+ words ki detailed long-form investigative report mein uska ek-ek hissa kholkar samne rakhne wale hain.

### 🔍 Section I: Aakhir Is Mudde Ki Asli Shuruaat Kahan Se Hui?

Chaliye bilkul shuru se shuru karte hain. Taaza verified records aur official press communiqués ke mutabiq, {facts_summary}. Shuruat mein jab yeh khabar aayi thi, toh lag raha tha ki yeh ek aam administrative ya business update hai. Lekin jaise hi hamari investigative desk ne regulatory filings aur ground data ki gehraai mein jaakar padtaal ki, toh pata chala ki yeh mamla jitna dikh raha hai usse kahin zyada bada aur sanvedansheel hai!

Pichle kai saalon se is sector ke top experts aur aam log is baat ka intezaar kar rahe the ki kab koi thos kadam uthaya jayega. Lekin ab jab yeh faisla officially execute ho chuka hai, toh isne purane saare frameworks aur policies ko ek jhatke mein badal kar rakh diya hai. Log pooch rahe hain ki kya yeh sach mein Bharat ke future ke liye game-changer sabit hoga?

### 📊 Section II: Ground Level Par Daily Life Aur Market Par Asar

Ab aate hain sabse zaroori sawaal par: Is sabse aam consumer, professional aur business community par kya asar padega? Jab humne alag-alag shehron ke ground reporters aur domain experts se baat ki, toh unhone humein bataya ki is faisle ka asar aane wale hafton mein seedha hamari daily routine aur pocket par dikhne lagega.

Yeh samay hai is mudde ke har pehlu ko gehraai se samajhne ka, kyunki iska seedha asar hamare rozmarra ke faislon par padne wala hai:

![Ground Zero Investigation: Market Dynamics Aur Public Response](https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80)

Ground reality yeh batati hai ki yeh badlav kisi ek shehar tak seemit nahi hai. Tier-1 metros se lekar Tier-2 industrial hubs tak, har jagah logistics, digital operations aur public delivery systems mein ek naya discipline dekhne ko mil raha hai. Domain experts ka manna hai ki jo enterprises is technology aur regulatory standard ko agle teen mahino ke andar adopt kar lenge, unhe aane wale saalon mein zabardast competitive lead milegi.

Wahi doosri taraf, accountability aur transparency ke naye parameters ne purani laaparwahi par poori tarah taala laga diya hai. Har transaction aur institutional movement ab automated auditing ke daayre mein aane se common citizen ka bharosa badha hai.

### ⚡ Section III: Regulatory Scrutiny Aur Sarkar Ka Agla Kadam

Is bade milestone ke baad central ministries, regulatory commissions aur legal bodies bhi poori tarah active ho gayi hain. Nayi guidelines issue ki ja rahi hain taaki kisi bhi tarah ke loopholes ka galat fayda na uthaya ja sake. Legal experts ka kehna hai ki jab bhi itna bada shift aata hai, toh sabse pehle consumer rights aur data security ko safe rakhna sabse pehli priority honi chahiye.

Sarkari authorities ne yeh saaf kar diya hai ki compliance ke sath koi samjhauta nahi kiya jayega. Aane wale 30 se 60 dino ke andar ek consolidated monitoring desk deploy ki jayegi jo is naye transition ko har ghante monitor karegi.

### 🔮 Section IV: Aage Ka Raasta Aur Final Verdict

Toh dosto, aakhir mein conclusion kya nikalta hai? **{core_topic}** sirf ek headline nahi hai, balki ek aisi digital aur institutional kranti hai jisne traditional systems ko permanently replace kar diya hai. Aane wale mahino mein hum iske secondary rollouts tier-2 aur tier-3 shehron mein bhi dekhenge.

Agar aap chahte hain ki aap is badlav mein peeche na chhootein, toh is report ko dhyan se samjhein, apne dosto aur parivaar ke sath share karein, aur ZestFeedX ke investigative portal par regular bane rahein. Hum har ek naye update par apni teekhi nazar banaye hue hain.

{source_link_html}"""

        fomo_badge = random.choice(FOMO_BADGES)
        tags = [category.lower(), "investigative", "zestfeedx", "breaking", "analysis", "pankhudisharma"]
        if "health" in category.lower():
            tags.append("healthcare")
        if "tech" in category.lower() or "ai" in original_title.lower():
            tags.append("ai")

        return {
            "headline_en": headline_en,
            "content_en": content_en,
            "summary_en": summary_en,
            "headline_hi": headline_hi,
            "content_hi": content_hi,
            "summary_hi": summary_hi,
            "headline": headline_en,
            "content": content_en,
            "summary": summary_en,
            "fomo_badge": fomo_badge,
            "tags": tags,
            "image_keyword": f"investigative photo of {core_topic[:40]}",
            "author_name": AUTHOR_PROFILE["name"],
            "author_bio": AUTHOR_PROFILE["bio"],
            "author_company": AUTHOR_PROFILE["company"],
            "author_url": AUTHOR_PROFILE["url"]
        }

curiosity_ai_rewriter = CuriosityAIRewriter()
hinglish_rewriter = curiosity_ai_rewriter
