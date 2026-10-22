import type { MetadataRoute } from "next";
import { getBlogPosts, getPublishedProducts } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://blackstuff.ee";
  const [products, posts] = await Promise.all([
    getPublishedProducts(),
    getBlogPosts(),
  ]);

  const staticRoutes = [
    "",
    "/e-pood",
    "/mis-on-black-stuff",
    "/teadus",
    "/blogi",
    "/meist",
    "/edasimuujad",
    "/kontakt",
    "/tarne",
    "/tingimused",
    "/privaatsus",
    "/kupsised",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  return [
    ...staticRoutes,
    ...products.map((p) => ({
      url: `${base}/e-pood/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: `${base}/blogi/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
