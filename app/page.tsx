import { prisma } from "@/lib/prisma";
import { safeJsonParse } from "@/lib/utils";
import { Header } from "@/components/frontend/Header";
import { Hero } from "@/components/frontend/Hero";
import { Services } from "@/components/frontend/Services";
import { ServiceArea } from "@/components/frontend/ServiceArea";
import { Reviews } from "@/components/frontend/Reviews";
import { LatestPosts } from "@/components/frontend/LatestPosts";
import { Contact } from "@/components/frontend/Contact";
import { Footer } from "@/components/frontend/Footer";
import { FloatingButtons } from "@/components/frontend/FloatingButtons";
import type {
  ServiceItem,
  ReviewItem,
  HeroSlideItem,
  ServiceAreaItem,
  SiteSettingsItem,
} from "@/types";

export const dynamic = "force-dynamic";

async function getData() {
  const [settings, heroSlides, services, reviews, areas] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    prisma.heroSlide.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.service.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.review.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.serviceArea.findMany({ orderBy: { order: "asc" } }),
  ]);

  const safe: SiteSettingsItem = {
    companyName: settings?.companyName ?? "恆惠修理紗窗",
    phone: settings?.phone ?? "0938989579",
    lineUrl: settings?.lineUrl ?? "",
    address: settings?.address ?? "",
    businessHours: settings?.businessHours ?? "",
    facebookUrl: settings?.facebookUrl ?? "",
    instagramUrl: settings?.instagramUrl ?? "",
    seoTitle: settings?.seoTitle ?? "",
    seoDesc: settings?.seoDesc ?? "",
    ogImage: settings?.ogImage ?? "",
    heroBadge: settings?.heroBadge ?? "台中專業紗窗修理",
    heroSubtitle: settings?.heroSubtitle ?? "紗窗維修訂製｜折疊式紗窗｜鋁門窗維修｜防霾網安裝",
    servicesTitle: settings?.servicesTitle ?? "服務項目",
    areaTitle: settings?.areaTitle ?? "服務區域",
    areaMapImage: settings?.areaMapImage ?? "/uploads/og/og-default.jpg",
    areaCtaLabel: settings?.areaCtaLabel ?? "來電諮詢",
    reviewsTitle: settings?.reviewsTitle ?? "客戶回饋",
    reviewsSubtitle: settings?.reviewsSubtitle ?? "看看客戶對我們最新真實回饋",
    contactTitle: settings?.contactTitle ?? "聯絡我們",
    contactPhoneLabel: settings?.contactPhoneLabel ?? "電話",
    contactCtaLabel: settings?.contactCtaLabel ?? "立即撥打",
    contactDescription: settings?.contactDescription ?? "依照您的現況提供最好的建議及最妥善的處理方式，協助您解決問題。",
    floatingPhoneLabel: settings?.floatingPhoneLabel ?? "來電諮詢",
    floatingLineLabel: settings?.floatingLineLabel ?? "LINE 諮詢",
    mobilePhoneLabel: settings?.mobilePhoneLabel ?? "立即聯絡",
    mobileLineLabel: settings?.mobileLineLabel ?? "Line",
    footerFbLabel: settings?.footerFbLabel ?? "Facebook",
    footerLineLabel: settings?.footerLineLabel ?? "LINE",
    footerCopyright: settings?.footerCopyright ?? "",
  };

  return {
    settings: safe,
    heroSlides: heroSlides as HeroSlideItem[],
    services: services.map((s) => ({ ...s, features: safeJsonParse<string[]>(s.features, []) })) as ServiceItem[],
    reviews: reviews as ReviewItem[],
    areas: areas as ServiceAreaItem[],
  };
}

export default async function HomePage() {
  const { settings, heroSlides, services, reviews, areas } = await getData();

  return (
    <>
      <Header
        logoText={settings.companyName}
        phone={settings.phone}
      />
      <main id="content">
        <Hero
          slides={heroSlides}
          fallbackBadge={settings.heroBadge}
          fallbackSubtitle={settings.heroSubtitle}
        />
        <Services items={services} title={settings.servicesTitle} />
        <ServiceArea
          areas={areas}
          phone={settings.phone}
          mapImage={settings.areaMapImage}
          title={settings.areaTitle}
          ctaLabel={settings.areaCtaLabel}
        />
        <Reviews
          items={reviews}
          title={settings.reviewsTitle}
          subtitle={settings.reviewsSubtitle}
        />
        <LatestPosts />
        <Contact
          settings={settings}
          title={settings.contactTitle}
          phoneLabel={settings.contactPhoneLabel}
          ctaLabel={settings.contactCtaLabel}
        />
      </main>
      <Footer
        settings={settings}
        fbLabel={settings.footerFbLabel}
        lineLabel={settings.footerLineLabel}
      />
      <FloatingButtons
        phone={settings.phone}
        lineUrl={settings.lineUrl}
        phoneLabel={settings.floatingPhoneLabel}
        lineLabel={settings.floatingLineLabel}
        mobilePhoneLabel={settings.mobilePhoneLabel}
        mobileLineLabel={settings.mobileLineLabel}
      />
    </>
  );
}
