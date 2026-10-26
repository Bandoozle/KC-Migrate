const queries = ["television", "commercial", "broadcast", "studio", "production", "trane", "sportsnet", "set"];
for (const query of queries) {
  const url = `https://staging.kosick.com/wp-json/wp/v2/media?search=${encodeURIComponent(query)}&per_page=20&_fields=source_url,mime_type,alt_text,media_details`;
  const response = await fetch(url);
  const items = await response.json();
  console.log("\n==", query, response.status, Array.isArray(items) ? items.length : "not-array");
  if (!Array.isArray(items)) continue;
  for (const item of items) {
    const w = item.media_details?.width;
    const h = item.media_details?.height;
    console.log(`${item.mime_type} ${w}x${h} ${item.alt_text || ""} | ${item.source_url}`);
  }
}
