import { NextRequest, NextResponse } from "next/server";
import {
  createBlogPostFromApi,
  getApiSettings,
  verifyApiKey,
  type BlogApiPayload,
} from "@/lib/blog-api";

export async function POST(req: NextRequest) {
  const auth = await verifyApiKey(req);
  if (!auth.ok) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const body = (await req.json()) as BlogApiPayload;
    const { publishMode } = await getApiSettings();
    const result = await createBlogPostFromApi(body, publishMode);

    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: result.status });
    }

    return NextResponse.json({
      success: true,
      postId: result.post.id,
      url: result.url,
      publishedAt: result.post.publishedAt?.toISOString() || null,
      isPublished: result.post.isPublished,
    });
  } catch (err) {
    console.error("[API v1 Create Post] Error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
