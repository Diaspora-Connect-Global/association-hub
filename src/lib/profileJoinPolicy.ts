import type { JoinPolicy } from "@/services/graphql/association/types";

/**
 * Join-policy values of the Profile form's select. The form stores these
 * strings; the backend speaks `JoinPolicy`.
 */
export const JOIN_POLICY_OPTION = {
  OPEN: "Open (Anyone Can Join)",
  APPROVAL: "Approval Required",
  INVITE_ONLY: "Invite Only",
  PAID: "Paid",
} as const;

export type JoinPolicyOption = (typeof JOIN_POLICY_OPTION)[keyof typeof JOIN_POLICY_OPTION];

/** Older data / other consoles may still send REQUEST or APPROVAL_REQUIRED. */
export function normalizeJoinPolicy(value?: string | null): JoinPolicy {
  const v = (value ?? "OPEN").toUpperCase();
  if (v === "APPROVAL" || v === "INVITE_ONLY" || v === "OPEN" || v === "PAID") return v as JoinPolicy;
  if (v === "REQUEST" || v === "APPROVAL_REQUIRED") return "APPROVAL";
  return "OPEN";
}

/** The select value showing an association's stored policy. */
export function joinPolicyToOption(value?: string | null): JoinPolicyOption {
  return JOIN_POLICY_OPTION[normalizeJoinPolicy(value)];
}

/**
 * The policy to save, or `undefined` to leave it unchanged. A paid association
 * keeps PAID: its price lives on the Payment tab, and choosing a free policy
 * here would silently drop the paid status.
 */
export function optionToJoinPolicy(option: string, loaded: JoinPolicy | null): JoinPolicy | undefined {
  if (loaded === "PAID" || option === JOIN_POLICY_OPTION.PAID) return undefined;
  if (option === JOIN_POLICY_OPTION.OPEN) return "OPEN";
  if (option === JOIN_POLICY_OPTION.INVITE_ONLY) return "INVITE_ONLY";
  if (option === JOIN_POLICY_OPTION.APPROVAL) return "APPROVAL";
  return undefined;
}
