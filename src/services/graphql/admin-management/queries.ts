import { getGraphQLClient } from "@/core/graphql-client";
import type {
  GetAdminByIdResponse,
  GetRoleDefinitionsResponse,
  ListAdminsResponse,
} from "./types";

const GET_ADMIN_BY_ID = /* GraphQL */ `
  query GetAdminById($adminId: String!) {
    getAdminById(adminId: $adminId) {
      success
      message
      admin {
        id
        email
        status
        adminType
        roles {
          id
          roleType
          scopeType
          scopeId
        }
        permissions
      }
    }
  }
`;

const GET_ROLE_DEFINITIONS = /* GraphQL */ `
  query GetRoleDefinitions($scopeType: String, $scopeId: String) {
    getRoleDefinitions(scopeType: $scopeType, scopeId: $scopeId) {
      success
      message
      roles {
        id
        name
        description
        scopeType
        scopeId
        permissions
        isSystem
      }
    }
  }
`;

const LIST_ADMINS = /* GraphQL */ `
  query ListAdmins(
    $search: String
    $page: Int
    $limit: Int
    $status: String
    $adminType: String
  ) {
    listAdmins(
      search: $search
      page: $page
      limit: $limit
      status: $status
      adminType: $adminType
    ) {
      admins {
        id
        email
        status
        adminType
        roles {
          id
          roleType
          scopeType
          scopeId
        }
        permissions
      }
      total
      page
      limit
    }
  }
`;

export async function getAdminById(adminId: string): Promise<GetAdminByIdResponse> {
  const client = getGraphQLClient();
  const data = await client.request<{ getAdminById: GetAdminByIdResponse }, { adminId: string }>(
    GET_ADMIN_BY_ID,
    { adminId },
  );
  return data.getAdminById;
}

export async function getRoleDefinitions(
  scopeType?: string,
  scopeId?: string,
): Promise<GetRoleDefinitionsResponse> {
  const client = getGraphQLClient();
  const data = await client.request<
    { getRoleDefinitions: GetRoleDefinitionsResponse },
    { scopeType?: string; scopeId?: string }
  >(GET_ROLE_DEFINITIONS, { scopeType, scopeId });
  return data.getRoleDefinitions;
}

/**
 * List admin accounts. The gateway does not currently support filtering by
 * scope, so callers scoped to a single association should filter the returned
 * `admins` by `roles[].scopeId` client-side.
 */
export async function listAdmins(params?: {
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
  adminType?: string;
}): Promise<ListAdminsResponse> {
  const client = getGraphQLClient();
  const data = await client.request<
    { listAdmins: ListAdminsResponse },
    {
      search?: string;
      page?: number;
      limit?: number;
      status?: string;
      adminType?: string;
    }
  >(LIST_ADMINS, {
    search: params?.search,
    page: params?.page,
    limit: params?.limit,
    status: params?.status,
    adminType: params?.adminType,
  });
  return data.listAdmins;
}
