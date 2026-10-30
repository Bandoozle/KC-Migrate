import Link from "next/link";
import { canonicalUrl } from "@/lib/site";
import styles from "./Breadcrumbs.module.css";

export type Crumb = { label: string; href: string };

function jsonLdMarkup(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/** Visible trail plus BreadcrumbList data. The last crumb is the current page. */
export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const list = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: canonicalUrl(item.href),
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className={tone === "dark" ? `${styles.trail} ${styles.dark}` : styles.trail}>
        <ol>
          {items.map((item, index) =>
            index === items.length - 1 ? (
              <li key={item.href} aria-current="page">
                {item.label}
              </li>
            ) : (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ),
          )}
        </ol>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdMarkup(list) }} />
    </>
  );
}
