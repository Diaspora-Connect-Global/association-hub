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
  location: string;
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
}
