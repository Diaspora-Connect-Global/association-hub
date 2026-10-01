import { getGraphQLClient } from "@/core/graphql-client";

/**
 * A community the association could ask to be linked to. `id` is sent with the
 * link request behind the scenes and is never rendered.
 */
export interface LinkableCommunity {
  id: string;
  name: string;
  avatarUrl: string | null;
  memberCount: number | null;
}

/** Below this the picker doesn't ask the server. */
export const COMMUNITY_SEARCH_MIN_LENGTH = 2;
const COMMUNITY_SEARCH_LIMIT = 8;

// Only PUBLIC communities are offered: a private community is not something an
// association can discover, so it isn't something it can ask to join.
const SEARCH_LINKABLE_COMMUNITIES = /* GraphQL */ `
  query SearchLinkableCommunities($input: SearchCommunitiesInput) {
    searchCommunities(input: $input) {
      communities {
        id
        name
        avatarUrl
        memberCount
        visibility
      }
    }
  }
`;

interface SearchLinkableCommunitiesData {
  searchCommunities: {
    communities: Array<{
      id: string;
      name: string;
      avatarUrl?: string | null;
      memberCount?: number | null;
      visibility?: string | null;
    }> | null;
  } | null;
}

export async function searchLinkableCommunities(
  query: string,
  signal?: AbortSignal,
): Promise<LinkableCommunity[]> {
  const term = query.trim();
  if (term.length < COMMUNITY_SEARCH_MIN_LENGTH) return [];
  const data = await getGraphQLClient().request<
    SearchLinkableCommunitiesData,
    { input: { searchTerm: string; visibility: string; limit: number; page: number } }
  >({
    document: SEARCH_LINKABLE_COMMUNITIES,
    variables: {
      input: { searchTerm: term, visibility: "PUBLIC", limit: COMMUNITY_SEARCH_LIMIT, page: 1 },
    },
    signal,
  });
  return (data.searchCommunities?.communities ?? [])
    // Defence in depth: never offer a non-public community even if the filter is ignored.
    .filter((c) => c?.id && c.name?.trim() && (c.visibility ?? "").toUpperCase() === "PUBLIC")
    .map((c) => ({
      id: c.id,
      name: c.name.trim(),
      avatarUrl: c.avatarUrl ?? null,
      memberCount: typeof c.memberCount === "number" ? c.memberCount : null,
    }));
}
