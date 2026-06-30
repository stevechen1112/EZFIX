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
      // ---- 舊 WordPress URL 301 轉址（消除 GSC 404）----
      // WP 首頁 → 新站首頁
      {
        source: "/index.php",
        destination: "/",
        permanent: true,
      },
      // WP wp-content/uploads → /media/
      {
        source: "/wp-content/uploads/:path*",
        destination: "/media/:path*",
        permanent: true,
      },
      // WP wp-admin / wp-login → 首頁（避免被爬蟲當 404）
      {
        source: "/wp-admin/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wp-login.php",
        destination: "/",
        permanent: true,
      },
      // WP feed / xmlrpc → 首頁
      {
        source: "/feed",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/xmlrpc.php",
        destination: "/",
        permanent: true,
      },
      // WP 分類與標籤路由 → /blog
      {
        source: "/category/:path*",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/tag/:path*",
        destination: "/blog",
        permanent: true,
      },
      // WP 作者路由 → /blog
      {
        source: "/author/:path*",
        destination: "/blog",
        permanent: true,
      },
      // WP page 路由 → /blog
      {
        source: "/page/:path*",
        destination: "/blog",
        permanent: true,
      },
      // WP ?p= 參數式 URL → 首頁（Next.js 支援 query matching）
      {
        source: "/",
        has: [{ type: "query", key: "p" }],
        destination: "/blog",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
