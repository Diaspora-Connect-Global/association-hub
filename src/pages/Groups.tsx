import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  MoreHorizontal,
  Trash2,
  Users,
  Lock,
  Globe,
  Loader2,
  AlertCircle,
  ShieldAlert,
  ExternalLink,
} from "lucide-react";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "@/hooks/use-toast";
import { useT } from "@/hooks/useT";
import { getAdminAssociationId } from "@/stores/adminAuthStore";
import { getEntityGroups } from "@/services/graphql/groups/queries";
import { createGroup, deleteGroup } from "@/services/graphql/groups/mutations";
import type { Group, GroupPrivacy } from "@/services/graphql/groups/types";

interface CreateForm {
  name: string;
  description: string;
  privacy: GroupPrivacy;
}

const DEFAULT_CREATE_FORM: CreateForm = {
  name: "",
  description: "",
  privacy: "PUBLIC",
};

function formatPrivacy(privacy: GroupPrivacy): string {
  if (privacy === "PUBLIC") return "Public";
  if (privacy === "SECRET") return "Secret";
  return "Private";
}

function PrivacyIcon({ privacy }: { privacy: GroupPrivacy }) {
  if (privacy === "PUBLIC") return <Globe className="h-3 w-3" />;
  if (privacy === "SECRET") return <ShieldAlert className="h-3 w-3" />;
  return <Lock className="h-3 w-3" />;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
}

export default function Groups() {
  const t = useT();
  const navigate = useNavigate();
  const associationId = useMemo(() => getAdminAssociationId(), []);

  const [groups, setGroups] = useState<Group[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [createForm, setCreateForm] = useState<CreateForm>(DEFAULT_CREATE_FORM);

  const fetchGroups = useCallback(
    async (search?: string) => {
      if (!associationId) {
        setGroups([]);
        setError("No association is associated with this admin account.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const result = await getEntityGroups({
          entityId: associationId,
          entityType: "ASSOCIATION",
          search: search?.trim() || undefined,
          limit: 100,
          offset: 0,
        });
        setGroups(result.groups);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load groups");
      } finally {
        setLoading(false);
      }
    },
    [associationId],
  );

  useEffect(() => {
    void fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchGroups(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchGroups]);

  const openGroup = (group: Group) => {
    navigate(`/groups/${group.id}`);
  };

  const handleDeleteClick = (group: Group) => {
    setSelectedGroup(group);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedGroup) return;
    setSubmitting(true);
    try {
      const result = await deleteGroup(selectedGroup.id);
      if (!result.success) throw new Error(result.message ?? "Delete failed");
      setGroups((prev) => prev.filter((g) => g.id !== selectedGroup.id));
      toast({
        title: "Group deleted",
        description: `"${selectedGroup.name}" was removed.`,
      });
      setDeleteOpen(false);
      setSelectedGroup(null);
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : "Failed to delete group",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreate = async () => {
    if (!associationId) {
      toast({
        title: "No association",
        description: "Cannot create a group without an association context.",
        variant: "destructive",
      });
      return;
    }
    const name = createForm.name.trim();
    if (!name) {
      toast({
        title: "Name required",
        description: "Enter a group name before creating.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const result = await createGroup({
        name,
        description: createForm.description.trim() || undefined,
        privacy: createForm.privacy,
        entityId: associationId,
        entityType: "ASSOCIATION",
      });
      const created = result.group;
      setGroups((prev) => [created, ...prev]);
      setCreateForm(DEFAULT_CREATE_FORM);
      setCreateOpen(false);
      toast({
        title: "Group created",
        description: `"${created.name}" is now live.`,
      });
    } catch (err) {
      toast({
        title: "Create failed",
        description: err instanceof Error ? err.message : "Failed to create group",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title={t.groupsTitle} subtitle="Groups for this association">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Input
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setCreateOpen(true)} disabled={!associationId}>
            <Plus className="h-4 w-4 mr-2" />
            Create new group
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm flex-1">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void fetchGroups(searchTerm)}
            >
              Retry
            </Button>
          </div>
        )}

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : groups.length === 0 ? (
              <div className="text-center py-16 px-6">
                <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  No groups yet
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first group to start organizing members and conversations.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setCreateOpen(true)}
                  disabled={!associationId}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create new group
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Name</TableHead>
                    <TableHead className="w-32">Privacy</TableHead>
                    <TableHead className="w-28 text-center">Members</TableHead>
                    <TableHead className="w-32">Created</TableHead>
                    <TableHead className="w-16 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groups.map((group) => (
                    <TableRow
                      key={group.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => openGroup(group)}
                    >
                      <TableCell className="font-medium text-foreground">
                        {group.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="gap-1">
                          <PrivacyIcon privacy={group.privacy} />
                          {formatPrivacy(group.privacy)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{group.memberCount}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(group.createdAt)}
                      </TableCell>
                      <TableCell
                        className="text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openGroup(group)}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(group)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Create a new group scoped to this association.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Group Name</Label>
              <Input
                id="create-name"
                placeholder="Enter group name..."
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-privacy">Privacy</Label>
              <Select
                value={createForm.privacy}
                onValueChange={(value) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    privacy: value as GroupPrivacy,
                  }))
                }
              >
                <SelectTrigger id="create-privacy">
                  <SelectValue placeholder="Select privacy level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLIC">Public</SelectItem>
                  <SelectItem value="PRIVATE">Private</SelectItem>
                  <SelectItem value="SECRET">Secret</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-description">Description</Label>
              <Textarea
                id="create-description"
                placeholder="Describe your group..."
                rows={4}
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={() => void handleCreate()} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedGroup?.name}&quot;? This
              action cannot be undone and all group data will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => void confirmDelete()}
              disabled={submitting}
            >
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
