import { prisma } from "./prisma";
import { normalizeMediaUrl } from "./media-url";
import type { SiteSettingsItem } from "@/types";

export async function getSiteSettings(): Promise<SiteSettingsItem> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return {
    companyName: settings?.companyName ?? "恆惠修理紗窗",
    phone: settings?.phone ?? "0938989579",
    lineUrl: settings?.lineUrl ?? "",
    address: settings?.address ?? "",
    businessHours: settings?.businessHours ?? "",
    facebookUrl: settings?.facebookUrl ?? "",
    instagramUrl: settings?.instagramUrl ?? "",
    seoTitle: settings?.seoTitle ?? "",
    seoDesc: settings?.seoDesc ?? "",
    ogImage: normalizeMediaUrl(settings?.ogImage ?? ""),
    heroBadge: settings?.heroBadge ?? "台中專業紗窗修理",
    heroSubtitle: settings?.heroSubtitle ?? "紗窗維修訂製｜折疊式紗窗｜鋁門窗維修｜防霾網安裝",
    servicesTitle: settings?.servicesTitle ?? "服務項目",
    areaTitle: settings?.areaTitle ?? "服務區域",
    areaMapImage: normalizeMediaUrl(settings?.areaMapImage ?? "/media/og/og-default.jpg"),
    areaCtaLabel: settings?.areaCtaLabel ?? "來電諮詢",
    reviewsTitle: settings?.reviewsTitle ?? "客戶回饋",
    reviewsSubtitle: settings?.reviewsSubtitle ?? "看看客戶對我們最新真實回饋",
    contactTitle: settings?.contactTitle ?? "聯絡我們",
    contactPhoneLabel: settings?.contactPhoneLabel ?? "電話",
    contactCtaLabel: settings?.contactCtaLabel ?? "立即撥打",
    contactDescription:
      settings?.contactDescription ??
      "依照您的現況提供最好的建議及最妥善的處理方式，協助您解決問題。",
    floatingPhoneLabel: settings?.floatingPhoneLabel ?? "來電諮詢",
    floatingLineLabel: settings?.floatingLineLabel ?? "LINE 諮詢",
    mobilePhoneLabel: settings?.mobilePhoneLabel ?? "立即聯絡",
    mobileLineLabel: settings?.mobileLineLabel ?? "Line",
    footerFbLabel: settings?.footerFbLabel ?? "Facebook",
    footerLineLabel: settings?.footerLineLabel ?? "LINE",
    footerCopyright: settings?.footerCopyright ?? "",
  };
}
