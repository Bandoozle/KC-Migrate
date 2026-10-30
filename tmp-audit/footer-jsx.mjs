import fs from "node:fs";
const file = "src/components/layout/SiteFooter.tsx";
let s = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");

s = s.replace(
  /import \{\n  SITE_FOOTER_BACKGROUND,[\s\S]*?\} from "\.\/site-footer-data";/,
  `import { SITE_HEADER_LOGO } from "./site-header-data";
import {
  SITE_FOOTER_BRAND,
  SITE_FOOTER_COMPANY,
  SITE_FOOTER_COPYRIGHT,
  SITE_FOOTER_NEWSLETTER,
  SITE_FOOTER_SERVICES,
  SITE_FOOTER_SOCIAL,
  SITE_FOOTER_UTILITY,
  type FooterColumn,
  type FooterLink,
} from "./site-footer-data";`,
);
s = s.replace(/width="24" height="24" viewBox="0 0 24 24"/g, 'width="18" height="18" viewBox="0 0 24 24"');

const at = s.indexOf("export function SiteFooter()");
if (at < 0) throw new Error("marker");
s =
  s.slice(0, at) +
  `function FooterColumnNav({ column }: { column: FooterColumn }) {
  return (
    <nav className={styles.col} aria-label={column.title}>
      <h2 className={styles.colTitle}>{column.title}</h2>
      <ul className={styles.linkList}>
        {column.links.map((link) => (
          <li key={link.label}>
            <FooterNavLink link={link} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brandLink} aria-label="Kosick Communications home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SITE_HEADER_LOGO.src}
                alt={SITE_HEADER_LOGO.alt}
                width={SITE_HEADER_LOGO.width}
                height={SITE_HEADER_LOGO.height}
                className={styles.logo}
                loading="lazy"
              />
            </Link>
            <p className={styles.brandBlurb}>{SITE_FOOTER_BRAND.blurb}</p>
          </div>

          <FooterColumnNav column={SITE_FOOTER_SERVICES} />
          <FooterColumnNav column={SITE_FOOTER_COMPANY} />

          <div className={\`\${styles.col} \${styles.newsletterCol}\`}>
            <h2 className={styles.colTitle}>{SITE_FOOTER_NEWSLETTER.title}</h2>
            <p className={styles.newsletterDesc}>{SITE_FOOTER_NEWSLETTER.description}</p>
            <SiteFooterNewsletter />
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            {SITE_FOOTER_COPYRIGHT.prefix} {year} {SITE_FOOTER_COPYRIGHT.owner}
          </p>
          <div className={styles.bottomEnd}>
            <ul className={styles.utilityList}>
              {SITE_FOOTER_UTILITY.map((link) => (
                <li key={link.label}>
                  <FooterNavLink link={link} />
                </li>
              ))}
            </ul>
            <ul className={styles.socialList}>
              {SITE_FOOTER_SOCIAL.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    className={styles.socialLink}
                    target="_blank"
                    rel="noopener nofollow"
                    aria-label={social.label}
                  >
                    {social.label === "Instagram" ? <InstagramIcon /> : <FacebookIcon />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
`;
fs.writeFileSync(file, s);
console.log("ok");
