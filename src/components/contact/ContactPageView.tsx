import {
  BodyText,
  Eyebrow,
  PageTitle,
  SectionDescription,
  SectionTitle,
} from "@/components/typography";
import { ContactForm } from "@/components/contact/ContactForm";
import type { ContactPageContent } from "@/lib/wordpress/contact";
import styles from "./ContactPageView.module.css";

type ContactPageViewProps = {
  content: ContactPageContent;
};

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function ContactPageView({ content }: ContactPageViewProps) {
  const { info, formSection, form } = content;

  return (
    <main className={styles.main}>
      <section className={`section ${styles.infoSection}`}>
        <div className={`container ${styles.infoLayout}`}>
          <div className={styles.infoCopy}>
            <Eyebrow>{info.eyebrow}</Eyebrow>
            <PageTitle as="h1" className={styles.company}>
              {info.company}
            </PageTitle>

            <div className={styles.directContacts}>
              <p>
                <span className={styles.directLabel}>{info.phone.label}:</span>{" "}
                <a href={info.phone.href}>{info.phone.display}</a>
              </p>
              <p>
                <span className={styles.directLabel}>{info.email.label}:</span>{" "}
                <a href={info.email.href}>{info.email.display}</a>
              </p>
            </div>

            <ul className={styles.offices}>
              {info.offices.map((office) => (
                <li key={office.label}>
                  <h2 className={styles.officeLabel}>{office.label}</h2>
                  <BodyText className={styles.officeAddress}>{office.address}</BodyText>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.infoMedia}>
            {info.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={info.image.src}
                alt={info.image.alt}
                className={styles.mapImage}
              />
            ) : null}
            <p className={styles.servicing}>{info.servicing}</p>
          </div>
        </div>
      </section>

      <section className={`section ${styles.formSection}`} aria-labelledby="contact-form-title">
        <div className={`container ${styles.formLayout}`}>
          <div className={styles.formDetails}>
            <SectionTitle id="contact-form-title" className={styles.formHeading}>
              {formSection.heading}
            </SectionTitle>
            <SectionDescription className={styles.formLead}>
              {formSection.lead}
            </SectionDescription>

            <ul className={styles.detailList}>
              <li className={styles.detailItem}>
                <span className={styles.detailIcon}>
                  <PhoneIcon />
                </span>
                <div>
                  <span className={styles.detailLabel}>{formSection.phone.label}</span>
                  <a className={styles.detailValue} href={formSection.phone.href}>
                    {formSection.phone.display}
                  </a>
                </div>
              </li>
              <li className={styles.detailItem}>
                <span className={styles.detailIcon}>
                  <EmailIcon />
                </span>
                <div>
                  <span className={styles.detailLabel}>{formSection.email.label}</span>
                  <a className={styles.detailValue} href={formSection.email.href}>
                    {formSection.email.display}
                  </a>
                </div>
              </li>
              <li className={styles.detailItem}>
                <span className={styles.detailIcon}>
                  <MapIcon />
                </span>
                <div>
                  <span className={styles.detailLabel}>{formSection.location.label}</span>
                  <span className={styles.detailValue}>{formSection.location.display}</span>
                </div>
              </li>
            </ul>
          </div>

          <ContactForm form={form} />
        </div>
      </section>
    </main>
  );
}
