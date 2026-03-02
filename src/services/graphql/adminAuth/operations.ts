import { getGraphQLClient } from "@/core/graphql-client";
import type { AdminLoginInput, AdminLoginResponse } from "./types";

const ADMIN_LOGIN = /* GraphQL */ `
  mutation AdminLogin($input: AdminLoginInput!) {
    adminLogin(input: $input) {
      success
      message
      error
      accessToken
      refreshToken
      admin {
        id
        userId
        scopeType
        scopeId
        isActive
        role {
          id
          name
          scopeType
          permissions
          description
        }
      }
    }
  }
`;

export interface AdminLoginVariables {
  input: AdminLoginInput;
}

export interface AdminLoginResult {
  adminLogin: AdminLoginResponse;
}

export async function adminLogin(input: AdminLoginInput): Promise<AdminLoginResponse> {
  const client = getGraphQLClient();
  const data = await client.request<AdminLoginResult, AdminLoginVariables>(ADMIN_LOGIN, {
    input,
  });
  return data.adminLogin;
}
