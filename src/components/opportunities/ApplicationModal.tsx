import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  XCircle,
  CheckCircle,
  Download,
  FileText,
  User,
  Clock,
  Search,
} from "lucide-react";
import type { ApplicationDetailType, ApplicationStatusEnum } from "@/services/graphql/opportunities";
import { useState } from "react";

interface ApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: ApplicationDetailType | null;
  onReview: (notes: string) => void;
  onAccept: (notes: string) => void;
  onReject: () => void;
}

const statusColors: Record<ApplicationStatusEnum, string> = {
  PENDING: "secondary",
  REVIEWING: "default",
  ACCEPTED: "default",
  REJECTED: "destructive",
  WITHDRAWN: "secondary",
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

export function ApplicationModal({
  open,
  onOpenChange,
  application,
  onReview,
  onAccept,
  onReject,
}: ApplicationModalProps) {
  const [notes, setNotes] = useState("");

  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{application.applicantId}</DialogTitle>
              <Badge variant={statusColors[application.status] as any} className="mt-2 capitalize">
                {formatEnumLabel(application.status)}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)] px-6">
          <div className="space-y-4 pb-4">
            <h4 className="font-medium">Application Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{application.applicantId}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span>{application.opportunity?.title ?? application.opportunityId}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Applied: {formatDate(application.createdAt)}</span>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4 pb-4">
            <h4 className="font-medium">Submitted Responses</h4>
            {application.coverLetter && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Cover Letter</p>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm whitespace-pre-wrap">{application.coverLetter}</p>
                </div>
              </div>
            )}
            {application.customAnswers ? (
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm whitespace-pre-wrap">{application.customAnswers}</p>
              </div>
            ) : !application.coverLetter ? (
              <p className="text-sm text-muted-foreground">No submitted answers available.</p>
            ) : null}
          </div>

          <Separator className="my-4" />

          <div className="space-y-4 pb-4">
            <h4 className="font-medium">Attachments</h4>
            {application.resumeFileRef ? (
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{application.resumeFileRef.filename}</p>
                    <p className="text-xs text-muted-foreground">{application.resumeFileRef.mimeType}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <a href={application.resumeFileRef.path} target="_blank" rel="noreferrer">
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No attachments</p>
            )}
          </div>

          <Separator className="my-4" />

          <div className="space-y-4 pb-6">
            <h4 className="font-medium">Review Notes</h4>

            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm">Application submitted</p>
                  <p className="text-xs text-muted-foreground">{formatDate(application.createdAt)}</p>
                </div>
              </div>
            </div>

            {application.reviewNotes && (
              <div className="rounded-lg border border-border p-3 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Latest note</p>
                <p className="mt-1 whitespace-pre-wrap">{application.reviewNotes}</p>
                <p className="mt-2 text-xs">
                  Reviewed by {application.reviewedBy ?? "unknown"} on {formatDate(application.reviewedAt)}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Textarea
                placeholder="Add review notes for the next status action..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </ScrollArea>

        <Separator />

        <DialogFooter className="px-6 py-4">
          <div className="flex w-full justify-between">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={() => onReview(notes)}>
                <User className="h-4 w-4" />
                Move to reviewing
              </Button>
              <Button variant="outline" className="gap-2" onClick={onReject}>
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button className="gap-2" onClick={() => onAccept(notes)}>
                <CheckCircle className="h-4 w-4" />
                Accept
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
