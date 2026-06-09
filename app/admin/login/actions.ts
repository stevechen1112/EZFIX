"use server";

import { redirect } from "next/navigation";
import { login } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    redirect("/admin/login?error=1");
  }

  const user = await login(username, password);
  if (!user) {
    redirect("/admin/login?error=1");
  }

  redirect("/admin/dashboard");
}
