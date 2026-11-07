# 🚀 BuzzNews - 3D Viral Hinglish News Engine & Monetization Platform

An automated, 3D animated, monetizable news aggregation web application built with **FastAPI**, **Next.js (React 19)**, **Three.js**, **Framer Motion**, and **Tailwind CSS**.

---

## 🌟 Key Architecture & Features

### ⚙️ Phase 1: The "Buzz Engine" (Automated Backend & AI Processing)
- **Hourly Task Scheduler**: APScheduler background engine automatically executes the scraping and rewriting pipeline every 60 minutes.
- **Multi-Source Scrapers**:
  - **Google Trends (India)** real-time RSS scraper (`geo=IN`).
  - Top Indian & Global RSS feeds (TechCrunch, The Verge, Gadgets 360, NDTV, Times of India, CoinDesk).
- **Viral Hinglish AI Pipeline**:
  - Configured with the viral digital marketing copywriter system prompt:
    > *"Act as a viral digital marketing copywriter. Take these news facts and write a highly engaging, 300-word news article in Hinglish. Write headlines that invoke curiosity, FOMO (Fear Of Missing Out), or excitement (e.g., 'Google ne launch kiya naya AI, kya aapki job danger mein hai?'). Keep the tone energetic, punchy, and highly readable."*
  - Dual LLM support: **Google Gemini API** (`GEMINI_API_KEY`) and **OpenAI API** (`OPENAI_API_KEY`), plus an intelligent built-in viral Hinglish generator that guarantees zero downtime.
- **AI Thumbnail Generation**:
  - Automatically extracts the core visual keywords and generates cinematic 8K photorealistic thumbnails via Pollinations AI / DALL-E.
  - Automatically saves image assets locally to `/static/images/` and links them to the article database.

---

### 🎨 Phase 2: 3D Animated UI & Frontend Architecture
- **Interactive 3D Three.js Hero Globe**:
  - 1,200+ luminous cyan and magenta neon particles, glowing wireframe mesh, and dual orbital rings.
  - Interactive mouse parallax tilt: Globe rotates and responds in 3D space to mouse movements.
  - Breaking News featured card overlay with animated FOMO badge and countdown.
- **Dark-Mode Glassmorphism**:
  - Cyber-dark aesthetic (`#06080e`), translucent blurred glass (`backdrop-blur-xl`), neon cyan and pink glow accents.
- **Framer Motion News Cards**:
  - Staggered entrance, 3D scale-up on hover, subtle glow effects, and dynamic Hinglish headline reveal.
- **Infinite Scrolling Feed**:
  - Seamless `IntersectionObserver` infinite scroll that loads articles without hitting a dead end.
- **Audio Desi Reader (Text-to-Speech)**:
  - 1-click button to listen to the viral Hinglish article read aloud using Web Speech synthesis.
- **Viral Reaction Meter**:
  - Interactive emoji reactions (🔥, 🤯, 😂, 💔) with confetti celebration particles.
- **1-Click WhatsApp Share**:
  - Pre-formatted viral Hinglish hook ready to share with friends and groups.

---

### 💰 Phase 3: Monetization & Technical SEO Architecture
- **AdSense & Native Monetization Layout**:
  - In-feed responsive sponsored cards placed every 3rd article.
  - Sticky right sidebar vertical ad slot.
  - Top billboard leaderboard slot.
  - Valid `data-ad-client="ca-pub-buzznews-demo"` attributes with clear Ad disclosures for 100% AdSense policy compliance.
- **Server-Side Rendering (SSR) & Dynamic OpenGraph**:
  - Next.js dynamic routing at `/article/[slug]` with SSR and automated metadata generation.
- **Automated JSON-LD Schema Markup**:
  - Complete `NewsArticle` schema (headline, image, author, publisher, datePublished).
  - Complete `BreadcrumbList` schema for instant Google Rich Snippets.
- **Dynamic XML Sitemap & Robots.txt**:
  - Real-time `/sitemap.xml` and `/robots.txt` automatically updated as new articles are published.
- **Core Web Vitals Optimized**:
  - Priority hero image loading, lazy loading for below-the-fold media, and throttled 3D rendering.

---

## 🚀 Running the Platform

### Backend (FastAPI + Task Scheduler)
```bash
# Activate virtual environment
.venv\Scripts\Activate.ps1

# Start the server (Port 8000)
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend (Next.js + Three.js)
```bash
cd frontend
npm run dev
# or for production:
npm run build
npm run start -p 3000
```

### Quick Access Endpoints:
- 🌐 **Web App**: [http://localhost:3000](http://localhost:3000)
- 📡 **Backend API Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- 🗺️ **Dynamic XML Sitemap**: [http://localhost:3000/sitemap.xml](http://localhost:3000/sitemap.xml)
- 🤖 **Robots.txt**: [http://localhost:3000/robots.txt](http://localhost:3000/robots.txt)
- ⚡ **Manual Scrape API**: `POST http://127.0.0.1:8000/api/scrape/trigger`

