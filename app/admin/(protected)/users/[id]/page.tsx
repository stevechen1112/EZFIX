import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { updateUser } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditUserPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  const me = await getCurrentUser();
  if (!me || me.role !== "admin") {
    redirect("/admin/users?error=" + encodeURIComponent("只有 admin 可以編輯管理員"));
  }

  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) notFound();

  const isSelf = user.id === me.id;

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/admin/users" className="text-sm text-gray-500 hover:text-brand-700">
        ← 返回帳號列表
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          編輯管理員 {isSelf && <span className="text-sm text-blue-600 font-normal">（您自己）</span>}
        </h1>
        <p className="text-sm text-gray-500 mt-1">登入帳號無法修改，建立時間：{user.createdAt.toLocaleDateString("zh-TW")}</p>
      </div>

      {searchParams?.error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">❌ {searchParams.error}</div>
      )}

      <form action={updateUser.bind(null, id)} className="bg-white rounded-2xl shadow-card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">登入帳號</label>
          <input
            value={user.username}
            disabled
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 font-mono"
          />
          <p className="text-xs text-gray-500 mt-1">帳號建立後無法修改（避免破壞關聯）</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">顯示名稱 *</label>
          <input
            name="name"
            required
            defaultValue={user.name}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            新密碼
            <span className="text-xs text-gray-500 ml-2">（留空表示不修改；至少 8 字元）</span>
          </label>
          <input
            name="password"
            type="password"
            minLength={8}
            autoComplete="new-password"
            placeholder="（留空不修改）"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">角色 *</label>
          <select
            name="role"
            defaultValue={user.role}
            disabled={isSelf}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
          >
            <option value="editor">編輯者（可編輯內容，不能管理帳號）</option>
            <option value="admin">管理員（完整權限）</option>
          </select>
          {isSelf && <p className="text-xs text-gray-500 mt-1">不能變更自己的角色（避免把自己鎖死）</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-6 py-2.5 rounded-lg"
          >
            儲存變更
          </button>
          <Link href="/admin/users" className="px-6 py-2.5 text-gray-600 hover:text-gray-900">
            取消
          </Link>
        </div>
      </form>
    </div>
  );
}
