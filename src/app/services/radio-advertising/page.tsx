import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { RadioAdvertisingPage as RadioAdvertisingView } from "@/components/sections/radio/RadioAdvertisingPage";
import { getRadioArticles } from "@/lib/wordpress/radio-articles";
import { getRadioAdvertisingContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/radio-advertising/");
}

export default async function RadioAdvertisingPage() {
  const [content, articles] = await Promise.all([
    getRadioAdvertisingContent(),
    getRadioArticles().catch(() => ({ guide: null, mediaBuying: null })),
  ]);
  return <RadioAdvertisingView content={content} articles={articles} />;
}
