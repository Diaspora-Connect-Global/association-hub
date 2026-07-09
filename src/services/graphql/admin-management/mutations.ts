import { getGraphQLClient } from "@/core/graphql-client";
import type {
  CreateAdminInput,
  CreateAdminResponse,
  UpdateAdminStatusInput,
  AdminCommonResponse,
  AssignAdminRoleInput,
  AssignAdminRoleResponse,
  CreateRoleDefinitionInput,
} from "./types";

const CREATE_ADMIN = /* GraphQL */ `
  mutation CreateAdmin($input: CreateAdminInput!) {
    createAdmin(input: $input) {
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
          roleDefinitionId
        }
        permissions
      }
    }
  }
`;

const UPDATE_ADMIN_STATUS = /* GraphQL */ `
  mutation UpdateAdminStatus($input: UpdateAdminStatusInput!) {
    updateAdminStatus(input: $input) {
      success
      message
    }
  }
`;

const ASSIGN_ADMIN_ROLE = /* GraphQL */ `
  mutation AssignAdminRole($input: AssignAdminRoleInput!) {
    assignAdminRole(input: $input) {
      success
      message
      assignment {
        id
        roleType
        scopeType
        scopeId
        roleDefinitionId
      }
    }
  }
`;

const REVOKE_ADMIN_ROLE = /* GraphQL */ `
  mutation RevokeAdminRole($roleAssignmentId: String!, $reason: String) {
    revokeAdminRole(roleAssignmentId: $roleAssignmentId, reason: $reason) {
      success
      message
    }
  }
`;

const CREATE_ROLE_DEFINITION = /* GraphQL */ `
  mutation CreateRoleDefinition($input: CreateRoleDefinitionInput!) {
    createRoleDefinition(input: $input) {
      success
      message
    }
  }
`;

export async function createAdmin(input: CreateAdminInput): Promise<CreateAdminResponse> {
  const client = getGraphQLClient();
  const data = await client.request<{ createAdmin: CreateAdminResponse }, { input: CreateAdminInput }>(
    CREATE_ADMIN,
    { input },
  );
  return data.createAdmin;
}

export async function updateAdminStatus(
  input: UpdateAdminStatusInput,
): Promise<AdminCommonResponse> {
  const client = getGraphQLClient();
  const data = await client.request<
    { updateAdminStatus: AdminCommonResponse },
    { input: UpdateAdminStatusInput }
  >(UPDATE_ADMIN_STATUS, { input });
  return data.updateAdminStatus;
}

export async function assignAdminRole(
  input: AssignAdminRoleInput,
): Promise<AssignAdminRoleResponse> {
  const client = getGraphQLClient();
  const data = await client.request<
    { assignAdminRole: AssignAdminRoleResponse },
    { input: AssignAdminRoleInput }
  >(ASSIGN_ADMIN_ROLE, { input });
  return data.assignAdminRole;
}

export async function revokeAdminRole(
  roleAssignmentId: string,
  reason?: string,
): Promise<AdminCommonResponse> {
  const client = getGraphQLClient();
  const data = await client.request<
    { revokeAdminRole: AdminCommonResponse },
    { roleAssignmentId: string; reason?: string }
  >(REVOKE_ADMIN_ROLE, { roleAssignmentId, reason });
  return data.revokeAdminRole;
}

export async function createRoleDefinition(
  input: CreateRoleDefinitionInput,
): Promise<AdminCommonResponse> {
  const client = getGraphQLClient();
  const data = await client.request<
    { createRoleDefinition: AdminCommonResponse },
    { input: CreateRoleDefinitionInput }
  >(CREATE_ROLE_DEFINITION, { input });
  return data.createRoleDefinition;
}
