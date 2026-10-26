import { getCorporateBrandingContent, getDigitalConnectedTvContent } from "../src/lib/wordpress/service-page";

for (const [name, load] of [
  ["digital-video", getDigitalConnectedTvContent],
  ["corporate-branding", getCorporateBrandingContent],
] as const) {
  const content = await load();
  const { slides, ...rest } = content.hero;
  console.log(name, JSON.stringify({ slides: slides.map((s) => `${s.kind} ${s.src.split("/").pop()}`), ...rest }));
}
