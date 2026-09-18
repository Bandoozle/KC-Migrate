/**
 * Server-side Kadence Advanced Form configurations.
 * Field name attributes must match the WordPress form definitions.
 * IDs are never trusted from the browser — the API injects them.
 */

export type KadenceFormFieldType = "text" | "email" | "tel" | "textarea";

export type KadenceFormField = {
  /** HTML name attribute expected by Kadence. */
  name: string;
  label: string;
  required: boolean;
  type: KadenceFormFieldType;
  placeholder?: string;
  autoComplete?: string;
};

export type KadenceFormDefinition = {
  postId: string;
  formId: string;
  submitLabel: string;
  fields: Record<string, KadenceFormField>;
  /** After success: redirect path, or null for inline message. */
  successRedirect: string | null;
};

export const KADENCE_FORMS = {
  contact: {
    postId: "11283",
    formId: "11283-cpt-id",
    submitLabel: "Send Message",
    successRedirect: "/thanks/",
    fields: {
      name: {
        name: "field652327-6b",
        label: "Name",
        required: true,
        type: "text",
        placeholder: "Your name",
        autoComplete: "name",
      },
      email: {
        name: "field4d218f-d3",
        label: "Email",
        required: true,
        type: "email",
        placeholder: "Your Email",
        autoComplete: "email",
      },
      phone: {
        name: "field7ef1b0-96",
        label: "Phone Number",
        required: true,
        type: "tel",
        placeholder: "Phone number",
        autoComplete: "tel",
      },
      company: {
        name: "field02e9e9-ef",
        label: "Company",
        required: false,
        type: "text",
        placeholder: "Your company",
        autoComplete: "organization",
      },
      message: {
        name: "field34af12-76",
        label: "Message",
        required: false,
        type: "textarea",
        placeholder: "Tell us about your project...",
      },
    },
  },
  newsletter: {
    postId: "11281",
    formId: "11281-cpt-id",
    submitLabel: "Join",
    successRedirect: null,
    fields: {
      email: {
        name: "field3d8246-7e",
        label: "Email",
        required: true,
        type: "email",
        placeholder: "Your Email",
        autoComplete: "email",
      },
    },
  },
} as const satisfies Record<string, KadenceFormDefinition>;

export type KadenceFormKey = keyof typeof KADENCE_FORMS;

export function isKadenceFormKey(value: unknown): value is KadenceFormKey {
  return typeof value === "string" && value in KADENCE_FORMS;
}

export function getKadenceForm(key: KadenceFormKey): KadenceFormDefinition {
  return KADENCE_FORMS[key];
}
