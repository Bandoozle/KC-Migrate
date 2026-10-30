import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustryLandingPage } from "@/components/industry/IndustryLandingPage";
import { getIndustry } from "@/lib/industries";
import { industryLandingMetadata } from "@/lib/industries/metadata";

export function generateMetadata(): Metadata {
  return industryLandingMetadata(getIndustry("travel"));
}

export default function TravelMarketingPage() {
  const industry = getIndustry("travel");
  if (!industry.landing) notFound();
  return <IndustryLandingPage industry={{ ...industry, landing: industry.landing }} />;
}
