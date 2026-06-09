import { prisma } from "@/lib/prisma";
import { updateSettings } from "./actions";
import { ImageUploader } from "@/components/admin/ImageUploader";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">網站設定</h1>
        <p className="text-sm text-gray-500 mt-1">
          前台所有文字、標題、按鈕、圖片都可在此修改
        </p>
      </div>

      <form action={updateSettings} className="space-y-6">
        <section className="bg-white rounded-2xl shadow-card p-6 space-y-4">
          <h2 className="font-bold text-gray-900 border-b pb-2">公司資訊</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">公司名稱</label>
              <input name="companyName" defaultValue={s?.companyName ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">電話</label>
              <input name="phone" defaultValue={s?.phone ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LINE 連結</label>
              <input name="lineUrl" defaultValue={s?.lineUrl ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">營業時間</label>
              <input name="businessHours" defaultValue={s?.businessHours ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
              <input name="address" defaultValue={s?.address ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook 連結</label>
              <input name="facebookUrl" defaultValue={s?.facebookUrl ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram 連結</label>
              <input name="instagramUrl" defaultValue={s?.instagramUrl ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-card p-6 space-y-4">
          <h2 className="font-bold text-gray-900 border-b pb-2">首頁 Hero（無輪播圖時的預設）</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">主標題</label>
            <input name="heroBadge" defaultValue={s?.heroBadge ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">副標題（用 ｜ 分隔可換行）</label>
            <input name="heroSubtitle" defaultValue={s?.heroSubtitle ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-card p-6 space-y-4">
          <h2 className="font-bold text-gray-900 border-b pb-2">各區塊標題與 CTA</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">服務項目 標題</label>
              <input name="servicesTitle" defaultValue={s?.servicesTitle ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">服務區域 標題</label>
              <input name="areaTitle" defaultValue={s?.areaTitle ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">服務區域 CTA 按鈕文字</label>
              <input name="areaCtaLabel" defaultValue={s?.areaCtaLabel ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">客戶回饋 標題</label>
              <input name="reviewsTitle" defaultValue={s?.reviewsTitle ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">客戶回饋 副標題</label>
              <input name="reviewsSubtitle" defaultValue={s?.reviewsSubtitle ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">聯絡我們 標題</label>
              <input name="contactTitle" defaultValue={s?.contactTitle ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">聯絡區電話標籤</label>
              <input name="contactPhoneLabel" defaultValue={s?.contactPhoneLabel ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">聯絡區 CTA 按鈕文字</label>
              <input name="contactCtaLabel" defaultValue={s?.contactCtaLabel ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">聯絡區說明文字</label>
              <textarea name="contactDescription" rows={2} defaultValue={s?.contactDescription ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-card p-6 space-y-4">
          <h2 className="font-bold text-gray-900 border-b pb-2">浮動按鈕文字</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">桌面 電話按鈕</label>
              <input name="floatingPhoneLabel" defaultValue={s?.floatingPhoneLabel ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">桌面 LINE 按鈕</label>
              <input name="floatingLineLabel" defaultValue={s?.floatingLineLabel ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">手機底部 電話</label>
              <input name="mobilePhoneLabel" defaultValue={s?.mobilePhoneLabel ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">手機底部 LINE</label>
              <input name="mobileLineLabel" defaultValue={s?.mobileLineLabel ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-card p-6 space-y-4">
          <h2 className="font-bold text-gray-900 border-b pb-2">頁尾設定</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook 按鈕標籤</label>
              <input name="footerFbLabel" defaultValue={s?.footerFbLabel ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LINE 按鈕標籤</label>
              <input name="footerLineLabel" defaultValue={s?.footerLineLabel ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">版權文字（留空自動產生 © {new Date().getFullYear()} by 公司名）</label>
              <input name="footerCopyright" defaultValue={s?.footerCopyright ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-card p-6 space-y-4">
          <h2 className="font-bold text-gray-900 border-b pb-2">圖片設定</h2>
          <ImageUploader name="areaMapImage" defaultValue={s?.areaMapImage ?? ""} label="服務區域地圖" folder="og" />
          <ImageUploader name="ogImage" defaultValue={s?.ogImage ?? ""} label="OG 分享圖（1200×630）" folder="og" />
        </section>

        <section className="bg-white rounded-2xl shadow-card p-6 space-y-4">
          <h2 className="font-bold text-gray-900 border-b pb-2">SEO 設定</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO 標題</label>
            <input name="seoTitle" defaultValue={s?.seoTitle ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO 描述</label>
            <textarea name="seoDesc" rows={3} defaultValue={s?.seoDesc ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </section>

        <button type="submit" className="w-full bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 rounded-lg text-lg">
          儲存所有設定
        </button>
      </form>
    </div>
  );
}
