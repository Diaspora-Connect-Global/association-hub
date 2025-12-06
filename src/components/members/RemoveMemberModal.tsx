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
  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = async () => {
    if (!member) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    toast({
      title: "Member removed",
      description: `${member.name} has been removed from the association.`,
    });
    
    onOpenChange(false);
  };

  const isAdmin = member?.role === "admin";
  const hasActiveSubscription = member?.paymentStatus === "subscription_active";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md surface-default">
        <DialogHeader>
          <DialogTitle className="label-large text-text-primary">Remove Member</DialogTitle>
          <DialogDescription className="body-small text-text-secondary">
            Are you sure you want to remove {member?.name} from the association? They will lose access immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {isAdmin && (
            <Alert className="surface-warning border-border-warning">
              <AlertTriangle className="h-4 w-4 text-text-warning" />
              <AlertDescription className="body-small text-text-warning">
                Removing an admin requires confirmation. Make sure there is at least one admin remaining.
              </AlertDescription>
            </Alert>
          )}

          {isPaidAssociation && hasActiveSubscription && (
            <Alert className="surface-info border-border-info">
              <AlertTriangle className="h-4 w-4 text-text-info" />
              <AlertDescription className="body-small text-text-info">
                This member has an active subscription. It will be automatically canceled upon removal.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleRemove} 
            disabled={isLoading}
          >
            {isLoading ? "Removing..." : "Remove Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
