"use client";

import React from "react";
import Script from "next/script";

interface Props {
  measurementId?: string;
}

export default function GoogleAnalytics({ measurementId }: Props) {
  const gaId = measurementId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-ZESTFEEDX01";

  if (!gaId) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // Default privacy consent state
            gtag('consent', 'default', {
              'analytics_storage': 'granted',
              'ad_storage': 'granted',
              'ad_user_data': 'granted',
              'ad_personalization': 'granted'
            });

            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
              send_page_view: true,
              site_speed_sample_rate: 100
            });
          `,
        }}
      />
    </>
  );
}

// Global analytics tracking helpers
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}
