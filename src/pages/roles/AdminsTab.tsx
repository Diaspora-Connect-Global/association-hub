import { useEffect, useState } from "react";
import {
  Loader2,
  Plus,
  Search,
  Shield,
  UserCog,
  X,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useT } from "@/hooks/useT";
import {
  ASSOCIATION_ADMIN_TYPES,
  roleTypeLabel,
  type AdminRoleTypeOption,
} from "@/constants/adminPermissions";
import { useAdminAuthStore, decodeAdminJwt } from "@/stores/adminAuthStore";
import { filterAssignableRoleTypes } from "@/lib/adminAccess";
import {
  listAdmins,
  createAdmin,
  getAdminById,
  assignAdminRole,
  revokeAdminRole,
  updateAdminStatus,
  type AdminAccount,
} from "@/services/graphql/admin-management";

interface AdminsTabProps {
  associationId: string;
}

/** True when the admin has at least one role scoped to this association. */
function belongsToAssociation(admin: AdminAccount, associationId: string): boolean {
  return admin.roles.some(
    (r) => r.scopeType === "ASSOCIATION" && r.scopeId === associationId,
  );
}

/** Merge an admin into the list, replacing any existing entry with the same id. */
function upsertAdmin(list: AdminAccount[], admin: AdminAccount): AdminAccount[] {
  const idx = list.findIndex((a) => a.id === admin.id);
  if (idx === -1) return [admin, ...list];
  const next = [...list];
  next[idx] = admin;
  return next;
}

export function AdminsTab({ associationId }: AdminsTabProps) {
  const t = useT();
  const authAdmin = useAdminAuthStore((s) => s.admin);
  const accessToken = useAdminAuthStore((s) => s.accessToken);
  const jwt = decodeAdminJwt(accessToken);
  // No privilege escalation: only offer role types at or below the current
  // admin's own highest-held role.
  const assignableRoleTypes = filterAssignableRoleTypes(
    ASSOCIATION_ADMIN_TYPES,
    authAdmin,
    jwt,
  );

  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rowBusy, setRowBusy] = useState<string | null>(null);

  const [lookupId, setLookupId] = useState("");
  const [lookingUp, setLookingUp] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<AdminAccount | null>(null);

  const fetchAdmins = async () => {
    if (!associationId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await listAdmins({ limit: 100 });
      const scoped = (res.admins ?? []).filter((a) =>
        belongsToAssociation(a, associationId),
      );
      setAdmins(scoped);
    } catch (err) {
      // listAdmins may be unavailable to association admins — degrade gracefully
      // to the manual "look up by ID" + session-created flow rather than blocking.
      setError((err as Error).message ?? t.adminsErrorLoad);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [associationId]);

  const refreshAdmin = async (adminId: string) => {
    try {
      const res = await getAdminById(adminId);
      if (res.success && res.admin) {
        setAdmins((prev) => upsertAdmin(prev, res.admin as AdminAccount));
      }
    } catch {
      /* best-effort refresh */
    }
  };

  const handleLookup = async () => {
    const id = lookupId.trim();
    if (!id) return;
    setLookingUp(true);
    try {
      const res = await getAdminById(id);
      if (res.success && res.admin) {
        setAdmins((prev) => upsertAdmin(prev, res.admin as AdminAccount));
        setLookupId("");
      } else {
        toast({ title: res.message ?? t.adminsErrorLookup, variant: "destructive" });
      }
    } catch (err) {
      toast({
        title: (err as Error).message ?? t.adminsErrorLookup,
        variant: "destructive",
      });
    } finally {
      setLookingUp(false);
    }
  };

  const handleRevoke = async (admin: AdminAccount, assignmentId: string) => {
    setRowBusy(admin.id);
    try {
      const res = await revokeAdminRole(assignmentId);
      if (res.success) {
        toast({ title: res.message ?? t.adminsRoleRevoked });
        await refreshAdmin(admin.id);
      } else {
        toast({ title: res.message ?? t.adminsErrorRevoke, variant: "destructive" });
      }
    } catch (err) {
      toast({
        title: (err as Error).message ?? t.adminsErrorRevoke,
        variant: "destructive",
      });
    } finally {
      setRowBusy(null);
    }
  };

  const handleToggleStatus = async (admin: AdminAccount) => {
    const nextStatus = admin.status?.toLowerCase() === "active" ? "inactive" : "active";
    setRowBusy(admin.id);
    try {
      const res = await updateAdminStatus({ adminId: admin.id, status: nextStatus });
      if (res.success) {
        toast({ title: res.message ?? t.adminsStatusUpdated });
        await refreshAdmin(admin.id);
      } else {
        toast({ title: res.message ?? t.adminsErrorStatus, variant: "destructive" });
      }
    } catch (err) {
      toast({
        title: (err as Error).message ?? t.adminsErrorStatus,
        variant: "destructive",
      });
    } finally {
      setRowBusy(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">{t.adminsDescription}</p>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t.adminsCreate}
        </Button>
      </div>

      {/* Manual lookup by ID — fallback path when no scoped list is available */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.adminsLookupPlaceholder}
            className="pl-10"
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleLookup();
            }}
          />
        </div>
        <Button
          variant="outline"
          onClick={handleLookup}
          disabled={lookingUp || !lookupId.trim()}
        >
          {lookingUp && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {t.adminsLookup}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm p-3 rounded-lg bg-destructive/10">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          {t.loading}
        </div>
      ) : admins.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <UserCog className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground max-w-md">
              {t.adminsEmpty}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>{t.adminsColAdmin}</TableHead>
                <TableHead className="w-40">{t.adminsColType}</TableHead>
                <TableHead>{t.adminsColRoles}</TableHead>
                <TableHead className="w-24">{t.adminsColStatus}</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => {
                const associationRoles = admin.roles.filter(
                  (r) => r.scopeType === "ASSOCIATION" && r.scopeId === associationId,
                );
                const isActive = admin.status?.toLowerCase() === "active";
                return (
                  <TableRow key={admin.id} className="group">
                    <TableCell>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-foreground truncate">
                          {admin.email}
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground truncate">
                          {admin.id}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {roleTypeLabel(admin.adminType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {associationRoles.length === 0 ? (
                          <span className="text-xs text-muted-foreground">
                            {t.adminsNoRoles}
                          </span>
                        ) : (
                          associationRoles.map((r) => (
                            <Badge
                              key={r.id}
                              variant="outline"
                              className="font-normal gap-1"
                            >
                              {roleTypeLabel(r.roleType)}
                              <button
                                type="button"
                                aria-label={t.adminsRevoke}
                                className="ml-0.5 hover:text-destructive disabled:opacity-50"
                                disabled={rowBusy === admin.id}
                                onClick={() => handleRevoke(admin, r.id)}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isActive ? "default" : "secondary"}>
                        {admin.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-foreground"
                            disabled={rowBusy === admin.id}
                          >
                            {rowBusy === admin.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setAssignTarget(admin)}
                            className="text-foreground"
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            {t.adminsAssignRole}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(admin)}
                            className="text-foreground"
                          >
                            <UserCog className="h-4 w-4 mr-2" />
                            {isActive ? t.adminsDeactivate : t.adminsActivate}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <CreateAdminDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        associationId={associationId}
        roleTypes={assignableRoleTypes}
        onCreated={(admin) => setAdmins((prev) => upsertAdmin(prev, admin))}
      />

      <AssignRoleDialog
        admin={assignTarget}
        associationId={associationId}
        roleTypes={assignableRoleTypes}
        onOpenChange={(open) => {
          if (!open) setAssignTarget(null);
        }}
        onAssigned={(adminId) => refreshAdmin(adminId)}
      />
    </div>
  );
}

interface CreateAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  associationId: string;
  roleTypes: AdminRoleTypeOption[];
  onCreated: (admin: AdminAccount) => void;
}

function CreateAdminDialog({
  open,
  onOpenChange,
  associationId,
  roleTypes,
  onCreated,
}: CreateAdminDialogProps) {
  const t = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminType, setAdminType] = useState(roleTypes[0]?.value ?? "");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setEmail("");
    setPassword("");
    setAdminType(roleTypes[0]?.value ?? "");
    setFormError(null);
  }, [open, roleTypes]);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setFormError(t.adminsFormEmailRequired);
      return;
    }
    if (password.length < 8) {
      setFormError(t.adminsFormPasswordRequired);
      return;
    }
    if (!adminType) {
      setFormError(t.adminsFormTypeRequired);
      return;
    }
    setFormError(null);
    setSaving(true);
    try {
      const res = await createAdmin({
        email: email.trim(),
        password,
        adminType,
        scopeType: "ASSOCIATION",
        scopeId: associationId,
      });
      if (res.success && res.admin) {
        toast({ title: res.message ?? t.adminsFormCreated });
        onCreated(res.admin);
        onOpenChange(false);
      } else {
        toast({
          title: res.message ?? t.adminsErrorCreate,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: (err as Error).message ?? t.adminsErrorCreate,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.adminsFormTitle}</DialogTitle>
          <DialogDescription>{t.adminsFormSubtitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="admin-email">{t.adminsFormEmail}</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              placeholder="admin@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="admin-password">{t.adminsFormPassword}</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {t.adminsFormPasswordHint}
            </p>
          </div>
          <div className="space-y-1.5">
            <Label>{t.adminsFormType}</Label>
            <Select value={adminType} onValueChange={setAdminType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleTypes.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formError && <p className="text-sm text-destructive">{formError}</p>}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            {t.cancel}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={saving || roleTypes.length === 0}
          >
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {t.adminsFormSubmit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface AssignRoleDialogProps {
  admin: AdminAccount | null;
  associationId: string;
  roleTypes: AdminRoleTypeOption[];
  onOpenChange: (open: boolean) => void;
  onAssigned: (adminId: string) => void;
}

function AssignRoleDialog({
  admin,
  associationId,
  roleTypes,
  onOpenChange,
  onAssigned,
}: AssignRoleDialogProps) {
  const t = useT();
  const [roleType, setRoleType] = useState(roleTypes[0]?.value ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (admin) setRoleType(roleTypes[0]?.value ?? "");
  }, [admin, roleTypes]);

  const handleSubmit = async () => {
    if (!admin || !roleType) return;
    setSaving(true);
    try {
      const res = await assignAdminRole({
        adminId: admin.id,
        roleType,
        scopeType: "ASSOCIATION",
        scopeId: associationId,
      });
      if (res.success) {
        toast({ title: res.message ?? t.adminsRoleAssigned });
        onAssigned(admin.id);
        onOpenChange(false);
      } else {
        toast({ title: res.message ?? t.adminsErrorAssign, variant: "destructive" });
      }
    } catch (err) {
      toast({
        title: (err as Error).message ?? t.adminsErrorAssign,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!admin} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t.adminsAssignFormTitle}</DialogTitle>
          <DialogDescription>
            {admin?.email
              ? `${t.adminsAssignFormSubtitle} ${admin.email}`
              : t.adminsAssignFormTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5 py-2">
          <Label>{t.adminsAssignFormRole}</Label>
          <Select value={roleType} onValueChange={setRoleType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roleTypes.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            {t.cancel}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={saving || roleTypes.length === 0}
          >
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {t.adminsAssignFormSubmit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
