import { BlogContent } from "@/components/frontend/BlogContent";
import { prisma } from "@/lib/prisma";
import { resolveSiteBaseUrl } from "@/lib/site-url";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

function buildArticleSchema(post: {
  title: string;
  excerpt: string;
  authorName: string;
  publishedAt: Date | null;
  coverImage: string;
  slug: string;
}) {
  const baseUrl = resolveSiteBaseUrl();
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.title,
    author: {
      "@type": "Organization",
      name: post.authorName || "恆惠修理紗窗",
    },
    publisher: {
      "@type": "Organization",
      name: "恆惠修理紗窗",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/icon.png`,
      },
    },
    datePublished: post.publishedAt?.toISOString() || new Date().toISOString(),
    dateModified: post.publishedAt?.toISOString() || new Date().toISOString(),
    image: post.coverImage ? post.coverImage : `${baseUrl}/icon.png`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${encodeURIComponent(post.slug)}`,
    },
  });
}

function shouldShowExcerpt(excerpt: string, content: string): boolean {
  const normalize = (value: string) => value.replace(/\s+/g, "").slice(0, 100);
  if (!excerpt.trim()) return false;
  return normalize(excerpt) !== normalize(content);
}

function resolveSlug(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const slug = resolveSlug(params.slug);
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: "找不到文章" };
  return {
    title: post.metaTitle || `${post.title} | 恆惠修理紗窗`,
    description: post.metaDescription || post.excerpt || post.title,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const slug = resolveSlug(params.slug);
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  // 草稿不對外公開
  if (!post || !post.isPublished) notFound();

  // 找其他相關文章（同分類，最多 3 篇，排除自己）
  const related = await prisma.blogPost.findMany({
    where: {
      isPublished: true,
      id: { not: post.id },
      ...(post.category ? { category: post.category } : {}),
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" })
    : "";

  // 內文格式：plain（舊文）或 markdown（ContentFlow 發布）
  const contentFormat = (post.contentFormat === "markdown" ? "markdown" : "plain") as "plain" | "markdown";

  return (
    <main id="content" className="min-h-screen bg-white">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: post.jsonLd || buildArticleSchema(post) }}
      />
      {/* Hero 封面 */}
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white">
        {post.coverImage && (
          <div className="relative h-64 md:h-96 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 to-transparent" />
          </div>
        )}
        <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
          {post.category && (
            <span className="inline-block text-xs bg-white/20 text-white px-3 py-1 rounded-full mb-4">
              {post.category}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl font-black leading-tight">{post.title}</h1>
          <div className="mt-6 flex items-center gap-3 text-sm text-white/80">
            <span>👤 {post.authorName}</span>
            <span>・</span>
            <span>📅 {date}</span>
          </div>
        </div>
      </section>

      {/* 內文 */}
      <article className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <div className="prose prose-lg max-w-none text-gray-800 leading-loose whitespace-pre-line text-base md:text-lg">
          {post.excerpt && shouldShowExcerpt(post.excerpt, post.content) && (
            <p className="text-lg md:text-xl text-gray-600 border-l-4 border-brand-700 pl-4 mb-8 italic">
              {post.excerpt}
            </p>
          )}
          <BlogContent content={post.content} format={contentFormat} />
        </div>

        {post.tags && (
          <div className="mt-8 pt-6 border-t flex flex-wrap gap-2">
            {post.tags.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 內文 CTA */}
        <div className="mt-12 bg-brand-700 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold">需要到府服務？</h2>
          <p className="mt-2 text-white/90">歡迎來電或加 LINE，由師傅親自為您評估</p>
          <div className="mt-6 flex gap-3 justify-center flex-wrap">
            <Link
              href={`tel:${"0938989579"}`}
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3 rounded-md transition"
            >
              📞 立即撥打
            </Link>
            <Link
              href="https://line.me/ti/p/_8YeYUnzjS"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-md transition"
            >
              💬 LINE 諮詢
            </Link>
          </div>
        </div>

        {/* 分享 / 返回 */}
        <div className="mt-10 flex justify-between items-center">
          <Link href="/blog" className="text-brand-700 hover:underline text-sm">
            ← 返回文章列表
          </Link>
          <Link href="/" className="text-gray-500 hover:text-gray-900 text-sm">
            🏠 回首頁
          </Link>
        </div>
      </article>

      {/* 相關文章 */}
      {related.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="mx-auto max-w-5xl px-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">相關文章</h3>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="group block bg-white rounded-xl shadow-card overflow-hidden hover:shadow-lg transition"
                >
                  {r.coverImage && (
                    <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.coverImage} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 line-clamp-2 group-hover:text-brand-700">{r.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
