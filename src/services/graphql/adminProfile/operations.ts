import { getGraphQLClient } from "@/core/graphql-client";
import type { AdminProfile, UpdateAdminProfileInput, CommonResponse } from "./types";

const GET_CURRENT_ADMIN = /* GraphQL */ `
  query GetCurrentAdmin {
    getCurrentAdmin {
      id
      firstName
      lastName
      email
      phone
      avatarUrl
      twoFactorEnabled
      notificationPreferences {
        emailEnabled
        pushEnabled
        inAppEnabled
      }
    }
  }
`;

const UPDATE_ADMIN_PROFILE = /* GraphQL */ `
  mutation UpdateAdminProfile($input: UpdateAdminProfileInput!) {
    updateAdminProfile(input: $input) {
      success
      message
    }
  }
`;

interface GetCurrentAdminResult {
  getCurrentAdmin: AdminProfile;
}

interface UpdateAdminProfileResult {
  updateAdminProfile: CommonResponse;
}

export async function getCurrentAdmin(): Promise<AdminProfile> {
  const client = getGraphQLClient();
  const data = await client.request<GetCurrentAdminResult>(GET_CURRENT_ADMIN);
  return data.getCurrentAdmin;
}

export async function updateAdminProfile(input: UpdateAdminProfileInput): Promise<CommonResponse> {
  const client = getGraphQLClient();
  const data = await client.request<UpdateAdminProfileResult, { input: UpdateAdminProfileInput }>(
    UPDATE_ADMIN_PROFILE,
    { input },
  );
  return data.updateAdminProfile;
}

// ── Linked Communities ────────────────────────────────────────────────────────

const GET_LINKED_COMMUNITIES = /* GraphQL */ `
  query GetLinkedCommunities($associationId: ID!) {
    getLinkedCommunities(associationId: $associationId) {
      id
      name
      memberCount
      avatarUrl
      visibility
      createdAt
    }
  }
`;

export interface LinkedCommunity {
  id: string;
  name: string;
  memberCount?: number;
  avatarUrl?: string;
  visibility: string;
  createdAt: string;
}

interface GetLinkedCommunitiesResult {
  getLinkedCommunities: LinkedCommunity[];
}

export async function getLinkedCommunities(associationId: string): Promise<LinkedCommunity[]> {
  const client = getGraphQLClient();
  const data = await client.request<GetLinkedCommunitiesResult, { associationId: string }>(
    GET_LINKED_COMMUNITIES,
    { associationId },
  );
  return data.getLinkedCommunities;
}

// ── Association Admins ────────────────────────────────────────────────────────

const GET_ASSOCIATION_ADMINS = /* GraphQL */ `
  query GetAssociationAdmins($associationId: ID!) {
    getAssociationAdmins(associationId: $associationId) {
      admins {
        id
        userId
        displayName
        email
        role
        assignedAt
      }
    }
  }
`;

export interface AssociationAdmin {
  id: string;
  userId: string;
  displayName?: string;
  email?: string;
  role: string;
  assignedAt: string;
}

export interface AssociationAdminListResponse {
  admins: AssociationAdmin[];
}

interface GetAssociationAdminsResult {
  getAssociationAdmins: AssociationAdminListResponse;
}

export async function getAssociationAdmins(
  associationId: string,
): Promise<AssociationAdminListResponse> {
  const client = getGraphQLClient();
  const data = await client.request<GetAssociationAdminsResult, { associationId: string }>(
    GET_ASSOCIATION_ADMINS,
    { associationId },
  );
  return data.getAssociationAdmins;
}

// ── Password & 2FA ────────────────────────────────────────────────────────────

const UPDATE_ADMIN_PASSWORD = /* GraphQL */ `
  mutation UpdateAdminPassword($currentPassword: String!, $newPassword: String!) {
    updateAdminPassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      success
      message
    }
  }
`;

interface UpdateAdminPasswordResult {
  updateAdminPassword: { success: boolean; message?: string };
}

export async function updateAdminPassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; message?: string }> {
  const client = getGraphQLClient();
  const data = await client.request<
    UpdateAdminPasswordResult,
    { currentPassword: string; newPassword: string }
  >(UPDATE_ADMIN_PASSWORD, { currentPassword, newPassword });
  return data.updateAdminPassword;
}

const REQUEST_ADMIN_AVATAR_UPLOAD_URL = /* GraphQL */ `
  mutation RequestAdminAvatarUploadUrl($filename: String!, $contentType: String!) {
    requestAdminAvatarUploadUrl(filename: $filename, contentType: $contentType) {
      uploadUrl
      readUrl
    }
  }
`;

export interface AdminAvatarUploadUrlResponse {
  uploadUrl: string;
  readUrl: string;
}

interface RequestAdminAvatarUploadUrlResult {
  requestAdminAvatarUploadUrl: AdminAvatarUploadUrlResponse;
}

export async function requestAdminAvatarUploadUrl(
  filename: string,
  contentType: string,
): Promise<AdminAvatarUploadUrlResponse> {
  const client = getGraphQLClient();
  const data = await client.request<
    RequestAdminAvatarUploadUrlResult,
    { filename: string; contentType: string }
  >(REQUEST_ADMIN_AVATAR_UPLOAD_URL, { filename, contentType });
  return data.requestAdminAvatarUploadUrl;
}

const ENABLE_TWO_FACTOR = /* GraphQL */ `
  mutation EnableTwoFactor($method: String!) {
    enableTwoFactor(method: $method) {
      success
      message
      qrCode
    }
  }
`;

export interface TwoFactorResponse {
  success: boolean;
  message?: string;
  qrCode?: string;
}

interface EnableTwoFactorResult {
  enableTwoFactor: TwoFactorResponse;
}

export async function enableTwoFactor(method: "APP" | "SMS"): Promise<TwoFactorResponse> {
  const client = getGraphQLClient();
  const data = await client.request<EnableTwoFactorResult, { method: string }>(
    ENABLE_TWO_FACTOR,
    { method },
  );
  return data.enableTwoFactor;
}

const VERIFY_TWO_FACTOR = /* GraphQL */ `
  mutation VerifyTwoFactor($code: String!) {
    verifyTwoFactor(code: $code) {
      success
      message
    }
  }
`;

interface VerifyTwoFactorResult {
  verifyTwoFactor: { success: boolean; message?: string };
}

export async function verifyTwoFactor(code: string): Promise<{ success: boolean; message?: string }> {
  const client = getGraphQLClient();
  const data = await client.request<VerifyTwoFactorResult, { code: string }>(
    VERIFY_TWO_FACTOR,
    { code },
  );
  return data.verifyTwoFactor;
}

const DISABLE_TWO_FACTOR = /* GraphQL */ `
  mutation DisableTwoFactor {
    disableTwoFactor {
      success
      message
    }
  }
`;

interface DisableTwoFactorResult {
  disableTwoFactor: { success: boolean; message?: string };
}

export async function disableTwoFactor(): Promise<{ success: boolean; message?: string }> {
  const client = getGraphQLClient();
  const data = await client.request<DisableTwoFactorResult>(DISABLE_TWO_FACTOR);
  return data.disableTwoFactor;
}
