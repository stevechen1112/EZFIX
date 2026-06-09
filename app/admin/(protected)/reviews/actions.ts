"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createReview(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const content = String(formData.get("content") || "").trim();
  if (!name || !content) redirect("/admin/reviews/new?error=missing");

  await prisma.review.create({
    data: {
      name,
      content,
      rating: Math.min(5, Math.max(1, Number(formData.get("rating") || 5))),
      avatar: String(formData.get("avatar") || ""),
      order: Number(formData.get("order") || 0),
      isActive: formData.get("isActive") === "on",
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/reviews");
  redirect("/admin/reviews");
}

export async function updateReview(id: number, formData: FormData) {
  await prisma.review.update({
    where: { id },
    data: {
      name: String(formData.get("name") || "").trim(),
      content: String(formData.get("content") || "").trim(),
      rating: Math.min(5, Math.max(1, Number(formData.get("rating") || 5))),
      avatar: String(formData.get("avatar") || ""),
      order: Number(formData.get("order") || 0),
      isActive: formData.get("isActive") === "on",
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/reviews");
  redirect("/admin/reviews");
}

export async function deleteReview(id: number) {
  await prisma.review.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/reviews");
}

export async function toggleReviewActive(id: number, isActive: boolean) {
  await prisma.review.update({ where: { id }, data: { isActive } });
  revalidatePath("/");
  revalidatePath("/admin/reviews");
}
