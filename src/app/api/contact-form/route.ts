import { after, NextResponse } from "next/server";
import { RATE_LIMITS, rateLimited } from "@/lib/rate-limit";
import { clientIp, filledTooFast, hashIp, turnstilePassed } from "@/lib/forms/spam";
import { processSubmission } from "@/lib/forms/submit";
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

/**
 * The page the form was on: the form's `_kosick_source`, else the Referer.
 * Resolved against the host this request came to, so `//other.host/…` or an
 * absolute URL elsewhere is dropped; only the pathname is kept (no query or hash).
 */
function sourcePath(value: FormDataEntryValue | null, request: Request): string | null {
  const candidate = clean(value) || request.headers.get("referer") || "";
  if (!candidate) return null;
  try {
    const host =
      request.headers.get("x-forwarded-host") || request.headers.get("host") || new URL(request.url).host;
    const url = new URL(candidate, `https://${host}`);
    if (url.host !== host || (url.protocol !== "https:" && url.protocol !== "http:")) return null;
    return url.pathname.length <= 300 ? url.pathname : null;
  } catch {
    return null;
  }
}

function failure(error: string, status: number) {
  return NextResponse.json({ ok: false, error } satisfies ValidationError, { status });
}

const GENERIC_FAILURE = "Unable to send your message right now.";

/**
 * Contact (Kadence form 11283) and newsletter (11281) submissions.
 * Clients send `formKey` and the field values, plus the form guard fields
 * (`_kosick_submission`, `_kosick_elapsed`, `_kosick_source`, Turnstile token).
 * Delivery order and success rules are in src/lib/forms/submit.ts; with no new
 * environment variables this is the WordPress relay it always was.
 */
export async function POST(request: Request) {
  const limited = rateLimited(request, RATE_LIMITS.lead);
  if (limited) return limited;

  let incoming: FormData;
  try {
    incoming = await request.formData();
  } catch {
    return failure("Invalid form submission.", 400);
  }

  const formKeyRaw = clean(incoming.get("formKey"));
  if (!isKadenceFormKey(formKeyRaw)) return failure("Unknown form.", 400);

  const formKey = formKeyRaw as KadenceFormKey;
  const form = getKadenceForm(formKey);
  const validated = validateForm(form, incoming);
  if (!validated.ok) {
    return NextResponse.json(validated, { status: 400 });
  }

  if (clean(incoming.get("_kosick_hp")) || filledTooFast(incoming.get("_kosick_elapsed"))) {
    return failure(GENERIC_FAILURE, 400);
  }

  const ip = clientIp(request);
  if (!(await turnstilePassed(incoming.get("cf-turnstile-response"), ip))) {
    return failure("Please complete the security check and try again.", 400);
  }

  const outcome = await processSubmission({
    kind: formKey,
    values: validated.values,
    submissionId: clean(incoming.get("_kosick_submission")) || null,
    sourcePath: sourcePath(incoming.get("_kosick_source"), request),
    ipHash: hashIp(ip),
  });

  if (outcome.status === "rate_limited") {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  }
  if (outcome.status === "failed") {
    return failure(
      outcome.relay === "rejected"
        ? "WordPress did not accept this submission. Please check your details and try again."
        : GENERIC_FAILURE,
      502,
    );
  }

  if (outcome.followUp) after(outcome.followUp);
  return NextResponse.json({
    ok: true,
    redirect: form.successRedirect,
    entryId: outcome.entryId,
  });
}
