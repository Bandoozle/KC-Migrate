import Image from "next/image";
import Link from "next/link";
import styles from "./OutdoorPricing.module.css";

export type OutdoorPrice = {
  id: string;
  name: string;
  /** Display price, without a billing period: none has been confirmed. */
  price: string;
  description: string;
  /** Typical size from the billboard dimensions guide, when it lists one. */
  size?: string;
  image: { src: string; alt: string; position?: string };
  plate: string;
};

type OutdoorPricingProps = {
  prices: OutdoorPrice[];
  contactHref: string;
  /** The page's section class: background and the room below for the billboard to cross into. */
  className?: string;
};

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Starting prices by format: four placements side by side, cheapest first. */
export function OutdoorPricing({ prices, contactHref, className }: OutdoorPricingProps) {
  if (prices.length === 0) return null;
  return (
    <section className={className ? `${styles.pricing} ${className}` : styles.pricing} aria-labelledby="oo-pricing">
      <div className="container">
        <header className={styles.head}>
          <p className={styles.kicker}>Pricing</p>
          <h2 id="oo-pricing" className={styles.title}>
            Starting prices by format.
          </h2>
          <p className={styles.lead}>
            Every placement is priced on its own. Here is where each format starts, so you can compare before we plan
            the details.
          </p>
        </header>

        <ul className={styles.grid}>
          {prices.map((item) => (
            <li key={item.id} className={styles.card}>
              <div className={styles.media}>
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(min-width: 1100px) 420px, (min-width: 640px) 45vw, 160px"
                  className={styles.image}
                  style={item.image.position ? { objectPosition: item.image.position } : undefined}
                />
                <span className={styles.plate}>{item.plate}</span>
              </div>
              <h3 className={styles.name}>{item.name}</h3>
              <p className={styles.price}>
                <span className={styles.from}>Starting from</span>
                <span className={styles.amount}>{item.price}</span>
              </p>
              <p className={styles.description}>{item.description}</p>
              {item.size ? <p className={styles.size}>Typical size {item.size}</p> : null}
            </li>
          ))}
        </ul>

        <div className={styles.foot}>
          <p className={styles.note}>
            Starting prices are indicative and may vary based on location, availability, format, campaign duration,
            and production requirements. Contact us for a tailored quote.
          </p>
          <Link className={styles.cta} href={contactHref}>
            Plan your outdoor campaign
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
