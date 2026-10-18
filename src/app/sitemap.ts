import type { MetadataRoute } from "next";
import { absoluteUrl, SITE_URL } from "@/lib/seo";
import { SERVICES } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      images: [absoluteUrl("/slide_images/002.png"), absoluteUrl("/activity/1.jpg")],
    },
    ...SERVICES.map((s) => ({
      url: absoluteUrl(`/services/${s.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      images: [absoluteUrl(s.image)],
    })),
    {
      url: absoluteUrl("/btu-calculator"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
