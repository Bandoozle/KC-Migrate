/**
 * Homepage Instagram gallery — snapped from the live Kosick WordPress
 * Smash Balloon feed (8 posts, newest first). Images stored locally;
 * no Instagram API or embed dependency.
 */
export const HOME_INSTAGRAM_PROFILE =
  "https://www.instagram.com/kosick_communications/";

export type HomeInstagramPost = {
  href: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const HOME_INSTAGRAM_POSTS: HomeInstagramPost[] = [
  {
    href: "https://www.instagram.com/p/DedBbPSFy5y/",
    src: "/images/instagram/DedBbPSFy5y.webp",
    alt: "Kosick Instagram: consistent branding across the Instagram grid",
    width: 640,
    height: 800,
  },
  {
    href: "https://www.instagram.com/p/DcCR9Q8lHci/",
    src: "/images/instagram/DcCR9Q8lHci.webp",
    alt: "Kosick Instagram: decades of perspective and uncompromising standards",
    width: 640,
    height: 800,
  },
  {
    href: "https://www.instagram.com/p/DbEcUN2FC--/",
    src: "/images/instagram/DbEcUN2FC--.webp",
    alt: "Kosick Instagram: Arc’teryx transit shelter advertisements",
    width: 640,
    height: 800,
  },
  {
    href: "https://www.instagram.com/p/DZfrT0PEhLM/",
    src: "/images/instagram/DZfrT0PEhLM.webp",
    alt: "Kosick Instagram: visibility that drives revenue",
    width: 640,
    height: 800,
  },
  {
    href: "https://www.instagram.com/p/DZU_namDBjx/",
    src: "/images/instagram/DZU_namDBjx.webp",
    alt: "Kosick Instagram: art and design that create emotional connection",
    width: 640,
    height: 800,
  },
  {
    href: "https://www.instagram.com/p/DZNQFbgCUv_/",
    src: "/images/instagram/DZNQFbgCUv_.webp",
    alt: "Kosick Instagram: vision is the difference between a business and a brand",
    width: 640,
    height: 800,
  },
  {
    href: "https://www.instagram.com/p/DZC8VQzlNkM/",
    src: "/images/instagram/DZC8VQzlNkM.webp",
    alt: "Kosick Instagram: the art of marketing, refined over 40 years",
    width: 640,
    height: 800,
  },
  {
    href: "https://www.instagram.com/p/DY7MzYYnF8n/",
    src: "/images/instagram/DY7MzYYnF8n.webp",
    alt: "Kosick Instagram: corporate events, conferences and incentive travel",
    width: 640,
    height: 960,
  },
];
