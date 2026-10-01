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
  UpdateAssociationServicesInput,
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
      enabledServices
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
      enabledServices
      createdAt
    }
  }
`;

const UPDATE_ASSOCIATION_SERVICES = /* GraphQL */ `
  mutation UpdateAssociationServices($input: UpdateAssociationServicesInput!) {
    updateAssociationServices(input: $input) {
      id
      enabledServices
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

const GET_ASSOCIATION_COVER_UPLOAD_URL = /* GraphQL */ `
  mutation GetAssociationCoverUploadUrl($associationId: ID!) {
    getAssociationCoverUploadUrl(associationId: $associationId) {
      uploadUrl
      fileKey
    }
  }
`;

const GET_ASSOCIATION_MEMBERS = /* GraphQL */ `
  query GetAssociationMembers($associationId: ID!, $limit: Int, $offset: Int, $status: MembershipStatus) {
    getAssociationMembers(associationId: $associationId, limit: $limit, offset: $offset, status: $status) {
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
      hasMore
    }
  }
`;

const GET_PENDING_MEMBERSHIP_REQUESTS = /* GraphQL */ `
  query GetPendingMembershipRequests($entityId: ID!, $entityType: GroupEntityType!, $limit: Int, $offset: Int) {
    getPendingMembershipRequests(entityId: $entityId, entityType: $entityType, limit: $limit, offset: $offset) {
      requests {
        userId
        requestedAt
        message
        fullName
        displayName
        email
      }
      total
      hasMore
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

// InviteMemberResponse has no `success` field and InviteMemberInput names the
// person `targetUserId`; the old document (success/message + userId) failed
// validation on every call. `status` is the membership state after the call:
// INVITED (invited now or already), ACTIVE (already a member), PENDING (has a
// join request waiting).
const INVITE_MEMBER = /* GraphQL */ `
  mutation InviteMember($input: InviteMemberInput!) {
    inviteMember(input: $input) {
      status
      inviteId
      message
    }
  }
`;

// Member actions use the gateway's community/association operations (see
// api-gateway community.resolver.ts). The previous documents named input types
// that don't exist (RemoveMemberInput, SuspendMemberInput, UnsuspendMemberInput)
// or called group-level mutations that need a groupId (blockMember,
// updateMemberRole), so every one of them failed validation.
//   remove    → removeMember(CommunityRemoveMemberInput { userId entityId entityType reason })
//   suspend   → suspendMember(CommunityRemoveMemberInput) — the gateway reuses that input
//   unsuspend → unsuspendMember(UnbanUserInput { userId entityId entityType })
//   block     → banUser(BanUserInput { userId entityId entityType reason })
//   role      → assignMemberRole(AssignMemberRoleInput { userId entityId entityType role })
const REMOVE_MEMBER = /* GraphQL */ `
  mutation RemoveMember($input: CommunityRemoveMemberInput!) {
    removeMember(input: $input) {
      success
      message
    }
  }
`;

const SUSPEND_MEMBER = /* GraphQL */ `
  mutation SuspendMember($input: CommunityRemoveMemberInput!) {
    suspendMember(input: $input) {
      success
      message
    }
  }
`;

const UNSUSPEND_MEMBER = /* GraphQL */ `
  mutation UnsuspendMember($input: UnbanUserInput!) {
    unsuspendMember(input: $input) {
      success
      message
    }
  }
`;

const BAN_MEMBER = /* GraphQL */ `
  mutation BanMember($input: BanUserInput!) {
    banUser(input: $input) {
      success
      message
    }
  }
`;

const ASSIGN_MEMBER_ROLE = /* GraphQL */ `
  mutation AssignMemberRole($input: AssignMemberRoleInput!) {
    assignMemberRole(input: $input) {
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

export async function updateAssociationServices(
  input: UpdateAssociationServicesInput
): Promise<AssociationType> {
  const client = getGraphQLClient();
  const data = await client.request<
    { updateAssociationServices: AssociationType },
    { input: UpdateAssociationServicesInput }
  >(UPDATE_ASSOCIATION_SERVICES, { input });
  return data.updateAssociationServices;
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

export async function getAssociationCoverUploadUrl(
  associationId: string
): Promise<AssociationAvatarUploadType> {
  const client = getGraphQLClient();
  const data = await client.request<
    { getAssociationCoverUploadUrl: AssociationAvatarUploadType },
    { associationId: string }
  >(GET_ASSOCIATION_COVER_UPLOAD_URL, { associationId });
  return data.getAssociationCoverUploadUrl;
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
  limit: number;
  offset: number;
  status?: MembershipStatus;
}): Promise<AssociationMemberListType> {
  const client = getGraphQLClient();
  const data = await client.request<
    { getAssociationMembers: AssociationMemberListType },
    { associationId: string; limit: number; offset: number; status?: MembershipStatus }
  >(GET_ASSOCIATION_MEMBERS, input);
  return data.getAssociationMembers;
}

export async function getPendingMembershipRequests(input: {
  entityId: string;
  entityType: "ASSOCIATION";
  limit: number;
  offset: number;
}): Promise<PendingMembershipRequestListType> {
  const client = getGraphQLClient();
  const data = await client.request<
    { getPendingMembershipRequests: PendingMembershipRequestListType },
    { entityId: string; entityType: "ASSOCIATION"; limit: number; offset: number }
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

export function rejectMembership(
  input: MemberActionInput & { reason?: string }
): Promise<MutationResultType> {
  return runMemberMutation(REJECT_MEMBERSHIP, input);
}

/** `inviteMember` result: the person's membership status after the call. */
export interface InviteMemberResult {
  status: string;
  inviteId?: string | null;
  message?: string | null;
}

export async function inviteMember(input: MemberActionInput): Promise<InviteMemberResult> {
  const client = getGraphQLClient();
  const data = await client.request<
    { inviteMember: InviteMemberResult },
    { input: { targetUserId: string; entityId: string; entityType: string } }
  >(INVITE_MEMBER, {
    input: { targetUserId: input.userId, entityId: input.entityId, entityType: input.entityType },
  });
  return data.inviteMember;
}

export function removeMember(input: RemoveMemberInput): Promise<MutationResultType> {
  return runMemberMutation(REMOVE_MEMBER, input);
}

export function suspendMember(input: SuspendMemberInput): Promise<MutationResultType> {
  return runMemberMutation(SUSPEND_MEMBER, input);
}

export function unsuspendMember(input: MemberActionInput): Promise<MutationResultType> {
  // UnbanUserInput has no `reason`; send exactly its three fields.
  return runMemberMutation(UNSUSPEND_MEMBER, {
    userId: input.userId,
    entityId: input.entityId,
    entityType: input.entityType,
  });
}

/** "Block" from the association = an association-level ban (banUser). */
export function blockMember(
  input: MemberActionInput & { reason?: string }
): Promise<MutationResultType> {
  return runMemberMutation(BAN_MEMBER, {
    userId: input.userId,
    entityId: input.entityId,
    entityType: input.entityType,
    reason: input.reason ?? "Blocked by association admin",
  });
}

/**
 * Change a member's role in the association (assignMemberRole). From a console
 * this is refused until the gateway forwards the console's entity-admin claim;
 * callers should present that refusal clearly (see `isRoleChangeRefused`).
 */
export function updateMemberRole(input: UpdateMemberRoleInput): Promise<MutationResultType> {
  return runMemberMutation(ASSIGN_MEMBER_ROLE, {
    userId: input.userId,
    entityId: input.entityId,
    entityType: input.entityType,
    role: input.role,
  });
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

/** Link row status: PENDING while the community's admins decide. */
export type AssociationLinkStatus = "PENDING" | "ACTIVE" | "REJECTED";

export interface LinkAssociationResult extends AssociationAdminResult {
  /** ACTIVE when linked immediately; PENDING when the community's admins must approve. */
  status?: AssociationLinkStatus | string | null;
}

/** This association's request to be linked to a community. Names only — never user ids. */
export interface AssociationLinkRequest {
  communityId: string;
  associationId: string;
  status: AssociationLinkStatus | string;
  requestedAt?: string | null;
  decidedAt?: string | null;
  communityName?: string | null;
  communityAvatarUrl?: string | null;
}

const LINK_ASSOCIATION = /* GraphQL */ `
  mutation LinkAssociation($input: LinkAssociationInput!) {
    linkAssociation(input: $input) {
      success
      message
      status
    }
  }
`;

const ASSOCIATION_LINK_REQUESTS = /* GraphQL */ `
  query AssociationLinkRequests($associationId: ID!) {
    associationLinkRequests(associationId: $associationId) {
      communityId
      associationId
      status
      requestedAt
      decidedAt
      communityName
      communityAvatarUrl
    }
  }
`;

// The gateway's unlinkAssociation takes a LinkAssociationInput (there is no
// UnlinkAssociationInput type in the schema, so that name failed validation).
// It also withdraws a pending link request.
const UNLINK_ASSOCIATION = /* GraphQL */ `
  mutation UnlinkAssociation($input: LinkAssociationInput!) {
    unlinkAssociation(input: $input) {
      success
      message
    }
  }
`;

// The gateway has no AssignAssociationAdminInput (its assignAssociationAdmin
// creates a new console account by email and is platform-admin only), so the
// old document failed validation on every call. Making an existing member an
// admin or moderator of this association is assignMemberRole.
const ASSIGN_ASSOCIATION_ADMIN = /* GraphQL */ `
  mutation AssignMemberRole($input: AssignMemberRoleInput!) {
    assignMemberRole(input: $input) {
      success
      message
    }
  }
`;


export async function linkCommunityToAssociation(
  associationId: string,
  communityId: string
): Promise<LinkAssociationResult> {
  const client = getGraphQLClient();
  const data = await client.request<
    { linkAssociation: LinkAssociationResult },
    { input: { associationId: string; communityId: string } }
  >(LINK_ASSOCIATION, { input: { associationId, communityId } });
  return data.linkAssociation;
}

/** Link requests this association has sent (PENDING / ACTIVE / REJECTED). */
export async function getAssociationLinkRequests(
  associationId: string
): Promise<AssociationLinkRequest[]> {
  const client = getGraphQLClient();
  const data = await client.request<
    { associationLinkRequests: AssociationLinkRequest[] },
    { associationId: string }
  >(ASSOCIATION_LINK_REQUESTS, { associationId });
  return data.associationLinkRequests ?? [];
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
    { assignMemberRole: AssociationAdminResult },
    { input: { userId: string; entityId: string; entityType: "ASSOCIATION"; role: string } }
  >(ASSIGN_ASSOCIATION_ADMIN, {
    input: { userId, entityId: associationId, entityType: "ASSOCIATION", role: role ?? "ADMIN" },
  });
  return data.assignMemberRole;
}

/**
 * Remove someone's admin role. The gateway has no removeAssociationAdmin (the
 * old document called a mutation that doesn't exist); an association admin is
 * a membership with an admin role, so demoting is assignMemberRole → MEMBER.
 * Takes the admin's USER id (not the admin-row id).
 */
export async function removeAssociationAdmin(
  associationId: string,
  adminUserId: string
): Promise<AssociationAdminResult> {
  return assignAssociationAdmin(associationId, adminUserId, "MEMBER");
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
