import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const user = await getCurrentUser();
  if (user) redirect("/admin/dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-xl bg-brand-700 text-white flex items-center justify-center text-2xl font-black">
            恆
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">後台管理系統</h1>
          <p className="text-sm text-gray-500 mt-1">恆惠修理紗窗</p>
        </div>

        <form action={loginAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">帳號</label>
            <input
              name="username"
              type="text"
              required
              autoFocus
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密碼</label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              placeholder="••••••••"
            />
          </div>

          {searchParams?.error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-2.5">
              帳號或密碼錯誤
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 rounded-lg transition"
          >
            登入
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          預設帳號：admin / admin1234（首次登入後請至設定變更）
        </p>
      </div>
    </div>
  );
}
