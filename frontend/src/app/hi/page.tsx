import { Metadata } from "next";
import { Suspense } from "react";
import { HomePageContent } from "../page";

export const metadata: Metadata = {
  title: {
    absolute: "ताजा समाचार, ब्रेकिंग न्यूज़, मुख्य समाचार | ZestFeedX हिंदी",
  },
  description:
    "जेस्टफीडएक्स (ZestFeedX) पर पढ़ें भारत और दुनिया के ताज़ा समाचार, ब्रेकिंग न्यूज़, बिज़नेस, शेयर बाज़ार, राजनीति व समसामयिक विषयों के लाइव अपडेट व गहन विश्लेषण।",
  alternates: {
    canonical: "https://zestfeedx.com/hi/",
    languages: {
      "en-IN": "https://zestfeedx.com/",
      "hi-IN": "https://zestfeedx.com/hi/",
    },
  },
  openGraph: {
    title: "ताजा समाचार, ब्रेकिंग न्यूज़, मुख्य समाचार | ZestFeedX हिंदी",
    description: "जेस्टफीडएक्स (ZestFeedX) पर पढ़ें भारत और दुनिया के ताज़ा समाचार, ब्रेकिंग न्यूज़, बिज़नेस व राजनीति के लाइव अपडेट।",
    locale: "hi_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "ताजा समाचार, ब्रेकिंग न्यूज़, मुख्य समाचार | ZestFeedX हिंदी",
    description: "जेस्टफीडएक्स (ZestFeedX) पर पढ़ें भारत और दुनिया के ताज़ा समाचार, ब्रेकिंग न्यूज़, बिज़नेस व राजनीति के लाइव अपडेट।",
  },
};

export default function HindiHomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F4] dark:bg-[#080C16]" />}>
      <HomePageContent initialLanguage="hi" />
    </Suspense>
  );
}
