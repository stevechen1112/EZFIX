import { getCurrentUser } from "@/lib/auth";
import { changePassword } from "./actions";

export const dynamic = "force-dynamic";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: { success?: string; error?: string };
}) {
  const user = await getCurrentUser();
  const success = searchParams?.success === "1";
  const error = searchParams?.error;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">帳號設定</h1>
        <p className="text-sm text-gray-500 mt-1">修改後台登入密碼</p>
      </div>

      {success && (
        <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <span className="text-xl">✅</span>
          <span>密碼已更新，下次登入請使用新密碼</span>
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <span className="text-xl">❌</span>
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="mb-6 pb-6 border-b">
          <p className="text-sm text-gray-500">目前登入帳號</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{user?.username}</p>
          {user?.name && <p className="text-sm text-gray-500 mt-0.5">{user.name}</p>}
        </div>

        <form action={changePassword} className="space-y-4">
          <h2 className="font-bold text-gray-900">變更密碼</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">目前密碼 *</label>
            <input
              name="currentPassword"
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="輸入您目前的密碼"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">新密碼 *</label>
            <input
              name="newPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="至少 8 個字元"
            />
            <p className="text-xs text-gray-500 mt-1">建議包含英文字母 + 數字，長度 8 字元以上</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">確認新密碼 *</label>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="再輸入一次新密碼"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-6 py-2.5 rounded-lg"
            >
              更新密碼
            </button>
          </div>
        </form>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <p className="font-semibold mb-1">⚠️ 密碼安全提醒</p>
        <ul className="list-disc list-inside space-y-0.5 text-amber-700">
          <li>不要使用與其他網站相同的密碼</li>
          <li>定期更換密碼（建議 3-6 個月）</li>
          <li>如忘記密碼，請用 SSH 進入伺服器後重設</li>
        </ul>
      </div>
    </div>
  );
}
