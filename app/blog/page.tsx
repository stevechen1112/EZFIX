import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { BlogPostItem } from "@/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "專業分享 - 紗窗維修知識懶人包 | 恆惠修理紗窗",
  description: "分享紗窗、鋁門窗、防霾網的保養與維修知識，由恆惠修理紗窗的師傅親自撰寫。",
};

export default async function BlogIndexPage() {
  const posts = (await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  })) as BlogPostItem[];

  return (
    <>
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-black tracking-wide">專業分享</h1>
            <p className="mt-4 text-white/80 text-lg">紗窗、鋁門窗、防霾網的保養知識與維修建議</p>
            <p className="mt-2 text-white/60 text-sm">共 {posts.length} 篇文章</p>
          </div>
        </section>

        {/* 文章列表 */}
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-5xl px-4">
            {posts.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-lg">目前還沒有文章</p>
                <p className="text-sm mt-2">敬請期待！我們會陸續分享專業知識</p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((p) => (
                  <BlogCard key={p.id} post={p} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 底部 CTA */}
        <section className="bg-gray-50 py-12">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900">需要專業諮詢？</h2>
            <p className="mt-3 text-gray-600">歡迎來電或加 LINE 詢問，我們會給您最合適的建議</p>
            <div className="mt-6 flex gap-3 justify-center flex-wrap">
              <Link
                href="tel:0938989579"
                className="inline-block bg-gray-900 hover:bg-black text-white font-bold px-8 py-3 rounded-md transition"
              >
                📞 來電諮詢
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
        </section>
      </main>
    </>
  );
}

function BlogCard({ post }: { post: BlogPostItem }) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" })
    : "";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white rounded-2xl shadow-card overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition"
    >
      {post.coverImage ? (
        <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-brand-700 text-5xl font-black">
          {post.title.charAt(0)}
        </div>
      )}
      <div className="p-5">
        {post.category && (
          <span className="inline-block text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded mb-2">
            {post.category}
          </span>
        )}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-brand-700 transition">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
        )}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span>{post.authorName}</span>
          <span>{date}</span>
        </div>
      </div>
    </Link>
  );
}
