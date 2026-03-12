import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useT } from "@/hooks/useT";
import { getAdminAssociationId } from "@/stores/adminAuthStore";
import { useAssociationAdminStore } from "@/stores/associationAdminStore";
import {
  getMemberReports,
  resolveReport,
  type MemberReportType,
  type ReportResolution,
  type ReportStatus,
} from "@/services/graphql/association";

const resolutionOptions: ReportResolution[] = ["WARNING_ISSUED", "MEMBER_REMOVED", "NO_ACTION"];

export default function Tickets() {
  const t = useT();
  const associationId = useMemo(() => getAdminAssociationId(), []);
  const setPendingReportsCount = useAssociationAdminStore((state) => state.setPendingReportsCount);

  const [statusFilter, setStatusFilter] = useState<ReportStatus>("PENDING");
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<MemberReportType[]>([]);
  const [total, setTotal] = useState(0);
  const [busyReportId, setBusyReportId] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    if (!associationId) return;
    setLoading(true);
    try {
      const [visibleReports, pendingReports] = await Promise.all([
        getMemberReports({ entityId: associationId, entityType: "ASSOCIATION", page: 1, limit: 50, status: statusFilter }),
        getMemberReports({ entityId: associationId, entityType: "ASSOCIATION", page: 1, limit: 1, status: "PENDING" }),
      ]);
      setReports(visibleReports.reports);
      setTotal(visibleReports.total ?? 0);
      setPendingReportsCount(pendingReports.total ?? 0);
    } catch (err) {
      toast({
        title: "Reports load failed",
        description: err instanceof Error ? err.message : "Unable to load reports.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [associationId, setPendingReportsCount, statusFilter]);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  const handleResolve = async (reportId: string, resolution: ReportResolution) => {
    setBusyReportId(reportId);
    try {
      const result = await resolveReport({ reportId, resolution, notes: `Resolved via admin panel: ${resolution}` });
      if (!result.success) {
        throw new Error(result.message ?? "Resolve failed");
      }
      toast({ title: "Report resolved", description: result.message ?? reportId });
      await loadReports();
    } catch (err) {
      toast({
        title: "Resolution failed",
        description: err instanceof Error ? err.message : "Unable to resolve report.",
        variant: "destructive",
      });
    } finally {
      setBusyReportId(null);
    }
  };

  return (
    <AdminLayout title={t.ticketsTitle} subtitle={`Moderation reports: ${total}`}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Select value={statusFilter} onValueChange={(value: ReportStatus) => setStatusFilter(value)}>
            <SelectTrigger className="w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending reports</SelectItem>
              <SelectItem value="RESOLVED">Resolved reports</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => void loadReports()} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Reported user</TableHead>
                  <TableHead>Reported by</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No reports found.
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.id}</TableCell>
                      <TableCell>{report.reportedUserId}</TableCell>
                      <TableCell>{report.reportedBy}</TableCell>
                      <TableCell>
                        <div className="max-w-[240px]">
                          <p>{report.reason}</p>
                          {report.details && <p className="text-xs text-muted-foreground">{report.details}</p>}
                        </div>
                      </TableCell>
                      <TableCell>{report.status}</TableCell>
                      <TableCell>{new Date(report.createdAt).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        {report.status === "PENDING" ? (
                          <div className="flex justify-end gap-2">
                            {resolutionOptions.map((resolution) => (
                              <Button
                                key={resolution}
                                variant="outline"
                                size="sm"
                                disabled={busyReportId === report.id}
                                onClick={() => void handleResolve(report.id, resolution)}
                              >
                                {resolution.replace(/_/g, " ")}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Resolved</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}