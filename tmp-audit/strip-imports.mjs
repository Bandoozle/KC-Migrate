import fs from "node:fs";

const files = [
  "src/app/page.tsx",
  "src/app/(native)/contact/page.tsx",
  "src/app/(native)/thanks/page.tsx",
  "src/app/(native)/site-map/page.tsx",
  "src/app/(native)/online-payments/page.tsx",
  "src/app/(native)/marketing-results/page.tsx",
  "src/app/(native)/marketing-programs/page.tsx",
  "src/app/(native)/corporate-events/page.tsx",
  "src/app/(native)/feature-articles/page.tsx",
  "src/app/(native)/services/page.tsx",
  "src/app/services/corporate-branding/page.tsx",
  "src/app/services/hvac-marketing/page.tsx",
  "src/app/services/hvac-marketing/hvac-lead-generation/page.tsx",
  "src/app/services/digital-connected-tv/page.tsx",
  "src/app/services/golf-marketing/page.tsx",
  "src/app/services/outdoor-advertising/page.tsx",
  "src/app/services/outdoor-advertising/billboard-dimensions/page.tsx",
  "src/app/services/creative/page.tsx",
  "src/app/services/email-marketing/page.tsx",
  "src/app/services/digital-marketing/page.tsx",
  "src/app/services/television-advertising/page.tsx",
  "src/app/services/radio-advertising/page.tsx",
  "src/app/services/business-development/page.tsx",
  "src/app/services/website-development/page.tsx",
  "src/app/services/dental-marketing/page.tsx",
  "src/app/services/search-engine-optimization/page.tsx",
  "src/app/services/social-media-marketing/page.tsx",
];

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  const next = source
    .replaceAll('import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";\r\n', "")
    .replaceAll('import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";\n', "")
    .replaceAll(
      'import { MARKETING_PROGRAMS_INTRO } from "@/lib/content/marketing-program-directory";\r\n',
      "",
    )
    .replaceAll(
      'import { MARKETING_PROGRAMS_INTRO } from "@/lib/content/marketing-program-directory";\n',
      "",
    );
  if (next === source) console.log("unchanged", file);
  else fs.writeFileSync(file, next);
}
