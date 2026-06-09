import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { deleteBlogPost, togglePublish } from "./actions";

export const dynamic = "force-dynamic";

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: { success?: string; error?: string };
}) {
  const posts = await prisma.blogPost.findMany({ orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }] });
  const success = searchParams?.success;
  const error = searchParams?.error;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">專業分享（部落格）</h1>
          <p className="text-sm text-gray-500 mt-1">共 {posts.length} 篇（已發佈 {posts.filter(p => p.isPublished).length}）</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-5 py-2.5 rounded-lg"
        >
          + 新增文章
        </Link>
      </div>

      {success && <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-lg">✅ {success}</div>}
      {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">❌ {error}</div>}

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">標題</th>
              <th className="px-4 py-3 font-medium">分類</th>
              <th className="px-4 py-3 font-medium">作者</th>
              <th className="px-4 py-3 font-medium">發佈時間</th>
              <th className="px-4 py-3 font-medium">狀態</th>
              <th className="px-4 py-3 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  尚未新增任何文章，點上方「+ 新增文章」開始撰寫
                </td>
              </tr>
            )}
            {posts.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50 align-top">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{p.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">/blog/{p.slug}</div>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {p.category ? (
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{p.category}</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">{p.authorName}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {p.publishedAt ? formatDate(p.publishedAt) : <span className="text-gray-400">未發佈</span>}
                </td>
                <td className="px-4 py-3">
                  <form
                    action={async () => {
                      "use server";
                      await togglePublish(p.id, !p.isPublished);
                    }}
                  >
                    <button
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        p.isPublished
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {p.isPublished ? "已發佈" : "草稿"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                  <Link href={`/admin/blog/${p.id}`} className="text-brand-700 hover:underline text-sm">
                    編輯
                  </Link>
                  {p.isPublished && (
                    <Link href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="text-gray-500 hover:underline text-sm">
                      預覽
                    </Link>
                  )}
                  <form
                    action={deleteBlogPost.bind(null, p.id)}
                    className="inline"
                  >
                    <button className="text-red-600 hover:underline text-sm" type="submit">
                      刪除
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
