import { readFileSync, writeFileSync } from "node:fs";

const S = "src/components/";
const edits = [
  [`${S}industry/IndustryServicePage.tsx`, 'sizes="(min-width: 960px) 70vw, 100vw"', 'sizes="(min-width: 960px) 90vw, 180vw"'],
  [`${S}industry/IndustryServicePage.tsx`, 'sizes="(min-width: 960px) 60vw, 100vw"', 'sizes="(min-width: 960px) 75vw, 100vw"'],
  [`${S}industry/IndustryIntro.tsx`, 'workbench: "(min-width: 960px) 80vw, 100vw"', 'workbench: "(min-width: 960px) 90vw, 100vw"'],
  [`${S}industry/IndustryOffers.tsx`, '"(min-width: 960px) 22vw, 40vw"', '"(min-width: 960px) 32vw, 90vw"'],
  [`${S}industry/IndustryOffers.tsx`, '"(min-width: 960px) 50vw, 100vw"', '"(min-width: 960px) 75vw, 100vw"'],
  [`${S}industry/IndustryOffers.tsx`, '"(min-width: 960px) 34vw, 100vw"', '"(min-width: 960px) 72vw, 130vw"'],
  [`${S}industry/RetailAttention.tsx`, 'sizes="(min-width: 960px) 30vw, 33vw"', 'sizes="(min-width: 960px) 62vw, 66vw"'],
  [`${S}industry/journeys/JourneyFrame.tsx`, 'sizes="(max-width: 999px) 92vw, 520px"', 'sizes="(max-width: 999px) 112vw, 700px"'],
  [`${S}industry/IndustryReasons.tsx`, 'sizes="(min-width: 960px) 18vw, 40vw" className={styles.lineFrame}', 'sizes="(min-width: 960px) 18vw, 85vw" className={styles.lineFrame}'],
  [`${S}sections/outdoor/OutdoorPricing.tsx`, 'sizes="(min-width: 1100px) 300px, (min-width: 640px) 45vw, 120px"', 'sizes="(min-width: 1100px) 420px, (min-width: 640px) 45vw, 160px"'],
  [`${S}sections/MedicalAestheticsMarketingPage.tsx`, 'fill sizes="(min-width: 960px) 40vw, 100vw"', 'fill sizes="(min-width: 960px) 70vw, 100vw"'],
  [`${S}sections/MarketingProgramDirectory.tsx`, 'fill sizes="140px"', 'fill sizes="360px"'],
  [`${S}sections/MarketingProgramDirectory.tsx`, 'sizes="(min-width: 960px) 34vw, 50vw"', 'sizes="(min-width: 960px) 34vw, 100vw"'],
  [`${S}sections/DentalMarketingPage.tsx`, 'IMAGES.sparkleOutdoor.alt} fill sizes="(min-width: 960px) 40vw, 100vw"', 'IMAGES.sparkleOutdoor.alt} fill sizes="(min-width: 960px) 60vw, 100vw"'],
  [`${S}sections/corporate-events/CorporateEventsPage.tsx`, 'IMAGES.sailing.alt} fill sizes="(min-width: 960px) 40vw, 100vw"', 'IMAGES.sailing.alt} fill sizes="(min-width: 960px) 50vw, 100vw"'],
  [`${S}sections/corporate-events/CorporateEventsPage.tsx`, 'IMAGES.room.alt} fill sizes="100vw"', 'IMAGES.room.alt} fill sizes="(max-width: 767px) 200vw, 100vw"'],
  [`${S}sections/corporate-branding/CorporateBrandingPage.tsx`, 'sizes="(min-width: 980px) 56vw, 100vw"', 'sizes="(min-width: 980px) 75vw, 100vw"'],
  [`${S}sections/GolfMarketingPage.tsx`, 'sizes="(min-width: 960px) 25vw, 60vw"', 'sizes="(min-width: 960px) 30vw, 60vw"'],
  [`${S}sections/hvac/HvacMarketingPage.tsx`, 'IMAGES.intro.alt} fill sizes="(min-width: 960px) 50vw, 100vw"', 'IMAGES.intro.alt} fill sizes="(min-width: 960px) 80vw, 100vw"'],
  [`${S}sections/website/WebsiteDevelopmentPage.tsx`, 'SCREENS.store.alt} fill sizes="(min-width: 960px) 50vw, 100vw"', 'SCREENS.store.alt} fill sizes="(min-width: 960px) 65vw, 100vw"'],
  [`${S}sections/website/WebsiteDevelopmentPage.tsx`, 'alt="" fill sizes="30vw"', 'alt="" fill sizes="(min-width: 960px) 30vw, 70vw"', true],
  [`${S}sections/digital-video/DigitalVideoAdvertisingPage.tsx`, 'alt="" fill sizes="30vw"', 'alt="" fill sizes="(min-width: 960px) 30vw, 85vw"'],
  [`${S}sections/creative/CreativeProductionPage.tsx`, 'sizes="(min-width: 960px) 30vw, 50vw"', 'sizes="(min-width: 960px) 30vw, 90vw"'],
  [`${S}sections/business-development/BusinessDevelopmentPage.tsx`, 'fill sizes="100vw" className={styles.exitImage}', 'fill sizes="(max-width: 767px) 180vw, 100vw" className={styles.exitImage}'],
  [`${S}sections/business-development/BusinessDevelopmentPage.tsx`, 'fill sizes="100vw" className={styles.closingImage}', 'fill sizes="(max-width: 767px) 180vw, 100vw" className={styles.closingImage}'],
];

for (const [file, from, to, all] of edits) {
  const text = readFileSync(file, "utf8");
  const count = text.split(from).length - 1;
  if (count === 0) { console.log(`MISS ${file}: ${from}`); continue; }
  if (count > 1 && !all) { console.log(`AMBIGUOUS (${count}) ${file}: ${from}`); continue; }
  writeFileSync(file, all ? text.split(from).join(to) : text.replace(from, to));
  console.log(`ok ${file} x${count}`);
}
