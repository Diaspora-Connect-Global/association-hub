import { ClientError } from "graphql-request";

/**
 * A short, user-safe message for a failed GraphQL request.
 *
 * graphql-request's `ClientError.message` is the first server message followed
 * by a JSON dump of the whole request and response — variables (ids) included —
 * so it must never be shown as-is. Use the server's own messages instead.
 */
export function graphqlErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ClientError) {
    const messages = (err.response?.errors ?? [])
      .map((e) => e?.message?.trim())
      .filter((m): m is string => Boolean(m));
    return messages.length ? messages.join("; ") : fallback;
  }
  if (err instanceof Error && err.message.trim()) return err.message.trim();
  return fallback;
}
