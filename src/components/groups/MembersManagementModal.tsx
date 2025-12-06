import { useState } from "react";
import { Group, GroupMember, GroupRole } from "@/types/groups";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  MoreHorizontal, 
  UserX, 
  UserCog,
  UserPlus,
  Users,
  Shield,
  Crown
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MembersManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: Group | null;
}

// Mock members data
const mockMembers: GroupMember[] = [
  {
    id: "m1",
    groupId: "1",
    userId: "u1",
    userName: "John Doe",
    userEmail: "john@example.com",
    role: "admin",
    joinedAt: "Nov 15, 2024",
  },
  {
    id: "m2",
    groupId: "1",
    userId: "u2",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    role: "moderator",
    joinedAt: "Nov 18, 2024",
  },
  {
    id: "m3",
    groupId: "1",
    userId: "u3",
    userName: "Mike Johnson",
    userEmail: "mike@example.com",
    role: "member",
    joinedAt: "Nov 20, 2024",
  },
  {
    id: "m4",
    groupId: "1",
    userId: "u4",
    userName: "Sarah Williams",
    userEmail: "sarah@example.com",
    role: "member",
    joinedAt: "Nov 22, 2024",
  },
];

// Mock available users
const availableUsers = [
  { id: "u5", name: "Emily Chen", email: "emily@example.com" },
  { id: "u6", name: "Robert Taylor", email: "robert@example.com" },
  { id: "u7", name: "Lisa Anderson", email: "lisa@example.com" },
];

const roleIcons: Record<GroupRole, React.ReactNode> = {
  admin: <Crown className="h-3 w-3" />,
  moderator: <Shield className="h-3 w-3" />,
  member: null,
};

const roleColors: Record<GroupRole, "default" | "secondary" | "outline"> = {
  admin: "default",
  moderator: "secondary",
  member: "outline",
};

export function MembersManagementModal({
  open,
  onOpenChange,
  group,
}: MembersManagementModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState<string[]>([]);

  if (!group) return null;

  const filteredMembers = mockMembers.filter(
    (member) =>
      member.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveMember = (member: GroupMember) => {
    toast({
      title: "Member Removed",
      description: `${member.userName} has been removed from the group.`,
    });
  };

  const handleChangeRole = (member: GroupMember, newRole: GroupRole) => {
    toast({
      title: "Role Updated",
      description: `${member.userName} is now a ${newRole}.`,
    });
  };

  const handleAddMembers = () => {
    if (selectedUsersToAdd.length === 0) return;
    toast({
      title: "Members Added",
      description: `${selectedUsersToAdd.length} member(s) added to the group.`,
    });
    setSelectedUsersToAdd([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Members</DialogTitle>
          <p className="text-sm text-muted-foreground">{group.name}</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add Members Section */}
          <div className="p-4 rounded-lg border border-border bg-muted/30">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add Members
            </h4>
            <div className="flex gap-2">
              <Select
                value={selectedUsersToAdd[0] || ""}
                onValueChange={(value) => setSelectedUsersToAdd([value])}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select members to add" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddMembers} disabled={selectedUsersToAdd.length === 0}>
                <UserPlus className="h-4 w-4 mr-1.5" />
                Add
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Members Table */}
          {filteredMembers.length > 0 ? (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.userPhoto} />
                            <AvatarFallback className="text-xs">
                              {member.userName.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{member.userName}</p>
                            <p className="text-xs text-muted-foreground">{member.userEmail}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={roleColors[member.role]} className="gap-1 capitalize">
                          {roleIcons[member.role]}
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {member.joinedAt}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleChangeRole(member, "admin")}>
                              <Crown className="mr-2 h-4 w-4" />
                              Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeRole(member, "moderator")}>
                              <Shield className="mr-2 h-4 w-4" />
                              Make Moderator
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeRole(member, "member")}>
                              <UserCog className="mr-2 h-4 w-4" />
                              Make Member
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleRemoveMember(member)}
                              className="text-destructive"
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-border rounded-lg">
              <Users className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm font-medium text-foreground">No members found</p>
              <p className="text-xs text-muted-foreground">Add members to start group chat.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
