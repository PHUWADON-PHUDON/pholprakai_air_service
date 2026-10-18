import type { MetadataRoute } from "next";
import { absoluteUrl, SITE_URL } from "@/lib/seo";
import { SERVICES } from "@/lib/services";
import { lastmodOf } from "@/lib/lastmod";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(lastmodOf("/")),
      changeFrequency: "weekly",
      priority: 1,
      images: [absoluteUrl("/slide_images/002.png"), absoluteUrl("/activity/1.jpg")],
    },
    ...SERVICES.map((s) => ({
      url: absoluteUrl(`/services/${s.slug}`),
      lastModified: new Date(lastmodOf(`/services/${s.slug}`)),
      changeFrequency: "monthly" as const,
      priority: 0.9,
      images: [absoluteUrl(s.image)],
    })),
    {
      url: absoluteUrl("/btu-calculator"),
      lastModified: new Date(lastmodOf("/btu-calculator")),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
