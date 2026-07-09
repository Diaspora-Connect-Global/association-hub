/**
 * Client-side RBAC helpers for the Roles & Admins feature.
 *
 * These mirror the backend permission model (admin-service
 * role-permissions.ts). They are a UI convenience/guard only — the backend
 * remains the source of truth and enforces the same rules server-side. Never
 * treat a client-side pass as authorization on its own.
 *
 * association-hub note: unlike the community hub (which keeps a separate
 * `claims` object in its auth store), this app exposes the logged-in admin as
 * `AdminUserInfo` plus a `DecodedAdminJwt` (from the access token). Permissions
 * live on `admin.role.permissions`; the held role type is `admin.role.name`
 * and/or the decoded JWT `role`.
 */
import type { AdminUserInfo } from "@/services/graphql/adminAuth";
import type { DecodedAdminJwt } from "@/stores/adminAuthStore";

/** Permission that gates the Roles & Admins management surface. */
export const MANAGE_ROLES_PERMISSION = "association:manage_roles";

/** Wildcard permission held by SYSTEM_ADMIN — satisfies any permission check. */
const WILDCARD = "*";

/**
 * Role hierarchy (ascending privilege), matching the backend
 * admin-role-type.enum.ts ROLE_HIERARCHY. An admin may only grant a role at or
 * below their own highest-held role — prevents privilege escalation.
 */
const ROLE_RANK: Record<string, number> = {
  MODERATOR: 0,
  ASSOCIATION_ADMIN: 1,
  COMMUNITY_ADMIN: 2,
  SYSTEM_ADMIN: 3,
};

/**
 * Union of all permissions the current admin holds, from both the decoded JWT
 * and the login-established admin record. Lower-cased and de-duplicated.
 */
export function getAdminPermissions(
  admin: AdminUserInfo | null,
  jwt: DecodedAdminJwt | null,
): string[] {
  const set = new Set<string>();
  for (const p of admin?.role?.permissions ?? []) {
    const v = p?.trim().toLowerCase();
    if (v) set.add(v);
  }
  // The JWT does not currently carry a permissions array in this app, but guard
  // for it in case the token shape grows.
  const jwtPerms = (jwt as unknown as { permissions?: string[] })?.permissions;
  for (const p of jwtPerms ?? []) {
    const v = p?.trim().toLowerCase();
    if (v) set.add(v);
  }
  return [...set];
}

/** True when the permission set satisfies `required` (wildcard aware). */
export function hasPermission(permissions: string[], required: string): boolean {
  if (permissions.includes(WILDCARD)) return true;
  return permissions.includes(required.toLowerCase());
}

/** Normalised set of role-type strings the current admin holds. */
export function getAdminRoleTypes(
  admin: AdminUserInfo | null,
  jwt: DecodedAdminJwt | null,
): string[] {
  const set = new Set<string>();
  if (jwt?.role) set.add(jwt.role.trim().toUpperCase());
  if (admin?.role?.name) set.add(admin.role.name.trim().toUpperCase());
  return [...set];
}

/** Highest role rank the current admin holds, or -1 if none recognised. */
export function getAdminMaxRoleRank(
  admin: AdminUserInfo | null,
  jwt: DecodedAdminJwt | null,
): number {
  return getAdminRoleTypes(admin, jwt).reduce(
    (max, r) => Math.max(max, ROLE_RANK[r] ?? -1),
    -1,
  );
}

/**
 * Filter a list of assignable role-type options to those at or below the
 * current admin's own highest role — no privilege escalation. SYSTEM_ADMIN and
 * COMMUNITY_ADMIN are never assignable from this association-scoped UI
 * regardless.
 */
export function filterAssignableRoleTypes<T extends { value: string }>(
  options: readonly T[],
  admin: AdminUserInfo | null,
  jwt: DecodedAdminJwt | null,
): T[] {
  const maxRank = getAdminMaxRoleRank(admin, jwt);
  return options.filter((o) => {
    if (o.value === "SYSTEM_ADMIN" || o.value === "COMMUNITY_ADMIN") return false;
    const rank = ROLE_RANK[o.value] ?? Number.MAX_SAFE_INTEGER;
    return rank <= maxRank;
  });
}
