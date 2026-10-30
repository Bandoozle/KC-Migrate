import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { DentalMarketingPage as DentalMarketingView } from "@/components/sections/DentalMarketingPage";
import { getDentalMarketingContent } from "@/lib/wordpress/marketing-program";


// Renamed to Medical & Dental Marketing; the URL, canonical and image stay as captured from Rank Math
const TITLE = "Medical & Dental Marketing To Grow Your Practice | Kosick Communications";
const DESCRIPTION =
  "Medical and dental marketing to fill your schedule and grow your practice. Kosick attracts new patients and builds loyalty for Canadian clinics. Book a free strategy call.";

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await rankMathMetadata("/services/dental-marketing/");
  return {
    ...metadata,
    title: { absolute: TITLE },
    description: DESCRIPTION,
    openGraph: { ...metadata.openGraph, title: TITLE, description: DESCRIPTION },
  };
}

export default async function DentalMarketingPage() {
  const content = await getDentalMarketingContent();
  return <DentalMarketingView content={content} />;
}
