import { getGraphQLClient } from "@/core/graphql-client";

export interface AdminAuditLogItem {
  id: string;
  actorId: string;
  /** Human labels resolved by the gateway — shown instead of ids. */
  actorEmail?: string | null;
  actorLabel?: string | null;
  action: string;
  resourceType: string;
  resourceId: string;
  resourceLabel?: string | null;
  createdAt: string;
  ipAddress: string | null;
}

interface GetAuditLogsResponse {
  getAuditLogs: {
    items: AdminAuditLogItem[];
    total: number;
  };
}

interface GetAuditLogsVars {
  action?: string;
  resourceType?: string;
  fromDate?: string;
  toDate?: string;
  limit: number;
  offset: number;
}

const GET_AUDIT_LOGS = /* GraphQL */ `
  query GetAuditLogs(
    $action: String
    $resourceType: String
    $fromDate: String
    $toDate: String
    $limit: Int
    $offset: Int
  ) {
    getAuditLogs(
      action: $action
      resourceType: $resourceType
      fromDate: $fromDate
      toDate: $toDate
      limit: $limit
      offset: $offset
    ) {
      items {
        id
        actorId
        actorEmail
        actorLabel
        action
        resourceType
        resourceId
        resourceLabel
        createdAt
        ipAddress
      }
      total
    }
  }
`;

export async function getAuditLogs(vars: GetAuditLogsVars): Promise<{ items: AdminAuditLogItem[]; total: number }> {
  const client = getGraphQLClient();
  const data = await client.request<GetAuditLogsResponse, GetAuditLogsVars>(GET_AUDIT_LOGS, vars);
  return data.getAuditLogs;
}
