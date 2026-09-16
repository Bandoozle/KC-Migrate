import { getPageBySlug, getWordPressUrl } from "@/lib/wordpress";
import { getWordPressDocument } from "@/lib/wordpress-document";

function publicUrlForPath(pathname: string): string {
  const origin = getWordPressUrl();
  if (pathname === "/") return `${origin}/`;
  return `${origin}${pathname.replace(/\/+$/, "")}/`;
}

function slugFromPathname(pathname: string): string {
  if (pathname === "/") return "home";
  return pathname.split("/").filter(Boolean).at(-1) || "home";
}

export async function getWordPressBodyClass(pathname: string): Promise<string> {
  try {
    const page = await getPageBySlug(slugFromPathname(pathname));
    const url = page?.link || publicUrlForPath(pathname);
    const document = await getWordPressDocument(url);
    return document.bodyClass;
  } catch {
    try {
      const document = await getWordPressDocument(publicUrlForPath(pathname));
      return document.bodyClass;
    } catch {
      return "";
    }
  }
}
