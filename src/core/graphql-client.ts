import { GraphQLClient } from "graphql-request";

const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT ?? "/graphql";

let client: GraphQLClient | null = null;

interface GraphQLClientOptions {
  getAccessToken?: () => string | null;
  onUnauthenticated?: () => void;
}

function redirectToLogin() {
  if (typeof window === "undefined") return;
  if (window.location.pathname === "/login") return;

  const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const params = new URLSearchParams({ expired: "1" });

  if (returnTo && returnTo !== "/") {
    params.set("redirect", returnTo);
  }

  window.location.replace(`/login?${params.toString()}`);
}

/**
 * Creates a GraphQL client that adds Authorization header on each request when getAccessToken returns a value.
 */
export function createGraphQLClient(options: GraphQLClientOptions = {}): GraphQLClient {
  const { getAccessToken, onUnauthenticated } = options;

  return new GraphQLClient(graphqlEndpoint, {
    fetch: async (url, init) => {
      const token = getAccessToken?.() ?? null;
      const headers = new Headers(init?.headers);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      const response = await fetch(url, { ...init, headers });
      const contentType = response.headers.get("content-type") ?? "";

      if (contentType.includes("application/json")) {
        try {
          const payload = await response.clone().json();
          const hasUnauthenticatedError = Array.isArray(payload?.errors)
            ? payload.errors.some(
                (error: { extensions?: { code?: string } }) =>
                  error?.extensions?.code === "UNAUTHENTICATED"
              )
            : false;

          if (hasUnauthenticatedError) {
            onUnauthenticated?.();
            redirectToLogin();
          }
        } catch {
          // Ignore non-JSON payload parsing issues from cloned responses.
        }
      }

      return response;
    },
  });
}

/**
 * Initialize the global GraphQL client. Call once at app startup (e.g. in main.tsx).
 * Pass a getter that returns the current access token so authenticated requests include it.
 */
export function initGraphQLClient(options: GraphQLClientOptions = {}): GraphQLClient {
  client = createGraphQLClient(options);
  return client;
}

/**
 * Returns the initialized GraphQL client. Throws if initGraphQLClient was not called.
 */
export function getGraphQLClient(): GraphQLClient {
  if (!client) {
    throw new Error("GraphQL client not initialized. Call initGraphQLClient() in main.tsx.");
  }
  return client;
}
