import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { getPartnerName } from "@/components/sections/PartnerLogoGrid";
import { RelatedServices } from "@/components/sections/digital-marketing/RelatedServices";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { CampaignFlow, type CampaignStep } from "@/components/sections/television/CampaignFlow";
import { SectionTitle } from "@/components/typography";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import styles from "./HvacLeadGenerationPage.module.css";

const UPLOADS = "https://staging.kosick.com/wp-content/uploads";

const PHOTOS = {
  equipment: {
    src: `${UPLOADS}/2025/12/trane-hvac-advertising.jpeg`,
    alt: "Two air conditioners installed beside a brick home",
  },
  billboard: {
    src: `${UPLOADS}/2026/06/hvac-billboard-advertising.jpg`,
    alt: "A heat pump billboard above a street corner",
  },
  home: {
    src: `${UPLOADS}/2026/03/hvac-marketing.jpg`,
    alt: "An air conditioner beside a home and garden",
  },
  close: {
    src: `${UPLOADS}/2026/07/HVAC-Lead-Generation-Vancouver.jpg`,
    alt: "A heat pump beside a backyard patio",
  },
};

const PILLARS = [
  {
    number: "01",
    title: "Digital Demand",
    line: "Paid search and social reach homeowners already looking for heating and cooling.",
  },
  {
    number: "02",
    title: "Local Visibility",
    line: "Outdoor and local presence keep the brand familiar in the markets you serve.",
  },
  {
    number: "03",
    title: "Conversion & Follow-Up",
    line: "Calls, forms, and follow-up turn that interest into booked appointments.",
  },
];

const SEARCH_POINTS = [
  { title: "High-intent keywords", line: "The searches homeowners make when they need service." },
  { title: "Compelling ad creative", line: "Offers and proof that match the job they are trying to book." },
  { title: "Continuous optimization", line: "Spend and creative adjusted while the campaign is live." },
];

const OUTDOOR_POINTS = [
  { title: "Strategic market planning", line: "Placements chosen for the roads and neighbourhoods you serve." },
  { title: "Strong on-brand creative", line: "A message that still reads at a distance, in traffic." },
  { title: "Multi-channel support", line: "Outdoor planned with search, so visibility has a next step." },
];

const MARKETS = [
  { title: "Season", line: "Heating and cooling are planned on different calendars." },
  { title: "Neighbourhood", line: "Housing and climate change what the campaign should say." },
  { title: "Service mix", line: "Repair, replacement, and air quality are not one offer." },
];

const FLOW: CampaignStep[] = [
  {
    label: "Attract",
    title: "Capture demand",
    body: "Paid search and social reach homeowners already looking for heating, cooling, and air quality.",
  },
  {
    label: "Build",
    title: "Stay visible",
    body: "Outdoor and local presence keep the brand familiar before a homeowner is ready to call.",
  },
  {
    label: "Convert",
    title: "Book the job",
    body: "A clear next step, then follow-up, turns that interest into a service appointment.",
  },
  {
    label: "Grow",
    title: "Keep the pipeline",
    body: "Demand, visibility, and follow-up stay connected, so lead flow is more consistent.",
  },
];

function Notes({ items, light = false }: { items: Array<{ title: string; line: string }>; light?: boolean }) {
  return (
    <ul className={light ? styles.notesOnDark : styles.notes}>
      {items.map((item) => (
        <li key={item.title}>
          <span>{item.title}</span>
          <span>{item.line}</span>
        </li>
      ))}
    </ul>
  );
}

export function HvacLeadGenerationPage({ content }: { content: ServicePageContent }) {
  const logos = content.partnerLogos?.logos ?? [];
  const primaryHref = content.cta?.primary?.href || "/contact/";
  const talkHref = content.cta?.phone?.href || "/contact/";

  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={content.hero} />

      {logos.length > 0 ? (
        <section className={styles.brands} aria-labelledby="hvac-brands">
          <div className="container">
            <SectionTitle as="h2" id="hvac-brands">
              Trusted by leading HVAC brands
            </SectionTitle>
            <ul className={styles.logoRow}>
              {logos.map((logo, index) => (
                <li key={`${logo.src}-${index}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logo.src} alt={getPartnerName(logo, index)} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className={styles.system} aria-labelledby="hvac-system">
        <div className="container">
          <div className={styles.split}>
            <div>
              <p className={styles.kicker}>Lead system</p>
              <SectionTitle as="h2" id="hvac-system">
                A multi-channel approach built to generate HVAC leads
              </SectionTitle>
              <p className={styles.lead}>
                Digital demand, local visibility, and follow-up work as one path from a search to a booked job.
              </p>
            </div>
            <ol className={styles.architecture} aria-label="Lead system">
              {PILLARS.map((pillar) => (
                <li key={pillar.number}>
                  <span>{pillar.number}</span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.line}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className={styles.search} aria-labelledby="hvac-search">
        <div className="container">
          <div className={styles.feature}>
            <Reveal variant="fade" className={styles.featureMedia}>
              <figure className={styles.figure}>
                <div className={styles.photo}>
                  <Image
                    src={PHOTOS.equipment.src}
                    alt={PHOTOS.equipment.alt}
                    fill
                    sizes="(min-width: 960px) 58vw, 100vw"
                    className={styles.cover}
                  />
                </div>
                <figcaption>
                  <p>furnace repair near me</p>
                  <p>Furnace repair · AC installation · Heat pump service</p>
                </figcaption>
              </figure>
            </Reveal>
            <div>
              <p className={styles.kickerOnDark}>Search engine marketing</p>
              <SectionTitle as="h2" id="hvac-search" className={styles.onDark}>
                Search engine marketing that captures high-intent demand
              </SectionTitle>
              <p className={styles.leadOnDark}>
                Meet homeowners while they are looking for heating, cooling, and air quality service.
              </p>
              <Notes items={SEARCH_POINTS} light />
              <Link className={styles.light} href={primaryHref}>
                Plan a search campaign
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.outdoor} aria-labelledby="hvac-outdoor">
        <div className="container">
          <div className={styles.feature}>
            <Reveal variant="fade">
              <figure className={styles.figure}>
                <div className={`${styles.photo} ${styles.billboard}`}>
                  <Image
                    src={PHOTOS.billboard.src}
                    alt={PHOTOS.billboard.alt}
                    fill
                    sizes="(min-width: 960px) 58vw, 100vw"
                    className={styles.cover}
                  />
                </div>
                <figcaption>
                  <p>Street-level billboard</p>
                  <p>Heat pump creative, placed where the market already drives.</p>
                </figcaption>
              </figure>
            </Reveal>
            <div>
              <p className={styles.kicker}>Outdoor advertising</p>
              <SectionTitle as="h2" id="hvac-outdoor">
                Stay visible in the markets you serve.
              </SectionTitle>
              <p className={styles.lead}>
                Out-of-home keeps the brand present between searches, at the scale of the street.
              </p>
              <Notes items={OUTDOOR_POINTS} />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.local} aria-labelledby="hvac-local">
        <div className="container">
          <div className={styles.split}>
            <div>
              <p className={styles.kicker}>Local opportunities</p>
              <SectionTitle as="h2" id="hvac-local">
                Every market is different.
              </SectionTitle>
              <p className={styles.lead}>
                A useful plan starts with the season, the housing, and the work homeowners actually book. One generic
                campaign does not cover that.
              </p>
            </div>
            <figure className={styles.figure}>
              <div className={styles.photo}>
                <Image
                  src={PHOTOS.home.src}
                  alt={PHOTOS.home.alt}
                  fill
                  sizes="(min-width: 960px) 48vw, 100vw"
                  className={styles.cover}
                />
              </div>
              <figcaption className={styles.marketNotes}>
                <Notes items={MARKETS} />
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className={styles.flowSection} aria-labelledby="hvac-flow">
        <div className="container">
          <div className={styles.flowIntro}>
            <p className={styles.kickerOnDark}>The full path</p>
            <SectionTitle as="h2" id="hvac-flow" className={styles.onDark}>
              Connected marketing creates better HVAC leads.
            </SectionTitle>
            <p className={styles.leadOnDark}>
              Demand, visibility, and follow-up only work when they are planned as one system.
            </p>
          </div>
          <CampaignFlow steps={FLOW} label="Connected marketing path" />
        </div>
      </section>

      {content.faqs && content.faqs.items.length > 0 ? (
        <FaqAccordion eyebrow={content.faqs.eyebrow} title={content.faqs.title} items={content.faqs.items} />
      ) : null}

      <section className={styles.close} aria-labelledby="hvac-cta">
        <div className={`container ${styles.closeInner}`}>
          <Reveal variant="fade" className={styles.closePhoto}>
            <Image
              src={PHOTOS.close.src}
              alt={PHOTOS.close.alt}
              fill
              sizes="(min-width: 960px) 72vw, 100vw"
              className={styles.cover}
            />
          </Reveal>
          <SectionTitle as="h2" id="hvac-cta" className={styles.onDark}>
            Ready to grow your HVAC business?
          </SectionTitle>
          <p className={styles.closeLead}>
            Tell us about the markets you serve. We&apos;ll map a lead system from demand through booked jobs.
          </p>
          <div className={styles.actions}>
            <Link className={styles.light} href={primaryHref}>
              Book a Strategy Call
            </Link>
            <Link className={styles.quiet} href={talkHref}>
              Talk to Our Team
            </Link>
          </div>
        </div>
      </section>

      {content.relatedServices.length > 0 ? <RelatedServices services={content.relatedServices} /> : null}
    </main>
  );
}
