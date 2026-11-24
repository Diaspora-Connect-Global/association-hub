import { useAdminAuthStore, decodeAdminJwt } from "@/stores/adminAuthStore";
import { getAdminPermissions, hasPermission, MANAGE_ROLES_PERMISSION } from "@/lib/adminAccess";

/** Whether the signed-in admin may manage roles and console admins (same rule as the Roles & Admins page). */
export function useCanManageRoles(): boolean {
  const admin = useAdminAuthStore((state) => state.admin);
  const accessToken = useAdminAuthStore((state) => state.accessToken);
  return hasPermission(getAdminPermissions(admin, decodeAdminJwt(accessToken)), MANAGE_ROLES_PERMISSION);
}
