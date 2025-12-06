import { Listing } from "@/types/marketplace";
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
import { AlertTriangle } from "lucide-react";
import { useT } from "@/hooks/useT";

interface DeleteListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: Listing | null;
  onConfirm: () => void;
}

export function DeleteListingModal({
  open,
  onOpenChange,
  listing,
  onConfirm,
}: DeleteListingModalProps) {
  const t = useT();
  
  if (!listing) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle>{t.deleteListingTitle}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            {t.deleteListingConfirm} <strong>"{listing.title}"</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-4 space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
            {t.ordersWillRemain}
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}