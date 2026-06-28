import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, boolean | string> = {
    ok: true,
    timestamp: new Date().toISOString(),
    gaConfigured: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
    contentflowConfigured: Boolean(process.env.CONTENTFLOW_SECRET),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch {
    checks.database = false;
    checks.ok = false;
  }

  if (!checks.gaConfigured || !checks.contentflowConfigured) {
    checks.ok = false;
  }

  return NextResponse.json(checks, { status: checks.ok ? 200 : 503 });
}
