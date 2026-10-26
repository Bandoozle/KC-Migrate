import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { SectionTitle } from "@/components/typography";
import { labelCase } from "@/lib/eyebrow";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import { VimeoFeature } from "./VimeoFeature";
import styles from "./HvacMarketingPage.module.css";

const UPLOADS = "https://staging.kosick.com/wp-content/uploads";
const LOCAL = "/images/hvac-marketing";

const IMAGES = {
  intro: { src: `${UPLOADS}/2026/03/hvac-marketing.jpg`, alt: "A Napoleon air conditioner beside a home and garden" },
  efficiency: { src: `${UPLOADS}/2026/07/HVAC-Lead-Generation-Vancouver.jpg`, alt: "A Daikin heat pump beside a backyard patio" },
};

/* Image-topped service cards, one per offer card in WordPress order */
const SERVICE_IMAGES = [
  { src: `${UPLOADS}/2023/07/hvac.jpg`, alt: "An Ayotte Plumbing & Heating billboard for a Comfortmaker furnace" },
  { src: `${UPLOADS}/2025/12/trane-hvac-advertising.jpeg`, alt: "Two RunTru air conditioners beside a brick home" },
  { src: `${UPLOADS}/2025/07/home-services-website-design.webp`, alt: "The DirectBuy Furnace website on a laptop" },
  { src: `${UPLOADS}/2026/06/digital-marketing-services-1.jpg`, alt: "A Google search for a furnace installer in Vancouver on a phone" },
];

const PROCESS = [
  { name: "Audit", line: "Your market, competitors, co-op eligibility and current results." },
  { name: "Strategy", line: "A channel plan, co-op applications and compliant creative." },
  { name: "Launch", line: "Campaigns live, website built, performance tuned weekly." },
  { name: "Scale", line: "Cost per lead and booked jobs reported, budget moved to what works." },
];

const COOP_FLOW = [
  { name: "Co-op funds", line: "Utility and manufacturer programs found and approved." },
  { name: "Media plan", line: "Funds placed where they reach the most homeowners." },
  { name: "Local campaign", line: "Compliant creative launched in your service area." },
  { name: "Leads", line: "Calls and quote requests tracked, claims submitted." },
];

const PROJECTS = [
  { src: `${UPLOADS}/2026/06/hvac-billboard-advertising.jpg`, alt: "Heat pump billboard above a street corner", label: "Outdoor", tall: true },
  { src: `${LOCAL}/feature-lead-generation.jpg`, alt: "Instagram posts for an HVAC dealer", label: "Social" },
  { src: `${LOCAL}/tab-youtube.jpg`, alt: "YouTube and connected TV HVAC advertising", label: "YouTube & CTV" },
  { src: `${LOCAL}/feature-strategies.jpg`, alt: "The Cool Comfort Solutions website on a laptop", label: "Website", tall: true },
  { src: `${LOCAL}/tab-facebook.jpg`, alt: "Facebook HVAC ads", label: "Facebook" },
  { src: `${LOCAL}/feature-billboard.jpg`, alt: "HVAC co-op billboard", label: "Co-op creative" },
];

const CHANNELS = [
  "Google Ads & Local Service Ads",
  "Meta, YouTube & Connected TV",
  "Television, radio & outdoor",
  "Local SEO & Map Pack",
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

type HvacMarketingPageProps = {
  content: ServicePageContent;
};

export function HvacMarketingPage({ content }: HvacMarketingPageProps) {
  const { hero, faqs, cta, statsSection } = content;
  const contactHref = cta?.primary.href || "/contact/";
  const phone = cta?.phone;
  const services = content.offerGroups.flatMap((group) => group.cards).slice(0, 4);
  const video = content.videoSections.find((section) => /vimeo\.com\/video\/\d+/.test(section.src));
  const videoId = video?.src.match(/vimeo\.com\/video\/(\d+)/)?.[1];
  const stats = statsSection?.items ?? [];
  const introStats = stats.filter((stat) => !/lead/i.test(stat.label)).slice(0, 3);
  const leadStat = stats.find((stat) => /lead/i.test(stat.label));

  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={hero} />

      {/* Intro: headline, CTA and figures beside one large photo carrying a figure chip */}
      <section className={styles.intro} aria-labelledby="hv-intro">
        <div className="container">
          <div className={styles.introGrid}>
            <div>
              <p className={styles.label}>HVAC marketing &amp; lead generation</p>
              <SectionTitle id="hv-intro" className={styles.display}>
                Marketing that keeps your schedule full, all year.
              </SectionTitle>
              <p className={styles.lead}>
                Partnered with Trane, RunTru, GE, York, Daikin, Fujitsu and other national brands, we know what drives
                booked jobs for dealers across Canada.
              </p>
              <div className={styles.actions}>
                <Link className={styles.primary} href={contactHref}>
                  Start a project
                  <ArrowIcon />
                </Link>
                {phone ? (
                  <a className={styles.secondary} href={phone.href}>
                    Call us
                  </a>
                ) : null}
              </div>
              {introStats.length > 0 ? (
                <ul className={styles.introStats}>
                  {introStats.map((stat) => (
                    <li key={stat.label}>
                      <span className={styles.introFigure}>
                        {stat.end}
                        {stat.suffix}
                      </span>
                      <span className={styles.introLabel}>{stat.label}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <Reveal variant="fade" className={styles.introMedia}>
              <div className={styles.introPhoto}>
                <Image src={IMAGES.intro.src} alt={IMAGES.intro.alt} fill sizes="(min-width: 960px) 50vw, 100vw" className={styles.cover} priority />
              </div>
              {leadStat ? (
                <div className={styles.chip}>
                  <span className={styles.chipFigure}>
                    {leadStat.end}
                    {leadStat.suffix}
                  </span>
                  <span className={styles.chipLabel}>{leadStat.label}</span>
                </div>
              ) : null}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services: four image-topped cards */}
      {services.length > 0 ? (
        <section className={styles.services} aria-labelledby="hv-services">
          <div className="container">
            <div className={styles.head}>
              <div>
                <p className={styles.label}>Full-service HVAC marketing</p>
                <SectionTitle id="hv-services" className={styles.title}>
                  Everything your HVAC business needs to grow.
                </SectionTitle>
              </div>
            </div>
            <ul className={styles.serviceGrid}>
              {services.map((service, index) => {
                const image = SERVICE_IMAGES[index];
                return (
                  <Reveal key={service.id} as="li" delay={index * 90} className={styles.serviceCard}>
                    {image ? (
                      <div className={styles.serviceImage}>
                        <Image src={image.src} alt={image.alt} fill sizes="(min-width: 960px) 25vw, 50vw" className={styles.cover} />
                      </div>
                    ) : null}
                    <div className={styles.serviceBody}>
                      <span className={styles.serviceNumber}>{String(index + 1).padStart(2, "0")}</span>
                      <h3 className={styles.serviceName}>{service.title}</h3>
                      {service.body ? <p className={styles.serviceLine}>{service.body}</p> : null}
                    </div>
                  </Reveal>
                );
              })}
            </ul>
            <div className={styles.actions}>
              <Link className={styles.primary} href={contactHref}>
                Talk to our team
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* Process: four numbered steps on a stone band */}
      <section className={styles.process} aria-labelledby="hv-process">
        <div className="container">
          <div className={styles.processGrid}>
            <div>
              <p className={styles.label}>How we work</p>
              <SectionTitle id="hv-process" className={styles.title}>
                Our simple, proven process.
              </SectionTitle>
              <p className={styles.lead}>Four steps from first audit to a marketing program that scales.</p>
            </div>
            <ol className={styles.steps}>
              {PROCESS.map((step, index) => (
                <Reveal key={step.name} as="li" delay={index * 100} className={styles.step}>
                  <span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.stepName}>{step.name}</span>
                  <span className={styles.stepLine}>{step.line}</span>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Co-op: an accent band with the funds-to-leads flow as four panels */}
      <section className={styles.coop} aria-labelledby="hv-coop">
        <div className="container">
          <div className={styles.coopHead}>
            <p className={styles.labelOnDark}>Co-op programs</p>
            <SectionTitle id="hv-coop" className={styles.titleOnDark}>
              From co-op funds to booked jobs.
            </SectionTitle>
            <p className={styles.leadOnDark}>
              We find utility and manufacturer co-op money, build compliant creative and submit the claims.
            </p>
          </div>
          <ol className={styles.coopFlow}>
            {COOP_FLOW.map((step, index) => (
              <Reveal key={step.name} as="li" delay={index * 100} className={styles.coopStep}>
                <span className={styles.coopNumber}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.coopName}>{step.name}</span>
                <span className={styles.coopLine}>{step.line}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Projects: a gallery of dealer campaign work */}
      <section className={styles.projects} aria-labelledby="hv-projects">
        <div className="container">
          <div className={styles.head}>
            <div>
              <p className={styles.label}>Our HVAC work</p>
              <SectionTitle id="hv-projects" className={styles.title}>
                Your brand. Every platform.
              </SectionTitle>
            </div>
            <p className={styles.lead}>One campaign system, built to reach homeowners wherever they are.</p>
          </div>
          <ul className={styles.gallery}>
            {PROJECTS.map((project, index) => (
              <Reveal
                key={project.src}
                as="li"
                delay={(index % 3) * 90}
                className={project.tall ? `${styles.tile} ${styles.tileTall}` : styles.tile}
              >
                <Image src={project.src} alt={project.alt} fill sizes="(min-width: 960px) 33vw, 50vw" className={styles.cover} />
                <span className={styles.tileLabel}>{project.label}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Video: the same Vimeo asset, with a poster from its first frame */}
      {videoId ? (
        <section className={styles.video} aria-labelledby="hv-video">
          <div className="container">
            <div className={styles.head}>
              <div>
                <p className={styles.labelOnDark}>HVAC campaigns in market</p>
                <SectionTitle id="hv-video" className={styles.titleOnDark}>
                  See the work in motion.
                </SectionTitle>
              </div>
            </div>
            <Reveal variant="fade">
              <VimeoFeature id={videoId} title="This is Belyea" poster={`${LOCAL}/video-poster.jpg`} />
            </Reveal>
            <p className={styles.videoNote}>
              Strategy, production and media together in one campaign for Belyea Bros. Heating &amp; Cooling.
            </p>
          </div>
        </section>
      ) : null}

      {/* Efficiency: photo beside the channel checklist */}
      <section className={styles.efficiency} aria-labelledby="hv-efficiency">
        <div className="container">
          <div className={styles.effGrid}>
            <Reveal variant="fade" className={styles.effMedia}>
              <div className={styles.effPhoto}>
                <Image src={IMAGES.efficiency.src} alt={IMAGES.efficiency.alt} fill sizes="(min-width: 960px) 50vw, 100vw" className={styles.cover} />
              </div>
            </Reveal>
            <div>
              <p className={styles.label}>Digital &amp; traditional</p>
              <SectionTitle id="hv-efficiency" className={styles.title}>
                Reach homeowners at every touchpoint.
              </SectionTitle>
              <p className={styles.lead}>
                Search when the furnace fails, TV and radio before the season turns, and outdoor in every service
                area you cover.
              </p>
              <ul className={styles.checklist}>
                {CHANNELS.map((channel) => (
                  <li key={channel}>
                    <span className={styles.check}>
                      <CheckIcon />
                    </span>
                    {channel}
                  </li>
                ))}
              </ul>
              <Link className={styles.primary} href="/services/hvac-marketing/hvac-lead-generation/">
                Start generating leads
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {faqs && faqs.items.length > 0 ? (
        <FaqAccordion eyebrow="" title={labelCase(faqs.title)} items={faqs.items} />
      ) : null}

      {cta ? <PageCta cta={cta} /> : null}
    </main>
  );
}
