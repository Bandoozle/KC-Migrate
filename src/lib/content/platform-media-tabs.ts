export type PlatformMediaTabCopy = {
  match: RegExp;
  title: string;
  subtitle: string;
  description: string;
};

/** Copy for the "Your Brand. Every Platform." tabs. Images stay on the page data. */
export const PLATFORM_MEDIA_TAB_COPY: PlatformMediaTabCopy[] = [
  {
    match: /youtube|connected\s*tv|ctv/i,
    title: "YouTube & Connected TV",
    subtitle: "Put your brand in front of customers where they watch.",
    description:
      "Reach targeted audiences across YouTube and connected TV with video campaigns built around location, interests, demographics, and intent. We help plan, create, and place campaigns that keep your brand visible across the screens your customers use every day.",
  },
  {
    match: /facebook|instagram|meta/i,
    title: "Facebook & Instagram Advertising",
    subtitle: "Reach the right audience with campaigns built to generate action.",
    description:
      "Build awareness, generate leads, and stay connected with customers through targeted Meta advertising. We combine creative, audience strategy, and campaign optimization to help your business reach the people most likely to engage.",
  },
  {
    match: /visual|tiktok/i,
    title: "Visual Content",
    subtitle: "Create content that makes your brand instantly recognizable.",
    description:
      "Strong photography, video, graphics, and campaign creative give your brand a consistent visual identity across every platform. We create content designed to capture attention while staying aligned with your broader marketing strategy.",
  },
  {
    match: /social/i,
    title: "Social Media",
    subtitle: "Stay visible, relevant, and connected with your audience.",
    description:
      "Build a consistent social presence with content that reflects your brand and keeps your business active in the channels your customers use. We help with strategy, content creation, publishing, and ongoing campaign support.",
  },
];

export function platformTabCopy(label: string): PlatformMediaTabCopy | undefined {
  return PLATFORM_MEDIA_TAB_COPY.find((item) => item.match.test(label));
}
