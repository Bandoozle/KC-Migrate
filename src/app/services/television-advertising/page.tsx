import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { TelevisionAdvertisingPage } from "@/components/sections/television/TelevisionAdvertisingPage";
import { getTelevisionAdvertisingContent } from "@/lib/wordpress/service-page";

export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/television-advertising/");
}

export default async function Page() {
  const content = await getTelevisionAdvertisingContent();
  return <TelevisionAdvertisingPage content={content} />;
}
