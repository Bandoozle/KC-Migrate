import { writeFile } from "node:fs/promises";

const gtm = await fetch("https://www.googletagmanager.com/gtm.js?id=GTM-K4QK6SP", {
  signal: AbortSignal.timeout(30_000),
});
const js = await gtm.text();
await writeFile("tmp-audit/gtm.js", js);
const needles = ["generate_lead", "form_name", "G-XPYR1CEF3E", "AW-785313466", "phone_click", "Kosick Contact"];
for (const needle of needles) {
  const indexes = [];
  let from = 0;
  while (indexes.length < 6) {
    const index = js.indexOf(needle, from);
    if (index < 0) break;
    indexes.push(index);
    from = index + needle.length;
  }
  console.log("\n==", needle, "count-ish", indexes.length);
  for (const index of indexes) {
    console.log(js.slice(Math.max(0, index - 180), index + 220).replace(/\s+/g, " "));
  }
}

const contact = await (await fetch("https://staging.kosick.com/contact/")).text();
const leadHits = [];
let from = 0;
while (leadHits.length < 8) {
  const index = contact.toLowerCase().indexOf("generate_lead", from);
  if (index < 0) break;
  leadHits.push(contact.slice(Math.max(0, index - 200), index + 250).replace(/\s+/g, " "));
  from = index + 12;
}
console.log("\n== contact generate_lead", leadHits.length);
for (const hit of leadHits) console.log(hit);

const travelStaging = await fetch("https://staging.kosick.com/wp-json/wp/v2/posts?slug=travel-marketing-canada&_embed=1");
const travelLive = await fetch("https://www.kosick.com/wp-json/wp/v2/posts?slug=travel-marketing-canada&_embed=1");
console.log("\ntravel staging", travelStaging.status, (await travelStaging.clone().text()).slice(0, 80));
const liveJson = await travelLive.json();
const post = liveJson[0];
console.log("travel live", travelLive.status, "id", post?.id, "title", post?.title?.rendered);
const media = post?._embedded?.["wp:featuredmedia"]?.[0];
console.log("featured", media?.source_url);
const urls = [...(post?.content?.rendered || "").matchAll(/https?:\/\/[^"'\\\s]+/g)].map((match) => match[0]);
console.log("content urls", [...new Set(urls)].slice(0, 30));
