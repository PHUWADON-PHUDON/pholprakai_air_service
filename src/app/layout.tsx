import type { Metadata } from "next";
import localFont from "next/font/local";
import { absoluteUrl, BUSINESS_NAME, PRIMARY_DESCRIPTION, SITE_URL } from "@/lib/seo";
import "./globals.css";

const lineFontTh = localFont({
  src: [
    {
      path: "../lib/fonts/line-seed/LINESeedSansTH_W_Th.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../lib/fonts/line-seed/LINESeedSansTH_W_Rg.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../lib/fonts/line-seed/LINESeedSansTH_W_Bd.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--line-font-th",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: BUSINESS_NAME,
  title: {
    default: `${BUSINESS_NAME} | ร้านแอร์ชลบุรี ล้างแอร์ ติดตั้งแอร์ ย้ายแอร์`,
    template: `%s | ${BUSINESS_NAME}`,
  },
  description: PRIMARY_DESCRIPTION,
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: SITE_URL,
    siteName: BUSINESS_NAME,
    title: `${BUSINESS_NAME} | ร้านแอร์ชลบุรี`,
    description: PRIMARY_DESCRIPTION,
    images: [
      {
        url: absoluteUrl("/slide_images/002.png"),
        width: 602,
        height: 268,
        alt: "ผลงานบริการแอร์ของพลประกาย แอร์ เซอร์วิส ชลบุรี",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS_NAME} | ร้านแอร์ชลบุรี`,
    description: PRIMARY_DESCRIPTION,
    images: [absoluteUrl("/slide_images/002.png")],
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${lineFontTh.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col max-w-[1440px] mx-auto"
      >
        {children}
      </body>
    </html>
  );
}
