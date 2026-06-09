import Link from "next/link";
import { createUser } from "../actions";

export default function NewUserPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/admin/users" className="text-sm text-gray-500 hover:text-brand-700">
        ← 返回帳號列表
      </Link>
      <h1 className="text-2xl font-bold text-gray-900">新增管理員</h1>

      {searchParams?.error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">❌ {searchParams.error}</div>
      )}

      <form action={createUser} className="bg-white rounded-2xl shadow-card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            登入帳號 *
            <span className="text-xs text-gray-500 ml-2">（英文小寫、數字、底線、連字號，至少 3 字元）</span>
          </label>
          <input
            name="username"
            required
            minLength={3}
            pattern="[a-z0-9_-]+"
            placeholder="例如：staff01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">顯示名稱 *</label>
          <input
            name="name"
            required
            placeholder="例如：王師傅"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            密碼 *
            <span className="text-xs text-gray-500 ml-2">（至少 8 字元）</span>
          </label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">角色 *</label>
          <select
            name="role"
            defaultValue="editor"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          >
            <option value="editor">編輯者（可編輯內容，不能管理帳號）</option>
            <option value="admin">管理員（完整權限）</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-6 py-2.5 rounded-lg"
          >
            建立管理員
          </button>
          <Link href="/admin/users" className="px-6 py-2.5 text-gray-600 hover:text-gray-900">
            取消
          </Link>
        </div>
      </form>
    </div>
  );
}
