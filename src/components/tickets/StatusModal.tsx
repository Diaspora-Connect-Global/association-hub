import { useState } from "react";
import { Ticket, TicketStatus } from "@/types/tickets";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useT } from "@/hooks/useT";

interface StatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket | null;
}

export function StatusModal({
  open,
  onOpenChange,
  ticket,
}: StatusModalProps) {
  const t = useT();
  const [status, setStatus] = useState<TicketStatus | "">(ticket?.status || "");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!ticket) return null;

  const statusOptions: { value: TicketStatus; label: string }[] = [
    { value: "open", label: t.open },
    { value: "in_progress", label: t.inProgress },
    { value: "resolved", label: t.resolved },
    { value: "closed", label: t.closed },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!status) {
      toast({
        title: t.error,
        description: t.fillRequiredFields,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onOpenChange(false);
      setStatus("");
      setNote("");
      toast({
        title: t.statusUpdated,
        description: `${t.statusUpdatedTo} ${status.replace("_", " ")}.`,
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t.updateStatusTitle} - {t.ticketId} #{ticket.id}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t.status} *</Label>
            <Select value={status} onValueChange={(v: TicketStatus) => setStatus(v)}>
              <SelectTrigger>
                <SelectValue placeholder={t.selectStatus} />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t.noteOptional}</Label>
            <Textarea
              placeholder={t.noteToAdmin}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
              {t.update} {t.status}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}