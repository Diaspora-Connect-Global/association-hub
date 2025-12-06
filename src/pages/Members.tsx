import { useState } from "react";
import { UserPlus, Download } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { MembersFilters } from "@/components/members/MembersFilters";
import { MemberStats } from "@/components/members/MemberStats";
import { MembersTable, type Member } from "@/components/members/MembersTable";
import { BulkActionsBar } from "@/components/members/BulkActionsBar";
import { InviteMemberModal } from "@/components/members/InviteMemberModal";
import { RoleManagementModal } from "@/components/members/RoleManagementModal";
import { RemoveMemberModal } from "@/components/members/RemoveMemberModal";
import { MemberDetailsModal } from "@/components/members/MemberDetailsModal";
import { toast } from "@/hooks/use-toast";
import { useT } from "@/hooks/useT";

// Mock data
const mockMembers: Member[] = [
  {
    id: "1",
    name: "Kofi Asante",
    email: "kofi.asante@email.com",
    phone: "+233 55 123 4567",
    avatar: "KA",
    role: "member",
    status: "active",
    paymentStatus: "subscription_active",
    joinedAt: "Nov 15, 2024",
  },
  {
    id: "2",
    name: "Ama Serwaa",
    email: "ama.serwaa@email.com",
    phone: "+233 24 987 6543",
    avatar: "AS",
    role: "sub-admin",
    status: "active",
    paymentStatus: "paid",
    joinedAt: "Oct 22, 2024",
  },
  {
    id: "3",
    name: "Kwame Mensah",
    email: "kwame.m@email.com",
    phone: "+233 20 555 1234",
    avatar: "KM",
    role: "member",
    status: "pending",
    joinedAt: "Dec 01, 2024",
  },
  {
    id: "4",
    name: "Efua Osei",
    email: "efua.osei@email.com",
    phone: "+233 54 321 9876",
    avatar: "EO",
    role: "admin",
    status: "active",
    paymentStatus: "subscription_active",
    joinedAt: "Sep 10, 2024",
  },
  {
    id: "5",
    name: "Yaw Boateng",
    email: "yaw.b@email.com",
    phone: "+233 27 444 5555",
    avatar: "YB",
    role: "member",
    status: "suspended",
    paymentStatus: "subscription_failed",
    joinedAt: "Aug 05, 2024",
  },
];

export default function Members() {
  const t = useT();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_newest");

  // Selection state
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Modal states
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Configuration - would come from association settings
  const isPaidAssociation = true;

  // Filter members
  const filteredMembers = mockMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery);

    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    const matchesPayment = paymentFilter === "all" || member.paymentStatus === paymentFilter;
    const matchesRole = roleFilter === "all" || member.role === roleFilter;

    return matchesSearch && matchesStatus && matchesPayment && matchesRole;
  });

  // Sort members
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    switch (sortBy) {
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      case "date_newest":
        return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
      case "date_oldest":
        return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
      default:
        return 0;
    }
  });

  // Stats
  const stats = {
    total: mockMembers.length,
    active: mockMembers.filter((m) => m.status === "active").length,
    pending: mockMembers.filter((m) => m.status === "pending").length,
    suspended: mockMembers.filter((m) => m.status === "suspended").length,
  };

  // Handlers
  const handleSelectMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === sortedMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(sortedMembers.map((m) => m.id));
    }
  };

  const handleViewProfile = (member: Member) => {
    setSelectedMember(member);
    setDetailsModalOpen(true);
  };

  const handleChangeRole = (member: Member) => {
    setSelectedMember(member);
    setRoleModalOpen(true);
  };

  const handleRemoveMember = (member: Member) => {
    setSelectedMember(member);
    setRemoveModalOpen(true);
  };

  const handleExportCSV = () => {
    toast({
      title: t.export,
      description: "Your member list is being exported to CSV.",
    });
  };

  const hasPendingMembers = selectedMembers.some((id) =>
    mockMembers.find((m) => m.id === id && m.status === "pending")
  );

  return (
    <AdminLayout title={t.membersTitle} subtitle={t.membersSubtitle}>
      {/* Top Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <MembersFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          paymentFilter={paymentFilter}
          onPaymentChange={setPaymentFilter}
          roleFilter={roleFilter}
          onRoleChange={setRoleFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          isPaidAssociation={isPaidAssociation}
        />
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
            <Download className="h-4 w-4" />
            {t.export} CSV
          </Button>
          <Button className="gap-2" onClick={() => setInviteModalOpen(true)}>
            <UserPlus className="h-4 w-4" />
            {t.inviteMember}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <MemberStats
          totalMembers={stats.total}
          activeMembers={stats.active}
          pendingMembers={stats.pending}
          suspendedMembers={stats.suspended}
        />
      </div>

      {/* Bulk Actions Bar */}
      <div className="mb-4">
        <BulkActionsBar
          selectedCount={selectedMembers.length}
          onClearSelection={() => setSelectedMembers([])}
          onSendAnnouncement={() => toast({ title: "Send announcement", description: "Feature coming soon" })}
          onApproveSelected={() => toast({ title: "Approve members", description: "Feature coming soon" })}
          onChangeRole={() => toast({ title: "Change roles", description: "Feature coming soon" })}
          onRemoveSelected={() => toast({ title: "Remove members", description: "Feature coming soon" })}
          hasPendingMembers={hasPendingMembers}
        />
      </div>

      {/* Table */}
      <MembersTable
        members={sortedMembers}
        selectedMembers={selectedMembers}
        onSelectMember={handleSelectMember}
        onSelectAll={handleSelectAll}
        onViewProfile={handleViewProfile}
        onChangeRole={handleChangeRole}
        onRemoveMember={handleRemoveMember}
        isPaidAssociation={isPaidAssociation}
        onInvite={() => setInviteModalOpen(true)}
      />

      {/* Modals */}
      <InviteMemberModal
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
      />

      <RoleManagementModal
        open={roleModalOpen}
        onOpenChange={setRoleModalOpen}
        member={selectedMember}
      />

      <RemoveMemberModal
        open={removeModalOpen}
        onOpenChange={setRemoveModalOpen}
        member={selectedMember}
        isPaidAssociation={isPaidAssociation}
      />

      <MemberDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        member={selectedMember}
        onChangeRole={handleChangeRole}
        onRemoveMember={handleRemoveMember}
        isPaidAssociation={isPaidAssociation}
      />
    </AdminLayout>
  );
}
