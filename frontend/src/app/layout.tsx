import type { Metadata } from "next";
import { Fraunces, Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

import CookieConsentBanner from "@/components/CookieConsentBanner";
import GlobalHeader from "@/components/GlobalHeader";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const notoHindi = Noto_Sans_Devanagari({
  weight: ["400", "500", "600", "700"],
  subsets: ["devanagari"],
  display: "swap",
  variable: "--font-noto-hindi",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zestfeedx.com"),
  title: {
    default: "Latest News, Breaking News & India Headlines | ZestFeedX",
    template: "%s | ZestFeedX",
  },
  description:
    "Read latest news, breaking news from India and world. Get live updates, market insights, politics, tech and top headlines today on ZestFeedX.",
  keywords: [
    "Latest News",
    "Breaking News",
    "India News",
    "Top Headlines Today",
    "Live News Updates",
    "ZestFeedX",
    "Business News",
    "Sensex Nifty Analysis",
    "Indian Economy",
    "Tech News India",
    "Current Affairs",
    "World News",
    "Delhi AQI",
    "Indian Diaspora",
    "Pankhudi Sharma"
  ],
  authors: [{ name: "Pankhudi Sharma", url: "https://zestfeedx.com/author/pankhudi-sharma/" }],
  creator: "Pankhudi Sharma",
  publisher: "ZestFeedX",
  alternates: {
    languages: {
      "en-IN": "https://zestfeedx.com/",
      "hi-IN": "https://zestfeedx.com/hi/",
      "x-default": "https://zestfeedx.com/",
    },
  },
  openGraph: {
    title: "Latest News, Breaking News, India News & Top Headlines | ZestFeedX",
    description:
    "Read latest news, breaking news from India and world. Get live updates, market insights, politics, tech and top headlines today on ZestFeedX.",
    url: "https://zestfeedx.com/",
    siteName: "ZestFeedX",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Latest News, Breaking News, India News & Top Headlines | ZestFeedX",
    description:
    "Read latest news, breaking news from India and world. Get live updates, market insights, politics, tech and top headlines today on ZestFeedX.",
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
  verification: {
    google: "zestfeedx-broadsheet-search-console-verification",
    other: {
      "msvalidate.01": "zestfeedx-bing-verification-token",
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
        name: "ZestFeedX",
        url: "https://zestfeedx.com/",
        logo: {
          "@type": "ImageObject",
          url: "https://zestfeedx.com/google-news/square-logo-512.png",
          width: 512,
          height: 512,
        },
        email: "news@zestfeedx.com",
        foundingDate: "2024",
        publishingPrinciples: "https://zestfeedx.com/editorial-policy/",
        correctionsPolicy: "https://zestfeedx.com/corrections/",
        ethicsPolicy: "https://zestfeedx.com/editorial-policy/#ethics",
        diversityPolicy: "https://zestfeedx.com/editorial-policy/#diversity",
        founder: {
          "@type": "Person",
          name: "Pankhudi Sharma",
          jobTitle: "Senior Digital Editor",
          url: "https://zestfeedx.com/author/pankhudi-sharma/",
        },
      },
    ],
  };

  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-1815409654667822";

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} ${notoHindi.variable}`}
    >
      <head>
        {adsenseClientId && (
          <>
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
              crossOrigin="anonymous"
            />
            <meta name="google-adsense-account" content={adsenseClientId} />
          </>
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('zest_theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(globalOrganizationSchema),
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-[#FF5A1F] selection:text-white">
        <GoogleAnalytics />
        <GlobalHeader />
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
