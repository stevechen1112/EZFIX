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
    return [
      // 舊快取頁面可能仍引用 /uploads/，永久轉到 /media/
      {
        source: "/uploads/:path*",
        destination: "/media/:path*",
        permanent: true,
      },
      {
        source: "/favicon.ico",
        destination: "/icon.png",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
