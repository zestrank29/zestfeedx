import type { Metadata } from "next";
import { Merriweather, Public_Sans } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

const publicSans = Public_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zestfeedx.com"),
  title: {
    default: "ZestFeedX | Breaking News & Investigative Reports",
    template: "%s | ZestFeedX",
  },
  description:
    "Real-time, fact-checked breaking news, global affairs, technology breakthroughs, and cultural trends in comprehensive long-form formats by Pankhudi Sharma.",
  keywords: [
    "ZestFeedX",
    "Breaking News",
    "Investigative Journalism",
    "Health News",
    "India Politics",
    "AI News",
    "Tech Trends",
    "Pankhudi Sharma"
  ],
  authors: [{ name: "Pankhudi Sharma", url: "https://zestfeedx.com/about" }],
  creator: "Pankhudi Sharma",
  publisher: "ZestFeedX",
  alternates: {
    canonical: "https://zestfeedx.com/",
  },
  openGraph: {
    title: "ZestFeedX | Breaking News, Investigative Reports & Global Trends",
    description:
      "Real-time, fact-checked breaking news, global affairs, technology breakthroughs, and cultural trends in comprehensive long-form formats.",
    url: "https://zestfeedx.com",
    siteName: "ZestFeedX",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZestFeedX | Breaking News & Investigative Reports",
    description:
      "Real-time, fact-checked breaking news, global affairs, technology breakthroughs, and cultural trends in comprehensive long-form formats.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalOrganizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsMediaOrganization",
        "@id": "https://zestfeedx.com/#organization",
        "name": "ZestFeedX",
        "url": "https://zestfeedx.com/",
        "email": "news@zestfeedx.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://zestfeedx.com/google-news/wide-logo-light.png",
          "width": 600,
          "height": 60
        },
        "sameAs": [
          "https://zestrank.com/"
        ],
        "founder": {
          "@type": "Person",
          "name": "Pankhudi Sharma",
          "jobTitle": "Senior Digital Editor",
          "url": "https://zestfeedx.com/about/"
        }
      },
      {
        "@type": "Person",
        "@id": "https://zestfeedx.com/#author-pankhudi-sharma",
        "name": "Pankhudi Sharma",
        "jobTitle": "Senior Digital Editor",
        "description": "Senior Digital Editor covering national policy, frontier tech, and lifestyle trends with over 15 years of investigative journalism experience.",
        "url": "https://zestfeedx.com/about/",
        "worksFor": {
          "@type": "Organization",
          "name": "ZestFeedX",
          "url": "https://zestfeedx.com/"
        }
      }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${merriweather.variable} ${publicSans.variable}`}>
      <head>
        {/* Instant Theme Detection Script (prevents flicker) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var theme = localStorage.getItem('zf_theme') || 'light';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch(e) {}
            })();`,
          }}
        />

        {/* Deferred Third-Party Analytics & Tracking Loader (0ms TBT on Mobile & Desktop) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              function initAnalytics() {
                // 1. Google Tag Manager
                var gtm = document.createElement('script');
                gtm.async = true;
                gtm.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-WVCLHN6M';
                document.head.appendChild(gtm);

                // 2. Ahrefs Web Analytics
                var ahrefs = document.createElement('script');
                ahrefs.async = true;
                ahrefs.src = 'https://analytics.ahrefs.com/analytics.js';
                ahrefs.setAttribute('data-key', 'xB6JTtj0a/A+BHY659408A');
                document.head.appendChild(ahrefs);

                // 3. Google Subscribe with Google (SwG Basic)
                var swg = document.createElement('script');
                swg.async = true;
                swg.src = 'https://news.google.com/swg/js/v1/swg-basic.js';
                document.head.appendChild(swg);
              }

              if (typeof window !== 'undefined') {
                if ('requestIdleCallback' in window) {
                  requestIdleCallback(initAnalytics, { timeout: 2000 });
                } else {
                  window.addEventListener('load', function() {
                    setTimeout(initAnalytics, 1000);
                  });
                }
              }
            })();`,
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalOrganizationSchema) }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 antialiased selection:bg-[#d32f2f] selection:text-white font-sans p-0 m-0 transition-colors duration-200">
        <div className="flex flex-col min-h-screen justify-between p-0 m-0">
          <main className="flex-1 w-full p-0 m-0">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
