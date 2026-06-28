/** Canonical public site URL for sitemap, robots, and metadata. */
export function resolveSiteBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (configured && !/localhost|127\.0\.0\.1/i.test(configured)) {
    return configured;
  }
  return "https://ezfix.com.tw";
}

/** Encode path segments for sitemap <loc> (non-ASCII slugs). */
export function buildPublicUrl(baseUrl: string, pathname: string): string {
  const base = baseUrl.replace(/\/$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const encoded = path
    .split("/")
    .map((segment) => (segment ? encodeURIComponent(segment) : ""))
    .join("/");
  return `${base}${encoded}`;
}
