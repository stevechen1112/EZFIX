"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\s\u3000]+/g, "-")
    .replace(/[^\u4e00-\u9fa5a-z0-9\-_]/gi, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

async function uniqueSlug(base: string, ignoreId?: number): Promise<string> {
  let slug = base || "post";
  let n = 1;
  // 確保唯一
  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    n++;
    slug = `${base}-${n}`;
  }
}

export async function createBlogPost(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const coverImage = String(formData.get("coverImage") || "").trim();
  const authorName = String(formData.get("authorName") || "恆惠修理紗窗").trim();
  const category = String(formData.get("category") || "").trim();
  const tags = String(formData.get("tags") || "").trim();
  const isPublished = formData.get("isPublished") === "on";

  if (!title) redirect("/admin/blog/new?error=" + encodeURIComponent("請輸入標題"));
  if (!content) redirect("/admin/blog/new?error=" + encodeURIComponent("請輸入內容"));

  const slug = await uniqueSlug(slugInput ? slugify(slugInput) : slugify(title));

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      authorName,
      category,
      tags,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/"); // 首頁若之後加最新文章
  redirect("/admin/blog?success=" + encodeURIComponent(`已新增文章「${post.title}」`));
}

export async function updateBlogPost(id: number, formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const coverImage = String(formData.get("coverImage") || "").trim();
  const authorName = String(formData.get("authorName") || "恆惠修理紗窗").trim();
  const category = String(formData.get("category") || "").trim();
  const tags = String(formData.get("tags") || "").trim();
  const isPublished = formData.get("isPublished") === "on";

  if (!title) redirect(`/admin/blog/${id}?error=` + encodeURIComponent("請輸入標題"));
  if (!content) redirect(`/admin/blog/${id}?error=` + encodeURIComponent("請輸入內容"));

  const current = await prisma.blogPost.findUnique({ where: { id } });
  if (!current) redirect("/admin/blog?error=" + encodeURIComponent("文章不存在"));

  const slug = await uniqueSlug(slugInput ? slugify(slugInput) : slugify(title), id);

  // 若改為發佈且原本未發佈，記下發佈時間
  let publishedAt = current.publishedAt;
  if (isPublished && !current.isPublished) {
    publishedAt = new Date();
  }

  await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      authorName,
      category,
      tags,
      isPublished,
      publishedAt,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath(`/blog/${current.slug}`);
  revalidatePath("/");
  redirect("/admin/blog?success=" + encodeURIComponent(`已更新「${title}」`));
}

export async function deleteBlogPost(id: number) {
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) redirect("/admin/blog?error=" + encodeURIComponent("文章不存在"));
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/");
  redirect("/admin/blog?success=" + encodeURIComponent(`已刪除「${post.title}」`));
}

export async function togglePublish(id: number, isPublished: boolean) {
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) redirect("/admin/blog?error=" + encodeURIComponent("文章不存在"));
  await prisma.blogPost.update({
    where: { id },
    data: {
      isPublished,
      publishedAt: isPublished ? (post.publishedAt ?? new Date()) : post.publishedAt,
    },
  });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/");
}
