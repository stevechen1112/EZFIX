"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createArea(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  if (!name) return;
  const max = await prisma.serviceArea.aggregate({ _max: { order: true } });
  await prisma.serviceArea.create({
    data: { name, order: (max._max.order || 0) + 1 },
  });
  revalidatePath("/");
  revalidatePath("/admin/areas");
}

export async function deleteArea(id: number) {
  await prisma.serviceArea.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/areas");
}
