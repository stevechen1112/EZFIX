"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateSettings(formData: FormData) {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      companyName: String(formData.get("companyName") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      lineUrl: String(formData.get("lineUrl") || "").trim(),
      address: String(formData.get("address") || "").trim(),
      businessHours: String(formData.get("businessHours") || "").trim(),
      facebookUrl: String(formData.get("facebookUrl") || "").trim(),
      instagramUrl: String(formData.get("instagramUrl") || "").trim(),
      seoTitle: String(formData.get("seoTitle") || "").trim(),
      seoDesc: String(formData.get("seoDesc") || "").trim(),
      ogImage: String(formData.get("ogImage") || "").trim(),
      heroBadge: String(formData.get("heroBadge") || "").trim(),
      heroSubtitle: String(formData.get("heroSubtitle") || "").trim(),
      servicesTitle: String(formData.get("servicesTitle") || "").trim(),
      areaTitle: String(formData.get("areaTitle") || "").trim(),
      areaMapImage: String(formData.get("areaMapImage") || "").trim(),
      areaCtaLabel: String(formData.get("areaCtaLabel") || "").trim(),
      reviewsTitle: String(formData.get("reviewsTitle") || "").trim(),
      reviewsSubtitle: String(formData.get("reviewsSubtitle") || "").trim(),
      contactTitle: String(formData.get("contactTitle") || "").trim(),
      contactPhoneLabel: String(formData.get("contactPhoneLabel") || "").trim(),
      contactCtaLabel: String(formData.get("contactCtaLabel") || "").trim(),
      contactDescription: String(formData.get("contactDescription") || "").trim(),
      floatingPhoneLabel: String(formData.get("floatingPhoneLabel") || "").trim(),
      floatingLineLabel: String(formData.get("floatingLineLabel") || "").trim(),
      mobilePhoneLabel: String(formData.get("mobilePhoneLabel") || "").trim(),
      mobileLineLabel: String(formData.get("mobileLineLabel") || "").trim(),
      footerFbLabel: String(formData.get("footerFbLabel") || "").trim(),
      footerLineLabel: String(formData.get("footerLineLabel") || "").trim(),
      footerCopyright: String(formData.get("footerCopyright") || "").trim(),
    },
    create: { id: 1 },
  });
  revalidatePath("/");
  revalidatePath("/admin/settings");
}
