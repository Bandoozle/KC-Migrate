# kosick.com launch runbook

Moving www.kosick.com from WordPress to the Next.js site on Vercel. Recorded 3 November 2026.

## 1. Current state

| Item | Value |
| --- | --- |
| Production URL | https://kc-migrate.vercel.app |
| Production deployment | `dpl_9nbMpbU44LGNNtp55pUScdxqRPxg`, commit `91b093d` on `main` (later commits that only change this runbook don't change the site) |
| Vercel project | `kc-migrate` in team `bandoozles-projects` (Hobby plan, see §2) |
| Production branch | `main`. The release branch `release/vercel-preview-2026-10-22` is identical. |
| Custom domains on the project | None. `kosick.com` is registered in the Vercel team but not attached. |
| AI chat | Next.js `/api/chat*` relays to the AI Chat Assistant plugin on `https://staging.kosick.com` |
| Forms | Supabase storage plus Resend email (`FORMS_EMAIL` live, WordPress relay off), retried by Supabase pg_cron |
| Analytics | GTM `GTM-K4QK6SP` and GA4 `G-XPYR1CEF3E`. These load only on `kosick.com` and `www.kosick.com`, so they start at cutover. |

### Current DNS (Cloudflare, nameservers `aarav` and `coco`), recorded for rollback

| Name | Type | Value seen publicly | Notes |
| --- | --- | --- | --- |
| `kosick.com` | A / AAAA | Proxied (Cloudflare IPs 104.21.21.141, 172.67.199.27) | The origin is hidden by the proxy. Copy the exact record from the Cloudflare dashboard before cutover. |
| `www` | A / AAAA | Proxied (same Cloudflare IPs) | Same as above |
| `staging` | A / AAAA | Proxied (same Cloudflare IPs) | **Do not change** |
| `kosick.com` | MX | Google Workspace (`aspmx.l.google.com` and alternates) | Do not change |
| `kosick.com` | TXT | `google-site-verification=…`, SPF `v=spf1 +a +mx +ip4:149.248.33.195 +ip4:67.227.157.242 include:_spf.elasticemail.com ~all` | Do not change |
| `_dmarc` | TXT | `v=DMARC1; p=none;` | Do not change |
| `resend._domainkey` | TXT | Resend DKIM key | Do not change: form emails depend on it |
| `send` | MX / TXT | `send.forge.rmta.net` and its SPF | Do not change |

The WordPress origin for both `www` and `staging` answers at **149.248.33.195**. These are two separate WordPress apps on one server: each has its own site URL, and the `www` app reports `https://www.kosick.com/wp-json/…` while staging reports `https://staging.kosick.com/wp-json/…`. Confirm in the Cloudflare dashboard that the `@` and `www` records point there, and **screenshot both records before changing anything**.

## 2. Decisions needed from Bretton

1. **Approval to switch the domain.**
2. **Vercel plan.** The project is on Vercel's **Hobby** plan, in a personal team (`bandoozle`). Vercel's terms limit Hobby to personal, non-commercial use, so a company website should run on **Pro**, a paid plan (check Vercel's current pricing). Kosick may also want the project in a company-owned team. If so, transfer it **before** cutover, then confirm its environment variables and production URL afterwards.
3. **Privacy policy.** The draft is at https://kc-migrate.vercel.app/privacy-policy/ (noindex, not linked). The open points are shown on the page and listed in §8.
4. **`/services/creative/` is `index, nofollow`.** This is inherited from Rank Math on the live site. Keep it, or change to `index, follow`?
5. **Old WordPress `www` app.** How long to keep it after launch. Recommended: at least 2 weeks.

## 3. Before cutover (can be done today, no public impact)

### 3.1 Confirm form records and clean up test data (needs Supabase access)

Run in Supabase → SQL editor:

```sql
-- Test submissions from the launch QA (3 Nov) and the earlier audit (2 Nov)
select 'contact' as form, id, created_at, name, email, notification_status, autoresponse_status
from public.contact_submissions
where name like '[TEST%' or email ilike 'marco%@kosick.com'
union all
select 'newsletter', id, created_at, null, email, notification_status, autoresponse_status
from public.newsletter_signups
where email ilike 'marco%@kosick.com'
order by created_at desc;

-- Both scheduled jobs exist and are active: retry-form-email (every 10 min) and purge-form-data (daily)
select jobid, jobname, schedule, active from cron.job;

-- Recent retry runs: before cutover they call www.kosick.com (still WordPress), so 404s are expected until launch
select j.jobname, d.status, d.return_message, d.start_time
from cron.job_run_details d join cron.job j using (jobid)
order by d.start_time desc limit 10;
```

Expected result: the 3 Nov rows show `notification_status = sent` and `autoresponse_status = sent`. The autoresponses were confirmed in the marco@kosick.com inbox. After reviewing, delete the test rows:

```sql
delete from public.contact_submissions where name like '[TEST - Claude QA%';
delete from public.newsletter_signups where email = 'marco+launchqa@kosick.com';
-- Also delete the 2 Nov audit rows once identified by the select above
```

If `cron.job` has no `retry-form-email` row, run `supabase/schedule-form-email-retry.sql` with the real `CRON_SECRET`.

### 3.2 Confirm the team notification emails (needs the info@kosick.com inbox)

These test emails should be in info@kosick.com. Delete them afterwards.

- "Kosick Communications Ltd. Contact" style notification for `[TEST - Claude QA 2026-11-03…] Marco`
- A newsletter signup notification for `marco+launchqa@kosick.com`
- The AI chat lead email from the staging plugin (lead #13328, `[TEST - Claude QA…]`). Delete leads #13328 and the earlier `[TEST - Claude QA] Marco Kosick` lead in staging → AI Chat Assistant → Leads.

### 3.3 Add the staging noindex rule (Cloudflare)

Cloudflare → kosick.com → Rules → Transform Rules → **Modify Response Header** → Create rule:

- Rule name: `Staging noindex`
- When incoming requests match: custom filter, **Hostname equals `staging.kosick.com`**
  Expression: `(http.host eq "staging.kosick.com")`
- Then: **Set static**, header `X-Robots-Tag`, value `noindex, nofollow`
- Deploy

Check it:

```bash
curl -sI https://staging.kosick.com/ | grep -i x-robots-tag          # X-Robots-Tag: noindex, nofollow
curl -s -X POST https://kc-migrate.vercel.app/api/chat/ -H 'content-type: application/json' \
  -d '{"messages":[{"role":"user","content":"What are your hours?"}]}'  # still returns a reply
```

Don't add a `robots.txt` Disallow on staging: Google could then never see the noindex. Don't password-protect staging either: the chat needs `/wp-json/aca/v1/*` to be reachable.

### 3.4 Check Cloudflare rules that touch `www` or `@`

With the DNS-only records below, Cloudflare page rules, redirect rules, cache rules and Workers no longer apply to `www` or the apex. Note any that exist so they can be restored on rollback. Rules for `staging` keep working.

## 4. Cutover (after Bretton approves)

Allow about 30 minutes. Do it outside business hours if possible.

1. **Vercel → kc-migrate → Settings → Domains**
   1. Add `www.kosick.com` and connect it to **Production**.
   2. Add `kosick.com` and set it to **Redirect to `www.kosick.com`** with **308 Permanent**.
   3. Both show "Invalid Configuration" until step 2. That's expected.
2. **Cloudflare → kosick.com → DNS → Records** (change only these two names):

   | Action | Type | Name | Content | Proxy status | TTL |
   | --- | --- | --- | --- | --- | --- |
   | Replace the existing A/AAAA records | **CNAME** | `www` | `cname.vercel-dns.com` | **DNS only** (grey cloud) | Auto |
   | Replace the existing A record | **A** | `@` | `76.76.21.21` | **DNS only** (grey cloud) | Auto |
   | Delete | AAAA | `@` and `www` | (any existing AAAA records) | | |

   These are the values Vercel recommends for this project (`vercel domains inspect kosick.com`, and the domain config API for `www`). If the Vercel dashboard shows different values after step 1, use those.
3. **Wait** until both domains show "Valid Configuration" in Vercel and the certificate is issued, usually 1–10 minutes.
4. **Verify** (§5).

## 5. Verify after cutover

```bash
curl -sI http://kosick.com/          | grep -iE "^(HTTP|location)"   # 301/308 -> https
curl -sI https://kosick.com/         | grep -iE "^(HTTP|location)"   # 308 -> https://www.kosick.com/
curl -sI https://www.kosick.com/     | grep -iE "^(HTTP|server)"     # 200, server: Vercel
curl -s  https://www.kosick.com/robots.txt                           # Allow: / and Sitemap: https://www.kosick.com/sitemap_index.xml
curl -s  https://www.kosick.com/sitemap.xml | grep -c "<loc>"        # 102
curl -sI https://www.kosick.com/blog/ | grep -iE "^(HTTP|location)"  # 308 -> /feature-articles/
curl -sI https://staging.kosick.com/ | grep -i x-robots              # noindex, nofollow
```

In a browser on https://www.kosick.com:

- [ ] Home, Services, a service page, an industry page, Contact, Feature Articles and an article load. Check the phone layout too.
- [ ] Contact form: send one labelled test. It should redirect to `/thanks/`, the notification should reach info@, and the autoresponse should reach the visitor.
- [ ] Newsletter: one labelled test signup.
- [ ] Chat: ask a question and get a reply. The call button dials 604-925-5800.
- [ ] GA4 → Reports → Realtime shows your visit, and GTM Tag Assistant shows GA4 and Google Ads tags firing.
- [ ] Supabase `cron.job_run_details`: the next `retry-form-email` run returns HTTP 200 (it now reaches the new site).
- [ ] Google Search Console: submit `https://www.kosick.com/sitemap_index.xml` and inspect the home page.
- [ ] Delete the test submissions (§3.1 queries).

## 6. Rollback

Use this if the new site has a serious problem. It takes about 5 minutes.

1. Cloudflare → DNS: restore `@` and `www` exactly as recorded in §1. That's the original A/AAAA records to the WordPress origin, **Proxied** (orange cloud). Remove the `www` CNAME and the `@` 76.76.21.21 A record. Re-enable any rules noted in §3.4.
2. Vercel: optionally remove `www.kosick.com` and `kosick.com` from the project. It's harmless to leave them; they just show "Invalid Configuration".
3. Check: `curl -s https://www.kosick.com/ | grep -c acaConfig` should return `1` (the WordPress page).

Rolling back loses nothing:

- Contact and newsletter submissions made on the new site are in Supabase and were emailed.
- Chat leads are in staging WordPress.
- The old `www` WordPress app is untouched by the cutover.

## 7. After launch

- **Keep the old `www` WordPress app** on 149.248.33.195 for at least 2 weeks as the rollback target. Its admin is no longer reachable at www.kosick.com. To use it, map `www.kosick.com` to `149.248.33.195` in a local hosts file, or use the host's temporary application URL.
- **Keep staging WordPress permanently.** It runs the AI chat (plugin settings, knowledge base, leads, updates). Keep its backups and plugin updates going, and don't password-protect or IP-restrict `/wp-json/aca/v1/*`.
- **Monitoring:** add an uptime check for `https://staging.kosick.com/wp-json/aca/v1/` and for `https://www.kosick.com/`.
- **Publishing a new article** now needs a code change: export it with `scripts/export-wordpress-content.mjs` and refresh the Rank Math snapshot (see `docs/LAUNCH_READINESS.md`).

## 8. Privacy policy

The page is written only from what the site verifiably does:

- **Forms:** the form fields, Supabase and Resend.
- **Chat:** the chat assistant and Anthropic.
- **Spam protection:** IP hashes cleared after 90 days.
- **Retention:** contact rows deleted after 24 months.
- **Analytics and ads:** GA4, plus Google Ads conversion tracking with enhanced conversions, as found in the live GTM container.
- **Embeds:** Vimeo and YouTube embeds.
- **Browser storage:** chat session storage.
- **Company details:** the legal name "Kosick Communications Ltd", info@kosick.com and 604-925-5800, from the site's own published schema.

To be confirmed by Kosick before publishing (also listed on the draft page):

1. The effective date.
2. Who handles privacy requests (a named privacy officer or role), and whether info@kosick.com is the right address.
3. A mailing address for privacy requests.
4. How long the AI chat plugin keeps conversations and leads (its retention setting on staging).
5. How newsletter emails are sent and how people unsubscribe.
6. Whether to state where providers store data (Canada, the US or both).
7. Whether to add cookie consent or Google Consent Mode. The live WordPress site has neither.

**To publish:** apply any wording changes, set `PRIVACY_POLICY_PUBLISHED=1` in Vercel (Production), and redeploy. The page then becomes indexable, joins the sitemap and the footer, and loses the draft notice.
