import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { EngagementChart } from "@/components/dashboard/EngagementChart";
import { JoinMembershipSection } from "@/components/JoinMembershipSection";
import { Users, UserCheck, Clock3, RefreshCw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useT } from "@/hooks/useT";
import { toast } from "@/hooks/use-toast";
import { getAdminAssociationId } from "@/stores/adminAuthStore";
import { useShallow } from "zustand/react/shallow";
import { useAssociationAdminStore } from "@/stores/associationAdminStore";
import { useGetAssociationAnalytics } from "@/hooks/adminProfile";
import {
  getAssociation,
  getAssociationStats,
  getMemberReports,
  getPendingMembershipRequests,
} from "@/services/graphql/association";
import { graphqlErrorMessage } from "@/lib/graphqlErrors";

export default function Dashboard() {
  const t = useT();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { association, stats, setAssociation, setStats, setPendingRequestsCount, setPendingReportsCount } =
    // zustand v5: an object selector must be wrapped in useShallow, or every render
    // returns a new object and React re-renders forever (error #185, blank page).
    useAssociationAdminStore(
      useShallow((state) => ({
        association: state.association,
        stats: state.stats,
        setAssociation: state.setAssociation,
        setStats: state.setStats,
        setPendingRequestsCount: state.setPendingRequestsCount,
        setPendingReportsCount: state.setPendingReportsCount,
      })),
    );

  const associationId = useMemo(() => getAdminAssociationId(), []);
  // Real member growth for the trend chart (same query + cache as the Analytics page).
  const { analytics: trend, loading: trendLoading } = useGetAssociationAnalytics(associationId, "30d");

  const loadDashboard = useCallback(async () => {
    if (!associationId) {
      setError("Association scope is missing. Please sign in again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [associationData, statsData, pendingRequests, pendingReports] = await Promise.all([
        getAssociation(associationId),
        getAssociationStats(associationId),
        getPendingMembershipRequests({ entityId: associationId, entityType: "ASSOCIATION", offset: 0, limit: 1 }),
        getMemberReports({ entityId: associationId, entityType: "ASSOCIATION", page: 1, limit: 1, status: "PENDING" }),
      ]);

      setAssociation(associationData);
      setStats(statsData);
      setPendingRequestsCount(pendingRequests.total ?? statsData.pendingRequests ?? 0);
      setPendingReportsCount(pendingReports.total ?? 0);
    } catch (err) {
      const message = graphqlErrorMessage(err, "Failed to load association dashboard.");
      setError(message);
      toast({ title: "Dashboard load failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [associationId, setAssociation, setPendingReportsCount, setPendingRequestsCount, setStats]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return (
    <AdminLayout title={t.dashboard} subtitle={association?.name ?? "Association overview"}>
      <div className="mb-6 flex items-center justify-end">
        <Button variant="outline" className="gap-2" onClick={() => void loadDashboard()} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {t.refresh}
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Unable to load dashboard</CardTitle>
          </CardHeader>
          <CardContent>{error}</CardContent>
        </Card>
      )}

      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={t.totalMembers} value={stats?.totalMembers ?? "—"} icon={Users} />
        <MetricCard label={t.activeMembers} value={stats?.activeMembers ?? "—"} icon={UserCheck} />
        <MetricCard label="Pending requests" value={stats?.pendingRequests ?? "—"} icon={Clock3} />
        <MetricCard
          label="Join policy"
          value={association?.joinPolicy ? association.joinPolicy.replace("_", " ") : "—"}
          icon={ShieldAlert}
        />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Association profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p><span className="font-medium text-foreground">Name:</span> {association?.name ?? "—"}</p>
            <p><span className="font-medium text-foreground">Visibility:</span> {association?.visibility ?? "—"}</p>
            <p><span className="font-medium text-foreground">Description:</span> {association?.description ?? "—"}</p>
            <p><span className="font-medium text-foreground">Default group:</span> {association?.defaultGroupId ?? "—"}</p>
          </CardContent>
        </Card>
        <EngagementChart points={trend?.memberGrowthData} loading={trendLoading} />
      </div>

      {associationId && (
        <div className="mb-8">
          <JoinMembershipSection
            entityId={associationId}
            entityType="ASSOCIATION"
            entityName={association?.name ?? "this association"}
          />
        </div>
      )}

      <ActivityFeed />
    </AdminLayout>
  );
}
