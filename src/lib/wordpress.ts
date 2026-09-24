import { cache } from "react";
import type {
  WordPressMedia,
  WordPressPage,
  WordPressPost,
} from "@/types/wordpress";

const DEFAULT_WORDPRESS_URL = "https://staging.kosick.com";
const API_PREFIX = "/wp-json/wp/v2";
const REQUEST_TIMEOUT_MS = 15_000;
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

async function wpFetch<T>(
  path: string,
  query: Record<string, string | number | undefined> = {},
): Promise<{ data: T; total: number; totalPages: number }> {
  const endpoint = buildUrl(path, query);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      next: { revalidate: WORDPRESS_REVALIDATE_SECONDS },
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof WordPressApiError) throw error;

    const reason =
      error instanceof Error ? error.message : "Unknown network error";
    throw new WordPressApiError(
      `Unable to reach WordPress at ${getWordPressUrl()}. ${reason}`,
      undefined,
      endpoint,
    );
  }

  if (!response.ok) {
    throw new WordPressApiError(
      `WordPress API returned ${response.status} ${response.statusText} for ${path}.`,
      response.status,
      endpoint,
    );
  }

  let data: T;
  try {
    data = (await response.json()) as T;
  } catch {
    throw new WordPressApiError(
      `WordPress API returned a non-JSON response for ${path}. The staging site may be blocking or redirecting this request.`,
      response.status,
      endpoint,
    );
  }

  const total = Number(response.headers.get("X-WP-Total") ?? 0);
  const totalPages = Number(response.headers.get("X-WP-TotalPages") ?? 1);

  return {
    data,
    total: Number.isFinite(total) ? total : 0,
    totalPages: Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1,
  };
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

export async function getPostBySlug(
  slug: string,
): Promise<WordPressPost | null> {
  const { data } = await wpFetch<WordPressPost[]>("/posts", {
    slug,
    status: "publish",
  });

  return data[0] ?? null;
}

export async function getMedia(id: number): Promise<WordPressMedia | null> {
  if (!id) return null;

  try {
    const { data } = await wpFetch<WordPressMedia>(`/media/${id}`);
    return data;
  } catch (error) {
    if (error instanceof WordPressApiError && error.status === 404) {
      return null;
    }

    throw error;
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
