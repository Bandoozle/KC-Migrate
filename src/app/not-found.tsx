import { WordPressShell } from "@/components/wordpress/WordPressShell";
import { getWordPressUrl } from "@/lib/wordpress";
import { getWordPressDocument } from "@/lib/wordpress-document";

export default async function NotFound() {
  const document = await getWordPressDocument(`${getWordPressUrl()}/`);

  return (
    <WordPressShell
      document={document}
      contentHtml="<p>That page is not available from the WordPress staging site.</p>"
    />
  );
}
