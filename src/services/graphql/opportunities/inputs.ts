import { majorTextToMinor } from "@/lib/minorUnits";
import type { CreateOpportunityInput, UpdateOpportunityInput } from "./types";
import type { OpportunityFormValues } from "@/components/opportunities/CreateEditOpportunityModal";

export function parseCsvList(value: string): string[] | undefined {
  const items = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : undefined;
}

/**
 * Form text in major units -> integer minor units (x100), done on the text.
 * Blank means "no amount". Text that cannot be converted exactly throws: callers
 * validate first (isValidMajorText) and show a message, so nothing is dropped silently.
 */
export function compensationToMinor(text: string): number | undefined {
  if (!text.trim()) return undefined;
  const minor = majorTextToMinor(text);
  if (minor === undefined) throw new Error("Invalid compensation amount");
  return minor;
}

export function buildCreateInput(values: OpportunityFormValues, associationId: string): CreateOpportunityInput {
  return {
    ownerType: "ASSOCIATION",
    ownerId: associationId,
    type: values.type,
    category: values.category,
    title: values.title.trim(),
    description: values.description.trim(),
    visibility: values.visibility,
    applicationMethod: values.applicationMethod,
    scope: values.scope.trim() || undefined,
    eligibilityCriteria: values.eligibilityCriteria.trim() || undefined,
    deliveryMode: values.deliveryMode || undefined,
    commitmentType: values.commitmentType || undefined,
    location: values.location.trim() || undefined,
    externalLink: values.applicationMethod === "EXTERNAL_LINK" ? values.externalLink.trim() : undefined,
    applicationEmail: values.applicationMethod === "EMAIL_REQUEST" ? values.applicationEmail.trim() : undefined,
    compensationMin: compensationToMinor(values.compensationMin),
    compensationMax: compensationToMinor(values.compensationMax),
    compensationCurrency: values.compensationCurrency.trim() || undefined,
    deadline: values.deadline || undefined,
    subCategory: values.subCategory.trim() || undefined,
    skills: parseCsvList(values.skillsText),
    tags: parseCsvList(values.tagsText),
  };
}

export function buildUpdateInput(values: OpportunityFormValues): UpdateOpportunityInput {
  const input: UpdateOpportunityInput = {};

  if (values.title.trim()) input.title = values.title.trim();
  if (values.description.trim()) input.description = values.description.trim();
  if (values.scope.trim()) input.scope = values.scope.trim();
  if (values.eligibilityCriteria.trim()) input.eligibilityCriteria = values.eligibilityCriteria.trim();
  if (values.deliveryMode) input.deliveryMode = values.deliveryMode;
  if (values.commitmentType) input.commitmentType = values.commitmentType;
  if (values.location.trim()) input.location = values.location.trim();
  const min = compensationToMinor(values.compensationMin);
  if (min !== undefined) input.compensationMin = min;
  const max = compensationToMinor(values.compensationMax);
  if (max !== undefined) input.compensationMax = max;
  if (values.compensationCurrency.trim()) input.compensationCurrency = values.compensationCurrency.trim();
  if (values.deadline) input.deadline = values.deadline;
  if (values.subCategory.trim()) input.subCategory = values.subCategory.trim();

  const skills = parseCsvList(values.skillsText);
  if (skills) input.skills = skills;

  const tags = parseCsvList(values.tagsText);
  if (tags) input.tags = tags;

  if (values.applicationMethod) {
    input.applicationMethod = values.applicationMethod;
    if (values.applicationMethod === "EXTERNAL_LINK") {
      input.externalLink = values.externalLink.trim();
    }
    if (values.applicationMethod === "EMAIL_REQUEST") {
      input.applicationEmail = values.applicationEmail.trim();
    }
  }

  return input;
}
