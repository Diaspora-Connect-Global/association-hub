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
