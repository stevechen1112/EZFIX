import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { resolveSiteBaseUrl } from "@/lib/site-url";

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const siteUrl = resolveSiteBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "恆惠修理紗窗｜台中專業紗窗維修訂製",
    template: "%s | 恆惠修理紗窗",
  },
  description:
    "台中在地專業紗窗修理、折疊式紗窗訂製、鋁門窗維修、防霾網安裝服務。預約準時到場、價格透明。",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: siteUrl,
    siteName: "恆惠修理紗窗",
    title: "恆惠修理紗窗｜台中專業紗窗維修訂製",
    description:
      "台中在地專業紗窗修理、折疊式紗窗訂製、鋁門窗維修、防霾網安裝服務。預約準時到場、價格透明。",
    images: [
      {
        url: "/media/og/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "恆惠修理紗窗｜台中專業紗窗維修訂製",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "恆惠修理紗窗｜台中專業紗窗維修訂製",
    description:
      "台中在地專業紗窗修理、折疊式紗窗訂製、鋁門窗維修、防霾網安裝服務。",
    images: ["/media/og/og-default.jpg"],
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
      <body className="antialiased">
        {gaId ? <GoogleAnalytics measurementId={gaId} /> : null}
        {children}
      </body>
    </html>
  );
}
