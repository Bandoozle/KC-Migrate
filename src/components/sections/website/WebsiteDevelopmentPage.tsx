import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { SectionTitle } from "@/components/typography";
import { labelCase } from "@/lib/eyebrow";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import { WebsiteShowcase } from "./WebsiteShowcase";
import styles from "./WebsiteDevelopmentPage.module.css";

const UPLOADS = "/wp-content/uploads";

const SCREENS = {
  coolComfort: { src: `${UPLOADS}/2024/03/Screenshot-2024-03-07-at-10.07.14-AM-5.png`, alt: "Cool Comfort Solutions home page", host: "coolcomfortsolutions.ca" },
  honest: { src: `${UPLOADS}/2026/07/Honest-Cleaning-Website.jpg`, alt: "Honest Cleaning & Services home page", host: "honestcleaningandservices.com" },
  store: { src: `${UPLOADS}/2026/03/website-development-e-commerce.jpg`, alt: "A tools and parts storefront open on a laptop" },
  skinfolio: { src: `${UPLOADS}/2023/09/medical-aesthetics.png`, alt: "Skinfolio Medesthetics storefront", host: "skinfolio.com" },
  responsive: { src: `${UPLOADS}/2025/08/mobile-responsive-website-design.jpeg`, alt: "The Westmount Electrical site open on a tablet" },
};

const BUILD = [
  { name: "UX & responsive design", line: "Layouts planned for every screen before a line of code." },
  { name: "Development", line: "Custom WordPress and React builds your team can update." },
  { name: "Content & conversion", line: "Pages structured to answer questions and prompt the next step." },
];

const STORE = ["Product experience", "Mobile shopping", "Checkout", "Integrations"];

const PERFORMANCE = [
  { name: "Page speed", line: "Monitored and tuned so pages load quickly." },
  { name: "Accessibility", line: "Readable, navigable pages for every visitor." },
  { name: "Responsive performance", line: "The same experience on phone, tablet and desktop." },
  { name: "Technical SEO", line: "Clean structure search engines can read." },
  { name: "Maintenance", line: "Updates, security and regular backups." },
];

/* Grouped from the Full-Service Website Development list */
const CAPABILITIES = [
  { name: "Design & UX", line: "UX design and content management systems.", icon: "M4 5h16v14H4zM4 9h16M9 9v10" },
  { name: "Development", line: "Custom WordPress and custom React.", icon: "M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" },
  { name: "E-commerce", line: "Shopify, WooCommerce, payments and catalogues.", icon: "M5 7h14l-1.2 11H6.2zM9 7a3 3 0 0 1 6 0" },
  { name: "SEO", line: "Search-optimized from the first build.", icon: "M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13ZM15.5 15.5 20 20" },
  { name: "Hosting & maintenance", line: "Domains, hosting, security, backup and restoration.", icon: "M4 5h16v6H4zM4 13h16v6H4zM8 8h.01M8 16h.01" },
  { name: "Analytics", line: "Website analytics and reporting.", icon: "M4 20V10M10 20V4M16 20v-7M22 20H2" },
];

function Browser({ src, alt, host, sizes, className }: { src: string; alt: string; host: string; sizes: string; className?: string }) {
  return (
    <div className={[styles.browser, className].filter(Boolean).join(" ")}>
      <div className={styles.chrome} aria-hidden="true">
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.address}>{host}</span>
      </div>
      <div className={styles.viewport}>
        <Image src={src} alt={alt} fill sizes={sizes} className={styles.shot} />
      </div>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

type WebsiteDevelopmentPageProps = {
  content: ServicePageContent;
};

export function WebsiteDevelopmentPage({ content }: WebsiteDevelopmentPageProps) {
  const { hero, faqs, cta, mediaCardSection } = content;
  const contactHref = cta?.primary.href || "/contact/";

  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={hero} />

      {mediaCardSection ? <WebsiteShowcase section={mediaCardSection} /> : null}

      {/* Design and development: wireframe to finished page, as one layered collage */}
      <section className={styles.build} aria-labelledby="wd-build">
        <div className="container">
          <div className={styles.buildHead}>
            <div>
              <p className={styles.label}>Website design &amp; development</p>
              <SectionTitle id="wd-build" className={styles.title}>
                Optimize your web presence.
              </SectionTitle>
            </div>
            <p className={styles.lead}>
              Fast, secure WordPress and e-commerce sites that look sharp, load quickly and turn visitors into
              customers, from first concept to launch and support.
            </p>
          </div>

          <div className={styles.collage}>
            <Reveal className={styles.wireframe}>
              <div className={styles.wireCard} aria-hidden="true">
                <span className={styles.wireLabel}>Wireframe</span>
                <span className={styles.wireNav} />
                <span className={styles.wireHero} />
                <span className={styles.wireRow}>
                  <i />
                  <i />
                  <i />
                </span>
                <span className={styles.wireLine} />
                <span className={`${styles.wireLine} ${styles.short}`} />
              </div>
            </Reveal>
            <Reveal variant="fade" delay={120} className={styles.collageMain}>
              <Browser {...SCREENS.coolComfort} sizes="(min-width: 960px) 60vw, 100vw" />
            </Reveal>
            <Reveal delay={240} className={styles.collageSecond}>
              <Browser {...SCREENS.honest} sizes="(min-width: 960px) 30vw, 70vw" />
            </Reveal>
          </div>

          <ol className={styles.pillars}>
            {BUILD.map((item, index) => (
              <li key={item.name}>
                <span className={styles.pillarNumber}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.pillarName}>{item.name}</span>
                <span className={styles.pillarLine}>{item.line}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* E-commerce: one dominant storefront, a product-row crop and a second store */}
      <section className={styles.commerce} aria-labelledby="wd-commerce">
        <div className="container">
          <div className={styles.commerceGrid}>
            <Reveal variant="fade" className={styles.storeMain}>
              <div className={styles.photo}>
                <Image src={SCREENS.store.src} alt={SCREENS.store.alt} fill sizes="(min-width: 960px) 60vw, 100vw" className={styles.cover} />
              </div>
            </Reveal>
            <div className={styles.commerceCopy}>
              <p className={styles.label}>Shopify &amp; WooCommerce</p>
              <SectionTitle id="wd-commerce" className={styles.title}>
                E-commerce built to convert.
              </SectionTitle>
              <p className={styles.lead}>
                Scalable, secure stores where products, inventory and payments are easy to manage, and checkout is
                easy to finish.
              </p>
              <ul className={styles.themes}>
                {STORE.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link className={styles.dark} href={contactHref}>
                Launch your store
                <ArrowIcon />
              </Link>
            </div>
            <Reveal delay={120} className={styles.storeCrop}>
              <div className={styles.crop} aria-hidden="true">
                <Image src={SCREENS.store.src} alt="" fill sizes="(min-width: 960px) 30vw, 50vw" className={styles.cover} />
              </div>
              <p className={styles.caption}>Product listings, built to browse.</p>
            </Reveal>
            <Reveal delay={240} className={styles.storeSecond}>
              <Browser {...SCREENS.skinfolio} sizes="(min-width: 960px) 30vw, 50vw" />
              <p className={styles.caption}>Skinfolio Medesthetics storefront.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Performance: dark, a responsive device photo beside the five foundations */}
      <section className={styles.performance} aria-labelledby="wd-performance">
        <div className="container">
          <div className={styles.perfHead}>
            <div>
              <p className={styles.labelOnDark}>Website management</p>
              <SectionTitle id="wd-performance" className={styles.titleOnDark}>
                Fast sites perform better.
              </SectionTitle>
            </div>
            <p className={styles.leadOnDark}>
              A site needs more than launch day. We monitor speed and technical performance, then fine-tune and
              maintain it so small issues never reach your customers.
            </p>
          </div>
          <div className={styles.perfGrid}>
            <Reveal variant="fade" className={styles.perfMedia}>
              <div className={`${styles.photo} ${styles.photoDark}`}>
                <Image src={SCREENS.responsive.src} alt={SCREENS.responsive.alt} fill sizes="(min-width: 960px) 55vw, 100vw" className={styles.cover} />
              </div>
            </Reveal>
            <ol className={styles.perfList}>
              {PERFORMANCE.map((item, index) => (
                <li key={item.name}>
                  <span className={styles.perfNumber}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.perfName}>{item.name}</span>
                  <span className={styles.perfLine}>{item.line}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Capabilities: an intro row, then six equal entries on one grid */}
      <section className={styles.capabilities} aria-labelledby="wd-capabilities">
        <div className="container">
          <div className={styles.capHead}>
            <div>
              <p className={styles.label}>What&rsquo;s included</p>
              <SectionTitle id="wd-capabilities" className={styles.title}>
                Full-service website development.
              </SectionTitle>
            </div>
            <p className={styles.lead}>
              Everything you need to plan, design, build and grow a high-performing website, all in one place.
            </p>
          </div>
          <ol className={styles.index}>
            {CAPABILITIES.map((item, index) => (
              <li key={item.name} className={styles.card}>
                <span className={styles.cardTop}>
                  <span className={styles.cardIcon}>
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
                      <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  </span>
                  <span className={styles.indexNumber}>{String(index + 1).padStart(2, "0")}</span>
                </span>
                <span className={styles.indexName}>{item.name}</span>
                <span className={styles.indexLine}>{item.line}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {faqs && faqs.items.length > 0 ? (
        <FaqAccordion eyebrow="" title={labelCase(faqs.title)} items={faqs.items} />
      ) : null}

      {cta ? <PageCta cta={cta} /> : null}
    </main>
  );
}
