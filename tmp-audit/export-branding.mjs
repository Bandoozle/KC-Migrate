import sharp from "sharp";
import { mkdirSync } from "node:fs";

mkdirSync("public/images/branding", { recursive: true });
const info = await sharp("reference-images/Logistics/298A5513 VK.tif")
  .rotate()
  .resize({ width: 2400, withoutEnlargement: true })
  .jpeg({ quality: 82, mozjpeg: true, progressive: true })
  .toFile("public/images/branding/van-kam-driver-cab.jpg");
console.log(info);
