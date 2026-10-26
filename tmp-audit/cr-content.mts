import fs from "node:fs";
import { getCreativeContent } from "../src/lib/wordpress/service-page";

const content = await getCreativeContent();
fs.writeFileSync("tmp-audit/cr-content.json", JSON.stringify(content, null, 2));
console.log("written");
