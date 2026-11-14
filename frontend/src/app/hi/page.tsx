import { Metadata } from "next";
import { Suspense } from "react";
import { HomePageContent } from "../page";

export const metadata: Metadata = {
  title: "जेस्टफीडएक्स (ZestFeedX) | भारत और वैश्विक प्रवासियों का प्रमुख समाचार मंच",
  description:
    "भारत और विश्व भर के प्रवासियों के लिए सबसे तेज़, निष्पक्ष एवं गहन आर्थिक, तकनीकी और नीतिगत विश्लेषण।",
  alternates: {
    canonical: "https://zestfeedx.com/hi/",
    languages: {
      "en-IN": "https://zestfeedx.com/",
      "hi-IN": "https://zestfeedx.com/hi/",
    },
  },
  openGraph: {
    title: "जेस्टफीडएक्स (ZestFeedX) | भारत और वैश्विक प्रवासियों का प्रमुख समाचार मंच",
    description: "भारत और विश्व भर के प्रवासियों के लिए मूल एवं प्रामाणिक समाचार व नीतिगत विश्लेषण।",
    locale: "hi_IN",
  },
};

export default function HindiHomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F4] dark:bg-[#080C16]" />}>
      <HomePageContent initialLanguage="hi" />
    </Suspense>
  );
}
