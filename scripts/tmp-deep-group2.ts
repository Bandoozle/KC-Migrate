import { readFileSync, writeFileSync } from "node:fs";
import { load } from "cheerio";

function dump(slug: string, file: string) {
  const page = JSON.parse(readFileSync(file, "utf8"))[0];
  const html = page.content.rendered;
  const $ = load(`<div id="root">${html}</div>`);
  const rows = $("#root").children(".kb-row-layout-wrap").toArray();

  const detail = rows.map((row, idx) => {
    const $row = $(row);
    const htmlSlice = $.html($row).slice(0, 1200);
    const bg = ($row.html() || "").match(/background-image:\s*url\((['"]?)([^)'"]+)\1\)/gi) || [];
    const cols2 = $row.find(".kt-has-2-columns > .wp-block-kadence-column").length;
    const tabs = $row.find(".wp-block-kadence-tabs, .kt-tabs-title-list, .kt-tab-inner-content").length;
    const panes = $row.find(".wp-block-kadence-pane").length;
    const overlay = $row.find(".wp-block-kadence-imageoverlay").length;
    const headings = $row
      .find(".wp-block-kadence-advancedheading, h1, h2, h3, h4")
      .toArray()
      .map((h) => $(h).text().replace(/\s+/g, " ").trim())
      .filter(Boolean);
    const paras = $row
      .find("p")
      .toArray()
      .map((p) => $(p).text().replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .slice(0, 4);
    const imgs = $row
      .find("img")
      .toArray()
      .map((img) => ($(img).attr("src") || "").split("/").pop())
      .filter(Boolean)
      .slice(0, 8);
    const ctas = $row
      .find("a.kb-button, a.kt-button")
      .toArray()
      .map((a) => $(a).text().replace(/\s+/g, " ").trim());
    const bullets = $row
      .find("ul li")
      .toArray()
      .map((li) => $(li).text().replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .slice(0, 8);

    return {
      idx,
      id: ($row.attr("class") || "").match(/id([^\s]+)/)?.[1],
      cls: ($row.attr("class") || "").slice(0, 140),
      cols2,
      tabs,
      panes,
      overlay,
      bg: bg.slice(0, 3),
      headings,
      paras,
      imgs,
      ctas,
      bullets,
      htmlSlice,
    };
  });

  writeFileSync(`scripts/tmp-${slug}-detail.json`, JSON.stringify(detail, null, 2));
  console.log("\n====", slug, "====");
  for (const r of detail) {
    console.log({
      idx: r.idx,
      id: r.id,
      cols2: r.cols2,
      tabs: r.tabs,
      panes: r.panes,
      overlay: r.overlay,
      bg: r.bg.length,
      headings: r.headings,
      paras: r.paras.map((p) => p.slice(0, 80)),
      imgs: r.imgs,
      ctas: r.ctas,
      bullets: r.bullets,
    });
  }
}

dump("outdoor", "scripts/tmp-outdoor-rest.json");
dump("ctv", "scripts/tmp-ctv-rest.json");
dump("radio", "scripts/tmp-radio-rest.json");
