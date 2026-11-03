import { getWordPressUrl } from "@/lib/wordpress";

/**
 * POSTs JSON to a WordPress REST route (the AI Chat Assistant plugin on staging)
 * with a hard timeout, and normalises every failure into a status and a message
 * that is safe to show a visitor. The plugin stays the backend; this only adds
 * the guard rails a server-to-server relay needs.
 */

export type RelayResult =
  | { ok: true; status: number; data: Record<string, unknown> }
  | { ok: false; status: number; error: string };

type RelayOptions = {
  /** Path under /wp-json/, e.g. "aca/v1/chat". */
  route: string;
  body: unknown;
  timeoutMs: number;
  /** Shown to the visitor when WordPress is slow, down, or answers with something unexpected. */
  fallbackError: string;
  /**
   * Whether the plugin's own `error` text may be shown for a 5xx answer. The chat
   * route writes visitor-facing 5xx messages; other routes can return internal ones.
   */
  exposeServerErrors?: boolean;
  /** Log label, e.g. "chat". Request bodies are never logged. */
  label: string;
};

/** Statuses passed through unchanged: the visitor can act on them. Anything else becomes 502/504. */
const PASS_THROUGH = new Set([400, 422, 429, 503]);

export async function relayToWordPress(options: RelayOptions): Promise<RelayResult> {
  const { route, body, timeoutMs, fallbackError, exposeServerErrors = false, label } = options;
  const endpoint = `${getWordPressUrl()}/wp-json/${route}`;
  const started = Date.now();

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    const timedOut = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
    console.error(
      `[wordpress-relay] ${label} ${timedOut ? `timed out after ${timeoutMs}ms` : `failed: ${error instanceof Error ? error.name : "unknown"}`}`,
    );
    return { ok: false, status: timedOut ? 504 : 502, error: fallbackError };
  }

  // A Cloudflare challenge or PHP fatal arrives as HTML: treat any non-JSON answer as a failure
  const isJson = (response.headers.get("content-type") ?? "").includes("json");
  let data: Record<string, unknown> | null = null;
  try {
    data = isJson ? ((await response.json()) as Record<string, unknown>) : null;
  } catch {
    data = null;
  }
  // Drain a body we did not read so the connection can be reused
  if (!isJson) await response.body?.cancel().catch(() => {});

  if (response.ok && data && typeof data === "object" && !Array.isArray(data)) {
    return { ok: true, status: response.status, data };
  }

  const elapsed = Date.now() - started;
  console.error(
    `[wordpress-relay] ${label} HTTP ${response.status}${isJson ? "" : " (non-JSON)"} after ${elapsed}ms`,
  );

  const pluginError = typeof data?.error === "string" && data.error.trim() ? data.error.trim().slice(0, 300) : "";
  const passThrough = PASS_THROUGH.has(response.status);
  const showPluginError = pluginError && (passThrough || (exposeServerErrors && response.status >= 500));

  return {
    ok: false,
    status: passThrough ? response.status : 502,
    error: showPluginError ? pluginError : fallbackError,
  };
}
