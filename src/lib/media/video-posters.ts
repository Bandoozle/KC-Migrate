/**
 * First-frame posters for the background hero videos, exported from each MP4
 * at 0s so the swap from poster to playing video is seamless. The poster is
 * what paints first (and what counts as the page's largest paint); the video
 * itself starts once the page has loaded.
 *
 * Adding a hero video: export its first frame to public/images/video-posters/
 * and add it here, or the hero shows its fallback colour until the video plays.
 */
const P = "/images/video-posters";

const HERO_VIDEO_POSTERS: Record<string, string> = {
  "/images/hvac-marketing/hero-timeline.mp4": `${P}/hero-timeline.webp`,
  "/wp-content/uploads/2017/12/2016-12-21_CGI.mp4": `${P}/2016-12-21_cgi.webp`,
  "/wp-content/uploads/2023/06/KC-Mov-3.mp4": `${P}/kc-mov-3.webp`,
  "/wp-content/uploads/2023/06/trane-web-1.mp4": `${P}/trane-web-1.webp`,
  "/wp-content/uploads/2024/03/hvac.mp4": `${P}/hvac.webp`,
  "/wp-content/uploads/2024/03/my-movie-10.mp4": `${P}/my-movie-10.webp`,
  "/wp-content/uploads/2024/03/outdoor-1.mp4": `${P}/outdoor-1.webp`,
  "/wp-content/uploads/2024/03/resort-marketing.mp4": `${P}/resort-marketing.webp`,
  "/wp-content/uploads/2024/03/tr_how-we-run_70_16x9_020323104508_hd-1.mp4": `${P}/tr_how-we-run_70_16x9_020323104508_hd-1.webp`,
  "/wp-content/uploads/2025/11/automotive-marketing.mp4": `${P}/automotive-marketing.webp`,
  "/wp-content/uploads/2025/11/cruise-ship-marketing.mp4": `${P}/cruise-ship-marketing.webp`,
  "/wp-content/uploads/2025/11/culinary-marketing.mp4": `${P}/culinary-marketing.webp`,
  "/wp-content/uploads/2025/11/transportation-marketing.mp4": `${P}/transportation-marketing.webp`,
  "/wp-content/uploads/2026/07/Golf-Web-1.mp4": `${P}/golf-web-1.webp`,
};

export function heroVideoPoster(src: string): string | undefined {
  return HERO_VIDEO_POSTERS[src.split(/[?#]/)[0]];
}
