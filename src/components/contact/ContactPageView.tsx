import { InternalPageHero } from "@/components/sections/InternalPageHero";
import { serviceHeroActions } from "@/lib/content/industry-heroes";
import { ContactForm } from "@/components/contact/ContactForm";
import { eyebrowLabel, labelCase } from "@/lib/eyebrow";
import type { ContactPageContent } from "@/lib/wordpress/contact";
import styles from "./ContactPageView.module.css";

type ContactPageViewProps = {
  content: ContactPageContent;
};

function addressLines(address: string): string[] {
  return address
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function mapHref(address: string): string {
  const query = address
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function ContactPageView({ content }: ContactPageViewProps) {
  const { info, formSection, form } = content;
  const actions = serviceHeroActions(formSection.phone.href ? "#contact-form" : "/contact/", info.phone.href);
  const studioEyebrow = eyebrowLabel(info.eyebrow);

  return (
    <main className={styles.main}>
      <InternalPageHero
        eyebrow="Contact"
        titlePrimary="Kosick"
        titleSecondary="Communications"
        description={formSection.lead.split(/(?<=\.)\s/)[0]}
        backgroundImage={info.image?.src}
        primaryCTA={{ label: actions.cta.label, href: "#contact-form" }}
        secondaryCTA={{ label: actions.secondaryCta.label, href: info.phone.href, icon: "phone" }}
      />

      <section className={`section ${styles.studio}`} aria-labelledby="contact-studio-title">
        <div className={`container ${styles.shell}`}>
          <div className={styles.panel}>
            {studioEyebrow ? <p className={styles.eyebrow}>{studioEyebrow}</p> : null}
            <h2 id="contact-studio-title" className={styles.heading}>
              Let’s make something happen.
            </h2>
            <p className={styles.intro}>{formSection.lead}</p>

            <div className={styles.direct}>
              <p>
                <span className={styles.directLabel}>{info.phone.label}</span>
                <a href={info.phone.href}>{info.phone.display}</a>
              </p>
              <p>
                <span className={styles.directLabel}>{info.email.label}</span>
                <a href={info.email.href}>{info.email.display}</a>
              </p>
            </div>

            <ul className={styles.offices}>
              {info.offices.map((office) => (
                <li key={office.label}>
                  <h3 className={styles.officeLabel}>{labelCase(office.label)}</h3>
                  <p className={styles.officeAddress}>
                    {addressLines(office.address).map((line, index) => (
                      <span key={`${office.label}-${index}`}>{line}</span>
                    ))}
                  </p>
                  <a
                    className={styles.mapLink}
                    href={mapHref(office.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Map
                    <span className={styles.srOnly}> for the {office.label} office</span>
                  </a>
                </li>
              ))}
            </ul>

            <p className={styles.servicing}>{info.servicing}</p>
          </div>

          <div id="contact-form" className={styles.formPane}>
            <h3 className={styles.formHeading}>Send a message</h3>
            <p className={styles.formNote}>Fields marked with * are required.</p>
            <ContactForm form={form} appearance="studio" />
          </div>
        </div>
      </section>
    </main>
  );
}
