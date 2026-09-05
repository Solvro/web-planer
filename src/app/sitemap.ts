import type { MetadataRoute } from "next";

import { SITE_ORIGIN } from "@/lib/site";

const LAST_CONTENT_CHANGE = new Date("2026-09-05");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_ORIGIN,
      lastModified: LAST_CONTENT_CHANGE,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_ORIGIN}/plans`,
      lastModified: LAST_CONTENT_CHANGE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_ORIGIN}/login`,
      lastModified: LAST_CONTENT_CHANGE,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
