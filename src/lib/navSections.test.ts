import { describe, it, expect } from "vitest";
import { SECTION_TABS, activeTabPath, pathMatches, sectionPaths, visibleTabs } from "./navSections";

describe("pathMatches", () => {
  it("matches a route and the pages below it, but not a look-alike", () => {
    expect(pathMatches("/marketplace/analytics", "/marketplace")).toBe(true);
    expect(pathMatches("/marketplacex", "/marketplace")).toBe(false);
  });

  it("matches the dashboard only on itself", () => {
    expect(pathMatches("/", "/")).toBe(true);
    expect(pathMatches("/analytics", "/")).toBe(false);
  });
});

describe("activeTabPath", () => {
  it("picks the most specific tab, so marketplace analytics is not shown as listings", () => {
    expect(activeTabPath(SECTION_TABS.marketplace, "/marketplace")).toBe("/marketplace");
    expect(activeTabPath(SECTION_TABS.marketplace, "/marketplace/analytics")).toBe("/marketplace/analytics");
  });

  it("returns null outside the section", () => {
    expect(activeTabPath(SECTION_TABS.settings, "/posts")).toBeNull();
  });
});

describe("visibleTabs", () => {
  it("hides tabs the admin has no permission for", () => {
    const paths = visibleTabs("settings", { hiddenPaths: ["/roles-admins"] }).map((t) => t.path);
    expect(paths).toEqual(["/profile", "/settings", "/audit-logs"]);
  });

  it("keeps only allowed tabs for an events-only association", () => {
    const allowed = ["/settings", "/roles-admins", "/audit-logs"];
    const paths = visibleTabs("settings", { eventsOnly: true, isAllowed: (p) => allowed.includes(p) }).map((t) => t.path);
    expect(paths).toEqual(["/settings", "/roles-admins", "/audit-logs"]);
  });

  it("ignores the events-only rule for a normal association", () => {
    expect(visibleTabs("settings", { eventsOnly: false, isAllowed: () => false })).toHaveLength(4);
  });
});

describe("sections", () => {
  it("cover every page that used to have its own menu entry", () => {
    const all = Object.values(SECTION_TABS).flatMap((tabs) => tabs.map((t) => t.path));
    for (const path of ["/analytics", "/vendor-escrow-settings", "/profile", "/roles-admins", "/audit-logs"]) {
      expect(all).toContain(path);
    }
    expect(new Set(all).size).toBe(all.length);
  });

  it("list the routes the sidebar entry lights up on", () => {
    expect(sectionPaths("dashboard")).toEqual(["/", "/analytics"]);
  });
});
