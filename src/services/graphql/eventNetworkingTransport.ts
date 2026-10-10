import { ClientError } from "graphql-request";
import { getGraphQLClient } from "@/core/graphql-client";
import type { ErrorLike } from "@/lib/eventNetworking";

/** The one place the event-networking operations touch this console's GraphQL client. */
export function gqlRequest<TData>(query: string, variables?: Record<string, unknown>): Promise<TData> {
  return getGraphQLClient().request<TData>({ document: query, variables });
}

/** `{ code, message }` for every GraphQL error in a failed request (the gateway puts `code` at the top level). */
export function errorsOf(err: unknown): ErrorLike[] {
  if (err instanceof ClientError) {
    return (err.response?.errors ?? []).map((e) => {
      const raw = e as unknown as { code?: unknown; extensions?: { code?: unknown } };
      return { code: String(raw.code ?? raw.extensions?.code ?? ""), message: e.message };
    });
  }
  return [];
}
