import type { TranslationKeys } from "@/lib/translations";

/**
 * Merged sections of the console: one sidebar entry, several pages shown as
 * tabs. Each tab keeps its own route (old links and bookmarks still work);
 * the sidebar entry is active on every route of its section.
 *
 * Pure data + helpers (no React), so the sidebar and the tab bar read the
 * same definition and it can be unit-tested directly.
 */

export interface SectionTab {
  /** Route the tab opens. */
  path: string;
  /** Translation key of the tab label. */
  labelKey: keyof TranslationKeys;
  /** Other routes that belong to this tab (e.g. detail pages). */
  extraPaths?: readonly string[];
}

export type SectionId = "dashboard" | "marketplace" | "settings";

export const SECTION_TABS: Record<SectionId, readonly SectionTab[]> = {
  dashboard: [
    { path: "/", labelKey: "overview" },
    { path: "/analytics", labelKey: "analytics" },
  ],
  marketplace: [
    { path: "/marketplace", labelKey: "listings" },
    { path: "/marketplace/analytics", labelKey: "analytics" },
    { path: "/vendor-escrow-settings", labelKey: "escrow" },
  ],
  settings: [
    { path: "/profile", labelKey: "profile" },
    { path: "/settings", labelKey: "servicesTitle" },
    { path: "/roles-admins", labelKey: "rolesAdminsNav" },
    { path: "/audit-logs", labelKey: "auditLogs" },
  ],
};

/** True when `pathname` is `path` itself or a page below it (`/` matches only itself). */
export function pathMatches(pathname: string, path: string): boolean {
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

/**
 * The tab that is active for `pathname`. The most specific match wins, so
 * `/marketplace/analytics` selects "Analytics", not "Listings".
 */
export function activeTabPath(tabs: readonly SectionTab[], pathname: string): string | null {
  let best: { path: string; length: number } | null = null;
  for (const tab of tabs) {
    for (const candidate of [tab.path, ...(tab.extraPaths ?? [])]) {
      if (pathMatches(pathname, candidate) && (!best || candidate.length > best.length)) {
        best = { path: tab.path, length: candidate.length };
      }
    }
  }
  return best?.path ?? null;
}

/** Every route a sidebar entry should light up on: its section's tabs. */
export function sectionPaths(section: SectionId): string[] {
  return SECTION_TABS[section].flatMap((tab) => [tab.path, ...(tab.extraPaths ?? [])]);
}

/**
 * The tabs this admin can open: drops tabs they lack permission for
 * (`hiddenPaths`) and, for an events-only association, tabs outside `allowed`.
 */
export function visibleTabs(
  section: SectionId,
  opts: { hiddenPaths?: readonly string[]; eventsOnly?: boolean; isAllowed?: (path: string) => boolean } = {},
): SectionTab[] {
  return SECTION_TABS[section].filter(
    (tab) =>
      !(opts.hiddenPaths ?? []).includes(tab.path) &&
      (!opts.eventsOnly || !opts.isAllowed || opts.isAllowed(tab.path)),
  );
}
