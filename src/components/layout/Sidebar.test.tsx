// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const state = { eventsOnly: false };
vi.mock("@/hooks/useEventsOnly", () => ({
  useEventsOnly: () => ({ eventsOnly: state.eventsOnly, loading: false, associationId: "" }),
}));
vi.mock("@/services/graphql/association", () => ({ getAssociation: vi.fn() }));
vi.mock("@/hooks/useT", async () => {
  const { getTranslation } = await import("@/lib/translations");
  return { useT: () => getTranslation("en") };
});

import { Sidebar } from "./Sidebar";

const renderAt = (path: string) =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={[path]}>
        <Sidebar collapsed={false} onToggle={() => {}} />
      </MemoryRouter>
    </QueryClientProvider>,
  );

const menu = () => screen.getByRole("navigation", { name: "Main menu" });
const menuHrefs = () => within(menu()).getAllByRole("link").map((l) => l.getAttribute("href"));

describe("Sidebar (association)", () => {
  afterEach(() => {
    cleanup();
    state.eventsOnly = false;
  });

  it("groups the menu, with no Vendor submenu and one Settings entry", () => {
    renderAt("/");
    expect(within(menu()).getByText("Content")).toBeTruthy();
    expect(within(menu()).getByText("People")).toBeTruthy();
    expect(within(menu()).getByText("Support")).toBeTruthy();
    expect(within(menu()).queryByText("Vendor")).toBeNull();
    expect(menuHrefs()).toEqual([
      "/",
      "/posts",
      "/events",
      "/opportunities",
      "/marketplace",
      "/groups",
      "/members",
      "/tickets",
      "/profile",
    ]);
    expect(within(menu()).getByRole("link", { name: "Reports & complaints" })).toBeTruthy();
  });

  it.each([
    ["/analytics", "/"],
    ["/marketplace/analytics", "/marketplace"],
    ["/vendor-escrow-settings", "/marketplace"],
    ["/settings", "/profile"],
    ["/roles-admins", "/profile"],
    ["/audit-logs", "/profile"],
    ["/groups/g-1", "/groups"],
  ])("on %s it highlights only the %s entry", (path, entry) => {
    renderAt(path);
    const active = within(menu())
      .getAllByRole("link")
      .filter((l) => l.getAttribute("aria-current") === "page");
    expect(active.map((l) => l.getAttribute("href"))).toEqual([entry]);
  });

  it("marks the open entry without a coloured bar on its left edge", () => {
    renderAt("/members");
    const active = within(menu()).getByRole("link", { name: "Members" });
    expect(active.querySelector("span.absolute.left-0")).toBeNull();
  });

  it("sends an events-only association's Settings entry to a page it may open", () => {
    state.eventsOnly = true;
    renderAt("/");
    expect(menuHrefs()).toEqual(["/", "/events", "/members", "/settings"]);
  });
});
