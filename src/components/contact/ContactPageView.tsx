import Image from "next/image";
import type { CSSProperties } from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactNextSteps } from "@/components/contact/ContactNextSteps";
import { OfficeStatus } from "@/components/contact/OfficeStatus";
import { PageCta } from "@/components/sections/PageCta";
import { SectionDescription, SectionTitle } from "@/components/typography";
import { labelCase } from "@/lib/eyebrow";
import type { ContactPageContent } from "@/lib/wordpress/contact";
import type { HomeTestimonial } from "@/lib/wordpress/home";
import styles from "./ContactPageView.module.css";

/*
 * Recognizable brands from campaigns and co-op across industries — past and
 * present. `scale` is optical weight against a shared frame:
 * - wide/ultrawide wordmarks sit under 1 so they don't dominate by width
 * - crests get a modest lift so thin marks don't disappear
 * - padded canvases (Trane/GE) need a larger scale so the mark itself matches peers
 */
type PartnerLogo = {
  name: string;
  src: string;
  scale: number;
  mark?: "crest";
  shape?: "wide" | "ultrawide" | "padded";
};

const PARTNER_LOGOS: PartnerLogo[] = [
  { name: "Disney", src: "/images/brands/disney.png", scale: 1 },
  { name: "Hyatt", src: "/images/brands/hyatt.png", scale: 0.82, shape: "wide" },
  { name: "Audi", src: "/images/brands/audi.png", scale: 1.05 },
  { name: "Porsche", src: "/images/brands/porsche.png", mark: "crest", scale: 0.98 },
  { name: "Princess Cruises", src: "/images/brands/princess-cruises.png", scale: 0.9, shape: "wide" },
  { name: "Oceania Cruises", src: "/images/brands/oceania-cruises.png", scale: 0.95, shape: "wide" },
  { name: "Volkswagen", src: "/images/brands/volkswagen.png", mark: "crest", scale: 0.96 },
  { name: "Expedia", src: "/images/brands/expedia.png", scale: 0.84, shape: "wide" },
  { name: "RE/MAX", src: "/images/brands/remax.png", scale: 0.7, shape: "wide" },
  { name: "COBS Bread", src: "/images/brands/cobs-bread.png", mark: "crest", scale: 1 },
  { name: "Mavi", src: "/images/brands/mavi.png", scale: 0.95, shape: "wide" },
  { name: "Arc'teryx", src: "/images/brands/arcteryx-bird.png", mark: "crest", scale: 0.9 },
  { name: "Trane", src: "/wp-content/uploads/2026/07/Trane.png", scale: 2.45, shape: "padded" },
  { name: "SkinCeuticals", src: "/images/brands/skinceuticals.png", scale: 1.45, shape: "ultrawide" },
  { name: "GE", src: "/wp-content/uploads/2026/07/GE.png", scale: 1.45, shape: "padded" },
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
              {/* The space keeps the heading text "Let’s make something happen." for search and screen readers */}
              <span>Let’s make</span>{" "}
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
          <SectionTitle id="contact-partners-title" className={styles.partnersTitle}>
            Experience across brands and industries
          </SectionTitle>
          <SectionDescription className={styles.partnersNote}>
            A selection of brands we&rsquo;ve worked with on campaigns and co-op, past and present.
          </SectionDescription>
          <ul className={styles.logos}>
            {PARTNER_LOGOS.map((logo) => (
              <li
                key={logo.name}
                className={styles.logo}
                data-mark={logo.mark}
                data-shape={logo.shape}
                style={{ "--logo-scale": String(logo.scale) } as CSSProperties}
              >
                <span className={styles.logoFrame}>
                  <Image
                    className={styles.logoImg}
                    src={logo.src}
                    alt={logo.name}
                    width={640}
                    height={240}
                    sizes="(max-width: 640px) 48vw, (max-width: 900px) 34vw, 16rem"
                  />
                </span>
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
