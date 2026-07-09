/**
 * Canonical catalog of admin permission keys used when defining custom roles for
 * an association.
 *
 * IMPORTANT: These keys are the contract with the backend and MUST mirror the
 * admin-service permission keys defined in
 *   backend/services/admin-service/src/domain/value-objects/role-permissions.ts
 * (DEFAULT_PERMISSIONS). If the backend adds/renames a permission key, update
 * this list to match — the strings are sent verbatim in
 * `CreateRoleDefinitionInput.permissions`.
 *
 * Only the association-relevant permissions are listed here (this admin hub is
 * scoped to a single association). System-wide permissions (e.g. the
 * SYSTEM_ADMIN wildcard '*') are intentionally excluded. These are exactly the
 * keys granted to ASSOCIATION_ADMIN / MODERATOR in the backend
 * DEFAULT_PERMISSIONS map.
 */

export interface AdminPermissionDef {
  /** Stable key sent to / received from the backend. */
  key: string;
  /** Human-readable label shown in the UI. */
  label: string;
  /** Logical group used to organise the checkboxes. */
  group: string;
}

/** Ordered catalog of assignable permissions. Order drives display order. */
export const ADMIN_PERMISSIONS: readonly AdminPermissionDef[] = [
  // Association management
  { key: "association:read", label: "View association", group: "Association" },
  { key: "association:write", label: "Edit association settings", group: "Association" },
  { key: "association:manage_members", label: "Manage members", group: "Association" },
  { key: "association:moderate_content", label: "Moderate content", group: "Association" },
  { key: "association:manage_roles", label: "Manage roles & admins", group: "Association" },
  // Reports
  { key: "reports:read", label: "View reports", group: "Reports" },
  { key: "reports:resolve", label: "Resolve reports", group: "Reports" },
  // Moderation
  { key: "moderation:ban_user", label: "Ban users", group: "Moderation" },
  { key: "moderation:warn_user", label: "Warn users", group: "Moderation" },
  { key: "moderation:delete_post", label: "Delete posts", group: "Moderation" },
  { key: "moderation:delete_comment", label: "Delete comments", group: "Moderation" },
];

/** All permission keys, in catalog order. */
export const ALL_PERMISSION_KEYS: readonly string[] = ADMIN_PERMISSIONS.map((p) => p.key);

/** Ordered list of distinct permission groups. */
export const PERMISSION_GROUPS: readonly string[] = Array.from(
  new Set(ADMIN_PERMISSIONS.map((p) => p.group)),
);

/** Look up a human label for a permission key, falling back to the raw key. */
export function permissionLabel(key: string): string {
  return ADMIN_PERMISSIONS.find((p) => p.key === key)?.label ?? key;
}

/**
 * Admin / role types that make sense to assign within an association scope.
 * Values are the backend `AdminRoleType` enum strings (see
 * admin-service/.../admin-role-type.enum.ts). Used both as `adminType` when
 * creating an admin and as `roleType` when assigning a role.
 *
 * Stage 1 note: the backend `assignAdminRole` mutation accepts built-in role
 * types only (it does not yet support assigning CUSTOM role definitions), so
 * this list is exactly the built-in association-scoped role types.
 */
export interface AdminRoleTypeOption {
  value: string;
  label: string;
}

export const ASSOCIATION_ADMIN_TYPES: readonly AdminRoleTypeOption[] = [
  { value: "ASSOCIATION_ADMIN", label: "Association Admin" },
  { value: "MODERATOR", label: "Moderator" },
];

/** Human label for a role/admin type string, falling back to the raw value. */
export function roleTypeLabel(value: string): string {
  return ASSOCIATION_ADMIN_TYPES.find((r) => r.value === value)?.label ?? value;
}
