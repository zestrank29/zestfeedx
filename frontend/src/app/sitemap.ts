import { MetadataRoute } from "next";
import { ORIGINAL_ARTICLES } from "@/data/demoContent";
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
      url: `${baseUrl}/hi/`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/en/`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/topic/delhi-aqi/`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/data/gold-silver-price-india/`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/data/petrol-diesel-price-india/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/explainers/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/advertise/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about/`,
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
      priority: 0.75,
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
    {
      url: `${baseUrl}/copyright-disclaimer/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const activeCategories = [
    "markets",
    "tech",
    "india",
    "world",
    "health",
    "sports",
    "entertainment",
  ];

  const categoryRoutes: MetadataRoute.Sitemap = activeCategories.map((cat) => ({
    url: `${baseUrl}/category/${cat}/`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // Index all broadsheet articles (original investigations and verified dispatches)
  const originalRoutes: MetadataRoute.Sitemap = ORIGINAL_ARTICLES.map((art) => ({
    url: `${baseUrl}/article/${art.slug}/`,
    lastModified: new Date(art.published_at),
    changeFrequency: "hourly",
    priority: art.is_lead_story ? 1.0 : 0.9,
  }));

  const seedRoutes: MetadataRoute.Sitemap = SEED_ARTICLES.map((art) => ({
    url: `${baseUrl}/article/${art.slug}/`,
    lastModified: new Date(art.published_at || Date.now()),
    changeFrequency: "daily",
    priority: 0.85,
  }));

  return [...staticRoutes, ...categoryRoutes, ...originalRoutes, ...seedRoutes];
}
