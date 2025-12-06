import { Group } from "@/types/groups";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Users,
  Lock,
  Globe
} from "lucide-react";

interface GroupCardProps {
  group: Group;
  onViewDetails: (group: Group) => void;
  onEdit: (group: Group) => void;
  onDelete: (group: Group) => void;
  onManageMembers: (group: Group) => void;
}

export function GroupCard({
  group,
  onViewDetails,
  onEdit,
  onDelete,
  onManageMembers,
}: GroupCardProps) {
  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Header */}
      <div className="relative flex h-24 items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
        {group.avatar ? (
          <img src={group.avatar} alt={group.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-5xl">{group.avatarEmoji || "👥"}</span>
        )}
        <div className="absolute right-3 top-3">
          <Badge 
            variant={group.privacy === "private" ? "secondary" : "outline"}
            className="gap-1"
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

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-1 font-semibold text-foreground line-clamp-1">
          {group.name}
        </h3>
        {group.description && (
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
            {group.description}
          </p>
        )}

        {/* Members count */}
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{group.memberCount} members</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">
            Created {group.createdAt}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onViewDetails(group)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(group)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Group
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onManageMembers(group)}>
                <Users className="mr-2 h-4 w-4" />
                Manage Members
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(group)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Group
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
