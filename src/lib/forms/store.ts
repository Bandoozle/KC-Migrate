import { supabaseConfig } from "@/lib/forms/config";

/** Server-only access to the form tables through Supabase's REST API (PostgREST). */
export type FormTable = "contact_submissions" | "newsletter_signups";

export type Delivery = "off" | "pending" | "sent" | "failed" | "skipped";

export type StoredRow = {
  id: string;
  created_at: string;
  email: string;
  wordpress_relay_status: Delivery;
  notification_status: Delivery;
  notification_attempts: number;
  autoresponse_status: Delivery;
} & Record<string, unknown>;

const TIMEOUT_MS = 8_000;

function headers(key: string, extra: Record<string, string> = {}): Record<string, string> {
  return {
    apikey: key,
    // Legacy service_role keys are JWTs and also go in Authorization; sb_secret_ keys do not
    ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}),
    "Content-Type": "application/json",
    ...extra,
  };
}

function endpoint(table: FormTable, query = ""): string | null {
  const config = supabaseConfig();
  return config ? `${config.url}/rest/v1/${table}${query ? `?${query}` : ""}` : null;
}

export function storeEnabled(): boolean {
  return supabaseConfig() !== null;
}

/**
 * Inserts a row. Returns the stored row, "duplicate" when the idempotency key
 * already exists, or null when the database could not be reached.
 */
export async function insertRow(
  table: FormTable,
  row: Record<string, unknown>,
): Promise<StoredRow | "duplicate" | null> {
  const config = supabaseConfig();
  const url = endpoint(table);
  if (!config || !url) return null;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers(config.key, { Prefer: "return=representation" }),
      body: JSON.stringify(row),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (response.status === 409) return "duplicate";
    if (!response.ok) {
      // PostgREST's code and message only: `details` can echo the submitted row
      const error = (await response.json().catch(() => null)) as { code?: string; message?: string } | null;
      console.error(`[forms] ${table} insert failed: HTTP ${response.status} ${error?.code ?? ""} ${error?.message ?? ""}`);
      return null;
    }
    const rows = (await response.json()) as StoredRow[];
    return rows[0] ?? null;
  } catch (error) {
    console.error(`[forms] ${table} insert failed: ${error instanceof Error ? error.name + " " + error.message : "unknown"}`);
    return null;
  }
}

export async function findByIdempotencyKey(table: FormTable, key: string): Promise<StoredRow | null> {
  const rows = await selectRows(table, `idempotency_key=eq.${encodeURIComponent(key)}&limit=1`);
  return rows[0] ?? null;
}

export async function selectRows(table: FormTable, query: string): Promise<StoredRow[]> {
  const config = supabaseConfig();
  const url = endpoint(table, query);
  if (!config || !url) return [];
  try {
    const response = await fetch(url, {
      headers: headers(config.key),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    return response.ok ? ((await response.json()) as StoredRow[]) : [];
  } catch {
    return [];
  }
}

/** Number of rows matching a PostgREST filter, or null when the count is unavailable. */
export async function countRows(table: FormTable, filter: string): Promise<number | null> {
  const config = supabaseConfig();
  const url = endpoint(table, `select=id&${filter}`);
  if (!config || !url) return null;
  try {
    const response = await fetch(url, {
      headers: headers(config.key, { Prefer: "count=exact", Range: "0-0" }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const total = response.headers.get("content-range")?.split("/")[1];
    const count = Number(total);
    return Number.isFinite(count) ? count : null;
  } catch {
    return null;
  }
}

export async function updateRow(
  table: FormTable,
  id: string,
  patch: Record<string, unknown>,
): Promise<boolean> {
  const config = supabaseConfig();
  const url = endpoint(table, `id=eq.${encodeURIComponent(id)}`);
  if (!config || !url) return false;
  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: headers(config.key, { Prefer: "return=minimal" }),
      body: JSON.stringify(patch),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export function sinceIso(ms: number): string {
  return new Date(Date.now() - ms).toISOString();
}
