import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteReview, toggleReviewActive } from "./actions";

export const dynamic = "force-dynamic";

export default async function ReviewsList() {
  const reviews = await prisma.review.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">客戶回饋</h1>
          <p className="text-sm text-gray-500 mt-1">共 {reviews.length} 筆</p>
        </div>
        <Link
          href="/admin/reviews/new"
          className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-5 py-2.5 rounded-lg"
        >
          + 新增
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium w-12">#</th>
              <th className="px-4 py-3 font-medium">姓名</th>
              <th className="px-4 py-3 font-medium">內容</th>
              <th className="px-4 py-3 font-medium">星數</th>
              <th className="px-4 py-3 font-medium">狀態</th>
              <th className="px-4 py-3 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  尚未新增任何評論
                </td>
              </tr>
            )}
            {reviews.map((r) => (
              <tr key={r.id} className="border-t hover:bg-gray-50 align-top">
                <td className="px-4 py-3 text-gray-500">{r.order}</td>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{r.name}</td>
                <td className="px-4 py-3 text-gray-600 line-clamp-2 max-w-md">{r.content}</td>
                <td className="px-4 py-3 text-amber-500">{"★".repeat(r.rating)}</td>
                <td className="px-4 py-3">
                  <form
                    action={async () => {
                      "use server";
                      await toggleReviewActive(r.id, !r.isActive);
                    }}
                  >
                    <button
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        r.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {r.isActive ? "啟用" : "停用"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                  <Link href={`/admin/reviews/${r.id}`} className="text-brand-700 hover:underline text-sm">
                    編輯
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteReview(r.id);
                    }}
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
