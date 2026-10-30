import Link from "next/link";
import { INDUSTRIES, servicePath } from "@/lib/industries";
import styles from "./SiteMap.module.css";

/** Industry service subpages, one column per industry. They are built on the new site, so WordPress doesn't list them. */
export function SiteMapIndustries() {
  return (
    <div className={styles.directory}>
      {INDUSTRIES.map((industry) => (
        <nav key={industry.id} className={styles.column} aria-label={`${industry.name} services`}>
          <h3 className={styles.columnTitle}>
            <Link href={industry.path}>{industry.name}</Link>
          </h3>
          <ul className={styles.links}>
            {industry.services.map((service) => (
              <li key={service.slug}>
                <Link className={styles.link} href={servicePath(industry, service)}>
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </div>
  );
}
