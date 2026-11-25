# Google Ads conversion tracking

How conversions reach Google on kosick.com, and how to find out why existing ones may have stopped. Based on GTM container **GTM-K4QK6SP version 13**, read live on 24 Nov 2026.

Related: [GTM_CONVERSION_SETUP.md](GTM_CONVERSION_SETUP.md) (adding the two new conversions) and [PRIVACY_AND_CONSENT_NOTES.md](PRIVACY_AND_CONSENT_NOTES.md) (privacy policy and consent concerns).

## Verification levels

| Level | Status | What it covers |
| --- | --- | --- |
| Automated (Node tests, TypeScript, lint, build) | Done | The events the page pushes, in the shape the container reads: `npm run test:tracking` (29 tests) |
| Local browser | Not done | An 18 Nov browser run against the published container showed all three existing Ads conversions firing; it predates these changes |
| Production | Read-only | Live HTML and the live container are checked after each deploy |
| Google Ads receipt | **Not verified** | Only Tag Assistant and the Google Ads status page can show it. Conversion tracking is not confirmed restored until that is done. |

## How tracking works

**Tag Manager is the only loader.** The page loads `gtm.js` and nothing else from Google. The container holds the Google tags for **G-XPYR1CEF3E** and **AW-785313466**, the Conversion Linker and every conversion. The app loads no `gtag.js`, issues no `gtag('config')` and sends no conversion itself. A test enforces all three.

The app's job is to push events to the `dataLayer`. The tags are the container's:

| What | Page pushes | Container fires |
| --- | --- | --- |
| Contact form lead | `kosick_contact_lead`, only after the server accepted the form, with `transaction_id`, `lead_email`, `lead_phone` | Ads conversion `a619CO…`, GA4 `generate_lead` |
| Call click | `phone_click` (informational) | A link-click trigger on `tel:`: Ads `ZX2WCM…`, GA4 `phone_click` |
| Email click | `email_click` (informational) | A link-click trigger on `mailto:`: Ads `vL_HCO…`, GA4 `email_click` |
| Newsletter signup | `kosick_newsletter_signup` | Nothing (not a lead) |
| Chat lead | One GA4 `generate_lead` command | Unchanged; the chat never triggers the form conversion |

`window.gtag` (Google's standard `dataLayer.push(arguments)` stub) is defined in the snippet that starts GTM. GTM does not create one; WordPress had one only because Site Kit loaded `gtag.js` beside GTM. Nothing depends on it.

### The transaction id

`transaction_id` is the form's submission id: a UUID created once per form, sent to the server and read back from the same data for the event. A failed attempt keeps the id, so a retry reuses it. Success issues a new one for the next lead. It carries no personal information. In the container it is the conversion's Transaction ID, so Google drops a repeat of the same lead.

## The existing form conversion fires once per page load

In the container the form tag `a619…` is the only conversion tag set to **Once per page**; the call, email and GA4 tags are all **Once per event**. WordPress reloaded the page on every submission, so every lead counted. The new site stays on the same page load after a submission, so a second lead in the same visit is not counted. The fix, in Tag Manager, is in step 4 of [GTM_CONVERSION_SETUP.md](GTM_CONVERSION_SETUP.md).

## Diagnosing the existing conversions

**Google Ads** (Goals → Conversions → Summary):
1. Status of each of the three actions and its *Last conversion* date. Compare with the cutover around 17–18 Nov.
2. Segment by Conversion action and day, back to October, to see the exact day each stopped.
3. For each: Primary or Secondary, Count (One or Every) and the attribution window.
4. The action's Diagnostics: "No recent conversions", "Unverified", a missing Conversion Linker, or Enhanced Conversions errors.
5. Enhanced Conversions (Settings): status, and that the customer data terms are accepted.
6. Admin → Account settings: auto-tagging is on.
7. **Final URLs.** Ads, sitelinks and the landing pages report: any final URL that points at one of the 23 old WordPress URLs that returned 404 until 23 Nov, or at a page that no longer exists, sends paid visitors where nothing can convert.
8. Linked GA4: whether a GA4-imported `generate_lead` is also Primary, which would double count with the form conversion.

**Tag Manager** (container GTM-K4QK6SP):
1. The published version is 13, with no unpublished changes in the workspace.
2. Preview on `www.kosick.com`: a `tel:` click fires the call tag; a lead fires the form tag; each shows *Succeeded*.
3. In Preview's Data Layer tab, `lead_email` is lower case and `lead_phone` starts `+1` on the lead event.
4. The Conversion Linker runs on the first event of every page.
5. Tag firing options (above).
6. Only one container on the page, and no second `gtag.js` for AW-785313466 or G-XPYR1CEF3E.

## Historical reporting

Nothing changes retroactively. The three existing actions keep their history and keep firing. New actions count only from the day they are published. Changing `a619…` to Once per event can only raise the lead count, and only for visits with more than one lead.
