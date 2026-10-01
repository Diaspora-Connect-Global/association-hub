import { getGraphQLClient } from "@/core/graphql-client";

// -------------------------------------------------------------------------
// Types
// -------------------------------------------------------------------------

export type EventStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "CANCELLED"
  | "COMPLETED"
  | "ONGOING";

export interface EventType {
  id: string;
  title: string;
  description: string;
  status: EventStatus;
  startAt: string;
  endAt: string;
  locationType: string;
  locationDetails: EventLocation | null;
  coverImageUrl: string | null;
  registrationCount: number;
  isPaid: boolean;
  /** The event's currency; null when unset (the server then uses GHS for its tickets). */
  currency: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventLocation {
  type: string;
  venueName: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  virtualLink: string | null;
  platform: string | null;
}

/** What the gateway's CreateEventLocationInput accepts. */
export interface EventLocationInput {
  type: "physical" | "virtual" | "hybrid";
  venue?: string;
  address?: string;
  virtualLink?: string;
  platform?: string;
}

export interface EventListResponse {
  events: EventType[];
  total: number;
}

/**
 * Mirrors the gateway's CreateEventInput. The previous shape (a string
 * `locationDetails`, `maxParticipants`, no `eventCategory`) failed validation
 * on every call.
 */
export interface CreateEventInput {
  ownerType: string;
  ownerId: string;
  title: string;
  description: string;
  eventCategory: string;
  locationType: "physical" | "virtual" | "hybrid";
  locationDetails?: EventLocationInput;
  startAt: string;
  endAt: string;
  coverImageUrl?: string;
  isPaid?: boolean;
  /** Integer minor units (pesewas, cents) — the gateway field is an Int. */
  ticketPrice?: number;
  currency?: string;
  capacity?: number;
}

/** Mirrors the gateway's UpdateEventInput. */
export interface UpdateEventInput {
  title?: string;
  description?: string;
  startAt?: string;
  endAt?: string;
  locationType?: "physical" | "virtual" | "hybrid";
  locationDetails?: EventLocationInput;
  coverImageUrl?: string;
  isPaid?: boolean;
  /** Integer minor units. */
  ticketPrice?: number;
  currency?: string;
  capacity?: number;
}

export interface EventRegistrationUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  avatarUrl: string | null;
}

export interface EventRegistrationRow {
  id: string;
  eventId: string;
  userId: string;
  user: EventRegistrationUser | null;
  ticketId: string | null;
  quantity: number;
  status: string;
  totalAmount: string | null;
  currency: string | null;
  registeredAt: string | null;
  confirmedAt: string | null;
  cancelledAt: string | null;
  createdAt: string | null;
}

export interface EventRegistrationListResponse {
  registrations: EventRegistrationRow[];
  total: number;
  page: number | null;
  limit: number | null;
  hasMore: boolean | null;
}

// -------------------------------------------------------------------------
// GraphQL Documents
// -------------------------------------------------------------------------

const EVENT_FIELDS = /* GraphQL */ `
  id
  title
  description
  status
  startAt
  endAt
  locationType
  locationDetails {
    type
    venueName
    address
    city
    country
    virtualLink
    platform
  }
  coverImageUrl
  registrationCount
  isPaid
  currency
  createdAt
  updatedAt
`;

const GET_EVENTS_BY_OWNER = /* GraphQL */ `
  query GetEventsByOwner(
    $ownerType: String!
    $ownerId: ID!
    $limit: Int
    $offset: Int
    $status: String
  ) {
    getEventsByOwner(
      ownerType: $ownerType
      ownerId: $ownerId
      limit: $limit
      offset: $offset
      status: $status
    ) {
      events {
        ${EVENT_FIELDS}
      }
      total
    }
  }
`;

const CREATE_EVENT = /* GraphQL */ `
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      ${EVENT_FIELDS}
    }
  }
`;

const UPDATE_EVENT = /* GraphQL */ `
  mutation UpdateEvent($id: ID!, $input: UpdateEventInput!) {
    updateEvent(id: $id, input: $input) {
      ${EVENT_FIELDS}
    }
  }
`;

const PUBLISH_EVENT = /* GraphQL */ `
  mutation PublishEvent($id: ID!) {
    publishEvent(id: $id) {
      id
      status
    }
  }
`;

const CANCEL_EVENT = /* GraphQL */ `
  mutation CancelEvent($id: ID!, $reason: String!) {
    cancelEvent(id: $id, reason: $reason) {
      id
      status
    }
  }
`;

const DELETE_EVENT = /* GraphQL */ `
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      success
      message
    }
  }
`;

const ADMIN_GET_EVENT_REGISTRATIONS = /* GraphQL */ `
  query AdminGetEventRegistrations(
    $eventId: ID!
    $page: Int
    $limit: Int
    $status: String
  ) {
    adminGetEventRegistrations(
      eventId: $eventId
      page: $page
      limit: $limit
      status: $status
    ) {
      registrations {
        id
        eventId
        userId
        user {
          id
          firstName
          lastName
          email
          avatarUrl
        }
        ticketId
        quantity
        status
        totalAmount
        currency
        registeredAt
        confirmedAt
        cancelledAt
        createdAt
      }
      total
      page
      limit
      hasMore
    }
  }
`;

const MARK_REGISTRATION_CHECKED_IN = /* GraphQL */ `
  mutation MarkRegistrationCheckedIn($registrationId: ID!) {
    markRegistrationCheckedIn(registrationId: $registrationId) {
      id
      status
    }
  }
`;

const REMOVE_EVENT_REGISTRATION = /* GraphQL */ `
  mutation RemoveEventRegistration($registrationId: ID!) {
    removeEventRegistration(registrationId: $registrationId) {
      success
      message
    }
  }
`;

// -------------------------------------------------------------------------
// Operations
// -------------------------------------------------------------------------

export async function getEventsByOwner(
  ownerType: string,
  ownerId: string,
  page = 1,
  limit = 50,
  status?: string,
): Promise<EventListResponse> {
  const client = getGraphQLClient();
  try {
    const data = await client.request<{ getEventsByOwner: EventListResponse }>(
      GET_EVENTS_BY_OWNER,
      // The gateway pages by offset; callers keep their 1-based page.
      { ownerType, ownerId, limit, offset: Math.max(page - 1, 0) * limit, status: status ?? null },
    );
    return data.getEventsByOwner;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to fetch events");
  }
}

const GET_EVENT_TICKETS = /* GraphQL */ `
  query GetEventTickets($eventId: ID!) {
    getEventTickets(eventId: $eventId) {
      tickets {
        id
        name
        priceInCents
        ticketType
      }
    }
  }
`;

export interface EventTicketSummary {
  id: string;
  name: string;
  /** Integer minor units. */
  priceInCents: number;
  ticketType: string | null;
}

/**
 * The event's tickets. A paid event created from this console carries its
 * price on an auto-created "General Admission" ticket, not on the event.
 */
export async function getEventTickets(eventId: string): Promise<EventTicketSummary[]> {
  const client = getGraphQLClient();
  const data = await client.request<{ getEventTickets: { tickets: EventTicketSummary[] | null } | null }>(
    GET_EVENT_TICKETS,
    { eventId },
  );
  return data.getEventTickets?.tickets ?? [];
}

export async function createEvent(
  input: CreateEventInput,
): Promise<EventType> {
  const client = getGraphQLClient();
  try {
    const data = await client.request<{ createEvent: EventType }>(
      CREATE_EVENT,
      { input },
    );
    return data.createEvent;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to create event");
  }
}

export async function updateEvent(
  eventId: string,
  input: UpdateEventInput,
): Promise<EventType> {
  const client = getGraphQLClient();
  try {
    const data = await client.request<{ updateEvent: EventType }>(
      UPDATE_EVENT,
      { id: eventId, input },
    );
    return data.updateEvent;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to update event");
  }
}

export async function publishEvent(
  eventId: string,
): Promise<{ success: boolean; message?: string }> {
  const client = getGraphQLClient();
  try {
    const data = await client.request<{ publishEvent: { id: string; status: string } | null }>(PUBLISH_EVENT, {
      id: eventId,
    });
    return { success: Boolean(data.publishEvent?.id) };
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to publish event");
  }
}

export async function cancelEvent(
  eventId: string,
  reason?: string,
): Promise<{ success: boolean; message?: string }> {
  const client = getGraphQLClient();
  try {
    const data = await client.request<{ cancelEvent: { id: string; status: string } | null }>(CANCEL_EVENT, {
      id: eventId,
      // The gateway requires a reason; attendees may see it.
      reason: reason?.trim() || "Cancelled by the organiser",
    });
    return { success: Boolean(data.cancelEvent?.id) };
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to cancel event");
  }
}

export async function deleteEvent(
  eventId: string,
): Promise<{ success: boolean; message?: string }> {
  const client = getGraphQLClient();
  try {
    const data = await client.request<{
      deleteEvent: { success: boolean; message?: string };
    }>(DELETE_EVENT, { id: eventId });
    return data.deleteEvent;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to delete event");
  }
}

export async function adminGetEventRegistrations(
  eventId: string,
  page = 1,
  limit = 50,
  status?: string,
): Promise<EventRegistrationListResponse> {
  const client = getGraphQLClient();
  try {
    const data = await client.request<{
      adminGetEventRegistrations: EventRegistrationListResponse;
    }>(ADMIN_GET_EVENT_REGISTRATIONS, {
      eventId,
      page,
      limit,
      status: status ?? null,
    });
    return data.adminGetEventRegistrations;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch registrations");
  }
}

export async function markRegistrationCheckedIn(
  registrationId: string,
): Promise<{ id: string; status: string }> {
  const client = getGraphQLClient();
  try {
    const data = await client.request<{
      markRegistrationCheckedIn: { id: string; status: string };
    }>(MARK_REGISTRATION_CHECKED_IN, { registrationId });
    return data.markRegistrationCheckedIn;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to check in registration");
  }
}

export async function removeEventRegistration(
  registrationId: string,
): Promise<{ success: boolean; message?: string }> {
  const client = getGraphQLClient();
  try {
    const data = await client.request<{
      removeEventRegistration: { success: boolean; message?: string };
    }>(REMOVE_EVENT_REGISTRATION, { registrationId });
    return data.removeEventRegistration;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to remove registration");
  }
}
