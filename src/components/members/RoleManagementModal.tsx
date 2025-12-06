import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import type { Member } from "./MembersTable";

interface RoleManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
}

export function RoleManagementModal({ open, onOpenChange, member }: RoleManagementModalProps) {
  const [selectedRole, setSelectedRole] = useState<string>(member?.role || "member");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateRole = async () => {
    if (!member) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    toast({
      title: "Role updated",
      description: `${member.name}'s role has been changed to ${selectedRole}.`,
    });
    
    onOpenChange(false);
  };

  const showAdminWarning = selectedRole === "admin" && member?.role !== "admin";
  const showDemoteWarning = selectedRole === "member" && member?.role === "admin";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md surface-default">
        <DialogHeader>
          <DialogTitle className="label-large text-text-primary">Change Role</DialogTitle>
          <DialogDescription className="body-small text-text-secondary">
            Update the role for {member?.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="label-small text-text-primary">Select Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="surface-default">
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="sub-admin">Sub-admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showAdminWarning && (
            <Alert className="surface-warning border-border-warning">
              <AlertTriangle className="h-4 w-4 text-text-warning" />
              <AlertDescription className="body-small text-text-warning">
                Promoting a member to Admin gives them full control over the association.
              </AlertDescription>
            </Alert>
          )}

          {showDemoteWarning && (
            <Alert className="surface-warning border-border-warning">
              <AlertTriangle className="h-4 w-4 text-text-warning" />
              <AlertDescription className="body-small text-text-warning">
                Demoting an Admin may lock you out if no admins remain.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateRole} 
            disabled={isLoading || selectedRole === member?.role}
          >
            {isLoading ? "Updating..." : "Update Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
