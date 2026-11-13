/**
 * Espresso Dolce short-form social creative for /services/social-media-marketing/.
 * Official vertical spot from Kosick's Vimeo account (KOS_ESP-DOL_202609_06_V1).
 * Stills: BTS production (top) + Rocket product (bottom) in the bento.
 */
export type CampaignPhoto = { src: string; alt: string };

export type CampaignVimeo = {
  kind: "vimeo";
  id: string;
  title: string;
  /** Optional poster; falls back to Vimeo's CDN thumbnail when omitted. */
  poster?: string;
  alt: string;
};

export type CampaignFileVideo = {
  kind: "file";
  src: string;
  poster: string;
  alt: string;
};

export type CampaignVideo = CampaignVimeo | CampaignFileVideo;

/** Official Vimeo id for KOS_ESP-DOL_202609_06_V1 (9:16). */
export const ESPRESSO_DOLCE_VIMEO_ID = "1228113147";

export const ESPRESSO_DOLCE: {
  client: string;
  title: string;
  body: string;
  video: CampaignVideo | null;
  photos: CampaignPhoto[];
} = {
  client: "Espresso Dolce",
  title: "Made for the moments worth sharing.",
  body: "A short-form social video showcasing how thoughtful visual storytelling brings everyday products to life.",
  video: {
    kind: "vimeo",
    id: ESPRESSO_DOLCE_VIMEO_ID,
    title: "Espresso Dolce social video",
    poster:
      "https://i.vimeocdn.com/video/2202498024-6d19ddf789b80ca21630f0007b57b0c0dace8f1327fff5647566646b48c3a1f1-d_640",
    alt: "Espresso Dolce coffee campaign video for social media",
  },
  photos: [
    {
      src: "/images/social-media/espresso-dolce/bts-rig.jpeg",
      alt: "Behind the scenes filming espresso for the Espresso Dolce social video",
    },
    {
      src: "/images/social-media/espresso-dolce/rocket-appartamento.jpeg",
      alt: "Rocket Espresso Appartamento machine and coffee beans for Espresso Dolce",
    },
  ],
};
