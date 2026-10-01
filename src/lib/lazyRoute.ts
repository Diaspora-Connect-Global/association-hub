import { lazy, type ComponentType } from "react";

const RELOAD_STAMP_KEY = "association-hub:chunk-reload-at";
/** At most one automatic reload in this window, so a truly missing chunk can't loop. */
const RELOAD_WINDOW_MS = 10_000;

/**
 * `React.lazy` for a route page that survives a redeploy.
 *
 * Route chunks are content-hashed and the previous deploy's files are gone once
 * a new one is live, so a tab opened before the deploy fails to import a page it
 * hasn't visited yet. Reloading once fetches the new index and its new chunk
 * names. If the import fails again within the window, the error is rethrown for
 * the route error boundary to show.
 */
export function lazyRoute<T extends ComponentType>(factory: () => Promise<{ default: T }>) {
  return lazy(() =>
    factory().catch((error: unknown) => {
      let lastReload = 0;
      try {
        lastReload = Number(window.sessionStorage.getItem(RELOAD_STAMP_KEY) ?? 0);
      } catch {
        // Storage unavailable (private mode): fall through to a single reload attempt.
      }
      if (Date.now() - lastReload > RELOAD_WINDOW_MS) {
        try {
          window.sessionStorage.setItem(RELOAD_STAMP_KEY, String(Date.now()));
        } catch {
          // ignore
        }
        window.location.reload();
        // Keep the Suspense fallback up until the reload replaces the page.
        return new Promise<{ default: T }>(() => {});
      }
      throw error;
    }),
  );
}
