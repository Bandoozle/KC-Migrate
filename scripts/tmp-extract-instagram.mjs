import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const html = fs.readFileSync("tmp-parity/functionality-audit/home.html", "utf8");
const items = [];
const re =
  /class="sbi_photo" href="([^"]+)"[\s\S]*?data-full-res="([^"]+)"[\s\S]*?<img[^>]*alt="([^"]*)"/g;
let m;
while ((m = re.exec(html)) && items.length < 8) {
  items.push({
    href: m[1],
    src: m[2].replace(/&#038;/g, "&").replace(/&amp;/g, "&"),
    alt: m[3]
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 140),
  });
}

console.log(JSON.stringify(items, null, 2));
fs.writeFileSync("scripts/tmp-instagram-items.json", JSON.stringify(items, null, 2));

const outDir = path.join("public", "images", "instagram");
fs.mkdirSync(outDir, { recursive: true });

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
          Referer: "https://www.instagram.com/",
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          fs.unlinkSync(dest);
          download(res.headers.location, dest).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlinkSync(dest);
          reject(new Error(`HTTP ${res.statusCode} for ${url.slice(0, 80)}`));
          return;
        }
        res.pipe(file);
        file.on("finish", () => file.close(() => resolve(dest)));
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
for (let i = 0; i < items.length; i++) {
  const item = items[i];
  const slug = item.href.match(/\/p\/([^/]+)/)?.[1] || `post-${i + 1}`;
  const file = path.join(outDir, `${slug}.jpg`);
  try {
    await download(item.src, file);
    const size = fs.statSync(file).size;
    console.log(`OK ${slug} (${size} bytes)`);
    saved.push({ ...item, local: `/images/instagram/${slug}.jpg`, file });
  } catch (err) {
    console.error(`FAIL ${slug}:`, err.message);
    saved.push({ ...item, local: null, error: err.message });
  }
}

fs.writeFileSync("scripts/tmp-instagram-saved.json", JSON.stringify(saved, null, 2));
console.log("Done", saved.filter((s) => s.local).length, "/", saved.length);
