import { useMemo } from "react";
import { useAdminAuthStore, decodeAdminJwt } from "@/stores/adminAuthStore";
import { getConsoleAccess, type ConsoleAccess } from "@/lib/rolePermissions";

/**
 * What the signed-in admin may use in the console. Built-in admins keep the
 * whole console; a custom-role admin sees only what its role grants. A UI
 * convenience — the server enforces every permission.
 */
export function useConsoleAccess(): ConsoleAccess {
  const admin = useAdminAuthStore((s) => s.admin);
  const accessToken = useAdminAuthStore((s) => s.accessToken);
  return useMemo(() => getConsoleAccess(decodeAdminJwt(accessToken), admin), [accessToken, admin]);
}
