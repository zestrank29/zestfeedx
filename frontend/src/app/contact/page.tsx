import { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: {
    absolute: "Contact Newsroom & Bureau | ZestFeedX",
  },
  description:
    "Connect with ZestFeedX reporters, submit confidential news tips, or pitch investigative story leads to our New Delhi editorial desk.",
  alternates: {
    canonical: "https://zestfeedx.com/contact/",
  },
  openGraph: {
    title: {
    absolute: "Contact Newsroom & Bureau | ZestFeedX",
  },
    description:
      "Connect with ZestFeedX reporters, submit confidential news tips, request factual corrections, or contact the editorial bureau in New Delhi.",
    url: "https://zestfeedx.com/contact/",
    siteName: "ZestFeedX",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "ZestFeedX Editorial Bureau",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
    absolute: "Contact Newsroom & Bureau | ZestFeedX",
  },
    description:
      "Connect with ZestFeedX reporters, submit confidential news tips, request factual corrections, or contact the editorial bureau in New Delhi.",
    images: ["https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80"],
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
