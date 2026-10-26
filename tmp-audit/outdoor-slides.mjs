const html = await (await fetch("https://www.kosick.com/services/outdoor-advertising/")).text();
const srcs = [...html.matchAll(/smartmockups[^"'\s]*/gi)].map((match) => match[0]);
console.log([...new Set(srcs)]);
const images = [...html.matchAll(/n2-ss-slide-background-image[\s\S]{0,500}?src=["']([^"']+)/gi)].map((match) => match[1]);
console.log("slide srcs", images);
