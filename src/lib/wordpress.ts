import { cache } from "react";
import { getLocalPost } from "@/lib/content/local-articles";
import {
  recallWordPressBody,
  rememberWordPressBody,
  withWordPressSlot,
} from "@/lib/wordpress-fetch-guard";
import type {
  WordPressMedia,
  WordPressPage,
  WordPressPost,
} from "@/types/wordpress";

const DEFAULT_WORDPRESS_URL = "https://staging.kosick.com";
const API_PREFIX = "/wp-json/wp/v2";
export const REQUEST_TIMEOUT_MS = 15_000;
const MAX_PER_PAGE = 100;

/** Published page/post content. Short enough to pick up CMS edits, long enough that navigation does not wait on WordPress. */
export const WORDPRESS_REVALIDATE_SECONDS = 120;

const LIST_FIELDS = [
  "id",
  "slug",
  "date",
  "link",
  "featured_media",
  "title",
  "excerpt",
] as const;

export class WordPressApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly endpoint?: string,
  ) {
    super(message);
    this.name = "WordPressApiError";
  }
}

export function getWordPressUrl(): string {
  const configured = process.env.WORDPRESS_URL?.trim() || DEFAULT_WORDPRESS_URL;
  return configured.replace(/\/+$/, "");
}

function buildUrl(
  path: string,
  query: Record<string, string | number | undefined> = {},
): string {
  const url = new URL(`${API_PREFIX}${path}`, `${getWordPressUrl()}/`);

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === "") continue;
    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

function responseFromBody<T>(
  body: string,
  totalHeader: string | null,
  totalPagesHeader: string | null,
): { data: T; total: number; totalPages: number } {
  const data = JSON.parse(body) as T;
  const total = Number(totalHeader ?? 0);
  const totalPages = Number(totalPagesHeader ?? 1);
  return {
    data,
    total: Number.isFinite(total) ? total : 0,
    totalPages: Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1,
  };
}

async function wpFetch<T>(
  path: string,
  query: Record<string, string | number | undefined> = {},
): Promise<{ data: T; total: number; totalPages: number }> {
  const endpoint = buildUrl(path, query);

  try {
    return await withWordPressSlot(async () => {
      const response = await fetch(endpoint, {
        next: { revalidate: WORDPRESS_REVALIDATE_SECONDS },
        headers: {
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (!response.ok) {
        if (response.status >= 500) {
          const cached = recallWordPressBody(endpoint);
          if (cached) return responseFromBody<T>(cached, null, null);
        }
        throw new WordPressApiError(
          `WordPress API returned ${response.status} ${response.statusText} for ${path}.`,
          response.status,
          endpoint,
        );
      }

      const body = await response.text();
      try {
        const parsed = responseFromBody<T>(
          body,
          response.headers.get("X-WP-Total"),
          response.headers.get("X-WP-TotalPages"),
        );
        rememberWordPressBody(endpoint, body);
        return parsed;
      } catch {
        throw new WordPressApiError(
          `WordPress API returned a non-JSON response for ${path}. The staging site may be blocking or redirecting this request.`,
          response.status,
          endpoint,
        );
      }
    });
  } catch (error) {
    const unavailable =
      !(error instanceof WordPressApiError) || (error.status ?? 500) >= 500;
    if (unavailable) {
      const cached = recallWordPressBody(endpoint);
      if (cached) return responseFromBody<T>(cached, null, null);
    }

    if (error instanceof WordPressApiError) throw error;

    const reason = error instanceof Error ? error.message : "Unknown network error";
    throw new WordPressApiError(
      `Unable to reach WordPress at ${getWordPressUrl()}. ${reason}`,
      undefined,
      endpoint,
    );
  }
}

async function fetchAll<T>(
  path: string,
  query: Record<string, string | number | undefined> = {},
): Promise<T[]> {
  const firstPage = await wpFetch<T[]>(path, {
    ...query,
    page: 1,
    per_page: MAX_PER_PAGE,
  });

  if (firstPage.totalPages <= 1) {
    return firstPage.data;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
      wpFetch<T[]>(path, {
        ...query,
        page: index + 2,
        per_page: MAX_PER_PAGE,
      }),
    ),
  );

  return [
    ...firstPage.data,
    ...remainingPages.flatMap((page) => page.data),
  ];
}

export async function getPages(): Promise<WordPressPage[]> {
  return fetchAll<WordPressPage>("/pages", {
    _fields: LIST_FIELDS.join(","),
    orderby: "menu_order",
    order: "asc",
    status: "publish",
  });
}

export const getPageBySlug = cache(
  async (slug: string): Promise<WordPressPage | null> => {
    const { data } = await wpFetch<WordPressPage[]>("/pages", {
      slug,
      status: "publish",
    });

    return data[0] ?? null;
  },
);

export async function getPosts(perPage = 10): Promise<WordPressPost[]> {
  const { data } = await wpFetch<WordPressPost[]>("/posts", {
    _fields: LIST_FIELDS.join(","),
    per_page: Math.min(Math.max(perPage, 1), MAX_PER_PAGE),
    orderby: "date",
    order: "desc",
    status: "publish",
  });

  return data;
}

async function fetchPostsBySlug(origin: string, slug: string): Promise<WordPressPost[]> {
  const url = new URL(`${API_PREFIX}/posts`, `${origin}/`);
  url.searchParams.set("slug", slug);
  url.searchParams.set("status", "publish");

  const endpoint = url.toString();
  try {
    return await withWordPressSlot(async () => {
      const response = await fetch(url, {
        next: { revalidate: WORDPRESS_REVALIDATE_SECONDS },
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (!response.ok) {
        if (response.status >= 500) {
          const cached = recallWordPressBody(endpoint);
          if (cached) {
            const data = JSON.parse(cached) as WordPressPost[];
            return Array.isArray(data) ? data : [];
          }
        }
        throw new WordPressApiError(
          `WordPress API returned ${response.status} for post "${slug}".`,
          response.status,
          endpoint,
        );
      }

      const body = await response.text();
      const data = JSON.parse(body) as WordPressPost[];
      rememberWordPressBody(endpoint, body);
      return Array.isArray(data) ? data : [];
    });
  } catch (error) {
    const unavailable =
      !(error instanceof WordPressApiError) || (error.status ?? 500) >= 500;
    if (unavailable) {
      const cached = recallWordPressBody(endpoint);
      if (cached) {
        const data = JSON.parse(cached) as WordPressPost[];
        return Array.isArray(data) ? data : [];
      }
    }
    if (error instanceof WordPressApiError) throw error;
    const reason = error instanceof Error ? error.message : "Unknown network error";
    throw new WordPressApiError(
      `Unable to reach WordPress at ${origin}. ${reason}`,
      undefined,
      endpoint,
    );
  }
}

export async function getPostBySlug(
  slug: string,
): Promise<WordPressPost | null> {
  const local = getLocalPost(slug);
  if (local) return local;

  try {
    const primary = await fetchPostsBySlug(getWordPressUrl(), slug);
    return primary[0] ?? null;
  } catch {
    return null;
  }
}

export async function getMedia(id: number): Promise<WordPressMedia | null> {
  if (!id) return null;

  try {
    const { data } = await wpFetch<WordPressMedia>(`/media/${id}`);
    return data;
  } catch {
    return null;
  }
}

export function decodeRenderedText(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCharCode(Number(code)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCharCode(Number.parseInt(code, 16)),
    )
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

export type WordPressLoadResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function loadWordPressData<T>(
  loader: () => Promise<T>,
): Promise<WordPressLoadResult<T>> {
  try {
    return { ok: true, data: await loader() };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while contacting WordPress.";

    return { ok: false, error: message };
  }
}
