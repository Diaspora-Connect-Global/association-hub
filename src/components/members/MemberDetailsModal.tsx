import { BadgeCheck, UserMinus, Shield, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Member } from "./MembersTable";

interface MemberDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
  onChangeRole: (member: Member) => void;
  onRemoveMember: (member: Member) => void;
  isPaidAssociation?: boolean;
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

export function MemberDetailsModal({
  open,
  onOpenChange,
  member,
  onChangeRole,
  onRemoveMember,
  isPaidAssociation = false,
}: MemberDetailsModalProps) {
  if (!member) return null;

  // Mock additional data
  const memberDetails = {
    country: "Ghana",
    city: "Accra",
    gender: "Male",
    dateOfBirth: "Jan 15, 1990",
    inviteMethod: "Admin invite",
    lastPaymentDate: "Nov 1, 2024",
    nextRenewalDate: "Dec 1, 2024",
    eventsAttended: 12,
    groupPosts: 8,
    announcementsReadRate: 85,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl surface-default max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Member Profile</DialogTitle>
        </DialogHeader>

        {/* Header Section */}
        <div className="flex items-start gap-4 pb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full surface-brand-light label-large text-text-brand">
            {member.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="label-large text-text-primary">{member.name}</h2>
              <span className={`rounded-full px-2.5 py-1 caption-small capitalize ${roleColors[member.role]}`}>
                {member.role}
              </span>
              <StatusBadge variant={statusVariants[member.status]}>
                {member.status}
              </StatusBadge>
            </div>
            <p className="body-small text-text-secondary">{member.email}</p>
          </div>
          <div className="flex gap-2">
            {member.role === "member" && (
              <Button variant="outline" size="sm" onClick={() => onChangeRole(member)}>
                <Shield className="h-4 w-4 mr-1" />
                Promote
              </Button>
            )}
            {member.role !== "member" && (
              <Button variant="outline" size="sm" onClick={() => onChangeRole(member)}>
                <ShieldOff className="h-4 w-4 mr-1" />
                Demote
              </Button>
            )}
            <Button variant="outline" size="sm" className="text-text-danger" onClick={() => onRemoveMember(member)}>
              <UserMinus className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>

        <Separator />

        {/* Personal Info */}
        <div className="py-4">
          <h3 className="label-medium text-text-primary mb-3">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="caption-small text-text-secondary">Full Name</p>
              <p className="body-small text-text-primary">{member.name}</p>
            </div>
            <div>
              <p className="caption-small text-text-secondary">Email</p>
              <p className="body-small text-text-primary">{member.email}</p>
            </div>
            <div>
              <p className="caption-small text-text-secondary">Phone Number</p>
              <p className="body-small text-text-primary">{member.phone}</p>
            </div>
            <div>
              <p className="caption-small text-text-secondary">Country</p>
              <p className="body-small text-text-primary">{memberDetails.country}</p>
            </div>
            <div>
              <p className="caption-small text-text-secondary">City</p>
              <p className="body-small text-text-primary">{memberDetails.city}</p>
            </div>
            <div>
              <p className="caption-small text-text-secondary">Gender</p>
              <p className="body-small text-text-primary">{memberDetails.gender}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Membership Info */}
        <div className="py-4">
          <h3 className="label-medium text-text-primary mb-3">Membership Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="caption-small text-text-secondary">Role in Association</p>
              <p className="body-small text-text-primary capitalize">{member.role}</p>
            </div>
            <div>
              <p className="caption-small text-text-secondary">Membership Status</p>
              <p className="body-small text-text-primary capitalize">{member.status}</p>
            </div>
            <div>
              <p className="caption-small text-text-secondary">Join Date</p>
              <p className="body-small text-text-primary">{member.joinedAt}</p>
            </div>
            <div>
              <p className="caption-small text-text-secondary">Invite Method</p>
              <p className="body-small text-text-primary">{memberDetails.inviteMethod}</p>
            </div>
          </div>
        </div>

        {/* Payment Info - only for paid associations */}
        {isPaidAssociation && member.paymentStatus && (
          <>
            <Separator />
            <div className="py-4">
              <h3 className="label-medium text-text-primary mb-3">Payment Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="caption-small text-text-secondary">Payment Type</p>
                  <p className="body-small text-text-primary">Subscription</p>
                </div>
                <div>
                  <p className="caption-small text-text-secondary">Payment Status</p>
                  <StatusBadge 
                    variant={member.paymentStatus === "subscription_active" || member.paymentStatus === "paid" ? "active" : "error"}
                  >
                    {member.paymentStatus.replace("_", " ")}
                  </StatusBadge>
                </div>
                <div>
                  <p className="caption-small text-text-secondary">Last Payment Date</p>
                  <p className="body-small text-text-primary">{memberDetails.lastPaymentDate}</p>
                </div>
                <div>
                  <p className="caption-small text-text-secondary">Next Renewal Date</p>
                  <p className="body-small text-text-primary">{memberDetails.nextRenewalDate}</p>
                </div>
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Activity Summary */}
        <div className="py-4">
          <h3 className="label-medium text-text-primary mb-3">Activity Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg surface-subtle p-4 text-center">
              <p className="heading-small text-text-brand">{memberDetails.eventsAttended}</p>
              <p className="caption-small text-text-secondary">Events Attended</p>
            </div>
            <div className="rounded-lg surface-subtle p-4 text-center">
              <p className="heading-small text-text-brand">{memberDetails.groupPosts}</p>
              <p className="caption-small text-text-secondary">Group Posts</p>
            </div>
            <div className="rounded-lg surface-subtle p-4 text-center">
              <p className="heading-small text-text-brand">{memberDetails.announcementsReadRate}%</p>
              <p className="caption-small text-text-secondary">Announcements Read</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
