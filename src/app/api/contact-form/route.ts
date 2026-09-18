import { NextResponse } from "next/server";
import { getWordPressUrl } from "@/lib/wordpress";
import {
  getKadenceForm,
  isKadenceFormKey,
  type KadenceFormDefinition,
  type KadenceFormKey,
} from "@/lib/wordpress/kadence-forms";

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

function validateForm(
  form: KadenceFormDefinition,
  incoming: FormData,
): { ok: true; values: Record<string, string> } | ValidationError {
  const values: Record<string, string> = {};
  const fieldErrors: Record<string, string> = {};

  for (const [key, field] of Object.entries(form.fields)) {
    const raw = clean(incoming.get(field.name) ?? incoming.get(key));
    values[key] = raw;

    if (field.required && !raw) {
      fieldErrors[key] = `${field.label} is required.`;
      continue;
    }
    if (!raw) continue;

    if (field.type === "email" && !isValidEmail(raw)) {
      fieldErrors[key] = "Enter a valid email address.";
    }
    if (raw.length > 5000) {
      fieldErrors[key] = `${field.label} is too long.`;
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fields: fieldErrors,
    };
  }

  return { ok: true, values };
}

function buildWordPressPayload(
  form: KadenceFormDefinition,
  values: Record<string, string>,
): FormData {
  const payload = new FormData();
  payload.set("action", "kb_process_advanced_form_submit");
  payload.set("_kb_adv_form_post_id", form.postId);
  payload.set("_kb_adv_form_id", form.formId);

  for (const [key, field] of Object.entries(form.fields)) {
    payload.set(field.name, values[key] ?? "");
  }

  return payload;
}

/**
 * Shared Kadence Advanced Form proxy.
 * Clients send `formKey` + field values; server injects WP form IDs.
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
  if (!isKadenceFormKey(formKeyRaw)) {
    return NextResponse.json(
      { ok: false, error: "Unknown form." } satisfies ValidationError,
      { status: 400 },
    );
  }

  const formKey = formKeyRaw as KadenceFormKey;
  const form = getKadenceForm(formKey);
  const validated = validateForm(form, incoming);
  if (!validated.ok) {
    return NextResponse.json(validated, { status: 400 });
  }

  const payload = buildWordPressPayload(form, validated.values);
  const endpoint = `${getWordPressUrl()}/wp-admin/admin-ajax.php`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: payload,
      redirect: "manual",
    });

    if (!response.ok && response.status !== 302) {
      return NextResponse.json(
        { ok: false, error: "Unable to send your message right now." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      redirect: form.successRedirect,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to send your message right now." },
      { status: 502 },
    );
  }
}
