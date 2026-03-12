import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw, UsersRound } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useT } from "@/hooks/useT";
import { getAdminAssociationId } from "@/stores/adminAuthStore";
import { useAssociationAdminStore } from "@/stores/associationAdminStore";
import { getAssociation, getGroup, getGroupMembers, type GroupMemberType, type GroupType } from "@/services/graphql/association";

export default function Groups() {
  const t = useT();
  const associationId = useMemo(() => getAdminAssociationId(), []);
  const setAssociation = useAssociationAdminStore((state) => state.setAssociation);

  const [loading, setLoading] = useState(false);
  const [defaultGroup, setDefaultGroup] = useState<GroupType | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMemberType[]>([]);

  const loadDefaultGroup = useCallback(async () => {
    if (!associationId) return;
    setLoading(true);

    try {
      const association = await getAssociation(associationId);
      setAssociation(association);

      if (!association.defaultGroupId) {
        setDefaultGroup(null);
        setGroupMembers([]);
        return;
      }

      const [group, members] = await Promise.all([
        getGroup(association.defaultGroupId),
        getGroupMembers({ groupId: association.defaultGroupId, page: 1, limit: 50 }),
      ]);

      setDefaultGroup(group);
      setGroupMembers(members.members);
    } catch (err) {
      toast({
        title: "Group load failed",
        description: err instanceof Error ? err.message : "Unable to load default group.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [associationId, setAssociation]);

  useEffect(() => {
    void loadDefaultGroup();
  }, [loadDefaultGroup]);

  return (
    <AdminLayout title={t.groupsTitle} subtitle="Default group (read-only)">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => void loadDefaultGroup()} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Default group</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
            <p><span className="font-medium text-foreground">Name:</span> {defaultGroup?.name ?? "—"}</p>
            <p><span className="font-medium text-foreground">Privacy:</span> {defaultGroup?.privacy ?? "—"}</p>
            <p><span className="font-medium text-foreground">Member count:</span> {defaultGroup?.memberCount ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Group members</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No members found.
                    </TableCell>
                  </TableRow>
                ) : (
                  groupMembers.map((member) => (
                    <TableRow key={member.userId}>
                      <TableCell>{member.userId}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.status}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
          Group membership is synchronized automatically by the backend when association membership changes.
          This view is read-only by design.
        </div>

        {!defaultGroup && (
          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <UsersRound className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No default group available</h3>
            <p className="text-muted-foreground">This association does not currently expose a default group.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
