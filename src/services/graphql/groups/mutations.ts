import { getGraphQLClient } from "@/core/graphql-client";
import type {
  Group,
  GroupMember,
  GroupInvitation,
  GroupReport,
  BlockedMember,
  TransferGroupOwnershipResponse,
  GroupCommonResponse,
  CreateGroupInput,
  UpdateGroupInput,
  InviteToGroupInput,
  CancelInvitationInput,
  ModerateJoinRequestInput,
  RejectJoinRequestInput,
  UpdateMemberRoleInput,
  GroupRemoveMemberInput,
  BlockMemberInput,
  UnblockMemberInput,
  GroupTransferOwnershipInput,
  ReportMemberInput,
} from "./types";

export async function createGroup(input: CreateGroupInput): Promise<{ group: Group }> {
  const mutation = `
    mutation CreateGroup($input: CreateGroupInput!) {
      createGroup(input: $input) {
        group {
          id
          name
          privacy
          memberCount
          category
          createdAt
          entityId
          entityType
        }
      }
    }
  `;
  const client = getGraphQLClient();
  const data = await client.request<
    { createGroup: { group: Group } },
    { input: CreateGroupInput }
  >(mutation, { input });
  return data.createGroup;
}

export async function updateGroup(input: UpdateGroupInput): Promise<{ group: Group }> {
  const mutation = `
    mutation UpdateGroup($input: UpdateGroupInput!) {
      updateGroup(input: $input) {
        group {
          id
          name
          description
          privacy
          category
          avatarUrl
        }
      }
    }
  `;
  const client = getGraphQLClient();
  const data = await client.request<
    { updateGroup: { group: Group } },
    { input: UpdateGroupInput }
  >(mutation, { input });
  return data.updateGroup;
}

export async function deleteGroup(groupId: string): Promise<GroupCommonResponse> {
  const mutation = `
    mutation DeleteGroup($groupId: ID!) {
      deleteGroup(groupId: $groupId) {
        success
        message
      }
    }
  `;
  const client = getGraphQLClient();
  const data = await client.request<
    { deleteGroup: GroupCommonResponse },
    { groupId: string }
  >(mutation, { groupId });
  return data.deleteGroup;
}

export async function inviteToGroup(
  input: InviteToGroupInput
): Promise<{ invitation: GroupInvitation }> {
  const mutation = `
    mutation InviteToGroup($input: InviteToGroupInput!) {
      inviteToGroup(input: $input) {
        invitation {
          id
          groupId
          invitedUserId
          status
          expiresAt
          createdAt
        }
      }
    }
  `;
  const client = getGraphQLClient();
  const data = await client.request<
    { inviteToGroup: { invitation: GroupInvitation } },
    { input: InviteToGroupInput }
  >(mutation, { input });
  return data.inviteToGroup;
}

export async function cancelGroupInvitation(
  input: CancelInvitationInput
): Promise<{ invitation: Pick<GroupInvitation, "id" | "status"> }> {
  const mutation = `
    mutation CancelGroupInvitation($input: CancelInvitationInput!) {
      cancelGroupInvitation(input: $input) {
        invitation {
          id
          status
        }
      }
    }
  `;
  const client = getGraphQLClient();
  const data = await client.request<
    { cancelGroupInvitation: { invitation: Pick<GroupInvitation, "id" | "status"> } },
    { input: CancelInvitationInput }
  >(mutation, { input });
  return data.cancelGroupInvitation;
}

export async function approveJoinRequest(
  input: ModerateJoinRequestInput
): Promise<{ member: GroupMember }> {
  const mutation = `
    mutation ApproveJoinRequest($input: ModerateJoinRequestInput!) {
      approveJoinRequest(input: $input) {
        member {
          id
          userId
          role
          status
          joinedAt
        }
      }
    }
  `;
  const client = getGraphQLClient();
  const data = await client.request<
    { approveJoinRequest: { member: GroupMember } },
    { input: ModerateJoinRequestInput }
  >(mutation, { input });
  return data.approveJoinRequest;
}

export async function rejectJoinRequest(
  input: RejectJoinRequestInput
): Promise<GroupCommonResponse> {
  const mutation = `
    mutation RejectJoinRequest($input: RejectJoinRequestInput!) {
      rejectJoinRequest(input: $input) {
        success
        message
      }
    }
  `;
  const client = getGraphQLClient();
  const data = await client.request<
    { rejectJoinRequest: GroupCommonResponse },
    { input: RejectJoinRequestInput }
  >(mutation, { input });
  return data.rejectJoinRequest;
}

export async function updateMemberRole(
  input: UpdateMemberRoleInput
): Promise<{ member: GroupMember }> {
  const mutation = `
    mutation UpdateMemberRole($input: UpdateMemberRoleInput!) {
      updateMemberRole(input: $input) {
        member {
          id
          userId
          role
          status
        }
      }
    }
  `;
  const client = getGraphQLClient();
  const data = await client.request<
    { updateMemberRole: { member: GroupMember } },
    { input: UpdateMemberRoleInput }
  >(mutation, { input });
  return data.updateMemberRole;
}

/** Removes a member from a group (distinct from community removeMember) */
export async function removeGroupMember(
  input: GroupRemoveMemberInput
): Promise<GroupCommonResponse> {
  const mutation = `
    mutation RemoveGroupMember($input: GroupRemoveMemberInput!) {
      removeMember(input: $input) {
        success
        message
      }
    }
  `;
  const client = getGraphQLClient();
  const data = await client.request<
    { removeMember: GroupCommonResponse },
    { input: GroupRemoveMemberInput }
  >(mutation, { input });
  return data.removeMember;
}

export async function blockMember(
  input: BlockMemberInput
): Promise<{ block: BlockedMember }> {
  const mutation = `
    mutation BlockMember($input: BlockMemberInput!) {
      blockMember(input: $input) {
        block {
          id
          groupId
          userId
          reason
          expiresAt
          createdAt
        }
      }
    }
  `;
  const client = getGraphQLClient();
  const data = await client.request<
    { blockMember: { block: BlockedMember } },
    { input: BlockMemberInput }
  >(mutation, { input });
  return data.blockMember;
}

export async function unblockMember(
  input: UnblockMemberInput
): Promise<GroupCommonResponse> {
  const mutation = `
    mutation UnblockMember($input: UnblockMemberInput!) {
      unblockMember(input: $input) {
        success
        message
      }
    }
  `;
  const client = getGraphQLClient();
  const data = await client.request<
    { unblockMember: GroupCommonResponse },
    { input: UnblockMemberInput }
  >(mutation, { input });
  return data.unblockMember;
}

export async function transferGroupOwnership(
  input: GroupTransferOwnershipInput
): Promise<TransferGroupOwnershipResponse> {
  const mutation = `
    mutation TransferGroupOwnership($input: GroupTransferOwnershipInput!) {
      transferGroupOwnership(input: $input) {
        success
        message
        newOwnerId
        previousOwnerId
      }
    }
  `;
  const client = getGraphQLClient();
  const data = await client.request<
    { transferGroupOwnership: TransferGroupOwnershipResponse },
    { input: GroupTransferOwnershipInput }
  >(mutation, { input });
  return data.transferGroupOwnership;
}

export async function reportMember(
  input: ReportMemberInput
): Promise<{ report: GroupReport }> {
  const mutation = `
    mutation ReportMember($input: ReportMemberInput!) {
      reportMember(input: $input) {
        report {
          id
          groupId
          reporterId
          reportedUserId
          reason
          description
          createdAt
        }
      }
    }
  `;
  const client = getGraphQLClient();
  const data = await client.request<
    { reportMember: { report: GroupReport } },
    { input: ReportMemberInput }
  >(mutation, { input });
  return data.reportMember;
}
