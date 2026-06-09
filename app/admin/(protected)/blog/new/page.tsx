import Link from "next/link";
import { createBlogPost } from "../actions";
import { ImageUploader } from "@/components/admin/ImageUploader";

export default function NewBlogPostPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/blog" className="text-sm text-gray-500 hover:text-brand-700">
        ← 返回文章列表
      </Link>
      <h1 className="text-2xl font-bold text-gray-900">新增文章</h1>

      {searchParams?.error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">❌ {searchParams.error}</div>
      )}

      <form action={createBlogPost} className="bg-white rounded-2xl shadow-card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">標題 *</label>
          <input
            name="title"
            required
            placeholder="例：紗窗保養 5 個小技巧"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-lg font-semibold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            網址代稱（slug）
            <span className="text-xs text-gray-500 ml-2">留空自動從標題產生（限英文小寫、數字、連字號）</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-mono">/blog/</span>
            <input
              name="slug"
              pattern="[a-z0-9\-_]*"
              placeholder="例：screen-window-care-tips"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none font-mono text-sm"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">分類</label>
            <input
              name="category"
              placeholder="例：維修建議、案例分享、常見問題"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">標籤（用逗號分隔）</label>
            <input
              name="tags"
              placeholder="例：紗窗, 保養, 維修"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">作者</label>
          <input
            name="authorName"
            defaultValue="恆惠修理紗窗"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <ImageUploader name="coverImage" label="封面圖（建議 1200×630）" folder="blog" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
          <textarea
            name="excerpt"
            rows={2}
            placeholder="列表頁會顯示這段（120 字以內最佳）"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">內容 *</label>
          <textarea
            name="content"
            required
            rows={14}
            placeholder="支援純文字換行&#10;用空行分段"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none font-mono text-sm leading-relaxed"
          />
          <p className="text-xs text-gray-500 mt-1">
            支援純文字與換行（用空行分段）。如需 markdown / HTML 進階編輯器請告訴我加。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input id="isPublished" name="isPublished" type="checkbox" defaultChecked className="w-4 h-4" />
          <label htmlFor="isPublished" className="text-sm text-gray-700">立即發佈（前台可看到）</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-6 py-2.5 rounded-lg">
            建立文章
          </button>
          <Link href="/admin/blog" className="px-6 py-2.5 text-gray-600 hover:text-gray-900">取消</Link>
        </div>
      </form>
    </div>
  );
}
