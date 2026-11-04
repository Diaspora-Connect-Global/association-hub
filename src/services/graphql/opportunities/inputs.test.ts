import { describe, expect, it } from "vitest";
import { buildCreateInput, buildUpdateInput, compensationToMinor } from "./inputs";
import type { OpportunityFormValues } from "@/components/opportunities/CreateEditOpportunityModal";
import { isValidMajorText, minorToMajorText } from "@/lib/minorUnits";

const base: OpportunityFormValues = {
  title: " Fellowship ",
  description: "Desc",
  scope: "Lead things",
  eligibilityCriteria: "Be eligible",
  type: "FELLOWSHIP",
  category: "FELLOWSHIPS_LEADERSHIP",
  subCategory: "",
  visibility: "ASSOCIATION_ONLY",
  applicationMethod: "IN_PLATFORM_FORM",
  externalLink: "",
  applicationEmail: "",
  deliveryMode: "IN_PERSON",
  commitmentType: "PROJECT_BASED",
  location: "Accra",
  compensationMin: "1500.50",
  compensationMax: "2000",
  compensationCurrency: "GHS",
  deadline: "",
  skillsText: "a, b",
  tagsText: "",
};

describe("opportunity input mapping", () => {
  it("create sends current gateway field names and minor units", () => {
    const input = buildCreateInput(base, "assoc-1") as unknown as Record<string, unknown>;
    expect(input).toMatchObject({
      ownerType: "ASSOCIATION",
      ownerId: "assoc-1",
      title: "Fellowship",
      scope: "Lead things",
      eligibilityCriteria: "Be eligible",
      deliveryMode: "IN_PERSON",
      commitmentType: "PROJECT_BASED",
      compensationMin: 150050,
      compensationMax: 200000,
      compensationCurrency: "GHS",
      skills: ["a", "b"],
    });
    for (const old of ["responsibilities", "requirements", "workMode", "engagementType", "salaryMin", "salaryMax", "salaryCurrency"]) {
      expect(old in input).toBe(false);
    }
  });

  it("update maps the same way", () => {
    const input = buildUpdateInput(base) as unknown as Record<string, unknown>;
    expect(input).toMatchObject({ scope: "Lead things", eligibilityCriteria: "Be eligible", deliveryMode: "IN_PERSON", commitmentType: "PROJECT_BASED", compensationMin: 150050, compensationMax: 200000, compensationCurrency: "GHS" });
    for (const old of ["responsibilities", "requirements", "workMode", "engagementType", "salaryMin", "salaryMax", "salaryCurrency"]) {
      expect(old in input).toBe(false);
    }
  });

  it("blank amounts are omitted", () => {
    const input = buildCreateInput({ ...base, compensationMin: "", compensationMax: " " }, "a");
    expect(input.compensationMin).toBeUndefined();
    expect(input.compensationMax).toBeUndefined();
  });

  it("amounts past int32 stay exact (x100 on the text)", () => {
    expect(compensationToMinor("500000000")).toBe(50_000_000_000);
    expect(compensationToMinor("12345678901234.57")).toBe(1234567890123457);
  });

  it("refuses inexact amounts instead of dropping them", () => {
    for (const bad of ["19.999", "-5", "1e5", "abc", "100000000000000"]) {
      expect(isValidMajorText(bad)).toBe(false);
      expect(() => compensationToMinor(bad)).toThrow();
      expect(() => buildCreateInput({ ...base, compensationMax: bad }, "a")).toThrow();
      expect(() => buildUpdateInput({ ...base, compensationMin: bad })).toThrow();
    }
  });

  it("edit prefill divides by 100 once", () => {
    expect(minorToMajorText(150050)).toBe("1500.50");
    expect(minorToMajorText(200000)).toBe("2000");
    expect(minorToMajorText(null)).toBe("");
    expect(compensationToMinor(minorToMajorText(150050))).toBe(150050);
  });
});
