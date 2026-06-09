/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // 301 重定向（供 ContentFlow Content Refresh 使用）
  async redirects() {
    // 可從資料庫讀取 redirects 動態配置
    // 目前先回傳空陣列，未來可擴充
    return [];
  },
};

export default nextConfig;
