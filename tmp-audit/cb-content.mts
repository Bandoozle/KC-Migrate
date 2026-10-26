import fs from "node:fs";
import { getCorporateBrandingContent } from "../src/lib/wordpress/service-page";

const content = await getCorporateBrandingContent();
fs.writeFileSync("tmp-audit/cb-content.json", JSON.stringify(content, null, 2));
const summary = Object.fromEntries(
  Object.entries(content).map(([key, value]) => [
    key,
    Array.isArray(value) ? `array(${value.length})` : value && typeof value === "object" ? "object" : value,
  ]),
);
console.log(summary);
