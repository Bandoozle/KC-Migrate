for (const path of [
  "/services/outdoor-advertising/",
  "/services/outdoor-advertising/billboard-dimensions/",
]) {
  const html = await fetch("http://127.0.0.1:3001" + path).then((r) => r.text());
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|’/g, "'")
    .replace(/&nbsp;/g, " ");
  const lines = text
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 1 && !line.startsWith("{") && !line.includes("self.__next"));
  const start = lines.findIndex((line) => /outdoor|billboard|strategic/i.test(line));
  console.log("\n====", path, "lines", lines.length);
  console.log(lines.slice(Math.max(0, start), start + 80).join("\n"));
}
