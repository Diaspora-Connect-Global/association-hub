import { useState } from "react";
import { Ticket } from "@/types/tickets";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useT } from "@/hooks/useT";

interface CloseTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket | null;
}

export function CloseTicketModal({
  open,
  onOpenChange,
  ticket,
}: CloseTicketModalProps) {
  const t = useT();
  const [isClosing, setIsClosing] = useState(false);

  if (!ticket) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onOpenChange(false);
      toast({
        title: t.ticketClosed,
        description: t.ticketClosedDesc,
      });
    }, 1000);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {t.closeTicketTitle} #{ticket.id}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t.closeTicketConfirm}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
          <Button variant="destructive" onClick={handleClose} disabled={isClosing}>
            {isClosing && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
            {t.closeTicket}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}