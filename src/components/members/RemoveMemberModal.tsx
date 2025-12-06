import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import type { Member } from "./MembersTable";
import { useT } from "@/hooks/useT";

interface RemoveMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
  isPaidAssociation?: boolean;
}

export function RemoveMemberModal({ 
  open, 
  onOpenChange, 
  member,
  isPaidAssociation = false,
}: RemoveMemberModalProps) {
  const t = useT();
  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = async () => {
    if (!member) return;
    
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    toast({
      title: t.memberRemoved,
      description: `${member.name} ${t.memberRemovedDesc}`,
    });
    
    onOpenChange(false);
  };

  const isAdmin = member?.role === "admin";
  const hasActiveSubscription = member?.paymentStatus === "subscription_active";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md surface-default">
        <DialogHeader>
          <DialogTitle className="label-large text-text-primary">{t.removeMember}</DialogTitle>
          <DialogDescription className="body-small text-text-secondary">
            {t.removeConfirm} {member?.name} {t.loseAccessImmediately}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {isAdmin && (
            <Alert className="surface-warning border-border-warning">
              <AlertTriangle className="h-4 w-4 text-text-warning" />
              <AlertDescription className="body-small text-text-warning">
                {t.removingAdminWarning}
              </AlertDescription>
            </Alert>
          )}

          {isPaidAssociation && hasActiveSubscription && (
            <Alert className="surface-info border-border-info">
              <AlertTriangle className="h-4 w-4 text-text-info" />
              <AlertDescription className="body-small text-text-info">
                {t.activeSubscriptionWarning}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.cancel}
          </Button>
          <Button 
            variant="destructive"
            onClick={handleRemove} 
            disabled={isLoading}
          >
            {isLoading ? t.removing : t.removeMember}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
