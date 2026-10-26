const html = await (await fetch("http://127.0.0.1:3010/travel-marketing-canada/")).text();
const urls = [...html.matchAll(/https?:\/\/www\.kosick\.com\/wp-content[^"'\\\s)]*/g)].map((match) => match[0]);
console.log([...new Set(urls)]);
