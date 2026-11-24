// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const state = { eventsOnly: false, canManageRoles: true };
vi.mock("@/hooks/useEventsOnly", () => ({
  useEventsOnly: () => ({ eventsOnly: state.eventsOnly, loading: false, associationId: "a-1" }),
}));
vi.mock("@/hooks/useCanManageRoles", () => ({ useCanManageRoles: () => state.canManageRoles }));
vi.mock("@/hooks/useT", async () => {
  const { getTranslation } = await import("@/lib/translations");
  return { useT: () => getTranslation("en") };
});

import { SectionTabs } from "./SectionTabs";

const renderAt = (path: string, section: "dashboard" | "marketplace" | "settings") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <SectionTabs section={section} labelKey="settings" />
    </MemoryRouter>,
  );

const hrefs = () => screen.getAllByRole("link").map((l) => l.getAttribute("href"));

describe("SectionTabs (association)", () => {
  afterEach(() => {
    cleanup();
    state.eventsOnly = false;
    state.canManageRoles = true;
  });

  it("shows the settings pages as tabs and marks the open one", () => {
    renderAt("/audit-logs", "settings");
    const nav = screen.getByRole("navigation", { name: "Settings" });
    expect(within(nav).getAllByRole("link").map((l) => l.textContent)).toEqual([
      "Profile",
      "Services",
      "Roles & Admins",
      "Audit Logs",
    ]);
    expect(within(nav).getByRole("link", { name: "Audit Logs" }).getAttribute("aria-current")).toBe("page");
  });

  it("hides Roles & Admins from an admin without the manage-roles permission", () => {
    state.canManageRoles = false;
    renderAt("/profile", "settings");
    expect(hrefs()).toEqual(["/profile", "/settings", "/audit-logs"]);
  });

  it("selects Analytics, not Listings, on the marketplace analytics route", () => {
    renderAt("/marketplace/analytics", "marketplace");
    const active = screen.getAllByRole("link").filter((l) => l.getAttribute("aria-current") === "page");
    expect(active.map((l) => l.getAttribute("href"))).toEqual(["/marketplace/analytics"]);
  });

  it("renders nothing when only one tab is left (events-only dashboard has no analytics)", () => {
    state.eventsOnly = true;
    renderAt("/", "dashboard");
    expect(screen.queryByRole("navigation")).toBeNull();
  });
});
