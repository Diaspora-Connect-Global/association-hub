import { useState } from "react";
import { AuditLog } from "@/types/auditLogs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Clock, 
  User, 
  Globe, 
  Monitor,
  FileText,
  Save,
  Loader2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AuditLogDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: AuditLog | null;
}

const actionTypeColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  create: "default",
  update: "secondary",
  delete: "destructive",
  login: "outline",
  logout: "outline",
  upload: "default",
  download: "secondary",
  comment: "outline",
  approve: "default",
  reject: "destructive",
};

export function AuditLogDetailsModal({
  open,
  onOpenChange,
  log,
}: AuditLogDetailsModalProps) {
  const [notes, setNotes] = useState(log?.notes || "");
  const [isSaving, setIsSaving] = useState(false);

  if (!log) return null;

  const handleSaveNotes = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Notes Saved",
        description: "Internal notes have been saved for this log entry.",
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Audit Log Details
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 pb-4">
            {/* Basic Information */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Timestamp</p>
                    <p className="text-sm font-medium">{log.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">User</p>
                    <p className="text-sm font-medium">{log.userName}</p>
                    <Badge variant="outline" className="text-[10px] mt-1 capitalize">
                      {log.userRole.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">IP Address</p>
                    <p className="text-sm font-medium font-mono">{log.ipAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Monitor className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Device / Browser</p>
                    <p className="text-sm font-medium">{log.device}</p>
                    <p className="text-xs text-muted-foreground">{log.browser}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Action Details */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Action Details</h4>
              <div className="space-y-4 p-4 rounded-lg border border-border bg-muted/30">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Action Type</p>
                    <Badge variant={actionTypeColors[log.actionType]} className="capitalize">
                      {log.actionType}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Module / Screen</p>
                    <p className="text-sm font-medium capitalize">{log.module.replace("_", " ")}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Object Affected</p>
                  <p className="text-sm font-medium">{log.objectAffected}</p>
                  {log.objectId && (
                    <p className="text-xs text-muted-foreground font-mono">ID: {log.objectId}</p>
                  )}
                </div>
                {log.changesMade && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Changes Made</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{log.changesMade}</p>
                  </div>
                )}
                {(log.previousValue || log.newValue) && (
                  <div className="grid grid-cols-2 gap-4">
                    {log.previousValue && (
                      <div className="p-2 rounded bg-destructive/10 border border-destructive/20">
                        <p className="text-xs text-muted-foreground mb-1">Previous Value</p>
                        <p className="text-sm font-mono text-destructive">{log.previousValue}</p>
                      </div>
                    )}
                    {log.newValue && (
                      <div className="p-2 rounded bg-green-500/10 border border-green-500/20">
                        <p className="text-xs text-muted-foreground mb-1">New Value</p>
                        <p className="text-sm font-mono text-green-600">{log.newValue}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Notes */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Internal Notes</h4>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-xs text-muted-foreground">
                  Add notes or comments for internal reference
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Optional notes or comments by admin reviewing this log"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleSaveNotes} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-1.5" />
            )}
            Save Notes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}