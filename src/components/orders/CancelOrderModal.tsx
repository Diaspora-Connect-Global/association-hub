import { Order } from "@/types/marketplace";
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

interface CancelOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onConfirm: () => void;
}

export function CancelOrderModal({
  open,
  onOpenChange,
  order,
  onConfirm,
}: CancelOrderModalProps) {
  const t = useT();
  
  if (!order) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle>{t.cancelOrderTitle}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            {t.cancelOrderConfirm} <strong>{order.id}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-4 space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
            {t.refundsSeparate}
          </p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
            {t.customerNotified}
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>{t.close}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t.cancelOrder}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}