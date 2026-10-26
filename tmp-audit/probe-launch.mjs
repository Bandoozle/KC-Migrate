const origin = "http://127.0.0.1:3010";

async function show(path, options) {
  const response = await fetch(`${origin}${path}`, options);
  const body = await response.text();
  const title = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim();
  console.log("\n==", path, response.status, response.headers.get("content-type"));
  console.log("final", response.url);
  console.log("title", title || "");
  console.log("gtm", /googletagmanager\.com\/gtm\.js/.test(body));
  console.log("canonical", body.match(/rel="canonical" href="([^"]+)"/)?.[1] || "");
  console.log("robots-meta", body.match(/name="robots" content="([^"]+)"/)?.[1] || "");
  console.log("body-start", body.slice(0, 180).replace(/\s+/g, " "));
  return body;
}

await show("/robots.txt");
await show("/sitemap_index.xml");
const sitemap = await show("/sitemap.xml");
console.log("kml in sitemap", sitemap.includes("locations.kml"));
console.log("travel in sitemap", sitemap.includes("travel-marketing-canada"));
console.log("sitemap url count", (sitemap.match(/<loc>/g) || []).length);
await show("/locations.kml");
await show("/travel-marketing-canada/");
await show("/");
await show("/contact/");

async function post(label, fields) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  const response = await fetch(`${origin}/api/contact-form`, { method: "POST", body: data });
  const json = await response.json();
  console.log("\nFORM", label, response.status, JSON.stringify(json));
}

await post("empty", { formKey: "contact" });
await post("bad-email", {
  formKey: "contact",
  "field652327-6b": "QA",
  "field4d218f-d3": "not-an-email",
  "field7ef1b0-96": "6045550100",
});
await post("honeypot", {
  formKey: "contact",
  "field652327-6b": "QA",
  "field4d218f-d3": "qa@example.com",
  "field7ef1b0-96": "6045550100",
  "field34af12-76": "This is a honeypot check and must not be delivered.",
  _kosick_hp: "bot",
});
