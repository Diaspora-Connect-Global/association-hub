import type {
  RegistrationFieldDraft,
  RegistrationFormField,
  RegistrationMode,
} from "@/lib/eventRegistrationForm";

export type EventStatus = "published" | "unpublished" | "draft" | "ongoing" | "completed" | "cancelled";
export type EventType = "in-person" | "virtual";
export type PaymentStatus = "paid" | "pending" | "refunded";
export type CheckInStatus = "checked-in" | "not-checked-in";

export interface Event {
  id: string;
  title: string;
  description: string;
  bannerImage?: string;
  bannerEmoji?: string;
  date: string;
  startTime: string;
  endTime: string;
  eventType: EventType;
  location?: string;
  /** Saved physical address parts, so an edit loads and keeps them. */
  venue?: string;
  address?: string;
  city?: string;
  country?: string;
  virtualLink?: string;
  isPaid: boolean;
  /** Integer minor units (from the event's General Admission ticket) — ÷100 only at display. */
  ticketPrice?: number;
  currency?: string;
  hasParticipantLimit: boolean;
  maxParticipants?: number;
  registeredCount: number;
  status: EventStatus;
  publishNow: boolean;
  notifyMembers: boolean;
  allowComments: boolean;
  /** null: the API has no view count for events. */
  views: number | null;
  ticketsSold: number;
  /** Integer minor units; null when there is no source for it (shown as "Not available"). */
  revenue: number | null;
  createdAt: string;
  updatedAt: string;
  /** Loaded on demand (the list query does not carry them). */
  registrationMode?: "IN_APP" | "EXTERNAL";
  registrationLink?: string;
  registrationFields?: RegistrationFormField[];
  /** True when the registration setup could not be loaded for editing. */
  registrationLoadFailed?: boolean;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  userPhoto?: string;
  paymentStatus: PaymentStatus;
  checkInStatus: CheckInStatus;
  registeredAt: string;
  ticketNumber?: string;
}

export interface EventComment {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  content: string;
  createdAt: string;
  replies?: EventComment[];
}

export interface EventFormData {
  title: string;
  description: string;
  bannerImage?: File | null;
  date: Date | undefined;
  startTime: string;
  endTime: string;
  eventType: EventType;
  venue: string;
  address: string;
  city: string;
  country: string;
  virtualLink: string;
  isPaid: boolean;
  /** MAJOR units, as typed — converted to minor units once, on submit. */
  ticketPrice: number;
  currency: string;
  hasParticipantLimit: boolean;
  maxParticipants: number;
  publishNow: boolean;
  notifyMembers: boolean;
  allowComments: boolean;
  registrationMode: RegistrationMode;
  registrationLink: string;
  /** The organiser-built form (IN_APP only). */
  registrationFields: RegistrationFieldDraft[];
  /**
   * Edit mode: false when the event's current setup could not be loaded; then
   * nothing about registration is sent, so an existing link or form is never wiped.
   */
  registrationLoaded: boolean;
  /** Edit mode: signature of the form as loaded; the form is re-saved only when it differs. */
  registrationBaseline: string | null;
  /** Edit mode: the saved mode, and how many people already registered. */
  savedRegistrationMode: RegistrationMode | null;
  registeredCount: number;
}
