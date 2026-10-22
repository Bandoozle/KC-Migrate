/**
 * Files referenced by Smart Slider markup that 404 on both staging and www.
 * Video slides keep their working mp4. The outdoor slide has no replacement file.
 */
const UNAVAILABLE_MEDIA_FILES = [
  "cityscape-of-capital-of-corfu-island-colorful-building-at-the-morning-corfu-island-greece.webp",
  "smartmockups_ljx6qkvg-scaled.jpg",
  "smartmockups_ljx6qkvg.jpg",
  "screen-recording-2024-03-14-at-9.30.00-am.mov",
];

export function isUnavailableMedia(src: string): boolean {
  const lower = src.toLowerCase();
  return UNAVAILABLE_MEDIA_FILES.some((name) => lower.includes(name));
}
