import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const accept = request.headers.get("accept") ?? "";

  // 避免瀏覽器快取 HTML，部署後仍載入舊版 _next 資源而 404
  if (accept.includes("text/html") || request.nextUrl.pathname === "/") {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|media|api|uploads).*)"],
};
