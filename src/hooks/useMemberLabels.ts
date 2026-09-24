import { useEffect, useMemo, useState } from "react";
import { ClientError } from "graphql-request";
import { getGraphQLClient } from "@/core/graphql-client";
import { getAdminAssociationId } from "@/stores/adminAuthStore";
import { userLabel } from "@/lib/userLabel";

interface MemberName {
  fullName?: string | null;
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}

/** Ids per request. Each alias is one `getMemberDetails` field in a single HTTP call. */
const BATCH_SIZE = 50;

/** Session cache (association-qualified) so paging back and forth never re-fetches. */
const labelCache = new Map<string, string>();

function batchQuery(count: number): string {
  const vars = Array.from({ length: count }, (_, i) => `$u${i}: ID!`).join(", ");
  const fields = Array.from(
    { length: count },
    (_, i) =>
      `u${i}: getMemberDetails(userId: $u${i}, entityId: $entityId, entityType: $entityType) { fullName displayName firstName lastName email }`,
  ).join("\n");
  return `query ResolveMemberLabels($entityId: ID!, $entityType: String!, ${vars}) {\n${fields}\n}`;
}

function labelOf(m?: MemberName | null): string {
  const combined = [m?.firstName, m?.lastName].filter(Boolean).join(" ").trim();
  return userLabel({ name: m?.fullName?.trim() || m?.displayName?.trim() || combined, email: m?.email }, "");
}

/** One aliased request for a chunk; a non-member's alias errors but the rest still resolve. */
async function fetchChunk(ids: string[], associationId: string): Promise<Record<string, MemberName | null>> {
  const variables = {
    entityId: associationId,
    entityType: "ASSOCIATION",
    ...Object.fromEntries(ids.map((id, i) => [`u${i}`, id])),
  };
  try {
    return await getGraphQLClient().request<Record<string, MemberName | null>>(batchQuery(ids.length), variables);
  } catch (err) {
    // Partial success: per-alias errors (non-members) still carry the other aliases' data.
    if (err instanceof ClientError) return (err.response.data as Record<string, MemberName | null>) ?? {};
    return {};
  }
}

/**
 * Resolve user ids to human labels (name, else email) through the signed-in
 * admin's association membership records.
 *
 * Several surfaces (applicants, buyers, reported users…) only receive a user
 * id. User ids must never be displayed, so they resolve here and render the
 * label — or the translated "Unknown user" fallback when the person is not (or
 * no longer) a member of the association.
 *
 * Batched: one aliased request per 50 ids (never one request per row), with a
 * session cache. Returns id → label; unresolved ids are absent.
 */
export function useMemberLabels(ids: ReadonlyArray<string | null | undefined>): ReadonlyMap<string, string> {
  const associationId = getAdminAssociationId() ?? "";
  const key = useMemo(
    () => [...new Set(ids.filter((id): id is string => Boolean(id && id.trim())))].sort().join(","),
    [ids],
  );
  const [labels, setLabels] = useState<ReadonlyMap<string, string>>(() => new Map());

  useEffect(() => {
    const unique = key ? key.split(",") : [];
    const cacheKey = (id: string) => `${associationId}:${id}`;
    const pick = () =>
      new Map(unique.flatMap((id) => (labelCache.has(cacheKey(id)) ? [[id, labelCache.get(cacheKey(id))!]] : [])));
    setLabels(pick());
    const missing = unique.filter((id) => !labelCache.has(cacheKey(id)));
    if (!associationId || missing.length === 0) return;

    let cancelled = false;
    void (async () => {
      for (let start = 0; start < missing.length; start += BATCH_SIZE) {
        const chunk = missing.slice(start, start + BATCH_SIZE);
        const data = await fetchChunk(chunk, associationId);
        chunk.forEach((id, i) => {
          const label = labelOf(data[`u${i}`]);
          if (label) labelCache.set(cacheKey(id), label);
        });
      }
      if (!cancelled) setLabels(pick());
    })();
    return () => {
      cancelled = true;
    };
  }, [key, associationId]);

  return labels;
}
