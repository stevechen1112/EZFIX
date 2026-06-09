import { prisma } from "@/lib/prisma";
import { createArea, deleteArea } from "./actions";

export const dynamic = "force-dynamic";

export default async function AreasPage() {
  const areas = await prisma.serviceArea.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">服務區域</h1>
        <p className="text-sm text-gray-500 mt-1">前台首頁會以「、」串接顯示</p>
      </div>

      <form action={createArea} className="bg-white rounded-2xl shadow-card p-6 flex gap-3">
        <input
          name="name"
          required
          placeholder="輸入區域名稱，例如：北屯區"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
        />
        <button type="submit" className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-6 py-2 rounded-lg">
          + 新增
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow-card p-6">
        {areas.length === 0 ? (
          <p className="text-center text-gray-400 py-8">尚未新增區域</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {areas.map((a) => (
              <div key={a.id} className="flex items-center gap-2 bg-gray-100 rounded-full pl-4 pr-2 py-1.5">
                <span className="text-sm text-gray-800">{a.name}</span>
                <form
                  action={async () => {
                    "use server";
                    await deleteArea(a.id);
                  }}
                >
                  <button type="submit" className="text-gray-400 hover:text-red-600 text-sm">×</button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
