import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

const ops = vi.hoisted(() => ({
  getEventRegistrations: vi.fn(),
  getAllEventRegistrations: vi.fn(),
  getEventRegistrationSetup: vi.fn(),
  getEventTickets: vi.fn(),
  markRegistrationCheckedIn: vi.fn(),
  removeEventRegistration: vi.fn(),
}));
vi.mock("@/services/graphql/events/operations", () => ops);
vi.mock("@/components/events/networking/EventNetworkingTabs", () => ({ EventNetworkingTabs: () => null }));
vi.mock("@/contexts/SettingsContext", () => ({ useSettings: () => ({ settings: { language: "en" } }) }));

import { RegistrationsDrawer } from "./RegistrationsDrawer";

const reg = {
  id: "reg-1", eventId: "e1", userId: "u1", user: { id: "u1", firstName: "Ama", lastName: "Mensah", email: "ama@example.com", avatarUrl: null },
  ticketId: "t1", quantity: 2, status: "CONFIRMED", registrationStatus: "CONFIRMED", waitlistPosition: null, totalAmount: null, currency: null,
  registeredAt: "2026-11-01T10:00:00Z", confirmedAt: null, cancelledAt: null, createdAt: null,
  formResponsesJson: JSON.stringify({ full_name: "Ama Mensah", diet: ["Vegan", "Halal"], newsletter: true }),
};
const event = { id: "e1", title: "Gala", isPaid: false, registeredCount: 1 } as never;

beforeAll(() => {
  class RO { observe() {} unobserve() {} disconnect() {} }
  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = RO;
  const proto = Element.prototype as unknown as Record<string, unknown>;
  proto.hasPointerCapture = () => false;
  proto.releasePointerCapture = () => {};
  proto.setPointerCapture = () => {};
  proto.scrollIntoView = () => {};
});
afterEach(() => cleanup());

const openMenu = () => {
  const trigger = document.querySelector('button[aria-haspopup="menu"]') as HTMLElement;
  fireEvent.keyDown(trigger, { key: "Enter" });
};

beforeEach(() => {
  Object.values(ops).forEach((f) => f.mockReset());
  ops.getEventRegistrations.mockResolvedValue({ registrations: [reg], total: 1, page: 1, limit: 100, hasMore: false });
  ops.getEventRegistrationSetup.mockResolvedValue({
    registrationMode: "IN_APP", registrationLink: null,
    registrationFormFields: [
      { id: "full_name", label: "Full name", type: "text", required: true, options: null, builtin: "full_name" },
      { id: "diet", label: "Diet", type: "multiselect", required: false, options: ["Vegan", "Halal"], builtin: null },
      { id: "newsletter", label: "Newsletter", type: "checkbox", required: false, options: null, builtin: null },
    ],
  });
  ops.getEventTickets.mockResolvedValue([{ id: "t1", name: "General", priceInCents: 0, ticketType: null }]);
  ops.markRegistrationCheckedIn.mockResolvedValue({ id: "reg-1", status: "CHECKED_IN" });
  ops.removeEventRegistration.mockResolvedValue({ success: true });
});

describe("RegistrationsDrawer", () => {
  it("lists registrants via getEventRegistrations (not the platform-admin query), shows answers, check-in and remove still work", async () => {
    render(<RegistrationsDrawer open onOpenChange={() => {}} event={event} />);
    expect(await screen.findByText("Ama Mensah")).toBeTruthy();
    expect(ops.getEventRegistrations).toHaveBeenCalledWith("e1", 100, 0);

    openMenu();
    fireEvent.click(await screen.findByText("View answers"));
    expect(await screen.findByText("Vegan, Halal")).toBeTruthy();
    expect(screen.getByText("Yes")).toBeTruthy();
    expect(screen.queryByText(/reg-1|u1/)).toBeNull();
    fireEvent.click(screen.getAllByRole("button", { name: "Close" }).find((b) => b.textContent === "Close")!);
    await waitFor(() => expect(screen.queryByText("Vegan, Halal")).toBeNull());

    openMenu();
    fireEvent.click(await screen.findByText(/Mark as Checked/i));
    await waitFor(() => expect(ops.markRegistrationCheckedIn).toHaveBeenCalledWith("reg-1"));

    openMenu();
    fireEvent.click(await screen.findByText(/Remove/i));
    await waitFor(() => expect(ops.removeEventRegistration).toHaveBeenCalledWith("reg-1"));
  });
});
