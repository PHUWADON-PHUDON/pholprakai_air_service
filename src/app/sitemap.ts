import type { MetadataRoute } from "next";
import { absoluteUrl, SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [
        absoluteUrl("/slide_images/002.png"),
        absoluteUrl("/person.png"),
        absoluteUrl("/person2.png"),
      ],
    },
  ];
}
