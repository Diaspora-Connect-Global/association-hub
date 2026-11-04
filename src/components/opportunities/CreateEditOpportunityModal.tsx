import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { useT } from "@/hooks/useT";
import { isValidMajorText, minorToMajorText } from "@/lib/minorUnits";
import type {
  ApplicationMethodEnum,
  CommitmentTypeEnum,
  DeliveryModeEnum,
  OpportunityCategoryEnum,
  OpportunityType as ApiOpportunity,
  OpportunityTypeEnum,
  VisibilityEnum,
} from "@/services/graphql/opportunities";

export interface OpportunityFormValues {
  title: string;
  description: string;
  scope: string;
  eligibilityCriteria: string;
  type: OpportunityTypeEnum;
  category: OpportunityCategoryEnum;
  subCategory: string;
  visibility: VisibilityEnum;
  applicationMethod: ApplicationMethodEnum;
  externalLink: string;
  applicationEmail: string;
  deliveryMode: DeliveryModeEnum | "";
  commitmentType: CommitmentTypeEnum | "";
  location: string;
  /** Typed in major units (e.g. 1234.56); sent as integer minor units. */
  compensationMin: string;
  compensationMax: string;
  compensationCurrency: string;
  deadline: string;
  skillsText: string;
  tagsText: string;
}

interface CreateEditOpportunityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity?: ApiOpportunity | null;
  submitting?: boolean;
  onSave: (values: OpportunityFormValues, action: "draft" | "publish") => Promise<void> | void;
}

const opportunityTypeOptions: OpportunityTypeEnum[] = [
  "EMPLOYMENT",
  "SCHOLARSHIP",
  "INVESTMENT",
  "FELLOWSHIP",
  "INITIATIVE",
  "GRANT",
  "PROGRAM",
  "VOLUNTEER",
  "CONTRACT",
];

const opportunityCategoryOptions: OpportunityCategoryEnum[] = [
  "EMPLOYMENT_CAREER",
  "EDUCATION_TRAINING",
  "FUNDING_GRANTS",
  "FELLOWSHIPS_LEADERSHIP",
  "BUSINESS_INVESTMENT",
  "VOLUNTEERING_SOCIAL_IMPACT",
  "EVENT_CREATIVE_INDUSTRY",
  "AGRICULTURE_SUSTAINABILITY",
  "REAL_ESTATE_INFRASTRUCTURE",
  "GOVERNMENT_EMBASSY_INITIATIVES",
  "INNOVATION_RESEARCH",
  "FINANCE_ECONOMICS",
  "RETURN_REINTEGRATION",
];

const deliveryModeOptions: DeliveryModeEnum[] = ["REMOTE", "IN_PERSON", "HYBRID", "ONLINE"];
const commitmentTypeOptions: CommitmentTypeEnum[] = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "ONE_TIME",
  "FLEXIBLE",
  "PROJECT_BASED",
  "ONGOING",
];

const emptyFormValues: OpportunityFormValues = {
  title: "",
  description: "",
  scope: "",
  eligibilityCriteria: "",
  type: "FELLOWSHIP",
  category: "FELLOWSHIPS_LEADERSHIP",
  subCategory: "",
  visibility: "ASSOCIATION_ONLY",
  applicationMethod: "IN_PLATFORM_FORM",
  externalLink: "",
  applicationEmail: "",
  deliveryMode: "",
  commitmentType: "",
  location: "",
  compensationMin: "",
  compensationMax: "",
  compensationCurrency: "",
  deadline: "",
  skillsText: "",
  tagsText: "",
};

function formatEnumLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toInputDate(value: string | null | undefined): string {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
}

function mapOpportunityToForm(opportunity: ApiOpportunity): OpportunityFormValues {
  return {
    title: opportunity.title,
    description: opportunity.description,
    scope: opportunity.scope ?? "",
    eligibilityCriteria: opportunity.eligibilityCriteria ?? "",
    type: opportunity.type,
    category: opportunity.category,
    subCategory: opportunity.subCategory ?? "",
    visibility: opportunity.visibility,
    applicationMethod: opportunity.applicationMethod,
    externalLink: opportunity.externalLink ?? "",
    applicationEmail: opportunity.applicationEmail ?? "",
    deliveryMode: opportunity.deliveryMode ?? "",
    commitmentType: opportunity.commitmentType ?? "",
    location: opportunity.location ?? "",
    // minor units on the wire -> major units for the form (divide once, on display)
    compensationMin: minorToMajorText(opportunity.compensationMin),
    compensationMax: minorToMajorText(opportunity.compensationMax),
    compensationCurrency: opportunity.compensationCurrency ?? "",
    deadline: toInputDate(opportunity.deadline),
    skillsText: (opportunity.skills ?? []).join(", "),
    tagsText: (opportunity.tags ?? []).join(", "),
  };
}

export function CreateEditOpportunityModal({
  open,
  onOpenChange,
  opportunity,
  submitting = false,
  onSave,
}: CreateEditOpportunityModalProps) {
  const t = useT();
  const isEdit = Boolean(opportunity);
  const [form, setForm] = useState<OpportunityFormValues>(emptyFormValues);

  useEffect(() => {
    if (!open) return;
    setForm(opportunity ? mapOpportunityToForm(opportunity) : emptyFormValues);
  }, [open, opportunity]);

  const updateField = <K extends keyof OpportunityFormValues>(
    key: K,
    value: OpportunityFormValues[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const validateForm = (): boolean => {
    if (!form.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return false;
    }

    if (!form.description.trim()) {
      toast({ title: "Description is required", variant: "destructive" });
      return false;
    }

    if (form.applicationMethod === "EXTERNAL_LINK" && !form.externalLink.trim()) {
      toast({ title: "External link is required", variant: "destructive" });
      return false;
    }

    if (form.applicationMethod === "EMAIL_REQUEST" && !form.applicationEmail.trim()) {
      toast({ title: "Application email is required", variant: "destructive" });
      return false;
    }

    if (!isValidMajorText(form.compensationMin) || !isValidMajorText(form.compensationMax)) {
      toast({ title: t.opportunityAmountInvalid, variant: "destructive" });
      return false;
    }

    return true;
  };

  const handleSave = async (action: "draft" | "publish") => {
    if (!validateForm()) return;
    await onSave(form, action);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>{isEdit ? "Edit Opportunity" : "Create Opportunity"}</DialogTitle>
          <DialogDescription>
            Association ownership is inferred from the authenticated admin token.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] px-6 pb-6">
          <div className="space-y-6 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="opportunity-title">Title</Label>
                <Input
                  id="opportunity-title"
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="2026 Diaspora Fellowship"
                />
              </div>

              <div className="space-y-2">
                <Label>Opportunity Type</Label>
                <Select value={form.type} onValueChange={(value) => updateField("type", value as OpportunityTypeEnum)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {opportunityTypeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {formatEnumLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) => updateField("category", value as OpportunityCategoryEnum)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {opportunityCategoryOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {formatEnumLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sub-category">Sub-category</Label>
                <Input
                  id="sub-category"
                  value={form.subCategory}
                  onChange={(event) => updateField("subCategory", event.target.value)}
                  placeholder="Leadership"
                />
              </div>

              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select
                  value={form.visibility}
                  onValueChange={(value) => updateField("visibility", value as VisibilityEnum)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLIC">Public</SelectItem>
                    <SelectItem value="ASSOCIATION_ONLY">Association Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  rows={6}
                  placeholder="Provide the full opportunity description."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope">Responsibilities</Label>
                <Textarea
                  id="scope"
                  value={form.scope}
                  onChange={(event) => updateField("scope", event.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eligibilityCriteria">Requirements</Label>
                <Textarea
                  id="eligibilityCriteria"
                  value={form.eligibilityCriteria}
                  onChange={(event) => updateField("eligibilityCriteria", event.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Application Method</Label>
                <Select
                  value={form.applicationMethod}
                  onValueChange={(value) => updateField("applicationMethod", value as ApplicationMethodEnum)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN_PLATFORM_FORM">In-platform form</SelectItem>
                    <SelectItem value="EXTERNAL_LINK">External link</SelectItem>
                    <SelectItem value="EMAIL_REQUEST">Email request</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={(event) => updateField("deadline", event.target.value)}
                />
              </div>

              {form.applicationMethod === "EXTERNAL_LINK" && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="external-link">External link</Label>
                  <Input
                    id="external-link"
                    value={form.externalLink}
                    onChange={(event) => updateField("externalLink", event.target.value)}
                    placeholder="https://apply.association.org"
                  />
                </div>
              )}

              {form.applicationMethod === "EMAIL_REQUEST" && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="application-email">Application email</Label>
                  <Input
                    id="application-email"
                    type="email"
                    value={form.applicationEmail}
                    onChange={(event) => updateField("applicationEmail", event.target.value)}
                    placeholder="apply@association.org"
                  />
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Work Mode</Label>
                <Select
                  value={form.deliveryMode || "NONE"}
                  onValueChange={(value) => updateField("deliveryMode", value === "NONE" ? "" : (value as DeliveryModeEnum))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">Not set</SelectItem>
                    {deliveryModeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {formatEnumLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Engagement Type</Label>
                <Select
                  value={form.commitmentType || "NONE"}
                  onValueChange={(value) =>
                    updateField("commitmentType", value === "NONE" ? "" : (value as CommitmentTypeEnum))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">Not set</SelectItem>
                    {commitmentTypeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {formatEnumLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(event) => updateField("location", event.target.value)}
                  placeholder="London, UK"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary-min">Salary min</Label>
                <Input
                  id="salary-min"
                  type="text"
                  inputMode="decimal"
                  value={form.compensationMin}
                  onChange={(event) => updateField("compensationMin", event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary-max">Salary max</Label>
                <Input
                  id="salary-max"
                  type="text"
                  inputMode="decimal"
                  value={form.compensationMax}
                  onChange={(event) => updateField("compensationMax", event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary-currency">Currency</Label>
                <Input
                  id="salary-currency"
                  value={form.compensationCurrency}
                  onChange={(event) => updateField("compensationCurrency", event.target.value.toUpperCase())}
                  placeholder="GBP"
                  maxLength={3}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <Input
                  id="skills"
                  value={form.skillsText}
                  onChange={(event) => updateField("skillsText", event.target.value)}
                  placeholder="Leadership, Policy"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={form.tagsText}
                  onChange={(event) => updateField("tagsText", event.target.value)}
                  placeholder="fellowship, diaspora"
                />
              </div>
            </div>

            {opportunity && opportunity.status !== "DRAFT" && (
              <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                Saving changes for non-draft opportunities follows the required lifecycle: close, update, then optionally re-publish.
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="border-t px-6 py-4">
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={() => void handleSave("draft")} disabled={submitting}>
              {submitting ? "Saving..." : isEdit ? "Save Changes" : "Save Draft"}
            </Button>
            <Button onClick={() => void handleSave("publish")} disabled={submitting}>
              {submitting ? "Submitting..." : isEdit ? "Save & Publish" : "Create & Publish"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
