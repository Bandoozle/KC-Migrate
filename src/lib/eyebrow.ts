/**
 * Eyebrow label policy.
 *
 * Generic labels ("What we offer", "Have questions?") and labels that repeat
 * their heading are dropped so the heading carries the hierarchy. Labels that
 * add context (categories, prices, platforms) are kept in sentence case.
 */

const ACRONYMS = new Set(["TV", "CTV", "OTT", "SEO", "UX", "UI", "USA", "HVAC", "ROI", "PPC", "AI", "GRP", "GRPS", "TSA", "B2B", "GA4", "QR", "URL"]);

const PROPER_NOUNS = new Map(
  [
    "Kosick",
    "Communications",
    "Mailchimp",
    "Sportsnet",
    "Canada",
    "Canadian",
    "Vancouver",
    "Calgary",
    "Phoenix",
    "Mexico",
    "Google",
    "Shopify",
    "WooCommerce",
    "FortisBC",
  ].map((word) => [word.toLowerCase(), word]),
);

const REDUNDANT_LABELS = [
  /^what we offer$/i,
  /^have questions\??$/i,
  /^why (it|the approach) works$/i,
  /^linear television$/i,
  /^communication automation$/i,
  /^data that drives decisions$/i,
  /^drive traffic with seo$/i,
  /^connect with our planning team$/i,
  /^kosick communications$/i,
  /^our work$/i,
  /^payments$/i,
  /^index$/i,
];

const PHRASES: Array<[RegExp, string]> = [
  [/\bGoogle ads\b/g, "Google Ads"],
  [/\bApple tv\b/g, "Apple TV"],
];

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Sentence case each "•"-separated segment, keeping acronyms and proper nouns. */
export function labelCase(value: string): string {
  const keepCommunications = /\bkosick communications\b/i.test(value);
  const cased = value
    .trim()
    .replace(/[A-Za-z][A-Za-z0-9'’]*/g, (word, offset: number, full: string) => {
      const upper = word.toUpperCase();
      if (ACRONYMS.has(upper)) return upper === "GRPS" ? "GRPs" : upper;
      const proper = PROPER_NOUNS.get(word.toLowerCase());
      if (proper && (proper !== "Communications" || keepCommunications)) return proper;
      const before = full.slice(0, offset);
      const isStart = !before.trim() || /[.!?•|:]\s*$/.test(before);
      if (isStart) return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      return word.toLowerCase();
    });
  return PHRASES.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), cased);
}

/** Returns the label to render above `heading`, or null when it adds nothing. */
export function eyebrowLabel(value: string | null | undefined, heading?: string | null): string | null {
  const label = value?.replace(/\s+/g, " ").trim();
  if (!label) return null;
  if (REDUNDANT_LABELS.some((pattern) => pattern.test(label))) return null;
  if (heading) {
    const a = normalize(label);
    const b = normalize(heading);
    if (a && b && (a === b || b.startsWith(a) || a.startsWith(b))) return null;
    const headingWords = new Set(b.split(" "));
    if (a.split(" ").every((word) => headingWords.has(word))) return null;
  }
  return labelCase(label);
}
