// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const getMyAdminNotifications = vi.fn();
vi.mock("@/services/graphql/notifications", () => ({
  getMyAdminNotifications: (...a: unknown[]) => getMyAdminNotifications(...a),
  markMyAdminNotificationsRead: vi.fn(async () => true),
  markNotificationRead: vi.fn(async () => true),
}));
vi.mock("@/hooks/useT", () => ({
  useT: () => ({
    adminNotifTitle: "Notifications",
    adminNotifEmpty: "Nothing needs your attention right now.",
    adminNotifMarkAllRead: "Mark all read",
    adminNotifLoadError: "Couldn't load notifications.",
    adminNotifUnread: "unread",
    adminNotifRefresh: "Refresh",
  }),
}));

import { AdminNotificationsBell } from "./AdminNotificationsBell";

const wrap = (ui: React.ReactElement) =>
  render(<QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>);

const UUID = "0b9a6b1e-5f1c-4a52-9f0b-1d2c3e4f5a6b";

describe("AdminNotificationsBell", () => {
  beforeEach(() => getMyAdminNotifications.mockReset());
  afterEach(() => cleanup());

  it("asks only for the managed association's directed notifications", async () => {
    getMyAdminNotifications.mockResolvedValue({ notifications: [], total: 0, unreadCount: 0 });
    wrap(<AdminNotificationsBell associationId="assoc-1" />);
    await waitFor(() => expect(getMyAdminNotifications).toHaveBeenCalledWith("ASSOCIATION", "assoc-1"));
  });

  it("does not query without an association", () => {
    wrap(<AdminNotificationsBell associationId={null} />);
    expect(getMyAdminNotifications).not.toHaveBeenCalled();
  });

  it("badge equals the server unread count and the list shows the directed items without ids", async () => {
    getMyAdminNotifications.mockResolvedValue({
      notifications: [
        { id: "n1", type: "servicerequest.approved", title: "Request approved", message: `Ref ${UUID}`, isRead: false, createdAt: "2026-10-19T10:00:00Z" },
        { id: "n2", type: "case.assigned", title: "Case assigned", message: "A case is yours", isRead: true, createdAt: "2026-10-19T09:00:00Z" },
      ],
      total: 2,
      unreadCount: 1,
    });
    wrap(<AdminNotificationsBell associationId="assoc-1" />);
    await waitFor(() => expect(screen.getByTestId("admin-notif-badge").textContent).toBe("1"));
    fireEvent.click(screen.getByLabelText("Notifications"));
    expect(screen.getByText("Request approved")).toBeTruthy();
    expect(screen.getByText("Case assigned")).toBeTruthy();
    expect(screen.queryByText(new RegExp(UUID))).toBeNull();
    expect(document.body.textContent).not.toContain("n1");
  });

  it("shows the empty state", async () => {
    getMyAdminNotifications.mockResolvedValue({ notifications: [], total: 0, unreadCount: 0 });
    wrap(<AdminNotificationsBell associationId="assoc-1" />);
    fireEvent.click(screen.getByLabelText("Notifications"));
    await waitFor(() => expect(screen.getByText("Nothing needs your attention right now.")).toBeTruthy());
  });
});
