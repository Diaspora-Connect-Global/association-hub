import { describe, it, expect } from "vitest";
import { JOIN_POLICY_OPTION, joinPolicyToOption, normalizeJoinPolicy, optionToJoinPolicy } from "./profileJoinPolicy";

describe("Profile join policy", () => {
  it("shows every stored policy as itself, including invite-only (it used to show as Approval)", () => {
    expect(joinPolicyToOption("OPEN")).toBe(JOIN_POLICY_OPTION.OPEN);
    expect(joinPolicyToOption("APPROVAL")).toBe(JOIN_POLICY_OPTION.APPROVAL);
    expect(joinPolicyToOption("INVITE_ONLY")).toBe(JOIN_POLICY_OPTION.INVITE_ONLY);
    expect(joinPolicyToOption("PAID")).toBe(JOIN_POLICY_OPTION.PAID);
  });

  it("reads the legacy REQUEST / APPROVAL_REQUIRED values as approval", () => {
    expect(normalizeJoinPolicy("REQUEST")).toBe("APPROVAL");
    expect(normalizeJoinPolicy("approval_required")).toBe("APPROVAL");
    expect(normalizeJoinPolicy(undefined)).toBe("OPEN");
  });

  it("saves open, approval and invite-only as chosen", () => {
    expect(optionToJoinPolicy(JOIN_POLICY_OPTION.OPEN, "APPROVAL")).toBe("OPEN");
    expect(optionToJoinPolicy(JOIN_POLICY_OPTION.APPROVAL, "OPEN")).toBe("APPROVAL");
    expect(optionToJoinPolicy(JOIN_POLICY_OPTION.INVITE_ONLY, "OPEN")).toBe("INVITE_ONLY");
    expect(optionToJoinPolicy(JOIN_POLICY_OPTION.INVITE_ONLY, "INVITE_ONLY")).toBe("INVITE_ONLY");
  });

  it("never changes a paid association's policy from this form", () => {
    expect(optionToJoinPolicy(JOIN_POLICY_OPTION.OPEN, "PAID")).toBeUndefined();
    expect(optionToJoinPolicy(JOIN_POLICY_OPTION.PAID, "PAID")).toBeUndefined();
  });

  it("leaves the policy unchanged for an unknown option", () => {
    expect(optionToJoinPolicy("something else", "OPEN")).toBeUndefined();
  });
});
