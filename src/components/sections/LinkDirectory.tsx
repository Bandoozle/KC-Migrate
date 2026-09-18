import Link from "next/link";
import { SectionTitle } from "@/components/typography";
import styles from "./LinkDirectory.module.css";

export type DirectoryLink = {
  label: string;
  href: string;
};

export type DirectorySection = {
  title: string;
  links: DirectoryLink[];
};

type LinkDirectoryProps = {
  title: string;
  sections: DirectorySection[];
};

export function LinkDirectory({ title, sections }: LinkDirectoryProps) {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <SectionTitle as="h1" className={styles.pageTitle}>
          {title}
        </SectionTitle>

        <div className={styles.sections}>
          {sections.map((section) => (
            <div key={section.title} className={styles.block}>
              <h2 className={styles.heading}>{section.title}</h2>
              <ul className={styles.list}>
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.href}-${link.label}`}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
