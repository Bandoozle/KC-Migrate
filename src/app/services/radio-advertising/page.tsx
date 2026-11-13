import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { RadioAdvertisingPage as RadioAdvertisingView } from "@/components/sections/radio/RadioAdvertisingPage";
import { getRadioArticles } from "@/lib/wordpress/radio-articles";
import { getRadioAdvertisingContent } from "@/lib/wordpress/service-page";

const TITLE = "Radio Advertising in Canada | Kosick Communications";
const DESCRIPTION =
  "Kosick plans and buys AM, FM and streaming audio campaigns in Toronto, Calgary, Vancouver and across Canada, with in-house creative and clear reporting.";

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await rankMathMetadata("/services/radio-advertising/");
  return {
    ...metadata,
    title: { absolute: TITLE },
    description: DESCRIPTION,
    openGraph: { ...metadata.openGraph, title: TITLE, description: DESCRIPTION },  };
}

export default async function RadioAdvertisingPage() {
  const [content, articles] = await Promise.all([
    getRadioAdvertisingContent(),
    getRadioArticles().catch(() => ({ guide: null, mediaBuying: null })),
  ]);
  return <RadioAdvertisingView content={content} articles={articles} />;
}
