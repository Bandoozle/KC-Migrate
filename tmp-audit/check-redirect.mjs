const origin = "http://127.0.0.1:3010";
const live = "https://www.kosick.com/ga4-new-generation-google-analytics/";
const local = await fetch(`${origin}/ga4-new-generation-google-analytics/`, { redirect: "manual" });
const remote = await fetch(live, { redirect: "manual" });
console.log("local", local.status, local.headers.get("location"));
console.log("live", remote.status, remote.headers.get("location"));
const html = local.status >= 300 ? "" : await local.text();
console.log("local h1", html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
