# Kosick Communications: SEO Audit and Migration Readiness

Audit of the Next.js site before the WordPress-to-Vercel cutover, 10 November 2026. Every finding below comes from the rendered HTML of a local production build requested as `www.kosick.com`, or from read-only requests to the live WordPress site. Companion to [LAUNCH_READINESS.md](LAUNCH_READINESS.md).

## 1. Recommendation

**SEO readiness: GO for cutover, with one condition.** The new site preserves every WordPress URL, title, description and canonical. Its technical SEO is now cleaner than the live site's.

The condition is the staging blocker that's already open in the launch doc (P1-11). Before DNS moves, `staging.kosick.com` must send `X-Robots-Tag: noindex, nofollow`. I checked it today. It still serves `index, follow`, self-referencing canonicals and an allow-all robots.txt. After cutover it would be a full duplicate of the production site. This is a Cloudflare rule, not a code change.

Everything in §5 ("needs approval") improves rankings but is optional for launch. None of it blocks cutover.

## 2. What was checked

| Check | Result |
| --- | --- |
| Pages crawled (sitemap plus every internal link) | 105, all `200`. No page outside the sitemap is linked internally |
| Titles and descriptions | All present and unique. No duplicates across 105 pages |
| Canonicals | All present and self-referencing on `https://www.kosick.com` |
| Robots | All `index, follow` (one `nofollow` fixed, see §3). No accidental `noindex` |
| H1 | Exactly one per page |
| Image alt text | No `<img>` without an `alt` attribute |
| Open Graph and Twitter | `og:title`, `og:description`, `og:image`, `og:url`, `og:type` and `twitter:card` on all 105 pages |
| Structured data | Present on every page, all valid JSON, no dangling `@id` references, no staging or preview URLs |
| Internal links | 0 broken, 0 pointing at a redirect, 0 on a non-canonical host |
| WordPress URL parity | All 75 URLs in the live WordPress sitemaps resolve: 72 directly, 3 by one permanent redirect (§7) |
| WordPress metadata parity | The live Rank Math titles, descriptions and canonicals match the snapshot the site serves. The only differences are four descriptions softened on purpose in the claims pass (commit `a352ffa`) |
| robots.txt | Production allows crawling and lists `sitemap_index.xml`. Preview hosts disallow everything |
| Sitemap | 105 URLs. Every entry returns 200 and is indexable. No redirected or noindex URL is listed |
| Lint, TypeScript, production build | 0 errors. 29 lint warnings, all pre-existing and none in changed files. Type check and build pass |

## 3. Changes implemented

All of these are safe technical changes. None alters approved page copy, layout or animation.

### Indexing and metadata

| Change | Why | Files |
| --- | --- | --- |
| `/services/creative/` changed from `index, nofollow` to `index, follow` | The WordPress `nofollow` told Google not to follow any link on the page, so link equity stopped there | `src/lib/seo/rank-math.ts` |
| Replaced two defective Rank Math descriptions: `/site-map/` ("Pages Feature Articles") and `/services/digital-connected-tv/` (ended in ".604.925.5800") | Auto-generated or broken snippets. The CTV text keeps the WordPress wording | `src/lib/seo/rank-math.ts` |
| `og:type` added to all pages: `article` on the 47 articles (with published and modified times), `website` elsewhere. `og:site_name` and `og:locale` added | 71 pages had no `og:type`. Shares now render as articles with dates | `src/lib/seo/rank-math.ts`, `src/lib/industries/metadata.ts` |
| Tightened 17 titles and 7 descriptions on the new industry pages | They ran 67–81 characters (titles) and 165–194 (descriptions), so Google cut them off mid-phrase. These pages have no ranking history. Rank Math pages were not touched | `src/lib/industries/*.ts` |
| `X-Robots-Tag: noindex, nofollow` on every non-production host | Backstop for preview and `*.vercel.app` URLs if a crawler ignores the disallow-all robots.txt | `src/proxy.ts` |
| `lastmod` added to the sitemap for the 47 articles, from their real modified dates. Pages have none, rather than a guessed date | Helps Google prioritise re-crawling updated articles | `src/app/sitemap.ts` |

### Structured data

| Change | Why |
| --- | --- |
| Removed the WordPress `SearchAction` (`/?s=`) from the WebSite schema | The new site has no search. The markup pointed at a URL that doesn't work |
| Removed 29 invalid or stale `VideoObject`s: the two on the homepage (they described the retired Vimeo hero), and others with a missing or 404 thumbnail | Google rejects a `VideoObject` without a working `thumbnailUrl` and reports it in Search Console. The 3 valid ones are kept (FortisBC co-op, event marketing and sponsorship articles) |
| Native `Service` schema now references `https://www.kosick.com/#organization`, the same entity Rank Math declares | Google merges the provider on the 34 new industry pages with the Kosick LocalBusiness instead of treating it as a separate entity |
| Kept: the 11 Rank Math `FAQPage` blocks | Every question in them is visible on its page, so they're valid. They're not new markup |

Files: `src/lib/seo/rank-math.ts`, `src/lib/seo/organization.ts` (new), `src/components/industry/IndustryServicePage.tsx`, `IndustryLandingPage.tsx`, `src/components/sections/MedicalAestheticsMarketingPage.tsx`.

### On-page

| Change | Why |
| --- | --- |
| The homepage H1 now reads **"THE ART OF GROWTH"**. Google previously saw "THE ART OF VISIBILITY GROWTH G R O W T H" | The animation's hidden sizer word and per-letter spans were inside the `<h1>`. They're now drawn from CSS `content: attr(...)`, so the animation looks identical |
| Split headings now have a real space, e.g. "Strategic HVAC Marketing" rather than "StrategicHVAC Marketing", and "Television & Broadcast" in the bento | The two parts were adjacent `<span>`s, so the text content ran together. The space is invisible in the grid and flex layouts |

Files: `src/components/home/HomeHeroRotator.tsx`, `HomeHero.module.css`, `HomeBento.tsx`, `src/components/sections/HeroBanner.tsx`.

### Performance (Core Web Vitals)

The largest content on most key pages was a hero video. Each one downloaded immediately and had no poster, so the first visual waited on a multi-megabyte MP4. On Social Media, four hidden slides' videos autoplayed at once.

| Change | Files |
| --- | --- |
| First-frame posters (WebP, 4–184 KB) for all 14 hero videos and the homepage. Each one is the video's exact frame at 0 s, so the swap to video is seamless. Preloaded in `<head>` at high priority | `public/images/video-posters/`, `src/lib/media/video-posters.ts`, `InternalPageHero.tsx`, `HomeHero.tsx` |
| Hero videos start downloading after the page's `load` event, and only the visible slide plays. Data Saver visitors keep the poster | `src/components/media/use-page-loaded.ts`, `HeroBanner.tsx`, `HomeHeroVideo.tsx` |
| Article featured images go through `next/image` (resized AVIF/WebP, high priority) instead of the raw 270 KB JPEG. Same size, position and reveal animation | `src/components/article/ArticlePageView.tsx` |
| Tab images ("Build a brand people remember" and media tabs) go through `next/image` | `src/components/sections/SplitMediaTabs.tsx` |
| Removed `priority` from the first homepage bento card. It sits below the full-screen hero and was competing with it | `src/components/home/HomeBento.tsx` |

Lighthouse, mobile, with real (DevTools) slow-4G and 4× CPU throttling:

| Page | LCP before | LCP after | CLS | TBT |
| --- | --- | --- | --- | --- |
| `/` | 5.2 s* | **2.5 s** | 0.002 | 50 ms |
| `/services/hvac-marketing/` | 4.6 s* | **2.4 s** | 0 | 40 ms |
| `/services/social-media-marketing/` | n/a | **2.0 s** | 0 | 50 ms |
| `/blog-dental-marketing/` (all 47 articles share the template) | 4.8 s | **2.6 s** | 0 | 70 ms |
| `/services/dental-marketing/video-tv-billboard-advertising/` | 3.4 s | 3.4–3.8 s | 0 | 50 ms |

\* Lighthouse's default *simulated* throttling. It's pessimistic for these pages and still reports ~4.2–4.6 s after the changes. Treat the real-throttle numbers, and later the field data in Search Console, as the reference.

Desktop LCP is under 0.5 s on every page tested. CLS (layout shift) and TBT (a proxy for INP) were already excellent and stay that way. All content is server-rendered. Google sees full page text without running JavaScript or clicking anything; tab panels and FAQ answers are in the initial HTML.

## 4. Remaining technical blockers and issues

| Priority | Issue | Action |
| --- | --- | --- |
| **Blocker** | `staging.kosick.com` is indexable (`index, follow`, self-canonical, allow-all robots.txt) | Cloudflare response-header rule for host `staging.kosick.com`: `X-Robots-Tag: noindex, nofollow`. Same as LAUNCH_READINESS P1-11 |
| Resolved | Business hours mismatch. The Rank Math schema said Mon–Fri 09:00–17:00; the Contact page said 8:00 AM–5:00 PM Pacific | Confirmed hours are 8:00 AM–5:00 PM Pacific, Monday to Friday. The schema now publishes `openingHoursSpecification` 08:00–17:00, from the same constant the Contact page uses (`src/lib/business-hours.ts`). Check that the Google Business Profile shows the same |
| Medium | Hero videos are 13–33 MB MP4s at 1080p (the homepage file is 22.6 MB) | They no longer delay first paint, but they cost mobile data. Encoding a ~720p mobile version of each with ffmpeg would cut that by about 70%. ffmpeg wasn't available in this session |
| Low | 49 of the 193 image URLs in the WordPress sitemaps return 404 on the new site. None is used by a new page; they're retired card and banner images | Before cutover, check Search Console → Performance → Search type: Image. Copy any of these with impressions from WordPress into `public/wp-content/uploads/` at the same path |
| Low | 11 articles jump from H1 to H3 with no H2 | Article body HTML from WordPress. Fixing it changes heading sizes in the articles, so it's for the editor, not a silent code change |
| Low | Render-blocking CSS (~1 s on simulated 4G) | `experimental.inlineCss` would remove it, but it's experimental and site-wide. Measure field data after launch first |
| Low | `/online-payments/` (9 words) and `/marketing-results/` (201 words) are thin | Payments needs no content. Results would benefit from 2–3 written case-study summaries (§5) |
| Info | "Award-winning" or "award winning" in three Rank Math descriptions: `/`, `/services/social-media-marketing/` and `/increase-golf-course-revenue/`. All three were copied unchanged from live WordPress. No award is named anywhere on the new site | Name the award on the site, or drop the word (§5) |

## 5. Recommendations that need approval

None of these were implemented, because they change approved copy, verified Rank Math metadata or the SEO strategy.

### 5.1 Metadata for WordPress-era pages

These pages have ranking history, so their Rank Math titles were preserved exactly. The proposals below add the missing location and intent terms, and drop adjective-led titles ("Powerful", "Knowledgeable", "Precise") that dilute the keyword.

| Page | Current title | Proposed title |
| --- | --- | --- |
| `/` | Digital Marketing Agency \| Kosick Communications | **Marketing & Advertising Agency in Vancouver \| Kosick Communications** |
| `/services/website-development/` | Website Development E-Commerce - Kosick Communications | Website Design & Development in Vancouver \| Kosick Communications |
| `/vancouver-web-development-e-commerce/` (article) | Website Development & E-commerce \| Kosick Communications | Vancouver Web Development & E-commerce: Why Your Business Needs to Move Online (matches its H1) |
| `/services/corporate-branding/` | Powerful Corporate Branding - Kosick Communications | Corporate Branding Agency in Vancouver \| Kosick Communications |
| `/services/creative/` | Corporate Creative & Production - Kosick Communications | Video Production & Creative Services \| Kosick Communications |
| `/services/digital-connected-tv/` | Powerful Connected TV Advertising & Streaming - Kosick | Connected TV & Streaming Advertising \| Kosick Communications |
| `/services/business-development/` | Precise Business Development Strategy \| Kosick | Business Development Strategy \| Kosick Communications |
| `/services/golf-marketing/` | Strategic Golf Marketing \| Kosick Communications | Golf Marketing Agency \| Kosick Communications |
| `/services/dental-marketing/` | Dental Marketing To Grow Your Practice \| Kosick Communications | Dental Marketing Agency \| Kosick Communications |
| `/services/email-marketing/` | Email Marketing - Mailchimp \| Kosick Communications | Email Marketing Services \| Kosick Communications |
| `/services/outdoor-advertising/` | Billboard & Outdoor Advertising Across Canada (no brand) | Billboard & Outdoor Advertising in Canada \| Kosick Communications |
| `/marketing-programs/` | Knowledgeable Marketing Programs - Kosick Communications | National Marketing Programs \| Kosick Communications |
| `/marketing-results/` | Powerful Proven Marketing Results - Kosick Communications | Marketing Results & Case Studies \| Kosick Communications |
| `/feature-articles/` | Featured Digital Marketing Articles- Kosick Communications | Marketing Articles & Guides \| Kosick Communications |

Proposed descriptions:

- **`/`**: "Vancouver marketing and advertising agency combining Google Ads, TV, streaming, billboards, websites and branding to grow businesses across Canada and the US." This drops "Award-winning" unless an award is named on the site.
- **`/contact/`**: "Contact Kosick Communications in Vancouver or Calgary: call 604-925-5800 or send a message about marketing, advertising, branding or web projects."
- **`/services/dental-marketing/`**, 180 characters: drop "Book a free strategy call." to bring it under 160.
- **`/services/outdoor-advertising/`**, 184 characters: end it after "across Canada."

Implementing these is a short data change in `src/lib/seo/rank-math.ts` (`SEO_OVERRIDES`), so the captured snapshot stays as an audit record. Change only a few at a time, and watch each page's queries in Search Console for 4–6 weeks.

### 5.2 On-page

- **Keyword cannibalization:**
  - `/services/website-development/` and `/vancouver-web-development-e-commerce/` have near-identical titles. The retitle above fixes it.
  - `/blog-dental-marketing/` ("Dental Marketing Vancouver") competes with `/services/dental-marketing/`. Add a prominent link from the article to the service page, and keep the article's title informational.
- **Industry subpage H1s** are taglines, e.g. "Be the first result when the furnace quits." The topic sits in the eyebrow paragraph above them. Option: put the eyebrow inside the `<h1>` as a styled span, giving "HVAC digital advertising & lead generation: Be the first result when the furnace quits." That needs a visual check on 35 pages, so it wasn't done silently.
- **`/services/` H1** "Our Areas of Services Expertise" reads awkwardly. Suggest "Marketing Services".
- **Internal links to articles:** 45 of 47 articles get links from three or fewer pages, mostly the listing and Site Map. Linking two or three relevant guides from each service and industry page passes authority to them and helps Google see topic clusters. The industry subpages already do this in their resources block; the WordPress-era service pages don't.
- **Content opportunity:** no page targets **Google Ads management**. It's covered inside Digital Marketing and the industry subpages. A dedicated page built from existing service copy, with real process, pricing model and reporting detail, is the clearest gap among the target searches.

### 5.3 Local SEO

- **NAP:** the site shows "Kosick Communications", +1 (604) 925-5800, Calgary +1 (403) 809-9450 and info@kosick.com. All of these are crawlable text in the header, footer and Contact page.
- **Address:** the schema lists "Vancouver, Canada" with no street, and no street address is shown on the site. That's consistent with a service-area Google Business Profile with the address hidden. Confirm the profile's setup:
  - If the address is public there, show the same address on the Contact page and add `streetAddress` and `postalCode` to the schema.
  - If it's hidden, leave both as they are.
- **No city doorway pages** were created. Location relevance comes from the existing Vancouver, Calgary and Toronto mentions in real service copy.

## 6. Target keywords mapped to pages

| Search | Primary page | Supporting pages | Status |
| --- | --- | --- | --- |
| marketing agency Vancouver | `/` | `/how-to-choose-a-marketing-company-in-vancouver/` | No title targets it yet; homepage retitle (§5.1) |
| digital marketing agency Vancouver | `/services/digital-marketing/` | `/`, `/why-companies-use-digital-marketing-to-grow-their-business/` | Title "Digital Marketing Vancouver" ✓ |
| advertising agency Vancouver | `/` | `/services/television-advertising/`, `/services/outdoor-advertising/` | No title targets it yet; homepage retitle (§5.1) |
| HVAC marketing agency | `/services/hvac-marketing/` | 5 HVAC subpages, 5 HVAC articles | ✓ Lead copy says "An HVAC marketing agency" |
| dental marketing agency | `/services/dental-marketing/` | 4 dental subpages, `/blog-dental-marketing/` | ✓ Retitle optional (§5.1) |
| golf marketing agency | `/services/golf-marketing/` | 4 golf subpages, 4 golf articles | ✓ Retitle optional (§5.1) |
| SEO services Vancouver | `/services/search-engine-optimization/` | `/web-development-and-hosting-that-improves-seo/` | Title "SEO Services In Vancouver, Calgary & Toronto" ✓ |
| Google Ads management Vancouver | `/services/digital-marketing/` | HVAC, dental and medical aesthetics Google Ads subpages | Gap: no dedicated page (§5.2) |
| social media marketing agency | `/services/social-media-marketing/` | `/social-media-advertising-vancouver/`, `/blog-importance-of-social-media-marketing/` | Title "Social Media Marketing Vancouver" ✓ |
| website design Vancouver | `/services/website-development/` | industry website-design subpages | Cannibalised by an article; retitle both (§5.1) |
| television advertising Vancouver | `/services/television-advertising/` | `/is-television-advertising-worth-it/`, `/how-to-buy-tv-advertising-in-canada/` | ✓ |
| medical aesthetics marketing | `/services/medical-aesthetics-marketing/` | 4 subpages, `/medical-marketing-vancouver/` | ✓ |
| construction, retail, specialty retail and travel marketing | each industry landing page | its subpages | ✓ New pages, titles tightened |

## 7. WordPress → Next.js URLs

**Inventory:** 75 URLs in the live WordPress sitemaps (`page-sitemap.xml`, `post-sitemap.xml`, `local-sitemap.xml`), fetched today. They're identical to the 3 November inventory.

| Outcome | Count | URLs |
| --- | --- | --- |
| Same URL, `200`, same title, description and canonical | 71 | all pages and posts except the ones below |
| Same URL, served by a route | 1 | `/locations.kml` |
| Permanent redirect (one hop) to the closest page | 3 | `/ga4-new-generation-google-analytics/` → `/services/search-engine-optimization/` (308); `/services/hvac-marketing/hvac-lead-generation/` → `/services/hvac-marketing/` (301); `/services/outdoor-advertising/billboard-dimensions/` → `/services/outdoor-advertising/` (301) |
| Becomes a 404 | 0 | none |

**New URLs (not on WordPress):** 34 industry landing pages and subpages. All are in the sitemap.

**Trailing slashes:** consistent. Every canonical ends in `/`, and the slash-less form 308-redirects to it. `kosick.com` 308-redirects to `www.kosick.com`.

**Domain:** the brief asked for canonicals on `https://kosick.com`. The live site's canonicals, Rank Math data, backlinks and Search Console property are all on **`https://www.kosick.com`**. Switching hosts during the platform migration would make it a site move as well, so the site keeps `www`, and the apex redirects to it. If an apex canonical is wanted, do it as a separate, later change of address in Search Console.

### Redirects in place (`src/lib/legacy-redirects.ts`, all permanent)

| From | To |
| --- | --- |
| `/home/` | `/` |
| `/ga4-new-generation-google-analytics/` | `/services/search-engine-optimization/` |
| `/corporate-events-group-travel/` | `/corporate-events/` |
| `/services/media-buying/` | `/blog-media-buying-canada-tv-streaming-radio/` |
| `/comfortmaker/`, `/mexico-2026-welcome-itinerary/`, `/uncorked/` | `/corporate-events/` |
| `/blog/`, `/feature-articles/page/N/` | `/feature-articles/` |
| `/services/fashion-marketing/` (and subpaths), `/fashion-marketing/` | `/services/retail-marketing/` |
| `/services/medical-dental-marketing/` | `/services/dental-marketing/` |
| `/services/medical-marketing/`, `/services/medical-aesthetics/` | `/services/medical-aesthetics-marketing/` |
| `/services/hvac-marketing/hvac-lead-generation/` | `/services/hvac-marketing/` (301) |
| `/services/outdoor-advertising/billboard-dimensions/` | `/services/outdoor-advertising/` (301) |
| `/services/hvac-marketing/digital-marketing/` | `/services/hvac-marketing/digital-advertising/` (301) |
| `/services/hvac-marketing/branding-advertising/` | `/services/hvac-marketing/outdoor-advertising/` (301) |
| `/page-sitemap.xml`, `/post-sitemap.xml`, `/local-sitemap.xml` | `/sitemap.xml` |

All of these were tested: every one lands on a `200` page with no loops. A source typed *without* its trailing slash takes two hops (slash, then redirect). That's harmless, because Google follows up to 10 hops and links almost always use the canonical form.

**No further redirects are required** for URLs WordPress lists. Backlink and traffic data wasn't available in this audit, because there was no Search Console or backlink-tool access. Before cutover, export Search Console → Links → Top linked pages and Performance → Pages (last 16 months). Any URL there that isn't in the 75 above, such as an old attachment or archive URL, needs a redirect request.

## 8. Google Search Console checklist

**Before cutover**

1. Confirm the verification method in Search Console → Settings → Ownership verification. Neither site has a `google-site-verification` meta tag, so it's DNS, Google Analytics or Tag Manager, and all three survive the migration. If it's an HTML file, copy that file into `public/`.
2. Export Performance (pages and queries, 16 months) and Links (top linked pages) as the baseline.
3. Add a **Domain property** (`kosick.com`, DNS TXT) if one doesn't exist. It covers `www`, the apex and `staging` together. This is a DNS change and needs approval.
4. Put the staging `noindex` header rule in place (§4).

**Cutover day**

5. Check that `https://www.kosick.com/robots.txt` lists `Sitemap: https://www.kosick.com/sitemap_index.xml`, and that `https://kosick.com/` 308-redirects to `www`.
6. Submit `https://www.kosick.com/sitemap_index.xml`. The old Rank Math sitemap URLs redirect to the new one.
7. URL Inspection → Test live URL on 8–10 key pages: `/`, `/services/`, `/services/hvac-marketing/`, `/services/dental-marketing/`, `/services/golf-marketing/`, `/services/digital-marketing/`, one industry subpage and one article. Confirm "URL is available to Google", the canonical you declared, and rendered HTML with full text.
8. Request indexing for the homepage and the 34 new industry URLs (the sitemap lists them all; requesting indexing for the landing pages is enough).
9. Spot-check the redirects in §7 with URL Inspection; each should report "Page with redirect".

**Days 1–14, then weekly for 6 weeks**

10. Pages report: watch "Not found (404)", "Duplicate without user-selected canonical", "Alternate page with proper canonical" and "Excluded by noindex". Any `staging.kosick.com` URL should move to Excluded.
11. Enhancements: Breadcrumbs, FAQ and Videos should show no errors. The removed invalid videos should stop appearing.
12. Core Web Vitals report, mobile and desktop. The lab LCP above is about 2.4–2.6 s on key pages; confirm the field data agrees after 28 days.
13. Performance: compare clicks and impressions per page against the baseline export. A dip in weeks 1–3 is normal for a platform migration; a sustained drop on a page means checking its redirect and content.
14. Any 404 that still gets impressions or links becomes a specific redirect in `src/lib/legacy-redirects.ts`. Never add a blanket redirect to the homepage.

## 9. Page-by-page audit

The schema column lists the main types only. "Links in" counts distinct crawled pages linking to the page; the header and footer give every page in the navigation 104. "Remaining issues" lists what's still open after the changes in §3; the fixes for "title truncates" on WordPress pages are in §5.1.

### Core pages (9)

| Page | Source | Title (chars) | Desc. | H1 | Words | Schema | Links in | Remaining issues |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | WordPress | Digital Marketing Agency | Kosick Communications (48) | 156 | THE ART OF GROWTH | 899 | LocalBusiness, Article | 104 | None |
| `/contact/` | WordPress | Contact Us - Kosick Communications (34) | 140 | Let’s make something happen. | 315 | LocalBusiness, ContactPage | 104 | None |
| `/corporate-events/` | WordPress | Corporate Events & Group Travel | Kosick Communications (55) | 153 | Strategic Corporate Events | 786 | LocalBusiness, Article | 104 | None |
| `/feature-articles/` | WordPress | Featured Digital Marketing Articles- Kosick Communications (58) | 143 | Feature Articles | 2425 | LocalBusiness, CollectionPage | 104 | None |
| `/marketing-programs/` | WordPress | Knowledgeable Marketing Programs - Kosick Communications (56) | 155 | Marketing Programs | 445 | LocalBusiness, Article | 104 | adjective-led title |
| `/marketing-results/` | WordPress | Powerful Proven Marketing Results - Kosick Communications (57) | 134 | Marketing Results | 201 | LocalBusiness, Article | 104 | thin content; adjective-led title |
| `/online-payments/` | WordPress | Pay Your Invoice Online - Kosick Communications (47) | 143 | Pay Your Invoice Online | 9 | LocalBusiness, Article | 104 | thin content |
| `/services/` | WordPress | Marketing Services & Strategy | Kosick Communications (53) | 144 | Our Areas of Services Expertise | 491 | LocalBusiness, Article | 104 | None |
| `/site-map/` | WordPress | Full Site Menu - Kosick Communications (38) | 138 | Explore Kosick Communications. | 650 | LocalBusiness, Article | 104 | None |

### Service and industry pages (49)

| Page | Source | Title (chars) | Desc. | H1 | Words | Schema | Links in | Remaining issues |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/services/business-development/` | WordPress | Precise Business Development Strategy | Kosick (46) | 137 | Strategic Business Development | 866 | LocalBusiness, Article | 104 | adjective-led title |
| `/services/construction-marketing/` | New | Construction Marketing Agency | Kosick Communications (53) | 148 | Strategic Construction Marketing | 523 | Service, OfferCatalog, BreadcrumbList | 104 | None |
| `/services/construction-marketing/content-development/` | New | Construction Content Development | Kosick Communications (56) | 150 | Answer the questions before they're asked. | 491 | Service, BreadcrumbList | 4 | None |
| `/services/construction-marketing/social-media/` | New | Construction Social Media Marketing | Kosick Communications (59) | 152 | Every project is a story worth posting. | 472 | Service, BreadcrumbList | 4 | None |
| `/services/construction-marketing/website-design/` | New | Construction Website Design | Kosick Communications (51) | 164 | Let the finished work make the pitch. | 529 | Service, BreadcrumbList | 4 | None |
| `/services/corporate-branding/` | WordPress | Powerful Corporate Branding - Kosick Communications (51) | 132 | Strategic Corporate Branding | 847 | LocalBusiness, Article, FAQPage | 104 | adjective-led title |
| `/services/creative/` | WordPress | Corporate Creative & Production - Kosick Communications (55) | 129 | Strategic Creative & Production | 603 | LocalBusiness, Article, FAQPage | 104 | None |
| `/services/dental-marketing/` | WordPress | Dental Marketing To Grow Your Practice | Kosick Communications (62) | 180 | Strategic Dental Marketing | 935 | LocalBusiness, Article | 104 | description truncates |
| `/services/dental-marketing/google-ads-seo/` | New | Google Ads & SEO for Dental Practices | Kosick Communications (61) | 139 | Be the practice patients find first. | 593 | Service, BreadcrumbList | 5 | None |
| `/services/dental-marketing/social-media-content/` | New | Dental Social Media & Content Marketing | Kosick Communications (63) | 121 | Familiar faces before the first appointment. | 556 | Service, BreadcrumbList | 5 | None |
| `/services/dental-marketing/video-tv-billboard-advertising/` | New | Dental Video, TV & Billboard Advertising | Kosick Communications (64) | 134 | Make your practice a local landmark. | 533 | Service, BreadcrumbList | 5 | None |
| `/services/dental-marketing/website-design/` | New | Dental Website Design | Kosick Communications (45) | 145 | The first visit happens on your website. | 618 | Service, BreadcrumbList | 5 | None |
| `/services/digital-connected-tv/` | WordPress | Powerful Connected TV Advertising & Streaming - Kosick (54) | 136 | Strategic Digital Video Advertising | 940 | LocalBusiness, Article, FAQPage | 104 | adjective-led title |
| `/services/digital-marketing/` | WordPress | Digital Marketing Vancouver | Kosick Communications (51) | 155 | Strategic Digital Marketing | 1240 | LocalBusiness, Article, FAQPage | 104 | None |
| `/services/email-marketing/` | WordPress | Email Marketing - Mailchimp | Kosick Communications (51) | 141 | Strategic Email Marketing | 834 | LocalBusiness, Article | 104 | None |
| `/services/golf-marketing/` | WordPress | Strategic Golf Marketing | Kosick Communications (48) | 154 | Strategic Golf Marketing | 1082 | LocalBusiness, Article, FAQPage | 104 | None |
| `/services/golf-marketing/branding/` | New | Golf Course Branding & Creative | Kosick Communications (55) | 151 | A club identity worth wearing. | 579 | Service, BreadcrumbList | 5 | None |
| `/services/golf-marketing/social-media-lead-generation/` | New | Golf Social Media & Lead Generation | Kosick Communications (59) | 152 | From the feed to the first tee. | 591 | Service, BreadcrumbList | 5 | None |
| `/services/golf-marketing/tv-video-advertising/` | New | Golf TV Advertising & Video Production | Kosick Communications (62) | 147 | Put the course on the broadcast. | 554 | Service, BreadcrumbList | 5 | None |
| `/services/golf-marketing/website-design/` | New | Golf Course Website Design & Development | Kosick Communications (64) | 152 | Your course, one click from the first tee. | 565 | Service, BreadcrumbList | 5 | None |
| `/services/hvac-marketing/` | WordPress | HVAC Marketing & Lead Generation | Kosick Communications (56) | 158 | Strategic HVAC Marketing | 1283 | LocalBusiness, Article, FAQPage | 104 | None |
| `/services/hvac-marketing/business-growth/` | New | HVAC Business Growth & Co-op Programs | Kosick Communications (61) | 133 | Grow the business, not only the leads. | 649 | Service, BreadcrumbList | 6 | None |
| `/services/hvac-marketing/digital-advertising/` | New | HVAC Google Ads & Digital Advertising | Kosick Communications (61) | 161 | Be the first result when the furnace quits. | 714 | Service, BreadcrumbList | 6 | None |
| `/services/hvac-marketing/outdoor-advertising/` | New | HVAC Billboard & Outdoor Advertising | Kosick Communications (60) | 163 | Be the name homeowners already know. | 683 | Service, BreadcrumbList | 6 | None |
| `/services/hvac-marketing/video-tv-advertising/` | New | HVAC Television & Streaming Advertising | Kosick Communications (63) | 160 | Earn trust on the biggest screen in the house. | 658 | Service, BreadcrumbList | 6 | None |
| `/services/hvac-marketing/website-design/` | New | HVAC Website Design & Development | Kosick Communications (57) | 148 | A website that books the service call. | 744 | Service, BreadcrumbList | 6 | None |
| `/services/medical-aesthetics-marketing/` | New | Medical Aesthetics Marketing | Kosick Communications (52) | 145 | Strategic Medical Aesthetics Marketing | 760 | Service, OfferCatalog, BreadcrumbList | 104 | None |
| `/services/medical-aesthetics-marketing/google-ads-seo/` | New | Google Ads & SEO for Medical Aesthetics | Kosick Communications (63) | 148 | Be the clinic clients find first. | 562 | Service, BreadcrumbList | 5 | None |
| `/services/medical-aesthetics-marketing/social-media-content/` | New | Medical Aesthetics Social Media & Content | Kosick Communications (65) | 127 | Familiar before the first visit. | 520 | Service, BreadcrumbList | 5 | None |
| `/services/medical-aesthetics-marketing/video-tv-billboard-advertising/` | New | Medical Aesthetics Video & TV Advertising | Kosick Communications (65) | 144 | Make your clinic a local landmark. | 517 | Service, BreadcrumbList | 5 | None |
| `/services/medical-aesthetics-marketing/website-design/` | New | Medical Aesthetics Website Design | Kosick Communications (57) | 132 | A clinic site that books and sells. | 535 | Service, BreadcrumbList | 5 | None |
| `/services/outdoor-advertising/` | WordPress | Billboard & Outdoor Advertising Across Canada (45) | 184 | Strategic Outdoor Advertising | 909 | LocalBusiness, Article, FAQPage | 104 | description truncates |
| `/services/radio-advertising/` | WordPress | Radio Advertising in Toronto, Calgary & Vancouver | Kosick Communications (73) | 162 | Strategic Radio Advertising | 1456 | LocalBusiness, Article, FAQPage | 104 | title truncates in results |
| `/services/retail-marketing/` | New | Retail & Fashion Marketing | Kosick Communications (50) | 148 | Strategic Retail Marketing | 550 | Service, OfferCatalog, BreadcrumbList | 104 | None |
| `/services/retail-marketing/billboard-outdoor-advertising/` | New | Retail Billboard & Outdoor Advertising | Kosick Communications (62) | 144 | Own the street outside the store. | 518 | Service, BreadcrumbList | 4 | None |
| `/services/retail-marketing/branding/` | New | Retail & Fashion Branding and Packaging | Kosick Communications (63) | 138 | Unmistakable on the shelf. | 487 | Service, BreadcrumbList | 4 | None |
| `/services/retail-marketing/digital-social-media/` | New | Retail Digital & Social Media Marketing | Kosick Communications (63) | 161 | From scroll to checkout. | 502 | Service, BreadcrumbList | 4 | None |
| `/services/search-engine-optimization/` | WordPress | SEO Services In Vancouver, Calgary & Toronto | Kosick Communications (68) | 157 | Strategic Search Engine Optimization | 730 | LocalBusiness, Article | 104 | title truncates in results |
| `/services/social-media-marketing/` | WordPress | Social Media Marketing Vancouver | Kosick Communications (56) | 141 | Strategic Social Media Marketing | 698 | LocalBusiness, Article, FAQPage | 104 | None |
| `/services/specialty-retail-marketing/` | New | Specialty Retail Marketing | Kosick Communications (50) | 151 | Strategic Specialty Retail Marketing | 553 | Service, OfferCatalog, BreadcrumbList | 104 | None |
| `/services/specialty-retail-marketing/content-creative/` | New | Retail Content & Creative Campaigns | Kosick Communications (59) | 143 | Show the product the way you see it. | 525 | Service, BreadcrumbList | 5 | None |
| `/services/specialty-retail-marketing/ecommerce-websites/` | New | Specialty Retail E-commerce Websites | Kosick Communications (60) | 148 | Your store, open all night. | 562 | Service, BreadcrumbList | 5 | None |
| `/services/specialty-retail-marketing/radio-advertising/` | New | Radio Advertising for Specialty Retailers | Kosick Communications (65) | 141 | Reach shoppers on the drive in. | 553 | Service, BreadcrumbList | 5 | None |
| `/services/specialty-retail-marketing/social-media/` | New | Specialty Retail Social Media | Kosick Communications (53) | 145 | Make the feed feel like the shop floor. | 537 | Service, BreadcrumbList | 5 | None |
| `/services/television-advertising/` | WordPress | Television Advertising Vancouver | Kosick Communications (56) | 147 | Strategic Television Advertising | 1111 | LocalBusiness, Article, FAQPage | 104 | None |
| `/services/travel-marketing/` | New | Travel & Tourism Marketing | Kosick Communications (50) | 162 | Strategic Travel Marketing | 569 | Service, OfferCatalog, BreadcrumbList | 104 | None |
| `/services/travel-marketing/lead-generation/` | New | Travel & Tourism Lead Generation | Kosick Communications (56) | 145 | Capture the traveller who's ready to plan. | 544 | Service, BreadcrumbList | 3 | few internal links in |
| `/services/travel-marketing/tv-advertising/` | New | Travel TV Advertising in Canada | Kosick Communications (55) | 154 | Start the trip on the screen. | 531 | Service, BreadcrumbList | 3 | few internal links in |
| `/services/website-development/` | WordPress | Website Development E-Commerce - Kosick Communications (54) | 148 | Strategic Website Development & E-Commerce | 978 | LocalBusiness, Article, FAQPage | 104 | None |

### Feature articles (47)

| Page | Source | Title (chars) | Desc. | H1 | Words | Schema | Links in | Remaining issues |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/amazon-ads-vancouver/` | WordPress | Amazon Ads Vancouver | Prime Video CTV | Kosick Communications (62) | 149 | Your Customers Are on Amazon. Now Your Ads Can Be Too. | 1217 | LocalBusiness, BlogPosting | 2 | few internal links in |
| `/blog-black-friday-advertising/` | WordPress | Black Friday Advertising Strategies To Boost ROI | Kosick Communications (72) | 152 | Black Friday Advertising Strategies That Drive ROI | 757 | LocalBusiness, BlogPosting | 1 | title truncates in results; few internal links in |
| `/blog-dental-marketing/` | WordPress | Dental Marketing Vancouver | Kosick Communications (50) | 149 | Dental Marketing Vancouver: How Custom Websites Drive Patien | 1316 | LocalBusiness, BlogPosting | 3 | few internal links in |
| `/blog-digital-tv-advertising-ad-creative/` | WordPress | Ad Creative That Drives Digital Advertising Results (51) | 151 | Ad Creative Strategy for Digital Advertising and TV: Why Cre | 1075 | LocalBusiness, BlogPosting | 1 | heading skip h1→h3; few internal links in |
| `/blog-golf-marketing-strategies/` | WordPress | Golf Course Branding For Premium Clubs | Kosick Communications (62) | 131 | Golf Course Branding: Elevating Premium Clubs for the Modern | 794 | LocalBusiness, BlogPosting | 3 | few internal links in |
| `/blog-hvac-website-development/` | WordPress | HVAC Website Development That Drives Leads (42) | 150 | HVAC Website Development: Why a Branded Brochure Website Sti | 1396 | LocalBusiness, BlogPosting | 3 | few internal links in |
| `/blog-importance-of-social-media-marketing/` | WordPress | Importance Of Social Media Marketing | Kosick Communications (60) | 148 | The Importance of Social Media Marketing for Business Growth | 689 | LocalBusiness, BlogPosting | 1 | few internal links in |
| `/blog-kosick-com-corporate-branding-guide/` | WordPress | 2026 Corporate Branding Guide | Kosick Communications (53) | 146 | The Strategic Guide to Corporate Branding: Building a Legacy | 819 | LocalBusiness, BlogPosting | 2 | few internal links in |
| `/blog-media-buying-canada-tv-streaming-radio/` | WordPress | Media Buying: TV, Streaming, Radio | Kosick Communications (58) | 130 | Media Buying in Canada: How Kosick Communications Builds Sma | 1091 | LocalBusiness, BlogPosting | 7 | heading skip h1→h3 |
| `/blog-social-media-marketing/` | WordPress | Social Media For Golf Courses, Resorts & Real Estate | Kosick Communications (76) | 111 | Social Media for Golf Courses, Resorts, and Real Estate | 974 | LocalBusiness, BlogPosting | 2 | title truncates in results; few internal links in |
| `/blog-tiktok-instagram-facebook-ad-safe-zones/` | WordPress | TikTok, Instagram & Facebook Ad Safe Zones (42) | 131 | Help Guide: TikTok, Instagram & Facebook Ad Safe Zones | 696 | LocalBusiness, BlogPosting | 2 | few internal links in |
| `/connected-tv-advertising-canada/` | WordPress | Connected TV Advertising In Canada | Kosick Communications (58) | 141 | Connected TV Advertising in Canada: What It Is and How It Wo | 1068 | LocalBusiness, BlogPosting | 2 | few internal links in |
| `/digital-marketing-vs-traditional-advertising/` | WordPress | Digital Marketing Vs Traditional Advertising | Kosick Communications (68) | 147 | Digital Marketing vs Traditional Advertising: Why the Best R | 1557 | LocalBusiness, BlogPosting | 2 | title truncates in results; few internal links in |
| `/golf-marketing-digital-marketing-vancouver/` | WordPress | Golf Membership Marketing For Private Clubs | Kosick Communications (67) | 128 | Golf Membership Marketing: Grow Membership and Revenue | 1220 | LocalBusiness, BlogPosting | 3 | title truncates in results; few internal links in |
| `/home-services-lead-generation-strategies/` | WordPress | Home Services Lead Generation Strategies | Kosick Communications (64) | 147 | Home Services Lead Generation: Digital and Traditional Strat | 1140 | LocalBusiness, BlogPosting | 2 | few internal links in |
| `/how-to-buy-tv-advertising-in-canada/` | WordPress | How To Buy TV Advertising In Canada | Kosick Communications (59) | 149 | How to Buy TV Advertising in Canada: A Strategic Guide for B | 1271 | LocalBusiness, BlogPosting | 2 | few internal links in |
| `/how-to-choose-a-marketing-company-in-vancouver/` | WordPress | How To Choose A Marketing Company | Kosick Communications (57) | 148 | How to Choose a Marketing Company in Vancouver – 2025 Expert | 1058 | LocalBusiness, BlogPosting | 1 | few internal links in |
| `/how-to-fill-tee-times-golf-marketing/` | WordPress | How To Fill Tee Times: A Golf Course Guide | Kosick Communications (66) | 130 | How to Fill Tee Times and Grow Golf Membership Year-Round | 949 | LocalBusiness, BlogPosting | 3 | title truncates in results; few internal links in |
| `/hvac-digital-marketing/` | WordPress | HVAC Digital Marketing For Home Services | Kosick Communications (64) | 148 | HVAC Digital Marketing That Drives Real Leads for Home Servi | 1506 | LocalBusiness, BlogPosting | 3 | few internal links in |
| `/hvac-marketing-fortisbc-co-op-advertising/` | WordPress | FortisBC Co-op Advertising For HVAC | Kosick Communications (59) | 149 | FortisBC Co-op Advertising Funding for HVAC Contractors | 1130 | LocalBusiness, BlogPosting, VideoObject | 3 | few internal links in |
| `/hvac-marketing-strategies-guide/` | WordPress | HVAC Dealer Marketing: Lead Gen For Dealers & Manufacturers (59) | 146 | HVAC Dealer Marketing for Dealers and Manufacturers | 903 | LocalBusiness, BlogPosting | 3 | few internal links in |
| `/hvac-marketing-strategies/` | WordPress | HVAC Marketing Strategies To Grow Your Business | Kosick Communications (71) | 143 | HVAC Marketing Strategies to Grow Your Heating and Cooling B | 1014 | LocalBusiness, BlogPosting | 2 | title truncates in results; few internal links in |
| `/increase-golf-course-revenue/` | WordPress | How To Increase Golf Course Revenue: Rounds & Members | Kosick Communications (77) | 165 | How to Increase Golf Course Revenue, Whether You Sell Rounds | 846 | LocalBusiness, BlogPosting | 3 | title truncates in results; heading skip h1→h3; few internal links in |
| `/is-television-advertising-worth-it/` | WordPress | Is Television Advertising Still Worth It In 2026? (49) | 153 | Is Television Advertising Still Worth It in 2026? | 949 | LocalBusiness, BlogPosting | 3 | heading skip h1→h3; few internal links in |
| `/media-buyer-canada-us/` | WordPress | Media Buyer In Canada & The US | Kosick Communications (54) | 150 | Media Buyer: What We Do, Where We Buy, and Why It Matters fo | 1137 | LocalBusiness, BlogPosting | 2 | few internal links in |
| `/media-buying-process/` | WordPress | The Media Buying Process: A Step-by-Step Guide | Kosick Communications (70) | 171 | Inside the Media Buying Process: Six Steps From Brief to Opt | 968 | LocalBusiness, BlogPosting | 7 | title truncates in results; description truncates; heading skip h1→h3 |
| `/media-buying-strategies-for-vancouver/` | WordPress | Top Media Buying Strategies | Kosick Communications (51) | 141 | Media Buying Strategies for Vancouver Businesses | 799 | LocalBusiness, BlogPosting | 1 | few internal links in |
| `/medical-marketing-vancouver/` | WordPress | Medical Marketing For Medical Aesthetics And Dental Clinics (59) | 138 | Medical Marketing That Feels Premium: A Practical Guide for  | 1117 | LocalBusiness, BlogPosting | 3 | heading skip h1→h3; few internal links in |
| `/optimize-lead-generation/` | WordPress | Lead Generation For Businesses | Kosick Communications (54) | 142 | Lead Generation: What It Is, and How We Help Businesses Turn | 1620 | LocalBusiness, BlogPosting | 2 | few internal links in |
| `/organic-social-media-vs-paid-advertising/` | WordPress | Organic Social Media Vs Paid Advertising | Kosick Communications (64) | 148 | The Power of Organic Social vs. Paid Ads and When to Amplify | 1279 | LocalBusiness, BlogPosting | 1 | few internal links in |
| `/outdoor-advertising-maximize-local-impact/` | WordPress | Outdoor Advertising To Maximize Local Impact | Kosick Communications (68) | 149 | Outdoor Advertising: Maximize Local Impact | 782 | LocalBusiness, BlogPosting | 1 | title truncates in results; heading skip h1→h3; few internal links in |
| `/outdoor-advertising-vancouver/` | WordPress | Outdoor Advertising In Vancouver | Billboards (45) | 151 | Outdoor Advertising That Actually Drives Calls, Clicks, and  | 1192 | LocalBusiness, BlogPosting | 2 | few internal links in |
| `/shopify-vs-woocommerce/` | WordPress | Shopify Vs WooCommerce: Which Is Best? (38) | 142 | Shopify vs. WooCommerce: Which Platform Is Right for Your Bu | 1005 | LocalBusiness, BlogPosting | 1 | few internal links in |
| `/social-media-advertising-vancouver/` | WordPress | Social Media Advertising In Vancouver 2026 (42) | 147 | Social Media Advertising in Vancouver: A 2026 Guide to Growt | 1201 | LocalBusiness, BlogPosting | 2 | few internal links in |
| `/social-media-marketing-build-an-audience/` | WordPress | How To Build A Social Media Audience | Kosick Communications (60) | 126 | How to Build a Social Media Audience | 814 | LocalBusiness, BlogPosting | 1 | few internal links in |
| `/the-power-of-radio-advertising/` | WordPress | The Power Of Radio Advertising | Kosick Communications (54) | 145 | The Power of Radio Advertising | 960 | LocalBusiness, BlogPosting | 2 | few internal links in |
| `/travel-marketing-canada/` | WordPress | Travel Marketing In Canada: Sponsorship, TV And Digital (55) | 159 | Travel Marketing in Canada: How Sponsorship, Linear TV and D | 1281 | LocalBusiness, BlogPosting | 2 | heading skip h1→h3; few internal links in |
| `/understanding-digital-pre-roll-advertising/` | WordPress | Understanding Pre-Roll Advertising | Kosick Communications (58) | 149 | Understanding Pre-Roll Advertising: Expanding Reach Through  | 1004 | LocalBusiness, BlogPosting | 1 | few internal links in |
| `/vancouver-event-marketing/` | WordPress | Vancouver Event Marketing Experts | Kosick Communications (57) | 152 | Vancouver’s Event Marketing Experts: Conferences, Incentive  | 915 | LocalBusiness, BlogPosting, VideoObject | 1 | few internal links in |
| `/vancouver-marketing-blending-strategies/` | WordPress | Vancouver Marketing Strategies - Kosick Communications (54) | 142 | Success of Blending Strategies | 889 | LocalBusiness, BlogPosting | 1 | few internal links in |
| `/vancouver-sponsorships-that-performs/` | WordPress | Sponsorship That Performs: CTV Morning Live (43) | 145 | Sponsorship That Performs: Our Latest CTV Your Morning Live  | 1259 | LocalBusiness, BlogPosting, VideoObject | 2 | few internal links in |
| `/vancouver-web-development-e-commerce/` | WordPress | Website Development & E-commerce | Kosick Communications (56) | 147 | Vancouver Web Development & E-Commerce: Why Your Business Ne | 817 | LocalBusiness, BlogPosting | 1 | few internal links in |
| `/web-development-and-hosting-that-improves-seo/` | WordPress | Web Development And Hosting That Improves SEO (45) | 150 | Guide to Web Development and Website Hosting That Actually I | 901 | LocalBusiness, BlogPosting | 2 | heading skip h1→h3; few internal links in |
| `/what-a-marketing-agency-can-do-for-your-business/` | WordPress | The Role Of A Marketing Agency In Driving Growth | Kosick Communications (72) | 148 | What a Marketing Agency Can Do for Your Business? | 821 | LocalBusiness, BlogPosting | 1 | title truncates in results; heading skip h1→h3; few internal links in |
| `/what-is-social-marketing/` | WordPress | What Is Social Marketing? A Guide For Canadian Businesses | Kosick Communications (81) | 129 | What Is Social Marketing? A Guide for Canadian Businesses | 1140 | LocalBusiness, BlogPosting | 2 | title truncates in results; few internal links in |
| `/why-companies-use-digital-marketing-to-grow-their-business/` | WordPress | Why Companies Use Digital Marketing | Kosick Communications (59) | 144 | Why Companies Use Digital Marketing to Grow Their Business | 716 | LocalBusiness, BlogPosting | 1 | heading skip h1→h3; few internal links in |
| `/why-media-buying-matters/` | WordPress | Why Media Buying Matters | Kosick Communications (48) | 150 | Why Media Buying Matters: Inside Our Vancouver Ad Agency’s S | 705 | LocalBusiness, BlogPosting | 1 | few internal links in |


## 10. How this was verified

- **Build:** `npm run lint`, `npx tsc --noEmit` and `npm run build`, run after the final change.
- **Crawl:** the production build was crawled as `www.kosick.com` from the sitemap plus every internal link. For each page the crawl recorded status, head tags, heading outline, image alt attributes, JSON-LD (parsed and checked against Google's required properties) and every link.
- **Legacy URLs:** every URL in the live WordPress sitemaps, plus its slash-less variant and every redirect source, was followed hop by hop.
- **Live WordPress:** the head tags of all 72 snapshot pages on live `www.kosick.com` were compared with the snapshot, using read-only GET requests.
- **Browser checks:** Edge at 1440 px and on an iPhone 13 profile. Checked that the posters paint first, the videos start after `load`, only the visible slide plays, and the heading text and the tab and article images are right. No console errors.
- **Performance:** Lighthouse 12.8 with both simulated and DevTools throttling.
- **Not checked:**
  - Google's Rich Results Test and the Schema Markup Validator need a public URL, so they weren't run. Run both on the Vercel production URL before cutover: the homepage, one service page, one industry subpage and one article.
  - Off-site links to external sites weren't requested. There are only 13 unique external URLs, all social profiles and platform pages.
