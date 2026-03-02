/** Scope for admin: PLATFORM (super admin), COMMUNITY, or ASSOCIATION */
export type AdminScopeType = "PLATFORM" | "COMMUNITY" | "ASSOCIATION";

export interface AdminLoginInput {
  email: string;
  password: string;
}

export interface AdminRoleInfo {
  id: string;
  name: string;
  scopeType: string;
  permissions: string[];
  description: string | null;
}

export interface AdminUserInfo {
  id: string;
  userId: string;
  scopeType: AdminScopeType;
  scopeId: string | null;
  isActive: boolean;
  role: AdminRoleInfo | null;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string | null;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  admin: AdminUserInfo | null;
}
