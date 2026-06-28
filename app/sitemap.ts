import { prisma } from "@/lib/prisma";
import { buildPublicUrl, resolveSiteBaseUrl } from "@/lib/site-url";
import { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = resolveSiteBaseUrl();

  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });

  return [
    { url: buildPublicUrl(baseUrl, "/"), lastModified: new Date() },
    { url: buildPublicUrl(baseUrl, "/blog"), lastModified: new Date() },
    ...posts.map((post) => ({
      url: buildPublicUrl(baseUrl, `/blog/${post.slug}`),
      lastModified: post.updatedAt,
    })),
  ];
}
