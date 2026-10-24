"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useId, useState } from "react";
import { FORM_NAMES, trackFormSuccess } from "@/lib/analytics/track";
import { labelCase } from "@/lib/eyebrow";
import type { KadenceFormDefinition } from "@/lib/wordpress/kadence-forms";
import styles from "./ContactForm.module.css";

type ContactFormProps = {
  form: KadenceFormDefinition;
  formKey?: "contact";
  className?: string;
  /** Contact page treatment. The homepage keeps the default appearance. */
  appearance?: "default" | "studio";
};

type FieldErrors = Record<string, string>;

export function ContactForm({
  form,
  formKey = "contact",
  className,
  appearance = "default",
}: ContactFormProps) {
  const router = useRouter();
  const formDomId = useId();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const formEl = event.currentTarget;
    setStatus("submitting");
    setErrorMessage(null);
    setFieldErrors({});

    const data = new FormData(formEl);
    if (!data.get("formKey")) data.set("formKey", formKey);

    try {
      const response = await fetch("/api/contact-form/", {
        method: "POST",
        body: data,
      });
      const result = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        fields?: FieldErrors;
        redirect?: string | null;
      } | null;

      if (!response.ok || !result?.ok) {
        if (result?.fields) setFieldErrors(result.fields);
        setErrorMessage(
          result?.error || "Something went wrong. Please try again or email us directly.",
        );
        setStatus("error");
        return;
      }

      // Fire only after confirmed WP success — never on validation failure.
      trackFormSuccess(FORM_NAMES.contact, {
        email: String(data.get(form.fields.email.name) || ""),
        phone: String(data.get(form.fields.phone.name) || ""),
        formId: "kb-adv-form-11283-cpt-id",
      });
      router.push(result.redirect || "/thanks/");
    } catch {
      setErrorMessage("Something went wrong. Please try again or email us directly.");
      setStatus("error");
    }
  }

  const fieldEntries = Object.entries(form.fields);
  const nameField = form.fields.name;
  const emailField = form.fields.email;
  const restFields = fieldEntries.filter(
    ([key]) => key !== "name" && key !== "email",
  );
  const studio = appearance === "studio";

  function renderField(key: string, field: (typeof form.fields)[string] | undefined) {
    if (!field) return null;
    const inputId = `${formDomId}-${key}`;
    const error = fieldErrors[key];
    return (
      <div key={key} className={styles.field}>
        <label className={styles.label} htmlFor={inputId}>
          {labelCase(field.label)}
          {field.required ? (
            studio ? (
              <span className={styles.required}>
                <span aria-hidden="true"> *</span>
                <span className={styles.srOnly}> required</span>
              </span>
            ) : (
              <span aria-hidden="true">*</span>
            )
          ) : null}
        </label>
        {field.type === "textarea" ? (
          <textarea
            id={inputId}
            name={field.name}
            rows={studio ? 6 : 4}
            placeholder={field.placeholder}
            required={field.required}
            disabled={status === "submitting"}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
          />
        ) : (
          <input
            id={inputId}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            autoComplete={field.autoComplete}
            disabled={status === "submitting"}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
          />
        )}
        {error ? (
          <p id={`${inputId}-error`} className={styles.fieldError} role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form
      className={[styles.form, studio ? styles.studio : "", className].filter(Boolean).join(" ")}
      onSubmit={onSubmit}
      noValidate
    >
      <input type="hidden" name="formKey" value={formKey} />
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={`${formDomId}-hp`}>Company website</label>
        <input
          id={`${formDomId}-hp`}
          name="_kosick_hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>
      {studio ? (
        <>
          <div className={styles.row}>
            {renderField("name", nameField)}
            {renderField("email", emailField)}
          </div>
          <div className={styles.row}>
            {renderField("phone", form.fields.phone)}
            {renderField("company", form.fields.company)}
          </div>
          {renderField("message", form.fields.message)}
        </>
      ) : (
        <>
          <div className={styles.row}>
            {renderField("name", nameField)}
            {renderField("email", emailField)}
          </div>
          {restFields.map(([key, field]) => renderField(key, field))}
        </>
      )}

      {status === "error" && errorMessage ? (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        className={styles.submit}
        type="submit"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending…" : form.submitLabel}
      </button>
    </form>
  );
}
