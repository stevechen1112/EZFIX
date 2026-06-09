"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const VALID_ROLES = ["admin", "editor"] as const;

export async function createUser(formData: FormData) {
  const me = await getCurrentUser();
  if (!me || me.role !== "admin") {
    redirect("/admin/users?error=" + encodeURIComponent("只有 admin 可以新增管理員"));
  }

  const username = String(formData.get("username") || "").trim().toLowerCase();
  const name = String(formData.get("name") || "").trim();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "admin");

  if (!username || username.length < 3) {
    redirect("/admin/users/new?error=" + encodeURIComponent("帳號至少 3 個字元"));
  }
  if (!/^[a-z0-9_-]+$/.test(username)) {
    redirect("/admin/users/new?error=" + encodeURIComponent("帳號只能含小寫英文、數字、底線、連字號"));
  }
  if (!name) {
    redirect("/admin/users/new?error=" + encodeURIComponent("請輸入顯示名稱"));
  }
  if (password.length < 8) {
    redirect("/admin/users/new?error=" + encodeURIComponent("密碼至少 8 個字元"));
  }
  if (!VALID_ROLES.includes(role as typeof VALID_ROLES[number])) {
    redirect("/admin/users/new?error=" + encodeURIComponent("角色不正確"));
  }

  // 檢查 username 唯一
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    redirect("/admin/users/new?error=" + encodeURIComponent("此帳號已存在"));
  }

  const hash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { username, password: hash, name, role },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users?success=" + encodeURIComponent("已新增管理員"));
}

export async function updateUser(id: number, formData: FormData) {
  const me = await getCurrentUser();
  if (!me || me.role !== "admin") {
    redirect("/admin/users?error=" + encodeURIComponent("只有 admin 可以編輯管理員"));
  }

  const name = String(formData.get("name") || "").trim();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "admin");

  if (!name) {
    redirect(`/admin/users/${id}?error=` + encodeURIComponent("請輸入顯示名稱"));
  }
  if (!VALID_ROLES.includes(role as typeof VALID_ROLES[number])) {
    redirect(`/admin/users/${id}?error=` + encodeURIComponent("角色不正確"));
  }

  // 不能把自己降級成 editor（避免鎖死管理功能）
  if (id === me.id && role !== "admin") {
    redirect(`/admin/users/${id}?error=` + encodeURIComponent("不能把自己降級為非管理員"));
  }

  const data: { name: string; role: string; password?: string } = { name, role };
  if (password) {
    if (password.length < 8) {
      redirect(`/admin/users/${id}?error=` + encodeURIComponent("新密碼至少 8 個字元"));
    }
    data.password = await bcrypt.hash(password, 10);
  }

  await prisma.user.update({ where: { id }, data });
  revalidatePath("/admin/users");
  redirect("/admin/users?success=" + encodeURIComponent("已更新管理員"));
}

export async function deleteUser(id: number) {
  const me = await getCurrentUser();
  if (!me || me.role !== "admin") {
    redirect("/admin/users?error=" + encodeURIComponent("只有 admin 可以刪除管理員"));
  }

  // 不能刪除自己
  if (id === me.id) {
    redirect("/admin/users?error=" + encodeURIComponent("不能刪除自己"));
  }

  // 不能刪除最後一個 admin
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) {
    redirect("/admin/users?error=" + encodeURIComponent("管理員不存在"));
  }
  if (target.role === "admin") {
    const adminCount = await prisma.user.count({ where: { role: "admin" } });
    if (adminCount <= 1) {
      redirect("/admin/users?error=" + encodeURIComponent("系統至少要保留一個 admin"));
    }
  }

  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
  redirect("/admin/users?success=" + encodeURIComponent("已刪除管理員"));
}
