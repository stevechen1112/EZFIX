"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function updateSettings(formData: FormData) {
  try {
    const existing = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    const apiKeyInput = String(formData.get("apiKey") || "").trim();
    let apiKey = existing?.apiKey || "";

    if (apiKeyInput) {
      apiKey = apiKeyInput;
    } else if (!apiKey) {
      apiKey = randomBytes(32).toString("hex");
    }

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
        apiBaseUrl: String(formData.get("apiBaseUrl") || "").trim(),
        apiKey,
        apiPublishMode: String(formData.get("apiPublishMode") || "draft").trim(),
      },
      create: { id: 1, apiKey, apiPublishMode: "draft" },
    });
    revalidatePath("/");
    revalidatePath("/admin/settings");
  } catch (err) {
    const message = err instanceof Error ? err.message : "儲存失敗，請稍後再試";
    redirect("/admin/settings?error=" + encodeURIComponent(message));
  }

  redirect("/admin/settings?success=" + encodeURIComponent("設定已儲存"));
}
