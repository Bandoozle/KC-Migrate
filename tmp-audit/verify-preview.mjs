const base = "https://kc-migrate-1sjydv5qi-bandoozles-projects.vercel.app";

async function get(path) {
  const response = await fetch(`${base}${path}`, { redirect: "manual" });
  const text = await response.text();
  return { path, status: response.status, type: response.headers.get("content-type"), text };
}

const home = await get("/");
const contact = await get("/contact/");
const travel = await get("/travel-marketing-canada/");
const outdoor = await get("/services/outdoor-advertising/");
const events = await get("/corporate-events/");
const sitemap = await get("/sitemap.xml");
const robots = await get("/robots.txt");
const image = await fetch(`${base}/images/articles/travel-marketing-canada-cruise.jpg`);
const kml = await get("/locations.kml");

const empty = new FormData();
empty.set("formKey", "contact");
const emptyResponse = await fetch(`${base}/api/contact-form/`, { method: "POST", body: empty });
const emptyBody = await emptyResponse.json().catch(() => null);

const honeypot = new FormData();
honeypot.set("formKey", "contact");
honeypot.set("field652327-6b", "Preview Probe");
honeypot.set("field4d218f-d3", "probe@example.com");
honeypot.set("field7ef1b0-96", "6045550100");
honeypot.set("_kosick_hp", "bot");
const honeypotResponse = await fetch(`${base}/api/contact-form/`, { method: "POST", body: honeypot });
const honeypotBody = await honeypotResponse.json().catch(() => null);

const locs = [...sitemap.text.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((match) => match[1]);
const title = (html) => html.match(/<title>([^<]*)<\/title>/)?.[1] || "";
const canonical = (html) => html.match(/rel="canonical" href="([^"]+)"/)?.[1] || "";

console.log(JSON.stringify({
  home: { status: home.status, title: title(home.text), gtm: home.text.includes("googletagmanager.com/gtm.js"), canonical: canonical(home.text) },
  contact: { status: contact.status, title: title(contact.text) },
  travel: {
    status: travel.status,
    title: title(travel.text),
    localImage: travel.text.includes("/images/articles/travel-marketing-canada-cruise.jpg"),
    liveUpload: travel.text.includes("wp-content/uploads/2026/10/travel-marketing-canada-cruise"),
    canonical: canonical(travel.text),
  },
  outdoor: { status: outdoor.status, title: title(outdoor.text), dead: outdoor.text.includes("smartmockups_ljx6qkvg") },
  events: { status: events.status, title: title(events.text), dead: events.text.toLowerCase().includes("cityscape-of-capital") },
  sitemap: { status: sitemap.status, count: locs.length },
  robots: robots.text,
  image: image.status,
  kml: { status: kml.status, type: kml.type, hasKml: kml.text.includes("<kml") },
  emptyForm: { status: emptyResponse.status, body: emptyBody },
  honeypot: { status: honeypotResponse.status, body: honeypotBody },
  authWall: home.text.includes("Authentication Required") || home.status === 401,
}, null, 2));
