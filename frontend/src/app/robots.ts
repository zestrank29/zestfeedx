import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
        ],
      },
      {
        userAgent: "GPTBot",
        disallow: ["/api/"],
      },
    ],
    sitemap: [
      "https://zestfeedx.com/sitemap.xml",
      "https://zestfeedx.com/news-sitemap.xml",
    ],
    host: "https://zestfeedx.com",
  };
}
