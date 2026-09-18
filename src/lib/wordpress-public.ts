/**
 * Public WordPress origin for client components (media URLs).
 * Secrets must never go here — use server-only WORDPRESS_URL for APIs.
 */
export function getPublicWordPressUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_WORDPRESS_URL?.trim() ||
    process.env.WORDPRESS_URL?.trim() ||
    "https://staging.kosick.com";
  return configured.replace(/\/+$/, "");
}
