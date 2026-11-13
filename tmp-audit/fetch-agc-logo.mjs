import fs from "node:fs";

const home = await fetch("https://amsterdamgardencentre.ca/", {
  headers: { "User-Agent": "Mozilla/5.0 (compatible; KosickBot/1.0)" },
  redirect: "follow",
});
console.log("home", home.status);
const html = await home.text();
const files = [...html.matchAll(/cdn\/shop\/files\/[^"'\\\s>]+\.(?:png|jpg|jpeg|svg|webp)/gi)].map((m) => m[0]);
const uniq = [...new Set(files)];
const logoish = uniq.filter((x) => /logo|amsterdam|icon|header|brand/i.test(x));
console.log("logoish", logoish);
console.log("all", uniq.slice(0, 50));

const candidates = [
  ...logoish.map((p) => `https://amsterdamgardencentre.ca/${p}`),
  "https://amsterdamgardencentre.ca/cdn/shop/files/Amsterdam_Garden_Centre_Logo.png",
];

for (const url of candidates.slice(0, 12)) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; KosickBot/1.0)" },
      redirect: "follow",
    });
    const type = res.headers.get("content-type") || "";
    console.log(res.status, type, url);
    if (res.ok && type.includes("image")) {
      const buf = Buffer.from(await res.arrayBuffer());
      const name = url.split("/").pop()?.split("?")[0] || "logo.png";
      fs.writeFileSync(`tmp-audit/agc-${name}`, buf);
      console.log("saved", name, buf.length);
    }
  } catch (e) {
    console.log("fail", url, e.message);
  }
}
