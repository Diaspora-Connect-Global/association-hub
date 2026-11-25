import { useConsoleAccess } from "@/hooks/useConsoleAccess";
import { canManageRolesPage } from "@/lib/rolePermissions";

/**
 * Whether the signed-in admin may open Roles & Admins: a built-in admin with the
 * manage-roles permission (as before), or a custom role with "Manage roles".
 */
export function useCanManageRoles(): boolean {
  return canManageRolesPage(useConsoleAccess());
}
