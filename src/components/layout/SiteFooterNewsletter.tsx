"use client";

import { type FormEvent, useState } from "react";
import { FORM_NAMES, trackFormSuccess } from "@/lib/analytics/track";
import { SITE_FOOTER_NEWSLETTER } from "./site-footer-data";
import styles from "./SiteFooter.module.css";

export function SiteFooterNewsletter() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const { placeholder, submitLabel } = SITE_FOOTER_NEWSLETTER;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    setStatus("submitting");

    const data = new FormData(formEl);
    data.set("formKey", "newsletter");

    try {
      const response = await fetch("/api/contact-form", {
        method: "POST",
        body: data,
      });
      const result = (await response.json().catch(() => null)) as
        | { ok?: boolean }
        | null;
      if (!response.ok || !result?.ok) throw new Error("Newsletter submit failed");
      trackFormSuccess(FORM_NAMES.newsletter);
      formEl.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className={styles.newsletterForm} onSubmit={onSubmit} noValidate>
      <input type="hidden" name="formKey" value="newsletter" />
      <div className={styles.newsletterRow}>
        <label className={styles.srOnly} htmlFor="footer-newsletter-email">
          Email
        </label>
        <input
          id="footer-newsletter-email"
          name="field3d8246-7e"
          type="email"
          required
          autoComplete="email"
          placeholder={placeholder}
          className={styles.newsletterInput}
          disabled={status === "submitting"}
          aria-invalid={status === "error"}
        />
        <button
          type="submit"
          className={styles.newsletterButton}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "…" : submitLabel}
        </button>
      </div>
      {status === "success" ? (
        <p className={styles.newsletterStatus} role="status">
          Thanks — you&apos;re on the list.
        </p>
      ) : null}
      {status === "error" ? (
        <p className={styles.newsletterStatus} role="alert">
          Something went wrong. Please try again.
        </p>
      ) : null}
    </form>
  );
}
