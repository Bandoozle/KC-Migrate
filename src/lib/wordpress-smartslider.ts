function mergeInlineStyle(tag: string, extra: string): string {
  if (/\bstyle=/i.test(tag)) {
    return tag.replace(/\bstyle=(['"])([\s\S]*?)\1/i, (_full, quote: string, value: string) => {
      const next = `${value}${value.trim().endsWith(";") || !value.trim() ? "" : ";"}${extra}`;
      return `style=${quote}${next}${quote}`;
    });
  }

  return tag.replace(/^(<[a-zA-Z0-9-]+)/, `$1 style="${extra}"`);
}

function addClass(tag: string, className: string): string {
  if (new RegExp(`\\bclass=(['"][^'"]*\\b${className}\\b)`).test(tag)) return tag;
  if (/\bclass=/.test(tag)) {
    return tag.replace(/\bclass=(['"])/i, `class=$1${className} `);
  }
  return tag.replace(/^(<[a-zA-Z0-9-]+)/, `$1 class="${className}"`);
}

function removeClass(tag: string, className: string): string {
  return tag.replace(new RegExp(`\\s*\\b${className}\\b`, "g"), " ").replace(/\s+/g, " ");
}

function attr(tag: string | undefined, name: string): string | null {
  if (!tag) return null;
  return tag.match(new RegExp(`\\b${name}=(['"])([^'"]*)\\1`, "i"))?.[2] ?? null;
}

export function absolutizeProtocolRelative(url: string): string {
  if (url.startsWith("//")) return `https:${url}`;
  return url;
}

function cssUrl(url: string): string {
  return absolutizeProtocolRelative(url).replace(/'/g, "%27");
}

function resolveSlideImageUrl(block: string): string | null {
  const imgTag = block.match(/<img\b[^>]*>/i)?.[0];
  const wrapTag = block.match(/<div\b[^>]*\bn2-ss-slide-background-image\b[^>]*>/i)?.[0];
  const candidates = [
    attr(imgTag, "src"),
    attr(imgTag, "data-src"),
    attr(imgTag, "data-lazy"),
    attr(imgTag, "data-desktop"),
    attr(imgTag, "data-image"),
    attr(imgTag, "data-background"),
    attr(wrapTag, "data-desktop"),
    attr(wrapTag, "data-src"),
    attr(wrapTag, "data-image"),
    attr(wrapTag, "data-background"),
    attr(wrapTag, "data-lazy"),
    block.match(/<source\b[^>]*\bsrcset=(['"])([^'"]+)\1/i)?.[2]?.split(/\s/)[0],
  ];
  const found = candidates.find((value) => value && !value.startsWith("data:"));
  return found ? absolutizeProtocolRelative(found) : null;
}

export const SMART_SLIDER_COMPAT_CSS = `
ss3-force-full-width {
  display: block !important;
  opacity: 1 !important;
  position: relative;
  width: 100vw;
  max-width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  transform: none;
}
.n2-ss-slide-background-image picture,
.n2-ss-slide-background-image img {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
  opacity: 1 !important;
  visibility: visible !important;
}
.n2-ss-slider.n2-ss-loaded .n2-ss-layers-container,
.n2-ss-slider.n2-ss-loaded .n2-ss-static-slide {
  opacity: 1 !important;
}
`.trim();

export function hydrateSmartSliderHtml(html: string): string {
  let next = html.replace(/<ss3-force-full-width\b([^>]*)>/gi, (tag) =>
    mergeInlineStyle(tag, "display:block;opacity:1"),
  );

  next = next.replace(/<div\b([^>]*\bn2-ss-slider(?!-)[^>]*)>/gi, (tag) =>
    addClass(removeClass(tag, "n2-ss-feature-post-bg-loader"), "n2-ss-loaded"),
  );

  next = next.replace(/<div\b([^>]*\bn2-ss-slide-background(?!-)[^>]*)>/gi, (tag) => {
    const isFirst = /data-public-id=(['"])1\1/.test(tag);
    return mergeInlineStyle(
      tag,
      isFirst ? "transform:none;opacity:1;z-index:20" : "transform:none;opacity:1",
    );
  });

  next = next.replace(
    /<div\b([^>]*\bn2-ss-slide-background-image\b[^>]*)>([\s\S]*?)<\/div>/gi,
    (full, attrs: string, inner: string) => {
      const wrapTag = `<div${attrs}>`;
      const url = resolveSlideImageUrl(full);
      const x = attr(wrapTag, "data-x") || "50";
      const y = attr(wrapTag, "data-y") || "50";
      let hydratedInner = inner.replace(/\bsrc=(['"])\/\//gi, "src=$1https://");
      const imgTag = hydratedInner.match(/<img\b[^>]*>/i)?.[0];
      if (url && imgTag && (!attr(imgTag, "src") || attr(imgTag, "src")?.startsWith("//"))) {
        const safe = url.replace(/"/g, "&quot;");
        if (/\bsrc=/.test(imgTag)) {
          hydratedInner = hydratedInner.replace(/\bsrc=(['"])[^'"]*\1/i, `src="${safe}"`);
        } else {
          hydratedInner = hydratedInner.replace(/<img\b/i, `<img src="${safe}"`);
        }
      }

      const desktop = attr(wrapTag, "data-desktop") || attr(imgTag, "data-desktop");
      const tablet = attr(wrapTag, "data-tablet") || attr(imgTag, "data-tablet");
      const mobile = attr(wrapTag, "data-mobile") || attr(imgTag, "data-mobile");
      if (desktop && tablet && mobile && !/<source\b/i.test(hydratedInner)) {
        hydratedInner = hydratedInner.replace(
          /<picture\b[^>]*>/i,
          (pictureTag) =>
            `${pictureTag}<source media="(max-width: 700px)" srcset="${absolutizeProtocolRelative(mobile)}"><source media="(max-width: 1199px)" srcset="${absolutizeProtocolRelative(tablet)}">`,
        );
      }

      const styleExtra = url
        ? `--ss-o-pos-x:${x}%;--ss-o-pos-y:${y}%;background-image:url('${cssUrl(url)}');background-size:cover;background-repeat:no-repeat;background-position:${x}% ${y}%`
        : `--ss-o-pos-x:${x}%;--ss-o-pos-y:${y}%`;
      return `${mergeInlineStyle(wrapTag, styleExtra)}${hydratedInner}</div>`;
    },
  );

  next = next.replace(
    /<(img|source)\b([^>]*\bsrc=(['"])\/\/[^'"]*\3[^>]*)>/gi,
    (tag) => tag.replace(/\bsrc=(['"])\/\//i, "src=$1https://"),
  );

  next = next.replace(/<video\b([^>]*\bn2-ss-slide-background-video\b[^>]*)>/gi, (tag) => {
    let updated = tag;
    if (!/\bmuted\b/i.test(updated)) updated = updated.replace("<video", "<video muted");
    if (!/\bplaysinline\b/i.test(updated)) updated = updated.replace("<video", "<video playsinline");
    if (!/\bautoplay\b/i.test(updated)) updated = updated.replace("<video", "<video autoplay");
    return updated;
  });

  next = next.replace(
    /<div\b([^>]*\bn2-ss-slide\b(?!-)[^>]*\bdata-first=(['"])1\2[^>]*)>/gi,
    (tag) => addClass(tag, "n2-ss-slide-active"),
  );

  return next;
}

function resolveElementImageUrl(imageWrap: HTMLElement, img: HTMLImageElement | null): string | null {
  const candidates = [
    img?.getAttribute("src"),
    img?.getAttribute("data-src"),
    img?.getAttribute("data-lazy"),
    img?.getAttribute("data-desktop"),
    img?.getAttribute("data-image"),
    img?.getAttribute("data-background"),
    imageWrap.getAttribute("data-desktop"),
    imageWrap.getAttribute("data-src"),
    imageWrap.getAttribute("data-image"),
    imageWrap.getAttribute("data-background"),
    imageWrap.getAttribute("data-lazy"),
    imageWrap.querySelector("source")?.getAttribute("srcset")?.split(/\s/)[0],
  ];
  const found = candidates.find((value) => value && !value.startsWith("data:"));
  return found ? absolutizeProtocolRelative(found) : null;
}

function layoutForceFullWidth(el: HTMLElement): () => void {
  el.style.display = "block";
  el.style.opacity = "1";

  const overflowX = el.getAttribute("data-overflow-x");
  if (overflowX && overflowX !== "none") {
    document.querySelectorAll(overflowX).forEach((node) => {
      (node as HTMLElement).style.overflowX = "hidden";
    });
  }

  const apply = () => {
    const selector = el.getAttribute("data-horizontal-selector") || "body";
    const target =
      selector === "body"
        ? document.body
        : (el.closest(selector) as HTMLElement | null) || document.body;
    const parent = el.parentElement;
    if (!parent) return;

    const targetRect = target.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const parentStyle = getComputedStyle(parent);
    const width = targetRect.width || document.body.clientWidth;
    const offset =
      -parentRect.left -
      (Number.parseInt(parentStyle.paddingLeft, 10) || 0) -
      (Number.parseInt(parentStyle.borderLeftWidth, 10) || 0) +
      targetRect.left;

    el.style.transform = "none";
    el.style.width = `${width}px`;
    el.style.maxWidth = `${width}px`;
    el.style.marginLeft = `${offset}px`;
    el.style.marginRight = "0";
  };

  apply();
  window.addEventListener("resize", apply);
  const observer =
    typeof ResizeObserver !== "undefined" && el.parentElement
      ? new ResizeObserver(apply)
      : null;
  observer?.observe(el.parentElement as Element);

  return () => {
    window.removeEventListener("resize", apply);
    observer?.disconnect();
  };
}

export function hydrateSmartSliderElement(root: ParentNode | Document | null): () => void {
  if (!root) return () => undefined;
  const scope = root instanceof Element ? root : document;
  const cleanups: Array<() => void> = [];

  scope.querySelectorAll("ss3-force-full-width").forEach((node) => {
    cleanups.push(layoutForceFullWidth(node as HTMLElement));
  });

  scope.querySelectorAll(".n2-ss-slider").forEach((slider) => {
    slider.classList.add("n2-ss-loaded");
    slider.classList.remove("n2-ss-feature-post-bg-loader");
    slider
      .querySelector(".n2-ss-slide[data-first='1']")
      ?.classList.add("n2-ss-slide-active");
  });

  scope.querySelectorAll<HTMLElement>(".n2-ss-slide-background").forEach((background) => {
    background.style.transform = "none";
    background.style.opacity = "1";
    if (background.getAttribute("data-public-id") === "1") {
      background.style.zIndex = "20";
    }
  });

  scope.querySelectorAll<HTMLElement>(".n2-ss-slide-background-image").forEach((imageWrap) => {
    const img = imageWrap.querySelector("img");
    const url = resolveElementImageUrl(imageWrap, img);
    if (!url) return;
    if (img && img.getAttribute("src") !== url) img.setAttribute("src", url);

    const desktop = img?.getAttribute("data-desktop") || imageWrap.getAttribute("data-desktop");
    const tablet = img?.getAttribute("data-tablet") || imageWrap.getAttribute("data-tablet");
    const mobile = img?.getAttribute("data-mobile") || imageWrap.getAttribute("data-mobile");
    const picture = imageWrap.querySelector("picture");
    if (picture && desktop && tablet && mobile && !picture.querySelector("source")) {
      const mobileSource = document.createElement("source");
      mobileSource.media = "(max-width: 700px)";
      mobileSource.srcset = absolutizeProtocolRelative(mobile);
      const tabletSource = document.createElement("source");
      tabletSource.media = "(max-width: 1199px)";
      tabletSource.srcset = absolutizeProtocolRelative(tablet);
      picture.insertBefore(tabletSource, picture.firstChild);
      picture.insertBefore(mobileSource, picture.firstChild);
    }

    const x = imageWrap.getAttribute("data-x") || "50";
    const y = imageWrap.getAttribute("data-y") || "50";
    imageWrap.style.setProperty("--ss-o-pos-x", `${x}%`);
    imageWrap.style.setProperty("--ss-o-pos-y", `${y}%`);
    imageWrap.style.backgroundImage = `url("${url}")`;
    imageWrap.style.backgroundSize = "cover";
    imageWrap.style.backgroundRepeat = "no-repeat";
    imageWrap.style.backgroundPosition = `${x}% ${y}%`;
  });

  scope.querySelectorAll<HTMLVideoElement>(".n2-ss-slide-background-video").forEach((video) => {
    video.muted = true;
    video.playsInline = true;
    video.querySelectorAll("source").forEach((source) => {
      const src = source.getAttribute("src");
      if (src?.startsWith("//")) source.setAttribute("src", `https:${src}`);
    });
    const first =
      video.closest(".n2-ss-slide-background")?.getAttribute("data-public-id") === "1";
    if (first || !video.closest(".n2-ss-slide-background")?.getAttribute("data-public-id")) {
      void video.play().catch(() => undefined);
    }
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}
