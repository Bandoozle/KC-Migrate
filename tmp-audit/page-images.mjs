const base = process.env.BASE ?? "http://localhost:3000";
const pages = process.argv.slice(2);

for (const page of pages) {
  const html = (await (await fetch(base + page)).text()).replace(/<script[\s\S]*?<\/script>/g, "");
  console.log(`\n# ${page}`);
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    const attr = (name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1]?.replace(/&amp;/g, "&") ?? "";
    let src = attr("src");
    if (src.startsWith("/_next/image")) src = decodeURIComponent(new URL(src, base).searchParams.get("url") ?? src);
    if (/\.svg|logo|cropped-Kosick|chat-feature|kosick-communications\.jpg/i.test(src)) continue;
    console.log(`${src}  ::  ${attr("alt")}`);
  }
}
