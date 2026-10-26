import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const base = "https://kc-migrate-1sjydv5qi-bandoozles-projects.vercel.app";

function curl(path, extra = []) {
  try {
    return execFileSync(
      "npx",
      [
        "vercel",
        "curl",
        `${base}${path}`,
        "--yes",
        "--scope",
        "bandoozles-projects",
        "--",
        "-s",
        ...extra,
      ],
      { encoding: "utf8", maxBuffer: 20_000_000, shell: true },
    );
  } catch (error) {
    return error.stdout || "";
  }
}

function titleOf(html) {
  return html.match(/<title>([^<]*)<\/title>/)?.[1] || "";
}

const home = curl("/");
const contact = curl("/contact/");
const travel = curl("/travel-marketing-canada/");
const outdoor = curl("/services/outdoor-advertising/");
const events = curl("/corporate-events/");
const website = curl("/services/website-development/");
const sitemap = curl("/sitemap.xml");
const robots = curl("/robots.txt");
const imageHead = curl("/images/articles/travel-marketing-canada-cruise.jpg", ["-D", "-", "-o", "NUL"]);
const kml = curl("/locations.kml");
const redirect = curl("/corporate-events-group-travel/", ["-D", "-", "-o", "NUL"]);
const empty = curl("/api/contact-form/", ["-X", "POST", "-F", "formKey=contact"]);
const honeypot = curl("/api/contact-form/", [
  "-X", "POST",
  "-F", "formKey=contact",
  "-F", "field652327-6b=Preview Probe",
  "-F", "field4d218f-d3=probe@example.com",
  "-F", "field7ef1b0-96=6045550100",
  "-F", "_kosick_hp=bot",
]);

const locs = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((match) => match[1]);

writeFileSync("tmp-audit/preview-verify.json", JSON.stringify({
  home: {
    title: titleOf(home),
    gtm: home.includes("googletagmanager.com/gtm.js"),
    canonical: home.match(/rel="canonical" href="([^"]+)"/)?.[1] || "",
    jsonLd: (home.match(/<script\b[^>]*application\/ld\+json/g) || []).length,
  },
  contact: { title: titleOf(contact) },
  travel: {
    title: titleOf(travel),
    localImage: travel.includes("/images/articles/travel-marketing-canada-cruise.jpg"),
    liveUpload: travel.includes("wp-content/uploads/2026/10/travel-marketing-canada-cruise"),
    canonical: travel.match(/rel="canonical" href="([^"]+)"/)?.[1] || "",
  },
  outdoor: { title: titleOf(outdoor), dead: outdoor.includes("smartmockups_ljx6qkvg") },
  events: { title: titleOf(events), dead: events.toLowerCase().includes("cityscape-of-capital") },
  website: { title: titleOf(website), mov: website.includes("Screen-Recording-2024-03-14-at-9.30.00-AM.mov"), mp4: website.toLowerCase().includes("screen-recording-2024-03-14-at-9.30.00-am-1.mp4") },
  sitemapCount: locs.length,
  robots: robots.trim(),
  imageHead: imageHead.split("\n").slice(0, 8).join("\n"),
  kml: kml.includes("<kml"),
  redirect: redirect.split("\n").filter((line) => /^HTTP|location/i.test(line)).slice(0, 4),
  empty,
  honeypot,
}, null, 2));
console.log("wrote preview-verify.json");
