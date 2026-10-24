import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { DigitalVideoAdvertisingPage as DigitalVideoView } from "@/components/sections/digital-video/DigitalVideoAdvertisingPage";
import { getDigitalConnectedTvContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/digital-connected-tv/");
}

export default async function DigitalConnectedTvPage() {
  const content = await getDigitalConnectedTvContent();
  return <DigitalVideoView content={content} />;
}
