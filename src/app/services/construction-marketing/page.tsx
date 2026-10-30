import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustryLandingPage } from "@/components/industry/IndustryLandingPage";
import { getIndustry } from "@/lib/industries";
import { industryLandingMetadata } from "@/lib/industries/metadata";

export function generateMetadata(): Metadata {
  return industryLandingMetadata(getIndustry("construction"));
}

export default function ConstructionMarketingPage() {
  const industry = getIndustry("construction");
  if (!industry.landing) notFound();
  return <IndustryLandingPage industry={{ ...industry, landing: industry.landing }} />;
}
