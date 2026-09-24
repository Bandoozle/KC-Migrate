"use client";

import { useEffect, useId, useState } from "react";
import type { ArticleTocItem } from "@/lib/content/article-toc";
import styles from "./ArticleTableOfContents.module.css";

type ArticleTableOfContentsProps = {
  items: ArticleTocItem[];
};

export function ArticleTableOfContents({ items }: ArticleTableOfContentsProps) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (headings.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        }
        const current = [...items].reverse().find((item) => visible.has(item.id));
        if (current) setActiveId(current.id);
      },
      {
        rootMargin: "-96px 0px -55% 0px",
        threshold: [0, 1],
      },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  const onSelect = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    setActiveId(id);
    setOpen(false);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", `#${id}`);
  };

  return (
    <nav className={styles.toc} aria-label="Table of contents">
      <p className={styles.label}>Table of Contents</p>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span>Table of Contents</span>
        <span className={styles.chevron} aria-hidden="true">
          {open ? "–" : "+"}
        </span>
      </button>
      <div id={panelId} className={open ? `${styles.panel} ${styles.panelOpen}` : styles.panel}>
        <ol className={styles.list}>
          {items.map((item) => {
            const active = item.id === activeId;
            return (
              <li key={item.id} className={item.nested ? styles.nested : undefined}>
                <a
                  href={`#${item.id}`}
                  className={active ? `${styles.link} ${styles.linkActive}` : styles.link}
                  aria-current={active ? "location" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    onSelect(item.id);
                  }}
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
