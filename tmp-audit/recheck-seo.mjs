const origin = "http://127.0.0.1:3010";
const paths = [
  "/",
  "/marketing-programs/",
  "/marketing-results/",
  "/online-payments/",
  "/services/digital-marketing/",
  "/services/outdoor-advertising/billboard-dimensions/",
  "/corporate-events/",
  "/feature-articles/",
  "/services/television-advertising/",
  "/ga4-new-generation-google-analytics/",
  "/shopify-vs-woocommerce/",
  "/social-media-advertising-vancouver/",
  "/social-media-marketing-build-an-audience/",
  "/the-power-of-radio-advertising/",
];

function title(html) {
  return (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").replace(/\s+/g, " ").trim();
}
function desc(html) {
  return html.match(/name="description" content="([^"]*)"/)?.[1] || "";
}
function canon(html) {
  return html.match(/rel="canonical" href="([^"]+)"/)?.[1] || "";
}

for (const path of paths) {
  const response = await fetch(`${origin}${path}`);
  const html = await response.text();
  console.log(response.status, path);
  console.log(" ", title(html));
  console.log(" ", desc(html));
  console.log(" ", canon(html));
}
