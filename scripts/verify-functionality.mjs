async function main() {
  const base = "http://localhost:3000";

  const chat = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: "Hello" }],
      sessionId: `parity-${Date.now()}`,
      pageUrl: `${base}/`,
    }),
  });
  console.log("CHAT", chat.status, (await chat.text()).slice(0, 400));

  const bad = new FormData();
  bad.set("formKey", "contact");
  bad.set("field652327-6b", "Test");
  bad.set("field4d218f-d3", "not-an-email");
  bad.set("field7ef1b0-96", "6045551212");
  const badRes = await fetch(`${base}/api/contact-form`, { method: "POST", body: bad });
  console.log("CONTACT_INVALID", badRes.status, await badRes.text());

  const good = new FormData();
  good.set("formKey", "contact");
  good.set("field652327-6b", "Parity Audit");
  good.set("field4d218f-d3", `parity-audit+${Date.now()}@example.com`);
  good.set("field7ef1b0-96", "6045551212");
  good.set("field02e9e9-ef", "Kosick Audit");
  good.set("field34af12-76", "Automated parity audit - please discard");
  const goodRes = await fetch(`${base}/api/contact-form`, { method: "POST", body: good });
  console.log("CONTACT_VALID", goodRes.status, await goodRes.text());

  const news = new FormData();
  news.set("formKey", "newsletter");
  news.set("field3d8246-7e", `parity-news+${Date.now()}@example.com`);
  const newsRes = await fetch(`${base}/api/contact-form`, { method: "POST", body: news });
  console.log("NEWSLETTER", newsRes.status, await newsRes.text());

  const home = await fetch(`${base}/`);
  const html = await home.text();
  const stripped = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  console.log("HOME", home.status);
  console.log("has_aca_root", /id=["']aca-root["']/.test(stripped));
  console.log("has_aca_launcher", /aca-launcher/.test(stripped));
  console.log("has_gtm_in_html", /GTM-K4QK6SP/.test(html));
  console.log("analytics_enabled_note", "GTM expected off on localhost unless NEXT_PUBLIC_ANALYTICS_ENABLED=true");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
