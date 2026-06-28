import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { BlogPostItem } from "@/types";

const DISPLAY_COUNT = 3;

export async function LatestPosts() {
  const posts = (await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: DISPLAY_COUNT,
  })) as BlogPostItem[];

  if (posts.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-12">
          <h2 className="title-blue title-underline text-3xl md:text-4xl font-bold">最新文章</h2>
          <p className="mt-4 text-gray-500">紗窗、鋁門窗的保養知識與維修建議</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((p) => (
            <LatestPostCard key={p.id} post={p} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-block bg-gray-900 hover:bg-black text-white font-bold px-10 py-3 rounded-md transition"
          >
            看更多文章 →
          </Link>
        </div>
      </div>
    </section>
  );
}

function LatestPostCard({ post }: { post: BlogPostItem }) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white rounded-2xl shadow-card overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition"
    >
      {post.coverImage && (
        <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition"
            loading="lazy"
          />
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
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
        )}
        <p className="mt-3 text-xs text-gray-400">{date}</p>
      </div>
    </Link>
  );
}
