"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function parseFeatures(input: FormDataEntryValue | null): string {
  const raw = String(input || "").trim();
  if (!raw) return "[]";
  const arr = raw
    .split("\n")
    .map((s) => s.replace(/^[\s>➤•\-•]+/, "").trim())
    .filter(Boolean);
  return JSON.stringify(arr);
}

export async function createService(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  if (!title || !description) {
    redirect("/admin/services/new?error=missing");
  }
  await prisma.service.create({
    data: {
      title,
      description,
      features: parseFeatures(formData.get("features")),
      icon: String(formData.get("icon") || "wrench"),
      image: String(formData.get("image") || ""),
      order: Number(formData.get("order") || 0),
      isActive: formData.get("isActive") === "on",
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function updateService(id: number, formData: FormData) {
  await prisma.service.update({
    where: { id },
    data: {
      title: String(formData.get("title") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      features: parseFeatures(formData.get("features")),
      icon: String(formData.get("icon") || "wrench"),
      image: String(formData.get("image") || ""),
      order: Number(formData.get("order") || 0),
      isActive: formData.get("isActive") === "on",
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function deleteService(id: number) {
  await prisma.service.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/services");
}

export async function toggleServiceActive(id: number, isActive: boolean) {
  await prisma.service.update({ where: { id }, data: { isActive } });
  revalidatePath("/");
  revalidatePath("/admin/services");
}
