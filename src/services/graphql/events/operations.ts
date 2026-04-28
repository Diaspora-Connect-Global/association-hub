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
  locationDetails: string | null;
  coverImageUrl: string | null;
  registrationCount: number;
  viewCount: number;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventListResponse {
  events: EventType[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateEventInput {
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  locationType: string;
  locationDetails?: string;
  coverImageUrl?: string;
  isPaid?: boolean;
  ticketPrice?: number;
  currency?: string;
  maxParticipants?: number;
  ownerType: string;
  ownerId: string;
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  startAt?: string;
  endAt?: string;
  locationType?: string;
  locationDetails?: string;
  coverImageUrl?: string;
  isPaid?: boolean;
  ticketPrice?: number;
  currency?: string;
  maxParticipants?: number;
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
  locationDetails
  coverImageUrl
  registrationCount
  viewCount
  isPaid
  createdAt
  updatedAt
`;

const GET_EVENTS_BY_OWNER = /* GraphQL */ `
  query GetEventsByOwner(
    $ownerType: String!
    $ownerId: ID!
    $page: Int
    $limit: Int
    $status: String
  ) {
    getEventsByOwner(
      ownerType: $ownerType
      ownerId: $ownerId
      page: $page
      limit: $limit
      status: $status
    ) {
      events {
        ${EVENT_FIELDS}
      }
      total
      page
      limit
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
  mutation UpdateEvent($eventId: ID!, $input: UpdateEventInput!) {
    updateEvent(eventId: $eventId, input: $input) {
      ${EVENT_FIELDS}
    }
  }
`;

const PUBLISH_EVENT = /* GraphQL */ `
  mutation PublishEvent($eventId: ID!) {
    publishEvent(eventId: $eventId) {
      success
      message
    }
  }
`;

const CANCEL_EVENT = /* GraphQL */ `
  mutation CancelEvent($eventId: ID!, $reason: String) {
    cancelEvent(eventId: $eventId, reason: $reason) {
      success
      message
    }
  }
`;

const DELETE_EVENT = /* GraphQL */ `
  mutation DeleteEvent($eventId: ID!) {
    deleteEvent(eventId: $eventId) {
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
      { ownerType, ownerId, page, limit, status: status ?? null },
    );
    return data.getEventsByOwner;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to fetch events");
  }
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
      { eventId, input },
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
    const data = await client.request<{
      publishEvent: { success: boolean; message?: string };
    }>(PUBLISH_EVENT, { eventId });
    return data.publishEvent;
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
    const data = await client.request<{
      cancelEvent: { success: boolean; message?: string };
    }>(CANCEL_EVENT, { eventId, reason: reason ?? null });
    return data.cancelEvent;
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
    }>(DELETE_EVENT, { eventId });
    return data.deleteEvent;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to delete event");
  }
}
