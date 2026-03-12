import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit,
  ToggleRight,
  XCircle,
  Link2,
  Users,
  Globe,
  Lock,
  MapPin,
  Calendar,
  Clock,
  Flag,
  Mail,
} from "lucide-react";
import type { OpportunityType, PriorityLevelEnum } from "@/services/graphql/opportunities";
import { toast } from "@/hooks/use-toast";

interface OpportunityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity: OpportunityType | null;
  onEdit: () => void;
  onTogglePublish: () => void;
  onClose: () => void;
  onViewApplicants: () => void;
  onSetPriority: (priority: PriorityLevelEnum) => void;
}

const statusMap = {
  PUBLISHED: "active" as const,
  DRAFT: "inactive" as const,
  CLOSED: "inactive" as const,
  ARCHIVED: "inactive" as const,
};

function formatEnumLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

export function OpportunityModal({
  open,
  onOpenChange,
  opportunity,
  onEdit,
  onTogglePublish,
  onClose,
  onViewApplicants,
  onSetPriority,
}: OpportunityModalProps) {
  if (!opportunity) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://app.example.com/opportunities/${opportunity.id}`);
    toast({ title: "Link copied to clipboard" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl line-clamp-2">{opportunity.title}</DialogTitle>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  {formatEnumLabel(opportunity.type)}
                </Badge>
                <StatusBadge variant={statusMap[opportunity.status]}>
                  {formatEnumLabel(opportunity.status)}
                </StatusBadge>
                <Badge variant="outline" className="gap-1">
                  {opportunity.visibility === "PUBLIC" ? (
                    <Globe className="h-3 w-3" />
                  ) : (
                    <Lock className="h-3 w-3" />
                  )}
                  {formatEnumLabel(opportunity.visibility)}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Flag className="h-3 w-3" />
                  {formatEnumLabel(opportunity.priorityLevel)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {opportunity.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {opportunity.location}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {opportunity.applicationCount} applications
            </div>
            {opportunity.deadline && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Deadline: {formatDate(opportunity.deadline)}
              </div>
            )}
          </div>

          <div className="mt-4 w-48">
            <Label className="mb-2 block text-sm">Priority</Label>
            <Select value={opportunity.priorityLevel} onValueChange={(value) => onSetPriority(value as PriorityLevelEnum)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="NORMAL">Normal</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={onEdit}>
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={onTogglePublish}>
              {opportunity.status === "PUBLISHED" ? (
                <>
                  <XCircle className="h-4 w-4" />
                  Close
                </>
              ) : (
                <>
                  <ToggleRight className="h-4 w-4" />
                  Publish
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={onClose}>
              <XCircle className="h-4 w-4" />
              Close
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={onViewApplicants}>
              <Users className="h-4 w-4" />
              Applicants
            </Button>
          </div>
        </DialogHeader>

        <Separator />

        <ScrollArea className="flex-1 px-6 pb-6">
          <div className="mt-4 space-y-6">
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <div className="mt-3 rounded-lg bg-muted/50 p-4">
                <p className="text-sm whitespace-pre-wrap">{opportunity.description}</p>
              </div>
            </div>

            {(opportunity.responsibilities || opportunity.requirements) && (
              <div className="grid gap-4 md:grid-cols-2">
                {opportunity.responsibilities && (
                  <div>
                    <h4 className="font-medium mb-2">Responsibilities</h4>
                    <div className="rounded-lg border border-border p-4 text-sm whitespace-pre-wrap">
                      {opportunity.responsibilities}
                    </div>
                  </div>
                )}
                {opportunity.requirements && (
                  <div>
                    <h4 className="font-medium mb-2">Requirements</h4>
                    <div className="rounded-lg border border-border p-4 text-sm whitespace-pre-wrap">
                      {opportunity.requirements}
                    </div>
                  </div>
                )}
              </div>
            )}

            {(opportunity.tags.length > 0 || opportunity.skills.length > 0) && (
              <div>
                <h4 className="font-medium mb-2">Tags & Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {[...opportunity.tags, ...opportunity.skills].map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-2">Application Settings</h4>
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm">Application Method</span>
                  <Badge variant="outline">{formatEnumLabel(opportunity.applicationMethod)}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Visibility</span>
                  <span className="text-sm text-muted-foreground">{formatEnumLabel(opportunity.visibility)}</span>
                </div>
                {opportunity.externalLink && (
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2"><Link2 className="h-4 w-4" />External Link</span>
                    <a className="text-sm text-primary hover:underline" href={opportunity.externalLink} target="_blank" rel="noreferrer">
                      Open link
                    </a>
                  </div>
                )}
                {opportunity.applicationEmail && (
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2"><Mail className="h-4 w-4" />Application Email</span>
                    <span className="text-sm text-muted-foreground">{opportunity.applicationEmail}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Metadata</h4>
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm">Category</span>
                  <Badge variant="outline">{formatEnumLabel(opportunity.category)}</Badge>
                </div>
                {opportunity.subCategory && (
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm">Sub-category</span>
                    <span className="text-sm text-muted-foreground">{opportunity.subCategory}</span>
                  </div>
                )}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm">Work Mode</span>
                  <span className="text-sm text-muted-foreground">
                    {opportunity.workMode ? formatEnumLabel(opportunity.workMode) : "Not set"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Engagement Type</span>
                  <span className="text-sm text-muted-foreground">
                    {opportunity.engagementType ? formatEnumLabel(opportunity.engagementType) : "Not set"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2" onClick={handleCopyLink}>
                  <Link2 className="h-4 w-4" />
                  Share Link
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Timeline</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-xs text-muted-foreground">{formatDate(opportunity.createdAt)}</p>
                  </div>
                </div>
                {opportunity.publishedAt && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <ToggleRight className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Published</p>
                      <p className="text-xs text-muted-foreground">{formatDate(opportunity.publishedAt)}</p>
                    </div>
                  </div>
                )}
                {opportunity.closedAt && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <XCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Closed</p>
                      <p className="text-xs text-muted-foreground">{formatDate(opportunity.closedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}