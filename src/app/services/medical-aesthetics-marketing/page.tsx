import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MedicalAestheticsMarketingPage } from "@/components/sections/MedicalAestheticsMarketingPage";
import { getIndustry } from "@/lib/industries";
import { industryLandingMetadata } from "@/lib/industries/metadata";

export function generateMetadata(): Metadata {
  return industryLandingMetadata(getIndustry("medical-aesthetics"));
}

export default function MedicalAestheticsMarketingRoute() {
  if (!getIndustry("medical-aesthetics").landing) notFound();
  return <MedicalAestheticsMarketingPage />;
}
