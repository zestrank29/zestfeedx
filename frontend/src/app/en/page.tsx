import { Metadata } from "next";
import { Suspense } from "react";
import { HomePageContent } from "../page";

export const metadata: Metadata = {
  title: "ZestFeedX | Broadsheet Journalism for India & the Diaspora",
  description:
    "Fast, beautifully formatted, original-first news, financial intelligence, and in-depth cultural analysis for India and the global Indian diaspora.",
  alternates: {
    canonical: "https://zestfeedx.com/",
    languages: {
      "en-IN": "https://zestfeedx.com/en/",
      "hi-IN": "https://zestfeedx.com/hi/",
    },
  },
};

export default function EnglishHomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F4] dark:bg-[#080C16]" />}>
      <HomePageContent initialLanguage="en" />
    </Suspense>
  );
}
