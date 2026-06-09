"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createHero(formData: FormData) {
  await prisma.heroSlide.create({
    data: {
      image: String(formData.get("image") || ""),
      title: String(formData.get("title") || ""),
      subtitle: String(formData.get("subtitle") || ""),
      ctaLabel: String(formData.get("ctaLabel") || "立即諮詢"),
      ctaHref: String(formData.get("ctaHref") || "tel:0938989579"),
      order: Number(formData.get("order") || 0),
      isActive: formData.get("isActive") === "on",
    },
  });
  revalidatePath("/");
  redirect("/admin/hero");
}

export async function updateHero(id: number, formData: FormData) {
  await prisma.heroSlide.update({
    where: { id },
    data: {
      image: String(formData.get("image") || ""),
      title: String(formData.get("title") || ""),
      subtitle: String(formData.get("subtitle") || ""),
      ctaLabel: String(formData.get("ctaLabel") || ""),
      ctaHref: String(formData.get("ctaHref") || ""),
      order: Number(formData.get("order") || 0),
      isActive: formData.get("isActive") === "on",
    },
  });
  revalidatePath("/");
  redirect("/admin/hero");
}

export async function deleteHero(id: number) {
  await prisma.heroSlide.delete({ where: { id } });
  revalidatePath("/");
}

export async function toggleHeroActive(id: number, isActive: boolean) {
  await prisma.heroSlide.update({ where: { id }, data: { isActive } });
  revalidatePath("/");
}
