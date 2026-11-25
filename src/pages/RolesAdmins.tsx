import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { SectionTabs } from "@/components/layout/SectionTabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useT } from "@/hooks/useT";
import { useAdminAuthStore } from "@/stores/adminAuthStore";
import { useConsoleAccess } from "@/hooks/useConsoleAccess";
import { canManageAdminAccounts, canManageRolesPage } from "@/lib/rolePermissions";
import { RolesTab } from "@/pages/roles/RolesTab";
import { AdminsTab } from "@/pages/roles/AdminsTab";

export default function RolesAdmins() {
  const t = useT();
  const admin = useAdminAuthStore((s) => s.admin);
  const [activeTab, setActiveTab] = useState("roles");

  // Scope is derived strictly from the authenticated admin's own association —
  // never from the UI — so an association admin can only ever manage
  // roles/admins within their own association.
  const associationId =
    admin?.scopeType === "ASSOCIATION" ? admin.scopeId ?? "" : "";

  // Built-in admins: the manage-roles permission, as before. A custom role:
  // "Manage roles" (it then manages roles, not admin accounts).
  const access = useConsoleAccess();
  const canManage = canManageRolesPage(access) && !!associationId;
  const canManageAccounts = canManageAdminAccounts(access);

  if (!canManage) {
    return (
      <AdminLayout title={t.rolesAdminsTitle} subtitle={t.rolesAdminsSubtitle}>
        <SectionTabs section="settings" labelKey="settings" />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <ShieldAlert className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold text-foreground">
              {t.rolesAdminsNoAccessTitle}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              {t.rolesAdminsNoAccessDesc}
            </p>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={t.rolesAdminsTitle} subtitle={t.rolesAdminsSubtitle}>
      <SectionTabs section="settings" labelKey="settings" />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="roles">{t.rolesTabRoles}</TabsTrigger>
          <TabsTrigger value="admins">{t.rolesTabAdmins}</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="mt-4">
          <RolesTab associationId={associationId} />
        </TabsContent>

        <TabsContent value="admins" className="mt-4">
          <AdminsTab associationId={associationId} canManageAccounts={canManageAccounts} />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
