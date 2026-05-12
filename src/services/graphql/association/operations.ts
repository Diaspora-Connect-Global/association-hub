import { getGraphQLClient } from "@/core/graphql-client";
import type {
  AssociationAvatarUploadType,
  AssociationAnalyticsType,
  AssociationMemberListType,
  AssociationStatsType,
  AssociationType,
  GroupMemberListType,
  GroupType,
  MemberActionInput,
  MemberReportListType,
  MembershipStatus,
  MutationResultType,
  PendingMembershipRequestListType,
  ReportStatus,
  RemoveMemberInput,
  ResolveReportInput,
  SuspendMemberInput,
  UpdateAssociationInput,
  UpdateMemberRoleInput,
} from "./types";

const GET_ASSOCIATION = /* GraphQL */ `
  query GetAssociation($id: ID!) {
    getAssociation(id: $id) {
      id
      name
      description
      joinPolicy
      visibility
      memberCount
      avatarUrl
      defaultGroupId
      createdAt
    }
  }
`;

const GET_ASSOCIATION_STATS = /* GraphQL */ `
  query GetAssociationStats($associationId: ID!) {
    getAssociationStats(associationId: $associationId) {
      totalMembers
      activeMembers
      pendingRequests
    }
  }
`;

const UPDATE_ASSOCIATION = /* GraphQL */ `
  mutation UpdateAssociation($input: UpdateAssociationInput!) {
    updateAssociation(input: $input) {
      id
      name
      description
      joinPolicy
      visibility
      memberCount
      avatarUrl
      defaultGroupId
      createdAt
    }
  }
`;

const GET_ASSOCIATION_AVATAR_UPLOAD_URL = /* GraphQL */ `
  mutation GetAssociationAvatarUploadUrl($associationId: ID!) {
    getAssociationAvatarUploadUrl(associationId: $associationId) {
      uploadUrl
      fileKey
    }
  }
`;

const GET_ASSOCIATION_MEMBERS = /* GraphQL */ `
  query GetAssociationMembers($associationId: ID!, $page: Int!, $limit: Int!, $status: MembershipStatus) {
    getAssociationMembers(associationId: $associationId, page: $page, limit: $limit, status: $status) {
      members {
        userId
        role
        status
        joinedAt
        fullName
        displayName
        firstName
        lastName
        email
        avatarUrl
        headline
      }
      total
      page
    }
  }
`;

const GET_PENDING_MEMBERSHIP_REQUESTS = /* GraphQL */ `
  query GetPendingMembershipRequests($entityId: ID!, $entityType: GroupEntityType!, $page: Int!, $limit: Int!) {
    getPendingMembershipRequests(entityId: $entityId, entityType: $entityType, page: $page, limit: $limit) {
      requests {
        userId
        requestedAt
        message
      }
      total
    }
  }
`;

const APPROVE_MEMBERSHIP = /* GraphQL */ `
  mutation ApproveMembership($input: ApproveMembershipInput!) {
    approveMembership(input: $input) {
      success
      message
    }
  }
`;

const REJECT_MEMBERSHIP = /* GraphQL */ `
  mutation RejectMembership($input: RejectMembershipInput!) {
    rejectMembership(input: $input) {
      success
      message
    }
  }
`;

const INVITE_MEMBER = /* GraphQL */ `
  mutation InviteMember($input: InviteMemberInput!) {
    inviteMember(input: $input) {
      success
      message
    }
  }
`;

const REMOVE_MEMBER = /* GraphQL */ `
  mutation RemoveMember($input: RemoveMemberInput!) {
    removeMember(input: $input) {
      success
      message
    }
  }
`;

const SUSPEND_MEMBER = /* GraphQL */ `
  mutation SuspendMember($input: SuspendMemberInput!) {
    suspendMember(input: $input) {
      success
      message
    }
  }
`;

const UNSUSPEND_MEMBER = /* GraphQL */ `
  mutation UnsuspendMember($input: UnsuspendMemberInput!) {
    unsuspendMember(input: $input) {
      success
      message
    }
  }
`;

const BLOCK_MEMBER = /* GraphQL */ `
  mutation BlockMember($input: BlockMemberInput!) {
    blockMember(input: $input) {
      success
      message
    }
  }
`;

const UPDATE_MEMBER_ROLE = /* GraphQL */ `
  mutation UpdateMemberRole($input: UpdateMemberRoleInput!) {
    updateMemberRole(input: $input) {
      success
      message
    }
  }
`;

const GET_MEMBER_REPORTS = /* GraphQL */ `
  query GetMemberReports($entityId: ID!, $entityType: GroupEntityType!, $page: Int!, $limit: Int!, $status: ReportStatus) {
    getMemberReports(entityId: $entityId, entityType: $entityType, page: $page, limit: $limit, status: $status) {
      reports {
        id
        reportedUserId
        reportedBy
        reason
        details
        status
        createdAt
      }
      total
    }
  }
`;

const RESOLVE_REPORT = /* GraphQL */ `
  mutation ResolveReport($input: ResolveReportInput!) {
    resolveReport(input: $input) {
      success
      message
    }
  }
`;

const GET_GROUP = /* GraphQL */ `
  query GetGroup($id: ID!) {
    getGroup(id: $id) {
      id
      name
      memberCount
      privacy
    }
  }
`;

const GET_GROUP_MEMBERS = /* GraphQL */ `
  query GetGroupMembers($groupId: ID!, $page: Int!, $limit: Int!) {
    getGroupMembers(groupId: $groupId, page: $page, limit: $limit) {
      members {
        userId
        role
        status
      }
      total
    }
  }
`;

export async function getAssociation(id: string): Promise<AssociationType> {
  const client = getGraphQLClient();
  const data = await client.request<{ getAssociation: AssociationType }, { id: string }>(GET_ASSOCIATION, { id });
  return data.getAssociation;
}

export async function getAssociationStats(associationId: string): Promise<AssociationStatsType> {
  const client = getGraphQLClient();
  const data = await client.request<{ getAssociationStats: AssociationStatsType }, { associationId: string }>(
    GET_ASSOCIATION_STATS,
    { associationId }
  );
  return data.getAssociationStats;
}

export async function updateAssociation(input: UpdateAssociationInput): Promise<AssociationType> {
  const client = getGraphQLClient();
  const data = await client.request<{ updateAssociation: AssociationType }, { input: UpdateAssociationInput }>(
    UPDATE_ASSOCIATION,
    { input }
  );
  return data.updateAssociation;
}

export async function getAssociationAvatarUploadUrl(
  associationId: string
): Promise<AssociationAvatarUploadType> {
  const client = getGraphQLClient();
  const data = await client.request<
    { getAssociationAvatarUploadUrl: AssociationAvatarUploadType },
    { associationId: string }
  >(GET_ASSOCIATION_AVATAR_UPLOAD_URL, { associationId });
  return data.getAssociationAvatarUploadUrl;
}

export async function uploadAssociationAvatar(uploadUrl: string, file: File): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "image/jpeg",
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Avatar upload failed. Please try again.");
  }
}

export async function getAssociationMembers(input: {
  associationId: string;
  page: number;
  limit: number;
  status?: MembershipStatus;
}): Promise<AssociationMemberListType> {
  const client = getGraphQLClient();
  const data = await client.request<
    { getAssociationMembers: AssociationMemberListType },
    { associationId: string; page: number; limit: number; status?: MembershipStatus }
  >(GET_ASSOCIATION_MEMBERS, input);
  return data.getAssociationMembers;
}

export async function getPendingMembershipRequests(input: {
  entityId: string;
  entityType: "ASSOCIATION";
  page: number;
  limit: number;
}): Promise<PendingMembershipRequestListType> {
  const client = getGraphQLClient();
  const data = await client.request<
    { getPendingMembershipRequests: PendingMembershipRequestListType },
    { entityId: string; entityType: "ASSOCIATION"; page: number; limit: number }
  >(GET_PENDING_MEMBERSHIP_REQUESTS, input);
  return data.getPendingMembershipRequests;
}

async function runMemberMutation<TInput>(query: string, input: TInput): Promise<MutationResultType> {
  const client = getGraphQLClient();
  const result = await client.rawRequest<Record<string, MutationResultType>>(query, {
    input,
  } as Record<string, unknown>);
  const data = result.data;
  const key = Object.keys(data)[0];
  return key ? data[key] : { success: false, message: "Unexpected response" };
}

export function approveMembership(input: MemberActionInput): Promise<MutationResultType> {
  return runMemberMutation(APPROVE_MEMBERSHIP, input);
}

export function rejectMembership(input: MemberActionInput): Promise<MutationResultType> {
  return runMemberMutation(REJECT_MEMBERSHIP, input);
}

export function inviteMember(input: MemberActionInput): Promise<MutationResultType> {
  return runMemberMutation(INVITE_MEMBER, input);
}

export function removeMember(input: RemoveMemberInput): Promise<MutationResultType> {
  return runMemberMutation(REMOVE_MEMBER, input);
}

export function suspendMember(input: SuspendMemberInput): Promise<MutationResultType> {
  return runMemberMutation(SUSPEND_MEMBER, input);
}

export function unsuspendMember(input: MemberActionInput): Promise<MutationResultType> {
  return runMemberMutation(UNSUSPEND_MEMBER, input);
}

export function blockMember(input: MemberActionInput): Promise<MutationResultType> {
  return runMemberMutation(BLOCK_MEMBER, input);
}

export function updateMemberRole(input: UpdateMemberRoleInput): Promise<MutationResultType> {
  return runMemberMutation(UPDATE_MEMBER_ROLE, input);
}

export async function getMemberReports(input: {
  entityId: string;
  entityType: "ASSOCIATION";
  page: number;
  limit: number;
  status?: ReportStatus;
}): Promise<MemberReportListType> {
  const client = getGraphQLClient();
  const data = await client.request<
    { getMemberReports: MemberReportListType },
    { entityId: string; entityType: "ASSOCIATION"; page: number; limit: number; status?: ReportStatus }
  >(GET_MEMBER_REPORTS, input);
  return data.getMemberReports;
}

export function resolveReport(input: ResolveReportInput): Promise<MutationResultType> {
  return runMemberMutation(RESOLVE_REPORT, input);
}

export async function getGroup(id: string): Promise<GroupType> {
  const client = getGraphQLClient();
  const data = await client.request<{ getGroup: GroupType }, { id: string }>(GET_GROUP, { id });
  return data.getGroup;
}

export async function getGroupMembers(input: {
  groupId: string;
  page: number;
  limit: number;
}): Promise<GroupMemberListType> {
  const client = getGraphQLClient();
  const data = await client.request<
    { getGroupMembers: GroupMemberListType },
    { groupId: string; page: number; limit: number }
  >(GET_GROUP_MEMBERS, input);
  return data.getGroupMembers;
}

// ── Association Admin Operations ──────────────────────────────────────────────

export interface AssociationAdminResult {
  success: boolean;
  message?: string;
}

const LINK_ASSOCIATION = /* GraphQL */ `
  mutation LinkAssociation($input: LinkAssociationInput!) {
    linkAssociation(input: $input) {
      success
      message
    }
  }
`;

const UNLINK_ASSOCIATION = /* GraphQL */ `
  mutation UnlinkAssociation($input: UnlinkAssociationInput!) {
    unlinkAssociation(input: $input) {
      success
      message
    }
  }
`;

const ASSIGN_ASSOCIATION_ADMIN = /* GraphQL */ `
  mutation AssignAssociationAdmin($input: AssignAssociationAdminInput!) {
    assignAssociationAdmin(input: $input) {
      success
      message
    }
  }
`;

const REMOVE_ASSOCIATION_ADMIN = /* GraphQL */ `
  mutation RemoveAssociationAdmin($input: RemoveAssociationAdminInput!) {
    removeAssociationAdmin(input: $input) {
      success
      message
    }
  }
`;

export async function linkCommunityToAssociation(
  associationId: string,
  communityId: string
): Promise<AssociationAdminResult> {
  const client = getGraphQLClient();
  const data = await client.request<
    { linkAssociation: AssociationAdminResult },
    { input: { associationId: string; communityId: string } }
  >(LINK_ASSOCIATION, { input: { associationId, communityId } });
  return data.linkAssociation;
}

export async function unlinkCommunityFromAssociation(
  associationId: string,
  communityId: string
): Promise<AssociationAdminResult> {
  const client = getGraphQLClient();
  const data = await client.request<
    { unlinkAssociation: AssociationAdminResult },
    { input: { associationId: string; communityId: string } }
  >(UNLINK_ASSOCIATION, { input: { associationId, communityId } });
  return data.unlinkAssociation;
}

export async function assignAssociationAdmin(
  associationId: string,
  userId: string,
  role?: string
): Promise<AssociationAdminResult> {
  const client = getGraphQLClient();
  const data = await client.request<
    { assignAssociationAdmin: AssociationAdminResult },
    { input: { associationId: string; userId: string; role?: string } }
  >(ASSIGN_ASSOCIATION_ADMIN, { input: { associationId, userId, role } });
  return data.assignAssociationAdmin;
}

export async function removeAssociationAdmin(
  associationId: string,
  adminId: string
): Promise<AssociationAdminResult> {
  const client = getGraphQLClient();
  const data = await client.request<
    { removeAssociationAdmin: AssociationAdminResult },
    { input: { associationId: string; adminId: string } }
  >(REMOVE_ASSOCIATION_ADMIN, { input: { associationId, adminId } });
  return data.removeAssociationAdmin;
}

// ── Analytics ─────────────────────────────────────────────────────────────────

const GET_ASSOCIATION_ANALYTICS = /* GraphQL */ `
  query GetAssociationAnalytics($associationId: String!, $period: String) {
    getAssociationAnalytics(associationId: $associationId, period: $period) {
      totalMembers
      newMembersThisPeriod
      totalPosts
      newPostsThisPeriod
      totalEvents
      activeOpportunities
      totalRevenue
      memberGrowthData {
        date
        value
      }
      activityData {
        date
        value
      }
    }
  }
`;

export async function getAssociationAnalytics(
  associationId: string,
  period?: string
): Promise<AssociationAnalyticsType> {
  const client = getGraphQLClient();
  const data = await client.request<
    { getAssociationAnalytics: AssociationAnalyticsType },
    { associationId: string; period?: string }
  >(GET_ASSOCIATION_ANALYTICS, { associationId, period });
  return data.getAssociationAnalytics;
}
