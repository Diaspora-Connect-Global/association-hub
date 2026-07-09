import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useT } from "@/hooks/useT";
import { useAdminAuthStore, decodeAdminJwt } from "@/stores/adminAuthStore";
import {
  getAdminPermissions,
  hasPermission,
  MANAGE_ROLES_PERMISSION,
} from "@/lib/adminAccess";
import { RolesTab } from "@/pages/roles/RolesTab";
import { AdminsTab } from "@/pages/roles/AdminsTab";

export default function RolesAdmins() {
  const t = useT();
  const admin = useAdminAuthStore((s) => s.admin);
  const accessToken = useAdminAuthStore((s) => s.accessToken);
  const [activeTab, setActiveTab] = useState("roles");

  const jwt = decodeAdminJwt(accessToken);

  // Scope is derived strictly from the authenticated admin's own association —
  // never from the UI — so an association admin can only ever manage
  // roles/admins within their own association.
  const associationId =
    admin?.scopeType === "ASSOCIATION" ? admin.scopeId ?? "" : "";

  const permissions = getAdminPermissions(admin, jwt);
  const canManage =
    hasPermission(permissions, MANAGE_ROLES_PERMISSION) && !!associationId;

  if (!canManage) {
    return (
      <AdminLayout title={t.rolesAdminsTitle} subtitle={t.rolesAdminsSubtitle}>
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
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="roles">{t.rolesTabRoles}</TabsTrigger>
          <TabsTrigger value="admins">{t.rolesTabAdmins}</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="mt-4">
          <RolesTab associationId={associationId} />
        </TabsContent>

        <TabsContent value="admins" className="mt-4">
          <AdminsTab associationId={associationId} />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
