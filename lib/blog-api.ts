import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ApiPublishMode = "draft" | "published";

export type BlogApiPayload = {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  hero_image_url?: string;
  authorName?: string;
  author_name?: string;
  category?: string;
  tags?: string | string[];
  status?: string;
  metaTitle?: string;
  meta_title?: string;
  metaDescription?: string;
  meta_description?: string;
  jsonLd?: string;
  json_ld?: string;
};

export function getDefaultApiBaseUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${siteUrl.replace(/\/$/, "")}/api/v1`;
}

export async function getApiSettings() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const baseUrl = settings?.apiBaseUrl?.trim() || getDefaultApiBaseUrl();
  const apiKey = settings?.apiKey?.trim() || process.env.CONTENTFLOW_SECRET?.trim() || "";
  const publishMode: ApiPublishMode =
    settings?.apiPublishMode === "published" ? "published" : "draft";

  return { baseUrl, apiKey, publishMode };
}

export async function verifyApiKey(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { ok: false as const, error: "Missing Authorization header" };
  }

  const token = authHeader.slice(7);
  const { apiKey } = await getApiSettings();

  if (!apiKey) {
    return { ok: false as const, error: "API key is not configured" };
  }
  if (token !== apiKey) {
    return { ok: false as const, error: "Invalid API key" };
  }

  return { ok: true as const };
}

export function resolvePublishStatus(
  body: BlogApiPayload,
  defaultMode: ApiPublishMode
): { isPublished: boolean; publishedAt: Date | null } {
  const status = body.status?.trim().toLowerCase();
  const isPublished = status ? status === "published" : defaultMode === "published";
  return {
    isPublished,
    publishedAt: isPublished ? new Date() : null,
  };
}

function normalizeTags(tags: BlogApiPayload["tags"]) {
  if (Array.isArray(tags)) return tags.join(",");
  return String(tags || "");
}

export async function createBlogPostFromApi(body: BlogApiPayload, defaultMode: ApiPublishMode) {
  const title = body.title?.trim();
  const slug = body.slug?.trim();
  const content = body.content?.trim();

  if (!title || !slug || !content) {
    return { ok: false as const, status: 400, error: "Missing required fields: title, slug, content" };
  }

  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) {
    return { ok: false as const, status: 409, error: "Slug already exists" };
  }

  const { isPublished, publishedAt } = resolvePublishStatus(body, defaultMode);

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt: String(body.excerpt || ""),
      content,
      coverImage: String(body.hero_image_url || body.coverImage || ""),
      authorName: String(body.author_name || body.authorName || "恆惠修理紗窗"),
      category: String(body.category || ""),
      tags: normalizeTags(body.tags),
      isPublished,
      publishedAt,
      metaTitle: body.meta_title || body.metaTitle ? String(body.meta_title || body.metaTitle) : null,
      metaDescription:
        body.meta_description || body.metaDescription
          ? String(body.meta_description || body.metaDescription)
          : null,
      jsonLd: body.json_ld || body.jsonLd ? String(body.json_ld || body.jsonLd) : null,
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/");

  return {
    ok: true as const,
    post,
    url: `/blog/${slug}`,
  };
}

export async function updateBlogPostFromApi(slug: string, body: BlogApiPayload, defaultMode: ApiPublishMode) {
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (!existing) {
    return { ok: false as const, status: 404, error: "Post not found" };
  }

  const updateData: Record<string, unknown> = {};
  if (body.title !== undefined) updateData.title = String(body.title);
  if (body.content !== undefined) updateData.content = String(body.content);
  if (body.excerpt !== undefined) updateData.excerpt = String(body.excerpt);
  if (body.hero_image_url !== undefined || body.coverImage !== undefined) {
    updateData.coverImage = String(body.hero_image_url ?? body.coverImage ?? "");
  }
  if (body.author_name !== undefined || body.authorName !== undefined) {
    updateData.authorName = String(body.author_name ?? body.authorName ?? "");
  }
  if (body.category !== undefined) updateData.category = String(body.category);
  if (body.tags !== undefined) updateData.tags = normalizeTags(body.tags);
  if (body.meta_title !== undefined || body.metaTitle !== undefined) {
    const value = body.meta_title ?? body.metaTitle;
    updateData.metaTitle = value ? String(value) : null;
  }
  if (body.meta_description !== undefined || body.metaDescription !== undefined) {
    const value = body.meta_description ?? body.metaDescription;
    updateData.metaDescription = value ? String(value) : null;
  }
  if (body.json_ld !== undefined || body.jsonLd !== undefined) {
    const value = body.json_ld ?? body.jsonLd;
    updateData.jsonLd = value ? String(value) : null;
  }

  if (body.status !== undefined) {
    const { isPublished, publishedAt } = resolvePublishStatus(body, defaultMode);
    updateData.isPublished = isPublished;
    if (!existing.isPublished && isPublished) {
      updateData.publishedAt = publishedAt;
    }
  }

  const post = await prisma.blogPost.update({
    where: { slug },
    data: updateData,
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/");

  return {
    ok: true as const,
    post,
    url: `/blog/${slug}`,
  };
}

export function maskApiKey(key: string) {
  if (!key) return "";
  if (key.length <= 8) return "••••••••";
  return `••••${key.slice(-4)}`;
}
