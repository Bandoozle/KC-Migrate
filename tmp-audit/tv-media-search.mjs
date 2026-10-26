const url = "https://staging.kosick.com/wp-json/wp/v2/media?media_type=video&per_page=50&_fields=source_url,mime_type,title,alt_text";
const response = await fetch(url);
console.log("status", response.status, "total", response.headers.get("x-wp-total"));
const items = await response.json();
if (!Array.isArray(items)) {
  console.log(JSON.stringify(items).slice(0, 400));
} else {
  for (const item of items) {
    console.log(item.title?.rendered, "|", item.source_url);
  }
}
