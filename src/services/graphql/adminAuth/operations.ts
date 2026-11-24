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

const FORGOT_PASSWORD = /* GraphQL */ `
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

const RESET_PASSWORD = /* GraphQL */ `
  mutation ResetPassword($email: String!, $resetCode: String!, $newPassword: String!) {
    resetPassword(email: $email, resetCode: $resetCode, newPassword: $newPassword)
  }
`;

/** Sends a one-time reset code. The gateway answers with a status string, not an error. */
export async function forgotPassword(email: string): Promise<string> {
  const data = await getGraphQLClient().request<{ forgotPassword: string }, { email: string }>(
    FORGOT_PASSWORD,
    { email },
  );
  return data.forgotPassword;
}

/** Consumes the code and sets the password. Failure comes back as "Password reset failed: ...". */
export async function resetPassword(input: {
  email: string;
  resetCode: string;
  newPassword: string;
}): Promise<string> {
  const data = await getGraphQLClient().request<
    { resetPassword: string },
    { email: string; resetCode: string; newPassword: string }
  >(RESET_PASSWORD, input);
  return data.resetPassword;
}
