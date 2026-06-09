import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateReview } from "../actions";
import { ImageUploader } from "@/components/admin/ImageUploader";

export const dynamic = "force-dynamic";

export default async function EditReviewPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <Link href="/admin/reviews" className="hover:text-brand-700">← 返回列表</Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">編輯客戶評論</h1>

      <form action={updateReview.bind(null, id)} className="bg-white rounded-2xl shadow-card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">顯示姓名 *</label>
          <input
            name="name"
            required
            defaultValue={review.name}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">評論內容 *</label>
          <textarea
            name="content"
            required
            rows={6}
            defaultValue={review.content}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">評分 (1-5)</label>
            <select
              name="rating"
              defaultValue={review.rating}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{"★".repeat(n)} ({n})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
            <input
              name="order"
              type="number"
              defaultValue={review.order}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>
        <ImageUploader name="avatar" defaultValue={review.avatar} label="頭像" folder="avatars" />
        <div className="flex items-center gap-2">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            defaultChecked={review.isActive}
            className="w-4 h-4"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">啟用</label>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-6 py-2.5 rounded-lg">
            儲存
          </button>
          <Link href="/admin/reviews" className="px-6 py-2.5 text-gray-600 hover:text-gray-900">
            取消
          </Link>
        </div>
      </form>
    </div>
  );
}
