import { useQuery } from "@tanstack/react-query";
import { getAdminAssociationId } from "@/stores/adminAuthStore";
import { getAssociation } from "@/services/graphql/association";
import { isEventsOnly } from "@/lib/eventNetworking";

/**
 * Whether this association exists only to run events (its enabled services are
 * exactly `events`). Shares the sidebar's ["association", id] cache entry, so it
 * costs no extra request. While loading — or if the lookup fails — the console
 * is NOT narrowed: the server still enforces what each admin may do.
 */
export function useEventsOnly(): { eventsOnly: boolean; loading: boolean; associationId: string } {
  const associationId = getAdminAssociationId() ?? "";
  const q = useQuery({
    queryKey: ["association", associationId],
    queryFn: () => getAssociation(associationId),
    enabled: !!associationId,
    staleTime: 60_000,
  });
  return {
    eventsOnly: isEventsOnly(q.data?.enabledServices),
    loading: !!associationId && q.isLoading,
    associationId,
  };
}
