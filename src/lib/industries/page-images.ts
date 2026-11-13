import type { IndustryId } from "./types";

/**
 * Photographs each industry main page already shows outside its service cards
 * (hero, journey, intro, reasons and case sections). The cards skip these so the
 * same photograph does not appear twice on one page (Bretton’s audit, Nov 2026).
 * Captured from the rendered pages; update it when a page’s photography changes.
 */
export const PAGE_IMAGES_OUTSIDE_OFFERS: Partial<Record<IndustryId, readonly string[]>> = {
  "medical-aesthetics": [
    "/images/industries/medical-aesthetics/clinic-interior.jpg",
    "/images/industries/medical-aesthetics/consultation-mirror.jpg",
    "/images/industries/medical-aesthetics/facial-assessment.jpg",
    "/images/industries/medical-aesthetics/hydrate-iv-consultation.jpg",
    "/images/industries/medical-aesthetics/lip-treatment.jpg",
    "/images/industries/medical-aesthetics/skinfolio-transit-shelter.jpg",
    "/images/industries/medical-aesthetics/treatment-lounge.jpg",
    "/wp-content/uploads/2022/01/medical-aesthetics.webp",
    "/wp-content/uploads/2023/09/medical-aesthetics.png",
    "/wp-content/uploads/2026/02/aesthetic-clinic-marketing.jpg",
    "/wp-content/uploads/2026/02/medical-skincare-marketing.jpg",
  ],
  "retail": [
    "/wp-content/uploads/2023/06/packaging.jpg",
    "/wp-content/uploads/2023/06/product-packaging.jpg",
    "/wp-content/uploads/2025/07/mobile-marketing.webp",
    "/wp-content/uploads/2025/11/black-friday-advertising.jpg",
    "/wp-content/uploads/2026/06/arcteryx-billboard-advertising.jpg",
    "/wp-content/uploads/2026/06/billboard-2.jpg",
    "/wp-content/uploads/2026/06/social-media-advertising.jpg",
  ],
  "specialty-retail": [
    "/images/industries/specialty-retail/garden-centre-greenhouse.jpg",
    "/images/industries/specialty-retail/garden-centre-hanging-baskets.jpg",
    "/wp-content/uploads/2023/06/hearth-advertising.jpg",
    "/wp-content/uploads/2025/10/website-development.jpg",
    "/wp-content/uploads/2026/08/Social-Media.jpg",
  ],
  "travel": [
    "/images/industries/travel/cabo-coastline-aerial.jpg",
    "/wp-content/uploads/2022/01/Motor-Court.webp",
    "/wp-content/uploads/2026/02/resort-marketing.jpg",
    "/wp-content/uploads/2026/06/social-media-marketing-2.jpg",
    "/wp-content/uploads/2026/06/social-media-marketing.jpg",
    "/images/television/prime-video.jpg",
  ],
  "construction": [
    "/wp-content/uploads/2023/06/real-estate-design-1.jpg",
    "/wp-content/uploads/2023/06/services.jpg",
    "/wp-content/uploads/2023/09/construction-marketing.png",
    "/wp-content/uploads/2024/03/padwood-construction.webp",
    "/wp-content/uploads/2026/02/home-services-marketing.jpg",
  ],
  "dental": [
    "/images/industries/dental/front-desk.jpg",
    "/images/industries/dental/reception-check-in.jpg",
    "/images/website-projects/sparkle-dental-spa-desktop.jpg",
    "/images/website-projects/sparkle-dental-spa-mobile.jpg",
    "/wp-content/uploads/2026/06/dental-clinic-branding.jpg",
    "/wp-content/uploads/2026/06/outdoor-advertising.jpg",
    "/wp-content/uploads/2026/07/Dental-Lead-Generation.jpg",
    "/wp-content/uploads/2026/07/Dental-Marketing.jpg",
    "/wp-content/uploads/2026/07/Dental-Vancouver.jpg",
    "/wp-content/uploads/2026/07/Dental-Web-Development.jpg",
    "/wp-content/uploads/2026/07/Social-Media-Dental.jpg",
    "/wp-content/uploads/2026/07/Vancouver-Dental-Marketing.jpg",
  ],
  "golf": [
    "/images/golf-sportsnet-poster.jpg",
    "/wp-content/uploads/2024/05/golf-event.webp",
    "/wp-content/uploads/2026/02/arizona-golf-course-marketing.jpg",
    "/wp-content/uploads/2026/04/canadian-golf-course-marketing.jpg",
    "/wp-content/uploads/2026/06/golf-course-branding-marketing.jpg",
    "/wp-content/uploads/2026/06/golf-course-marketing-food-beverage.jpg",
    "/wp-content/uploads/2026/06/golf-social-media-marketing.jpg",
  ],
  "hvac": [
    "/images/hvac-marketing/feature-lead-generation.jpg",
    "/images/hvac-marketing/feature-strategies.jpg",
    "/images/hvac-marketing/tab-facebook.jpg",
    "/images/hvac-marketing/tab-youtube.jpg",
    "/images/hvac-marketing/video-poster.jpg",
    "/wp-content/uploads/2023/07/billboards-scaled.png",
    "/wp-content/uploads/2026/02/hvac-digital-marketing.webp",
    "/wp-content/uploads/2026/03/hvac-marketing.jpg",
    "/wp-content/uploads/2026/06/hvac-billboard-advertising.jpg",
    "/wp-content/uploads/2026/07/HVAC-Lead-Generation-Vancouver.jpg",
  ],
};
