"use client";

import { type FormEvent, useId, useState } from "react";
import { FORM_NAMES, trackFormSuccess } from "@/lib/analytics/track";
import {
  COMFORTMAKER_GENDERS,
  COMFORTMAKER_PROVINCES,
  COMFORTMAKER_TERMS_TEXT,
} from "@/lib/wordpress/gravity-forms";
import styles from "./ComfortmakerRegistrationForm.module.css";

type FieldErrors = Record<string, string>;

const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const YEAR_OPTIONS = (() => {
  const years: string[] = [];
  for (let y = 2027; y >= 1920; y -= 1) years.push(String(y));
  return years;
})();

export function ComfortmakerRegistrationForm() {
  const formDomId = useId();
  const days = DAY_OPTIONS;
  const months = MONTH_OPTIONS;
  const years = YEAR_OPTIONS;
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const formEl = event.currentTarget;
    setStatus("submitting");
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    const data = new FormData(formEl);
    data.set("formKey", "comfortmaker");

    try {
      const response = await fetch("/api/gravity-form", {
        method: "POST",
        body: data,
      });
      const result = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        message?: string;
        fields?: FieldErrors;
      } | null;

      if (!response.ok || !result?.ok) {
        if (result?.fields) setFieldErrors(result.fields);
        setErrorMessage(
          result?.error || "Something went wrong. Please try again.",
        );
        setStatus("error");
        return;
      }

      setSuccessMessage(
        result.message ||
          "Thank you. Your NEE Conference registration has been submitted.",
      );
      trackFormSuccess(FORM_NAMES.comfortmaker);
      setStatus("success");
      formEl.reset();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success" && successMessage) {
    return (
      <div className={styles.success} role="status">
        <p>{successMessage}</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate encType="multipart/form-data">
      <p className={styles.requiredNote}>* indicates required fields</p>

      {/* Honeypot — leave empty */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={`${formDomId}-hp`}>Phone</label>
        <input
          id={`${formDomId}-hp`}
          name="input_56"
          type="text"
          tabIndex={-1}
          autoComplete="new-password"
          defaultValue=""
        />
      </div>

      <div className={styles.row}>
        <Field
          id={`${formDomId}-biz`}
          label="Full Business Name"
          name="input_26"
          required
          error={fieldErrors.businessName}
          disabled={status === "submitting"}
        />
        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${formDomId}-prov`}>
            Province <span aria-hidden="true">*</span>
          </label>
          <select
            id={`${formDomId}-prov`}
            name="input_27"
            required
            disabled={status === "submitting"}
            className={fieldErrors.province ? styles.invalid : undefined}
            defaultValue=""
          >
            <option value="" disabled>
              Select Province
            </option>
            {COMFORTMAKER_PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {fieldErrors.province ? (
            <p className={styles.error}>{fieldErrors.province}</p>
          ) : null}
        </div>
      </div>

      <div className={styles.row}>
        <Field
          id={`${formDomId}-email`}
          label="Email"
          name="input_9"
          type="email"
          placeholder="EMAIL ADDRESS *"
          required
          error={fieldErrors.email}
          disabled={status === "submitting"}
          autoComplete="email"
        />
        <Field
          id={`${formDomId}-phone`}
          label="Phone"
          name="input_8"
          type="tel"
          placeholder="PHONE NUMBER *"
          required
          error={fieldErrors.phone}
          disabled={status === "submitting"}
          autoComplete="tel"
        />
      </div>

      <TravellerBlock
        formDomId={formDomId}
        index={1}
        nameField="input_34.3"
        genderField="input_36.2"
        birthdayField="input_39[]"
        passportField="input_46"
        streetField="input_54.1"
        cityField="input_54.3"
        provinceField="input_54.4"
        postalField="input_54.5"
        days={days}
        months={months}
        years={years}
        fieldErrors={fieldErrors}
        disabled={status === "submitting"}
        nameErrorKey="traveller1Name"
        genderErrorKey="traveller1Gender"
        birthdayErrorKey="traveller1Birthday"
        passportErrorKey="passport1"
        streetErrorKey="addr1Street"
        cityErrorKey="addr1City"
        provinceErrorKey="addr1Province"
        postalErrorKey="addr1Postal"
      />

      <TravellerBlock
        formDomId={formDomId}
        index={2}
        nameField="input_28.3"
        genderField="input_41.2"
        birthdayField="input_42[]"
        passportField="input_48"
        streetField="input_55.1"
        cityField="input_55.3"
        provinceField="input_55.4"
        postalField="input_55.5"
        days={days}
        months={months}
        years={years}
        fieldErrors={fieldErrors}
        disabled={status === "submitting"}
        nameErrorKey="traveller2Name"
        genderErrorKey="traveller2Gender"
        birthdayErrorKey="traveller2Birthday"
        passportErrorKey="passport2"
        streetErrorKey="addr2Street"
        cityErrorKey="addr2City"
        provinceErrorKey="addr2Province"
        postalErrorKey="addr2Postal"
      />

      <fieldset className={styles.terms}>
        <legend className={styles.sectionTitle}>Terms &amp; Conditions</legend>
        <p className={styles.termsText}>{COMFORTMAKER_TERMS_TEXT}</p>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            name="input_52.1"
            value="1"
            required
            disabled={status === "submitting"}
          />
          <span>
            I agree to the Terms &amp; Conditions: <span aria-hidden="true">*</span>
          </span>
        </label>
        {fieldErrors.terms ? <p className={styles.error}>{fieldErrors.terms}</p> : null}
      </fieldset>

      {errorMessage ? (
        <p className={styles.formError} role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button className={styles.submit} type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send"}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  name,
  type = "text",
  placeholder,
  required,
  error,
  disabled,
  autoComplete,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true">*</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={error ? styles.invalid : undefined}
      />
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}

function TravellerBlock({
  formDomId,
  index,
  nameField,
  genderField,
  birthdayField,
  passportField,
  streetField,
  cityField,
  provinceField,
  postalField,
  days,
  months,
  years,
  fieldErrors,
  disabled,
  nameErrorKey,
  genderErrorKey,
  birthdayErrorKey,
  passportErrorKey,
  streetErrorKey,
  cityErrorKey,
  provinceErrorKey,
  postalErrorKey,
}: {
  formDomId: string;
  index: 1 | 2;
  nameField: string;
  genderField: string;
  birthdayField: string;
  passportField: string;
  streetField: string;
  cityField: string;
  provinceField: string;
  postalField: string;
  days: string[];
  months: string[];
  years: string[];
  fieldErrors: FieldErrors;
  disabled: boolean;
  nameErrorKey: string;
  genderErrorKey: string;
  birthdayErrorKey: string;
  passportErrorKey: string;
  streetErrorKey: string;
  cityErrorKey: string;
  provinceErrorKey: string;
  postalErrorKey: string;
}) {
  const prefix = `${formDomId}-t${index}`;

  return (
    <fieldset className={styles.traveller}>
      <legend className={styles.sectionTitle}>Traveller {index}</legend>

      <Field
        id={`${prefix}-name`}
        label={`Traveller ${index}`}
        name={nameField}
        placeholder="NAME AS STATED ON PASSPORT *"
        required
        error={fieldErrors[nameErrorKey]}
        disabled={disabled}
        autoComplete="name"
      />

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${prefix}-gender`}>
            Gender <span aria-hidden="true">*</span>
          </label>
          <select
            id={`${prefix}-gender`}
            name={genderField}
            required
            disabled={disabled}
            defaultValue=""
            className={fieldErrors[genderErrorKey] ? styles.invalid : undefined}
          >
            <option value="" disabled>
              SELECT OPTION
            </option>
            {COMFORTMAKER_GENDERS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          {fieldErrors[genderErrorKey] ? (
            <p className={styles.error}>{fieldErrors[genderErrorKey]}</p>
          ) : null}
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>
          Birthday <span aria-hidden="true">*</span>
        </span>
        <div className={styles.birthday}>
          <select name={birthdayField} required disabled={disabled} defaultValue="" aria-label="Day">
            <option value="" disabled>
              Day
            </option>
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            name={birthdayField}
            required
            disabled={disabled}
            defaultValue=""
            aria-label="Month"
          >
            <option value="" disabled>
              Month
            </option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            name={birthdayField}
            required
            disabled={disabled}
            defaultValue=""
            aria-label="Year"
          >
            <option value="" disabled>
              Year
            </option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        {fieldErrors[birthdayErrorKey] ? (
          <p className={styles.error}>{fieldErrors[birthdayErrorKey]}</p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${prefix}-passport`}>
          Please Upload Clear Image Of Traveller {index} Passport Details{" "}
          <span aria-hidden="true">*</span>
        </label>
        <input
          id={`${prefix}-passport`}
          name={passportField}
          type="file"
          accept="image/*,.pdf"
          required
          disabled={disabled}
          className={fieldErrors[passportErrorKey] ? styles.invalid : undefined}
        />
        <p className={styles.hint}>Max 100 MB</p>
        {fieldErrors[passportErrorKey] ? (
          <p className={styles.error}>{fieldErrors[passportErrorKey]}</p>
        ) : null}
      </div>

      <div className={styles.address}>
        <p className={styles.addressTitle}>Home Address For Ticketing*</p>
        <Field
          id={`${prefix}-street`}
          label="Street Address"
          name={streetField}
          required
          error={fieldErrors[streetErrorKey]}
          disabled={disabled}
          autoComplete="street-address"
        />
        <div className={styles.row}>
          <Field
            id={`${prefix}-city`}
            label="City"
            name={cityField}
            required
            error={fieldErrors[cityErrorKey]}
            disabled={disabled}
            autoComplete="address-level2"
          />
          <Field
            id={`${prefix}-addr-prov`}
            label="Province"
            name={provinceField}
            required
            error={fieldErrors[provinceErrorKey]}
            disabled={disabled}
            autoComplete="address-level1"
          />
        </div>
        <Field
          id={`${prefix}-postal`}
          label="Postal Code"
          name={postalField}
          required
          error={fieldErrors[postalErrorKey]}
          disabled={disabled}
          autoComplete="postal-code"
        />
      </div>
    </fieldset>
  );
}
