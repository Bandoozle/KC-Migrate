"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  SITE_HEADER_CTA,
  SITE_HEADER_LOGO,
  SITE_HEADER_MOBILE_CTA,
  SITE_HEADER_MOBILE_LINKS,
  SITE_HEADER_NAV,
  SITE_HEADER_PHONE,
  SITE_HEADER_SOCIAL,
  type NavItem,
  type NavLink,
} from "./site-header-data";
import styles from "./SiteHeader.module.css";

const DROPDOWN_CLOSE_MS = 200;

type SiteHeaderProps = {
  /**
   * When true, header starts transparent (homepage-over-hero behavior)
   * and becomes solid on scroll, hover, or open menu.
   * Migrated pages without an underlaid hero should leave this false.
   */
  transparent?: boolean;
};

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" width="22" height="22" fill="currentColor">
      <path d="M31.997 15.999c0-8.836-7.163-15.999-15.999-15.999s-15.999 7.163-15.999 15.999c0 7.985 5.851 14.604 13.499 15.804v-11.18h-4.062v-4.625h4.062v-3.525c0-4.010 2.389-6.225 6.043-6.225 1.75 0 3.581 0.313 3.581 0.313v3.937h-2.017c-1.987 0-2.607 1.233-2.607 2.498v3.001h4.437l-0.709 4.625h-3.728v11.18c7.649-1.2 13.499-7.819 13.499-15.804z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" width="22" height="22" fill="currentColor">
      <path d="M21.138 0.242c3.767 0.007 3.914 0.038 4.65 0.144 1.52 0.219 2.795 0.825 3.837 1.821 0.584 0.562 0.987 1.112 1.349 1.848 0.442 0.899 0.659 1.75 0.758 3.016 0.021 0.271 0.031 4.592 0.031 8.916s-0.009 8.652-0.030 8.924c-0.098 1.245-0.315 2.104-0.743 2.986-0.851 1.755-2.415 3.035-4.303 3.522-0.685 0.177-1.304 0.26-2.371 0.31-0.381 0.019-4.361 0.024-8.342 0.024s-7.959-0.012-8.349-0.029c-0.921-0.044-1.639-0.136-2.288-0.303-1.876-0.485-3.469-1.784-4.303-3.515-0.436-0.904-0.642-1.731-0.751-3.045-0.031-0.373-0.039-2.296-0.039-8.87 0-2.215-0.002-3.866 0-5.121 0.006-3.764 0.037-3.915 0.144-4.652 0.219-1.518 0.825-2.795 1.825-3.833 0.549-0.569 1.105-0.975 1.811-1.326 0.915-0.456 1.756-0.668 3.106-0.781 0.374-0.031 2.298-0.038 8.878-0.038h5.13zM15.999 4.364c-3.159 0-3.555 0.014-4.796 0.070-1.239 0.057-2.084 0.253-2.824 0.541-0.765 0.297-1.415 0.695-2.061 1.342s-1.045 1.296-1.343 2.061c-0.288 0.74-0.485 1.586-0.541 2.824-0.056 1.241-0.070 1.638-0.070 4.798s0.014 3.556 0.070 4.797c0.057 1.239 0.253 2.084 0.541 2.824 0.297 0.765 0.695 1.415 1.342 2.061s1.296 1.046 2.061 1.343c0.74 0.288 1.586 0.484 2.825 0.541 1.241 0.056 1.638 0.070 4.798 0.070s3.556-0.014 4.797-0.070c1.239-0.057 2.085-0.253 2.826-0.541 0.765-0.297 1.413-0.696 2.060-1.343s1.045-1.296 1.343-2.061c0.286-0.74 0.482-1.586 0.541-2.824 0.056-1.241 0.070-1.637 0.070-4.797s-0.015-3.557-0.070-4.798c-0.058-1.239-0.255-2.084-0.541-2.824-0.298-0.765-0.696-1.415-1.343-2.061s-1.295-1.045-2.061-1.342c-0.742-0.288-1.588-0.484-2.827-0.541-1.241-0.056-1.636-0.070-4.796-0.070zM16.001 10.024c-3.3 0-5.976 2.676-5.976 5.976s2.676 5.975 5.976 5.975c3.3 0 5.975-2.674 5.975-5.975s-2.675-5.976-5.975-5.976zM16.001 12.121c2.142 0 3.879 1.736 3.879 3.879s-1.737 3.879-3.879 3.879c-2.142 0-3.879-1.737-3.879-3.879s1.736-3.879 3.879-3.879zM22.212 8.393c-0.771 0-1.396 0.625-1.396 1.396s0.625 1.396 1.396 1.396 1.396-0.625 1.396-1.396c0-0.771-0.625-1.396-1.396-1.396z" />
    </svg>
  );
}

function MenuDotsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
      <path d="M6 3c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM6 8c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM6 13c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2z" />
    </svg>
  );
}

function FooterLink({ link, className, onNavigate }: { link: NavLink; className: string; onNavigate?: () => void }) {
  return (
    <Link href={link.href} className={className} onClick={onNavigate}>
      <span>{link.label}</span>
      <span aria-hidden="true">→</span>
    </Link>
  );
}

function DesktopNavItem({
  item,
  open,
  onOpen,
  onClose,
  onToggle,
}: {
  item: NavItem;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}) {
  const closeTimer = useRef<number | null>(null);
  const panelId = useId();

  const clearClose = () => {
    if (closeTimer.current != null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearClose();
    closeTimer.current = window.setTimeout(() => {
      onClose();
    }, DROPDOWN_CLOSE_MS);
  };

  useEffect(() => () => clearClose(), []);

  if (item.type === "link") {
    return (
      <li className={styles.navItem}>
        <Link href={item.href} className={styles.navLink}>
          {item.label}
        </Link>
      </li>
    );
  }

  const trigger = (
    <button
      type="button"
      className={styles.navLink}
      aria-expanded={open}
      aria-haspopup={item.type === "mega" ? "dialog" : "menu"}
      aria-controls={panelId}
      onClick={onToggle}
    >
      {item.label}
    </button>
  );

  return (
    <li
      className={[
        styles.navItem,
        styles.hasChildren,
        item.type === "mega" ? styles.hasMega : "",
        open ? styles.navItemOpen : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onMouseEnter={() => {
        clearClose();
        onOpen();
      }}
      onMouseLeave={scheduleClose}
      onFocusCapture={() => {
        clearClose();
        onOpen();
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          scheduleClose();
        }
      }}
    >
      {trigger}

      {item.type === "menu" ? (
        <div
          id={panelId}
          className={styles.dropdown}
          role="menu"
          hidden={!open}
        >
          <ul className={styles.dropdownList}>
            {item.viewAll ? (
              <li role="none">
                <FooterLink link={item.viewAll} className={styles.dropdownFooter} />
              </li>
            ) : null}
            {item.items.map((child) => (
              <li key={child.href + child.label} role="none">
                <Link href={child.href} className={styles.dropdownLink} role="menuitem">
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div
          id={panelId}
          className={styles.megaPanel}
          role="region"
          aria-label={`${item.label} menu`}
          hidden={!open}
        >
          <div className={styles.megaInner}>
            <div className={styles.megaColumns}>
              {item.groups.map((group) => (
                <div key={group.title} className={styles.megaGroup}>
                  <p className={styles.megaGroupTitle}>{group.title}</p>
                  <ul className={styles.megaGroupList}>
                    {group.items.map((child) => (
                      <li key={child.href + child.label}>
                        <Link href={child.href} className={styles.megaLink}>
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {item.footer ? (
              <div className={styles.megaFooter}>
                <FooterLink link={item.footer} className={styles.megaFooterLink} />
              </div>
            ) : null}
          </div>
        </div>
      )}
    </li>
  );
}

function MobileNavSection({
  item,
  expanded,
  onToggle,
  onNavigate,
  groupExpanded,
  onToggleGroup,
}: {
  item: NavItem;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  groupExpanded: Record<string, boolean>;
  onToggleGroup: (key: string) => void;
}) {
  if (item.type === "link") {
    return (
      <li>
        <Link href={item.href} onClick={onNavigate}>
          {item.label}
        </Link>
      </li>
    );
  }

  if (item.type === "menu") {
    return (
      <li className={styles.mobileItem}>
        <div className={styles.mobileRow}>
          <span>{item.label}</span>
          <button
            type="button"
            className={styles.mobileToggle}
            aria-expanded={expanded}
            aria-label={`Toggle ${item.label} submenu`}
            onClick={onToggle}
          >
            <span className={expanded ? styles.chevronOpen : styles.chevron} />
          </button>
        </div>
        {expanded ? (
          <ul className={styles.mobileSublist}>
            {item.items.map((child) => (
              <li key={child.href + child.label}>
                <Link href={child.href} onClick={onNavigate}>
                  {child.label}
                </Link>
              </li>
            ))}
            {item.viewAll ? (
              <li>
                <Link href={item.viewAll.href} className={styles.mobileFooterLink} onClick={onNavigate}>
                  {item.viewAll.label} →
                </Link>
              </li>
            ) : null}
          </ul>
        ) : null}
      </li>
    );
  }

  return (
    <li className={styles.mobileItem}>
      <div className={styles.mobileRow}>
        <span>{item.label}</span>
        <button
          type="button"
          className={styles.mobileToggle}
          aria-expanded={expanded}
          aria-label={`Toggle ${item.label} submenu`}
          onClick={onToggle}
        >
          <span className={expanded ? styles.chevronOpen : styles.chevron} />
        </button>
      </div>
      {expanded ? (
        <ul className={styles.mobileSublist}>
          {item.groups.map((group) => {
            const groupKey = `${item.label}::${group.title}`;
            const open = Boolean(groupExpanded[groupKey]);
            return (
              <li key={group.title} className={styles.mobileGroup}>
                <div className={styles.mobileGroupRow}>
                  <span className={styles.mobileGroupTitle}>{group.title}</span>
                  <button
                    type="button"
                    className={styles.mobileToggle}
                    aria-expanded={open}
                    aria-label={`Toggle ${group.title}`}
                    onClick={() => onToggleGroup(groupKey)}
                  >
                    <span className={open ? styles.chevronOpen : styles.chevron} />
                  </button>
                </div>
                {open ? (
                  <ul className={styles.mobileNestedList}>
                    {group.items.map((child) => (
                      <li key={child.href + child.label}>
                        <Link href={child.href} onClick={onNavigate}>
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
          {item.footer ? (
            <li>
              <Link href={item.footer.href} className={styles.mobileFooterLink} onClick={onNavigate}>
                {item.footer.label} →
              </Link>
            </li>
          ) : null}
        </ul>
      ) : null}
    </li>
  );
}

export function SiteHeader({ transparent = false }: SiteHeaderProps) {
  const drawerId = useId();
  const [scrolled, setScrolled] = useState(false);
  const [openNavIndex, setOpenNavIndex] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const [mobileGroupExpanded, setMobileGroupExpanded] = useState<Record<string, boolean>>({});
  const [headerHovered, setHeaderHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen && openNavIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (drawerOpen) setDrawerOpen(false);
      if (openNavIndex !== null) setOpenNavIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, openNavIndex]);

  const megaOpen = openNavIndex !== null;
  const solid =
    !transparent || scrolled || headerHovered || megaOpen || drawerOpen;

  const toggleMobileSection = (label: string) => {
    setMobileExpanded((current) => ({ ...current, [label]: !current[label] }));
  };

  const toggleMobileGroup = (key: string) => {
    setMobileGroupExpanded((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <>
      {megaOpen ? (
        <div className={styles.megaDim} aria-hidden="true" onClick={() => setOpenNavIndex(null)} />
      ) : null}

      <header
        className={[styles.header, solid ? styles.solid : styles.transparent].join(" ")}
        onMouseEnter={() => setHeaderHovered(true)}
        onMouseLeave={() => setHeaderHovered(false)}
      >
        <div className={styles.inner}>
          <Link href="/" className={styles.brand} aria-label="Kosick Communications home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SITE_HEADER_LOGO.src}
              alt={SITE_HEADER_LOGO.alt}
              width={SITE_HEADER_LOGO.width}
              height={SITE_HEADER_LOGO.height}
              className={styles.logo}
            />
          </Link>

          <nav className={styles.nav} aria-label="Primary">
            <ul className={styles.navList}>
              {SITE_HEADER_NAV.map((item, index) => (
                <DesktopNavItem
                  key={item.label}
                  item={item}
                  open={openNavIndex === index}
                  onOpen={() => setOpenNavIndex(index)}
                  onClose={() =>
                    setOpenNavIndex((current) => (current === index ? null : current))
                  }
                  onToggle={() =>
                    setOpenNavIndex((current) => (current === index ? null : index))
                  }
                />
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <a className={styles.phone} href={SITE_HEADER_PHONE.href}>
              {SITE_HEADER_PHONE.label}
            </a>
            <Link href={SITE_HEADER_CTA.href} className={styles.cta}>
              {SITE_HEADER_CTA.label}
            </Link>
          </div>

          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={drawerOpen}
            aria-controls={drawerId}
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuDotsIcon />
          </button>
        </div>
      </header>

      <div
        className={[styles.drawerRoot, drawerOpen ? styles.drawerOpen : ""].filter(Boolean).join(" ")}
        aria-hidden={!drawerOpen}
      >
        <button
          type="button"
          className={styles.drawerOverlay}
          aria-label="Close menu"
          tabIndex={drawerOpen ? 0 : -1}
          onClick={() => setDrawerOpen(false)}
        />
        <div
          id={drawerId}
          className={styles.drawer}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className={styles.drawerHeader}>
            <button
              type="button"
              className={styles.drawerClose}
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
            >
              <span />
              <span />
            </button>
          </div>

          <div className={styles.drawerContent}>
            <div className={styles.drawerIntro}>
              {SITE_HEADER_MOBILE_LINKS.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setDrawerOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </div>

            <nav aria-label="Primary Mobile">
              <ul className={styles.mobileList}>
                {SITE_HEADER_NAV.map((item) => (
                  <MobileNavSection
                    key={item.label}
                    item={item}
                    expanded={Boolean(mobileExpanded[item.label])}
                    onToggle={() => toggleMobileSection(item.label)}
                    onNavigate={() => setDrawerOpen(false)}
                    groupExpanded={mobileGroupExpanded}
                    onToggleGroup={toggleMobileGroup}
                  />
                ))}
              </ul>
            </nav>

            <Link
              href={SITE_HEADER_MOBILE_CTA.href}
              className={styles.mobileCta}
              onClick={() => setDrawerOpen(false)}
            >
              {SITE_HEADER_MOBILE_CTA.label}
            </Link>

            <div className={styles.social}>
              {SITE_HEADER_SOCIAL.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={styles.socialLink}
                >
                  {social.label === "Facebook" ? <FacebookIcon /> : <InstagramIcon />}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
