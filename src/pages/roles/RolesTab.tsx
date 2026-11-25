import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus, ShieldCheck, Lock, AlertCircle, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useT } from "@/hooks/useT";
import { useRoleT } from "@/hooks/useRoleT";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  getRoleDefinitions,
  createRoleDefinition,
  updateRoleDefinition,
  deleteRoleDefinition,
  getEntityRoleCatalogue,
  type RoleDefinition,
} from "@/services/graphql/admin-management";
import { graphqlErrorMessage, safeServerMessage } from "@/lib/graphqlErrors";
import {
  groupCatalogue,
  setModulePermissions,
  templatePermissions,
  togglePermission,
  validateRoleForm,
  type RoleCatalogue,
} from "@/lib/rolePermissions";
import { useConsoleAccess } from "@/hooks/useConsoleAccess";

interface RolesTabProps {
  associationId: string;
}

/** i18n key of a permission's label / description (keys nest on the dot: `events.manage`). */
const permissionText = (key: string, part: "label" | "description") => `rolePermissions.${key}.${part}`;

export function RolesTab({ associationId }: RolesTabProps) {
  const tc = useT();
  const rt = useRoleT();
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<RoleDefinition | "new" | null>(null);
  /** Template a "Use this role" click starts the create dialog from. */
  const [startTemplate, setStartTemplate] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<RoleDefinition | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  // The catalogue and templates are the backend's single definition.
  const catalogueQuery = useQuery({
    queryKey: ["entityRoleCatalogue", "ASSOCIATION"],
    queryFn: () => getEntityRoleCatalogue("ASSOCIATION"),
    staleTime: 60 * 60_000,
  });
  const catalogue = catalogueQuery.data ?? null;

  const fetchRoles = async () => {
    if (!associationId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getRoleDefinitions("ASSOCIATION", associationId);
      if (res.success) {
        // Strict scope isolation: only ever surface roles that belong to THIS
        // association. Defends against the backend returning global/other-scope
        // roles alongside the requested scope.
        setRoles(
          (res.roles ?? []).filter(
            (r) => r.scopeType === "ASSOCIATION" && r.scopeId === associationId,
          ),
        );
      } else {
        setError(safeServerMessage(res.message, rt("errors.loadRoles")));
      }
    } catch (err) {
      setError(graphqlErrorMessage(err, rt("errors.loadRoles")));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [associationId]);

  const handleDelete = async () => {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      await deleteRoleDefinition(deleting.id);
      toast({ title: rt("roles.deleted") });
      setDeleting(null);
      await fetchRoles();
    } catch (err) {
      toast({ title: graphqlErrorMessage(err, rt("errors.deleteRole")), variant: "destructive" });
    } finally {
      setDeletingBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {rt("roles.description")}
        </p>
        <Button
          onClick={() => {
            setStartTemplate(null);
            setEditing("new");
          }}
          disabled={!catalogue}
        >
          <Plus className="h-4 w-4 mr-2" />
          {rt("roles.create")}
        </Button>
      </div>

      {(error || catalogueQuery.isError) && (
        <div className="flex items-center gap-2 text-destructive text-sm p-3 rounded-lg bg-destructive/10">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error ?? rt("errors.loadCatalogue")}
        </div>
      )}

      <h2 className="text-base font-semibold text-foreground">{rt("roles.yours")}</h2>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          {tc.loading}
        </div>
      ) : roles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <ShieldCheck className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              {rt("roles.empty")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {roles.map((role) => (
            <Card key={role.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground truncate">{role.name}</h3>
                      {role.isSystem && (
                        <Badge variant="secondary" className="shrink-0">
                          <Lock className="h-3 w-3 mr-1" />
                          {rt("roles.system")}
                        </Badge>
                      )}
                    </div>
                    {role.description && (
                      <p className="text-xs text-muted-foreground mt-1">{role.description}</p>
                    )}
                  </div>
                  {!role.isSystem && (
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-foreground"
                        aria-label={rt("roles.edit", { name: role.name })}
                        disabled={!catalogue}
                        onClick={() => setEditing(role)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-foreground hover:text-destructive"
                        aria-label={rt("roles.delete", { name: role.name })}
                        onClick={() => setDeleting(role)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.length === 0 ? (
                    <span className="text-xs text-muted-foreground">
                      {rt("roles.noPermissions")}
                    </span>
                  ) : (
                    role.permissions.map((p) => (
                      <Badge key={p} variant="outline" className="font-normal">
                        {rt(permissionText(p, "label"), undefined, rt("roles.otherPermission"))}
                      </Badge>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {catalogue && catalogue.templates.length > 0 && (
        <section aria-labelledby="ready-made-roles" className="space-y-3 pt-2">
          <div>
            <h2 id="ready-made-roles" className="text-base font-semibold text-foreground">
              {rt("roles.readyMade.title")}
            </h2>
            <p className="text-sm text-muted-foreground">{rt("roles.readyMade.description")}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {catalogue.templates.map((tpl) => {
              const name = rt(`roleTemplates.${tpl.key}.name`);
              const perms = templatePermissions(catalogue, tpl.key);
              const shown = perms.slice(0, READY_MADE_BADGES);
              const inUse = roles.some((r) => r.name.trim().toLowerCase() === name.trim().toLowerCase());
              return (
                <Card key={tpl.key}>
                  <CardContent className="flex h-full flex-col gap-3 p-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{name}</h3>
                        {inUse && (
                          <Badge variant="secondary" className="shrink-0">
                            {rt("roles.readyMade.inUse")}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {rt(`roleTemplates.${tpl.key}.description`)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {shown.map((p) => (
                        <Badge key={p} variant="outline" className="font-normal">
                          {rt(permissionText(p, "label"))}
                        </Badge>
                      ))}
                      {perms.length > shown.length && (
                        <span className="text-xs text-muted-foreground self-center">
                          {rt("roles.readyMade.more", { count: perms.length - shown.length })}
                        </span>
                      )}
                    </div>
                    <div className="mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-foreground"
                        aria-label={rt("roles.readyMade.useLabel", { name })}
                        onClick={() => {
                          setStartTemplate(tpl.key);
                          setEditing("new");
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1.5" />
                        {rt("roles.readyMade.use")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {editing && catalogue && (
        <RoleDialog
          open
          onOpenChange={(open) => !open && setEditing(null)}
          associationId={associationId}
          catalogue={catalogue}
          role={editing === "new" ? null : editing}
          initialTemplate={editing === "new" ? startTemplate : null}
          onSaved={fetchRoles}
        />
      )}

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{rt("roles.deleteTitle", { name: deleting?.name ?? "" })}</AlertDialogTitle>
            <AlertDialogDescription>{rt("roles.deleteDescription")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingBusy}>{tc.cancel}</AlertDialogCancel>
            <AlertDialogAction
              disabled={deletingBusy}
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
            >
              {deletingBusy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {rt("roles.deleteConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  associationId: string;
  catalogue: RoleCatalogue;
  /** null = create a new role. */
  role: RoleDefinition | null;
  /** Ready-made role to pre-fill a new role from (ignored when editing). */
  initialTemplate?: string | null;
  onSaved: () => void;
}

const NO_TEMPLATE = "__none__";
/** Permission badges shown on a ready-made role card before "+N more". */
const READY_MADE_BADGES = 6;

function RoleDialog({ open, onOpenChange, associationId, catalogue, role, initialTemplate, onSaved }: RoleDialogProps) {
  const tc = useT();
  const rt = useRoleT();
  const access = useConsoleAccess();
  const isEdit = !!role;
  // A custom-role admin can only hand out permissions its own role has, and
  // never "Manage roles" itself unless the role already had it (the server
  // refuses anything else); built-in admins may grant every permission.
  const grantable = (key: string) =>
    access.full ||
    (access.permissions.has(key) && (key !== "roles.manage" || !!role?.permissions.includes(key)));
  const start =
    !role && initialTemplate && catalogue.templates.some((tpl) => tpl.key === initialTemplate)
      ? initialTemplate
      : null;
  const [name, setName] = useState(() => role?.name ?? (start ? rt(`roleTemplates.${start}.name`) : ""));
  const [description, setDescription] = useState(
    () => role?.description ?? (start ? rt(`roleTemplates.${start}.description`) : ""),
  );
  const [permissions, setPermissions] = useState<string[]>(
    () => role?.permissions ?? (start ? templatePermissions(catalogue, start).filter(grantable) : []),
  );
  const [template, setTemplate] = useState<string>(start ?? NO_TEMPLATE);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const modules = useMemo(() => groupCatalogue(catalogue), [catalogue]);

  const applyTemplate = (key: string) => {
    setTemplate(key);
    if (key === NO_TEMPLATE) return;
    setPermissions(templatePermissions(catalogue, key).filter(grantable));
    if (!name.trim()) setName(rt(`roleTemplates.${key}.name`));
    if (!description.trim()) setDescription(rt(`roleTemplates.${key}.description`));
    setFormError(null);
  };

  const handleSubmit = async () => {
    const problem = validateRoleForm({ name, permissions });
    if (problem) {
      setFormError(rt(`roles.form.${problem}`));
      return;
    }
    setFormError(null);
    setSaving(true);
    try {
      if (role) {
        await updateRoleDefinition({
          roleId: role.id,
          name: name.trim(),
          description: description.trim(),
          permissions,
        });
        toast({ title: rt("roles.form.updated") });
      } else {
        const res = await createRoleDefinition({
          name: name.trim(),
          description: description.trim() || undefined,
          scopeType: "ASSOCIATION",
          scopeId: associationId,
          permissions,
        });
        if (!res.success) {
          toast({ title: safeServerMessage(res.message, rt("errors.createRole")), variant: "destructive" });
          return;
        }
        toast({ title: rt("roles.form.created") });
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast({ title: graphqlErrorMessage(err, rt(isEdit ? "errors.updateRole" : "errors.createRole")), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? rt("roles.form.editTitle") : rt("roles.form.title")}
          </DialogTitle>
          <DialogDescription>{rt("roles.form.subtitle")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {!isEdit && catalogue.templates.length > 0 && (
            <div className="space-y-1.5">
              <Label htmlFor="role-template">{rt("roles.form.template")}</Label>
              <Select value={template} onValueChange={applyTemplate}>
                <SelectTrigger id="role-template" className="text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_TEMPLATE}>{rt("roles.form.templateNone")}</SelectItem>
                  {catalogue.templates.map((tpl) => (
                    <SelectItem key={tpl.key} value={tpl.key}>
                      {rt(`roleTemplates.${tpl.key}.name`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {template === NO_TEMPLATE
                  ? rt("roles.form.templateHint")
                  : rt(`roleTemplates.${template}.description`)}
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="role-name">{rt("roles.form.name")}</Label>
            <Input
              id="role-name"
              value={name}
              maxLength={100}
              placeholder={rt("roles.form.namePlaceholder")}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role-desc">{rt("roles.form.descriptionLabel")}</Label>
            <Textarea
              id="role-desc"
              rows={2}
              value={description}
              placeholder={rt("roles.form.descriptionPlaceholder")}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline justify-between gap-2">
              <Label>{rt("roles.form.permissions")}</Label>
              <span className="text-xs text-muted-foreground">
                {rt("roles.form.selectedCount", { count: permissions.length })}
              </span>
            </div>
            {!access.full && (
              <p className="text-xs text-muted-foreground">{rt("roles.form.ownPermissionsOnly")}</p>
            )}
            {modules.map((group) => {
              const keys = group.permissions.map((p) => p.key).filter(grantable);
              const allOn = keys.length > 0 && keys.every((k) => permissions.includes(k));
              return (
                <fieldset key={group.module} className="space-y-2 rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <legend className="text-sm font-semibold text-foreground">
                      {rt(`roleModules.${group.module}`)}
                    </legend>
                    {keys.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-foreground"
                        onClick={() => setPermissions(setModulePermissions(catalogue, permissions, group.module, !allOn))}
                      >
                        {allOn ? rt("roles.form.clearModule") : rt("roles.form.selectModule")}
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {group.permissions.map((perm) => {
                      const id = `perm-${perm.key}`;
                      const disabled = !grantable(perm.key);
                      return (
                        <Label
                          key={perm.key}
                          htmlFor={id}
                          className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-background p-2.5 font-normal transition-colors hover:bg-muted/50 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60"
                        >
                          <Checkbox
                            id={id}
                            className="mt-0.5"
                            checked={permissions.includes(perm.key)}
                            disabled={disabled}
                            onCheckedChange={() => {
                              setPermissions(togglePermission(catalogue, permissions, perm.key));
                              setTemplate(NO_TEMPLATE);
                            }}
                          />
                          <span className="space-y-0.5">
                            <span className="block text-sm font-medium text-foreground">
                              {rt(permissionText(perm.key, "label"))}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {rt(permissionText(perm.key, "description"))}
                            </span>
                          </span>
                        </Label>
                      );
                    })}
                  </div>
                </fieldset>
              );
            })}
          </div>

          {formError && (
            <p className="text-sm text-destructive" role="alert">
              {formError}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            {tc.cancel}
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEdit ? rt("roles.form.save") : rt("roles.form.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
