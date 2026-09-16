function sliceSlider(html) {
  const start = html.indexOf('class="n2-section-smartslider');
  if (start < 0) return "";
  const end = html.indexOf("</ss3-force-full-width>", start);
  return html.slice(start, end > start ? end + 30 : start + 80000);
}

function inspectPictures(html, label) {
  const slider = sliceSlider(html);
  const pictures = [...slider.matchAll(/<picture[\s\S]*?<\/picture>/gi)];
  const imgs = [...slider.matchAll(/<img\b[^>]*>/gi)];
  console.log("\n====", label, "sliderLen", slider.length, "pictures", pictures.length, "imgs", imgs.length);
  for (const [i, p] of pictures.slice(0, 3).entries()) {
    console.log("--- picture", i, p[0].slice(0, 900));
  }
  for (const [i, img] of imgs.slice(0, 6).entries()) {
    console.log("--- img", i, img[0].slice(0, 700));
  }
  const sources = [...slider.matchAll(/<source\b[^>]*>/gi)].slice(0, 8);
  for (const [i, s] of sources.entries()) {
    console.log("--- source", i, s[0].slice(0, 500));
  }
  const bgInner = [...slider.matchAll(/<div class="n2-ss-slide-background-image"[\s\S]*?<\/div>/gi)].slice(0, 2);
  for (const [i, b] of bgInner.entries()) {
    console.log("--- bg inner", i, b[0].slice(0, 1200));
  }
}

for (const [label, url] of [
  ["stg-dm", "https://staging.kosick.com/services/digital-marketing/"],
  ["stg-cb", "https://staging.kosick.com/services/corporate-branding/"],
  ["stg-creative", "https://staging.kosick.com/services/creative/"],
  ["local-dm", "http://localhost:3000/services/digital-marketing"],
]) {
  inspectPictures(await fetch(url).then((r) => r.text()), label);
}
