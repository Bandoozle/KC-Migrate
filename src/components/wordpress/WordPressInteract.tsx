"use client";

import { useEffect } from "react";
import { formatCountupValue, readCountupOptionsFromElement } from "@/lib/wordpress-countup";

function closest(target: EventTarget | null, selector: string): HTMLElement | null {
  if (!(target instanceof Element)) return null;
  return target.closest(selector);
}

function toggleDrawer(button: HTMLElement, nextState?: boolean) {
  const selector = button.getAttribute("data-toggle-target");
  if (!selector) return;
  const drawer = document.querySelector(selector);
  if (!drawer) return;

  const bodyClass = button.getAttribute("data-toggle-body-class");
  const expanded = button.getAttribute("aria-expanded") === "true";
  const next = nextState ?? !expanded;
  const scrollbarOffset = window.innerWidth - document.documentElement.clientWidth;

  document.querySelectorAll(`[data-toggle-target="${selector}"]`).forEach((item) => {
    item.setAttribute("aria-expanded", String(next));
  });

  if (next) {
    drawer.classList.add("show-drawer");
    requestAnimationFrame(() => drawer.classList.add("active"));
    drawer.classList.add("pop-animated");
    if (bodyClass) {
      document.body.classList.add(bodyClass);
      if (bodyClass.includes("showing-popup-drawer-")) {
        document.body.style.setProperty("--scrollbar-offset", `${scrollbarOffset}px`);
        document.body.classList.add("kadence-scrollbar-fixer");
      }
    }
    const focusSelector = button.getAttribute("data-set-focus");
    if (focusSelector) {
      document.querySelector<HTMLElement>(focusSelector)?.focus();
    }
    return;
  }

  drawer.classList.remove("active", "pop-animated", "show-drawer");
  if (bodyClass) {
    document.body.classList.remove(bodyClass);
    document.body.classList.remove("kadence-scrollbar-fixer");
  }
}

function setupMobileDrawer() {
  function onClick(event: Event) {
    const toggle = closest(event.target, ".drawer-toggle, .drawer-sub-toggle");
    if (toggle) {
      event.preventDefault();
      toggleDrawer(toggle);
      return;
    }

    const overlay = closest(event.target, ".drawer-overlay");
    if (!overlay) return;
    const selector = overlay.getAttribute("data-drawer-target-string");
    const openDrawer = overlay.closest(".show-drawer");
    if (!selector || !openDrawer) return;
    event.preventDefault();
    const button = document.querySelector<HTMLElement>(`[data-toggle-target="${selector}"]`);
    if (button) toggleDrawer(button, false);
  }

  function onKey(event: KeyboardEvent) {
    if (event.key !== "Escape") return;
    const open = document.querySelector(".popup-drawer.show-drawer");
    if (!open) return;
    const button = open.querySelector<HTMLElement>(".menu-toggle-close, .drawer-toggle");
    if (button) toggleDrawer(button, false);
  }

  document.addEventListener("click", onClick);
  document.addEventListener("keydown", onKey);
  return () => {
    document.removeEventListener("click", onClick);
    document.removeEventListener("keydown", onKey);
    document.querySelectorAll(".popup-drawer.show-drawer").forEach((drawer) => {
      drawer.classList.remove("active", "pop-animated", "show-drawer");
    });
    document.querySelectorAll<HTMLElement>(".drawer-toggle[aria-expanded='true']").forEach((button) => {
      button.setAttribute("aria-expanded", "false");
    });
    document.body.classList.remove(
      "kadence-scrollbar-fixer",
      "showing-popup-drawer-from-left",
      "showing-popup-drawer-from-right",
      "showing-popup-drawer-from-top",
      "showing-popup-drawer-from-bottom",
    );
    document.body.style.removeProperty("--scrollbar-offset");
  };
}

function getInitialActiveTab(wrap: HTMLElement): string {
  const fromClass = wrap.className.match(/\bkt-active-tab-(\d+)/)?.[1];
  if (fromClass) return fromClass;
  const activeLink = wrap.querySelector<HTMLElement>(
    ":scope > .kt-tabs-title-list > .kt-tab-title-active [data-tab], :scope > .kt-tabs-title-list > .kt-title-item.kt-tab-title-active [data-tab]",
  );
  return activeLink?.getAttribute("data-tab") || "1";
}

function setupTabs(root: ParentNode) {
  const wraps = [...root.querySelectorAll<HTMLElement>(".kt-tabs-wrap")];

  function setActiveTab(wrap: HTMLElement, tab: string) {
    if (/\bkt-active-tab-\S+/.test(wrap.className)) {
      wrap.className = wrap.className.replace(/\bkt-active-tab-\S+/g, `kt-active-tab-${tab}`);
    } else {
      wrap.classList.add(`kt-active-tab-${tab}`);
    }

    wrap.querySelectorAll(":scope > .kt-tabs-title-list > li").forEach((item) => {
      const link = item.querySelector("a");
      const isActive = item.classList.contains(`kt-title-item-${tab}`);
      item.classList.toggle("kt-tab-title-active", isActive);
      item.classList.toggle("kt-tab-title-inactive", !isActive);
      link?.setAttribute("role", "tab");
      link?.setAttribute("aria-selected", String(isActive));
      link?.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    wrap.querySelectorAll<HTMLElement>(":scope > .kt-tabs-content-wrap > .kt-tabs-accordion-title").forEach((item) => {
      const tabId =
        [...item.classList].find((name) => name.startsWith("kt-title-item-"))?.slice("kt-title-item-".length) ||
        item.querySelector("[data-tab]")?.getAttribute("data-tab");
      const isActive = tabId === tab;
      item.classList.toggle("kt-tab-title-active", isActive);
      item.classList.toggle("kt-tab-title-inactive", !isActive);
    });

    wrap.querySelectorAll<HTMLElement>(
      ":scope > .kt-tabs-content-wrap > .kt-tab-inner-content, :scope > .kt-tabs-content-wrap > .wp-block-kadence-tab",
    ).forEach((panel) => {
      const isActive = panel.classList.contains(`kt-inner-tab-${tab}`);
      panel.setAttribute("role", "tabpanel");
      panel.style.setProperty("display", isActive ? "block" : "none", "important");
      panel.setAttribute("aria-hidden", String(!isActive));
    });
  }

  function onClick(event: Event) {
    const link = closest(event.target, ".kt-tabs-title-list a, .kt-tabs-accordion-title a");
    if (!link) return;
    const wrap = link.closest<HTMLElement>(".kt-tabs-wrap");
    const tab = link.getAttribute("data-tab");
    if (!wrap || !tab) return;
    event.preventDefault();
    setActiveTab(wrap, tab);
  }

  wraps.forEach((wrap) => {
    wrap.addEventListener("click", onClick);
    const initial = getInitialActiveTab(wrap);
    setActiveTab(wrap, initial);
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const match = wrap.querySelector<HTMLElement>(`#${CSS.escape(hash)} a`);
    const tab = match?.getAttribute("data-tab");
    if (tab && tab !== initial) setActiveTab(wrap, tab);
  });

  return () => wraps.forEach((wrap) => wrap.removeEventListener("click", onClick));
}

function setupAccordions(root: ParentNode) {
  const buttons = root.querySelectorAll<HTMLElement>(
    ".kt-blocks-accordion-header, .wp-block-kadence-pane .kt-accordion-header-wrap",
  );

  function onClick(event: Event) {
    const header = closest(event.target, ".kt-blocks-accordion-header, .kt-accordion-header-wrap");
    if (!header) return;
    const pane = header.closest(".wp-block-kadence-pane, .kt-accordion-pane");
    if (!pane) return;
    pane.classList.toggle("kt-accordion-panel-active");
    pane.classList.toggle("kt-accordion-panel-hidden");
  }

  buttons.forEach((button) => button.addEventListener("click", onClick));
  return () => buttons.forEach((button) => button.removeEventListener("click", onClick));
}

function isDisplayed(element: HTMLElement): boolean {
  return element.getClientRects().length > 0;
}

function sectionMegaColumns(menu: HTMLElement) {
  const built: Array<{ submenu: HTMLElement; items: HTMLElement[] }> = [];

  menu.querySelectorAll<HTMLElement>(":scope > .menu-item-has-children > .sub-menu").forEach((submenu) => {
    if (submenu.dataset.kosickColumns === "true") return;
    const items = [...submenu.children].filter(
      (child): child is HTMLElement =>
        child instanceof HTMLElement && child.classList.contains("menu-item"),
    );
    if (items.length === 0) return;

    const columnCount =
      items.length <= 2 ? items.length : items.length <= 4 ? items.length : items.length <= 8 ? 3 : 4;
    const perColumn = Math.ceil(items.length / columnCount);

    const wrap = document.createElement("li");
    wrap.className = "kosick-mega-columns-wrap";
    wrap.setAttribute("role", "presentation");

    const grid = document.createElement("div");
    grid.className = "kosick-mega-columns";
    grid.style.setProperty("--kosick-mega-cols", String(columnCount));

    for (let index = 0; index < columnCount; index += 1) {
      const column = document.createElement("ul");
      column.className = "kosick-mega-column";
      for (const item of items.slice(index * perColumn, (index + 1) * perColumn)) {
        column.appendChild(item);
      }
      grid.appendChild(column);
    }

    wrap.appendChild(grid);
    submenu.replaceChildren(wrap);
    submenu.classList.add("kosick-mega-menu");
    submenu.dataset.kosickColumns = "true";
    built.push({ submenu, items });
  });

  return () => {
    for (const { submenu, items } of built) {
      submenu.replaceChildren(...items);
      submenu.classList.remove("kosick-mega-menu");
      delete submenu.dataset.kosickColumns;
    }
  };
}

function setupMegaMenu() {
  const found = document.querySelector<HTMLElement>(
    "#main-header .site-top-header-wrap .site-header-row-container-inner",
  );
  if (!found) return () => undefined;
  const headerCard: HTMLElement = found;

  const menu = document.querySelector<HTMLElement>("#primary-menu");
  const rightSection = document.querySelector<HTMLElement>(
    "#main-header .site-header-top-section-right",
  );
  const moved: HTMLElement[] = [];
  let utilityNav: HTMLElement | null = null;
  const teardownColumns = menu ? sectionMegaColumns(menu) : () => undefined;

  if (menu && rightSection) {
    const trailing = [...menu.children].filter(
      (item): item is HTMLElement =>
        item instanceof HTMLElement &&
        item.classList.contains("menu-item") &&
        !item.classList.contains("menu-item-has-children"),
    );

    if (trailing.length > 0) {
      utilityNav = document.createElement("nav");
      utilityNav.className = "kosick-header-utility-nav";
      utilityNav.setAttribute("aria-label", "Secondary");
      const list = document.createElement("ul");
      list.className = "menu";
      for (const item of trailing) {
        moved.push(item);
        list.appendChild(item);
      }
      utilityNav.appendChild(list);
      rightSection.insertBefore(utilityNav, rightSection.firstChild);
    }
  }

  let openItem: HTMLElement | null = null;
  let closeTimer = 0;

  function close() {
    openItem?.classList.remove("menu-item--toggled-on");
    headerCard.classList.remove("is-mega-open");
    document.body.classList.remove("kosick-mega-dim");
    openItem = null;
  }

  function open(item: HTMLElement) {
    window.clearTimeout(closeTimer);
    if (openItem === item) {
      headerCard.classList.add("is-mega-open");
      document.body.classList.add("kosick-mega-dim");
      return;
    }
    openItem?.classList.remove("menu-item--toggled-on");
    item.classList.add("menu-item--toggled-on");
    headerCard.classList.add("is-mega-open");
    document.body.classList.add("kosick-mega-dim");
    openItem = item;
  }

  function onOver(event: Event) {
    window.clearTimeout(closeTimer);
    const parent = closest(event.target, "#primary-menu > .menu-item-has-children");
    if (parent) open(parent);
  }

  function onLeave() {
    closeTimer = window.setTimeout(close, 200);
  }

  headerCard.addEventListener("mouseover", onOver);
  headerCard.addEventListener("mouseleave", onLeave);
  headerCard.addEventListener("focusin", onOver);
  headerCard.addEventListener("focusout", (event) => {
    const next = event.relatedTarget;
    if (next instanceof Node && headerCard.contains(next)) return;
    onLeave();
  });

  const button = document.querySelector<HTMLElement>("#main-header .header-button");
  if (button?.textContent) {
    const label = button.textContent.trim();
    button.textContent = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  }

  return () => {
    window.clearTimeout(closeTimer);
    headerCard.removeEventListener("mouseover", onOver);
    headerCard.removeEventListener("mouseleave", onLeave);
    teardownColumns();
    if (menu && moved.length > 0) {
      for (const item of moved) menu.appendChild(item);
    }
    utilityNav?.remove();
    close();
  };
}

function setupStickyHeader() {
  const headers = [...document.querySelectorAll<HTMLElement>(".kadence-sticky-header")];
  if (headers.length === 0) return () => undefined;

  const placeholders = new Map<HTMLElement, HTMLElement>();
  const transparent =
    document.body.classList.contains("transparent-header") ||
    document.body.classList.contains("mobile-transparent-header");

  function placeholderFor(header: HTMLElement): HTMLElement {
    const existing = placeholders.get(header);
    if (existing) return existing;

    const placeholder = document.createElement("div");
    placeholder.className = "kadence-sticky-placeholder";
    placeholder.setAttribute("aria-hidden", "true");
    header.after(placeholder);
    placeholders.set(header, placeholder);
    return placeholder;
  }

  function stick(header: HTMLElement) {
    header.classList.add("item-is-fixed", "item-is-stuck");
    header.classList.remove("item-at-start");
    header.style.top = "0px";
    if (transparent) return;
    const placeholder = placeholderFor(header);
    placeholder.style.height = `${header.offsetHeight}px`;
  }

  function unstick(header: HTMLElement) {
    header.classList.remove("item-is-fixed", "item-is-stuck");
    header.classList.add("item-at-start");
    header.style.top = "";
    const placeholder = placeholders.get(header);
    if (placeholder) placeholder.style.height = "0px";
  }

  function update() {
    const stuck = window.scrollY > 0;
    for (const header of headers) {
      if (!isDisplayed(header)) {
        unstick(header);
        continue;
      }
      if (stuck) stick(header);
      else unstick(header);
    }
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();

  return () => {
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
    placeholders.forEach((placeholder) => placeholder.remove());
    headers.forEach((header) => {
      header.classList.remove("item-is-fixed", "item-is-stuck", "item-at-start");
      header.style.top = "";
    });
  };
}

function setupScrollUp() {
  const button = document.getElementById("kt-scroll-up");
  const reader = document.getElementById("kt-scroll-up-reader");

  function onScroll() {
    if (!button) return;
    const visible = window.scrollY > 100;
    button.classList.toggle("scroll-visible", visible);
    button.setAttribute("aria-hidden", String(!visible));
  }

  function toTop(event: Event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  button?.addEventListener("click", toTop);
  reader?.addEventListener("click", toTop);

  return () => {
    window.removeEventListener("scroll", onScroll);
    button?.removeEventListener("click", toTop);
    reader?.removeEventListener("click", toTop);
  };
}

const BENTO_ITEMS = [
  {
    titlePrimary: "Digital",
    titleSecondary: "Advertising",
    description:
      "Performance-driven campaigns across Google Ads, Social Media, YouTube, and more — putting your business in front of ready-to-buy customers.",
    href: "/services/digital-marketing/",
    image:
      "https://staging.kosick.com/wp-content/uploads/2026/06/social-media-content-marketing-1-640x960.jpg",
    alt: "Digital advertising analytics dashboard",
  },
  {
    titlePrimary: "Television",
    titleSecondary: "& Broadcast",
    description:
      "Premium broadcast and streaming placements delivering high visibility and consistent reach to large, trusted audiences.",
    href: "/services/television-advertising/",
    image: "https://staging.kosick.com/wp-content/uploads/2026/06/tv-advertising-750x600.jpg",
    alt: "Television and broadcast advertising",
  },
  {
    titlePrimary: "Radio",
    titleSecondary: "& Streaming",
    description:
      "Scheduled ad spots and sponsorships across news, talk, and top music platforms on radio and audio streaming.",
    href: "/services/radio-advertising/",
    image:
      "https://staging.kosick.com/wp-content/uploads/2026/06/radio-streaming-advertising-750x750.jpg",
    alt: "Radio and streaming advertising",
  },
  {
    titlePrimary: "Out of",
    titleSecondary: "Home",
    description:
      "Billboards, transit shelters, bus wraps, and digital screens — reaching audiences as they commute, shop, and travel.",
    href: "/services/outdoor-advertising/",
    image: "https://staging.kosick.com/wp-content/uploads/2026/02/media-buying-750x499.jpg",
    alt: "Out of home advertising",
  },
  {
    titlePrimary: "Connected",
    titleSecondary: "TV",
    description:
      "Premium streaming apps and smart TVs — television impact with digital targeting across Crave, Sportsnet+, TSN+, and Tubi.",
    href: "/services/digital-connected-tv/",
    image:
      "https://staging.kosick.com/wp-content/uploads/2026/06/connected-tv-streaming-750x563.jpg",
    alt: "Connected TV advertising",
  },
  {
    titlePrimary: "Corporate",
    titleSecondary: "Branding",
    description:
      "Strategically defined brands that generate human emotion, meaningful connections, and increased marketshare.",
    href: "/services/corporate-branding/",
    image:
      "https://staging.kosick.com/wp-content/uploads/2025/08/home-services-lead-generation-1-750x750.webp",
    alt: "Corporate branding",
  },
] as const;

function buildBentoCard(
  item: (typeof BENTO_ITEMS)[number],
  index: number,
): HTMLAnchorElement {
  const card = document.createElement("a");
  card.className = `kosick-bento-card kosick-bento-card--${index + 1}${
    index === 0 ? " kosick-bento-card--feature" : " kosick-bento-card--side"
  }`;
  card.href = item.href;
  card.dataset.bentoIndex = String(index + 1);

  const img = document.createElement("img");
  img.className = "kosick-bento-card__image";
  img.src = item.image;
  img.alt = item.alt;
  img.loading = index === 0 ? "eager" : "lazy";
  img.decoding = "async";

  const overlay = document.createElement("span");
  overlay.className = "kosick-bento-card__overlay";
  overlay.setAttribute("aria-hidden", "true");

  const indexBadge = document.createElement("span");
  indexBadge.className = "kosick-bento-index";
  indexBadge.textContent = String(index + 1).padStart(2, "0");
  indexBadge.setAttribute("aria-hidden", "true");

  const content = document.createElement("div");
  content.className = "kosick-bento-card__content";

  const title = document.createElement("h3");
  title.className = "kosick-bento-card__title";
  title.innerHTML = `<span class="kosick-bento-card__title-primary">${item.titlePrimary}</span><span class="kosick-bento-card__title-secondary">${item.titleSecondary}</span>`;

  const description = document.createElement("p");
  description.className = "kosick-bento-card__description";
  description.textContent = item.description;

  content.append(title, description);
  card.append(img, overlay, indexBadge, content);

  const arrow = document.createElement("span");
  arrow.className = "kosick-bento-arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.innerHTML =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
  card.appendChild(arrow);

  return card;
}

function setupBentoGrid() {
  const rowOne = document.querySelector<HTMLElement>(".kb-row-layout-id4541_b383f3-e5");
  const rowTwo = document.querySelector<HTMLElement>(".kb-row-layout-id4541_d7b6dc-e3");
  if (!rowOne || !rowTwo || rowOne.dataset.kosickBento === "true") {
    return () => undefined;
  }

  const grid = document.createElement("div");
  grid.className = "kosick-bento-grid";
  grid.setAttribute("data-kosick-bento", "true");
  for (const [index, item] of BENTO_ITEMS.entries()) {
    grid.appendChild(buildBentoCard(item, index));
  }

  rowOne.dataset.kosickBento = "true";
  rowTwo.dataset.kosickBento = "true";
  rowOne.after(grid);
  rowOne.style.display = "none";
  rowTwo.style.display = "none";

  return () => {
    grid.remove();
    rowOne.style.display = "";
    rowTwo.style.display = "";
    delete rowOne.dataset.kosickBento;
    delete rowTwo.dataset.kosickBento;
  };
}

function setupWhatWeDoIntro() {
  const title = document.querySelector<HTMLElement>(".kt-adv-heading4541_39eadb-03");
  const subtitle = document.querySelector<HTMLElement>(".kt-adv-heading4541_f35171-26");
  const description = document.querySelector<HTMLElement>(".kt-adv-heading4541_72c33d-12");
  if (!subtitle || !description || description.dataset.kosickWhatWeDo === "true") {
    return () => undefined;
  }

  const previousParent = description.parentElement;
  const previousNext = description.nextSibling;

  description.dataset.kosickWhatWeDo = "true";
  description.classList.add(
    "kosick-what-we-do-description",
    "kosick-section-description",
    "section-description",
  );
  subtitle.classList.add("kosick-section-title", "section-title");
  subtitle.after(description);

  if (title) {
    title.setAttribute("hidden", "");
    title.setAttribute("aria-hidden", "true");
  }

  // Remove empty lovable preview link from the tagline
  subtitle.querySelectorAll("a[href*='lovable.app']").forEach((link) => link.remove());
  subtitle.innerHTML = subtitle.innerHTML.replace(/<br\s*\/?>/gi, "").trim();

  return () => {
    description.classList.remove("kosick-what-we-do-description");
    delete description.dataset.kosickWhatWeDo;
    if (title) {
      title.removeAttribute("hidden");
      title.removeAttribute("aria-hidden");
    }
    if (previousParent) {
      previousParent.insertBefore(description, previousNext);
    }
  };
}

const SOLUTION_ITEMS = [
  {
    title: "Digital Marketing + Social",
    description: "Performance campaigns across search, social, and YouTube that put your brand in front of ready-to-buy customers.",
    href: "/services/digital-marketing/",
    image:
      "https://staging.kosick.com/wp-content/uploads/2026/06/social-media-content-marketing-1-640x960.jpg",
    alt: "Digital marketing and social media",
  },
  {
    title: "Targeted Media",
    description: "Precision media buying across TV, digital, and out-of-home to reach the audiences that matter most.",
    href: "/services/television-advertising/",
    image: "https://staging.kosick.com/wp-content/uploads/2026/06/tv-advertising-750x600.jpg",
    alt: "Targeted media planning",
  },
  {
    title: "Branding",
    description: "Brand systems that create recognition, emotion, and lasting preference across every touchpoint.",
    href: "/services/corporate-branding/",
    image:
      "https://staging.kosick.com/wp-content/uploads/2025/08/home-services-lead-generation-1-750x750.webp",
    alt: "Corporate branding",
  },
  {
    title: "Connected TV",
    description: "Streaming inventory with television impact and digital targeting across premium CTV platforms.",
    href: "/services/digital-connected-tv/",
    image:
      "https://staging.kosick.com/wp-content/uploads/2026/06/connected-tv-streaming-750x563.jpg",
    alt: "Connected TV advertising",
  },
  {
    title: "Out of Home",
    description: "Billboards, transit, and digital screens that meet audiences where they commute, shop, and travel.",
    href: "/services/outdoor-advertising/",
    image: "https://staging.kosick.com/wp-content/uploads/2026/02/media-buying-750x499.jpg",
    alt: "Out of home advertising",
  },
  {
    title: "Radio & Streaming",
    description: "Audio spots and sponsorships across news, talk, and music platforms that keep your brand top of mind.",
    href: "/services/radio-advertising/",
    image:
      "https://staging.kosick.com/wp-content/uploads/2026/06/radio-streaming-advertising-750x750.jpg",
    alt: "Radio and streaming advertising",
  },
] as const;

function buildSolutionCard(
  item: (typeof SOLUTION_ITEMS)[number],
  index: number,
): HTMLAnchorElement {
  const card = document.createElement("a");
  card.className = "kosick-solution-card";
  card.href = item.href;

  const media = document.createElement("div");
  media.className = "kosick-solution-card__media";

  const img = document.createElement("img");
  img.className = "kosick-solution-card__image";
  img.src = item.image;
  img.alt = item.alt;
  img.loading = index < 4 ? "eager" : "lazy";
  img.decoding = "async";
  media.appendChild(img);

  const content = document.createElement("div");
  content.className = "kosick-solution-card__content";

  const copy = document.createElement("div");
  copy.className = "kosick-solution-card__copy";

  const title = document.createElement("h3");
  title.className = "kosick-solution-card__title";
  title.textContent = item.title;

  const description = document.createElement("p");
  description.className = "kosick-solution-card__description";
  description.textContent = item.description;

  const link = document.createElement("span");
  link.className = "kosick-solution-card__link";
  link.innerHTML =
    'Learn more <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';

  copy.append(title, description);
  content.append(copy, link);
  card.append(media, content);
  return card;
}

function setupSolutionsGrid() {
  const section = document.querySelector<HTMLElement>(".kb-row-layout-id4541_99352b-d8");
  const rowOne = document.querySelector<HTMLElement>(".kb-row-layout-id4541_fd9b20-7e");
  const rowTwo = document.querySelector<HTMLElement>(".kb-row-layout-id4541_edd49c-d5");
  if (!section || !rowOne || !rowTwo || section.dataset.kosickSolutions === "true") {
    return () => undefined;
  }

  const heading = section.querySelector<HTMLElement>(".kt-adv-heading4541_2190c1-61");
  const subtitle = section.querySelector<HTMLElement>(".kt-adv-heading4541_c61f36-a2");
  if (heading) {
    heading.classList.add(
      "kosick-solutions-heading",
      "kosick-section-title",
      "section-title",
    );
  }
  if (subtitle) {
    subtitle.classList.add(
      "kosick-solutions-subtitle",
      "kosick-section-description",
      "section-description",
    );
    subtitle.innerHTML =
      "Strategy, creative, and media working together — tailored solutions that build visibility and drive measurable growth.";
  }

  const grid = document.createElement("div");
  grid.className = "kosick-solutions-grid";
  grid.setAttribute("data-kosick-solutions", "true");
  for (const [index, item] of SOLUTION_ITEMS.entries()) {
    grid.appendChild(buildSolutionCard(item, index));
  }

  section.dataset.kosickSolutions = "true";
  section.after(grid);
  rowOne.style.display = "none";
  rowTwo.style.display = "none";

  return () => {
    grid.remove();
    rowOne.style.display = "";
    rowTwo.style.display = "";
    if (heading) heading.classList.remove("kosick-solutions-heading");
    if (subtitle) {
      subtitle.classList.remove("kosick-solutions-subtitle");
      subtitle.innerHTML = "intuitive<br />";
    }
    delete section.dataset.kosickSolutions;
  };
}

function setupCountUps(root: ParentNode) {
  const items = [...root.querySelectorAll<HTMLElement>(".wp-block-kadence-countup")];
  if (items.length === 0) return () => undefined;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        play(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.25, rootMargin: "0px 0px -10% 0px" },
  );

  function play(item: HTMLElement) {
    if (item.dataset.kbCountupPlayed === "true") return;
    const number = item.querySelector<HTMLElement>(".kb-count-up-process, .kb-count-up-number");
    if (!number) return;
    const output = number;

    item.dataset.kbCountupPlayed = "true";
    const options = readCountupOptionsFromElement(item);

    function print(value: number) {
      output.textContent = formatCountupValue(value, options);
    }

    if (reduced || options.duration <= 0) {
      print(options.end);
      return;
    }

    const started = performance.now();
    const from = options.start;
    const span = options.end - from;
    const durationMs = options.duration * 1000;

    function frame(now: number) {
      const t = Math.min(1, (now - started) / durationMs);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      print(from + span * eased);
      if (t < 1) requestAnimationFrame(frame);
      else print(options.end);
    }

    print(from);
    requestAnimationFrame(frame);
  }

  items.forEach((item) => {
    const number = item.querySelector<HTMLElement>(".kb-count-up-process, .kb-count-up-number");
    if (!number) return;
    const options = readCountupOptionsFromElement(item);
    const endLabel = formatCountupValue(options.end, options);
    number.setAttribute("aria-hidden", "true");
    if (!item.querySelector(":scope > .screen-reader-text")) {
      const sr = document.createElement("div");
      sr.className = "screen-reader-text";
      sr.textContent = endLabel;
      number.before(sr);
    }
    observer.observe(item);
  });

  return () => observer.disconnect();
}

const SENTENCE_CASE_KEEP = new Set([
  "TV",
  "CTV",
  "SEO",
  "HVAC",
  "AI",
  "OOH",
  "MCP",
  "UI",
  "UX",
  "PPC",
  "ROI",
  "CTA",
  "FAQ",
  "GE",
  "API",
]);

const SENTENCE_CASE_PROPER = new Map([
  ["kosick", "Kosick"],
  ["trane", "Trane"],
  ["runtru", "RunTru"],
  ["york", "York"],
  ["daikin", "Daikin"],
  ["fujitsu", "Fujitsu"],
  ["shopify", "Shopify"],
  ["facebook", "Facebook"],
  ["instagram", "Instagram"],
  ["youtube", "YouTube"],
  ["google", "Google"],
  ["meta", "Meta"],
  ["canada", "Canada"],
  ["vancouver", "Vancouver"],
]);

function isMostlyUpperLabel(text: string): boolean {
  const letters = text.replace(/[^A-Za-z]/g, "");
  return letters.length > 0 && letters === letters.toUpperCase() && /[A-Z]/.test(letters);
}

function looksLikeTitleCase(text: string): boolean {
  const words = text
    .trim()
    .split(/\s+/)
    .map((word) => word.replace(/^[^A-Za-z]+|[^A-Za-z']+$/g, ""))
    .filter(Boolean);
  if (words.length < 2) return false;

  let titled = 0;
  for (const word of words) {
    if (SENTENCE_CASE_KEEP.has(word.toUpperCase())) continue;
    if (SENTENCE_CASE_PROPER.has(word.toLowerCase())) continue;
    if (word.length <= 1) continue;
    // Hyphenated Title-Case: Full-Service
    const parts = word.split("-").filter(Boolean);
    const isTitle = parts.every(
      (part) =>
        part[0] === part[0].toUpperCase() &&
        (part.length === 1 || part.slice(1) === part.slice(1).toLowerCase()),
    );
    if (!isTitle) return false;
    titled += 1;
  }
  return titled >= 2;
}

/** Headings often mix Title Case with acronyms — still force sentence case. */
function headingNeedsSentenceCase(text: string): boolean {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed || isMostlyUpperLabel(trimmed)) return false;
  if (looksLikeTitleCase(trimmed)) return true;
  const words = trimmed
    .split(/\s+/)
    .map((word) => word.replace(/^[^A-Za-z]+|[^A-Za-z']+$/g, ""))
    .filter((word) => word.length > 1);
  if (words.length < 2) return false;
  let caps = 0;
  for (const word of words) {
    if (SENTENCE_CASE_KEEP.has(word.toUpperCase())) continue;
    if (word[0] === word[0].toUpperCase() && /[a-z]/.test(word)) caps += 1;
  }
  return caps >= 2;
}

function toSentenceCase(text: string): string {
  return text.replace(/[A-Za-z][A-Za-z']*/g, (word, offset, full) => {
    const upper = word.toUpperCase();
    if (SENTENCE_CASE_KEEP.has(upper)) return upper;
    const proper = SENTENCE_CASE_PROPER.get(word.toLowerCase());
    if (proper) return proper;
    const before = full.slice(0, offset);
    const isStart = !before.trim() || /[.!?]\s*$/.test(before);
    if (isStart) return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    return word.toLowerCase();
  });
}

function applySentenceCase(root: ParentNode) {
  const targets = [
    ...root.querySelectorAll<HTMLElement>(
      [
        ".wp-block-kadence-advancedheading",
        ".wp-block-heading",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        ".kt-blocks-info-box-title",
        ".kt-blocks-info-box-text",
        ".kosick-section-title",
        ".kosick-section-description",
        ".kosick-page-title",
        ".kosick-subsection-title",
        ".kosick-card-title",
        ".kosick-body-text",
        ".section-title",
        ".section-description",
        ".card-title",
        ".entry-content > .wp-block-paragraph",
        ".kb-row-layout-wrap .wp-block-paragraph",
        ".kb-row-layout-wrap > .kt-row-column-wrap .wp-block-paragraph.has-text-align-center",
      ].join(", "),
    ),
  ];

  const seen = new Set<HTMLElement>();

  for (const el of targets) {
    if (seen.has(el)) continue;
    seen.add(el);
    if (el.closest("#colophon, #masthead, #mobile-drawer, .kosick-bento-grid, .kosick-solutions-grid, .testimonial-card, .testimonial-quote, .testimonial-logo, .testimonial-author")) {
      continue;
    }
    if (
      el.classList.contains("kosick-eyebrow") ||
      el.classList.contains("eyebrow") ||
      el.classList.contains("testimonial-quote") ||
      el.classList.contains("testimonial-logo") ||
      el.classList.contains("testimonial-name") ||
      el.classList.contains("testimonial-role")
    ) {
      continue;
    }

    const isHeading =
      /^H[1-6]$/.test(el.tagName) ||
      el.matches(
        ".wp-block-kadence-advancedheading, .wp-block-heading, .kt-blocks-info-box-title, .kosick-section-title, .kosick-page-title, .kosick-subsection-title, .kosick-card-title, .section-title, .card-title",
      );

    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const raw = node.textContent ?? "";
        if (!raw.trim()) return;
        if (isMostlyUpperLabel(raw.trim())) return;
        const shouldConvert = isHeading
          ? headingNeedsSentenceCase(raw) || looksLikeTitleCase(raw)
          : looksLikeTitleCase(raw) || headingNeedsSentenceCase(raw);
        if (!shouldConvert) return;
        node.textContent = toSentenceCase(raw);
        return;
      }
      if (!(node instanceof HTMLElement)) return;
      if (node.matches("a, script, style, code, pre")) return;
      for (const child of [...node.childNodes]) walk(child);
    };
    walk(el);
  }

  return () => undefined;
}

function previousMeaningfulSibling(el: HTMLElement): HTMLElement | null {
  let sib = el.previousElementSibling as HTMLElement | null;
  while (sib) {
    if (sib.tagName === "BR") {
      sib = sib.previousElementSibling as HTMLElement | null;
      continue;
    }
    if ((sib.textContent ?? "").trim() === "" && !sib.querySelector("img, svg, video")) {
      sib = sib.previousElementSibling as HTMLElement | null;
      continue;
    }
    return sib;
  }
  return null;
}

function isEyebrowHeading(el: HTMLElement): boolean {
  const text = (el.textContent ?? "").replace(/\s+/g, " ").trim();
  if (!text || text.length > 72) return false;
  const letters = text.replace(/[^A-Za-z]/g, "");
  const mostlyUpper =
    letters.length > 0 && letters === letters.toUpperCase() && /[A-Z]/.test(letters);
  const goldLabel =
    el.classList.contains("has-theme-palette-1-color") ||
    el.classList.contains("has-theme-palette-2-color");
  if (goldLabel && (mostlyUpper || text.length < 48)) return true;
  if (mostlyUpper && text.length <= 48 && !el.matches("h1")) return true;
  return false;
}

function replaceHeadingTag(el: HTMLElement, tagName: "h1" | "h2" | "h3" | "h4"): HTMLElement {
  if (el.tagName.toLowerCase() === tagName) return el;
  const next = document.createElement(tagName);
  for (const attr of el.attributes) {
    next.setAttribute(attr.name, attr.value);
  }
  next.innerHTML = el.innerHTML;
  el.replaceWith(next);
  return next;
}

function setupTypographyHierarchy() {
  const root = document.querySelector<HTMLElement>(".entry-content");
  if (!root || root.dataset.kosickTypography === "true") {
    return () => undefined;
  }
  root.dataset.kosickTypography = "true";

  const marked: HTMLElement[] = [];

  const mark = (el: HTMLElement | null, ...classes: string[]) => {
    if (!el) return;
    el.classList.add(...classes);
    // Strip Kadence inline type so shared tokens win
    el.style.removeProperty("font-size");
    el.style.removeProperty("font-weight");
    el.style.removeProperty("line-height");
    el.style.removeProperty("letter-spacing");
    el.style.removeProperty("text-transform");
    marked.push(el);
  };

  // Homepage baselines
  mark(
    document.querySelector<HTMLElement>(".kt-adv-heading4541_f35171-26"),
    "kosick-section-title",
    "section-title",
  );
  mark(
    document.querySelector<HTMLElement>(".kosick-what-we-do-description, .kt-adv-heading4541_72c33d-12"),
    "kosick-section-description",
    "section-description",
  );
  mark(
    document.querySelector<HTMLElement>(".kosick-solutions-heading"),
    "kosick-section-title",
    "section-title",
  );
  mark(
    document.querySelector<HTMLElement>(".kosick-solutions-subtitle"),
    "kosick-section-description",
    "section-description",
  );
  mark(
    document.querySelector<HTMLElement>(
      ".kb-row-layout-id4541_cb53d2-62 .kadence-column4541_8810e8-4c > .kt-inside-inner-col > .wp-block-heading",
    ),
    "kosick-section-title",
    "section-title",
  );
  mark(
    document.querySelector<HTMLElement>(
      ".kb-row-layout-id4541_cb53d2-62 .kadence-column4541_8810e8-4c > .kt-inside-inner-col > .wp-block-paragraph",
    ),
    "kosick-section-description",
    "section-description",
  );

  const skip = (el: HTMLElement) =>
    Boolean(
      el.closest(
        "#colophon, #masthead, #mobile-drawer, .kosick-bento-grid, .kosick-solutions-grid, .n2-ss-slider, .kb-row-layout-id4541_605b2b-60, .testimonial-card, .testimonial-quote, .testimonial-logo, .testimonial-author, .testimonial-name, .testimonial-role",
      ),
    ) ||
    el.classList.contains("testimonial-quote") ||
    el.classList.contains("testimonial-logo") ||
    el.classList.contains("testimonial-name") ||
    el.classList.contains("testimonial-role");

  const candidates = [
    ...root.querySelectorAll<HTMLElement>(
      "h1, h2, h3, h4, h5, .wp-block-kadence-advancedheading, .wp-block-heading",
    ),
  ];

  let pageTitleAssigned = false;

  for (let el of candidates) {
    if (skip(el)) continue;
    if (
      el.classList.contains("kosick-section-title") ||
      el.classList.contains("kosick-section-description") ||
      el.classList.contains("kosick-page-title") ||
      el.classList.contains("kosick-eyebrow")
    ) {
      continue;
    }

    if (isEyebrowHeading(el)) {
      mark(el, "kosick-eyebrow", "eyebrow");
      continue;
    }

    const tag = el.tagName.toLowerCase();

    // Feature blocks: eyebrow + H1 → section title (Marketing baseline), not page H1
    const prev = previousMeaningfulSibling(el);
    const afterEyebrow =
      Boolean(prev?.classList.contains("kosick-eyebrow")) ||
      Boolean(prev && isEyebrowHeading(prev));

    if (tag === "h1") {
      if (afterEyebrow) {
        // Visually = Marketing H2; keep first as semantic h1, demote the rest
        if (pageTitleAssigned) {
          el = replaceHeadingTag(el, "h2");
        } else {
          pageTitleAssigned = true;
        }
        mark(el, "kosick-section-title", "section-title");
      } else if (!pageTitleAssigned) {
        mark(el, "kosick-page-title", "page-title");
        pageTitleAssigned = true;
      } else {
        el = replaceHeadingTag(el, "h2");
        mark(el, "kosick-section-title", "section-title");
      }
      continue;
    }

    if (tag === "h2") {
      if (el.closest(".amplitude-tabs")) {
        mark(el, "kosick-subsection-title", "subsection-title");
      } else {
        mark(el, "kosick-section-title", "section-title");
      }
      continue;
    }

    if (tag === "h3") {
      mark(el, "kosick-subsection-title", "subsection-title");
      continue;
    }

    if (tag === "h4" || tag === "h5") {
      mark(el, "kosick-card-title", "card-title");
      continue;
    }

    // Advanced headings without semantic tags (div/span)
    if (el.matches(".wp-block-kadence-advancedheading")) {
      if (afterEyebrow) {
        mark(el, "kosick-section-title", "section-title");
      } else if (!pageTitleAssigned && el.classList.contains("has-theme-palette-3-color")) {
        mark(el, "kosick-section-title", "section-title");
      } else {
        mark(el, "kosick-subsection-title", "subsection-title");
      }
    }
  }

  // Lead copy directly under a page/section title
  for (const title of root.querySelectorAll<HTMLElement>(
    ".kosick-section-title, .kosick-page-title, .amplitude-tabs .kosick-subsection-title",
  )) {
    let sib = title.nextElementSibling as HTMLElement | null;
    while (sib && (sib.tagName === "BR" || (sib.textContent ?? "").trim() === "")) {
      sib = sib.nextElementSibling as HTMLElement | null;
    }
    if (
      sib &&
      (sib.matches("p, .wp-block-paragraph, .wp-block-kadence-advancedheading") ||
        sib.tagName === "P") &&
      !sib.classList.contains("kosick-section-title") &&
      !sib.classList.contains("kosick-eyebrow") &&
      !sib.classList.contains("kosick-page-title")
    ) {
      mark(sib, "kosick-section-description", "section-description");
    }
  }

  // Remaining content paragraphs → body
  for (const p of root.querySelectorAll<HTMLElement>("p.wp-block-paragraph, .entry-content > p")) {
    if (skip(p)) continue;
    if (
      p.classList.contains("kosick-section-description") ||
      p.classList.contains("kosick-eyebrow") ||
      p.classList.contains("kosick-meta-text")
    ) {
      continue;
    }
    mark(p, "kosick-body-text", "body-text");
  }

  // List items often carry Kadence inline 20px — normalize to body
  for (const li of root.querySelectorAll<HTMLElement>("ul.wp-block-list li, ol.wp-block-list li")) {
    if (skip(li)) continue;
    mark(li, "kosick-body-text", "body-text");
  }

  // Info-box titles / descriptions
  for (const title of root.querySelectorAll<HTMLElement>(".kt-blocks-info-box-title")) {
    if (skip(title)) continue;
    mark(title, "kosick-card-title", "card-title");
  }
  for (const text of root.querySelectorAll<HTMLElement>(".kt-blocks-info-box-text")) {
    if (skip(text)) continue;
    mark(text, "kosick-body-text", "body-text");
  }

  // Preserve Kadence/center alignment on role classes (Build a brand pattern)
  for (const el of root.querySelectorAll<HTMLElement>(
    ".kosick-section-title, .kosick-section-description, .kosick-page-title, .kosick-eyebrow",
  )) {
    if (
      el.classList.contains("has-text-align-center") ||
      el.classList.contains("has-text-align-centre")
    ) {
      continue;
    }
    const align = window.getComputedStyle(el).textAlign;
    if (align === "center" || align === "centre") {
      el.classList.add("has-text-align-center");
    }
  }

  // Keep known centered intros centered — do NOT blanket every WP centered paragraph
  // (e.g. Why Choose lead must stay left-aligned).
  for (const el of root.querySelectorAll<HTMLElement>(
    [
      ".has-text-align-center.kosick-section-title",
      ".has-text-align-center.kosick-section-description",
      "h2.has-text-align-center",
      "p.has-text-align-center:has(+ .amplitude-tabs)",
    ].join(", "),
  )) {
    if (el.closest(".kb-row-layout-id4541_cb53d2-62")) continue;
    if (el.classList.contains("kosick-solutions-subtitle")) continue;
    el.classList.add("has-text-align-center");
    el.style.setProperty("text-align", "center", "important");
  }

  // Solutions subtitle stays left-aligned
  for (const el of root.querySelectorAll<HTMLElement>(".kosick-solutions-subtitle")) {
    el.classList.remove("has-text-align-center");
    el.style.setProperty("text-align", "left", "important");
    el.style.setProperty("margin-left", "0", "important");
    el.style.setProperty("margin-right", "0", "important");
  }

  // Why Choose lead stays left even if WP marked it centered
  for (const el of root.querySelectorAll<HTMLElement>(
    ".kb-row-layout-id4541_cb53d2-62 .kadence-column4541_8810e8-4c .wp-block-paragraph, .kb-row-layout-id4541_cb53d2-62 .kosick-section-description",
  )) {
    el.classList.remove("has-text-align-center");
    el.style.setProperty("text-align", "left", "important");
    el.style.setProperty("margin-left", "0", "important");
    el.style.setProperty("margin-right", "0", "important");
  }

  // Centered eyebrow + title above a solutions grid → Amplitude “Solutions by team”
  // Order: eyebrow above title (not Build-a-brand title→description)
  for (const title of root.querySelectorAll<HTMLElement>(".kosick-section-title")) {
    const prev = previousMeaningfulSibling(title);
    if (!prev?.classList.contains("kosick-eyebrow")) continue;

    const titleCentered =
      title.classList.contains("has-text-align-center") ||
      window.getComputedStyle(title).textAlign === "center";
    const prevCentered =
      prev.classList.contains("has-text-align-center") ||
      window.getComputedStyle(prev).textAlign === "center";
    if (!titleCentered || !prevCentered) continue;

    const next = title.nextElementSibling as HTMLElement | null;
    const followsSolutionsGrid =
      Boolean(next?.matches(".kb-row-layout-wrap, .wp-block-kadence-rowlayout")) &&
      Boolean(next?.querySelector(".wp-block-kadence-infobox"));

    // Ensure eyebrow stays ABOVE the title
    if (prev.nextElementSibling !== title) {
      title.before(prev);
    }

    prev.classList.remove("kosick-section-description", "section-description");
    prev.classList.add(
      "kosick-eyebrow",
      "eyebrow",
      "kosick-solutions-by-team-eyebrow",
      "has-text-align-center",
    );
    title.classList.remove("kosick-feature-title");
    title.classList.add(
      "kosick-section-title",
      "section-title",
      "kosick-solutions-by-team-heading",
      "has-text-align-center",
    );
    prev.style.setProperty("text-align", "center", "important");
    prev.style.setProperty("text-transform", "none", "important");
    title.style.setProperty("text-align", "center", "important");

    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const raw = node.textContent ?? "";
        if (!raw.trim()) return;
        node.textContent = toSentenceCase(raw);
        return;
      }
      if (!(node instanceof HTMLElement)) return;
      if (node.matches("a, script, style, code, pre")) return;
      for (const child of [...node.childNodes]) walk(child);
    };
    walk(prev);
    walk(title);

    if (followsSolutionsGrid) {
      next?.classList.add("kosick-solutions-by-team");
    }
    marked.push(prev, title);
  }

  // Left-aligned feature columns → Amplitude-style label / title / lead
  for (const title of root.querySelectorAll<HTMLElement>(".kosick-section-title")) {
    if (title.classList.contains("has-text-align-center")) continue;
    if (title.classList.contains("kosick-solutions-by-team-heading")) continue;
    const prev = previousMeaningfulSibling(title);
    if (!prev?.classList.contains("kosick-eyebrow")) continue;
    if (prev.classList.contains("has-text-align-center")) continue;

    prev.classList.add("kosick-feature-label");
    title.classList.add("kosick-feature-title");
    marked.push(prev, title);

    // Sentence-case the label (e.g. "20+ years of HVAC expertise")
    const walkLabel = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const raw = node.textContent ?? "";
        if (!raw.trim()) return;
        node.textContent = toSentenceCase(raw);
        return;
      }
      if (!(node instanceof HTMLElement)) return;
      if (node.matches("a, script, style, code, pre")) return;
      for (const child of [...node.childNodes]) walkLabel(child);
    };
    walkLabel(prev);

    let lead = title.nextElementSibling as HTMLElement | null;
    while (lead && (lead.tagName === "BR" || (lead.textContent ?? "").trim() === "")) {
      lead = lead.nextElementSibling as HTMLElement | null;
    }
    if (lead?.classList.contains("kosick-section-description")) {
      lead.classList.add("kosick-feature-lead");
      marked.push(lead);
    }

    const column = title.closest<HTMLElement>(
      ".kt-inside-inner-col, .wp-block-kadence-column, .kadence-column",
    );
    const btn = column?.querySelector<HTMLElement>("a.kb-button, a.kt-button, .kb-button");
    if (btn) {
      btn.classList.add("kosick-outline-btn");
      marked.push(btn);
      const label = btn.querySelector<HTMLElement>(".kt-btn-inner-text");
      if (label?.textContent) {
        label.textContent = toSentenceCase(label.textContent);
      }
    }
  }

  return () => {
    for (const el of marked) {
      el.classList.remove(
        "page-title",
        "kosick-page-title",
        "section-title",
        "kosick-section-title",
        "section-description",
        "kosick-section-description",
        "subsection-title",
        "kosick-subsection-title",
        "card-title",
        "kosick-card-title",
        "eyebrow",
        "kosick-eyebrow",
        "kosick-feature-label",
        "kosick-feature-title",
        "kosick-feature-lead",
        "kosick-solutions-by-team-eyebrow",
        "kosick-solutions-by-team-heading",
        "kosick-solutions-by-team",
        "kosick-outline-btn",
        "body-text",
        "kosick-body-text",
        "meta-text",
        "kosick-meta-text",
        "has-text-align-center",
      );
    }
    delete root.dataset.kosickTypography;
  };
}

function setupSectionSeparators() {
  const separators: HTMLElement[] = [];

  const insertBefore = (target: HTMLElement | null | undefined) => {
    if (!target) return;
    if (target.previousElementSibling?.classList.contains("kosick-section-separator")) {
      return;
    }
    const hr = document.createElement("div");
    hr.className = "kosick-section-separator";
    hr.setAttribute("aria-hidden", "true");
    hr.setAttribute("role", "presentation");
    target.before(hr);
    separators.push(hr);
  };

  const insertAfter = (target: HTMLElement | null | undefined) => {
    if (!target) return;
    if (target.nextElementSibling?.classList.contains("kosick-section-separator")) {
      return;
    }
    const hr = document.createElement("div");
    hr.className = "kosick-section-separator";
    hr.setAttribute("aria-hidden", "true");
    hr.setAttribute("role", "presentation");
    target.after(hr);
    separators.push(hr);
  };

  // Do NOT put a separator above Marketing / What We Do (.kb-row-layout-id4541_24cef5-d6)

  // Build a brand + tabs: separator above the heading, below the tabs
  const tabs = document.querySelector<HTMLElement>(".entry-content .amplitude-tabs");
  if (tabs) {
    let start: HTMLElement = tabs;
    let prev = tabs.previousElementSibling as HTMLElement | null;
    while (
      prev &&
      (prev.matches(
        "h1, h2, h3, p, .wp-block-heading, .wp-block-paragraph, .wp-block-kadence-advancedheading",
      ) ||
        prev.classList.contains("kosick-section-title") ||
        prev.classList.contains("kosick-section-description"))
    ) {
      start = prev;
      prev = prev.previousElementSibling as HTMLElement | null;
    }
    insertBefore(start);
    insertAfter(tabs);
  }

  // Other major sections (not Marketing)
  insertBefore(document.querySelector<HTMLElement>(".kb-row-layout-id4541_99352b-d8"));
  insertBefore(document.querySelector<HTMLElement>(".kb-row-layout-id4541_cb53d2-62"));

  // Other centered section titles (e.g. testimonials) — skip Build a brand (already handled)
  document
    .querySelectorAll<HTMLElement>(".entry-content h2.wp-block-heading.has-text-align-center")
    .forEach((heading) => {
      const next = heading.nextElementSibling;
      const nearTabs =
        Boolean(tabs) &&
        (next === tabs ||
          (Boolean(next?.matches("p, .wp-block-paragraph")) &&
            next?.nextElementSibling === tabs));
      if (nearTabs) return;

      let block: HTMLElement = heading;
      while (
        block.parentElement &&
        !block.parentElement.classList.contains("entry-content")
      ) {
        block = block.parentElement;
      }
      if (block.previousElementSibling?.classList.contains("kosick-section-separator")) {
        return;
      }
      insertBefore(block);
    });

  return () => {
    for (const hr of separators) hr.remove();
  };
}

const WHY_CHOOSE_CAPABILITIES = [
  { label: "Brand Strategy", icon: "strategy" },
  { label: "Web Development", icon: "web" },
  { label: "AI Solutions", icon: "ai" },
  { label: "CRM Development", icon: "crm" },
  { label: "Digital Marketing", icon: "marketing" },
  { label: "SEO", icon: "seo" },
  { label: "Analytics", icon: "analytics" },
  { label: "Automation", icon: "automation" },
] as const;

function capabilityIcon(kind: (typeof WHY_CHOOSE_CAPABILITIES)[number]["icon"]): string {
  const common =
    'viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  switch (kind) {
    case "strategy":
      return `<svg ${common}><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/></svg>`;
    case "web":
      return `<svg ${common}><polyline points="8 6 2 12 8 18"/><polyline points="16 6 22 12 16 18"/><line x1="14" y1="4" x2="10" y2="20"/></svg>`;
    case "ai":
      return `<svg ${common}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="3.5"/></svg>`;
    case "crm":
      return `<svg ${common}><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
    case "marketing":
      return `<svg ${common}><path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M16 8.5a5 5 0 0 1 0 7"/><path d="M18.5 6a8 8 0 0 1 0 12"/></svg>`;
    case "seo":
      return `<svg ${common}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
    case "analytics":
      return `<svg ${common}><line x1="4" y1="20" x2="4" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="20" y1="20" x2="20" y2="14"/></svg>`;
    case "automation":
      return `<svg ${common}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/></svg>`;
  }
}

function setupWhyChooseCarousel() {
  const section = document.querySelector<HTMLElement>(".kb-row-layout-id4541_cb53d2-62");
  const metrics = document.querySelector<HTMLElement>(".kb-row-layout-id4541_cb5129-82");
  if (!section || !metrics || section.dataset.kosickCapabilities === "true") {
    return () => undefined;
  }

  const strip = document.createElement("div");
  strip.className = "kosick-capabilities";
  strip.setAttribute("data-kosick-capabilities", "true");

  const lead = document.createElement("p");
  lead.className = "kosick-capabilities__lead";
  lead.textContent = "One partner. Every digital touchpoint:";

  const viewport = document.createElement("div");
  viewport.className = "kosick-capabilities__viewport";

  const track = document.createElement("div");
  track.className = "kosick-capabilities__track";

  const buildItems = () => {
    const frag = document.createDocumentFragment();
    for (const item of WHY_CHOOSE_CAPABILITIES) {
      const el = document.createElement("span");
      el.className = "kosick-capabilities__item";
      el.innerHTML = `${capabilityIcon(item.icon)}<span class="kosick-capabilities__label">${item.label}</span>`;
      frag.appendChild(el);
    }
    return frag;
  };

  // Duplicate for seamless marquee
  track.append(buildItems(), buildItems());
  viewport.appendChild(track);
  strip.append(lead, viewport);

  section.dataset.kosickCapabilities = "true";
  metrics.after(strip);

  return () => {
    strip.remove();
    delete section.dataset.kosickCapabilities;
  };
}

const WHY_CHOOSE_TILE_ROWS = [
  ".kb-row-layout-id4541_5747e9-5c",
  ".kb-row-layout-id4541_c3a682-45",
  ".kb-row-layout-id4541_1131a9-81",
] as const;

function setupWhyChooseRail() {
  const section = document.querySelector<HTMLElement>(".kb-row-layout-id4541_cb53d2-62");
  const wrap = section?.querySelector<HTMLElement>(":scope > .kt-row-column-wrap");
  if (!section || !wrap || wrap.dataset.kosickRail === "true") {
    return () => undefined;
  }

  wrap.dataset.kosickRail = "true";

  const columnInners = [
    ...wrap.querySelectorAll<HTMLElement>(
      ".kadence-column4541_8810e8-4c > .kt-inside-inner-col, .kadence-column4541_22382c-cd > .kt-inside-inner-col",
    ),
  ];

  const sync = () => {
    const reference =
      document.querySelector<HTMLElement>(".kosick-bento-grid") ||
      document.querySelector<HTMLElement>(".kosick-solutions-grid") ||
      document.querySelector<HTMLElement>(".kb-row-layout-id4541_99352b-d8");

    if (reference) {
      const width = `${Math.round(reference.getBoundingClientRect().width)}px`;
      wrap.style.setProperty("width", width, "important");
      wrap.style.setProperty("max-width", width, "important");
    } else {
      wrap.style.setProperty(
        "width",
        "var(--kosick-content-rail)",
        "important",
      );
      wrap.style.setProperty(
        "max-width",
        "var(--kosick-content-rail)",
        "important",
      );
    }

    wrap.style.setProperty("margin-left", "auto", "important");
    wrap.style.setProperty("margin-right", "auto", "important");
    wrap.style.setProperty("padding-left", "0px", "important");
    wrap.style.setProperty("padding-right", "0px", "important");
    wrap.style.setProperty("box-sizing", "border-box", "important");

    for (const inner of columnInners) {
      inner.style.setProperty("padding-left", "0px", "important");
      inner.style.setProperty("padding-right", "0px", "important");
      inner.style.setProperty("width", "100%", "important");
      inner.style.setProperty("max-width", "none", "important");
      inner.style.setProperty("margin-left", "0px", "important");
      inner.style.setProperty("margin-right", "0px", "important");
      inner.style.setProperty("box-sizing", "border-box", "important");
    }
  };

  sync();
  const observer = new ResizeObserver(sync);
  const reference =
    document.querySelector<HTMLElement>(".kosick-bento-grid") ||
    document.querySelector<HTMLElement>(".kosick-solutions-grid");
  if (reference) observer.observe(reference);
  observer.observe(document.documentElement);
  window.addEventListener("resize", sync);

  return () => {
    observer.disconnect();
    window.removeEventListener("resize", sync);
    wrap.style.removeProperty("width");
    wrap.style.removeProperty("max-width");
    wrap.style.removeProperty("margin-left");
    wrap.style.removeProperty("margin-right");
    wrap.style.removeProperty("padding-left");
    wrap.style.removeProperty("padding-right");
    wrap.style.removeProperty("box-sizing");
    for (const inner of columnInners) {
      inner.style.removeProperty("padding-left");
      inner.style.removeProperty("padding-right");
      inner.style.removeProperty("width");
      inner.style.removeProperty("max-width");
      inner.style.removeProperty("margin-left");
      inner.style.removeProperty("margin-right");
      inner.style.removeProperty("box-sizing");
    }
    delete wrap.dataset.kosickRail;
  };
}

function setupWhyChooseTiles() {
  const column = document.querySelector<HTMLElement>(".kadence-column4541_22382c-cd");
  const inner = column?.querySelector<HTMLElement>(":scope > .kt-inside-inner-col");
  if (!column || !inner || column.dataset.kosickWhyTiles === "true") {
    return () => undefined;
  }

  const rows = WHY_CHOOSE_TILE_ROWS.map((selector) =>
    inner.querySelector<HTMLElement>(`:scope > ${selector}`),
  ).filter((row): row is HTMLElement => Boolean(row));

  const labels = rows.flatMap((row) =>
    [...row.querySelectorAll<HTMLElement>(".kb-button")].map(
      (btn) => btn.textContent?.replace(/\s+/g, " ").trim() ?? "",
    ),
  ).filter(Boolean);

  if (labels.length < 6) {
    return () => undefined;
  }

  const grid = document.createElement("div");
  grid.className = "kosick-why-tiles";

  for (const raw of labels.slice(0, 6)) {
    const label = raw.replace(/Data-\s*driven/i, "Data-driven");
    const parts = label.split(/\s+/).filter(Boolean);
    const tile = document.createElement("div");
    tile.className = "kosick-why-tile";
    if (parts.length >= 2) {
      const last = parts.pop()!;
      const line1 = document.createElement("span");
      line1.textContent = parts.join(" ");
      const line2 = document.createElement("span");
      line2.textContent = last;
      tile.append(line1, line2);
    } else {
      tile.textContent = label;
    }
    grid.appendChild(tile);
  }

  column.dataset.kosickWhyTiles = "true";
  rows.forEach((row) => {
    row.style.display = "none";
  });
  inner.appendChild(grid);

  return () => {
    grid.remove();
    rows.forEach((row) => {
      row.style.display = "";
    });
    delete column.dataset.kosickWhyTiles;
  };
}

function setupSolutionsByTeam() {
  const outlineIcon = (paths: string) =>
    `<svg class="kosick-solutions-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

  const OUTLINE_ICONS = [
    // megaphone
    outlineIcon(
      '<path d="M3 11v2a1 1 0 0 0 1 1h1l6 4V6L5 10H4a1 1 0 0 0-1 1z"/><path d="M14 8.5c1.2.8 2 2.1 2 3.5s-.8 2.7-2 3.5"/><path d="M16.5 6.5c2 1.4 3.2 3.4 3.2 5.5s-1.2 4.1-3.2 5.5"/><path d="M6.5 14.5 7 18l2-.5"/>',
    ),
    // dollar
    outlineIcon(
      '<circle cx="12" cy="12" r="9"/><path d="M12 7v10"/><path d="M15 9.5c0-1.4-1.3-2-3-2s-3 .7-3 2 1.3 1.8 3 2.2 3 .9 3 2.3-1.3 2-3 2-3-.7-3-2"/>',
    ),
    // monitor (website)
    outlineIcon(
      '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8"/><path d="M12 16v4"/>',
    ),
    // trend chart
    outlineIcon(
      '<path d="M4 19h16"/><path d="M5 15l4.5-4.5 3.5 3.5L19 7"/><path d="M15 7h4v4"/>',
    ),
  ];

  const grids = [
    ...document.querySelectorAll<HTMLElement>(
      ".kb-row-layout-id11571_bb5d0b-84, .kosick-solutions-by-team",
    ),
  ];
  // Also catch 4-column rows that are mostly info boxes
  for (const row of document.querySelectorAll<HTMLElement>(
    ".entry-content .kb-row-layout-wrap > .kt-row-column-wrap.kt-has-4-columns",
  )) {
    const boxes = row.querySelectorAll(".wp-block-kadence-infobox");
    if (boxes.length >= 4) {
      const wrap = row.closest<HTMLElement>(".kb-row-layout-wrap");
      if (wrap) grids.push(wrap);
    }
  }

  const unique = [...new Set(grids)];
  const cleanups: Array<() => void> = [];

  for (const grid of unique) {
    if (grid.dataset.kosickSolutionsByTeam === "true") continue;
    grid.dataset.kosickSolutionsByTeam = "true";
    grid.classList.add("kosick-solutions-by-team");

    const added: HTMLElement[] = [];
    const boxes = [...grid.querySelectorAll<HTMLElement>(".wp-block-kadence-infobox")];
    for (const [index, box] of boxes.entries()) {
      box.classList.add("kosick-solutions-col");

      const media =
        box.querySelector<HTMLElement>(".kadence-info-box-icon-inner-container") ||
        box.querySelector<HTMLElement>(".kt-blocks-info-box-media") ||
        box.querySelector<HTMLElement>(".kt-blocks-info-box-media-container");
      if (media && OUTLINE_ICONS[index]) {
        media.dataset.kosickIconHtml = media.innerHTML;
        media.innerHTML = OUTLINE_ICONS[index];
      }

      const text = box.querySelector<HTMLElement>(".kt-infobox-textcontent");
      if (!text) continue;
      if (!text.querySelector(".kosick-solutions-learn")) {
        const learn = document.createElement("span");
        learn.className = "kosick-solutions-learn";
        learn.innerHTML = 'Learn more <span aria-hidden="true">→</span>';
        text.appendChild(learn);
        added.push(learn);
      }
    }

    cleanups.push(() => {
      for (const el of added) el.remove();
      for (const box of grid.querySelectorAll<HTMLElement>(".kosick-solutions-col")) {
        const media =
          box.querySelector<HTMLElement>(".kadence-info-box-icon-inner-container") ||
          box.querySelector<HTMLElement>(".kt-blocks-info-box-media") ||
          box.querySelector<HTMLElement>(".kt-blocks-info-box-media-container");
        if (media?.dataset.kosickIconHtml != null) {
          media.innerHTML = media.dataset.kosickIconHtml;
          delete media.dataset.kosickIconHtml;
        }
        box.classList.remove("kosick-solutions-col");
      }
      grid.classList.remove("kosick-solutions-by-team");
      delete grid.dataset.kosickSolutionsByTeam;
    });
  }

  return () => cleanups.forEach((fn) => fn());
}

export function WordPressInteract({ pageKey }: { pageKey: string }) {
  useEffect(() => {
    const cleanups = [
      setupMobileDrawer(),
      setupTabs(document),
      setupAccordions(document),
      setupMegaMenu(),
      setupStickyHeader(),
      setupBentoGrid(),
      setupWhatWeDoIntro(),
      setupSolutionsGrid(),
      setupSectionSeparators(),
      setupWhyChooseCarousel(),
      setupWhyChooseRail(),
      setupWhyChooseTiles(),
      setupTypographyHierarchy(),
      setupSolutionsByTeam(),
      applySentenceCase(document),
      setupScrollUp(),
      setupCountUps(document),
    ];

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [pageKey]);

  return null;
}
