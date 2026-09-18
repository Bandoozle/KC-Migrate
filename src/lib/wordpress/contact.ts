import { cache } from "react";
import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";
import type { Element } from "domhandler";
import {
  decodeRenderedText,
  getPageBySlug,
  getWordPressUrl,
  WordPressApiError,
} from "@/lib/wordpress";
import { absUrl, cleanText, textFrom } from "@/lib/wordpress/shared";
import { getKadenceForm } from "@/lib/wordpress/kadence-forms";

export type ContactOffice = {
  label: string;
  address: string;
};

export type ContactDetailLink = {
  label: string;
  display: string;
  href: string;
};

export type ContactPageContent = {
  title: string;
  excerpt: string;
  info: {
    eyebrow: string;
    company: string;
    phone: ContactDetailLink;
    email: ContactDetailLink;
    offices: ContactOffice[];
    servicing: string;
    image: { src: string; alt: string } | null;
  };
  formSection: {
    heading: string;
    lead: string;
    phone: ContactDetailLink;
    email: ContactDetailLink;
    location: { label: string; display: string };
  };
  form: ReturnType<typeof getKadenceForm>;
};

function nodeText($: CheerioAPI, el: Element | null | undefined): string {
  return el ? textFrom($, el) : "";
}

function decodeObfuscatedEmail(display: string, href: string): string {
  if (href.startsWith("mailto:")) {
    const fromHref = href.replace(/^mailto:/i, "").trim();
    if (fromHref.includes("@")) return fromHref;
  }
  const reversed = display.split("").reverse().join("");
  if (reversed.includes("@") && reversed.includes(".")) return reversed;
  return display;
}

function parseOffices($: CheerioAPI, scope: Element): ContactOffice[] {
  const headings = $(scope)
    .find("h4, .wp-block-kadence-advancedheading")
    .toArray()
    .map((el) => nodeText($, el))
    .filter(Boolean);

  const offices: ContactOffice[] = [];
  for (let i = 0; i < headings.length; i += 1) {
    const label = headings[i];
    if (!/:$/.test(label)) continue;
    const address = headings[i + 1];
    if (!address || /:$/.test(address)) continue;
    offices.push({
      label: cleanText(label.replace(/:$/, "")),
      address: cleanText(address),
    });
  }
  return offices;
}

function normalizeContactHtml(
  html: string,
  pageTitle: string,
  excerpt: string,
): ContactPageContent {
  const origin = getWordPressUrl();
  const $ = cheerio.load(`<div id="contact-root">${html}</div>`);
  const rows = $("#contact-root")
    .find(".kb-row-layout-wrap")
    .toArray()
    .filter((row) => $(row).parents(".kb-row-layout-wrap").length === 0);

  const infoRow = rows[0];
  const formRow = rows[1] || rows[0];

  const infoHeadings = infoRow
    ? $(infoRow)
        .find("h1, h2, h3, h4, .wp-block-kadence-advancedheading")
        .toArray()
        .map((el) => nodeText($, el))
        .filter(Boolean)
    : [];

  const phoneLink = infoRow ? $(infoRow).find('a[href^="tel:"]').first() : null;
  const emailLink = infoRow ? $(infoRow).find('a[href^="mailto:"]').first() : null;

  const phoneDisplay =
    (phoneLink ? cleanText(phoneLink.text()) : "") || "+1 (604) 925-5800";
  const emailHref = emailLink?.attr("href") || "mailto:info@kosick.com";
  const emailDisplay = decodeObfuscatedEmail(
    (emailLink ? cleanText(emailLink.text()) : "") || "info@kosick.com",
    emailHref,
  );

  const img = infoRow ? $(infoRow).find("img").first() : null;
  const imgSrc = img
    ? absUrl(img.attr("src") || img.attr("data-src"), origin)
    : null;

  const servicing =
    infoHeadings.find((h) => /proudly servicing/i.test(h)) ||
    "Proudly Servicing: Canada, USA & Mexico";

  const formHeadings = formRow
    ? $(formRow)
        .find("h1, h2, h3, .wp-block-kadence-advancedheading")
        .toArray()
        .map((el) => nodeText($, el))
        .filter(Boolean)
    : [];

  const formLead = formRow
    ? $(formRow)
        .find("p")
        .toArray()
        .map((p) => nodeText($, p))
        .find((t) => t.length > 40 && !/^call us|^email us|^locations/i.test(t)) ||
      ""
    : "";

  const formPhone = formRow ? $(formRow).find('a[href^="tel:"]').first() : phoneLink;
  const formEmail = formRow
    ? $(formRow).find('a[href^="mailto:"]').first()
    : emailLink;

  return {
    title: cleanText(decodeRenderedText(pageTitle)) || "Contact",
    excerpt: cleanText(decodeRenderedText(excerpt)),
    info: {
      eyebrow:
        infoHeadings.find((h) => /contact information/i.test(h)) ||
        "Contact Information",
      company:
        infoHeadings.find((h) => /kosick communications/i.test(h)) ||
        "Kosick Communications Ltd.",
      phone: {
        label: "Phone",
        display: phoneDisplay,
        href: phoneLink?.attr("href") || "tel:16049255800",
      },
      email: {
        label: "Email",
        display: emailDisplay,
        href: emailHref.startsWith("mailto:")
          ? emailHref
          : `mailto:${emailDisplay}`,
      },
      offices: infoRow ? parseOffices($, infoRow) : [],
      servicing,
      image: imgSrc
        ? {
            src: imgSrc,
            alt: img?.attr("alt") || "Contact Kosick Communications",
          }
        : null,
    },
    formSection: {
      heading:
        formHeadings.find((h) => /let('|’)s work/i.test(h)) ||
        "Let’s Work Together",
      lead:
        formLead ||
        "Ready to amplify your brand? Get in touch and let’s discuss how we can help you achieve your goals.",
      phone: {
        label: "Call us",
        display: (formPhone ? cleanText(formPhone.text()) : "") || phoneDisplay,
        href: formPhone?.attr("href") || "tel:16049255800",
      },
      email: {
        label: "Email us",
        display: decodeObfuscatedEmail(
          (formEmail ? cleanText(formEmail.text()) : "") || emailDisplay,
          formEmail?.attr("href") || emailHref,
        ),
        href: formEmail?.attr("href") || emailHref,
      },
      location: {
        label: "Locations",
        display: "Vancouver & Calgary",
      },
    },
    form: getKadenceForm("contact"),
  };
}

export const getContactPageContent = cache(async (): Promise<ContactPageContent> => {
  const page = await getPageBySlug("contact");
  if (!page?.content?.rendered) {
    throw new WordPressApiError(
      "Contact page content was not returned by WordPress REST.",
    );
  }

  return normalizeContactHtml(
    page.content.rendered,
    page.title.rendered,
    page.excerpt?.rendered || "",
  );
});
