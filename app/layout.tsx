import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "恆惠修理紗窗｜台中專業紗窗維修訂製",
    template: "%s | 恆惠修理紗窗",
  },
  description:
    "台中在地專業紗窗修理、折疊式紗窗訂製、鋁門窗維修、防霾網安裝服務。預約準時到場、價格透明。",
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: "恆惠修理紗窗",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
