import type { MetadataRoute } from "next";
import { listIndexableUrls } from "@/lib/seo/rank-math";

export const revalidate = 3600;

/** Canonical indexable URLs only. KML and sitemap files stay out of this list. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls = await listIndexableUrls();
  return urls.map((url) => ({ url }));
}
