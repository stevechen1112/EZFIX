import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { deleteUser } from "./actions";

export const dynamic = "force-dynamic";

const ROLE_LABEL: Record<string, string> = {
  admin: "管理員",
  editor: "編輯者",
};

const ROLE_COLOR: Record<string, string> = {
  admin: "bg-brand-100 text-brand-700",
  editor: "bg-amber-100 text-amber-700",
};

export default async function UsersListPage({
  searchParams,
}: {
  searchParams: { success?: string; error?: string };
}) {
  const me = await getCurrentUser();
  const users = await prisma.user.findMany({ orderBy: { id: "asc" } });
  const success = searchParams?.success;
  const error = searchParams?.error;
  const canManage = me?.role === "admin";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">管理員帳號</h1>
          <p className="text-sm text-gray-500 mt-1">共 {users.length} 個帳號</p>
        </div>
        {canManage && (
          <Link
            href="/admin/users/new"
            className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-5 py-2.5 rounded-lg"
          >
            + 新增管理員
          </Link>
        )}
      </div>

      {success && (
        <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-lg">✅ {success}</div>
      )}
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">❌ {error}</div>
      )}

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">帳號</th>
              <th className="px-4 py-3 font-medium">顯示名稱</th>
              <th className="px-4 py-3 font-medium">角色</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">建立時間</th>
              <th className="px-4 py-3 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                  尚未建立任何管理員
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{u.username}</span>
                    {u.id === me?.id && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">你</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">{u.name}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLOR[u.role] || "bg-gray-100 text-gray-600"}`}>
                    {ROLE_LABEL[u.role] || u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                  {formatDate(u.createdAt)}
                </td>
                <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                  {canManage && (
                    <>
                      <Link href={`/admin/users/${u.id}`} className="text-brand-700 hover:underline text-sm">
                        編輯
                      </Link>
                      {u.id !== me?.id && (
                        <form action={deleteUser.bind(null, u.id)} className="inline">
                          <button type="submit" className="text-red-600 hover:underline text-sm">
                            刪除
                          </button>
                        </form>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">ℹ️ 角色說明</p>
        <ul className="list-disc list-inside space-y-0.5 text-blue-700">
          <li><b>管理員 (admin)</b>：可使用所有功能，包含管理其他管理員帳號</li>
          <li><b>編輯者 (editor)</b>：可編輯內容（服務、評論、Hero、設定），但不能管理帳號</li>
          <li>系統至少要保留一個 admin，避免鎖死後台</li>
        </ul>
      </div>
    </div>
  );
}
