import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateBlogPost } from "../actions";
import { ImageUploader } from "@/components/admin/ImageUploader";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/blog" className="text-sm text-gray-500 hover:text-brand-700">
        ← 返回文章列表
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">編輯文章</h1>
        <p className="text-sm text-gray-500 mt-1">
          建立時間：{post.createdAt.toLocaleString("zh-TW")}
          {post.publishedAt && ` ・ 發佈時間：${post.publishedAt.toLocaleString("zh-TW")}`}
        </p>
      </div>

      {searchParams?.error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">❌ {searchParams.error}</div>
      )}

      <form action={updateBlogPost.bind(null, id)} className="bg-white rounded-2xl shadow-card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">標題 *</label>
          <input
            name="title"
            required
            defaultValue={post.title}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-lg font-semibold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            網址代稱（slug）
            <span className="text-xs text-gray-500 ml-2">變更會影響前台網址，建議不要改</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-mono">/blog/</span>
            <input
              name="slug"
              defaultValue={post.slug}
              pattern="[a-z0-9\-_]*"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none font-mono text-sm"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">分類</label>
            <input
              name="category"
              defaultValue={post.category}
              placeholder="例：維修建議、案例分享、常見問題"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">標籤（逗號分隔）</label>
            <input
              name="tags"
              defaultValue={post.tags}
              placeholder="例：紗窗, 保養, 維修"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">作者</label>
          <input
            name="authorName"
            defaultValue={post.authorName}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <ImageUploader name="coverImage" defaultValue={post.coverImage} label="封面圖" folder="blog" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
          <textarea
            name="excerpt"
            rows={2}
            defaultValue={post.excerpt}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">內容 *</label>
          <textarea
            name="content"
            required
            rows={16}
            defaultValue={post.content}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none font-mono text-sm leading-relaxed"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isPublished"
            name="isPublished"
            type="checkbox"
            defaultChecked={post.isPublished}
            className="w-4 h-4"
          />
          <label htmlFor="isPublished" className="text-sm text-gray-700">已發佈（前台可看到）</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-6 py-2.5 rounded-lg">
            儲存變更
          </button>
          <Link href="/admin/blog" className="px-6 py-2.5 text-gray-600 hover:text-gray-900">取消</Link>
        </div>
      </form>
    </div>
  );
}
