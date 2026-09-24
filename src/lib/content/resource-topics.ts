/** Theme groups for the resource library. WordPress posts all sit in "Latest". */
export type ResourceTopic = {
  id: string;
  label: string;
  pattern: RegExp;
};

export const RESOURCE_TOPICS: ResourceTopic[] = [
  {
    id: "digital",
    label: "Digital Marketing",
    pattern:
      /\b(digital|social media|social marketing|seo|analytics|ga4|lead generation|tiktok|instagram|facebook|google ads|organic)\b/i,
  },
  {
    id: "branding",
    label: "Branding",
    pattern: /\b(branding|brand)\b/i,
  },
  {
    id: "advertising",
    label: "Advertising",
    pattern:
      /\b(advertis\w*|media buying|media buyer|\btv\b|television|radio|outdoor|pre-?roll|connected tv|\bctv\b|sponsorship|\bads?\b)\b/i,
  },
  {
    id: "web",
    label: "Web & AI",
    pattern: /\b(website|web development|web hosting|e-?commerce|shopify|woocommerce|\bai\b|hosting)\b/i,
  },
];

export const RESOURCE_FILTERS = [
  { id: "featured", label: "Featured" },
  ...RESOURCE_TOPICS.map((topic) => ({ id: topic.id, label: topic.label })),
];

export function resourceTopicIds(text: string): string[] {
  return RESOURCE_TOPICS.filter((topic) => topic.pattern.test(text)).map((topic) => topic.id);
}

export function resourceTopicLabel(topicIds: string[]): string {
  const match = RESOURCE_TOPICS.find((topic) => topicIds.includes(topic.id));
  return match?.label || "Latest";
}
