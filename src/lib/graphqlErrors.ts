import { ClientError } from "graphql-request";

const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

/**
 * True when `text` carries something that looks like an internal id: a UUID
 * (even glued to a word, e.g. `circle_<uuid>`), or a run of 8+ hex characters
 * mixing digits and letters (a UUID fragment, an unhyphenated id, an ObjectId).
 * Token-based, so it stays linear on long input.
 */
export function containsId(text: string): boolean {
  if (UUID_RE.test(text)) return true;
  return text
    .split(/[^0-9a-z]+/i)
    .some((token) => token.length >= 8 && /^[0-9a-f]+$/i.test(token) && /\d/.test(token) && /[a-f]/i.test(token));
}

/**
 * A server-provided message (e.g. `{ success: false, message }`), or `fallback`
 * when it is empty or names an id. Removing the id from "Association <id> not
 * found" would leave broken grammar, so the whole message gives way.
 */
export function safeServerMessage(message: string | null | undefined, fallback: string): string {
  const text = message?.trim();
  if (!text || containsId(text)) return fallback;
  return text;
}

/**
 * A short, user-safe message for a failed GraphQL request.
 *
 * graphql-request's `ClientError.message` is the first server message followed
 * by a JSON dump of the whole request and response — variables (ids, emails,
 * even passwords on the sign-in and password forms) included — so it must never
 * be shown as-is. Use the server's own messages instead, and fall back to the
 * caller's (translated) text when there are none or they name an id.
 */
export function graphqlErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ClientError) {
    const messages = (err.response?.errors ?? [])
      .map((e) => e?.message?.trim())
      .filter((m): m is string => Boolean(m));
    return safeServerMessage(messages.join("; "), fallback);
  }
  if (err instanceof Error) return safeServerMessage(err.message, fallback);
  return fallback;
}

/** `graphqlErrorMessage` for an optional error: null when there is none. */
export function graphqlErrorText(err: unknown, fallback: string): string | null {
  return err ? graphqlErrorMessage(err, fallback) : null;
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
