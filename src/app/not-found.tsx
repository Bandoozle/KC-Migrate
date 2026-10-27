import { WordPressShell } from "@/components/wordpress/WordPressShell";
import { getWordPressUrl } from "@/lib/wordpress";
import { getWordPressDocument } from "@/lib/wordpress-document";

export default async function NotFound() {
  const document = await getWordPressDocument(`${getWordPressUrl()}/`);

  return (
    <WordPressShell
      document={document}
      contentHtml='<p>Sorry, we couldn’t find that page. <a href="/">Return to the homepage</a> or <a href="/site-map/">browse the site map</a>.</p>'
    />
  );
}
