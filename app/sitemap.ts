import type { MetadataRoute } from "next";
import { getAllPostsMeta } from "@/lib/blog";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPostsMeta();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
      lastModified: new Date(),
    },
    {
      url: absoluteUrl("/blog"),
      changeFrequency: "weekly",
      priority: 0.9,
      lastModified: new Date(),
    },
    {
      url: absoluteUrl("/projects"),
      changeFrequency: "weekly",
      priority: 0.85,
      lastModified: new Date(),
    },
    {
      url: absoluteUrl("/writing"),
      changeFrequency: "weekly",
      priority: 0.85,
      lastModified: new Date(),
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: new Date(post.updatedAt ?? post.date),
  }));

  return [...staticRoutes, ...postRoutes];
}
