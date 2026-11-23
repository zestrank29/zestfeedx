import { Metadata } from "next";
import AdvertiseContent from "./AdvertiseContent";

export const metadata: Metadata = {
  title: {
    absolute: "Advertise & Partner with Us | ZestFeedX",
  },
  description:
    "Explore advertising, sponsored articles, and newsletter partnerships on ZestFeedX. Reach policy makers, founders, and macro executives.",
  alternates: {
    canonical: "https://zestfeedx.com/advertise/",
  },
  openGraph: {
    title: {
    absolute: "Advertise & Partner with Us | ZestFeedX",
  },
    description:
      "Explore advertising, sponsored articles, and newsletter partnerships on ZestFeedX reaching founders, investors, and policymakers across India and the diaspora.",
    url: "https://zestfeedx.com/advertise/",
    siteName: "ZestFeedX",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Advertise on ZestFeedX",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
    absolute: "Advertise & Partner with Us | ZestFeedX",
  },
    description:
      "Explore advertising, sponsored articles, and newsletter partnerships on ZestFeedX reaching founders, investors, and policymakers across India and the diaspora.",
    images: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"],
  },
};

export default function AdvertisePage() {
  return <AdvertiseContent />;
}
