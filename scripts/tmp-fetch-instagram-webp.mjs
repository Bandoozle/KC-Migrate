import fs from "fs";
import path from "path";
import https from "https";

const html = fs.readFileSync("scripts/tmp-kosick-live-home.html", "utf8");
const items = [];
const re =
  /class="sbi_photo" href="(https:\/\/www\.instagram\.com\/p\/[^"]+)"[\s\S]*?data-img-src-set="([^"]+)"[\s\S]*?<img[^>]*alt="([^"]*)"/g;

let m;
while ((m = re.exec(html)) && items.length < 8) {
  const srcSetRaw = m[2]
    .replace(/&quot;/g, '"')
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&");
  let srcSet;
  try {
    srcSet = JSON.parse(srcSetRaw);
  } catch {
    srcSet = {};
  }
  const localFull = srcSet["640"] || srcSet["320"] || null;
  items.push({
    href: m[1],
    localSource: localFull,
    cdn: srcSet.d || null,
    alt: m[3]
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 160),
  });
}

console.log("Found", items.length, "items");
console.log(JSON.stringify(items.map((i) => ({ href: i.href, localSource: i.localSource, alt: i.alt.slice(0, 60) })), null, 2));

const outDir = path.join("public", "images", "instagram");
fs.mkdirSync(outDir, { recursive: true });

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
          Referer: "https://www.kosick.com/",
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          try {
            fs.unlinkSync(dest);
          } catch {}
          download(res.headers.location, dest).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          file.close();
          try {
            fs.unlinkSync(dest);
          } catch {}
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        res.pipe(file);
        file.on("finish", () =>
          file.close(() => resolve({ size: fs.statSync(dest).size, type: res.headers["content-type"] })),
        );
      },
    );
    req.on("error", (err) => {
      file.close();
      try {
        fs.unlinkSync(dest);
      } catch {}
      reject(err);
    });
  });
}

const saved = [];
for (const item of items) {
  const slug = item.href.match(/\/p\/([^/]+)/)?.[1];
  if (!item.localSource) {
    console.log("NO LOCAL", slug);
    saved.push({ ...item, local: null });
    continue;
  }
  const ext = path.extname(new URL(item.localSource).pathname) || ".webp";
  const dest = path.join(outDir, `${slug}${ext}`);
  try {
    const result = await download(item.localSource, dest);
    console.log("OK", slug, result.size, result.type);
    saved.push({
      href: item.href,
      alt: item.alt,
      src: `/images/instagram/${slug}${ext}`,
    });
  } catch (err) {
    console.log("FAIL", slug, err.message);
    saved.push({ href: item.href, alt: item.alt, src: null, error: err.message });
  }
}

fs.writeFileSync("scripts/tmp-instagram-gallery.json", JSON.stringify(saved, null, 2));
console.log("Saved", saved.filter((s) => s.src).length, "/", saved.length);
