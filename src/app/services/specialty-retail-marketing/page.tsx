import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustryLandingPage } from "@/components/industry/IndustryLandingPage";
import { getIndustry } from "@/lib/industries";
import { industryLandingMetadata } from "@/lib/industries/metadata";

export function generateMetadata(): Metadata {
  return industryLandingMetadata(getIndustry("specialty-retail"));
}

export default function SpecialtyRetailMarketingPage() {
  const industry = getIndustry("specialty-retail");
  if (!industry.landing) notFound();
  return <IndustryLandingPage industry={{ ...industry, landing: industry.landing }} />;
}
