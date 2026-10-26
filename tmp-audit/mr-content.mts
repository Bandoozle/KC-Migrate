import fs from "node:fs";
import { getMarketingResultsContent } from "../src/lib/wordpress/marketing-results";

const content = await getMarketingResultsContent();
fs.writeFileSync("tmp-audit/mr-content.json", JSON.stringify(content, null, 2));
const text = JSON.stringify(content);
const imgs = [...new Set(text.match(/https:[^"]+\.(?:jpe?g|png|webp)/g) ?? [])];
console.log(imgs.join("\n"));
