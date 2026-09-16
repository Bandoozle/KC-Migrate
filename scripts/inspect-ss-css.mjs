const css = await fetch(
  "https://staging.kosick.com/wp-content/plugins/nextend-smart-slider3-pro/Public/SmartSlider3/Application/Frontend/Assets/dist/smartslider.min.css?ver=76b60e7d",
).then((r) => r.text());

const needles = [
  "slide-background-image",
  "background-image img",
  "n2-ss-loaded",
  "translateX(-100000px)",
  "feature-post-bg",
  "ss3-loader",
  "opacity:0",
];
for (const n of needles) {
  let idx = 0;
  let count = 0;
  while ((idx = css.indexOf(n, idx)) >= 0 && count < 3) {
    console.log("\n--", n, "at", idx);
    console.log(css.slice(Math.max(0, idx - 120), idx + 200).replace(/\s+/g, " "));
    idx += n.length;
    count++;
  }
}

const html = await fetch("https://staging.kosick.com/services/digital-marketing/").then((r) => r.text());
const style = html.match(/<style data-related="n2-ss-8">([\s\S]*?)<\/style>/)?.[1] || "";
console.log("\n==== inline slider css length", style.length);
for (const n of ["background-image", "picture", "img", "transform", "loaded", "fill"]) {
  const i = style.indexOf(n);
  if (i >= 0) console.log(n, style.slice(Math.max(0, i - 80), i + 160).replace(/\s+/g, " "));
}
