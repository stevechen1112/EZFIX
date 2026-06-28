import { prisma } from "@/lib/prisma";
import { safeJsonParse } from "@/lib/utils";
import { normalizeMediaUrl } from "@/lib/media-url";
import { getSiteSettings } from "@/lib/site-settings";
import { resolveSiteBaseUrl } from "@/lib/site-url";
import { Header } from "@/components/frontend/Header";
import { Hero } from "@/components/frontend/Hero";
import { Services } from "@/components/frontend/Services";
import { ServiceArea } from "@/components/frontend/ServiceArea";
import { Reviews } from "@/components/frontend/Reviews";
import { LatestPosts } from "@/components/frontend/LatestPosts";
import { Contact } from "@/components/frontend/Contact";
import { Footer } from "@/components/frontend/Footer";
import { FloatingButtons } from "@/components/frontend/FloatingButtons";
import Link from "next/link";
import type {
  ServiceItem,
  ReviewItem,
  HeroSlideItem,
  ServiceAreaItem,
} from "@/types";

const SERVICE_LINKS = [
  { href: "/blog/鋁門窗維修", title: "鋁門窗維修", desc: "門窗卡卡、輪子壞掉、密封不良，專業維修一次解決" },
  { href: "/blog/折疊式紗窗", title: "折疊式紗窗", desc: "小空間最佳選擇，摺疊收納不占位" },
  { href: "/blog/折疊式紗窗紗門訂製", title: "折疊式紗窗紗門訂製", desc: "量身訂製，精準符合您的門窗尺寸" },
  { href: "/blog/防霾紗網", title: "防霾紗網", desc: "阻隔 PM2.5、花粉、灰塵，守護家人呼吸健康" },
];

function LocalBusinessSchema({ settings }: { settings: ReturnType<typeof getSiteSettings> extends Promise<infer T> ? T : never }) {
  const baseUrl = resolveSiteBaseUrl();
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": settings.companyName,
    "telephone": settings.phone,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "台中市",
      "addressRegion": "台灣",
      "streetAddress": settings.address || "台中市南區柳川東路一段50號",
    },
    "url": baseUrl,
    "openingHours": settings.businessHours || "Mo-Su 08:00-17:00",
    "areaServed": "台中市",
    "description": settings.seoDesc || "台中在地專業紗窗修理、折疊式紗窗訂製、鋁門窗維修、防霾網安裝服務。",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export const dynamic = "force-dynamic";

async function getData() {
  const [settings, heroSlides, services, reviews, areas] = await Promise.all([
    getSiteSettings(),
    prisma.heroSlide.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.service.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.review.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.serviceArea.findMany({ orderBy: { order: "asc" } }),
  ]);

  return {
    settings,
    heroSlides: heroSlides.map((h) => ({ ...h, image: normalizeMediaUrl(h.image) })) as HeroSlideItem[],
    services: services.map((s) => ({
      ...s,
      image: normalizeMediaUrl(s.image),
      features: safeJsonParse<string[]>(s.features, []),
    })) as ServiceItem[],
    reviews: reviews.map((r) => ({ ...r, avatar: normalizeMediaUrl(r.avatar) })) as ReviewItem[],
    areas: areas as ServiceAreaItem[],
  };
}

export default async function HomePage() {
  const { settings, heroSlides, services, reviews, areas } = await getData();

  return (
    <>
      <LocalBusinessSchema settings={settings} />
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
        {/* 新服務文章連結（幫助 Google 爬蟲從首頁發現新內容） */}
        <section className="py-12 md:py-16 bg-white">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">專業服務指南</h2>
            <p className="text-gray-500 text-center mb-10">深入了解各項服務的詳細說明與常見問題</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICE_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group block bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition"
                >
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-700 transition">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  <span className="mt-3 inline-block text-sm text-brand-700 font-medium">了解更多 →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
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
