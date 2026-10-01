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

/**
 * True when the server refused the action for lack of permission (as opposed
 * to a network/validation failure). Role changes from a console are refused
 * this way until the gateway forwards the console's admin claim to
 * community-service, so screens can say so plainly instead of showing a raw
 * server message.
 */
export function isPermissionRefusal(err: unknown): boolean {
  const errors = err instanceof ClientError ? err.response?.errors ?? [] : [];
  return errors.some((e) => {
    const code = String(
      (e as { code?: unknown })?.code ?? (e?.extensions as { code?: unknown } | undefined)?.code ?? "",
    ).toUpperCase();
    return (
      code === "FORBIDDEN" ||
      code === "PERMISSION_DENIED" ||
      /only .* admins can|permission denied|not allowed|forbidden/i.test(e?.message ?? "")
    );
  });
}
