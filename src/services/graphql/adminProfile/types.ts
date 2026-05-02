export interface AdminNotificationPreferences {
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
}

export interface AdminProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  twoFactorEnabled: boolean;
  notificationPreferences: AdminNotificationPreferences;
}

export interface UpdateAdminProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface CommonResponse {
  success: boolean;
  message?: string;
}
