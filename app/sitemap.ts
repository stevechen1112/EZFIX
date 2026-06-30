import { prisma } from "@/lib/prisma";
import { buildPublicUrl, resolveSiteBaseUrl } from "@/lib/site-url";
import { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = resolveSiteBaseUrl();

  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true, coverImage: true },
    orderBy: { publishedAt: "desc" },
  });

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: buildPublicUrl(baseUrl, "/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: buildPublicUrl(baseUrl, "/blog"),
      lastModified: posts[0]?.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: buildPublicUrl(baseUrl, `/blog/${post.slug}`),
    lastModified: post.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
    images: post.coverImage ? [post.coverImage] : undefined,
  }));

  return [...staticPages, ...postPages];
}
