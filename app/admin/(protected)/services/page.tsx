import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { safeJsonParse } from "@/lib/utils";
import { toggleServiceActive, deleteService } from "./actions";

export const dynamic = "force-dynamic";

export default async function ServicesList() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">服務項目</h1>
          <p className="text-sm text-gray-500 mt-1">共 {services.length} 筆</p>
        </div>
        <Link
          href="/admin/services/new"
          className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-5 py-2.5 rounded-lg"
        >
          + 新增
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">排序</th>
              <th className="px-4 py-3 font-medium">標題</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">特色</th>
              <th className="px-4 py-3 font-medium">狀態</th>
              <th className="px-4 py-3 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                  尚未新增任何服務項目
                </td>
              </tr>
            )}
            {services.map((s) => {
              const features = safeJsonParse<string[]>(s.features, []);
              return (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{s.order}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{s.title}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {features.length} 項
                  </td>
                  <td className="px-4 py-3">
                    <form action={async () => {
                      "use server";
                      await toggleServiceActive(s.id, !s.isActive);
                    }}>
                      <button
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          s.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {s.isActive ? "啟用" : "停用"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link href={`/admin/services/${s.id}`} className="text-brand-700 hover:underline text-sm">
                      編輯
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteService(s.id);
                      }}
                      className="inline"
                    >
                      <button className="text-red-600 hover:underline text-sm" type="submit">
                        刪除
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
