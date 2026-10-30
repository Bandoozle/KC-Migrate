import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustryServicePage } from "@/components/industry/IndustryServicePage";
import { findService, serviceParams } from "@/lib/industries";
import { industryServiceMetadata } from "@/lib/industries/metadata";

type Props = { params: Promise<{ service: string }> };

/* Only the services listed in src/lib/industries; anything else is a 404 */
export const dynamicParams = false;

export function generateStaticParams() {
  return serviceParams("travel");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const match = findService("travel", (await params).service);
  return match ? industryServiceMetadata(match.industry, match.service) : {};
}

export default async function TravelServicePage({ params }: Props) {
  const match = findService("travel", (await params).service);
  if (!match) notFound();
  return <IndustryServicePage industry={match.industry} service={match.service} />;
}
