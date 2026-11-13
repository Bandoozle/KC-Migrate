import fs from "fs";
import path from "path";
import https from "https";

const items = JSON.parse(fs.readFileSync("scripts/tmp-instagram-items.json", "utf8"));
const outDir = path.join("public", "images", "instagram");
fs.mkdirSync(outDir, { recursive: true });

function headOrGet(url, dest = null) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "*/*",
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          headOrGet(res.headers.location, dest).then(resolve).catch(reject);
          return;
        }
        if (!dest) {
          res.resume();
          resolve({ status: res.statusCode, type: res.headers["content-type"], url });
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on("finish", () => file.close(() => resolve({ status: 200, dest, size: fs.statSync(dest).size })));
      },
    );
    req.on("error", reject);
  });
}

const base = "https://staging.kosick.com/wp-content/uploads/sb-instagram-feed-images/";

for (const item of items) {
  const fileBase = item.src.split("?")[0].split("/").pop().replace(/\.(jpg|jpeg|png|webp)$/i, "");
  const slug = item.href.match(/\/p\/([^/]+)/)?.[1];
  const candidates = [
    `${base}${fileBase}full.jpg`,
    `${base}${fileBase}.jpg`,
    `${base}${fileBase}thumb.jpg`,
    `${base}${fileBase}medium.jpg`,
    `${base}${fileBase}low.jpg`,
  ];

  let found = null;
  for (const url of candidates) {
    try {
      const meta = await headOrGet(url);
      if (meta.status === 200 && String(meta.type || "").includes("image")) {
        found = url;
        console.log("FOUND", slug, url);
        break;
      }
      console.log("miss", meta.status, url.slice(base.length));
    } catch (e) {
      console.log("err", url.slice(base.length), e.message);
    }
  }

  if (!found) {
    console.log("NONE", slug);
    continue;
  }

  const dest = path.join(outDir, `${slug}.jpg`);
  try {
    const result = await headOrGet(found, dest);
    console.log("SAVED", slug, result.size);
    item.local = `/images/instagram/${slug}.jpg`;
    item.source = found;
  } catch (e) {
    console.log("SAVE FAIL", slug, e.message);
  }
}

fs.writeFileSync("scripts/tmp-instagram-saved.json", JSON.stringify(items, null, 2));
