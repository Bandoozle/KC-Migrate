# Launch QA scripts

Checks used for `docs/LAUNCH_READINESS.md`. They run against a local production build, and they never submit a real form, send analytics hits or attempt a payment.

## Setup

Playwright and Lighthouse aren't project dependencies, so install them without saving them to `package.json`. The scripts drive the installed Google Chrome; no browser download is needed.

```bash
npm install --no-save playwright@1.64.1 lighthouse@12
npx next build
npx next start -p 3107
```

Results go to `$QA_OUT`, which defaults to `<os temp>/kosick-launch-qa`.

## Scripts

Run them in this order. `visual.mjs` reads the crawl output.

| Script | What it checks |
| --- | --- |
| `node scripts/launch-qa/crawl.mjs` | Crawls every sitemap URL and internal link, with the production host header. Records the status, title, description, canonical, robots, Open Graph tags, JSON-LD count and stray staging, preview or localhost URLs. |
| `node scripts/launch-qa/visual.mjs` | Loads every 200 page at 390, 768 and 1440px. Reports horizontal overflow, broken images, console errors, failed requests, h1 count, small tap targets and tiny text. Screenshots only the pages with issues. |
| `node scripts/launch-qa/interact.mjs` | Tests navigation, the mobile drawer, contact and newsletter validation, failure and success, analytics events, robots, the payment iframe, the retired-microsite redirects, reduced motion and API validation and rate limits. `www.kosick.com` is mapped to localhost so the host-gated analytics code runs. Google requests are aborted and form success and failure are mocked. Validation requests reach the local API, which rejects them before WordPress. |
| `node scripts/launch-qa/forms-mock.mjs` | The contact and newsletter API against local mocks of Supabase, Resend, Turnstile and the WordPress Kadence relay, in four configurations: default (relay only), dual-write, direct email with Turnstile, and `FORMS_EMAIL=test`. It covers validation, honeypot, fill time, Turnstile, the per-IP and per-recipient limits, duplicate submissions, the newsletter 24-hour repeat rule, email and relay failures, and the retry endpoint. It starts its own server on port 3108, so it needs only `next build` first. Nothing leaves the machine. |
| `node scripts/launch-qa/chat.mjs` | Checks that the closed chat panel is out of the tab order and that the open panel is usable. It sends no message. |
| `node scripts/launch-qa/lh.mjs` | Runs Lighthouse on four pages, mobile and desktop. SEO scores are low on localhost by design, because non-production hosts serve a disallow-all robots.txt. |
