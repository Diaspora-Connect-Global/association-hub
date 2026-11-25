import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

vi.mock("@/contexts/SettingsContext", () => ({ useSettings: () => ({ settings: { language: "en" } }) }));

import { CreateEditEventModal } from "./CreateEditEventModal";
import type { Event } from "@/types/events";

beforeAll(() => {
  class RO { observe() {} unobserve() {} disconnect() {} }
  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = RO;
  const proto = Element.prototype as unknown as Record<string, unknown>;
  proto.hasPointerCapture = () => false;
  proto.releasePointerCapture = () => {};
  proto.setPointerCapture = () => {};
  proto.scrollIntoView = () => {};
  (URL as unknown as Record<string, unknown>).createObjectURL = () => "blob:preview";
  (URL as unknown as Record<string, unknown>).revokeObjectURL = () => {};
});
afterEach(() => cleanup());

const saved = {
  id: "e1", title: "Gala", description: "d", bannerImage: "https://cdn.example/c.png", date: "Dec 1, 2026", startTime: "10:00", endTime: "12:00",
  eventType: "in-person", venue: "Town Hall", address: "1 High St", city: "Accra", country: "Ghana", isPaid: false,
  hasParticipantLimit: false, registeredCount: 0, status: "draft", publishNow: false, notifyMembers: true, allowComments: true,
  views: null, ticketsSold: 0, revenue: null, createdAt: "", updatedAt: "", registrationMode: "IN_APP", registrationFields: [],
} as unknown as Event;

const next = (times: number) => {
  for (let i = 0; i < times; i++) fireEvent.click(screen.getByRole("button", { name: /^next$/i }));
};

describe("CreateEditEventModal", () => {
  it("edit loads the saved address and sends it back", () => {
    const onSubmit = vi.fn();
    render(<CreateEditEventModal open onOpenChange={() => {}} event={saved} onSubmit={onSubmit} />);
    next(1);
    expect((screen.getByLabelText(/^Venue name/) as HTMLInputElement).value).toBe("Town Hall");
    expect((screen.getByLabelText(/^Street address/) as HTMLInputElement).value).toBe("1 High St");
    expect((screen.getByLabelText(/^City/) as HTMLInputElement).value).toBe("Accra");
    expect((screen.getByLabelText(/^Country/) as HTMLInputElement).value).toBe("Ghana");
    next(3);
    fireEvent.click(screen.getByRole("button", { name: /^save changes$/i }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ venue: "Town Hall", address: "1 High St", city: "Accra", country: "Ghana", bannerImage: null });
  });

  it("create refuses a blank address and shows labelled errors", () => {
    const onSubmit = vi.fn();
    render(<CreateEditEventModal open onOpenChange={() => {}} event={null} onSubmit={onSubmit} />);
    next(1);
    expect(screen.getByLabelText(/^Street address/)).toBeTruthy();
    next(3);
    fireEvent.click(screen.getByRole("button", { name: /^create event$/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getAllByRole("alert").length).toBeGreaterThan(0);
  });

  it("keeps the picked cover file and rejects a non-image", () => {
    render(<CreateEditEventModal open onOpenChange={() => {}} event={null} onSubmit={vi.fn()} />);
    const input = document.getElementById("eventCover") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [new File(["x"], "a.html", { type: "text/html" })] } });
    expect(screen.getByRole("alert").textContent).toMatch(/PNG, JPG/);
    fireEvent.change(input, { target: { files: [new File(["x"], "c.png", { type: "image/png" })] } });
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByText("c.png")).toBeTruthy();
  });
});
