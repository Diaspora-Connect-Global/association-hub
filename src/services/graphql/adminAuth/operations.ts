import { getGraphQLClient } from "@/core/graphql-client";
import type { AdminLoginInput, AdminLoginResponse, RefreshAdminTokenResponse } from "./types";

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

const REFRESH_ADMIN_TOKEN = /* GraphQL */ `
  mutation RefreshAdminToken($refreshToken: String!) {
    refreshAdminToken(refreshToken: $refreshToken) {
      success
      accessToken
      refreshToken
    }
  }
`;

export interface AdminLoginVariables {
  input: AdminLoginInput;
}

export interface AdminLoginResult {
  adminLogin: AdminLoginResponse;
}

interface RefreshAdminTokenVariables {
  refreshToken: string;
}

interface RefreshAdminTokenResult {
  refreshAdminToken: RefreshAdminTokenResponse;
}

export async function adminLogin(input: AdminLoginInput): Promise<AdminLoginResponse> {
  const client = getGraphQLClient();
  const data = await client.request<AdminLoginResult, AdminLoginVariables>(ADMIN_LOGIN, {
    input,
  });
  return data.adminLogin;
}

export async function refreshAdminToken(refreshToken: string): Promise<RefreshAdminTokenResponse> {
  const client = getGraphQLClient();
  const data = await client.request<RefreshAdminTokenResult, RefreshAdminTokenVariables>(
    REFRESH_ADMIN_TOKEN,
    { refreshToken }
  );
  return data.refreshAdminToken;
}
