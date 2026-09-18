/**
 * Server-side Gravity Forms configurations.
 * Field name attributes must match the WordPress form definitions.
 * Form IDs / state tokens are never trusted from the browser.
 */

export type GravityFormKey = "comfortmaker";

export type GravityFormDefinition = {
  /** Gravity Forms numeric form ID. */
  formId: number;
  /** WP page path used to refresh dynamic tokens and receive the POST. */
  pagePath: string;
  submitLabel: string;
  successMessage: string;
  maxFileBytes: number;
};

export const GRAVITY_FORMS = {
  comfortmaker: {
    formId: 9,
    pagePath: "/comfortmaker/",
    submitLabel: "Send",
    successMessage:
      "Thank you. Your NEE Conference registration has been submitted.",
    maxFileBytes: 104_857_600,
  },
} as const satisfies Record<GravityFormKey, GravityFormDefinition>;

export function isGravityFormKey(value: unknown): value is GravityFormKey {
  return typeof value === "string" && value in GRAVITY_FORMS;
}

export function getGravityForm(key: GravityFormKey): GravityFormDefinition {
  return GRAVITY_FORMS[key];
}

/** Province options for Comfortmaker registration. */
export const COMFORTMAKER_PROVINCES = [
  "Alberta",
  "Saskatchewan",
  "Manitoba",
] as const;

export const COMFORTMAKER_GENDERS = ["Male", "Female"] as const;

export const COMFORTMAKER_TERMS_TEXT =
  "Registrants passports must be valid up to November 1, 2026. Registrants are responsible to ensure they have full coverage personal travel and health insurance. All registrants must be over the age of 21 and a member of your companies ownership/management. Names cannot be changed after this forms submission without airline penalty. Registrants understand and accept full responsibility for all activities and participate at their own risk. Registrants accept responsibility for additional personal costs incurred. This trip is pre-paid and 100% non-refundable/non-cancellable for any reason. Dealers are responsible for all applicable fees associated with any revisions ($550-750pp + AFD) and/or the full amount of the trip in the event of a cancellation. National Energy Equipment Inc. reserves the right to change the terms and conditions at any time, dates, and destinations may change due to circumstances beyond our control. National Energy Equipment Inc. & Kosick Communications Ltd. are not liable or responsible for any and all claims, suits, damages, or judgements with respect to any action or inaction by the Registrant(s) in connection with the NEEI Conference. All accounts must be current and in good standing to attend the conference.";
