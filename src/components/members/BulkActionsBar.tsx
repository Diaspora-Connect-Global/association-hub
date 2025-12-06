import { X, Megaphone, UserCheck, BadgeCheck, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onSendAnnouncement: () => void;
  onApproveSelected: () => void;
  onChangeRole: () => void;
  onRemoveSelected: () => void;
  hasPendingMembers: boolean;
}

export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onSendAnnouncement,
  onApproveSelected,
  onChangeRole,
  onRemoveSelected,
  hasPendingMembers,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between rounded-lg surface-brand-light border border-border-brand p-3">
      <div className="flex items-center gap-3">
        <button 
          onClick={onClearSelection}
          className="rounded-full p-1 hover:surface-subtle"
        >
          <X className="h-4 w-4 text-text-brand" />
        </button>
        <span className="label-small text-text-brand">
          {selectedCount} member{selectedCount > 1 ? "s" : ""} selected
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onSendAnnouncement} className="gap-1">
          <Megaphone className="h-4 w-4" />
          Send Announcement
        </Button>
        {hasPendingMembers && (
          <Button variant="outline" size="sm" onClick={onApproveSelected} className="gap-1">
            <UserCheck className="h-4 w-4" />
            Approve Selected
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onChangeRole} className="gap-1">
          <BadgeCheck className="h-4 w-4" />
          Change Role
        </Button>
        <Button variant="outline" size="sm" onClick={onRemoveSelected} className="gap-1 text-text-danger hover:text-text-danger">
          <UserMinus className="h-4 w-4" />
          Remove Selected
        </Button>
      </div>
    </div>
  );
}
