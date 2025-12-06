export type GroupPrivacy = "private" | "public";
export type NotificationSetting = "all" | "mentions" | "muted";
export type GroupRole = "admin" | "moderator" | "member";

export interface Group {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  avatarEmoji?: string;
  privacy: GroupPrivacy;
  defaultNotifications: NotificationSetting;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhoto?: string;
  role: GroupRole;
  joinedAt: string;
}

export interface GroupFormData {
  name: string;
  description: string;
  avatar?: File | null;
  privacy: GroupPrivacy;
  defaultNotifications: NotificationSetting;
}
