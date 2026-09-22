import Link from "next/link";
import { CardTitle } from "@/components/typography";
import type { RelatedService } from "@/lib/wordpress/digital-marketing";
import type { ServiceRelated } from "@/lib/wordpress/service-page-types";
import styles from "./RelatedServices.module.css";

type RelatedServicesProps = {
  services: Array<RelatedService | ServiceRelated>;
};

export function RelatedServices({ services }: RelatedServicesProps) {
  if (services.length === 0) return null;

  const withImages = services.some((service) => Boolean(service.image?.src));

  return (
    <section
      className={`section ${styles.section} ${withImages ? styles.withImages : ""}`}
    >
      <div className={`container ${styles.grid}`}>
        {services.map((service, index) => {
          const title = <CardTitle as="h3">{service.title}</CardTitle>;
          const cardClass = [
            styles.card,
            service.image?.src ? styles.cardMedia : "",
          ]
            .filter(Boolean)
            .join(" ");

          const body = (
            <>
              {service.href ? (
                <Link href={service.href} className={styles.titleLink}>
                  {title}
                </Link>
              ) : (
                title
              )}
              <ul className={styles.list}>
                {service.items.map((item, itemIndex) => (
                  <li key={`${item}-${itemIndex}`}>{item}</li>
                ))}
              </ul>
            </>
          );

          return (
            <article
              key={`${service.title}-${service.href || service.image?.src || index}`}
              className={cardClass}
              style={
                service.image?.src
                  ? { backgroundImage: `url(${service.image.src})` }
                  : undefined
              }
            >
              {service.image?.src ? (
                <div className={styles.cardOverlay}>{body}</div>
              ) : (
                body
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
