const css = await fetch(
  "https://staging.kosick.com/wp-content/plugins/instagram-feed/css/sbi-styles.min.css",
).then((r) => r.text());
for (const n of ["opacity", "sbi_photo img", "imgLiquid", "background", "placeholder"]) {
  let idx = 0;
  let c = 0;
  while ((idx = css.indexOf(n, idx)) >= 0 && c < 4) {
    console.log("\n--", n);
    console.log(css.slice(Math.max(0, idx - 90), idx + 140).replace(/\s+/g, " "));
    idx += n.length;
    c++;
  }
}
