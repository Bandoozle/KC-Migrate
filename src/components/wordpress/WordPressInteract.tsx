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

    wrap.querySelectorAll<HTMLElement>(":scope > .kt-tabs-content-wrap > .kt-tab-inner-content").forEach((panel) => {
      const isActive = panel.classList.contains(`kt-inner-tab-${tab}`);
      panel.setAttribute("role", "tabpanel");
      panel.style.display = isActive ? "block" : "none";
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
  description.classList.add("kosick-what-we-do-description");
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
    heading.classList.add("kosick-solutions-heading");
  }
  if (subtitle) {
    subtitle.classList.add("kosick-solutions-subtitle");
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
]);

const SENTENCE_CASE_PROPER = new Map([["kosick", "Kosick"]]);

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
    const isTitle =
      word[0] === word[0].toUpperCase() && word.slice(1) === word.slice(1).toLowerCase();
    if (!isTitle) return false;
    titled += 1;
  }
  return titled >= 2;
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
      ".wp-block-kadence-advancedheading, .wp-block-heading, .entry-content > .wp-block-paragraph, .kb-row-layout-wrap > .kt-row-column-wrap .wp-block-paragraph.has-text-align-center",
    ),
  ];

  for (const el of targets) {
    if (el.closest("#colophon, #masthead, #mobile-drawer, .kosick-bento-grid, .kosick-solutions-grid")) {
      continue;
    }
    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const raw = node.textContent ?? "";
        if (!looksLikeTitleCase(raw)) return;
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

function setupSectionSeparators() {
  const starts = [
    ".kb-row-layout-id4541_24cef5-d6",
    ".kb-row-layout-id4541_99352b-d8",
    ".kb-row-layout-id4541_cb53d2-62",
  ];

  const targets: HTMLElement[] = [];
  for (const selector of starts) {
    const el = document.querySelector<HTMLElement>(selector);
    if (el) targets.push(el);
  }

  // Centered section titles may be nested (e.g. testimonials). Insert before
  // the outermost block that is a direct child of .entry-content.
  document
    .querySelectorAll<HTMLElement>(".entry-content h2.wp-block-heading.has-text-align-center")
    .forEach((heading) => {
      let block: HTMLElement = heading;
      while (
        block.parentElement &&
        !block.parentElement.classList.contains("entry-content")
      ) {
        block = block.parentElement;
      }
      targets.push(block);
    });

  const separators: HTMLElement[] = [];
  const seen = new Set<HTMLElement>();

  for (const target of targets) {
    if (seen.has(target)) continue;
    seen.add(target);
    if (target.previousElementSibling?.classList.contains("kosick-section-separator")) {
      continue;
    }

    const hr = document.createElement("div");
    hr.className = "kosick-section-separator";
    hr.setAttribute("aria-hidden", "true");
    hr.setAttribute("role", "presentation");
    target.before(hr);
    separators.push(hr);
  }

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
      applySentenceCase(document),
      setupScrollUp(),
      setupCountUps(document),
    ];

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [pageKey]);

  return null;
}
