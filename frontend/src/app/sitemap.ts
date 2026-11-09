import { MetadataRoute } from "next";
import { SEED_ARTICLES } from "@/data/seedArticles";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://zestfeedx.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/editorial-policy/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/fact-check/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/copyright-disclaimer/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const activeCategories = [
    "politics",
    "tech",
    "health",
    "world",
    "sports",
    "entertainment",
    "ramayana"
  ];

  const categoryRoutes: MetadataRoute.Sitemap = activeCategories.map((cat) => ({
    url: `${baseUrl}/category/${cat}/`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.85,
  }));

  const articleRoutes: MetadataRoute.Sitemap = SEED_ARTICLES.map((art) => ({
    url: `${baseUrl}/article/${art.slug}/`,
    lastModified: new Date(art.published_at),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
