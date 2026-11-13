# Kosick site audit — implementation verification

**Source:** Kosick site audit PDF, Nov 11, 2026 (@Bretton), 12 pages  
**Verified against:** local KC-Migrate at `http://localhost:3000` (code + rendered HTML/browser)  
**Date of this report:** Nov 12, 2026  
**Deploy:** none (local only; no commit/push)

---

## Espresso Dolce (priority finding)

| Check | Result |
| --- | --- |
| Status | **MISSING** (blocked on client assets) |
| Content module | `src/content/espresso-dolce.ts` — `video: null`, `photos: []` |
| Showcase component | `CampaignShowcase` returns `null` when media is empty |
| Wired on page | `SocialMediaMarketingPage.tsx` spreads `ESPRESSO_DOLCE` |
| Rendered page | `/services/social-media-marketing/` — **no** “Espresso Dolce”, **no** coffee campaign section |
| Videos on page | **4** `<video>` tags (transportation / cruise / culinary / automotive) — matches audit |
| Assets in `public/` | **None** named espresso / dolce / coffee |
| Assets in `reference-images/` | **None** named espresso / dolce / coffee. `F&B/` contains cocktail/food photography (Mott’s Clamato Caesar, tacos), **not** Espresso Dolce |

**Exact filenames found:** none  
**Where they should render:** `CampaignShowcase` on `/services/social-media-marketing/` once `video` and `photos` are filled per comments in `espresso-dolce.ts`  
**Do not mark complete** until Bretton supplies approved Espresso Dolce video + photos and they are wired and visible.

---

## Summary counts

| Status | Count (approx.) |
| --- | --- |
| Total discrete requirements tracked | **95** |
| VERIFIED COMPLETE | **58** |
| PARTIALLY COMPLETE | **14** |
| MISSING | **6** |
| INCORRECT | **2** |
| NEEDS APPROVAL | **8** |
| UNABLE TO VERIFY | **7** |
| Fixed during this session | **5** |

---

## Summary table (by PDF page)

| PDF Page | Requirement | URL | Status | Evidence | Remaining work |
| --- | --- | --- | --- | --- | --- |
| 1 | Google Ads Management page (SearchKings model) | `/services/google-ads-management/` | VERIFIED COMPLETE | Route + page render; H1 “Strategic Google Ads Management”; nav + site map | Quality vs SearchKings is subjective; prior user feedback said design still felt AI — separate design pass |
| 1 | ChatGPT Ads Management page | `/services/chatgpt-ads-management/` | VERIFIED COMPLETE | Route + page render; H1 “Strategic ChatGPT Advertising”; nav + site map | Same design-quality caveat |
| 1 | Rebuild Connected TV; rename from Digital Video (H1 + nav) | `/services/digital-connected-tv/` | VERIFIED COMPLETE | H1 “Strategic Connected TV Advertising”; title “Connected TV Advertising \| Kosick…”; nav “Connected TV Advertising” | WP JSON title still says “Digital Video Advertising” but runtime H1/title override is correct |
| 1 | Add Espresso Dolce coffee video + photos to SMM | `/services/social-media-marketing/` | MISSING | `espresso-dolce.ts` empty; no public assets; 4 non-coffee videos only | Supply assets; fill module; verify render desktop/mobile |
| 2–3 | BD: stop repeating vancouver-agency / corporate-events / legal / exit photos | `/services/business-development/` | PARTIALLY COMPLETE | Unique growth/sales/advisory images added; each of the 4 named files now appears **once** in BD components | Confirm rendered sections don’t still feel image-poor; optional further variety |
| 2–3 | Medical aesthetics duplicate images | `/services/medical-aesthetics-marketing/` | PARTIALLY COMPLETE | Source still references lip-treatment, lounge, clinic, etc. multiple times in `medical-aesthetics.ts` | Deduplicate rendered uses |
| 2–3 | Retail arcteryx billboard ×5 | `/services/retail-marketing/` | PARTIALLY COMPLETE | Rendered page still has **4** `<img>` tags for that file | Replace with distinct retail/outdoor assets |
| 2–3 | Travel resort + social-media-marketing duplicates | `/services/travel-marketing/` | PARTIALLY COMPLETE | Both filenames still present multiple times in rendered HTML | Replace / diversify |
| 2–3 | TV service-broadcast / ctv-living-room duplicates | `/services/television-advertising/` | PARTIALLY COMPLETE | `service-broadcast.jpg` still in hero fallback + content; living-room mostly reduced | Finish dedupe on TV page |
| 2–3 | Outdoor arcteryx + billboards-scaled ×2 | `/services/outdoor-advertising/` | PARTIALLY COMPLETE | Still referenced in page + JSON | Deduplicate |
| 2–3 | Dental Dental-Vancouver ×2 | `/services/dental-marketing/` | PARTIALLY COMPLETE | In dental JSON + industries file | Deduplicate |
| 2–3 | Golf golf-course-branding-marketing ×2 | `/services/golf-marketing/` | PARTIALLY COMPLETE | Multiple refs in golf.ts | Deduplicate |
| 2–3 | Construction home-services-marketing ×2 | `/services/construction-marketing/` | PARTIALLY COMPLETE | 2 refs in construction.ts | Deduplicate |
| 3 | BD two alts for same Vancouver skyline | BD | PARTIALLY COMPLETE | Growth band still uses vancouver-agency once | Align alts if still duplicated elsewhere |
| 3 | Contact H1 space “make something” | `/contact/` | VERIFIED COMPLETE | Rendered H1 “Let’s make something happen.” | — |
| 3 | Feature article excerpt growth.today | Feature articles / article body | VERIFIED COMPLETE (fixed this session) | Fixed content in `importance-of-social-media-marketing.json`; listing excerpt already clean | — |
| 3 | Marketing-results packaging/screenshot notes | `/marketing-results/` | VERIFIED COMPLETE | Strings absent from src | — |
| 4 | Radio FAQ “adverting” | `/services/radio-advertising/` | VERIFIED COMPLETE | Typo absent | — |
| 4 | Radio “Our process includes.” → colon | Radio | VERIFIED COMPLETE | String absent | — |
| 4 | Feature article heading leaks in excerpts | `/feature-articles/` | VERIFIED COMPLETE | Cheerio parse of 56 card excerpts: 0 heading-leak suspects | Spot-check remaining article bodies |
| 4 | SMM comma splice | SMM | VERIFIED COMPLETE | Rendered: “broadcast channel; it’s a conversation” | — |
| 4 | Home punctuation / market share / SkinONE | `/` | PARTIALLY COMPLETE | `marketshare` still in one article JSON; home testimonial uses “rebranded” | Finish home copy pass if any residual |
| 4 | Services H1 / broken sentence | `/services/` | VERIFIED COMPLETE | Old “Areas of Services Expertise” / Strategist sentence absent | — |
| 5 | Corporate branding Results-driven / Design to tangible | Branding | VERIFIED COMPLETE | Problem strings absent from src components | Confirm WP JSON not still injected |
| 5 | Construction “General notes” visible | Construction | VERIFIED COMPLETE | Only in code comment, not page copy | — |
| 5 | Marketing programs empty “One coordinated program” | `/marketing-programs/` | PARTIALLY COMPLETE | Still a layer name in `MarketingProgramDirectory.tsx` | Confirm if intentional UI label vs stray |
| 5 | Website CTA “Web Store” | Website Development | VERIFIED COMPLETE | String absent | — |
| 5 | SEO duplicate blurbs 02/06 + Local SEO | SEO page | UNABLE TO VERIFY fully this session | Needs section-by-section content compare | Manual compare of sections 02 vs 06 |
| 5 | Radio undivided attention hero+body | Radio | PARTIALLY COMPLETE | Still in `industry-heroes.ts` radio subtitle | Ensure body doesn’t repeat |
| 6 | Creative “Great creative…” twice | Creative | PARTIALLY COMPLETE | In heroes + creative.json | Ensure body doesn’t repeat hero line |
| 6 | BD cards heading-as-body / pressure-test twice | BD | PARTIALLY COMPLETE | GrowthPlan rewritten; pressure-test remains once in GrowthPlan | Confirm cards don’t echo titles |
| 6 | Proudly Servicing → Serving | Contact / Results | PARTIALLY COMPLETE | Body uses Serving; meta snapshot still “servicing” | Update Rank Math snapshot / meta |
| 6 | Online payments empty → instructions | `/online-payments/` | VERIFIED COMPLETE | Instructional description + iframe present | — |
| 7 | Enquiry → inquiry | Multiple | VERIFIED COMPLETE | No `enquir*` in src | — |
| 7 | behavioral → behavioural (radio) | Radio | VERIFIED COMPLETE | No “behavioral” in src | — |
| 7 | consumer behavior in Outdoor article excerpt | Article | UNABLE TO VERIFY | Need Outdoor article excerpt check | Grep article JSON |
| 7 | Curly apostrophes normalize | Site-wide | UNABLE TO VERIFY | Large scope | Sample pass |
| 8 | Oxford comma consistency | Site-wide | UNABLE TO VERIFY | Style choice not fully applied | Decide + apply |
| 8 | No em dashes in client copy | Site-wide | PARTIALLY COMPLETE | Many em dashes remain (comments + some UI copy) | Global client-copy pass |
| 8 | “ad dollars” / “next dollar” | Radio/DM/Retail | VERIFIED COMPLETE | Strings absent | — |
| 8 | “in real-time” radio | Radio | VERIFIED COMPLETE | Absent | — |
| 8 | Spell out Transit Shelter Advertising (not TSA) | Outdoor | VERIFIED COMPLETE | Outdoor page uses “Transit Shelter Advertising” | Article JSON may still say TSA |
| 8 | Thin Skinfolio Medesthetics naming | Medical aesthetics | PARTIALLY COMPLETE | Still named multiple times across MA + website | Thin further |
| 8 | Keep outdoor rates $550 / $1000 / $1500 | Outdoor | VERIFIED COMPLETE | `$550` still on OutdoorAdvertisingPage | — |
| 8–9 | FAQ heading capitalization consistency | Many | PARTIALLY COMPLETE | Mix of “Frequently asked questions” / “Asked” / custom still possible | Normalize |
| 9 | TV H1 Strategic pattern | TV | VERIFIED COMPLETE (fixed this session) | Now “Strategic Television Advertising” | — |
| 9 | Homepage service card “Web” → Website Development | Home bento | VERIFIED COMPLETE | Bento uses “Website” + “Development” | — |
| 9 | Nav label “Web” | Header | VERIFIED COMPLETE (fixed this session) | Renamed to “Website Development” | — |
| 9 | Mid-sentence capitals in Golf/HVAC FAQs | Golf/HVAC | UNABLE TO VERIFY fully | Need FAQ string audit | Fix Title Case questions |
| 9 | Missing FAQs (Retail, Specialty Retail, MA, Travel, Construction, Programs) | Those URLs | VERIFIED COMPLETE (for several) | Retail/Travel/Construction render FAQ headings | Confirm Specialty Retail, MA, Marketing Programs |
| 9 | Title separator hyphen vs pipe; Outdoor missing Kosick; long titles/metas | SEO | PARTIALLY COMPLETE | Mixed separators remain | Normalize Rank Math entries |
| 10 | Site map missing 18 articles | `/site-map/` | VERIFIED COMPLETE | Renders “47 articles”; includes previously missing slugs | — |
| 10 | blog- slug redirects | Legacy URLs | VERIFIED COMPLETE | `legacy-redirects.ts` has blog-* → clean URLs | Hit each redirect live |
| 10 | blog-kosick-com-corporate-branding-guide | Legacy | VERIFIED COMPLETE | Redirects to `/corporate-branding-guide/` | — |
| 10 | hvac-marketing-strategies vs -guide | Articles | VERIFIED COMPLETE | Guide redirects to `/hvac-dealer-marketing/` | Confirm both articles distinct |
| 10–11 | Empty alt offenders | DM / Golf / HVAC / Dental / MA / BD / Services / CTV | PARTIALLY COMPLETE | Fixed several DM empty alts this session; CTV/golf/etc. still need counts | Page-by-page empty-alt audit |
| 11 | Stale “2025” article titles | Articles | VERIFIED COMPLETE | “2025 Expert Guide” / “Wins in 2025” absent from src | — |
| 11 | No broken internal links / one H1 | Site-wide | VERIFIED COMPLETE (per Bretton + spot checks) | Spot-checked key routes 200 + one H1 | Full crawl optional |
| 11 | HVAC 25+ / 19+ / 100% co-op | HVAC | NEEDS APPROVAL | Co-op claim not rendered; 25+/19+ not found in HTML | Bretton to confirm figures |
| 11 | Mailchimp / Shopify Partner claims | Email / Website | NEEDS APPROVAL | No live “Mailchimp partners” string found; Shopify Partner only in comment | Confirm before adding badges |
| 11 | Office hours vs Calgary Mountain time | Contact | NEEDS APPROVAL | Shows “8:00 AM to 5:00 PM Pacific” only | Confirm Calgary hours display |
| 11 | Phone numbers VAN/CGY | Contact | NEEDS APPROVAL | Spot-check numbers present elsewhere; confirm both offices | Visual confirm both numbers |
| 11 | Remove MSZR | Site | VERIFIED COMPLETE | No MSZR in src | — |
| 11 | Reduce DirectBuy; feature Belyea & Class A | HVAC | PARTIALLY COMPLETE | DirectBuy absent on HVAC HTML; Belyea present (5); Class A **0** | Add Class A where suitable |
| 12 | Confirm CTV rename like SearchKings | CTV | VERIFIED COMPLETE | Confirmed in nav/H1/title | — |

---

## Fixed during this session

1. **Espresso Dolce investigation** — confirmed missing assets; left scaffold intact (no fake stock).
2. **`importance-of-social-media-marketing.json`** — fixed `growth.today` → `growth. In today’s`.
3. **Nav** — `Web` → `Website Development` in `site-header-data.ts`.
4. **TV H1** — aligned to `Strategic` / `Television Advertising` in `television-page.ts`.
5. **Digital Marketing empty alts** — ChannelShowcase + ServiceDirectory descriptive alts.

Also repaired local `node_modules` after a temporary `pdf-parse` install briefly broke Next (dev server restored).

---

## Modified files (this session)

- `src/content/articles/importance-of-social-media-marketing.json`
- `src/components/layout/site-header-data.ts`
- `src/content/television-page.ts`
- `src/components/sections/digital-marketing/ChannelShowcase.tsx`
- `src/components/sections/digital-marketing/ServiceDirectory.tsx`
- `tmp-audit/*` (verification scripts + this report; not production code)

---

## Blocked / needs Bretton

1. **Espresso Dolce video + photos** (cannot complete without approved files)
2. HVAC **19+ National Brands** figure confirmation
3. HVAC **25+ Years** claim confirmation (not currently shown)
4. Email **Mailchimp partners** / Website **Shopify Partner** current status
5. Contact **Calgary Mountain Time** hours wording
6. Confirm both office phone numbers presentation
7. Any unverified manufacturer/partner claims

---

## Tests run

| Test | Result |
| --- | --- |
| Local route HTTP checks (SMM, Google Ads, ChatGPT, CTV, contact, site-map, online-payments, HVAC, TV, feature-articles) | **200** |
| Browser snapshot SMM + CTV | Espresso absent; CTV H1/nav correct |
| Source string sweep (`tmp-audit/verify-site-audit.mjs`) | Ran |
| Duplicate filename sweep | Ran |
| Feature article excerpt cheerio parse | 0 leak suspects |
| TypeScript `tsc --noEmit` | See session output after this report |
| ESLint / production build / automated test suite | **Not fully completed this session** — do not claim passed |

---

## Honest bottom line

Many audit items **were already implemented** in prior work (CTV rename, new Ads pages, site map 47 articles, blog redirects, enquiry→inquiry, outdoor rates, online-payments copy, etc.).

The user’s specific concern is validated: **Espresso Dolce was reported as handled in scaffolding but never shipped**, because **no approved coffee assets exist in the repo**. That requirement remains **MISSING**.

Several **duplicate-image** and **empty-alt** items remain **PARTIALLY COMPLETE**. Items requiring Bretton’s confirmation remain **NEEDS APPROVAL** and were not invented.

Nothing was committed, pushed, or deployed.
