"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { DirectoryLink } from "@/components/sections/LinkDirectory";
import styles from "./SiteMap.module.css";

/* Topics read from article titles; checked in order, so an HVAC website article stays with HVAC */
const TOPICS: Array<{ title: string; test: RegExp }> = [
  { title: "HVAC & home services", test: /hvac|home services|fortisbc/i },
  { title: "Social & digital", test: /social|tiktok|amazon|ga4|digital marketing/i },
  { title: "Golf", test: /golf|tee times/i },
  { title: "Dental & medical", test: /dental|medical/i },
  { title: "Advertising & media buying", test: /television|tv advertising|connected tv|media buy|outdoor advertising|sponsorship/i },
  { title: "Brand, web & growth", test: /branding|web development|seo|lead generation/i },
];

function groupArticles(links: DirectoryLink[]) {
  const groups = TOPICS.map((topic) => ({ title: topic.title, links: [] as DirectoryLink[] }));
  const other: DirectoryLink[] = [];
  for (const link of links) {
    const index = TOPICS.findIndex((topic) => topic.test.test(link.label));
    if (index >= 0) groups[index]!.links.push(link);
    else other.push(link);
  }
  if (other.length > 0) groups.push({ title: "More articles", links: other });
  return groups.filter((group) => group.links.length > 0);
}

export function SiteMapArticles({ links }: { links: DirectoryLink[] }) {
  const groups = groupArticles(links);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Set<string>>(() => new Set(groups[0] ? [groups[0].title] : []));
  const baseId = useId();
  const needle = query.trim().toLowerCase();
  const filtered = groups
    .map((group) => ({
      ...group,
      links: needle ? group.links.filter((link) => link.label.toLowerCase().includes(needle)) : group.links,
    }))
    .filter((group) => group.links.length > 0);
  const matchCount = filtered.reduce((total, group) => total + group.links.length, 0);

  const toggle = (title: string) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });

  return (
    <div className={styles.articles}>
      <div className={styles.search}>
        <label className={styles.srOnly} htmlFor={`${baseId}-search`}>
          Search articles
        </label>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
          <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" d="m20 20-4.2-4.2M10.5 17a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z" />
        </svg>
        <input
          id={`${baseId}-search`}
          type="search"
          placeholder="Search articles..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className={styles.searchInput}
          autoComplete="off"
        />
      </div>
      <p className={styles.searchStatus} role="status">
        {needle ? `${matchCount} ${matchCount === 1 ? "article" : "articles"} found` : `${links.length} articles`}
      </p>

      <div className={styles.topics}>
        {filtered.map((group, index) => {
          // A search opens every matching group
          const expanded = needle ? true : open.has(group.title);
          const panelId = `${baseId}-topic-${index}`;
          return (
            <div key={group.title} className={styles.topic}>
              <h3 className={styles.topicHeading}>
                <button
                  type="button"
                  className={styles.topicButton}
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => toggle(group.title)}
                  disabled={Boolean(needle)}
                >
                  <span className={styles.topicTitle}>{group.title}</span>
                  <span className={styles.topicCount}>
                    {group.links.length} {group.links.length === 1 ? "article" : "articles"}
                  </span>
                  <span className={styles.topicIcon} aria-hidden="true" />
                </button>
              </h3>
              <div id={panelId} className={styles.topicPanel} data-open={expanded || undefined}>
                <div className={styles.topicInner}>
                  <ul className={styles.articleList}>
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link className={styles.articleLink} href={link.href} tabIndex={expanded ? undefined : -1}>
                          {link.label}
                          <span aria-hidden="true">→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 ? <p className={styles.empty}>No articles match “{query}”.</p> : null}
      </div>
    </div>
  );
}
