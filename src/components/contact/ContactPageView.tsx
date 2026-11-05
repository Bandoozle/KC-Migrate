import Image from "next/image";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactNextSteps } from "@/components/contact/ContactNextSteps";
import { OfficeStatus } from "@/components/contact/OfficeStatus";
import { PageCta } from "@/components/sections/PageCta";
import { labelCase } from "@/lib/eyebrow";
import type { ContactPageContent } from "@/lib/wordpress/contact";
import type { HomeTestimonial } from "@/lib/wordpress/home";
import styles from "./ContactPageView.module.css";

/*
 * Manufacturers named in the published answer to "What national brands have you
 * worked with?" on /services/hvac-marketing/, limited to those with a logo file.
 * Do not add a brand here without a published source for the relationship.
 */
const PARTNER_LOGOS = [
  { name: "Trane", file: "Trane" },
  { name: "Lennox", file: "Lennox" },
  { name: "Daikin", file: "Daikin" },
  { name: "Mitsubishi Electric", file: "Mitsubishi" },
  { name: "American Standard", file: "American-Standard" },
  { name: "York", file: "York" },
  { name: "GE", file: "GE" },
  { name: "Napoleon", file: "Napoleon" },
  { name: "Ruud", file: "RUUD" },
  { name: "Comfortmaker", file: "Comfortmaker" },
  { name: "RunTru", file: "RunTru" },
];

type ContactPageViewProps = {
  content: ContactPageContent;
  testimonial: HomeTestimonial | null;
};

/** The form is the page: it opens the hero, and everything below supports the decision to use it. */
export function ContactPageView({ content, testimonial }: ContactPageViewProps) {
  const { info, form } = content;

  return (
    <main className={styles.main}>
      <section className={styles.hero} aria-labelledby="contact-hero-title">
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className={styles.heroEyebrow}>Contact {info.company || "Kosick Communications"}</p>
            <h1 id="contact-hero-title" className={styles.heroTitle}>
              <span>Let’s make</span>
              <span className={styles.heroTitleMuted}>something happen.</span>
            </h1>
            <p className={styles.heroLead}>
              Tell us what you’re working on. A rough idea is enough, and we’ll take it from there.
            </p>
          </div>

          <div id="contact-form" className={styles.sheet}>
            <div className={styles.sheetHead}>
              <h2 className={styles.sheetTitle}>Send a message</h2>
              <p className={styles.sheetNote}>Fields marked with * are required.</p>
            </div>
            <ContactForm form={form} appearance="studio" />
          </div>

          <div className={styles.direct}>
            <ul className={styles.routes}>
              {info.offices.map((office) =>
                office.phone ? (
                  <li key={office.label}>
                    <a className={styles.route} href={office.phone.href}>
                      <span className={styles.routeLabel}>{labelCase(office.label)}</span>
                      <span className={styles.routeValue}>{office.phone.display}</span>
                    </a>
                  </li>
                ) : null,
              )}
              <li>
                <a className={styles.route} href={info.email.href}>
                  <span className={styles.routeLabel}>{info.email.label}</span>
                  <span className={styles.routeValue}>{info.email.display}</span>
                </a>
              </li>
            </ul>
            <OfficeStatus />
            <p className={styles.servicing}>{info.servicing}</p>
          </div>
        </div>
      </section>

      <section className={styles.partners} aria-labelledby="contact-partners-title">
        <div className="container">
          <h2 id="contact-partners-title" className={styles.partnersTitle}>
            National HVAC brands we’ve partnered with over the past 20+ years
          </h2>
          <ul className={styles.logos}>
            {PARTNER_LOGOS.map((logo) => (
              <li key={logo.file} className={styles.logo}>
                <Image
                  src={`/wp-content/uploads/2026/07/${logo.file}.png`}
                  alt={logo.name}
                  width={488}
                  height={325}
                  sizes="(max-width: 640px) 25vw, 140px"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactNextSteps />

      {testimonial ? (
        <section className={styles.voice} aria-label="A client review">
          <figure className={`container ${styles.voiceInner}`}>
            <blockquote className={styles.voiceQuote}>{testimonial.quote}</blockquote>
            <figcaption className={styles.voiceBy}>
              <span className={styles.voiceName}>{testimonial.name}</span>
              {testimonial.affiliation ? <span>{testimonial.affiliation}</span> : null}
              <span className={styles.voiceSource}>
                <span className={styles.voiceStars} role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
                  {Array.from({ length: testimonial.rating }, (_, index) => (
                    <svg key={index} viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">
                      <path
                        fill="currentColor"
                        d="M12 2.5l2.74 5.55 6.13.89-4.43 4.32 1.05 6.1L12 16.9l-5.49 2.89 1.05-6.1L3.13 8.94l6.13-.89L12 2.5z"
                      />
                    </svg>
                  ))}
                </span>
                Posted on Google
              </span>
            </figcaption>
          </figure>
        </section>
      ) : null}

      <PageCta
        cta={{
          title: "Ready when you are.",
          description: "Send us a message, or call and talk it through with the team.",
          primary: { label: "Send a message", href: "#contact-form" },
          phone: { label: info.phone.display, href: info.phone.href },
        }}
      />
    </main>
  );
}
