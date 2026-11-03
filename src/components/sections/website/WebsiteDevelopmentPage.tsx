import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { PageTitle, SectionTitle } from "@/components/typography";
import { serviceHeroActions } from "@/lib/content/industry-heroes";
import { labelCase } from "@/lib/eyebrow";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import { Browser, RECORDINGS } from "./Browser";
import { CommerceJourney } from "./CommerceJourney";
import { LoopVideo } from "./LoopVideo";
import { ResponsiveStudio } from "./ResponsiveStudio";
import { WebsiteShowcase } from "./WebsiteShowcase";
import styles from "./WebsiteDevelopmentPage.module.css";

/*
 * Website Development & E-Commerce. The page is built from the materials of
 * the work itself: browser canvases, breakpoints, layout guides, selection
 * outlines, a sitemap. Every screen is a real client site; the two
 * recordings were captured on the live DirectBuy Furnace and Skinfolio sites.
 */

const UPLOADS = "/wp-content/uploads";

const SCREENS = {
  chilliwack: { src: `${UPLOADS}/2026/07/Chillwack-Golf-Club.jpg`, host: "chilliwackgolf.com" },
  padwood: { src: `${UPLOADS}/2023/09/construction-marketing.png`, host: "padwood.ca" },
  store: { src: `${UPLOADS}/2026/03/website-development-e-commerce.jpg`, alt: "A storefront website open on a laptop" },
  responsive: { src: `${UPLOADS}/2025/08/mobile-responsive-website-design.jpeg`, alt: "The Westmount Electrical site open on a tablet" },
};

const STORE = [
  { name: "Product experience", icon: "M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v5H4zM13 14h7v5h-7z" },
  { name: "Mobile shopping", icon: "M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2" },
  { name: "Checkout", icon: "M3 7h18v10H3zM3 11h18M7 15h3" },
  { name: "Integrations", icon: "M9 4v4M15 4v4M7 8h10v4a5 5 0 0 1-10 0zM12 17v3" },
];

const PERFORMANCE = [
  { name: "Page speed", line: "Monitored and tuned so pages load quickly." },
  { name: "Accessibility", line: "Readable, navigable pages for every visitor." },
  { name: "Responsive performance", line: "The same experience on phone, tablet and desktop." },
  { name: "Technical SEO", line: "Clean structure search engines can read." },
  { name: "Maintenance", line: "Updates, security and regular backups." },
];

/* Grouped from the Full-Service Website Development list, as pages of one site */
const CAPABILITIES = [
  { path: "/design", name: "Design & UX", line: "UX design and content management systems.", icon: "M4 5h16v14H4zM4 9h16M9 9v10" },
  { path: "/development", name: "Development", line: "Custom WordPress and custom React.", icon: "M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" },
  { path: "/shop", name: "E-commerce", line: "Shopify, WooCommerce, payments and catalogues.", icon: "M5 7h14l-1.2 11H6.2zM9 7a3 3 0 0 1 6 0" },
  { path: "/seo", name: "SEO", line: "Search-optimized from the first build.", icon: "M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13ZM15.5 15.5 20 20" },
  { path: "/hosting", name: "Hosting & maintenance", line: "Domains, hosting, security, backup and restoration.", icon: "M4 5h16v6H4zM4 13h16v6H4zM8 8h.01M8 16h.01" },
  { path: "/analytics", name: "Analytics", line: "Website analytics and reporting.", icon: "M4 20V10M10 20V4M16 20v-7M22 20H2" },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Icon({ d, size = 20 }: { d: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

/** Line breaks in hero copy ("Website Development\n& E-Commerce") become <br>s */
function lines(text: string) {
  return text.split("\n").map((line, index) => (
    <Fragment key={line}>
      {index > 0 ? <br /> : null}
      {line}
    </Fragment>
  ));
}

type WebsiteDevelopmentPageProps = {
  content: ServicePageContent;
};

export function WebsiteDevelopmentPage({ content }: WebsiteDevelopmentPageProps) {
  const { hero, faqs, cta, mediaCardSection } = content;
  const contactHref = cta?.primary.href || "/contact/";
  const actions = serviceHeroActions(contactHref);
  const primary = hero.cta === undefined ? actions.cta : hero.cta;
  const secondary = hero.secondaryCta === undefined ? actions.secondaryCta : hero.secondaryCta;

  return (
    <main className={styles.page}>
      {/* Hero: the headline on a layout canvas, with live client sites stacked like open windows */}
      <header className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.guides} aria-hidden="true">
            {Array.from({ length: 12 }, (_, index) => (
              <i key={index} />
            ))}
          </div>

          <div className={styles.heroCopy}>
            {hero.eyebrow ? <p className={styles.heroEyebrow}>{hero.eyebrow}</p> : null}
            <PageTitle className={styles.heroTitle}>
              {hero.displayTitle ? <span className={styles.heroMuted}>{hero.displayTitle} </span> : null}
              {lines(hero.titleSecondary || content.title)}
            </PageTitle>
            {hero.subtitle ? <p className={styles.heroLead}>{hero.subtitle}</p> : null}
            <div className={styles.heroActions}>
              {primary ? (
                <Link className={styles.primary} href={primary.href}>
                  {primary.label}
                  <ArrowIcon />
                </Link>
              ) : null}
              {secondary ? (
                <a className={styles.secondary} href={secondary.href}>
                  {secondary.label}
                </a>
              ) : null}
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroRuler} aria-hidden="true">
              {[390, 768, 1024, 1440].map((mark) => (
                <span key={mark} style={{ left: `${(mark / 1440) * 100}%` }}>
                  {mark}
                </span>
              ))}
            </div>
            <div className={styles.heroBack} aria-hidden="true">
              <Browser host={SCREENS.chilliwack.host}>
                <Image src={SCREENS.chilliwack.src} alt="" fill sizes="30vw" className={styles.cover} />
              </Browser>
            </div>
            <div className={styles.heroMid} aria-hidden="true">
              <Browser host={SCREENS.padwood.host}>
                <Image src={SCREENS.padwood.src} alt="" fill sizes="30vw" className={styles.cover} />
              </Browser>
            </div>
            <div className={styles.heroFront}>
              <Browser host={RECORDINGS.directbuy.host} ratio={RECORDINGS.directbuy.ratio}>
                <LoopVideo recording="directbuy" />
              </Browser>
              {/* Design-tool selection around the live page */}
              <span className={styles.selection} aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <span className={styles.sizeTag}>Desktop · 1440</span>
              </span>
              <svg className={styles.cursor} viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" focusable="false">
                <path d="M5 3l14 7.5-6.2 1.6L10 18.5z" fill="#111318" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {mediaCardSection ? <WebsiteShowcase section={mediaCardSection} /> : null}

      {/* Design → Build → Convert: one layout, resized live across breakpoints */}
      <section className={styles.responsive} aria-labelledby="wd-build">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className={styles.label}>Website design &amp; development</p>
            <SectionTitle id="wd-build" className={styles.title}>
              Optimize your web presence.
            </SectionTitle>
            <p className={styles.lead}>
              Fast, secure WordPress and e-commerce sites that look sharp, load quickly and turn visitors into
              customers, from first concept to launch and support.
            </p>
          </div>
          <ResponsiveStudio />
        </div>
      </section>

      {/* E-commerce: one real store, followed from the home page to the buy button */}
      <section className={styles.commerce} aria-labelledby="wd-commerce">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className={styles.label}>Shopify &amp; WooCommerce</p>
            <SectionTitle id="wd-commerce" className={`${styles.title} ${styles.statement}`}>
              E-commerce built to convert.
            </SectionTitle>
            <p className={styles.lead}>
              Scalable, secure stores where products, inventory and payments are easy to manage, and checkout is easy
              to finish.
            </p>
          </div>

          <CommerceJourney />

          <div className={styles.commerceBelow}>
            <Reveal variant="fade" className={styles.storePhoto}>
              <div className={styles.photo}>
                <Image src={SCREENS.store.src} alt={SCREENS.store.alt} fill sizes="(min-width: 960px) 50vw, 100vw" className={styles.cover} />
              </div>
            </Reveal>

            <Reveal delay={120} className={styles.cartWrap}>
              <aside className={styles.cart} aria-labelledby="wd-cart">
                <p id="wd-cart" className={styles.cartHead}>
                  <Icon d="M5 7h14l-1.2 11H6.2zM9 7a3 3 0 0 1 6 0" />
                  Your store build
                  <span>{STORE.length} items</span>
                </p>
                <ul className={styles.cartItems}>
                  {STORE.map((item) => (
                    <li key={item.name}>
                      <span className={styles.cartThumb}>
                        <Icon d={item.icon} />
                      </span>
                      <span className={styles.cartName}>{item.name}</span>
                      <span className={styles.cartIncluded}>Included</span>
                    </li>
                  ))}
                </ul>
                <Link className={styles.checkout} href={contactHref}>
                  Launch your store
                  <ArrowIcon />
                </Link>
                <p className={styles.cartNote}>Shopify · WooCommerce</p>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Performance: the device photograph under an inspector, beside the site-health checks */}
      <section className={styles.performance} aria-labelledby="wd-performance">
        <div className={styles.perfGrid}>
          <Reveal variant="fade" className={styles.perfMedia}>
            <div className={styles.perfPhoto}>
              <Image src={SCREENS.responsive.src} alt={SCREENS.responsive.alt} fill sizes="(min-width: 960px) 55vw, 100vw" className={styles.cover} />
              <span className={styles.inspect} aria-hidden="true">
                <span className={styles.inspectTag}>
                  <b>main.site</b> tablet · responsive
                </span>
              </span>
            </div>
          </Reveal>

          <div className={styles.perfCopy}>
            <p className={styles.label}>Website management</p>
            <SectionTitle id="wd-performance" className={styles.title}>
              Fast sites perform better.
            </SectionTitle>
            <p className={styles.lead}>
              A site needs more than launch day. We monitor speed and technical performance, then fine-tune and
              maintain it so small issues never reach your customers.
            </p>
            <div className={styles.health}>
              <p className={styles.healthHead}>
                Site health
                <span>after launch</span>
              </p>
              <ul className={styles.healthList}>
                {PERFORMANCE.map((item) => (
                  <li key={item.name}>
                    <span className={styles.tick} aria-hidden="true">
                      <svg viewBox="0 0 16 16" width="12" height="12" focusable="false">
                        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m3.5 8.5 3 3 6-7" />
                      </svg>
                    </span>
                    <span className={styles.healthName}>{item.name}</span>
                    <span className={styles.healthLine}>{item.line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities: everything included, laid out as the sitemap of one site */}
      <section className={styles.capabilities} aria-labelledby="wd-capabilities">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className={styles.label}>What&rsquo;s included</p>
            <SectionTitle id="wd-capabilities" className={styles.title}>
              Full-service website development.
            </SectionTitle>
            <p className={styles.lead}>
              Everything you need to plan, design, build and grow a high-performing website, all in one place.
            </p>
          </div>

          <div className={styles.sitemap}>
            <p className={styles.root}>
              <span className={styles.rootDot} aria-hidden="true" />
              yoursite.com
              <span className={styles.rootPath}>/</span>
            </p>
            <ol className={styles.nodes}>
              {CAPABILITIES.map((item, index) => (
                <Reveal key={item.name} as="li" delay={index * 70} className={styles.nodeItem}>
                  <div className={styles.node}>
                    <span className={styles.nodeBar} aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <span>{item.path}</span>
                    </span>
                    <span className={styles.nodeIcon}>
                      <Icon d={item.icon} size={22} />
                    </span>
                    <span className={styles.nodeName}>{item.name}</span>
                    <span className={styles.nodeLine}>{item.line}</span>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {faqs && faqs.items.length > 0 ? <FaqAccordion eyebrow="" title={labelCase(faqs.title)} items={faqs.items} /> : null}

      {cta ? <PageCta cta={cta} /> : null}
    </main>
  );
}
