import { getDentalMarketingContent, getHvacMarketingContent } from "../src/lib/wordpress/marketing-program";

async function main() {
  const [hvac, dental] = await Promise.all([
    getHvacMarketingContent(),
    getDentalMarketingContent(),
  ]);

  console.log(
    "HVAC features",
    JSON.stringify(
      hvac.features.map((f) => ({
        title: f.title,
        eyebrow: f.eyebrow,
        media: f.mediaPosition,
        image: f.image?.src?.slice(-80) || null,
      })),
      null,
      2,
    ),
  );

  console.log(
    "DENTAL features",
    JSON.stringify(
      dental.features.map((f) => ({
        title: f.title,
        eyebrow: f.eyebrow,
        media: f.mediaPosition,
        image: f.image?.src?.slice(-80) || null,
        body: f.body?.slice(0, 40),
      })),
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
