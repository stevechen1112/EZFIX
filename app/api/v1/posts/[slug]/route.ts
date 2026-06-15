import { NextRequest, NextResponse } from "next/server";
import {
  getApiSettings,
  updateBlogPostFromApi,
  verifyApiKey,
  type BlogApiPayload,
} from "@/lib/blog-api";

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const auth = await verifyApiKey(req);
  if (!auth.ok) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const body = (await req.json()) as BlogApiPayload;
    const { publishMode } = await getApiSettings();
    const result = await updateBlogPostFromApi(params.slug, body, publishMode);

    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: result.status });
    }

    return NextResponse.json({
      success: true,
      postId: result.post.id,
      url: result.url,
      updatedAt: result.post.updatedAt.toISOString(),
      isPublished: result.post.isPublished,
    });
  } catch (err) {
    console.error("[API v1 Update Post] Error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
