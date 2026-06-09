import { prisma } from "@/lib/prisma";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { createHero, deleteHero, toggleHeroActive } from "./actions";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function HeroPage() {
  const slides = await prisma.heroSlide.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hero 輪播</h1>
        <p className="text-sm text-gray-500 mt-1">首頁主視覺輪播（建議尺寸 1920×900）</p>
      </div>

      {/* 新增表單 */}
      <form action={createHero} className="bg-white rounded-2xl shadow-card p-6 space-y-4">
        <h2 className="font-bold text-gray-900">新增輪播</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">主標題</label>
            <input name="title" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="台中專業紗窗修理" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
            <input name="order" type="number" defaultValue={0} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">副標題</label>
          <input name="subtitle" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">按鈕文字</label>
            <input name="ctaLabel" defaultValue="立即諮詢" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">按鈕連結</label>
            <input name="ctaHref" defaultValue="tel:0938989579" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
        <ImageUploader name="image" label="背景圖" folder="hero" />
        <div className="flex items-center gap-2">
          <input id="isActive" name="isActive" type="checkbox" defaultChecked className="w-4 h-4" />
          <label htmlFor="isActive" className="text-sm text-gray-700">啟用</label>
        </div>
        <button type="submit" className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-6 py-2.5 rounded-lg">
          + 新增輪播
        </button>
      </form>

      {/* 列表 */}
      <div className="space-y-3">
        {slides.length === 0 && (
          <div className="bg-white rounded-2xl shadow-card p-12 text-center text-gray-400">
            尚未新增任何輪播
          </div>
        )}
        {slides.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl shadow-card p-4 flex items-start gap-4">
            <div className="w-32 h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
              {s.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={s.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">無圖</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">{s.title}</div>
              <div className="text-sm text-gray-500 truncate">{s.subtitle}</div>
              <div className="text-xs text-gray-400 mt-1">排序 {s.order}</div>
            </div>
            <div className="flex flex-col gap-2">
              <form
                action={async () => {
                  "use server";
                  await toggleHeroActive(s.id, !s.isActive);
                }}
              >
                <button className={`text-xs px-2.5 py-1 rounded-full ${s.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-500"}`}>
                  {s.isActive ? "啟用" : "停用"}
                </button>
              </form>
              <form
                action={async () => {
                  "use server";
                  await deleteHero(s.id);
                }}
              >
                <button className="text-xs text-red-600 hover:underline">刪除</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
