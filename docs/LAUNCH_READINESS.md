# Kosick Communications: Next.js Launch Readiness

**Prepared:** 27 October 2026 · **Branch:** `release/vercel-preview-2026-10-22` · **Next.js:** 16.4.3

**Scope:** replace the WordPress front end at `www.kosick.com` with the Next.js site. WordPress stays in service at `staging.kosick.com`, where it supplies content, media, forms and the AI chat.

**Constraints followed:**
- no DNS changes
- no deployments
- no commits
- no real form submissions
- no payments
- no changes to the live WordPress site

---

## 1. Executive summary

**Recommendation: NO-GO for DNS cutover today.** The code is ready to deploy, but cutover is not. Two launch blockers remain, and code alone can't close either:

1. **Unconfirmed lead delivery.** Every lead path goes through the WordPress install at `staging.kosick.com`: the contact form, newsletter and AI-chat lead. No one has yet confirmed that a submission sent through the new site reaches the inbox.
2. **Staging becomes production infrastructure.** `staging.kosick.com` permanently serves the site's content, images, forms and chat. Someone has to own it as production: keep it up and unlocked, monitor it, and keep it out of Google's index.

**Two launch blockers were fixed in this pass:**
- **Critical Next.js vulnerabilities.** These included remote code execution and server-side request forgery in the image optimizer, which this site uses. Fixed by upgrading to 16.4.3; `npm audit` now reports 0 vulnerabilities.
- **WordPress redirects served as duplicate pages.** Old URLs were served as 200 pages showing another page's content. Superseded by the route cleanup below: the site no longer renders or proxies arbitrary WordPress URLs at all.

**Route surface cleanup (§11):** the three retired event microsites (`/comfortmaker/`, `/mexico-2026-welcome-itinerary/`, `/uncorked/`) and the Comfortmaker passport-collecting registration form are removed and redirect to `/corporate-events/`. The catch-all route now serves only an explicit list of 47 articles, so WordPress archives, attachment pages, feeds, search results and `wp-*` files return 404 instead of rendering as indexable pages.

**WordPress independence (§12):** page and article content (Phase 1) and all media (Phase 2) are now local. With WordPress unreachable and blocked in the browser, every page returns 200 with no broken images or videos. The contact form, newsletter and chat still depend on WordPress (Phases 3–4).

**Ten launch-important issues were also fixed:**
- GA4 lead events never reached GA4.
- Client-side page views were skipped.
- The 404 page showed the old WordPress footer with wrong links.
- The API had no rate limiting.
- Comfortmaker uploads would fail on Vercel.
- The newsletter event broke parity with WordPress.
- Two form-handling gaps: a weak success check and a missing honeypot.
- Keyboard focus could reach the hidden chat panel.
- Articles had duplicate `<h1>` headings.
- Redirected URLs were still listed in the sitemap and listings.

**Verification:**
- **Static checks:** typecheck, lint and production build pass.
- **Crawl:** 98 URLs after the §11 cleanup, with zero broken internal links and zero SEO mismatches against the saved Rank Math snapshot.
- **Visual sweep:** 77 pages at 3 widths found zero horizontal overflow (run before §11; not re-run, as §11 changed no layout).
- **Interaction suite:** 52/52 checks pass, plus 2/2 chat checks.

**Not verified:** nothing here confirms real-world email delivery, GA4 or Google Ads receipt, or a payment. Those need the live tests in section 5.

---

## 2. Issues found, by severity

**Key**
- **P0:** launch blocker.
- **P1:** important before launch.
- **P2:** can wait.
- **Fixed** means fixed locally and tested. **Open** means it still needs action.

### P0: Launch blockers

| ID | Issue | Status |
| --- | --- | --- |
| P0-1 | **Next.js 16.3.5 had critical advisories.** They included RCE in the image optimizer with SVGs, SSRF in image optimization, and SSG/ISR cache poisoning. The site serves every remote image through `next/image`. | **Fixed:** upgraded to 16.4.3; `npm audit` reports 0 vulnerabilities. |
| P0-2 | **WordPress redirects became duplicate 200 pages.** The catch-all route followed WordPress redirects on the server and served the target's content under the old URL, with a self-referencing canonical. Example: `/services/media-buying/` showed an article. A page was also found by its last URL segment alone, so `/anything/contact/` rendered the Contact page. | **Fixed, then superseded (§11):** the catch-all no longer asks WordPress about unknown paths. It serves only listed articles; known redirects live in `src/lib/legacy-redirects.ts`; everything else is a 404. |
| P0-3 | **Form, newsletter and chat-lead delivery is unverified.** All are relayed server-side to `staging.kosick.com`: Kadence via `admin-ajax.php` and chat via `aca/v1`. (The Gravity Forms relay was removed with Comfortmaker, §11.) Recipients, mail transport (SMTP or plugin) and any reCAPTCHA live in WordPress settings that code can't see. If staging's mail is disabled, leads are lost silently: WordPress saves the entry and the visitor sees success, but nobody is notified. | **Open:** live test needed (§5.1). |
| P0-4 | **Staging becomes a permanent production dependency.** `staging.kosick.com` serves page content, nearly all images, forms and chat. If it goes down, is password-protected, enters maintenance mode or is renamed, the public site breaks. `WORDPRESS_URL` must never be set to `https://www.kosick.com`, because after cutover the site would fetch from itself. | **Open:** needs an owner decision and monitoring (§6). |

### P1: Important before launch

| ID | Issue | Status |
| --- | --- | --- |
| P1-1 | **Lead events from three forms never reached GA4.** Newsletter, chat-lead and Comfortmaker success called `gtag()`. Only GTM is loaded and nothing defines `window.gtag`, so the fallback pushed `{event:"gtag_event"}`, which GA4 ignores. | **Fixed:** the fallback now queues a real gtag command, the same `dataLayer.push(arguments)` stub Site Kit used, which the container's Google tag (G-XPYR1CEF3E) processes. |
| P1-2 | **Newsletter event didn't match WordPress.** On WordPress, the container's custom HTML tag pushes `kosick_newsletter_signup` (not a lead). The Next.js site would have sent `generate_lead`, a new lead conversion. | **Fixed:** pushes `kosick_newsletter_signup` with `kb_form_id: kb-adv-form-11281-cpt-id` and `lead_email`, the same as WordPress. |
| P1-3 | **SPA page views skipped between route groups.** Each route group mounts its own page shell, so going from the home page to a service page remounted the page-view tracker, which skipped it as a "first load". | **Fixed:** the last tracked path now survives remounts. Tested: one `page_view` per client-side navigation. |
| P1-4 | **The 404 page used the old WordPress shell.** It showed the legacy WordPress footer with wrong mappings (Media Buying → Social Media, Website Development → Television, and so on), had no click tracking, and fetched the staging home page on every 404. | **Fixed:** native 404 with the site header and footer, `noindex`, and links to Home and the Site Map. |
| P1-5 | **Redirected URLs were still listed.** `/ga4-new-generation-google-analytics/` redirects (308) but was in `sitemap.xml`, the Site Map page and Feature Articles. `/vancouver-event-marketing/` linked to the redirected `/corporate-events-group-travel/`. | **Fixed:** one shared redirect list now drives `next.config.ts`, and redirected sources are left out of the sitemap and listings. Article links go straight to the destination. The final crawl found 0 internal links to non-200 URLs. |
| P1-6 | **No abuse controls on the API routes.** `/api/chat` relays to the paid AI backend with no throttle. WordPress sees every request as coming from Vercel, so any per-IP limits on the plugin side stop working. | **Fixed (partly):** per-IP limits in the app (chat 20/min, leads 5 per 10 min, chat outcome 30/min), returning 429. They are per server instance. **Still to do:** add a Vercel Firewall rate-limit rule (§6). |
| P1-7 | **Comfortmaker passport uploads would fail on Vercel.** The form allowed 100 MB per file, but a Vercel function rejects request bodies over 4.5 MB, and two phone photos easily exceed that. | **Fixed:** the browser downscales large photos (longest edge 2,400 px, JPEG quality 0.85). Files that are still over 2 MB, such as a large PDF, get a clear field error before upload. The hint text now says "up to 2 MB". **Superseded (§11):** the form and its upload path are removed. |
| P1-8 | **Gravity Forms success could be inferred from an error response.** "Thank you"-style text counted as success even on a non-200 response. | **Fixed:** body-based success also requires HTTP 200. |
| P1-9 | **The newsletter had no spam honeypot.** | **Fixed:** added the same server-checked honeypot the contact form uses. |
| P1-10 | **The hidden chat panel was focusable.** It was `aria-hidden` but its controls stayed in the tab order, so keyboard users tabbed into an invisible dialog. | **Fixed:** the panel is `inert` while closed. Tested both open and closed. |
| P1-11 | **Staging is fully indexable.** It has `index, follow`, self-canonical `staging.kosick.com` URLs, and robots.txt allows everything. After launch it would be a complete duplicate of the site. | **Open:** add a Cloudflare response-header rule for host `staging.kosick.com`: `X-Robots-Tag: noindex, nofollow`. It doesn't change the HTML Next.js fetches. Don't use WordPress "Discourage search engines" without testing, because it changes the HTML. |
| P1-12 | **No privacy policy.** `/privacy-policy/` returns 404 on both the live and new site. The forms collect names, emails and phones, and WordPress still holds the passport images collected by the retired Comfortmaker form (§11). This is PIPEDA exposure. | **Open:** legal copy needed from Kosick. Not written here. |
| P1-13 | **GA4 and GTM configuration can't be verified from code.** Specifically: (a) client-side navigations rely on GA4 enhanced measurement's "page changes based on browser history events", because the container has no trigger for the app's `page_view` push; (b) chat-lead and Comfortmaker success now send `generate_lead` (with `form_name`), which WordPress never did; (c) nothing in the container sends `kosick_newsletter_signup` to GA4, which matches WordPress today. | **Open:** check in GA4 Admin and GTM Preview (§5.3). Decide whether to keep (b). |
| P1-14 | **Some article bodies used `<h1>` for section headings.** Three articles had two to four `<h1>`s each. | **Fixed:** body `<h1>`s are demoted to `<h2>`, matching their sibling headings and the table of contents. |

### P2: Can wait

| ID | Issue | Status |
| --- | --- | --- |
| P2-1 | **Deprecated `middleware.ts`.** Next 16 renamed the convention. | **Fixed:** renamed to `src/proxy.ts`; the build shows no warnings. |
| P2-2 | **Broken media on event microsites.** On `/uncorked/`, `/comfortmaker/` and `/mexico-2026-welcome-itinerary/`, several images (for example `2024/07/iStock-1145651678.webp` and `2025/05/IMG_6248-…jpg`) return 404 on **both** live and staging. This already exists on the live site. | **Closed (§11):** the microsites are removed. |
| P2-3 | **Dead or private Vimeo videos in articles.** `1161641026` on `/connected-tv-advertising-canada/` returns 404 and `1161323954` on `/hvac-marketing-fortisbc-co-op-advertising/` returns 401. The home hero video (`911448655`) and `1053936580` load for `www.kosick.com` but are blocked (403) on preview domains, so they show errors on Vercel previews only. | **Open:** content fix. Add preview domains to Vimeo's allow-list if wanted. |
| P2-4 | **`/services/creative/` is `index, nofollow`.** This comes from the Rank Math snapshot, so it matches the live site. | **Open:** confirm it's intended. |
| P2-5 | **The sitemap is a frozen snapshot.** It lists the 73 indexable URLs captured from Rank Math on 22 October 2026, so posts published later won't appear until it's refreshed. | **Open:** refresh the snapshot when publishing, or build the sitemap live. Since §12 Phase 1, a new post must also be exported to `src/content/articles/` with `scripts/export-wordpress-content.mjs`, or it returns 404. |
| P2-6 | **Some WordPress-only paths render with the legacy footer.** Paths like `/category/uncategorized/` and `/feature-articles/page/2/` return 200 through the WordPress shell, with the legacy footer and a self-canonical. Live WordPress behaves the same. | **Fixed (§11):** these paths return 404; `/feature-articles/page/N/` redirects to `/feature-articles/`. |
| P2-7 | **Brand accent colours fail contrast.** Accent labels (for example `#e2532d` and `#d93b30` on light backgrounds) fail WCAG AA contrast on `/services/` and the HVAC page. Lighthouse accessibility scores 96 there and 100 elsewhere. | **Open:** design decision. Not changed. |
| P2-8 | **Desktop dropdown keyboard behaviour.** Focus opens the dropdown, and Enter then toggles it closed. Tab still reaches every link. | **Open:** minor accessibility refinement. |
| P2-9 | **Uncorked microsite has no `<h1>`.** This comes from the WordPress content. | **Closed (§11):** the microsite is removed. |
| P2-10 | **Every page is rendered on demand.** Responses are `no-store`, and WordPress data is cached for 120 s in the Data Cache. Time to first byte (TTFB) depends on Vercel functions. Lighthouse LCP is 3.4–6.3 s on localhost, with simulated throttling and images coming from staging. | **Open:** consider ISR or static rendering for marketing pages after launch. |
| P2-11 | **Hero images are slow to paint.** Hero photos are plain `<img>` tags loaded straight from staging, not optimized. | **Partly fixed:** the first slide now gets `fetchPriority="high"` (home LCP went from 5.1 s to 3.4 s on mobile). Format and size optimization can wait. |
| P2-12 | **Email DNS posture (pre-existing, outside this project).** SPF covers two server IPs and Elastic Email but not `include:_spf.google.com`. DMARC is `p=none`. There's no `google._domainkey` DKIM record. | **Open:** for whoever manages Workspace. Don't change it as part of cutover. |
| P2-13 | **`.env.example` was never committed.** The `.env*` ignore rule caught it, and its analytics comment was wrong. | **Fixed:** `!.env.example` was added to `.gitignore`, and the comment is corrected. |
| P2-14 | **Minor inconsistencies.** Phone links use both `tel:+16049255800` and `tel:16049255800`. Footer "Our Company" goes to `/`. One article has an `href="#"`. 3 old lint warnings remain. | **Open:** cosmetic. |
| P2-15 | **No cookie consent.** There's no consent banner or Consent Mode, the same as the live site (which has neither). | **Open:** a legal or policy decision to make alongside P1-12. |

---

## 3. Issues fixed, with changed files

| Fix | Files |
| --- | --- |
| Next.js security upgrade (P0-1) | `package.json`, `package-lock.json` (`next` and `eslint-config-next` at 16.4.3 exact, plus `npm audit fix` for sharp, undici and source-map-js) |
| Real redirects and permalink matching (P0-2) | `src/lib/render-wordpress-page.tsx` (`probeWordPressPath`, `pageMatchesPath`) and `src/app/[...slug]/page.tsx`, where `/home/` is now a permanent redirect |
| GA4 gtag stub, newsletter event parity, and click-tracking comments (P1-1, P1-2) | `src/lib/analytics/track.ts`, `src/components/layout/SiteFooterNewsletter.tsx` |
| SPA page views (P1-3) | `src/components/analytics/AnalyticsPageViews.tsx` |
| Native 404 (P1-4) | `src/app/not-found.tsx` |
| Shared legacy-redirect list (P1-5) | New `src/lib/legacy-redirects.ts`. Updated: `next.config.ts`, `src/app/sitemap.ts`, `src/lib/wordpress/site-map.ts`, `src/lib/wordpress/feature-articles.ts`, `src/lib/wordpress/normalize-article-html.ts` |
| Rate limiting (P1-6) | New `src/lib/rate-limit.ts`. Updated: `src/app/api/chat/route.ts`, `src/app/api/chat/lead/route.ts`, `src/app/api/chat/outcome/route.ts`, `src/app/api/contact-form/route.ts`, `src/app/api/gravity-form/route.ts` |
| Comfortmaker upload guard (P1-7) | `src/components/microsites/ComfortmakerRegistrationForm.tsx` (deleted in §11) |
| Gravity Forms success gating (P1-8) | `src/app/api/gravity-form/route.ts` (deleted in §11) |
| Newsletter honeypot (P1-9) | `src/components/layout/SiteFooterNewsletter.tsx` |
| Chat `inert`, star rating role, and video button name (P1-10 plus the Lighthouse items) | `src/components/chat/ChatWidget.tsx`, `src/components/home/HomeTestimonials.tsx`, `src/components/sections/hvac/VimeoFeature.tsx` |
| Article heading levels (P1-14) | `src/lib/wordpress/normalize-article-html.ts` |
| Proxy rename (P2-1) | `src/middleware.ts` → `src/proxy.ts` |
| Hero LCP priority (P2-11) | `src/components/sections/HeroBanner.tsx` |
| Environment example (P2-13) | `.env.example`, `.gitignore` |
| Repeatable QA scripts | New `scripts/launch-qa/` (`crawl.mjs`, `visual.mjs`, `interact.mjs`, `chat.mjs`, `lh.mjs`, `README.md`) |

The working tree also has an unrelated earlier change: the HVAC Lead Generation closing CTA now uses the shared `PageCta`, in `src/components/sections/hvac-lead/*`. Nothing is committed.

---

## 4. Tests run and results

All tests ran against a local production build (`next build` then `next start`). The crawls send the `Host: www.kosick.com` header so production-only behaviour runs.

### Static checks and dependencies

| Check | Result |
| --- | --- |
| TypeScript (`tsc --noEmit`) | Pass |
| ESLint (`src`, `scripts/launch-qa`) | 0 errors. 2 old warnings in `Reveal.tsx` (a false positive: the alt text arrives through spread props) and `service-page-parse.ts` |
| Production build | Pass: 38/38 pages after §11 (was 42 with the microsites and the Gravity Forms route), no warnings, `ƒ Proxy` registered |
| `npm audit` | 0 vulnerabilities (was 1 critical and 3 high) |
| Unit test suite | **None exists.** `package.json` has no test script. |

### Routes and SEO (`scripts/launch-qa/crawl.mjs`)

| Check | Result |
| --- | --- |
| Crawl coverage | 82 URLs crawled from the sitemap, internal links and probes. 77 return 200; the 5 404s are deliberate probes (privacy and terms paths, and a nonsense URL) |
| Live sitemap parity | All 75 live-sitemap URLs return the same URL, except the deliberately redirected GA4 article (308) and `/locations.kml`, which the crawler doesn't fetch |
| Internal links | 0 to non-200 URLs |
| Sitemap | `sitemap.xml` has 73 URLs, without the redirected article. `sitemap_index.xml` points to it |
| SEO snapshot comparison | 0 mismatches. Every snapshot page matches the Rank Math title, description, canonical, robots and og:image, and has JSON-LD. No duplicate titles |
| Leaked hosts | No staging, `vercel.app` or localhost URLs in links. Staging appears only in image URLs, by design (P0-4) |
| robots.txt | The production host allows crawling and lists `sitemap_index.xml`; non-production hosts disallow everything |
| Redirect probes | `/home/` → `/` (308). `/services/media-buying/` → the media-buying article (308). Apex → www (308). Trailing slash added (308). Since §11: `/blog/` → `/feature-articles/`, and `/foo/thanks/` is a 404 (WordPress's slug guessing is no longer passed on) |
| Route surface (§11, re-run 28 Oct) | 98 URLs crawled: 74 return 200 (the 73 sitemap URLs plus `/thanks/`), 5 redirect (the three microsites, `/blog/`, `/feature-articles/page/2/`), 19 return 404 as intended. 0 internal links to non-200 or redirecting URLs; no sitemap entry redirects or 404s. A second probe of 169 URLs (all 137 root attachment slugs, an attached-media URL, archives, paged and feed variants, embeds, `wp-*` files, nested and wrong-parent paths, and every legacy redirect) returned no 200: 162 were 404s and 7 were the expected redirects. `/wp-content/uploads/` images, `robots.txt`, both sitemaps and `locations.kml` still return 200 |

### Visual sweep (`visual.mjs`)

231 page loads: 77 pages at 390, 768 and 1440px.

| Check | Result |
| --- | --- |
| Horizontal overflow | **0** |
| Broken images | Only on the 3 event microsites, with files missing on live too (P2-2) |
| Console errors and failed requests | Vimeo only (P2-3) |
| `<h1>` count | Exactly one on every page except `/uncorked/` (P2-9) |
| Images without alt | 0 |
| Small tap targets at 390px | 1 (an inline "TV" text link) |

Screenshots of the pages with issues were saved under the QA output folder; none show layout bugs. The sweep ran before the final non-layout changes (ARIA, `inert`, event names, `fetchPriority`).

### Interaction and integration (`interact.mjs`, `chat.mjs`)

54/54 pass after §11: 52 in `interact.mjs` and 2 in `chat.mjs`. The Comfortmaker upload check was replaced by three retired-microsite redirect checks, and the Gravity Forms API check now confirms the route is gone. Analytics checks ran with every Google request aborted.

**Navigation**
- Desktop dropdown: hover, mouse-out, Escape, keyboard focus, and Tab into the panel.
- Mobile drawer: open, one section at a time, Contact and social icons on one row, Escape, and a link that navigates and closes the drawer.

**Contact form**
- Server field errors on an empty submit.
- Invalid email rejected.
- A failed submit (mocked 502) shows an error, with no redirect and no lead event.
- A successful submit (mocked) goes to `/thanks/` with **exactly one** `kosick_contact_lead` and no duplicate `generate_lead`.

**Newsletter**
- A failed submit shows an error and sends no event.
- A successful submit sends one `kosick_newsletter_signup` with the WordPress payload.
- The honeypot is present.

**Analytics**
- GTM loads only on the production host.
- Exactly one `page_view` per client-side navigation.
- No `gtag_event` pseudo-events.
- One `phone_click` and one `email_click` per click.
- An earlier run on this build also confirmed the gtag stub queues a real `Arguments` command for `generate_lead`.

**API**
- Unknown form, missing fields, bad email and a filled honeypot each return 400 **before** anything is forwarded to WordPress.
- `/api/gravity-form/` no longer exists; a form POST is rejected (409) and nothing is forwarded.
- Chat with bad JSON or no messages returns 400.
- A chat lead without a name returns 400.
- Rate limit: requests 1–5 return 400 and the 6th returns 429; other IPs are unaffected.

**Payments, uploads, motion and chat**
- Square checkout iframe: correct merchant and checkout ID, the frame loads, and the footer link is present. No payment was attempted.
- Retired microsites: `/comfortmaker/`, `/mexico-2026-welcome-itinerary/` and `/uncorked/` land on `/corporate-events/`, with no file input on the page.
- Reduced motion on the home, HVAC and connected-TV pages: no infinite animations and no hidden content.
- Keyboard: the first Tab focuses the logo link.
- Chat: closed, the panel is `inert` and unreachable by Tab; open, it is usable.

### Lighthouse (`lh.mjs`, localhost, simulated throttling)

| Page | Mobile perf / a11y / best practices | Desktop perf / a11y / best practices | LCP (mobile) |
| --- | --- | --- | --- |
| `/` | 90 / 100 / 79 | 68 / 100 / 78 | 3.4 s |
| `/services/` | 78 / 96 / 100 | 65 / 96 / 100 | 5.5 s |
| `/services/hvac-marketing/` | 84 / 96 / 100 | 67 / 96 / 100 | 4.2 s |
| `/contact/` | 80 / 100 / 100 | 67 / 100 / 100 | 5.1 s |

- **Layout stability:** CLS ≤ 0.001 and TBT ≤ 60 ms everywhere.
- **SEO 69:** expected, because localhost serves the disallow-all robots.txt.
- **Best practices 79 on `/`:** the Vimeo embed is refused on localhost.
- **Accessibility below 100:** brand-colour contrast only (P2-7).

### Not tested (and not claimed)

- Real email delivery.
- Real GA4 or Google Ads hits.
- A real chat submission.
- A payment.
- Behaviour on Vercel infrastructure: body limits, regions, the Data Cache.
- Real phones (only emulated viewports were used).
- Safari and Firefox (Chrome only).

---

## 5. Needs manual testing

Run these on the Vercel production deployment, either on its `*.vercel.app` URL before cutover or on `www.kosick.com` straight after. Each needs Kosick's approval, because they send real data.

### 5.1 Lead delivery (P0-3)

Run each test once, labelled **"MIGRATION TEST – please ignore"**, and confirm the WordPress entry, the notification email(s) to the right recipients, and the SPF/DKIM result in the email headers:
1. Contact form on `/contact/` and on the home page. Expect a redirect to `/thanks/`.
2. Footer newsletter signup.
3. AI chat: a short conversation, then the lead form.

Comfortmaker registration is no longer part of the site (§11), so it isn't tested.

If any form has reCAPTCHA or Akismet enabled in WordPress, check that the relayed submission isn't rejected. The site shows an error rather than a false success, but the lead would still be lost.

### 5.2 Pay Your Invoice

- Open `/online-payments/` on desktop and phone, and confirm the Square checkout renders and accepts input.
- The checkout URL is the same one the live page embeds, so no new payment flow exists. A live payment test is only needed if Kosick wants end-to-end proof; if so, Kosick should pay a small test amount and refund it in Square.

### 5.3 Analytics (P1-13)

Use GTM Preview or Tag Assistant on `www.kosick.com` after cutover, or force analytics on for a preview session with `NEXT_PUBLIC_ANALYTICS_ENABLED=true` (on a preview only).
- **Page loads:** check that the Google tag (G-XPYR1CEF3E), the Ads Google tag and the Conversion Linker fire once.
- **Client-side navigation:** in GA4 Admin, under Data streams → Enhanced measurement, confirm that "Page changes based on browser history events" is **on**. Otherwise navigations after the first page aren't counted.
- **Contact form:** `kosick_contact_lead` should fire GA4 `generate_lead` plus the Ads conversion (`a619CO…`), once.
- **Phone and email:** a `tel:` click should fire GA4 `phone_click` plus the Ads call conversion (`ZX2WCM…`). A `mailto:` click should fire GA4 `email_click` plus the Ads conversion (`vL_HCO…`). Each once.
- **Decide on the new lead events:** keep or remove `generate_lead` for chat leads (`form_name` identifies them). Decide whether `kosick_newsletter_signup` should get a GA4 tag.

### 5.4 Other manual checks

- Home hero video plays on `www.kosick.com`.
- Real-device check on iOS Safari and Android Chrome: menu, forms, chat, hero video.
- Search Console: submit `https://www.kosick.com/sitemap_index.xml`, inspect 5–10 key URLs, and watch Coverage for 2 weeks.

---

## 6. External credentials and access still needed

| Need | Why |
| --- | --- |
| **Vercel** project owner access (Production) | Set environment variables, add domains, create a Firewall rate-limit rule, promote or roll back deployments |
| **Cloudflare** DNS for `kosick.com` | Export the zone, change the `www` and apex records, add the staging `X-Robots-Tag` header rule |
| **WordPress admin** on staging | Check form recipients and mail transport, reCAPTCHA, the chat plugin, missing media. Confirm the site isn't password-protected or in maintenance mode |
| **Hosting** for staging's origin | Uptime monitoring and backups, now that it's production infrastructure |
| **GTM** (GTM-K4QK6SP) and **GA4** (G-XPYR1CEF3E) editor access | Preview verification, the enhanced-measurement setting, lead-event decisions |
| **Google Ads** (AW-785313466) | Confirm conversions keep recording after cutover |
| **Google Search Console** | Submit the sitemap and monitor indexing |
| **Square** | Only if a live payment test is wanted |
| **Vimeo** | Fix the private or deleted videos; optionally allow preview domains |
| **Kosick (legal or policy)** | Privacy policy (and consent) copy |

---

## 7. Production deployment steps

**Variables (Production):**
- `WORDPRESS_URL=https://staging.kosick.com` is required. **Never** set it to `www.kosick.com`.
- Leave `NEXT_PUBLIC_ANALYTICS_ENABLED` **unset**; analytics turns on from the host name.
- `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID` and `NEXT_PUBLIC_WORDPRESS_URL` are optional; the code defaults to the IDs above.
- No secrets are required.

### Before cutover day

1. **Get approval, then commit and open a PR** from `release/vercel-preview-2026-10-22` to `main`. Review it, and merge only with Kosick's approval.
2. **In Vercel:**
   - Confirm Framework = Next.js, Node 20 or later, and that the production branch is `main`.
   - Set the Production environment variables above.
   - Optionally set the function region near the WordPress origin, to reduce server-to-WordPress latency.
3. **Add a Vercel Firewall rate-limit rule** for `/api/*`, for example 60 requests per minute per IP, or tighter for `/api/chat`.
4. **Deploy to Production.** It's served on the project's `*.vercel.app` domain, so the public site is unaffected. Smoke-test there:
   - key pages return 200
   - `/robots.txt` disallows everything (expected on non-production hosts)
   - forms show validation errors
5. **Run the §5.1 lead-delivery tests** against the Vercel URL. **Go/no-go gate:** don't continue unless every lead path delivers.
6. **In Cloudflare:**
   - Export the zone file as a rollback record.
   - Write down the current `www` and apex records exactly.
   - Add the staging `X-Robots-Tag: noindex, nofollow` response-header rule.

### Cutover (low-traffic window)

7. **In Vercel → Domains:**
   - Add `www.kosick.com` as the primary domain.
   - Add `kosick.com` with a 308 redirect to `www`. `src/proxy.ts` enforces this too.
   - Note the exact DNS targets Vercel shows.
8. **In Cloudflare, change only these two records:**
   - `www` → CNAME to the Vercel target, e.g. `cname.vercel-dns.com`.
   - Apex `kosick.com` → A to the Vercel IP, e.g. `76.76.21.21` (or CNAME flattening).
   - Set both **DNS only (grey cloud)**. If they must stay proxied, set SSL/TLS to **Full (strict)** and bypass cache for HTML.
9. **Don't touch any other record:**
   - the five MX records (`aspmx.l.google.com` and its alternates)
   - `google-site-verification` TXT
   - SPF TXT
   - `_dmarc` TXT
   - `staging` A records
   - any other mail or verification records
10. **Wait for Vercel to issue certificates** for both hosts, then run §8.

## 8. Post-launch verification (first hour, then day 1, 7 and 14)

- `curl -I https://kosick.com/` → 308 to `https://www.kosick.com/`. `http://` → https.
- `/`, `/services/`, `/contact/`, `/online-payments/` and three articles return 200.
- `/robots.txt` lists `Sitemap: https://www.kosick.com/sitemap_index.xml`. `/sitemap.xml` has 73 URLs. `/locations.kml` returns 200.
- Page source on `www`: canonical is `https://www.kosick.com/...`, there's no `noindex` on indexable pages, and GTM loads.
- Run `node scripts/launch-qa/crawl.mjs` against production (change `BASE`). Expect 0 internal links to non-200 URLs.
- Run the §5.1 and §5.3 checks on `www`. Confirm a test email arrives.
- Square checkout renders. The chat answers one message.
- **Email:** send to and from a `@kosick.com` address. MX is untouched, but confirm it.
- **Vercel logs, first 24 h:** 5xx rate, 429 counts, and WordPress fetch errors.
- **Search Console, days 1–14:** indexing, Coverage errors, and that `staging.kosick.com` URLs start dropping out.
- **GA4 Realtime and Ads conversions:** compare volumes with the same weekday before cutover.

---

## 9. Rollback plan

Live WordPress at `www.kosick.com`'s origin isn't modified by this migration, so rollback is a DNS change.

1. **Trigger:** lead delivery fails, 5xx errors persist, there's a broken key flow, or analytics stop.
2. **In Cloudflare,** restore the original `www` and apex records saved in step 6, with the original proxy status. Proxied records take effect within seconds or minutes; DNS-only records follow their TTL.
3. **In Vercel,** remove the domains or leave them. Vercel no longer receives traffic once DNS points back.
4. **Verify** that `https://www.kosick.com/` is the WordPress site again and that a test contact submission arrives.
5. **For a code-only problem with DNS still on Vercel,** use **Vercel Instant Rollback** to the previous Production deployment instead.
6. **Nothing needs undoing in GA4, GTM, Search Console or Square.** URLs, tag IDs and the checkout are identical on both stacks.

**Prerequisite for a reliable rollback:** keep the live WordPress origin running unchanged for at least 30 days after cutover.

---

## 10. GO / NO-GO

**Code: GO for a Production deployment on Vercel's own domain.**
- All P0 and P1 code issues that could be fixed locally are fixed and tested.
- No known layout bugs remain at 390, 768 or 1440px.

**DNS cutover: NO-GO** until these are done:
1. **P0-3:** every lead path (contact, newsletter, chat lead) confirmed delivering through the new site.
2. **P0-4:** `staging.kosick.com` formally owned as production infrastructure: monitoring, backups, no password or maintenance lock, `WORDPRESS_URL` confirmed.
3. **P1-11:** the staging `noindex` header rule in place.
4. **P1-13:** GTM Preview checks pass, and the enhanced-measurement history setting is confirmed.
5. **P1-12:** Kosick has made a decision on the privacy policy. Launching without one matches the live site, but it's a known risk.

When those five are done, the recommendation becomes **GO**, using the steps and rollback above.

---

## 11. Route surface cleanup (27 October 2026)

An orphan-route audit found that the new site served far more than its 73 sitemap pages. The catch-all route rendered **any** path WordPress answered with 200, with no `robots` tag (WordPress's own `noindex` wasn't carried over), so these were indexable on the new domain:

- 137 media attachment pages at root URLs (for example `/travel/`, `/conference-mexico/`, `/cabo/`, `/logo-placeholder-png/`)
- category, tag, author, date and search archives (`/category/latest/`, `/author/bretton/`, `/2026/`, `/search/…/`, `/page/2/`)
- `/feed/`, `/comments/feed/` and `/wp-login.php`

The three event microsites were also live. `/comfortmaker/` still accepted the NEE Mexico 2026 registration (April 18–25, 2026, now past), which collected passport images, birth dates, genders and home addresses and relayed them to Gravity Form 9. They were `noindex` and absent from the navigation, but the public Site Map page linked to all three under "Client events".

### Removed

| What | Files |
| --- | --- |
| `/comfortmaker/` (NEE Conference registration, Gravity Form 9) | `src/app/comfortmaker/`, `ComfortmakerPageView`, `ComfortmakerRegistrationForm` |
| `/mexico-2026-welcome-itinerary/` (NEE Conference itinerary) | `src/app/mexico-2026-welcome-itinerary/`, `MexicoItineraryPageView` |
| `/uncorked/` (Uncorked Invitational golf event, August 2025) | `src/app/uncorked/`, `UncorkedPageView` |
| Shared microsite code | the rest of `src/components/microsites/` (hero, related band, font), `src/lib/wordpress/microsites.ts` |
| Gravity Forms relay (served only Comfortmaker) | `src/app/api/gravity-form/route.ts`, `src/lib/wordpress/gravity-forms.ts`, the `comfortmaker` entry in `FORM_NAMES` |
| WordPress page fallback | `src/lib/render-wordpress-page.tsx`, `src/lib/wordpress-body-class.ts`, and the code only it used: `src/components/wordpress/` (`WordPressShell` and its 6 parts) plus `wordpress-document`, `wordpress-assets`, `wordpress-html`, `wordpress-urls`, `wordpress-countup`, `wordpress-tabs`, `wordpress-instagram`, `wordpress-smartslider`, `wordpress-typography`, `wordpress-why-choose`, `kosick-post-wp-css` and `wordpress/legacy-hero` in `src/lib/`. `kosick-typography-system.ts` is kept because the CSS cites it as the token reference |
| One-off microsite audit scripts | `scripts/audit-gf-comfortmaker.mjs`, `scripts/audit-microsites.mjs`, `scripts/audit-microsites-deep.mjs` |
| Snapshot SEO entries for the three microsites | `src/lib/seo/rank-math-snapshot.json` |

No WordPress content, form entry or media file was touched. The `/wp-content/` images the microsites used still exist, and images on other pages (for example `conference-mexico.webp` on Corporate Events) still load.

### Blocked

`src/app/[...slug]/page.tsx` now renders only slugs in `PUBLIC_ARTICLE_SLUGS` (`src/lib/public-routes.ts`): the 46 published WordPress posts that aren't redirected, plus the local `/travel-marketing-canada/`. It doesn't contact WordPress for any other path. Every page in WordPress has a native route, so no WordPress page needed the fallback.

These now return 404 (tested): category, tag and author archives; `/search/…/`; `/page/N/` and `/*/page/N/`; `/feed/`, `/comments/feed/`, `/*/feed/`, `/*/embed/`; date archives; `/wp-login.php`, `/wp-admin/`, `/wp-json/`, `/wp-cron.php`, `/xmlrpc.php` and other `wp-*.php`; all 421 attachment URLs WordPress lists; wrong-parent paths such as `/anything/contact/`; arbitrary nested paths.

Unchanged: the `/wp-content/` and `/wp-includes/` rewrites (images), and the server-side calls to WordPress REST, `admin-ajax.php` (contact and newsletter) and `aca/v1` (chat). Those go straight to `WORDPRESS_URL` and never through the public routes.

The project doesn't reference `/feed/` anywhere, so it now returns 404.

### Redirects (`src/lib/legacy-redirects.ts`, all permanent)

| Source | Destination | Note |
| --- | --- | --- |
| `/comfortmaker/`, `/mexico-2026-welcome-itinerary/`, `/uncorked/` | `/corporate-events/` | new |
| `/blog/` | `/feature-articles/` | new (WordPress guessed an article) |
| `/feature-articles/page/:page*` | `/feature-articles/` | new |
| `/page-sitemap.xml`, `/post-sitemap.xml` | `/sitemap.xml` | new (old Rank Math sitemap files) |
| `/services/media-buying/` | `/blog-media-buying-canada-tv-streaming-radio/` | Rank Math redirect, previously passed through from WordPress |
| `/home/` | `/` | moved from the catch-all into the list |
| `/ga4-new-generation-google-analytics/`, `/corporate-events-group-travel/` | unchanged | kept |

Apex → www (`src/proxy.ts`) and trailing-slash behaviour are unchanged. These are not carried over, and now return 404:
- WordPress's automatic "closest slug" guesses (`X-Redirect-By: WordPress`), such as `/golf/`, `/hvac/`, `/dental/` and `/mexico/`.
- Rank Math's automatic attachment-to-parent redirects (284 attachment URLs).

### Sitemap and listings

- `sitemap.xml`: still 73 URLs. It's now also filtered through the public inventory, so it can't list a URL the site doesn't serve. Every entry returns 200 and is indexable.
- **Site Map page:**
  - the "Client events" group is removed
  - `/thanks/` is no longer listed (it's `noindex`)
  - only paths in the public inventory are shown, so a page added in WordPress can't produce a dead link
- **Feature Articles:**
  - lists only served articles (47)
  - fetches up to 100 posts instead of 50 (47 are published, so the old limit was close to hiding older posts)

`/thanks/` is kept: 200, `noindex, follow`, used after a successful contact form.

### Bretton: decisions and actions still required

1. **Close Gravity Form 9 in WordPress.** The form still exists on `staging.kosick.com/comfortmaker/` and on the live WordPress site, and would still accept passport uploads posted to it directly. This code change can't close it.
2. **Decide on retention or deletion of the Comfortmaker entries.** WordPress still holds the uploaded passport images, birth dates and addresses for the past conference. Nothing here deleted them.
3. **Confirm whether anything external uses the RSS feed** (`/feed/`), such as a newsletter tool or partner site. It now returns 404 on the new site.
4. **After cutover, check Search Console** for old attachment, archive or guessed-slug URLs (for example `/golf/`) that still get impressions or links, and request specific redirects for any that matter. No blanket redirects were added.
5. **When publishing a post,** export it into `src/content/articles/` with `scripts/export-wordpress-content.mjs` (since §12 Phase 1, the article list is built from that folder) and refresh the Rank Math snapshot. Otherwise the post returns 404 on the new site.

---

## 12. WordPress dependency audit and removal plan (28 October 2026)

**Goal:** www.kosick.com runs on Vercel alone, with no runtime request to WordPress, so `staging.kosick.com` and the old WordPress server can be shut down.

### 12.1 Audit before Phase 1

Method:
- **Outage test:** the production build, with `WORDPRESS_URL` pointed at a dead port and no warm cache, requesting every page and API.
- **Asset test:** all 74 pages loaded in Chrome, with every request to `staging.kosick.com`, `/wp-content/` and `/wp-includes/` blocked.
- **Scans:** every rendered page and all 27 CSS bundles for WordPress URLs. Media was sized with read-only HEAD requests.

| Area | Finding | Classification |
| --- | --- | --- |
| **Page content** | 24 of the 26 main pages, plus `/thanks/`, fetched WordPress REST on every render (cached for 120 s). Only `/` and `/marketing-programs/` were local. The fallback to the last good response lived in memory, so a cold serverless instance had nothing to fall back on. | MOVE LOCAL (**done, §12.2**) |
| **Articles** | All 46 WordPress articles were fetched at request time. Only `/travel-marketing-canada/` was a local JSON file. | MOVE LOCAL (**done, §12.2**) |
| **Images** | 464 distinct `/wp-content/uploads/` URLs: 289 originals plus 186 resized copies. 306 are used by the main pages and 158 only by articles. 826 MB in total, of which 708 MB is 16 MP4s. Absolute staging URLs are hardcoded in about 20 components (including the header logo and chat avatars) and appear inside the saved page and article HTML. The OG and JSON-LD images use `www.kosick.com/wp-content/…`, which works only through the rewrite to staging. CSS contains no WordPress `url()`. With WordPress blocked, 688 of 743 images broke, including the logo on all 74 pages. | MOVE LOCAL (Phase 2). Videos: KEEP EXTERNAL SERVICE, either re-encoded or on Blob/R2; `resort-marketing.mp4` (104 MB) and `automotive-marketing.mp4` (101 MB) exceed GitHub's 100 MB limit. |
| **Fonts and CSS** | All fonts are local (`/fonts/gellix`, `/wp-fonts/*`). No WordPress theme or plugin CSS and no `/wp-includes` file is loaded. | Nothing to move. Remove the `/wp-includes` rewrite, its `remotePatterns` and the proxy matcher exclusion after Phase 2. |
| **Contact form** | Next validates the fields, checks a honeypot and rate-limits, then relays to Kadence form 11283 via `admin-ajax.php`. Recipient, template, Reply-To, entry storage and mail transport are private Kadence settings; REST returns `rest_cannot_view`. There's no CAPTCHA. Akismet and Wordfence are installed. The SPF record includes Elastic Email. | REPLACE WITH DIRECT INTEGRATION (Postmark or Resend, Reply-To set to the visitor, a week of sending to both before switching). Needs a WordPress admin export first. |
| **Newsletter** | Kadence form 11281. Seven Kadence email integrations are installed (MailerLite, Mailchimp, GetResponse, FluentCRM, ActiveCampaign, Brevo, ConvertKit); which one and which list is a private setting. WordPress only passes the signup on. | REPLACE WITH DIRECT INTEGRATION (the provider's API from the server) once admin confirms the provider and list. |
| **AI chat** | Browser → Next `/api/chat*` → staging `/wp-json/aca/v1/*` → the custom "aca" plugin (knowledge base, sources, training, conversation logs, settings) → an unknown AI provider. The plugin *is* the backend. Its admin-style routes (`settings/save`, `kb/save`, `training/save`, `conversations/bulk-delete`, `playground`) are on the public REST index, and whether they require login is untested. The Next relay has no timeout. | WORDPRESS REQUIRED until the plugin source and an export of its settings and knowledge base exist; then REPLACE WITH DIRECT INTEGRATION. |
| **Analytics** | GTM, GA4 and Ads IDs live in code, and the container is hosted by Google. Site Kit's own `gtag` and the container's Kadence listener stop at cutover, which is expected. | No dependency |
| **Redirects and SEO** | Redirects, sitemaps, robots, metadata, canonicals and JSON-LD are all served by Next from local data. Loose ends: OG and JSON-LD image URLs (Phase 2), `locations.kml` (**done, §12.2**), and `robots.ts` still allowing `/wp-admin/admin-ajax.php` (remove in Phase 5). | Next-controlled |

**Repository search** (4,596 tracked matches, 71 untracked):
- About 3,990 are in `tmp-parity/`, `tmp-audit/`, `tmp-wave2/` and `tmp-*` files: REMOVE.
- 204 are in old `scripts/`: REMOVE, except the export and snapshot scripts.
- Content loaders and fetch helpers: MIGRATE (done for content).
- Parsers of the saved HTML (`service-page-parse.ts`, `normalize-article-html.ts`, `shared.ts` and the like): STILL REQUIRED.
- Form and chat relays: STILL REQUIRED until Phases 3–4.
- `UPLOADS` constants, header logo, chat avatars and the Rank Math snapshot image hosts: MIGRATE in Phase 2.
- `next.config.ts` rewrites and `remotePatterns`, the proxy matcher, the robots `admin-ajax` rule and the `.env` WordPress variables: REMOVE in Phases 2 and 5.
- Type imports and comments: SAFE.

**Shutdown answer before Phase 1:**
- 24 main pages plus `/thanks/` returned 500, and all 46 WordPress articles returned 404.
- Images broke on every page, including the logo; OG and JSON-LD images also broke.
- Contact, newsletter, chat and chat leads returned 502.
- `locations.kml` would have failed on regeneration.
- Outside hotlinks to `/wp-content/` images would break.

### 12.2 Phase 1: content local (done 28 October 2026, not committed)

What changed:
- **`scripts/export-wordpress-content.mjs`** (new, read-only) saves the exact REST responses the site used to fetch:
  - 25 pages from `/pages?slug=…&status=publish`, into `src/content/pages/`
  - 46 posts from `/posts?slug=…&status=publish&_embed=1` (including the author, featured media and terms), into `src/content/articles/`

  It skips the redirected GA4 post and regenerates the two `index.ts` files that import every JSON file. Run it again to refresh content; `--index` only rebuilds the indexes.
- **Loaders now read local content:**
  - `getPageBySlug` and `getPostBySlug` read the indexes.
  - `getArticleBySlug` reads the local article.
  - Feature Articles uses `listLocalArticles()`: newest first, the same order as WordPress's `orderby=date`.
  - Every parser and renderer is unchanged.
- **Fixed parser origin:** parsers resolve URLs against a fixed `CONTENT_ORIGIN` (the host the content was exported from) instead of `WORDPRESS_URL`, so changing that variable can't change how saved content renders.
- **`PUBLIC_ARTICLE_SLUGS`** is now built from `src/content/articles/`. It matches the previous hand-written list exactly (47 slugs).
- **`locations.kml`** is a static response, a copy of www's file. Its links now point to `www.kosick.com` instead of `staging.kosick.com`, and the WordPress XSL stylesheet line is gone.
- **Removed:**
  - `wpFetch`, `fetchAll`, `getPages`, `getPosts`, `getMedia`, `fetchPostsBySlug`, `loadWordPressData` (`src/lib/wordpress.ts`)
  - `fetchPostWithEmbedFrom`, `fetchPostWithEmbed`, `listPublishedPostSlugs` (`post.ts`)
  - `fetchPostsWithMedia` (`feature-articles.ts`)
  - the KML fetch
  - `src/lib/wordpress-fetch-guard.ts`

  The only WordPress requests left in the code are the four form and chat relays.

**Parity gate (passed):**
- **Method:** all 74 pages were rendered by the WordPress-backed build just before the export, then by the local build. Two local renders were identical to each other (74/74), so the comparison has no noise.
- **Result:** head tags (title, description, canonical, robots, OG), JSON-LD and the full `<body>` match on 73 of 74 pages. On the 74th (`/hvac-marketing-fortisbc-co-op-advertising/`), the only difference is the random key in Cloudflare's email obfuscation, which changes on every WordPress fetch. With that masked, the bodies are byte-identical.
- **Coverage:** identical bodies include every internal link, the article tables of contents (heading IDs), the 4 iframes, the 2 tables and the figures.
- **Not compared:** scripts and React's own image `preload` hints. React 19 picks those according to how the HTML is streamed, and pages no longer wait on WordPress. Header-logo preloads went away, and three service pages gained preloads for images already in the first HTML.
- **Crawl:** the status, title, description, canonical, robots, OG, JSON-LD count and internal links of all 98 URLs match the pre-Phase-1 crawl exactly.

Checks:
- typecheck: passed
- lint: 0 errors (2 old warnings)
- build: 38/38 pages
- crawl: 74 × 200, 5 × 308, 19 × 404; 0 broken internal links; 0 sitemap entries that redirect or 404
- interaction tests: 52/52; chat: 2/2

**Outage test after Phase 1:**
- With `WORDPRESS_URL` and `NEXT_PUBLIC_WORDPRESS_URL` pointing at a dead port, **all 74 pages plus `locations.kml`, `sitemap.xml` and `robots.txt` return 200** (before: 25 × 500 and 46 × 404).
- The rendered HTML matches the normal render on all 74 pages. The one exception is the chat-launcher avatar, which reads `NEXT_PUBLIC_WORDPRESS_URL` (Phase 2).
- Contact, newsletter and chat still return 502, as expected until Phases 3–4.
- Images still load from `staging.kosick.com` (Phase 2).

**Content editing changes with this phase.** A change made in WordPress no longer appears on the new site until someone re-runs the export, reviews the diff and deploys. Bretton should decide whether that's the workflow for now.

### 12.3 Phase 2: media local (done 28 October 2026, not committed)

What changed:
- **Inventory:** `scripts/sync-wordpress-media.mjs` (new) reads the served HTML of every sitemap page plus `/thanks/` (including `srcset` and the React payload) and the OG and JSON-LD images in the Rank Math snapshot. It downloads only the referenced files that are missing from `public/wp-content/`, at their original WordPress paths. Re-run it after exporting a new post.
- **Files:**
  - **430 files referenced; 418 are now in `public/wp-content/uploads/` (217 MB):** 402 images (93 MB) and 16 videos (133 MB).
  - The other 12 don't exist on staging or on live www. All 12 appear only in Rank Math JSON-LD (2 images and 10 `VideoObject` `contentUrl`s), so they were already broken on the live site. None is shown on a page.
  - Nothing from the other roughly 150 media-library originals, or unused resized copies, was copied.
- **Video:**
  - 15 videos over 10 MB were re-encoded with ffmpeg: H.264, `+faststart`, long edge at most 1920 px, with audio kept as AAC where the source had it. CRF 23, or 27 for the two largest, to stay under 25 MB.
  - Total: 704 MB → 126 MB.
  - Aspect ratio, duration and audio presence match the originals for all 15, and the `<video>` attributes (autoplay, muted, loop, controls) are unchanged.
  - The largest files are `tr_how-we-run…hd-1.mp4` at 24.7 MB and `resort-marketing.mp4` at 22.2 MB (was 104 MB, 4K → 1080p, checked frame by frame). No file is near GitHub's 100 MB limit, and no paid storage is needed.
- **Image optimization:** `2024/01/pexels-sora-shimazaki-5668473-2.png` went from a 6000 px, 30.8 MB opaque PNG to a 2560 px, 5.2 MB PNG, with the same path and full colour. A palette-quantized version (2.4 MB) was rejected because it visibly dithered the dark gradient.
- **URL rewrites:**
  - **Saved content:** 1,505 media URLs in 68 page and article JSON files became site-relative `/wp-content/…`. `export-wordpress-content.mjs` now applies the same rewrite to every export.
  - **Components:** about 20 components, including the `UPLOADS` constants, the header logo and the chat avatars.
  - **Shared helper:** `localMediaUrl()` in `src/lib/media.ts` maps any kosick.com `/wp-content/` URL to its site path. The chat widget and both `absUrl` helpers use it, so nothing can rebuild a WordPress media URL.
  - **Parser fix:** `resource-guide.ts` had a regex that needed an `https://` host; that regex now accepts a relative media URL.
- **SEO data unchanged:** OG and JSON-LD images in the snapshot stay absolute `https://www.kosick.com/wp-content/…`, because both must be absolute URLs. After cutover that host is Vercel serving `public/wp-content/`, not WordPress.
- **Removed:**
  - the `/wp-content` and `/wp-includes` rewrites and all four WordPress `remotePatterns` in `next.config.ts`
  - `wp-includes` from the `proxy.ts` matcher (`wp-content` stays excluded: it's now a folder of static files that needs no proxy)
  - `src/lib/wordpress-public.ts`
  - `NEXT_PUBLIC_WORDPRESS_URL` from `.env.example`
- **FortisBC email:** a WordPress email-obfuscation plugin stores the address reversed, displays it right-to-left with CSS and pads it with a hidden decoy. That's not Cloudflare, as first assumed. `normalizeArticleHtml` now writes such addresses out in reading order, so the article shows `info@kosick.com`.

Checks:
- **Parity with the Phase 1 render, media hosts masked:** 73/74 pages identical; the 74th differs only by the email fix. This comparison caught the `resource-guide.ts` regression, which was fixed and re-checked.
- **WordPress-blocked browser test:**
  - **Setup:** `WORDPRESS_URL` and `NEXT_PUBLIC_WORDPRESS_URL` pointed at a dead port, and every browser request to a kosick.com host aborted; 74 pages at 1440 px and 390 px.
  - **Pages and images:** 148/148 page loads return 200; 0 of 1,486 images are broken.
  - **Logo, avatar and video:** the logo and chat avatar load on every page, and all 46 video elements load with no media error.
  - **Requests:** 0 requests to any kosick.com host, and 0 local 4xx or 5xx.
- **OG and JSON-LD:** 69/69 OG images and all 17 `<video>` sources return 200 locally. JSON-LD has 71 media URLs that resolve and the 12 dead ones listed above.
- **Search:** no rendered page contains `staging.kosick.com` (all 74 did after Phase 1). `NEXT_PUBLIC_WORDPRESS_URL` and `/wp-includes` appear nowhere in source or `.next`.
- **typecheck:** passed
- **lint:** 0 errors (2 old warnings)
- **build:** 38/38 pages
- **crawl:** 74 × 200, 5 × 308, 19 × 404; 0 metadata or link changes since Phase 1; 0 broken internal links; 0 stray staging URLs
- **interaction tests:** 52/52; chat: 2/2

**For review:** the 12 dead JSON-LD references come from Rank Math on live WordPress. Removing them, or pointing three of them at the working files (`2023/06/KC-Mov-3.mp4`, `tr_how-we-run…hd-1.mp4`, `Golf-Web-1.mp4`), would be an SEO data change, so it's left for a decision.

### 12.4 Phase 3: forms without WordPress (code done 28 October 2026, waiting on accounts)

**Source of truth.** Kadence form settings were confirmed in WordPress admin.
- **Both forms:** the submit actions are Email, Auto Respond and Database Entry.
- **Notifications:** sent to `info@kosick.com` from "Kosick Communications Ltd." <info@kosick.com>, with Reply-To set to the visitor.
- **Subscribe form:** has no newsletter-provider integration. It only stores the entry and sends the two emails.

**Approved defaults:**
- the BCC to `testing@line49.ca` is dropped (configurable as `FORMS_NOTIFY_BCC`)
- Resend for email, and Cloudflare Turnstile for spam protection
- the client IP is kept only as a keyed hash, for 90 days; no user agent is stored
- contact submissions are kept for 24 months; newsletter signups until unsubscribe or a provider migration
- the subscribe auto-response subject is now "Thanks for subscribing!"
- a repeat newsletter signup from the same address within 24 hours is stored but not announced again

**How it works** (`src/lib/forms/`, `src/app/api/contact-form/route.ts`):
- **Checks, in order:** field validation, then the honeypot, then the minimum fill time (1.5 s, measured by the browser), then Turnstile (only when `TURNSTILE_SECRET_KEY` is set).
- **Then delivery:**
  1. store the row in Supabase, if configured; the per-render submission ID is unique, so a resubmit is a no-op
  2. relay to the WordPress form while `FORMS_WORDPRESS_RELAY` is on
  3. send the notification through Resend when `FORMS_EMAIL` is `test` or `live`
- **Success rule:** a submission succeeds when any of those three succeeded; otherwise it returns 502. The response shape `{ ok, redirect }` is unchanged: contact → `/thanks/`, newsletter → inline message.
- **Auto-response:** sent after the response (`after()`), at most 2 per recipient address per 24 hours.
- **Rate limits:** 5 submissions per IP hash per 10 minutes, counted in Supabase; the in-memory per-instance limit stays in front.
- **Retries:** `/api/forms/retry/` (Bearer `CRON_SECRET`) re-sends failed notifications and re-relays failed WordPress submissions, up to 5 attempts each, then emails an alert to `FORMS_ALERT_TO`.
- **Default behaviour is unchanged.** With no new environment variables, the forms relay to WordPress exactly as before.

**Database:** `supabase/migrations/20261028120000_form_submissions.sql`.
- **Access:** row-level security is on with no policies, and the `anon` and `authenticated` roles have no privileges. Only the server's secret key can read or write.
- **Duplicates:** the per-render idempotency key is unique.
- **Indexes:** on IP hash, normalized email, retry status and date.
- **Retention:** a scheduled pg_cron job runs `purge_form_data()` daily (IP hashes after 90 days, contact rows after 24 months).
- **Retries:** `supabase/schedule-form-email-retry.sql` schedules the retry call through pg_net. Run it after deployment.
- **Not yet applied:** no Supabase project exists for this site yet.

**Browser:** `useFormGuard` in `src/components/forms/` adds the submission ID, fill time and source page to both forms, and renders a managed Turnstile widget only when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set. A retry after an error reuses the same ID; a new signup gets a new one. The forms look the same, and analytics are unchanged (`kosick_contact_lead`, `kosick_newsletter_signup`, no `generate_lead` for the newsletter).

**Verified (local only, no real services):**
- **Mock suite:** `scripts/launch-qa/forms-mock.mjs` passes 47/47, against local mocks of Supabase, Resend, Turnstile and Kadence in four configurations.
- **Interaction tests:** 55/55, including new checks that the guard fields are sent and that a retry keeps its ID.
- **Static checks:** typecheck, lint (0 errors) and build pass.
- **Crawl:** unchanged.

**Rollout:**
1. **3a:** set the Supabase variables, keep the relay on and email off. Confirm every lead appears in both Supabase and Kadence's entries.
2. **3b, test:** set `FORMS_EMAIL=test` to check the emails in a test inbox while WordPress keeps delivering.
3. **3b, live:** switch to `FORMS_EMAIL=live` **and** `FORMS_WORDPRESS_RELAY=off` together. With both on, everyone gets two sets of emails.
4. **Afterwards:** remove the relay code and the Kadence form IDs (Phase 5).

### 12.5 Remaining phases

| Phase | Work | Needs | Gate |
| --- | --- | --- | --- |
| 2. Media local | **Done (§12.3).** | | |
| 3. Forms direct | **Code done (§12.4).** Supabase, Resend and Turnstile setup, then live tests. | the accounts and keys in §12.4 | real test submissions arrive |
| 4. Chat direct | Rebuild the chat backend from the plugin export: prompt and knowledge base as local JSON, a server-side AI call, leads by email. | the aca plugin source, settings and knowledge-base export | side-by-side answer review |
| 5. Delete runtime code | Remove `getWordPressUrl`, the WordPress environment variables, the robots `admin-ajax` rule, the proxy exclusions and the `tmp-*` folders and old scripts. | Phases 2–4 | grep shows no WordPress host |
| 6. Outage simulation | Run with WordPress unset and blocked on both server and browser, then the full QA suite. Add a build check that fails if `staging.kosick.com` appears in the output. | Phase 5 | all pass |

**Bretton:**
- Create the Supabase, Resend and Cloudflare Turnstile setup in §12.4 (forms 11283 and 11281 settings are already confirmed).
- Export the aca plugin and confirm its admin routes require login.
- Decide the content-editing workflow after WordPress.
