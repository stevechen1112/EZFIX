/** 圖片公開 URL 前綴（經 Caddy 轉發時 /uploads 會被攔截，改用 /media） */
export const MEDIA_URL_PREFIX = "/media";

/** 將 uploads 相對路徑轉為前台可用的 URL，例如 hero/hero-1.jpg → /media/hero/hero-1.jpg */
export function toMediaUrl(relativePath: string): string {
  const clean = relativePath.replace(/^\/+/, "").replace(/^uploads\//, "");
  return `${MEDIA_URL_PREFIX}/${clean}`;
}

/** 將資料庫或 API 中的 URL 正規化為 /media/...（相容舊的 /uploads/...） */
export function normalizeMediaUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith(`${MEDIA_URL_PREFIX}/`)) return url;
  if (url.startsWith("/uploads/")) return `${MEDIA_URL_PREFIX}${url.slice("/uploads".length)}`;
  return url;
}
