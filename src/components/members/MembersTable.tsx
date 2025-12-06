import { Eye, BadgeCheck, UserMinus, MoreHorizontal, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/StatusBadge";

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: "admin" | "sub-admin" | "member";
  status: "active" | "pending" | "suspended" | "rejected" | "left";
  paymentStatus?: "paid" | "unpaid" | "expired" | "subscription_active" | "subscription_failed";
  joinedAt: string;
}

interface MembersTableProps {
  members: Member[];
  selectedMembers: string[];
  onSelectMember: (id: string) => void;
  onSelectAll: () => void;
  onViewProfile: (member: Member) => void;
  onChangeRole: (member: Member) => void;
  onRemoveMember: (member: Member) => void;
  isPaidAssociation?: boolean;
  onInvite?: () => void;
}

const roleColors = {
  member: "bg-muted text-muted-foreground",
  "sub-admin": "surface-brand-light text-text-brand",
  admin: "surface-brand text-text-white",
};

const statusVariants = {
  active: "active" as const,
  pending: "pending" as const,
  suspended: "error" as const,
  rejected: "error" as const,
  left: "inactive" as const,
};

const paymentVariants = {
  paid: "active" as const,
  unpaid: "error" as const,
  expired: "error" as const,
  subscription_active: "active" as const,
  subscription_failed: "error" as const,
};

const paymentLabels = {
  paid: "Paid",
  unpaid: "Unpaid",
  expired: "Expired",
  subscription_active: "Active",
  subscription_failed: "Failed",
};

export function MembersTable({
  members,
  selectedMembers,
  onSelectMember,
  onSelectAll,
  onViewProfile,
  onChangeRole,
  onRemoveMember,
  isPaidAssociation = false,
  onInvite,
}: MembersTableProps) {
  const allSelected = members.length > 0 && selectedMembers.length === members.length;

  if (members.length === 0) {
    return (
      <div className="rounded-lg border border-border-subtle surface-default p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full surface-subtle">
          <UserPlus className="h-8 w-8 text-text-secondary" />
        </div>
        <h3 className="label-medium text-text-primary mb-2">No members yet</h3>
        <p className="body-small text-text-secondary mb-4">
          Invite your first members to start building your association.
        </p>
        {onInvite && (
          <Button onClick={onInvite} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Invite Member
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border-subtle surface-default overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="surface-subtle">
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Member</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            {isPaidAssociation && <TableHead>Payment</TableHead>}
            <TableHead>Join Date</TableHead>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id} className="hover:surface-subtle">
              <TableCell>
                <Checkbox
                  checked={selectedMembers.includes(member.id)}
                  onCheckedChange={() => onSelectMember(member.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full surface-brand-light label-small text-text-brand">
                    {member.avatar}
                  </div>
                  <div>
                    <p className="label-small text-text-primary">{member.name}</p>
                    <p className="caption-small text-text-secondary">{member.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="body-small text-text-primary">{member.phone}</span>
              </TableCell>
              <TableCell>
                <span className={`rounded-full px-2.5 py-1 caption-small capitalize ${roleColors[member.role]}`}>
                  {member.role}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge variant={statusVariants[member.status]}>
                  {member.status === "left" ? "Left" : member.status}
                </StatusBadge>
              </TableCell>
              {isPaidAssociation && (
                <TableCell>
                  {member.paymentStatus && (
                    <StatusBadge variant={paymentVariants[member.paymentStatus]}>
                      {paymentLabels[member.paymentStatus]}
                    </StatusBadge>
                  )}
                </TableCell>
              )}
              <TableCell>
                <span className="body-small text-text-secondary">{member.joinedAt}</span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-lg p-2 text-text-secondary hover:surface-subtle hover:text-text-primary">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 surface-default">
                    <DropdownMenuItem onClick={() => onViewProfile(member)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onChangeRole(member)}>
                      <BadgeCheck className="mr-2 h-4 w-4" />
                      Change Role
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onRemoveMember(member)}
                      className="text-text-danger focus:text-text-danger"
                    >
                      <UserMinus className="mr-2 h-4 w-4" />
                      Remove Member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
