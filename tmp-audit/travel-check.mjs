const html = await (await fetch("http://127.0.0.1:3010/travel-marketing-canada/")).text();
const live = [...html.matchAll(/https?:\/\/www\.kosick\.com\/wp-content\/uploads\/2026\/10\/[^"'\\\s)]*/g)].map((match) => match[0]);
console.log("live cruise", [...new Set(live)]);
console.log("og", html.match(/property="og:image" content="([^"]+)"/)?.[1]);
console.log("local img", html.includes("/images/articles/travel-marketing-canada-cruise.jpg"));
console.log("title", html.match(/<title>([^<]+)/)?.[1]);
