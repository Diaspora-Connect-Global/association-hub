import { GraphQLClient } from "graphql-request";

const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT ?? "/graphql";

let client: GraphQLClient | null = null;

/**
 * Creates a GraphQL client that adds Authorization header on each request when getAccessToken returns a value.
 */
export function createGraphQLClient(getAccessToken?: () => string | null): GraphQLClient {
  return new GraphQLClient(graphqlEndpoint, {
    fetch: async (url, init) => {
      const token = getAccessToken?.() ?? null;
      const headers = new Headers(init?.headers);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return fetch(url, { ...init, headers });
    },
  });
}

/**
 * Initialize the global GraphQL client. Call once at app startup (e.g. in main.tsx).
 * Pass a getter that returns the current access token so authenticated requests include it.
 */
export function initGraphQLClient(getAccessToken?: () => string | null): GraphQLClient {
  client = createGraphQLClient(getAccessToken);
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
