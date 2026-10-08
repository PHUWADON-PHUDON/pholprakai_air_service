import type { Metadata } from "next";
import localFont from "next/font/local";
import { BUSINESS_NAME, SITE_URL } from "@/lib/seo";
import Providers from "./providers";
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
    default: `=ช่างแอร์ชลบุรี | ${BUSINESS_NAME} ล้างแอร์ ติดตั้งแอร์ ย้ายแอร์ ซ่อมแอร์ ตรวจเช็คระบบน้ำยา วิเคราะห์อาการเสีย และอื่นๆ... | ร้านแอร์ชลบุรี`,
    template: `%s | ${BUSINESS_NAME}`,
  },
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
