/**
 * The privacy policy is written from what the site verifiably does (see
 * docs/PRIVACY_POLICY_REVIEW.md). It stays a noindex draft, unlinked, until
 * Kosick approves it: then set PRIVACY_POLICY_PUBLISHED=1 in Vercel and redeploy.
 * That adds it to the footer and sitemap and removes the review notice.
 */
export const PRIVACY_POLICY_PATH = "/privacy-policy/";

export const PRIVACY_POLICY_PUBLISHED = process.env.PRIVACY_POLICY_PUBLISHED === "1";

/** Shown on the page in the draft notice and listed in the review document. */
export const PRIVACY_POLICY_OPEN_ITEMS = [
  "Effective date of the policy.",
  "Who handles privacy requests: a named privacy officer or role, and whether info@kosick.com is the right address.",
  "A mailing address for privacy requests (none is published on the site today).",
  "How long the AI chat assistant keeps conversations and chat leads in WordPress (set in the plugin's retention setting).",
  "How newsletter emails are sent and how people unsubscribe (the sending service is not part of this website).",
  "Whether to state where the database and service providers store data (Canada, United States or both).",
  "Whether Kosick wants cookie consent or Google Consent Mode, which the site does not have today (the WordPress site has neither).",
] as const;
