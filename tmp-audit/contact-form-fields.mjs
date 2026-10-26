const contact = await (await fetch("https://staging.kosick.com/contact/")).text();
const start = contact.indexOf('id="kb-adv-form-11283-cpt-id"');
const slice = contact.slice(start, start + 12000);
const interesting = [...slice.matchAll(/redirect|thanks|action=|honeypot|_kb_|email|success|ajax|method=/gi)];
console.log("hits", interesting.map((match) => match[0] + "@" + match.index).slice(0, 40));
const hidden = [...slice.matchAll(/<input[^>]+>/gi)].map((match) => match[0]).filter((tag) => /hidden|redirect|email|action|_kb/i.test(tag));
console.log("\nhidden", hidden.join("\n"));
const button = slice.match(/<button[\s\S]{0,400}<\/button>/i)?.[0];
console.log("\nbutton", button?.replace(/\s+/g, " "));
