// Matches the backend JoinPolicy enum. "PAID" is included so a paid association
// round-trips without being downgraded; it isn't offered as a selectable option
// in these self-service forms (they have no price fields).
export type JoinPolicy = "OPEN" | "APPROVAL" | "INVITE_ONLY" | "PAID";
export type AssociationVisibility = "PUBLIC" | "PRIVATE";
export type MembershipStatus = "ACTIVE" | "SUSPENDED";
export type MemberRole = "MEMBER" | "MODERATOR";
export type ReportStatus = "PENDING" | "RESOLVED";
export type ReportResolution = "WARNING_ISSUED" | "MEMBER_REMOVED" | "NO_ACTION";

export interface AssociationType {
  id: string;
  name: string;
  description: string | null;
  joinPolicy: JoinPolicy;
  visibility: AssociationVisibility;
  memberCount: number;
  avatarUrl: string | null;
  defaultGroupId: string | null;
  enabledServices: string[] | null;
  createdAt: string;
}

export interface AssociationStatsType {
  totalMembers: number;
  activeMembers: number;
  pendingRequests: number;
}

export interface UpdateAssociationInput {
  id: string;
  name?: string;
  description?: string;
  joinPolicy?: JoinPolicy;
  visibility?: AssociationVisibility;
  avatarKey?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  address?: string;
  countriesServed?: string[];
  associationType?: string;
  whoCanPost?: string;
  paidAssociation?: boolean;
  paymentType?: string;
  paymentAmount?: number;
  subscriptionPeriod?: string;
  paymentCurrency?: string;
}

export interface UpdateAssociationServicesInput {
  associationId: string;
  services: string[];
}

export interface AssociationAnalyticsDataPoint {
  date: string;
  value: number;
}

export interface AssociationAnalyticsType {
  totalMembers: number;
  newMembersThisPeriod: number;
  totalPosts: number;
  newPostsThisPeriod: number;
  totalEvents: number;
  activeOpportunities: number;
  totalRevenue: number;
  memberGrowthData: AssociationAnalyticsDataPoint[];
  activityData: AssociationAnalyticsDataPoint[];
}

export interface AssociationAvatarUploadType {
  uploadUrl: string;
  fileKey: string;
}

export interface AssociationMemberType {
  userId: string;
  role: MemberRole;
  status: MembershipStatus;
  joinedAt: string;
  fullName?: string | null;
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  headline?: string | null;
}

export interface AssociationMemberListType {
  members: AssociationMemberType[];
  total: number;
  page: number;
}

export interface PendingMembershipRequestType {
  userId: string;
  requestedAt: string;
  message: string | null;
  fullName?: string | null;
  displayName?: string | null;
  email?: string | null;
}

export interface PendingMembershipRequestListType {
  requests: PendingMembershipRequestType[];
  total: number;
}

export interface MemberActionInput {
  entityId: string;
  entityType: "ASSOCIATION";
  userId: string;
}

export interface RemoveMemberInput extends MemberActionInput {
  reason: string;
}

export interface SuspendMemberInput extends MemberActionInput {
  reason: string;
}

export interface UpdateMemberRoleInput extends MemberActionInput {
  role: MemberRole;
}

export interface MutationResultType {
  success: boolean;
  message: string | null;
}

export interface MemberReportType {
  id: string;
  reportedUserId: string;
  reportedBy: string;
  reason: string;
  details: string | null;
  status: ReportStatus;
  createdAt: string;
}

export interface MemberReportListType {
  reports: MemberReportType[];
  total: number;
}

export interface ResolveReportInput {
  reportId: string;
  resolution: ReportResolution;
  notes?: string;
}

export interface GroupType {
  id: string;
  name: string;
  memberCount: number;
  privacy: string;
}

export interface GroupMemberType {
  userId: string;
  role: string;
  status: string;
}

export interface GroupMemberListType {
  members: GroupMemberType[];
  total: number;
}

export interface LinkedCommunityType {
  id: string;
  name: string;
  memberCount: number;
  avatarUrl: string | null;
  visibility: string;
  createdAt: string;
}

export interface AssociationAdminType {
  id: string;
  userId: string;
  displayName: string | null;
  email: string | null;
  role: string;
  assignedAt: string;
}

export interface AssociationAdminListResponseType {
  admins: AssociationAdminType[];
}
