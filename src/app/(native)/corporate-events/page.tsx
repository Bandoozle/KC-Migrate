import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { CorporateEventsPageView } from "@/components/sections/CorporateEventsPageView";
import { getCorporateEventsContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/corporate-events/");
}

export default async function CorporateEventsPage() {
  const content = await getCorporateEventsContent();
  return <CorporateEventsPageView content={content} />;
}
