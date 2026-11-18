/** The public watch page for a Vimeo video id. Plain module, so server and client components can both use it. */
export function vimeoWatchUrl(id: string) {
  return `https://vimeo.com/${id}`;
}
