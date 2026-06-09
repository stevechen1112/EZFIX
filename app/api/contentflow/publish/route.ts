import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const CONTENTFLOW_SECRET = process.env.CONTENTFLOW_SECRET || "your-secret-key-here";

export async function POST(req: NextRequest) {
  // 1. 驗證 Secret Key
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ success: false, error: "Missing Authorization header" }, { status: 401 });
  }
  const token = authHeader.slice(7);
  if (token !== CONTENTFLOW_SECRET) {
    return NextResponse.json({ success: false, error: "Invalid secret key" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // 2. 驗證必填欄位
    const { title, slug, content } = body;
    if (!title || !slug || !content) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, slug, content" },
        { status: 400 }
      );
    }

    // 3. 檢查 slug 是否已存在
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Slug already exists" },
        { status: 409 }
      );
    }

    // 4. 建立文章
    const post = await prisma.blogPost.create({
      data: {
        title: String(title),
        slug: String(slug),
        excerpt: String(body.excerpt || ""),
        content: String(content),
        coverImage: String(body.hero_image_url || body.coverImage || ""),
        authorName: String(body.author_name || "恆惠修理紗窗"),
        category: String(body.category || ""),
        tags: Array.isArray(body.tags) ? body.tags.join(",") : String(body.tags || ""),
        isPublished: body.status === "published",
        publishedAt: body.status === "published" ? new Date() : null,
        metaTitle: body.meta_title ? String(body.meta_title) : null,
        metaDescription: body.meta_description ? String(body.meta_description) : null,
        jsonLd: body.json_ld ? String(body.json_ld) : null,
      },
    });

    // 5. 重新驗證頁面
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    return NextResponse.json({
      success: true,
      postId: post.id,
      url: `/blog/${slug}`,
      publishedAt: post.publishedAt?.toISOString() || null,
    });
  } catch (err) {
    console.error("[ContentFlow Publish] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
