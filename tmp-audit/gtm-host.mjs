for (const host of ["www.kosick.com", "kc-migrate.vercel.app", "127.0.0.1:3010"]) {
  const response = await fetch("http://127.0.0.1:3010/", { headers: { Host: host } });
  const html = await response.text();
  console.log(host, response.status, "gtm", html.includes("googletagmanager.com/gtm.js"), "title", html.includes("Digital Marketing Agency"));
}
