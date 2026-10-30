import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { SectionTitle } from "@/components/typography";
import { labelCase } from "@/lib/eyebrow";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import styles from "./EmailMarketingPage.module.css";

const UPLOADS = "/wp-content/uploads";

const IMAGES = {
  inbox: { src: `${UPLOADS}/2026/07/Email-Marketing-Canada-e1784665624120.jpg`, alt: "A Central HVAC email open in Mailchimp on a laptop" },
  campaign: { src: `${UPLOADS}/2026/07/ChatGPT-Image-Jul-21-2026-at-11_55_22-AM.jpg`, alt: "A ZO Skin Health email layout laid out among the products it sells" },
  journey: { src: `${UPLOADS}/2026/07/Email-Marketing.jpg`, alt: "An Amsterdam Garden Centre summer email in Mailchimp on a laptop" },
};

/* Inbox tags for the four offer cards, in WordPress order */
const TAGS = ["Campaigns", "Automation", "Audience", "Reporting"];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" d="M3 7.5V18a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-8l-2-2.5H4a1 1 0 0 0-1 1z" />
    </svg>
  );
}

/* The top of a message in a mail client: who it is from and what it is about */
function MailHeader({ from, subject }: { from: string; subject: string }) {
  return (
    <div className={styles.mailHeader} aria-hidden="true">
      <span className={styles.mailDots}>
        <i />
        <i />
        <i />
      </span>
      <dl className={styles.mailFields}>
        <div>
          <dt>From</dt>
          <dd>{from}</dd>
        </div>
        <div>
          <dt>Subject</dt>
          <dd>{subject}</dd>
        </div>
      </dl>
    </div>
  );
}

function EnvelopeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v12H4zM4 7l8 6 8-6" />
    </svg>
  );
}

type EmailMarketingPageProps = {
  content: ServicePageContent;
};

export function EmailMarketingPage({ content }: EmailMarketingPageProps) {
  const { hero, intro, faqs, cta } = content;
  const offers = content.offerGroups.flatMap((group) => group.cards);
  const services = content.packageSections.flatMap((section) => section.cards);
  const servicesTitle = content.packageSections.find((section) => section.title)?.title || "Full-service email marketing";

  const campaign = content.features.find((feature) => /campaign/i.test(feature.title));
  const journey = content.features.find((feature) => /journey|automat/i.test(feature.title));
  const analytics = content.features.find((feature) => /analytic|optim/i.test(feature.title));

  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={hero} />

      {/* Inbox: headline across, a tall campaign photo beside the four services set as inbox rows */}
      {offers.length > 0 ? (
        <section className={styles.inbox} aria-labelledby="em-inbox">
          <div className="container">
            <div className={styles.inboxHead}>
              <p className={styles.label}>{labelCase(intro?.eyebrow || "What we offer")}</p>
              <SectionTitle id="em-inbox" className={styles.titleOnDark}>
                {labelCase(intro?.title || "Smarter email marketing, better results")}
              </SectionTitle>
            </div>
            <div className={styles.inboxGrid}>
              <Reveal variant="fade" className={styles.inboxMedia}>
                <div className={styles.frame}>
                  <Image src={IMAGES.inbox.src} alt={IMAGES.inbox.alt} fill sizes="(min-width: 960px) 40vw, 100vw" className={styles.cover} />
                </div>
              </Reveal>
              <div className={styles.mailbox}>
                <div className={styles.mailboxBar}>
                  <span>Inbox</span>
                  <span>{offers.length} new</span>
                </div>
                <ul className={styles.messages}>
                  {offers.map((offer, index) => (
                    <Reveal key={offer.id} as="li" delay={index * 90} className={styles.message}>
                      <span className={styles.unread} aria-hidden="true" />
                      <span className={styles.subject}>{offer.title}</span>
                      <span className={styles.tag}>{TAGS[index] ?? "Email"}</span>
                      {offer.body ? <span className={styles.preview}>{offer.body}</span> : null}
                    </Reveal>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Campaigns: cream page, the email itself is the hero image */}
      {campaign ? (
        <section className={styles.campaign} aria-labelledby="em-campaign">
          <div className="container">
            <div className={styles.campaignGrid}>
              <div className={styles.campaignCopy}>
                {campaign.eyebrow ? <p className={styles.labelOnLight}>{labelCase(campaign.eyebrow)}</p> : null}
                <SectionTitle id="em-campaign" className={styles.display}>
                  {labelCase(campaign.title)}
                </SectionTitle>
                <p className={styles.body}>{campaign.body}</p>
                {campaign.bullets && campaign.bullets.length > 0 ? (
                  <ul className={styles.checks}>
                    {campaign.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
                {campaign.cta ? (
                  <Link className={styles.dark} href={campaign.cta.href}>
                    {labelCase(campaign.cta.label)}
                    <ArrowIcon />
                  </Link>
                ) : null}
              </div>
              <Reveal variant="fade" className={styles.campaignMedia}>
                <div className={styles.mailWindow}>
                  <MailHeader from="Your brand" subject={labelCase(campaign.title)} />
                  <div className={styles.frame}>
                    <Image src={IMAGES.campaign.src} alt={IMAGES.campaign.alt} fill sizes="(min-width: 960px) 50vw, 100vw" className={styles.cover} />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      ) : null}

      {/* Automation: one thread of sends, then a wide photograph of a live email */}
      {journey ? (
        <section className={styles.journey} aria-labelledby="em-journey">
          <div className="container">
            <div className={styles.journeyHead}>
              <div>
                {journey.eyebrow ? <p className={styles.label}>{labelCase(journey.eyebrow)}</p> : null}
                <SectionTitle id="em-journey" className={styles.titleOnDark}>
                  {labelCase(journey.title)}
                </SectionTitle>
              </div>
              <p className={styles.bodyOnDark}>{journey.body}</p>
            </div>
            {journey.bullets && journey.bullets.length > 0 ? (
              <ol className={styles.thread} aria-label="Automation workflows">
                {journey.bullets.map((bullet, index) => (
                  <Reveal key={bullet} as="li" delay={index * 110} className={styles.send}>
                    <span className={styles.sendNode} aria-hidden="true">
                      <EnvelopeIcon />
                    </span>
                    <span className={styles.sendNumber}>Email {String(index + 1).padStart(2, "0")}</span>
                    <span className={styles.sendName}>{bullet}</span>
                  </Reveal>
                ))}
              </ol>
            ) : null}
            <Reveal variant="fade" className={styles.journeyMedia}>
              <div className={styles.frame}>
                <Image src={IMAGES.journey.src} alt={IMAGES.journey.alt} fill sizes="(min-width: 1290px) 1290px, 100vw" className={styles.cover} />
              </div>
            </Reveal>
            {journey.cta ? (
              <Link className={styles.light} href={journey.cta.href}>
                {labelCase(journey.cta.label)}
                <ArrowIcon />
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Analytics: a report, set as large numbered lines */}
      {analytics ? (
        <section className={styles.report} aria-labelledby="em-report">
          <div className="container">
            <div className={styles.reportGrid}>
              <div>
                {analytics.eyebrow ? <p className={styles.labelOnLight}>{labelCase(analytics.eyebrow)}</p> : null}
                <SectionTitle id="em-report" className={styles.title}>
                  {labelCase(analytics.title)}
                </SectionTitle>
                <p className={styles.body}>{analytics.body}</p>
              </div>
              {analytics.bullets && analytics.bullets.length > 0 ? (
                <div className={styles.reportMail}>
                  <MailHeader from="Kosick Communications" subject="Your campaign report" />
                  <ol className={styles.lines}>
                    {analytics.bullets.map((bullet, index) => (
                      <li key={bullet}>
                        <span className={styles.lineNumber}>{String(index + 1).padStart(2, "0")}</span>
                        <span className={styles.lineName}>{bullet}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* Services: four ruled columns */}
      {services.length > 0 ? (
        <section className={styles.services} aria-labelledby="em-services">
          <div className="container">
            <p className={styles.label}>What&rsquo;s included</p>
            <SectionTitle id="em-services" className={styles.titleOnDark}>
              {labelCase(servicesTitle)}
            </SectionTitle>
            <div className={styles.columns}>
              {services.map((service) => (
                <div key={service.title} className={styles.column}>
                  <h3 className={styles.columnTitle}>
                    <span className={styles.folder}>
                      <FolderIcon />
                    </span>
                    <span className={styles.columnName}>{service.title}</span>
                    {service.items && service.items.length > 0 ? (
                      <span className={styles.count} aria-label={`${service.items.length} items`}>
                        {service.items.length}
                      </span>
                    ) : null}
                  </h3>
                  {service.items && service.items.length > 0 ? (
                    <ul className={styles.items}>
                      {service.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {faqs && faqs.items.length > 0 ? (
        <FaqAccordion eyebrow="" title={labelCase(faqs.title)} items={faqs.items} />
      ) : null}

      {cta ? <PageCta cta={cta} /> : null}
    </main>
  );
}
