import { Group } from "@/types/groups";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Lock } from "lucide-react";

interface DeleteGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: Group | null;
  onConfirm: () => void;
}

export function DeleteGroupModal({
  open,
  onOpenChange,
  group,
  onConfirm,
}: DeleteGroupModalProps) {
  if (!group) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            Are you sure you want to delete <strong>"{group.name}"</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-4 space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            All chat messages are end-to-end encrypted and will be lost.
          </p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
            Members will be notified that the group was deleted.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
