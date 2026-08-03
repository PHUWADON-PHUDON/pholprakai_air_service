import Home from "./Home";
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

export default function page() {
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    "@id": `${SITE_URL}/#local-business`,
    name: BUSINESS_NAME,
    url: SITE_URL,
    image: absoluteUrl("/slide_images/002.png"),
    logo: absoluteUrl("/android-chrome-512x512.png"),
    description: PRIMARY_DESCRIPTION,
    telephone: PHONE_E164,
    email: EMAIL,
    priceRange: "$$",
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
        areaServed: "TH",
        availableLanguage: ["th"],
      },
      {
        "@type": "ContactPoint",
        name: `LINE ${LINE_ID}`,
        telephone: PHONE_DISPLAY,
        contactType: "customer service",
        areaServed: "TH",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <Home/>
    </>
  );
}
