import { mkdir, writeFile } from "node:fs/promises";

const response = await fetch("https://www.kosick.com/wp-json/wp/v2/posts?slug=travel-marketing-canada&_embed=1");
const post = (await response.json())[0];
const media = post._embedded?.["wp:featuredmedia"]?.[0];
const imageUrl = "https://www.kosick.com/wp-content/uploads/2026/10/travel-marketing-canada-cruise-1536x1024.jpg";
const image = await fetch(imageUrl);
const bytes = Buffer.from(await image.arrayBuffer());
await mkdir("public/images/articles", { recursive: true });
await writeFile("public/images/articles/travel-marketing-canada-cruise.jpg", bytes);

let html = post.content.rendered;
html = html.replace(/https?:\/\/www\.kosick\.com\/wp-content\/uploads\/2026\/10\/travel-marketing-canada-cruise[^"'\s]*/g, "/images/articles/travel-marketing-canada-cruise.jpg");
html = html.replace(/\ssrcset="[^"]*"/g, "");

const local = {
  id: post.id,
  slug: post.slug,
  link: post.link,
  date: post.date,
  modified: post.modified,
  title: post.title,
  excerpt: post.excerpt,
  content: { rendered: html },
  featured_media: post.featured_media,
  _embedded: {
    "wp:featuredmedia": [
      {
        source_url: "/images/articles/travel-marketing-canada-cruise.jpg",
        alt_text: media?.alt_text || post.title.rendered,
        media_details: {
          width: 1536,
          height: 1024,
        },
      },
    ],
  },
};
await mkdir("src/content/articles", { recursive: true });
await writeFile("src/content/articles/travel-marketing-canada.json", JSON.stringify(local));
console.log(JSON.stringify({
  bytes: bytes.length,
  imageStatus: image.status,
  title: post.title.rendered,
  htmlHasWwwUpload: /www\.kosick\.com\/wp-content/.test(html),
  date: post.date,
}));

const contact = await (await fetch("https://staging.kosick.com/contact/")).text();
for (const needle of ["redirect", "success", "email", "11283", "kb-form-success", "admin-ajax"]) {
  const index = contact.toLowerCase().indexOf(needle);
  console.log("needle", needle, index);
}
const redirect = contact.match(/data-kb-redirect[^>]{0,200}|redirectUrl[^,]{0,120}|success_redirect[^,]{0,80}/gi);
console.log("redirects", redirect?.slice(0, 8));
const emails = [...contact.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)].map((match) => match[0]);
console.log("emails", [...new Set(emails)]);
