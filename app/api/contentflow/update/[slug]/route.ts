import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const CONTENTFLOW_SECRET = process.env.CONTENTFLOW_SECRET || "your-secret-key-here";

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
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
    const { slug } = params;
    const body = await req.json();

    // 2. 確認文章存在
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // 3. 組裝更新資料（只更新有傳的欄位）
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = String(body.title);
    if (body.content !== undefined) updateData.content = String(body.content);
    if (body.excerpt !== undefined) updateData.excerpt = String(body.excerpt);
    if (body.hero_image_url !== undefined) updateData.coverImage = String(body.hero_image_url);
    if (body.author_name !== undefined) updateData.authorName = String(body.author_name);
    if (body.category !== undefined) updateData.category = String(body.category);
    if (body.tags !== undefined) {
      updateData.tags = Array.isArray(body.tags) ? body.tags.join(",") : String(body.tags);
    }
    if (body.meta_title !== undefined) updateData.metaTitle = body.meta_title ? String(body.meta_title) : null;
    if (body.meta_description !== undefined) updateData.metaDescription = body.meta_description ? String(body.meta_description) : null;
    if (body.json_ld !== undefined) updateData.jsonLd = body.json_ld ? String(body.json_ld) : null;

    // 狀態變更處理
    if (body.status !== undefined) {
      const wasPublished = existing.isPublished;
      const willPublish = body.status === "published";
      updateData.isPublished = willPublish;
      if (!wasPublished && willPublish) {
        updateData.publishedAt = new Date();
      }
    }

    // 4. 執行更新
    const post = await prisma.blogPost.update({
      where: { slug },
      data: updateData,
    });

    // 5. 重新驗證頁面
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    return NextResponse.json({
      success: true,
      postId: post.id,
      url: `/blog/${slug}`,
      updatedAt: post.updatedAt.toISOString(),
    });
  } catch (err) {
    console.error("[ContentFlow Update] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
