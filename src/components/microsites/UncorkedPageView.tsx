import { MicrositeHero } from "@/components/microsites/MicrositeHero";
import { micrositeFont } from "@/components/microsites/microsite-font";
import type { UncorkedContent } from "@/lib/wordpress/microsites";
import styles from "./UncorkedPageView.module.css";

type UncorkedPageViewProps = {
  content: UncorkedContent;
};

export function UncorkedPageView({ content }: UncorkedPageViewProps) {
  return (
    <main className={`${styles.main} ${micrositeFont.variable}`}>
      <MicrositeHero
        label={content.title}
        slides={content.hero.slides}
        logo={content.hero.logo}
        intervalMs={3000}
        title={content.title}
      />

      <section className={styles.stats}>
        {content.stats.map((stat) => (
          <article key={stat.title} className={styles.stat}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={stat.icon} alt="" className={styles.statIcon} />
            <h2 className={styles.statTitle}>{stat.title}</h2>
            <p className={styles.statBody}>{stat.body}</p>
          </article>
        ))}
      </section>

      <section className={styles.venue}>
        <div className={styles.venueLeft}>
          <div
            className={styles.venueCard}
            style={{ backgroundImage: `url(${content.venue.cardImage})` }}
          >
            <div className={styles.venueCardOverlay}>
              <p className={styles.venueDate}>{content.venue.date}</p>
              <h2 className={styles.venueName}>{content.venue.name}</h2>
            </div>
          </div>

          <div className={styles.format}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.venue.formatImage}
              alt=""
              className={styles.formatImage}
            />
            <div>
              <h3 className={styles.formatTitle}>{content.venue.formatTitle}</h3>
              <p className={styles.formatBody}>{content.venue.formatBody}</p>
              <p className={styles.fees}>
                <strong>{content.venue.fees}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className={styles.venueRight}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.venue.portraitImage}
            alt=""
            className={styles.portrait}
          />
        </div>
      </section>

      <section className={styles.prizes} aria-label="Prize tiers">
        {content.prizes.map((prize) => (
          <article
            key={prize.place}
            className={[styles.prize, prize.featured ? styles.prizeFeatured : ""]
              .filter(Boolean)
              .join(" ")}
          >
            <p className={styles.prizePlace}>{prize.place}</p>
            {prize.lines.map((line) => (
              <p key={line} className={styles.prizeLine}>
                {line}
              </p>
            ))}
          </article>
        ))}
      </section>

      <section className={styles.accommodations}>
        <div className={styles.accommodationsCopy}>
          <h3 className={styles.accommodationsTitle}>{content.accommodations.title}</h3>
          <p className={styles.accommodationsBody}>{content.accommodations.body}</p>
          <p className={styles.discount}>
            {content.accommodations.discountLabel}{" "}
            <strong>{content.accommodations.discountCode}</strong>
          </p>
          <a
            className={styles.bookCta}
            href={content.accommodations.cta.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content.accommodations.cta.label}
          </a>
        </div>
        <div className={styles.accommodationsGrid}>
          {content.accommodations.images.map((src, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              className={index === 1 ? styles.accommodationsMuted : undefined}
            />
          ))}
        </div>
      </section>

      <section className={styles.sponsors}>
        <h2 className={styles.sponsorsTitle}>{content.sponsors.title}</h2>
        <div className={styles.sponsorsGrid}>
          {content.sponsors.items.map((item, index) => {
            const img = (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.src} alt={item.alt} />
            );
            return item.href ? (
              <a key={`${item.src}-${index}`} href={item.href} className={styles.sponsor}>
                {img}
              </a>
            ) : (
              <div key={`${item.src}-${index}`} className={styles.sponsor}>
                {img}
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.kpHeading}>
        <h2>{content.kpSponsorTitle}</h2>
      </section>

      <section className={styles.performance}>
        <a className={styles.performanceLink} href={content.performance.mailto}>
          <div className={styles.performanceCopy}>
            <h2 className={styles.performanceTitle}>{content.performance.title}</h2>
            {content.performance.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {content.performance.prizes.map((line) => (
              <p key={line} className={styles.performancePrize}>
                {line}
              </p>
            ))}
          </div>
          <div className={styles.performanceImages}>
            {content.performance.images.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={img.src} src={img.src} alt={img.alt} />
            ))}
          </div>
        </a>
      </section>

      <section className={styles.logoInterstitial}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={content.logoInterstitial.src}
          alt={content.logoInterstitial.alt}
        />
      </section>

      <section className={styles.closing}>
        <h3 className={styles.closingTitle}>{content.closingTitle}</h3>
      </section>

      <section className={styles.mosaic} aria-hidden>
        {content.mosaic.map((tile) => (
          <div
            key={tile.src}
            className={styles.mosaicTile}
            style={{ backgroundImage: `url(${tile.src})` }}
          >
            <span style={{ backgroundColor: tile.overlay }} />
          </div>
        ))}
      </section>
    </main>
  );
}
