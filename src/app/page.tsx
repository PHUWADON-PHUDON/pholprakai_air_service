import type { Metadata } from "next";
import Home from "./Home";
import type { CatalogFilters, CatalogPage } from "@/features/air/service";
import { getCatalogFiltersData, getCatalogPageData } from "@/lib/catalog";
import {
  absoluteUrl,
  BUSINESS_NAME,
  EMAIL,
  LINE_ID,
  PHONE_DISPLAY,
  PHONE_E164,
  PRIMARY_DESCRIPTION,
  SERVICE_AREAS,
  SITE_URL,
} from "@/lib/seo";

const pageTitle = `ร้านแอร์ชลบุรี | ${BUSINESS_NAME} ล้างแอร์ ติดตั้งแอร์ ย้ายแอร์ ซ่อมแอร์`;
const socialImage = absoluteUrl("/slide_images/002.png");

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description: PRIMARY_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: SITE_URL,
    siteName: BUSINESS_NAME,
    title: pageTitle,
    description: PRIMARY_DESCRIPTION,
    images: [{
      url: socialImage,
      width: 602,
      height: 268,
      alt: "เครื่องปรับอากาศที่มีจำหน่ายโดยพลประกาย แอร์ เซอร์วิส",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: PRIMARY_DESCRIPTION,
    images: [socialImage],
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

export default async function page() {
  const [catalogResult, filtersResult] = await Promise.allSettled([
    getCatalogPageData({ brandId: "", systemId: "", btu: "", sort: "price-asc", page: 1, limit: 8 }),
    getCatalogFiltersData(),
  ]);
  const initialCatalog: CatalogPage | undefined = catalogResult.status === "fulfilled" ? catalogResult.value : undefined;
  const initialFilters: CatalogFilters | undefined = filtersResult.status === "fulfilled" ? filtersResult.value : undefined;

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    "@id": `${SITE_URL}/#local-business`,
    name: BUSINESS_NAME,
    url: SITE_URL,
    image: absoluteUrl("/activity/1.jpg"),
    logo: absoluteUrl("/android-chrome-512x512.png"),
    description: PRIMARY_DESCRIPTION,
    telephone: PHONE_E164,
    email: EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "เมืองชลบุรี",
      addressRegion: "ชลบุรี",
      addressCountry: "TH",
    },
    areaServed: SERVICE_AREAS.map((name) => ({
      "@type": "Place",
      name,
    })),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: PHONE_E164,
        contactType: "customer service",
        areaServed: "ชลบุรี",
        availableLanguage: ["th"],
      },
      {
        "@type": "ContactPoint",
        name: `LINE ${LINE_ID}`,
        telephone: PHONE_DISPLAY,
        url: `https://line.me/R/ti/p/${LINE_ID}`,
        contactType: "customer service",
        areaServed: "ชลบุรี",
        availableLanguage: ["th"],
      },
    ],
    sameAs: [
      "https://www.facebook.com/profile.php?id=61588541855926&locale=th_TH",
      "https://www.tiktok.com/@tumair_chonburi",
    ],
    makesOffer: [
      "ติดตั้งแอร์ใหม่",
      "ล้างแอร์",
      "ย้ายแอร์",
      "ซ่อมแอร์",
      "ตรวจเช็คระบบน้ำยา",
      "วิเคราะห์อาการเสีย",
    ].map((name) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name,
        areaServed: "ชลบุรี",
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd).replace(/</g, "\\u003c") }}
      />
      <Home initialCatalog={initialCatalog} initialFilters={initialFilters} />
    </>
  );
}
