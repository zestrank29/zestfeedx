import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://zestfeedx.com"),
  title: {
    default: "ZestFeedX | Breaking News, Investigative Reports & Global Trends",
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
        "@type": "Organization",
        "@id": "https://zestfeedx.com/#organization",
        "name": "ZestFeedX",
        "url": "https://zestfeedx.com",
        "email": "news@zestfeedx.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://zestfeedx.com/favicon.ico"
        },
        "sameAs": [
          "https://zestrank.com/"
        ],
        "founder": {
          "@type": "Person",
          "name": "Pankhudi Sharma",
          "jobTitle": "Veteran Journalist and Editor",
          "url": "https://zestfeedx.com/about"
        }
      },
      {
        "@type": "Person",
        "@id": "https://zestfeedx.com/#author-pankhudi-sharma",
        "name": "Pankhudi Sharma",
        "jobTitle": "Veteran Journalist and Editor",
        "description": "Veteran media professional with over 15 years of experience in investigative journalism and digital storytelling, delivering high-impact news and trending global insights.",
        "url": "https://zestfeedx.com/about",
        "worksFor": {
          "@type": "Organization",
          "name": "ZestFeedX",
          "url": "https://zestfeedx.com"
        }
      }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
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

        {/* Google Analytics / Google Tag Manager */}
        <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-WVCLHN6M" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());`,
          }}
        />

        {/* Google Fonts: Merriweather & Public Sans */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400&family=Public+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="canonical" href="https://zestfeedx.com/" />
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
