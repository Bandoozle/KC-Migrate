/** Caps simultaneous WordPress requests inside one server process. */
const WORDPRESS_FETCH_CONCURRENCY = 4;

let active = 0;
const waiters: Array<() => void> = [];

const lastGoodBody = new Map<string, string>();
const MAX_CACHED_BODIES = 200;

export async function withWordPressSlot<T>(task: () => Promise<T>): Promise<T> {
  if (active >= WORDPRESS_FETCH_CONCURRENCY) {
    await new Promise<void>((resolve) => {
      waiters.push(resolve);
    });
  } else {
    active += 1;
  }

  try {
    return await task();
  } finally {
    const next = waiters.shift();
    if (next) next();
    else active -= 1;
  }
}

export function rememberWordPressBody(url: string, body: string) {
  if (lastGoodBody.has(url)) lastGoodBody.delete(url);
  lastGoodBody.set(url, body);
  while (lastGoodBody.size > MAX_CACHED_BODIES) {
    const oldest = lastGoodBody.keys().next().value;
    if (!oldest) break;
    lastGoodBody.delete(oldest);
  }
}

export function recallWordPressBody(url: string): string | null {
  return lastGoodBody.get(url) ?? null;
}
