import Link from "next/link";
import type { DirectoryLink } from "@/components/sections/LinkDirectory";
import { INDUSTRY_LINKS } from "@/lib/industries/nav";
import styles from "./SiteMap.module.css";

type Group = { title?: string; hrefs: string[] };
type Column = { title: string; groups: Group[] };

/* Grouped as in the site navigation. Links come from WordPress; this only decides where each one sits. */
const COLUMNS: Column[] = [
  {
    title: "Services",
    groups: [
      { hrefs: ["/services/"] },
      {
        title: "Advertising & Media",
        hrefs: [
          "/services/television-advertising/",
          "/services/radio-advertising/",
          "/services/outdoor-advertising/",
          "/services/digital-connected-tv/",
        ],
      },
      {
        title: "Brand & Creative",
        hrefs: ["/services/corporate-branding/", "/services/creative/", "/services/business-development/"],
      },
      { title: "Events", hrefs: ["/corporate-events/"] },
    ],
  },
  {
    title: "Marketing Programs",
    groups: [
      { hrefs: ["/marketing-programs/"] },
      {
        title: "Digital Marketing",
        hrefs: [
          "/services/digital-marketing/",
          "/services/social-media-marketing/",
          "/services/email-marketing/",
          "/services/search-engine-optimization/",
          "/services/website-development/",
        ],
      },
      {
        title: "Industry Marketing",
        hrefs: INDUSTRY_LINKS.map((link) => link.href),
      },
    ],
  },
  {
    title: "Company",
    groups: [
      {
        hrefs: ["/", "/marketing-results/", "/contact/", "/online-payments/", "/site-map/"],
      },
    ],
  },
  {
    title: "Resources",
    groups: [
      {
        hrefs: [
          "/feature-articles/",
          "/services/hvac-marketing/hvac-lead-generation/",
          "/services/outdoor-advertising/billboard-dimensions/",
        ],
      },
    ],
  },
];

function LinkList({ links }: { links: DirectoryLink[] }) {
  return (
    <ul className={styles.links}>
      {links.map((link) => (
        <li key={`${link.href}-${link.label}`}>
          <Link className={styles.link} href={link.href}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SiteMapDirectory({ links }: { links: DirectoryLink[] }) {
  const placed = new Set<DirectoryLink>();
  const take = (hrefs: string[]) =>
    hrefs.flatMap((href) => {
      const matches = links.filter((link) => link.href === href && !placed.has(link));
      matches.forEach((link) => placed.add(link));
      return matches;
    });

  const columns = COLUMNS.map((column) => ({
    title: column.title,
    groups: column.groups
      .map((group) => ({ title: group.title, links: take(group.hrefs) }))
      .filter((group) => group.links.length > 0),
  }));
  // Pages added in WordPress later still show, under Resources
  const rest = links.filter((link) => !placed.has(link));
  if (rest.length > 0) columns[columns.length - 1]?.groups.push({ title: "More pages", links: rest });

  return (
    <div className={styles.directory}>
      {columns
        .filter((column) => column.groups.length > 0)
        .map((column) => (
          <nav key={column.title} className={styles.column} aria-label={column.title}>
            <h2 className={styles.columnTitle}>{column.title}</h2>
            {column.groups.map((group, index) => (
              <div key={group.title ?? index} className={styles.group}>
                {group.title ? <h3 className={styles.groupTitle}>{group.title}</h3> : null}
                <LinkList links={group.links} />
              </div>
            ))}
          </nav>
        ))}
    </div>
  );
}
