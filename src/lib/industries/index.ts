import { CONSTRUCTION } from "./construction";
import { DENTAL } from "./dental";
import { GOLF } from "./golf";
import { HVAC } from "./hvac";
import { MEDICAL_AESTHETICS } from "./medical-aesthetics";
import { INDUSTRY_LINKS } from "./nav";
import { RETAIL } from "./retail";
import { SPECIALTY_RETAIL } from "./specialty-retail";
import { TRAVEL } from "./travel";
import type { Industry, IndustryId, IndustryService } from "./types";

export type {
  Application,
  ApplicationIcon,
  Benefit,
  BenefitVisual,
  Industry,
  IndustryId,
  IndustryImage,
  IndustryLanding,
  IndustryService,
} from "./types";

/** Navigation order. */
export const INDUSTRIES: readonly Industry[] = [
  HVAC,
  DENTAL,
  MEDICAL_AESTHETICS,
  GOLF,
  RETAIL,
  SPECIALTY_RETAIL,
  CONSTRUCTION,
  TRAVEL,
];

// The header reads the lighter nav.ts list; fail the build if it drifts from the registry
{
  const drift = INDUSTRIES.map((industry, index) => {
    const link = INDUSTRY_LINKS[index];
    if (link?.href === industry.path && link?.label === industry.name) return null;
    return `${index}: registry ${industry.name} (${industry.path}) vs nav ${link?.label ?? "missing"} (${link?.href ?? "missing"})`;
  }).filter(Boolean);
  if (INDUSTRY_LINKS.length !== INDUSTRIES.length || drift.length > 0) {
    throw new Error(
      `src/lib/industries/nav.ts does not match the industry registry (links ${INDUSTRY_LINKS.length}, industries ${INDUSTRIES.length}${drift.length ? `; ${drift.join("; ")}` : ""})`,
    );
  }
}

export function getIndustry(id: IndustryId): Industry {
  const industry = INDUSTRIES.find((entry) => entry.id === id);
  if (!industry) throw new Error(`Unknown industry: ${id}`);
  return industry;
}

export function servicePath(industry: Industry, service: IndustryService): string {
  return `${industry.path}${service.slug}/`;
}

export function findService(id: IndustryId, slug: string): { industry: Industry; service: IndustryService } | null {
  const industry = getIndustry(id);
  const service = industry.services.find((entry) => entry.slug === slug);
  return service ? { industry, service } : null;
}

/** `generateStaticParams` for an industry's `[service]` route. */
export function serviceParams(id: IndustryId): Array<{ service: string }> {
  return getIndustry(id).services.map((service) => ({ service: service.slug }));
}

/**
 * Indexable pages added for industry marketing: the main pages that are not
 * WordPress pages, and every service subpage.
 */
export const INDUSTRY_PAGE_PATHS: readonly string[] = INDUSTRIES.flatMap((industry) => [
  ...(industry.landing ? [industry.path] : []),
  ...industry.services.map((service) => servicePath(industry, service)),
]);
