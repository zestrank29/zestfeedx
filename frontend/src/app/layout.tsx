import type { Metadata } from "next";
import { Fraunces, Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

import CookieConsentBanner from "@/components/CookieConsentBanner";

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
    default: "ZestFeedX | Broadsheet Journalism for India & the Diaspora",
    template: "%s | ZestFeedX",
  },
  description:
    "Fast, beautifully formatted, original-first news, financial intelligence, and in-depth cultural analysis for India and the global Indian diaspora.",
  keywords: [
    "ZestFeedX",
    "India News",
    "Sensex Nifty Analysis",
    "Indian Economy",
    "Tech India",
    "Investigative Reports",
    "Delhi AQI",
    "Indian Diaspora",
    "Pankhudi Sharma"
  ],
  authors: [{ name: "Pankhudi Sharma", url: "https://zestfeedx.com/author/pankhudi-sharma" }],
  creator: "Pankhudi Sharma",
  publisher: "ZestFeedX",
  alternates: {
    canonical: "https://zestfeedx.com/",
    languages: {
      "en-IN": "https://zestfeedx.com/",
      "hi-IN": "https://zestfeedx.com/hi/",
      "x-default": "https://zestfeedx.com/",
    },
  },
  openGraph: {
    title: "ZestFeedX | Broadsheet Journalism for India & the Diaspora",
    description:
      "Original-first news, market data, and investigative analysis for India and the global diaspora.",
    url: "https://zestfeedx.com",
    siteName: "ZestFeedX",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZestFeedX | Broadsheet Journalism for India & the Diaspora",
    description:
      "Original-first news, market data, and investigative analysis for India and the global diaspora.",
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
        name: "ZestFeedX",
        url: "https://zestfeedx.com/",
        email: "news@zestfeedx.com",
        foundingDate: "2024",
        publishingPrinciples: "https://zestfeedx.com/editorial-policy",
        correctionsPolicy: "https://zestfeedx.com/corrections",
        ethicsPolicy: "https://zestfeedx.com/editorial-policy#ethics",
        diversityPolicy: "https://zestfeedx.com/editorial-policy#diversity",
        founder: {
          "@type": "Person",
          name: "Pankhudi Sharma",
          jobTitle: "Senior Digital Editor",
          url: "https://zestfeedx.com/author/pankhudi-sharma",
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} ${notoHindi.variable}`}
    >
      <head>
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
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
