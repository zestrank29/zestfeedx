import { Metadata } from "next";
import { Suspense } from "react";
import { HomePageContent } from "../page";

export const metadata: Metadata = {
  title: {
    absolute: "Latest News, Breaking News, India News & Top Headlines | ZestFeedX",
  },
  description:
    "Read latest news, breaking news from India and world. Get live news updates, market insights, politics, tech, explainers & top headlines today on ZestFeedX.",
  alternates: {
    canonical: "https://zestfeedx.com/",
    languages: {
      "en-IN": "https://zestfeedx.com/",
      "hi-IN": "https://zestfeedx.com/hi/",
      "x-default": "https://zestfeedx.com/",
    },
  },
  openGraph: {
    title: "Latest News, Breaking News, India News & Top Headlines | ZestFeedX",
    description:
      "Read latest news, breaking news from India and world. Get live news updates, market insights, politics, tech, explainers & top headlines today on ZestFeedX.",
    url: "https://zestfeedx.com/en/",
    siteName: "ZestFeedX",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Latest News, Breaking News, India News & Top Headlines | ZestFeedX",
    description:
      "Read latest news, breaking news from India and world. Get live news updates, market insights, politics, tech, explainers & top headlines today on ZestFeedX.",
  },
};

export default function EnglishHomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F4] dark:bg-[#080C16]" />}>
      <HomePageContent initialLanguage="en" />
    </Suspense>
  );
}
