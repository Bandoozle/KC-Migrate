/** A WordPress-era media URL on any kosick.com host, with or without a scheme. */
const WORDPRESS_MEDIA_URL = /^(?:https?:)?\/\/(?:staging\.|www\.)?kosick\.com(\/wp-content\/.*)$/i;

/**
 * WordPress media now lives in public/wp-content/ under its original path, so a
 * kosick.com `/wp-content/` URL becomes that site path. Other URLs are unchanged.
 */
export function localMediaUrl(url: string): string {
  return url.match(WORDPRESS_MEDIA_URL)?.[1] ?? url;
}
