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
  const [isClosing, setIsClosing] = useState(false);

  if (!ticket) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onOpenChange(false);
      toast({
        title: "Ticket Closed",
        description: "The ticket has been closed and user has been notified.",
      });
    }, 1000);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Close Ticket #{ticket.id}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to close this ticket? User will be notified.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleClose} disabled={isClosing}>
            {isClosing && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
            Close Ticket
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}