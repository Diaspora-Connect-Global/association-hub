import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UsersRound, Search, UserPlus } from "lucide-react";
import { Group, GroupFormData } from "@/types/groups";
import { GroupCard } from "@/components/groups/GroupCard";
import { CreateEditGroupModal } from "@/components/groups/CreateEditGroupModal";
import { GroupDetailsModal } from "@/components/groups/GroupDetailsModal";
import { MembersManagementModal } from "@/components/groups/MembersManagementModal";
import { DeleteGroupModal } from "@/components/groups/DeleteGroupModal";
import { InviteLinkModal } from "@/components/groups/InviteLinkModal";
import { toast } from "@/hooks/use-toast";

// Mock data
const mockGroups: Group[] = [
  {
    id: "1",
    name: "General Discussion",
    description: "A place for all members to chat and share ideas.",
    avatarEmoji: "💬",
    privacy: "public",
    defaultNotifications: "all",
    memberCount: 156,
    createdAt: "Nov 10, 2024",
    updatedAt: "Dec 1, 2024",
    createdBy: "admin",
  },
  {
    id: "2",
    name: "Tech Talk",
    description: "Discuss technology trends, share resources, and collaborate on projects.",
    avatarEmoji: "💻",
    privacy: "public",
    defaultNotifications: "all",
    memberCount: 89,
    createdAt: "Nov 15, 2024",
    updatedAt: "Nov 28, 2024",
    createdBy: "admin",
  },
  {
    id: "3",
    name: "Leadership Committee",
    description: "Private group for association leadership discussions.",
    avatarEmoji: "👔",
    privacy: "private",
    defaultNotifications: "mentions",
    memberCount: 12,
    createdAt: "Oct 20, 2024",
    updatedAt: "Dec 2, 2024",
    createdBy: "admin",
  },
  {
    id: "4",
    name: "Event Planning",
    description: "Coordinate and plan upcoming association events.",
    avatarEmoji: "📅",
    privacy: "private",
    defaultNotifications: "all",
    memberCount: 24,
    createdAt: "Nov 5, 2024",
    updatedAt: "Dec 3, 2024",
    createdBy: "admin",
  },
  {
    id: "5",
    name: "Mentorship Network",
    description: "Connect mentors with mentees for professional growth.",
    avatarEmoji: "🎓",
    privacy: "private",
    defaultNotifications: "mentions",
    memberCount: 45,
    createdAt: "Sep 15, 2024",
    updatedAt: "Nov 20, 2024",
    createdBy: "admin",
  },
  {
    id: "6",
    name: "Social & Networking",
    description: "Casual conversations and networking opportunities.",
    avatarEmoji: "🎉",
    privacy: "public",
    defaultNotifications: "muted",
    memberCount: 203,
    createdAt: "Aug 1, 2024",
    updatedAt: "Dec 4, 2024",
    createdBy: "admin",
  },
];

export default function Groups() {
  const [groups] = useState<Group[]>(mockGroups);
  const [searchQuery, setSearchQuery] = useState("");
  const [privacyFilter, setPrivacyFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);
  const [inviteLinkModalOpen, setInviteLinkModalOpen] = useState(false);
  const [inviteLinkGroup, setInviteLinkGroup] = useState<Group | null>(null);

  // Filter and sort groups
  const filteredGroups = groups
    .filter((group) => {
      const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrivacy = privacyFilter === "all" || group.privacy === privacyFilter;
      return matchesSearch && matchesPrivacy;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "alphabetical":
          return a.name.localeCompare(b.name);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  // Stats
  const totalGroups = groups.length;
  const publicGroups = groups.filter(g => g.privacy === "public").length;
  const privateGroups = groups.filter(g => g.privacy === "private").length;
  const totalMembers = groups.reduce((sum, g) => sum + g.memberCount, 0);

  // Handlers
  const handleViewDetails = (group: Group) => {
    setSelectedGroup(group);
    setDetailsModalOpen(true);
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setCreateModalOpen(true);
  };

  const handleManageMembers = (group: Group) => {
    setSelectedGroup(group);
    setMembersModalOpen(true);
  };

  const handleDelete = (group: Group) => {
    setGroupToDelete(group);
    setDeleteModalOpen(true);
  };

  const handleInviteLink = (group: Group) => {
    setInviteLinkGroup(group);
    setInviteLinkModalOpen(true);
  };

  const handleConfirmDelete = () => {
    toast({
      title: "Group Deleted",
      description: "The group has been permanently deleted.",
    });
    setDeleteModalOpen(false);
    setGroupToDelete(null);
  };

  const handleCreateSubmit = (data: GroupFormData) => {
    toast({
      title: editingGroup ? "Group Updated" : "Group Created",
      description: editingGroup 
        ? "Group details updated successfully."
        : "Your new group is ready.",
    });
    setEditingGroup(null);
  };

  return (
    <AdminLayout title="Groups" subtitle="Manage chat groups for your association">
      {/* Top Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Select value={privacyFilter} onValueChange={setPrivacyFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Privacy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Groups</p>
          <p className="text-2xl font-bold text-foreground">{totalGroups}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Public Groups</p>
          <p className="text-2xl font-bold text-primary">{publicGroups}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Private Groups</p>
          <p className="text-2xl font-bold text-foreground">{privateGroups}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Members</p>
          <p className="text-2xl font-bold text-foreground">{totalMembers}</p>
        </div>
      </div>

      {/* Groups Grid */}
      {filteredGroups.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map((group, index) => (
            <div
              key={group.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <GroupCard
                group={group}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onManageMembers={handleManageMembers}
                onInviteLink={handleInviteLink}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <UsersRound className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Groups Created</h3>
          <p className="text-muted-foreground mb-4">
            Start by creating your first chat group for your association.
          </p>
          <Button onClick={() => setCreateModalOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>
      )}

      {/* Modals */}
      <CreateEditGroupModal
        open={createModalOpen}
        onOpenChange={(open) => {
          setCreateModalOpen(open);
          if (!open) setEditingGroup(null);
        }}
        group={editingGroup}
        onSubmit={handleCreateSubmit}
      />

      <GroupDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        group={selectedGroup}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onManageMembers={handleManageMembers}
      />

      <MembersManagementModal
        open={membersModalOpen}
        onOpenChange={setMembersModalOpen}
        group={selectedGroup}
      />

      <DeleteGroupModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        group={groupToDelete}
        onConfirm={handleConfirmDelete}
      />

      <InviteLinkModal
        open={inviteLinkModalOpen}
        onOpenChange={setInviteLinkModalOpen}
        group={inviteLinkGroup}
      />
    </AdminLayout>
  );
}
