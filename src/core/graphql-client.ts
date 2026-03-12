import { GraphQLClient } from "graphql-request";

const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT ?? "/graphql";

let client: GraphQLClient | null = null;

interface GraphQLClientOptions {
  getAccessToken?: () => string | null;
  getRefreshToken?: () => string | null;
  onAuthRefresh?: (accessToken: string, refreshToken?: string | null) => void;
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
  const { getAccessToken, getRefreshToken, onAuthRefresh, onUnauthenticated } = options;
  let refreshPromise: Promise<string | null> | null = null;

  const refreshAccessToken = async (): Promise<string | null> => {
    if (!getRefreshToken) return null;
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    if (!refreshPromise) {
      refreshPromise = (async () => {
        const response = await fetch(graphqlEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query:
              "mutation RefreshAdminToken($refreshToken: String!) { refreshAdminToken(refreshToken: $refreshToken) { success accessToken refreshToken } }",
            variables: { refreshToken },
          }),
        });

        const payload = (await response.json()) as {
          data?: {
            refreshAdminToken?: {
              success?: boolean;
              accessToken?: string | null;
              refreshToken?: string | null;
            };
          };
        };

        const refreshed = payload?.data?.refreshAdminToken;
        if (refreshed?.success && refreshed.accessToken) {
          onAuthRefresh?.(refreshed.accessToken, refreshed.refreshToken ?? null);
          return refreshed.accessToken;
        }

        return null;
      })().finally(() => {
        refreshPromise = null;
      });
    }

    return refreshPromise;
  };

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
          const hasRetried = headers.get("x-auth-retried") === "1";
          const bodyText = typeof init?.body === "string" ? init.body : "";
          const isRefreshOperation = bodyText.includes("refreshAdminToken");
          const hasUnauthenticatedError = Array.isArray(payload?.errors)
            ? payload.errors.some(
                (error: { extensions?: { code?: string } }) =>
                  error?.extensions?.code === "UNAUTHENTICATED"
              )
            : false;

          if (hasUnauthenticatedError) {
            if (!hasRetried && !isRefreshOperation) {
              const refreshedAccessToken = await refreshAccessToken();

              if (refreshedAccessToken) {
                const retryHeaders = new Headers(init?.headers);
                retryHeaders.set("Authorization", `Bearer ${refreshedAccessToken}`);
                retryHeaders.set("x-auth-retried", "1");
                return fetch(url, { ...init, headers: retryHeaders });
              }
            }

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
