import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { SectionDescription, SectionTitle } from "@/components/typography";
import { labelCase } from "@/lib/eyebrow";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import { BrandAnatomy, type AnatomyPart } from "./BrandAnatomy";
import { BrandProcess, type BrandProcessStep } from "./BrandProcess";
import styles from "./CorporateBrandingPage.module.css";

const UPLOADS = "https://staging.kosick.com/wp-content/uploads";

const IMAGES = {
  identitySheet: {
    src: `${UPLOADS}/2026/06/corporate-branding.jpg`,
    alt: "Brand identity sheet showing a logo, colour palette, typography, icons and branded applications",
  },
  lockup: {
    src: `${UPLOADS}/2026/06/kosick-communications-branding.jpg`,
    alt: "Kosick Communications logo lockup on a blue brand panel",
    position: "0% 50%",
  },
  desk: {
    src: `${UPLOADS}/2025/07/branding-agency.webp`,
    alt: "A brand identity book on a desk beside a laptop and keyboard",
    position: "30% 70%",
  },
  tonalCards: {
    src: `${UPLOADS}/2023/06/MBYMockupcards2.jpeg`,
    alt: "Four MBY Interiors business cards in a tonal grey palette",
  },
  website: {
    src: `${UPLOADS}/2026/06/dental-clinic-branding.jpg`,
    alt: "Laptop showing a dental clinic website",
    position: "55% 50%",
  },
  tablet: {
    src: `${UPLOADS}/2026/06/social-media-engagement.jpg`,
    alt: "Tablet showing a branded resort website",
  },
};

const ANATOMY: AnatomyPart[] = [
  { label: "Logo", body: "The mark and lockup that anchor recognition.", region: { x: 2, y: 2, w: 38, h: 11 } },
  { label: "Colour palette", body: "A defined set of colours, specified for print and screen.", region: { x: 2, y: 26.5, w: 47, h: 13.5 } },
  { label: "Typography", body: "Headline and body typefaces with clear roles.", region: { x: 2, y: 40.5, w: 47, h: 19.5 } },
  { label: "Iconography", body: "Icons and graphic elements in one visual language.", region: { x: 50, y: 27, w: 48, h: 33 } },
  { label: "Applications", body: "The system at work on ads, banners, cards and vehicles.", region: { x: 2, y: 71.5, w: 96, h: 24.5 } },
];

const DELIVERABLES = [
  { title: "Identity elements", detail: "Logo, colour palette, typography and imagery." },
  { title: "Brand guidelines", detail: "Clear rules so every application stays consistent." },
  { title: "Collateral templates", detail: "Marketing materials your team can reuse with confidence." },
  { title: "Web and digital assets", detail: "Implementation backed by developer guidelines." },
  { title: "Packaging and signage", detail: "Design for the physical places customers meet you." },
];

const STEP_COPY: Record<string, Omit<BrandProcessStep, "number" | "title">> = {
  "brand analysis": {
    body: "We study your customers, competitors and selling points to find where you can stand apart.",
    inputs: ["Target customers", "Competition", "Unique selling points"],
  },
  "logo design": {
    body: "A strategic mark that captures attention, leaves a lasting impression and anchors the identity.",
    image: IMAGES.lockup,
  },
  "brand strategy": {
    body: "Built on a deep understanding of your audience, then reviewed and refined as the market moves.",
    image: IMAGES.desk,
  },
  "brand identity": {
    body: "A distinct personality that builds brand equity and connects with the audience you want.",
    image: IMAGES.tonalCards,
  },
  "brand positioning": {
    body: "Positioning that shapes perception, guides marketing and influences customer behaviour.",
    image: IMAGES.website,
  },
  "brand implementation": {
    body: "Consistent use across every touchpoint, so the brand is recognizable wherever customers meet it.",
    image: IMAGES.tablet,
  },
};

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function fullSize(src: string) {
  return src.replace(/-\d+x\d+(?=\.\w+$)/, "");
}

type CorporateBrandingPageProps = {
  content: ServicePageContent;
};

export function CorporateBrandingPage({ content }: CorporateBrandingPageProps) {
  const { hero, intro, promoBand, faqs, cta } = content;
  const feature = content.features[0];

  const steps: BrandProcessStep[] = (content.processSection?.steps ?? []).map((step) => {
    const copy = STEP_COPY[step.title.trim().toLowerCase()];
    return {
      number: step.number,
      title: labelCase(step.title),
      body: copy?.body ?? step.body ?? "",
      image: copy?.image ?? null,
      inputs: copy?.inputs,
    };
  });

  const capabilities = content.relatedServices.filter((service) => service.image?.src);
  const billboard = feature?.image?.src ? { src: fullSize(feature.image.src), alt: "Billboard for high-efficiency heat pumps above a street corner" } : null;
  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={hero} />

      {intro ? (
        <section className={styles.intro} aria-labelledby="cb-intro">
          <div className="container">
            <div className={styles.introGrid}>
              <div>
                {intro.eyebrow ? <p className={styles.label}>{labelCase(intro.eyebrow)}</p> : null}
                <SectionTitle id="cb-intro" className={styles.introTitle}>
                  {intro.title}
                </SectionTitle>
                <p className={styles.introLead}>
                  We build bespoke corporate branding and growth strategies designed to win attention, earn trust, and
                  accelerate real business growth.
                </p>
                <ol className={styles.approach}>
                  <li>
                    <span className={styles.approachStep}>First</span>
                    <span>Understand your audience deeply.</span>
                  </li>
                  <li>
                    <span className={styles.approachStep}>Then</span>
                    <span>Shape an identity that resonates with them and moves your organization toward its goals.</span>
                  </li>
                </ol>
                <p className={styles.introNote}>Our approach, refined over more than 40 years of experience.</p>
              </div>
              <Reveal>
                <BrandAnatomy
                  image={IMAGES.identitySheet}
                  parts={ANATOMY}
                  caption={
                    <>
                      <span className={styles.fig}>Fig. 02</span>
                      An identity system on one sheet. Select an element to see where it lives.
                    </>
                  }
                />
              </Reveal>
            </div>
          </div>
        </section>
      ) : null}

      {feature ? (
        <section className={styles.services} aria-labelledby="cb-services">
          <div className="container">
            <div className={styles.servicesGrid}>
              {billboard ? (
                <Reveal className={styles.billboardWrap}>
                  <figure className={styles.billboard}>
                    <div className={styles.billboardFrame}>
                      <Image src={billboard.src} alt={billboard.alt} fill sizes="(min-width: 980px) 56vw, 100vw" className={styles.cover} />
                    </div>
                    <figcaption className={styles.figCaption}>
                      <span className={styles.fig}>Fig. 03</span>
                      Identity carried to street scale.
                    </figcaption>
                  </figure>
                </Reveal>
              ) : null}
              <div className={styles.servicesCopy}>
                <SectionTitle id="cb-services">{labelCase(feature.title)}</SectionTitle>
                <SectionDescription className={styles.servicesLead}>
                  Bespoke branding and growth strategies that earn your audience&rsquo;s affinity, then turn it into
                  conversion and growth.
                </SectionDescription>
                <p className={styles.listLabel}>What you receive</p>
                <ol className={styles.deliverables}>
                  {DELIVERABLES.map((item, index) => (
                    <li key={item.title}>
                      <span className={styles.deliverableNumber}>{String(index + 1).padStart(2, "0")}</span>
                      <span className={styles.deliverableTitle}>{item.title}</span>
                      <span className={styles.deliverableDetail}>{item.detail}</span>
                    </li>
                  ))}
                </ol>
                {feature.cta ? (
                  <Link className={styles.dark} href={feature.cta.href}>
                    {labelCase(feature.cta.label)}
                    <ArrowIcon />
                  </Link>
                ) : null}
              </div>
            </div>

            {capabilities.length > 0 ? (
              <div className={styles.capabilities}>
                <p className={styles.capabilitiesLead}>Four disciplines, one consistent brand.</p>
                <div className={styles.capabilityGrid}>
                  {capabilities.map((service, index) => (
                    <Reveal
                      key={service.title}
                      as="article"
                      delay={(index % 2) * 120}
                      className={styles.capability}
                    >
                      <div className={styles.capabilityFrame}>
                        <Image
                          src={service.image!.src}
                          alt={`${service.title} example`}
                          fill
                          sizes="(min-width: 980px) 25vw, (min-width: 560px) 50vw, 100vw"
                          className={styles.capabilityImage}
                        />
                      </div>
                      <h3 className={styles.capabilityTitle}>{labelCase(service.title)}</h3>
                      <ul className={styles.capabilityItems}>
                        {service.items.map((item) => (
                          <li key={item}>{labelCase(item)}</li>
                        ))}
                      </ul>
                    </Reveal>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {promoBand ? (
        <section className={styles.statement} aria-labelledby="cb-rebrands">
          <div className={`container ${styles.statementGrid}`}>
            <h2 id="cb-rebrands" className={styles.statementLabel}>
              {labelCase(promoBand.title)}
            </h2>
            <div>
              <p className={styles.statementText}>
                We build brands that look sharp, sound consistent, and perform across every channel.
              </p>
              <p className={styles.statementBody}>
                From visual identity and messaging to content direction and campaign creative, we create brand assets
                and guidelines your team can actually use, then turn that foundation into marketing that builds
                momentum.
              </p>
              {promoBand.cta ? (
                <Link className={styles.textLink} href={promoBand.cta.href}>
                  {labelCase(promoBand.cta.label)}
                  <ArrowIcon />
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {steps.length > 0 ? (
        <section className={styles.process} aria-labelledby="cb-process">
          <div className="container">
            <BrandProcess
              steps={steps}
              intro={
                <div className={styles.processHead}>
                  <SectionTitle id="cb-process" className={styles.onDark}>
                    Our process
                  </SectionTitle>
                  <SectionDescription className={styles.onDarkLead}>
                    Six stages that take a brand from research to rollout.
                  </SectionDescription>
                </div>
              }
            />
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
