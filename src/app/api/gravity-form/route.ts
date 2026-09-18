import { NextResponse } from "next/server";
import { getWordPressUrl } from "@/lib/wordpress";
import {
  getGravityForm,
  isGravityFormKey,
  type GravityFormKey,
} from "@/lib/wordpress/gravity-forms";

export const runtime = "nodejs";

type ValidationError = {
  ok: false;
  error: string;
  fields?: Record<string, string>;
};

function clean(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isFile(value: FormDataEntryValue | null): value is File {
  return typeof File !== "undefined" && value instanceof File && value.size > 0;
}

type DynamicTokens = {
  state: string;
  currency: string;
  styleSettings: string;
};

async function fetchDynamicTokens(pagePath: string): Promise<DynamicTokens | null> {
  const url = `${getWordPressUrl()}${pagePath}`;
  try {
    const response = await fetch(url, {
      headers: { Accept: "text/html" },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const html = await response.text();

    const state = html.match(/name=['"]state_9['"]\s+value=['"]([^'"]+)['"]/i)?.[1];
    const currency = html.match(
      /name=['"]gform_currency['"]\s+value=['"]([^'"]+)['"]/i,
    )?.[1];
    const styleSettings = html.match(
      /name=['"]gform_style_settings['"]\s+value=['"]([^'"]+)['"]/i,
    )?.[1];

    if (!state || !currency) return null;
    return {
      state,
      currency,
      styleSettings: styleSettings || '{"inputPrimaryColor":"#204ce5"}',
    };
  } catch {
    return null;
  }
}

function validateComfortmaker(incoming: FormData): ValidationError | null {
  const fields: Record<string, string> = {};
  const requiredText = [
    ["businessName", "input_26", "Full Business Name"],
    ["province", "input_27", "Province"],
    ["email", "input_9", "Email"],
    ["phone", "input_8", "Phone"],
    ["traveller1Name", "input_34.3", "Traveller 1 name"],
    ["traveller1Gender", "input_36.2", "Traveller 1 gender"],
    ["traveller2Name", "input_28.3", "Traveller 2 name"],
    ["traveller2Gender", "input_41.2", "Traveller 2 gender"],
    ["addr1Street", "input_54.1", "Traveller 1 street address"],
    ["addr1City", "input_54.3", "Traveller 1 city"],
    ["addr1Province", "input_54.4", "Traveller 1 province"],
    ["addr1Postal", "input_54.5", "Traveller 1 postal code"],
    ["addr2Street", "input_55.1", "Traveller 2 street address"],
    ["addr2City", "input_55.3", "Traveller 2 city"],
    ["addr2Province", "input_55.4", "Traveller 2 province"],
    ["addr2Postal", "input_55.5", "Traveller 2 postal code"],
  ] as const;

  for (const [key, name, label] of requiredText) {
    if (!clean(incoming.get(name))) {
      fields[key] = `${label} is required.`;
    }
  }

  const email = clean(incoming.get("input_9"));
  if (email && !isValidEmail(email)) {
    fields.email = "Enter a valid email address.";
  }

  const bday1 = incoming.getAll("input_39[]").map(clean).filter(Boolean);
  const bday2 = incoming.getAll("input_42[]").map(clean).filter(Boolean);
  if (bday1.length < 3) fields.traveller1Birthday = "Traveller 1 birthday is required.";
  if (bday2.length < 3) fields.traveller2Birthday = "Traveller 2 birthday is required.";

  if (clean(incoming.get("input_52.1")) !== "1") {
    fields.terms = "You must agree to the Terms & Conditions.";
  }

  const form = getGravityForm("comfortmaker");
  for (const [key, name] of [
    ["passport1", "input_46"],
    ["passport2", "input_48"],
  ] as const) {
    const file = incoming.get(name);
    if (!isFile(file)) {
      fields[key] = "Passport image is required.";
      continue;
    }
    if (file.size > form.maxFileBytes) {
      fields[key] = "File must be 100 MB or smaller.";
    }
  }

  // Honeypot must stay empty.
  if (clean(incoming.get("input_56"))) {
    return { ok: false, error: "Unable to submit registration." };
  }

  if (Object.keys(fields).length > 0) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fields,
    };
  }

  return null;
}

function appendBirthday(
  payload: FormData,
  incoming: FormData,
  fieldName: string,
) {
  const values = incoming.getAll(fieldName).map(clean);
  for (const value of values) {
    if (value) payload.append(fieldName, value);
  }
}

function buildComfortmakerPayload(
  incoming: FormData,
  tokens: DynamicTokens,
): FormData {
  const payload = new FormData();
  const textFields = [
    "input_26",
    "input_27",
    "input_9",
    "input_8",
    "input_34.3",
    "input_36.2",
    "input_28.3",
    "input_41.2",
    "input_54.1",
    "input_54.3",
    "input_54.4",
    "input_54.5",
    "input_55.1",
    "input_55.3",
    "input_55.4",
    "input_55.5",
  ];

  for (const name of textFields) {
    payload.set(name, clean(incoming.get(name)));
  }

  payload.set("input_54.6", "");
  payload.set("input_55.6", "");
  appendBirthday(payload, incoming, "input_39[]");
  appendBirthday(payload, incoming, "input_42[]");

  payload.set("input_52.1", "1");
  payload.set("input_52.2", "I agree to the Terms & Conditions:");
  payload.set("input_52.3", "38");
  payload.set("input_56", "");

  const passport1 = incoming.get("input_46");
  const passport2 = incoming.get("input_48");
  if (isFile(passport1)) payload.set("input_46", passport1, passport1.name);
  if (isFile(passport2)) payload.set("input_48", passport2, passport2.name);

  payload.set("MAX_FILE_SIZE", String(getGravityForm("comfortmaker").maxFileBytes));
  payload.set("gform_submission_method", "postback");
  payload.set("gform_theme", "gravity-theme");
  payload.set("gform_style_settings", tokens.styleSettings);
  payload.set("is_submit_9", "1");
  payload.set("gform_submit", "9");
  payload.set("gform_currency", tokens.currency);
  payload.set("gform_unique_id", "");
  payload.set("state_9", tokens.state);
  payload.set("gform_target_page_number_9", "0");
  payload.set("gform_source_page_number_9", "1");
  payload.set("gform_field_values", "");

  return payload;
}

function looksSuccessful(html: string): boolean {
  const lower = html.toLowerCase();
  if (lower.includes("gform_confirmation_message")) return true;
  if (lower.includes("gform_validation_error") || lower.includes("gfield_error")) {
    return false;
  }
  if (lower.includes("thank you") && !lower.includes("gform_wrapper_9")) return true;
  // Successful postback often removes the form or shows confirmation.
  if (!lower.includes("gform_wrapper_9") && lower.includes("nee conference")) {
    return true;
  }
  return false;
}

/**
 * Gravity Forms proxy.
 * Clients send `formKey` + field values/files; server injects dynamic GF tokens.
 */
export async function POST(request: Request) {
  let incoming: FormData;
  try {
    incoming = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid form submission." } satisfies ValidationError,
      { status: 400 },
    );
  }

  const formKeyRaw = clean(incoming.get("formKey"));
  if (!isGravityFormKey(formKeyRaw)) {
    return NextResponse.json(
      { ok: false, error: "Unknown form." } satisfies ValidationError,
      { status: 400 },
    );
  }

  const formKey = formKeyRaw as GravityFormKey;
  const form = getGravityForm(formKey);

  if (formKey === "comfortmaker") {
    const validationError = validateComfortmaker(incoming);
    if (validationError) {
      return NextResponse.json(validationError, { status: 400 });
    }
  }

  const tokens = await fetchDynamicTokens(form.pagePath);
  if (!tokens) {
    return NextResponse.json(
      { ok: false, error: "Unable to prepare registration right now." },
      { status: 502 },
    );
  }

  const payload = buildComfortmakerPayload(incoming, tokens);
  const endpoint = `${getWordPressUrl()}${form.pagePath}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: payload,
      redirect: "manual",
      headers: {
        // Mimic browser form post; GF checks referer on some installs.
        Referer: endpoint,
      },
    });

    const html =
      response.status === 302 || response.status === 303
        ? ""
        : await response.text().catch(() => "");

    if (response.status === 302 || response.status === 303 || looksSuccessful(html)) {
      return NextResponse.json({
        ok: true,
        message: form.successMessage,
      });
    }

    if (html.toLowerCase().includes("gfield_error") || html.toLowerCase().includes("validation")) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "WordPress rejected the registration. Please check your details and try again.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { ok: false, error: "Unable to submit registration right now." },
      { status: 502 },
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to submit registration right now." },
      { status: 502 },
    );
  }
}
