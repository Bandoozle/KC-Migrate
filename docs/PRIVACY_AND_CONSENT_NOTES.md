# Privacy policy and consent: notes for review

Written 24 Nov 2026. These are concerns to review. **Nothing described here has been changed**: the privacy policy, the consent setup and the Vercel settings are as they were. This is not legal advice.

## Where things stand

- **The privacy policy is an unpublished draft.** The page exists at `/privacy-policy/`, but it is `noindex`, not linked from the site, not in the sitemap, and carries a draft notice. `PRIVACY_POLICY_PUBLISHED` is unset in Vercel Production. The live WordPress site had no privacy page either (it returned 404).
- **The draft already describes the tracking.** It covers Google Analytics and Google Ads conversion tracking with enhanced conversions, as found in the live container, along with the chat, the forms, Supabase, Resend and the Vimeo and YouTube embeds.
- **The draft has open questions of its own** (listed on the page and in `docs/LAUNCH_RUNBOOK.md`, section 8): the effective date, who handles privacy requests, a mailing address for requests, how long the chat plugin keeps conversations, how newsletter email is sent and unsubscribed, where providers store data, and whether to add cookie consent.
- **There is no consent tool.** No cookie banner, no Google Consent Mode, and the Tag Manager container has no consent configuration. Every tag fires on every visit.
- **Enhanced Conversions is already sending customer data.** The existing form conversion sends the visitor's email and phone number (hashed by Google's tag) when a lead is submitted.

## What Google's own documentation says

- **Customer data policies** (Google Ads): advertisers must disclose to customers that their information is shared with third parties to perform ad measurement, and obtain customer consent for that sharing where legally required. Turning on enhanced conversions confirms compliance with these policies.
- **Consent Mode**: `ad_user_data` controls "sending user data to Google for online advertising purposes". When it is denied, personal data collection for advertising is disabled, including enhanced conversions' hashed first-party data. Google states that the site owner is responsible for obtaining users' consent. Google's pages do not say what the default is when a site sets no consent signals at all.

## Points to decide

1. **Publish the privacy policy.** The Google disclosure requirement is not currently met on the site, because the policy that contains it is not public. Once Kosick has settled the open points on the draft, publishing means setting `PRIVACY_POLICY_PUBLISHED=1` in Vercel (Production) and redeploying; the page then becomes indexable, joins the sitemap and the footer, and loses the draft notice.
2. **Whether consent is legally required for these visitors.** Kosick's audience is Canadian (federal privacy law, and Quebec's Law 25 if Quebec visitors are in scope). Visitors from the EEA or the UK are covered by Google's separate consent requirements for ads. This needs legal advice; the code and the container make no assumption either way.
3. **If consent is required**, the usual route is a consent banner that sets Google Consent Mode defaults before Tag Manager loads, then updates them on the visitor's choice; the container's Ads tags would then follow `ad_user_data` and `ad_storage`. That is a larger piece of work than the conversions and is not part of this change.
4. **Sensitive categories.** Google does not allow enhanced conversions for conversions related to sensitive categories (for example health or medical information). Kosick's own lead form collects a name, email, phone number and a message, and is not a health service, but Kosick's clients include dental and medical aesthetics practices. Keep any client-specific conversion actions out of this setup.

## What the website side does and does not do

- It sends the lead's email and phone number only inside the existing `kosick_contact_lead` event, in the form the container's Enhanced Conversions variable reads, as it has since the launch.
- It does not send customer data to GA4, and no GA4 tag in the container reads those fields.
- It does not read or honour a consent state, because none exists.
- The submission id sent as `transaction_id` is a random identifier with no personal information in it.
