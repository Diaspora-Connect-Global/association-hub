/**
 * The custom-role permission catalogue and the ready-made role templates are
 * NOT defined in the console: they come from the backend (`entityRoleCatalogue`,
 * admin-service's single definition). Labels and descriptions are translated in
 * src/lib/roleTexts.ts.
 */

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
