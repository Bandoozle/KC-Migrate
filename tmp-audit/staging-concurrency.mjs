const endpoint = "https://staging.kosick.com/wp-json/wp/v2/pages?per_page=1&_fields=id,slug";

async function wave(count) {
  const started = Date.now();
  const results = await Promise.all(
    Array.from({ length: count }, async () => {
      const t = Date.now();
      try {
        const response = await fetch(endpoint, { signal: AbortSignal.timeout(15_000) });
        return { status: response.status, ms: Date.now() - t };
      } catch (error) {
        return { status: "error", ms: Date.now() - t, message: error instanceof Error ? error.message : "error" };
      }
    }),
  );
  const statuses = {};
  for (const result of results) statuses[result.status] = (statuses[result.status] || 0) + 1;
  console.log(JSON.stringify({ count, elapsed: Date.now() - started, statuses, slowest: Math.max(...results.map((result) => result.ms)) }));
}

await wave(4);
await wave(8);

const kml = await fetch("https://staging.kosick.com/locations.kml", { signal: AbortSignal.timeout(15_000) });
const body = await kml.text();
console.log(JSON.stringify({ kmlStatus: kml.status, kmlType: kml.headers.get("content-type"), hasKml: body.includes("<kml"), bytes: body.length }));
