export type ServiceItem = {
  id: number;
  title: string;
  description: string;
  features: string[]; // 解析後的陣列
  icon: string;
  image: string;
  order: number;
  isActive: boolean;
};

export type ReviewItem = {
  id: number;
  name: string;
  content: string;
  rating: number;
  avatar: string;
  order: number;
  isActive: boolean;
};

export type HeroSlideItem = {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  order: number;
  isActive: boolean;
};

export type ServiceAreaItem = {
  id: number;
  name: string;
  order: number;
};

export type BlogPostItem = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorName: string;
  category: string;
  tags: string;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SiteSettingsItem = {
  companyName: string;
  phone: string;
  lineUrl: string;
  address: string;
  businessHours: string;
  facebookUrl: string;
  instagramUrl: string;
  seoTitle: string;
  seoDesc: string;
  ogImage: string;
  heroBadge: string;
  heroSubtitle: string;
  servicesTitle: string;
  areaTitle: string;
  areaMapImage: string;
  areaCtaLabel: string;
  reviewsTitle: string;
  reviewsSubtitle: string;
  contactTitle: string;
  contactPhoneLabel: string;
  contactCtaLabel: string;
  contactDescription: string;
  floatingPhoneLabel: string;
  floatingLineLabel: string;
  mobilePhoneLabel: string;
  mobileLineLabel: string;
  footerFbLabel: string;
  footerLineLabel: string;
  footerCopyright: string;
};
