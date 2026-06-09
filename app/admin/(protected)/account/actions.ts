"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function changePassword(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  // 驗證
  if (!currentPassword || !newPassword || !confirmPassword) {
    redirect("/admin/account?error=" + encodeURIComponent("請填寫所有欄位"));
  }
  if (newPassword.length < 8) {
    redirect("/admin/account?error=" + encodeURIComponent("新密碼至少需要 8 個字元"));
  }
  if (newPassword !== confirmPassword) {
    redirect("/admin/account?error=" + encodeURIComponent("新密碼與確認密碼不一致"));
  }
  if (newPassword === currentPassword) {
    redirect("/admin/account?error=" + encodeURIComponent("新密碼不能與目前密碼相同"));
  }

  // 從 DB 取完整 user（含密碼 hash）
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) redirect("/admin/login");

  // 驗證舊密碼
  const ok = await bcrypt.compare(currentPassword, dbUser.password);
  if (!ok) {
    redirect("/admin/account?error=" + encodeURIComponent("目前密碼不正確"));
  }

  // 更新密碼
  const newHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: newHash },
  });

  revalidatePath("/admin/account");
  redirect("/admin/account?success=1");
}
