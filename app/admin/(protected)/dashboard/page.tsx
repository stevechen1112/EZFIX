import { prisma } from "@/lib/prisma";
import { safeJsonParse } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [servicesCount, reviewsCount, heroCount, areasCount, settings] = await Promise.all([
    prisma.service.count(),
    prisma.review.count(),
    prisma.heroSlide.count(),
    prisma.serviceArea.count(),
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
  ]);

  const cards = [
    { label: "服務項目", count: servicesCount, href: "/admin/services", color: "from-blue-500 to-blue-700" },
    { label: "客戶回饋", count: reviewsCount, href: "/admin/reviews", color: "from-amber-500 to-amber-700" },
    { label: "Hero 輪播", count: heroCount, href: "/admin/hero", color: "from-emerald-500 to-emerald-700" },
    { label: "服務區域", count: areasCount, href: "/admin/areas", color: "from-purple-500 to-purple-700" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">儀表板</h1>
        <p className="text-sm text-gray-500 mt-1">網站資料總覽</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`bg-gradient-to-br ${c.color} text-white rounded-2xl p-5 shadow-card hover:shadow-lg transition`}
          >
            <div className="text-3xl font-black">{c.count}</div>
            <div className="mt-1 text-sm text-white/80">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-bold text-gray-900 mb-4">公司資訊</h2>
        <dl className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">公司名稱</dt>
            <dd className="font-medium text-gray-900">{settings?.companyName}</dd>
          </div>
          <div>
            <dt className="text-gray-500">電話</dt>
            <dd className="font-medium text-gray-900">{settings?.phone}</dd>
          </div>
          <div>
            <dt className="text-gray-500">地址</dt>
            <dd className="font-medium text-gray-900">{settings?.address}</dd>
          </div>
          <div>
            <dt className="text-gray-500">營業時間</dt>
            <dd className="font-medium text-gray-900">{settings?.businessHours}</dd>
          </div>
        </dl>
        <Link
          href="/admin/settings"
          className="inline-block mt-4 text-sm text-brand-700 hover:underline"
        >
          編輯公司資訊 →
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-bold text-gray-900 mb-3">快速連結</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <Link href="/admin/services/new" className="px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg">+ 新增服務項目</Link>
          <Link href="/admin/reviews/new" className="px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg">+ 新增客戶評論</Link>
          <Link href="/admin/hero" className="px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg">管理 Hero 輪播</Link>
          <Link href="/admin/areas" className="px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg">管理服務區域</Link>
          <Link href="/" target="_blank" className="px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg">🌐 開啟前台首頁</Link>
        </div>
      </div>
    </div>
  );
}
