function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([a-zA-Z0-9:-]+)=("([^"]*)"|'([^']*)')/g)) {
    out[m[1]] = (m[3] ?? m[4] ?? "").slice(0, 220);
  }
  const style = tag.match(/style="([^"]*)"/)?.[1];
  if (style) out._style = style.slice(0, 300);
  return out;
}

function inspect(html, label) {
  const ids = [...html.matchAll(/id="(n2-ss-\d+)"/g)].map((m) => m[1]);
  const bgImages = [...html.matchAll(/<div class="n2-ss-slide-background-image"[^>]*>/gi)].map((m) =>
    attrs(m[0]),
  );
  const pictures = (html.match(/<picture/gi) || []).length;
  const lazyImgs = [...html.matchAll(/<img[^>]*(data-src|data-lazy|data-desktop)[^>]*>/gi)].slice(0, 5).map((m) => attrs(m[0]));
  const bgStyles = [...html.matchAll(/background-image:\s*url\(([^)]+)\)/gi)].slice(0, 15).map((m) => m[1].slice(0, 180));
  const motion = html.includes("Kosick In Motion") || html.includes("Kosick In <mark");
  const instagram = html.includes('id="sb_instagram"');
  const slides = (html.match(/class="n2-ss-slide /g) || []).length;
  const bgs = (html.match(/class="n2-ss-slide-background"/g) || []).length;
  console.log("\n====", label);
  console.log({ ids, slides, bgs, pictures, motion, instagram, bgImageCount: bgImages.length });
  console.log("first bg image attrs", bgImages[0]);
  console.log("all bg image keys", [...new Set(bgImages.flatMap((a) => Object.keys(a)))]);
  console.log("bgImages sample", bgImages.slice(0, 3));
  console.log("lazy imgs", lazyImgs);
  console.log("bg-image urls", [...new Set(bgStyles)].slice(0, 8));
}

const pages = [
  ["staging-home", "https://staging.kosick.com/"],
  ["staging-dm", "https://staging.kosick.com/services/digital-marketing/"],
  ["staging-cb", "https://staging.kosick.com/services/corporate-branding/"],
  ["staging-creative", "https://staging.kosick.com/services/creative/"],
  ["local-home", "http://localhost:3000/"],
  ["local-dm", "http://localhost:3000/services/digital-marketing"],
  ["local-cb", "http://localhost:3000/services/corporate-branding"],
];

for (const [label, url] of pages) {
  const html = await fetch(url).then((r) => r.text());
  inspect(html, label);
}
