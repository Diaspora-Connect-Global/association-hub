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
import type {
  ApplicationMethodEnum,
  EngagementTypeEnum,
  OpportunityCategoryEnum,
  OpportunityType as ApiOpportunity,
  OpportunityTypeEnum,
  VisibilityEnum,
  WorkModeEnum,
} from "@/services/graphql/opportunities";

export interface OpportunityFormValues {
  title: string;
  description: string;
  responsibilities: string;
  requirements: string;
  type: OpportunityTypeEnum;
  category: OpportunityCategoryEnum;
  subCategory: string;
  visibility: VisibilityEnum;
  applicationMethod: ApplicationMethodEnum;
  externalLink: string;
  applicationEmail: string;
  workMode: WorkModeEnum | "";
  engagementType: EngagementTypeEnum | "";
  location: string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
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

const workModeOptions: WorkModeEnum[] = ["REMOTE", "HYBRID", "ONSITE"];
const engagementTypeOptions: EngagementTypeEnum[] = ["FULL_TIME", "PART_TIME", "CONTRACT"];

const emptyFormValues: OpportunityFormValues = {
  title: "",
  description: "",
  responsibilities: "",
  requirements: "",
  type: "FELLOWSHIP",
  category: "FELLOWSHIPS_LEADERSHIP",
  subCategory: "",
  visibility: "ASSOCIATION_ONLY",
  applicationMethod: "IN_PLATFORM_FORM",
  externalLink: "",
  applicationEmail: "",
  workMode: "",
  engagementType: "",
  location: "",
  salaryMin: "",
  salaryMax: "",
  salaryCurrency: "",
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
    responsibilities: opportunity.responsibilities ?? "",
    requirements: opportunity.requirements ?? "",
    type: opportunity.type,
    category: opportunity.category,
    subCategory: opportunity.subCategory ?? "",
    visibility: opportunity.visibility,
    applicationMethod: opportunity.applicationMethod,
    externalLink: opportunity.externalLink ?? "",
    applicationEmail: opportunity.applicationEmail ?? "",
    workMode: opportunity.workMode ?? "",
    engagementType: opportunity.engagementType ?? "",
    location: opportunity.location ?? "",
    salaryMin: opportunity.salaryMin?.toString() ?? "",
    salaryMax: opportunity.salaryMax?.toString() ?? "",
    salaryCurrency: opportunity.salaryCurrency ?? "",
    deadline: toInputDate(opportunity.deadline),
    skillsText: opportunity.skills.join(", "),
    tagsText: opportunity.tags.join(", "),
  };
}

export function CreateEditOpportunityModal({
  open,
  onOpenChange,
  opportunity,
  submitting = false,
  onSave,
}: CreateEditOpportunityModalProps) {
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
                <Label htmlFor="responsibilities">Responsibilities</Label>
                <Textarea
                  id="responsibilities"
                  value={form.responsibilities}
                  onChange={(event) => updateField("responsibilities", event.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={form.requirements}
                  onChange={(event) => updateField("requirements", event.target.value)}
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
                  value={form.workMode || "NONE"}
                  onValueChange={(value) => updateField("workMode", value === "NONE" ? "" : (value as WorkModeEnum))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">Not set</SelectItem>
                    {workModeOptions.map((option) => (
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
                  value={form.engagementType || "NONE"}
                  onValueChange={(value) =>
                    updateField("engagementType", value === "NONE" ? "" : (value as EngagementTypeEnum))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">Not set</SelectItem>
                    {engagementTypeOptions.map((option) => (
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
                  type="number"
                  min="0"
                  value={form.salaryMin}
                  onChange={(event) => updateField("salaryMin", event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary-max">Salary max</Label>
                <Input
                  id="salary-max"
                  type="number"
                  min="0"
                  value={form.salaryMax}
                  onChange={(event) => updateField("salaryMax", event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary-currency">Currency</Label>
                <Input
                  id="salary-currency"
                  value={form.salaryCurrency}
                  onChange={(event) => updateField("salaryCurrency", event.target.value.toUpperCase())}
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
