"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { label: string; href: string; icon: string };

const NAV: NavItem[] = [
  { label: "儀表板", href: "/admin/dashboard", icon: "📊" },
  { label: "服務項目", href: "/admin/services", icon: "🔧" },
  { label: "客戶回饋", href: "/admin/reviews", icon: "⭐" },
  { label: "Hero 輪播", href: "/admin/hero", icon: "🖼️" },
  { label: "服務區域", href: "/admin/areas", icon: "📍" },
  { label: "專業分享", href: "/admin/blog", icon: "📝" },
  { label: "網站設定", href: "/admin/settings", icon: "⚙️" },
  { label: "管理員帳號", href: "/admin/users", icon: "👥" },
  { label: "帳號設定", href: "/admin/account", icon: "🔑" },
];

export function AdminShell({
  user,
  children,
}: {
  user: { username: string; name: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 手機版頂部列 */}
      <div className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <button onClick={() => setOpen(true)} className="text-2xl">☰</button>
        <div className="font-bold text-gray-900">後台管理</div>
        <Link href="/" className="text-sm text-brand-700">前台</Link>
      </div>

      {/* Sidebar (桌面固定 / 手機抽屜) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="font-bold text-lg">恆惠後台</div>
            <div className="text-xs text-white/50 mt-0.5">Hi, {user.name}</div>
          </div>
          <button onClick={() => setOpen(false)} className="md:hidden text-2xl">×</button>
        </div>
        <nav className="px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                  active ? "bg-brand-700 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 px-3 py-4 border-t border-white/10 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white"
          >
            <span>🌐</span><span>前台首頁</span>
          </Link>
          <Link
            href="/admin/logout"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-300 hover:bg-red-500/10"
          >
            <span>🚪</span><span>登出</span>
          </Link>
        </div>
      </aside>

      {/* 遮罩（手機） */}
      {open && <div onClick={() => setOpen(false)} className="md:hidden fixed inset-0 bg-black/50 z-30" />}

      {/* 主內容 */}
      <div className="md:ml-64">
        <div className="max-w-6xl mx-auto p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
