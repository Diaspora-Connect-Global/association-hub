import { useState, useEffect, useCallback } from "react";
import { AuditLog, ActionType, ModuleType, UserType } from "@/types/auditLogs";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Download, 
  Search, 
  Eye,
  CalendarIcon,
  FileText,
  Activity,
  Users,
  RefreshCw,
  TrendingUp
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { AuditLogDetailsModal } from "@/components/auditLogs/AuditLogDetailsModal";
import { AuditLogsAnalyticsWidget } from "@/components/auditLogs/AuditLogsAnalyticsWidget";
import { useT } from "@/hooks/useT";
import { getAuditLogs } from "@/services/graphql/adminAudit/operations";
import type { AdminAuditLogItem } from "@/services/graphql/adminAudit/operations";

function mapApiLog(item: AdminAuditLogItem): AuditLog {
  const actionMap: Record<string, AuditLog["actionType"]> = {
    CREATE: "create", UPDATE: "update", DELETE: "delete", LOGIN: "login",
    LOGOUT: "logout", APPROVE: "approve", REJECT: "reject",
  };
  const moduleMap: Record<string, AuditLog["module"]> = {
    USER: "users", GROUP: "groups", POST: "posts", OPPORTUNITY: "opportunities",
    EVENT: "events", PRODUCT: "marketplace", ORDER: "orders",
    SUPPORT_TICKET: "support_tickets", SETTINGS: "settings",
  };
  const upperAction = item.action.toUpperCase();
  const upperResource = item.resourceType.toUpperCase();
  return {
    id: item.id,
    timestamp: new Date(item.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    userId: item.actorId,
    userName: item.actorId.slice(0, 8) + "...",
    userRole: "association_admin",
    actionType: Object.entries(actionMap).find(([k]) => upperAction.includes(k))?.[1] ?? "update",
    module: moduleMap[upperResource] ?? "settings",
    objectAffected: `${item.resourceType} ${item.resourceId.slice(0, 8)}`,
    objectId: item.resourceId,
    detailsSummary: `${item.action} on ${item.resourceType}`,
    ipAddress: item.ipAddress ?? "—",
    device: "—",
    browser: "—",
  };
}


const actionTypeColors: Record<ActionType, "default" | "secondary" | "outline" | "destructive"> = {
  create: "default",
  update: "secondary",
  delete: "destructive",
  login: "outline",
  logout: "outline",
  upload: "default",
  download: "secondary",
  comment: "outline",
  approve: "default",
  reject: "destructive",
};

const userTypeLabels: Record<UserType, string> = {
  individual: "Individual",
  association_admin: "Admin",
  association_member: "Member",
};

export default function AuditLogs() {
  const t = useT();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all");
  const [actionTypeFilter, setActionTypeFilter] = useState<string>("all");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const result = await getAuditLogs({ limit: 100, offset: 0 });
      setLogs((result.items ?? []).map(mapApiLog));
    } catch {
      setLogs([]);
    } finally {
      setLogsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLogs();
  }, [fetchLogs]);
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  
  // Modals
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.objectAffected.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.detailsSummary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUserType = userTypeFilter === "all" || log.userRole === userTypeFilter;
    const matchesActionType = actionTypeFilter === "all" || log.actionType === actionTypeFilter;
    const matchesModule = moduleFilter === "all" || log.module === moduleFilter;
    return matchesSearch && matchesUserType && matchesActionType && matchesModule;
  });

  const handleSelectAll = (checked: boolean) => {
    setSelectedLogs(checked ? filteredLogs.map((l) => l.id) : []);
  };

  const handleSelectLog = (logId: string, checked: boolean) => {
    setSelectedLogs(
      checked ? [...selectedLogs, logId] : selectedLogs.filter((id) => id !== logId)
    );
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: `Exporting ${selectedLogs.length > 0 ? selectedLogs.length : filteredLogs.length} log entries to CSV.`,
    });
  };

  const handleRefresh = () => {
    void fetchLogs();
  };

  const openDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setDetailsModalOpen(true);
  };

  // Stats
  const totalLogs = logs.length;
  const todayPrefix = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const todayLogs = logs.filter((l) => l.timestamp.startsWith(todayPrefix)).length;
  const uniqueUsers = new Set(logs.map((l) => l.userId)).size;
  const criticalActions = logs.filter((l) => l.actionType === "delete" || l.actionType === "reject").length;

  return (
    <AdminLayout title={t.auditLogsTitle} subtitle={t.auditLogsSubtitle}>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowAnalytics(!showAnalytics)}>
              <TrendingUp className="h-4 w-4 mr-1.5" />
              {showAnalytics ? t.hideAnalyticsButton : t.analyticsButton}
            </Button>
            <Button variant="outline" onClick={handleRefresh} disabled={logsLoading}>
              <RefreshCw className={`h-4 w-4 mr-1.5 ${logsLoading ? "animate-spin" : ""}`} />
              {t.refreshLogsButton}
            </Button>
          </div>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-1.5" />
            {t.exportLogsButton}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                {t.totalLogsLabel}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalLogs}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Activity className="h-4 w-4" />
                {t.todaysActivity}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{todayLogs}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {t.uniqueUsers}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{uniqueUsers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-destructive" />
                {t.criticalActions}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">{criticalActions}</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics */}
        {showAnalytics && <AuditLogsAnalyticsWidget />}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.searchLogsPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t.userTypeFilter} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allUsersLabel}</SelectItem>
              <SelectItem value="individual">{t.individualUser}</SelectItem>
              <SelectItem value="association_admin">{t.admin}</SelectItem>
              <SelectItem value="association_member">{t.member}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={actionTypeFilter} onValueChange={setActionTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={t.actionColumn} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allActionsLabel}</SelectItem>
              <SelectItem value="create">{t.create}</SelectItem>
              <SelectItem value="update">{t.update}</SelectItem>
              <SelectItem value="delete">{t.delete}</SelectItem>
              <SelectItem value="login">{t.login}</SelectItem>
              <SelectItem value="logout">{t.logout}</SelectItem>
              <SelectItem value="upload">Upload</SelectItem>
              <SelectItem value="download">Download</SelectItem>
              <SelectItem value="comment">{t.comments}</SelectItem>
              <SelectItem value="approve">Approve</SelectItem>
              <SelectItem value="reject">{t.reject}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t.moduleColumn} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allModulesLabel}</SelectItem>
              <SelectItem value="users">{t.members}</SelectItem>
              <SelectItem value="groups">{t.groups}</SelectItem>
              <SelectItem value="posts">{t.posts}</SelectItem>
              <SelectItem value="opportunities">{t.opportunities}</SelectItem>
              <SelectItem value="events">{t.events}</SelectItem>
              <SelectItem value="marketplace">{t.marketplace}</SelectItem>
              <SelectItem value="orders">{t.orders}</SelectItem>
              <SelectItem value="support_tickets">{t.supportTickets}</SelectItem>
              <SelectItem value="settings">{t.settings}</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>{t.dateRangeLabel}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Bulk Actions Bar */}
        {selectedLogs.length > 0 && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
            <span className="text-sm text-muted-foreground">
              {selectedLogs.length} {t.logsSelected}
            </span>
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1.5" />
              {t.exportSelectedButton}
            </Button>
          </div>
        )}

        {/* Logs Table */}
        {logsLoading ? (
          <div className="flex items-center justify-center py-16 border border-dashed border-border rounded-lg">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredLogs.length > 0 ? (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedLogs.length === filteredLogs.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>{t.timestampColumn}</TableHead>
                  <TableHead>{t.userColumn}</TableHead>
                  <TableHead>{t.actionColumn}</TableHead>
                  <TableHead>{t.moduleColumn}</TableHead>
                  <TableHead>{t.objectAffectedColumn}</TableHead>
                  <TableHead>{t.ipAddressColumn}</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="cursor-pointer hover:bg-muted/30" onClick={() => openDetails(log)}>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedLogs.includes(log.id)}
                        onCheckedChange={(checked) => handleSelectLog(log.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell className="text-sm font-mono">{log.timestamp}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={log.userPhoto} />
                          <AvatarFallback className="text-[10px]">
                            {log.userName.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{log.userName}</p>
                          <p className="text-xs text-muted-foreground">{userTypeLabels[log.userRole]}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={actionTypeColors[log.actionType]} className="capitalize">
                        {log.actionType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm capitalize">{log.module.replace("_", " ")}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm max-w-[200px] truncate block">{log.objectAffected}</span>
                    </TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground">{log.ipAddress}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDetails(log)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-lg">
            <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No Audit Logs Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Activity within the association will be logged here.
            </p>
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Refresh
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AuditLogDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        log={selectedLog}
      />
    </AdminLayout>
  );
}