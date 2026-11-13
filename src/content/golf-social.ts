/**
 * Golf short-form social creative for /services/social-media-marketing/.
 * Vertical Vimeo spot (https://vimeo.com/1246470221).
 */
import type { CampaignPhoto, CampaignVideo } from "@/content/espresso-dolce";

export const GOLF_SOCIAL_VIMEO_ID = "1246470221";

export const GOLF_SOCIAL: {
  client: string;
  title: string;
  body: string;
  video: CampaignVideo | null;
  photos: CampaignPhoto[];
} = {
  client: "Golf",
  title: "Course moments that travel in the feed.",
  body: "A short-form social video that puts the fairway, the swing and the destination in front of golfers where they scroll.",
  video: {
    kind: "vimeo",
    id: GOLF_SOCIAL_VIMEO_ID,
    title: "Golf social video",
    poster: "/images/industries/golf/sudden-valley-instagram.jpg",
    alt: "Golf course social video for Instagram and short-form platforms",
  },
  photos: [
    {
      src: "/images/industries/golf/sudden-valley-tee-shot.jpg",
      alt: "A golfer teeing off on a tree-lined fairway",
    },
    {
      src: "/images/industries/golf/sudden-valley-aerial-fairway.jpg",
      alt: "Aerial view of a golf fairway winding through the trees",
    },
  ],
};
