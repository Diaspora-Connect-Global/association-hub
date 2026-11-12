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

export type EventRegistrationMode = "IN_APP" | "EXTERNAL";

/** One question of an event's registration form (the gateway's RegistrationFormField). */
export interface EventRegistrationFormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  options: string[] | null;
  /** full_name | email | phone | job_title for a default field; null for the organiser's own. */
  builtin: string | null;
}

/** An event's registration setup, as loaded for editing / reading answers. */
export interface EventRegistrationSetup {
  /** null from an old gateway ⇒ IN_APP. */
  registrationMode: EventRegistrationMode | null;
  registrationLink: string | null;
  registrationFormFields: EventRegistrationFormField[] | null;
}

/** Wire shape of RegistrationFormFieldInput. */
export interface RegistrationFormFieldInput {
  id?: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
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
  registrationMode?: EventRegistrationMode;
  registrationLink?: string;
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
  /** With a mode the link is authoritative: "" clears it when switching to IN_APP. */
  registrationMode?: EventRegistrationMode;
  registrationLink?: string;
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
  /** Normalised standing: PENDING_APPROVAL / WAITLISTED / REJECTED / … (null when unrecognised). */
  registrationStatus: string | null;
  waitlistPosition: number | null;
  totalAmount: string | null;
  currency: string | null;
  registeredAt: string | null;
  confirmedAt: string | null;
  cancelledAt: string | null;
  createdAt: string | null;
  /** JSON object { [questionId]: string | string[] | boolean }; null when none. */
  formResponsesJson: string | null;
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
        registrationStatus
        waitlistPosition
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

/**
 * The registrant list for the event's own managers. `adminGetEventRegistrations`
 * is for platform admins only, so an association console token is refused there.
 */
const GET_EVENT_REGISTRATIONS = /* GraphQL */ `
  query GetEventRegistrations(
    $eventId: ID!
    $limit: Int
    $offset: Int
    $status: String
  ) {
    getEventRegistrations(
      eventId: $eventId
      limit: $limit
      offset: $offset
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
        registrationStatus
        waitlistPosition
        totalAmount
        currency
        registeredAt
        confirmedAt
        cancelledAt
        createdAt
        formResponsesJson
      }
      total
      page
      limit
      hasMore
    }
  }
`;

const GET_EVENT_REGISTRATION_SETUP = /* GraphQL */ `
  query GetEventRegistrationSetup($id: ID!) {
    getEvent(id: $id) {
      id
      registrationMode
      registrationLink
      registrationFormFields {
        id
        label
        type
        required
        options
        builtin
      }
    }
  }
`;

const UPDATE_EVENT_FORM_FIELDS = /* GraphQL */ `
  mutation UpdateEventFormFields($input: UpdateEventFormFieldsInput!) {
    updateEventFormFields(input: $input) {
      id
      registrationFormFields {
        id
        label
        type
        required
        options
        builtin
      }
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

/** One page of the event's registrations (offset paging; the gateway authorises the owning entity's admins). */
export async function getEventRegistrations(
  eventId: string,
  limit = 100,
  offset = 0,
  status?: string,
): Promise<EventRegistrationListResponse> {
  const client = getGraphQLClient();
  try {
    const data = await client.request<{ getEventRegistrations: EventRegistrationListResponse }>(
      GET_EVENT_REGISTRATIONS,
      { eventId, limit, offset, status: status ?? null },
    );
    return data.getEventRegistrations;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to fetch registrations");
  }
}

/** Every registration of the event, paged and bounded (for the CSV export). */
export async function getAllEventRegistrations(eventId: string, pageSize = 100, maxPages = 50): Promise<EventRegistrationRow[]> {
  const all: EventRegistrationRow[] = [];
  for (let page = 0; page < maxPages; page += 1) {
    const result = await getEventRegistrations(eventId, pageSize, page * pageSize);
    const rows = result.registrations ?? [];
    all.push(...rows);
    if (rows.length < pageSize || all.length >= (result.total ?? Infinity)) break;
  }
  return all;
}

/** The event's registration mode, link and form. */
export async function getEventRegistrationSetup(eventId: string): Promise<EventRegistrationSetup | null> {
  const client = getGraphQLClient();
  const data = await client.request<{ getEvent: EventRegistrationSetup | null }>(GET_EVENT_REGISTRATION_SETUP, {
    id: eventId,
  });
  return data.getEvent;
}

/** Replaces the event's WHOLE registration form, in order. */
export async function updateEventFormFields(
  eventId: string,
  fields: RegistrationFormFieldInput[],
): Promise<EventRegistrationSetup | null> {
  const client = getGraphQLClient();
  const data = await client.request<{ updateEventFormFields: EventRegistrationSetup | null }>(
    UPDATE_EVENT_FORM_FIELDS,
    { input: { eventId, fields } },
  );
  return data.updateEventFormFields;
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
