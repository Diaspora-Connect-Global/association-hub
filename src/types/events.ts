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
  ticketPrice?: number;
  currency?: string;
  hasParticipantLimit: boolean;
  maxParticipants?: number;
  registeredCount: number;
  status: EventStatus;
  publishNow: boolean;
  notifyMembers: boolean;
  allowComments: boolean;
  views: number;
  ticketsSold: number;
  revenue: number;
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
  ticketPrice: number;
  currency: string;
  hasParticipantLimit: boolean;
  maxParticipants: number;
  publishNow: boolean;
  notifyMembers: boolean;
  allowComments: boolean;
}
