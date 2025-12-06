import { Group } from "@/types/groups";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Edit, 
  Trash2, 
  Users,
  Lock,
  Globe,
  Bell,
  BellOff,
  AtSign,
  Calendar,
  Shield
} from "lucide-react";

interface GroupDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: Group | null;
  onEdit: (group: Group) => void;
  onDelete: (group: Group) => void;
  onManageMembers: (group: Group) => void;
}

export function GroupDetailsModal({
  open,
  onOpenChange,
  group,
  onEdit,
  onDelete,
  onManageMembers,
}: GroupDetailsModalProps) {
  if (!group) return null;

  const notificationIcons = {
    all: <Bell className="h-4 w-4" />,
    mentions: <AtSign className="h-4 w-4" />,
    muted: <BellOff className="h-4 w-4" />,
  };

  const notificationLabels = {
    all: "All Messages",
    mentions: "Mentions Only",
    muted: "Muted",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Group Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar & Name */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
              {group.avatar ? (
                <img src={group.avatar} alt={group.name} className="h-full w-full object-cover rounded-xl" />
              ) : (
                <span className="text-3xl">{group.avatarEmoji || "👥"}</span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{group.name}</h3>
              <Badge 
                variant={group.privacy === "private" ? "secondary" : "outline"}
                className="gap-1 mt-1"
              >
                {group.privacy === "private" ? (
                  <Lock className="h-3 w-3" />
                ) : (
                  <Globe className="h-3 w-3" />
                )}
                {group.privacy}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Details */}
          <div className="space-y-3">
            {group.description && (
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Description</p>
                <p className="text-sm text-muted-foreground">{group.description}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Members</span>
              </div>
              <span className="font-medium text-foreground">{group.memberCount}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {notificationIcons[group.defaultNotifications]}
                <span>Notifications</span>
              </div>
              <span className="font-medium text-foreground">
                {notificationLabels[group.defaultNotifications]}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Created</span>
              </div>
              <span className="font-medium text-foreground">{group.createdAt}</span>
            </div>
          </div>

          <Separator />

          {/* Security Notice */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">End-to-End Encrypted</p>
              <p className="text-xs text-muted-foreground">
                Messages in this group are encrypted and cannot be viewed by admins.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(group)}>
              <Edit className="h-4 w-4 mr-1.5" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => onManageMembers(group)}>
              <Users className="h-4 w-4 mr-1.5" />
              Manage Members
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDelete(group)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
