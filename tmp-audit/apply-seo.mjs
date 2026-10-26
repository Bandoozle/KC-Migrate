import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const pages = {
  "src/app/page.tsx": "/",
  "src/app/(native)/contact/page.tsx": "/contact/",
  "src/app/(native)/thanks/page.tsx": "/thanks/",
  "src/app/(native)/site-map/page.tsx": "/site-map/",
  "src/app/(native)/online-payments/page.tsx": "/online-payments/",
  "src/app/(native)/marketing-results/page.tsx": "/marketing-results/",
  "src/app/(native)/marketing-programs/page.tsx": "/marketing-programs/",
  "src/app/(native)/corporate-events/page.tsx": "/corporate-events/",
  "src/app/(native)/feature-articles/page.tsx": "/feature-articles/",
  "src/app/(native)/services/page.tsx": "/services/",
  "src/app/comfortmaker/page.tsx": "/comfortmaker/",
  "src/app/uncorked/page.tsx": "/uncorked/",
  "src/app/mexico-2026-welcome-itinerary/page.tsx": "/mexico-2026-welcome-itinerary/",
  "src/app/services/corporate-branding/page.tsx": "/services/corporate-branding/",
  "src/app/services/hvac-marketing/page.tsx": "/services/hvac-marketing/",
  "src/app/services/hvac-marketing/hvac-lead-generation/page.tsx":
    "/services/hvac-marketing/hvac-lead-generation/",
  "src/app/services/digital-connected-tv/page.tsx": "/services/digital-connected-tv/",
  "src/app/services/golf-marketing/page.tsx": "/services/golf-marketing/",
  "src/app/services/outdoor-advertising/page.tsx": "/services/outdoor-advertising/",
  "src/app/services/outdoor-advertising/billboard-dimensions/page.tsx":
    "/services/outdoor-advertising/billboard-dimensions/",
  "src/app/services/creative/page.tsx": "/services/creative/",
  "src/app/services/email-marketing/page.tsx": "/services/email-marketing/",
  "src/app/services/digital-marketing/page.tsx": "/services/digital-marketing/",
  "src/app/services/television-advertising/page.tsx": "/services/television-advertising/",
  "src/app/services/radio-advertising/page.tsx": "/services/radio-advertising/",
  "src/app/services/business-development/page.tsx": "/services/business-development/",
  "src/app/services/website-development/page.tsx": "/services/website-development/",
  "src/app/services/dental-marketing/page.tsx": "/services/dental-marketing/",
  "src/app/services/search-engine-optimization/page.tsx": "/services/search-engine-optimization/",
  "src/app/services/social-media-marketing/page.tsx": "/services/social-media-marketing/",
};

const fn = /export async function generateMetadata\(\): Promise<Metadata> \{\n[\s\S]*?\n\}\n/;

for (const [file, pathname] of Object.entries(pages)) {
  const full = path.join(root, file);
  let source = fs.readFileSync(full, "utf8");
  if (!fn.test(source)) {
    console.error("NO MATCH", file);
    continue;
  }
  source = source.replace(
    fn,
    `export async function generateMetadata(): Promise<Metadata> {\n  return rankMathMetadata(${JSON.stringify(pathname)});\n}\n`,
  );
  if (!source.includes('from "@/lib/seo/rank-math"')) {
    source = source.replace(
      'import type { Metadata } from "next";\n',
      'import type { Metadata } from "next";\nimport { rankMathMetadata } from "@/lib/seo/rank-math";\n',
    );
  }
  if (!/\bdecodeRenderedText\b/.test(source) && !/\bgetPageBySlug\b/.test(source)) {
    source = source.replace(
      'import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";\n',
      "",
    );
  }
  if (!/\bMARKETING_PROGRAMS_INTRO\b/.test(source)) {
    source = source.replace(
      'import { MARKETING_PROGRAMS_INTRO } from "@/lib/content/marketing-program-directory";\n',
      "",
    );
  }
  fs.writeFileSync(full, source);
  console.log("updated", file);
}
