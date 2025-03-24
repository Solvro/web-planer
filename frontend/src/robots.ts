/* eslint-disable import/no-default-export */
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/plans/", "/api/"],
    },
    sitemap: "https://planer.solvro.pl/sitemap.xml",
  };
}
