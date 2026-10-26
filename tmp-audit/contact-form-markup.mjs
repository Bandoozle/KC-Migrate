const contact = await (await fetch("https://staging.kosick.com/contact/")).text();
for (const index of [140039, 206640, 206874]) {
  console.log("\n==", index);
  console.log(contact.slice(index - 250, index + 700).replace(/\s+/g, " "));
}
const form = contact.match(/<form[^>]*11283[\s\S]{0,2500}/i)?.[0];
console.log("\nFORM", form?.slice(0, 1800));
