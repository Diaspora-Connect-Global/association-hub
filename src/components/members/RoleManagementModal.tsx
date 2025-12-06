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
import { useT } from "@/hooks/useT";

interface RoleManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
}

export function RoleManagementModal({ open, onOpenChange, member }: RoleManagementModalProps) {
  const t = useT();
  const [selectedRole, setSelectedRole] = useState<string>(member?.role || "member");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateRole = async () => {
    if (!member) return;
    
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    toast({
      title: t.roleUpdated,
      description: `${member.name}${t.roleChangedTo} ${selectedRole}.`,
    });
    
    onOpenChange(false);
  };

  const showAdminWarning = selectedRole === "admin" && member?.role !== "admin";
  const showDemoteWarning = selectedRole === "member" && member?.role === "admin";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md surface-default">
        <DialogHeader>
          <DialogTitle className="label-large text-text-primary">{t.changeRole}</DialogTitle>
          <DialogDescription className="body-small text-text-secondary">
            {t.updateRole} {member?.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="label-small text-text-primary">{t.selectRole}</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="surface-default">
                <SelectItem value="member">{t.member}</SelectItem>
                <SelectItem value="sub-admin">{t.subAdmin}</SelectItem>
                <SelectItem value="admin">{t.admin}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showAdminWarning && (
            <Alert className="surface-warning border-border-warning">
              <AlertTriangle className="h-4 w-4 text-text-warning" />
              <AlertDescription className="body-small text-text-warning">
                {t.promotingToAdmin}
              </AlertDescription>
            </Alert>
          )}

          {showDemoteWarning && (
            <Alert className="surface-warning border-border-warning">
              <AlertTriangle className="h-4 w-4 text-text-warning" />
              <AlertDescription className="body-small text-text-warning">
                {t.demotingAdmin}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.cancel}
          </Button>
          <Button 
            onClick={handleUpdateRole} 
            disabled={isLoading || selectedRole === member?.role}
          >
            {isLoading ? t.updating : t.updateRole}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
