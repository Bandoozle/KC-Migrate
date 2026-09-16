import { WordPressShell } from "@/components/wordpress/WordPressShell";
import { getWordPressDocument } from "@/lib/wordpress-document";
import { getWordPressUrl } from "@/lib/wordpress";
import type { WordPressPage } from "@/types/wordpress";

export async function renderWordPressPage(page: WordPressPage) {
  const document = await getWordPressDocument(
    page.link || `${getWordPressUrl()}/`,
  );

  return <WordPressShell document={document} page={page} />;
}

export async function renderWordPressPath(pathname: string) {
  const origin = getWordPressUrl();
  const url = pathname === "/" ? `${origin}/` : `${origin}${pathname.replace(/\/+$/, "")}/`;
  const document = await getWordPressDocument(url);
  return <WordPressShell document={document} />;
}
