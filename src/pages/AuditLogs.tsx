import { useState } from "react";
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

// Mock data
const mockLogs: AuditLog[] = [
  {
    id: "log-001",
    timestamp: "Dec 5, 2024 14:32:15",
    userId: "u1",
    userName: "John Doe",
    userRole: "association_admin",
    actionType: "create",
    module: "posts",
    objectAffected: "New Announcement Post",
    objectId: "post-123",
    detailsSummary: "Created a new announcement post for upcoming event",
    ipAddress: "192.168.1.45",
    device: "MacBook Pro",
    browser: "Chrome 120.0",
    changesMade: "Created post with title 'Upcoming Annual Meeting'",
  },
  {
    id: "log-002",
    timestamp: "Dec 5, 2024 13:15:42",
    userId: "u2",
    userName: "Jane Smith",
    userRole: "association_member",
    actionType: "update",
    module: "users",
    objectAffected: "Profile Settings",
    objectId: "user-456",
    detailsSummary: "Updated profile information",
    ipAddress: "10.0.0.12",
    device: "iPhone 15",
    browser: "Safari 17.0",
    previousValue: "Email: jane@old.com",
    newValue: "Email: jane@new.com",
  },
  {
    id: "log-003",
    timestamp: "Dec 5, 2024 11:45:00",
    userId: "u3",
    userName: "Mike Johnson",
    userRole: "association_admin",
    actionType: "delete",
    module: "groups",
    objectAffected: "Inactive Group",
    objectId: "grp-789",
    detailsSummary: "Deleted inactive group with no members",
    ipAddress: "172.16.0.100",
    device: "Windows PC",
    browser: "Edge 119.0",
  },
  {
    id: "log-004",
    timestamp: "Dec 5, 2024 10:20:33",
    userId: "u4",
    userName: "Sarah Williams",
    userRole: "individual",
    actionType: "login",
    module: "users",
    objectAffected: "User Session",
    detailsSummary: "Logged in successfully",
    ipAddress: "203.45.67.89",
    device: "Android Phone",
    browser: "Chrome Mobile 120.0",
  },
  {
    id: "log-005",
    timestamp: "Dec 4, 2024 16:45:12",
    userId: "u1",
    userName: "John Doe",
    userRole: "association_admin",
    actionType: "approve",
    module: "opportunities",
    objectAffected: "Job Posting Application",
    objectId: "app-321",
    detailsSummary: "Approved application for Software Developer position",
    ipAddress: "192.168.1.45",
    device: "MacBook Pro",
    browser: "Chrome 120.0",
  },
  {
    id: "log-006",
    timestamp: "Dec 4, 2024 14:30:00",
    userId: "u5",
    userName: "Alex Turner",
    userRole: "association_member",
    actionType: "upload",
    module: "posts",
    objectAffected: "Event Banner Image",
    objectId: "img-654",
    detailsSummary: "Uploaded new banner image for holiday event",
    ipAddress: "10.0.0.55",
    device: "iPad Pro",
    browser: "Safari 17.0",
  },
  {
    id: "log-007",
    timestamp: "Dec 4, 2024 12:15:45",
    userId: "u2",
    userName: "Jane Smith",
    userRole: "association_member",
    actionType: "comment",
    module: "posts",
    objectAffected: "Community Discussion",
    objectId: "post-987",
    detailsSummary: "Added comment to community discussion thread",
    ipAddress: "10.0.0.12",
    device: "iPhone 15",
    browser: "Safari 17.0",
  },
  {
    id: "log-008",
    timestamp: "Dec 4, 2024 09:00:00",
    userId: "u3",
    userName: "Mike Johnson",
    userRole: "association_admin",
    actionType: "reject",
    module: "support_tickets",
    objectAffected: "Refund Request",
    objectId: "tkt-555",
    detailsSummary: "Rejected refund request due to policy violation",
    ipAddress: "172.16.0.100",
    device: "Windows PC",
    browser: "Edge 119.0",
  },
];

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
  const [logs] = useState<AuditLog[]>(mockLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all");
  const [actionTypeFilter, setActionTypeFilter] = useState<string>("all");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
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
    toast({
      title: "Logs Refreshed",
      description: "Audit logs have been refreshed.",
    });
  };

  const openDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setDetailsModalOpen(true);
  };

  // Stats
  const totalLogs = logs.length;
  const todayLogs = logs.filter((l) => l.timestamp.includes("Dec 5")).length;
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
              {showAnalytics ? "Hide Analytics" : "Analytics"}
            </Button>
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Refresh
            </Button>
          </div>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-1.5" />
            Export Logs
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                Total Logs
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
                Today's Activity
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
                Unique Users
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
                Critical Actions
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
              placeholder="Search logs by user, action, or object"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="User Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="association_admin">Admin</SelectItem>
              <SelectItem value="association_member">Member</SelectItem>
            </SelectContent>
          </Select>

          <Select value={actionTypeFilter} onValueChange={setActionTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="create">Create</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="delete">Delete</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="logout">Logout</SelectItem>
              <SelectItem value="upload">Upload</SelectItem>
              <SelectItem value="download">Download</SelectItem>
              <SelectItem value="comment">Comment</SelectItem>
              <SelectItem value="approve">Approve</SelectItem>
              <SelectItem value="reject">Reject</SelectItem>
            </SelectContent>
          </Select>

          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              <SelectItem value="users">Users</SelectItem>
              <SelectItem value="groups">Groups</SelectItem>
              <SelectItem value="posts">Posts</SelectItem>
              <SelectItem value="opportunities">Opportunities</SelectItem>
              <SelectItem value="events">Events</SelectItem>
              <SelectItem value="marketplace">Marketplace</SelectItem>
              <SelectItem value="orders">Orders</SelectItem>
              <SelectItem value="support_tickets">Support Tickets</SelectItem>
              <SelectItem value="settings">Settings</SelectItem>
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
                  <span>Date Range</span>
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
              {selectedLogs.length} log(s) selected
            </span>
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1.5" />
              Export Selected
            </Button>
          </div>
        )}

        {/* Logs Table */}
        {filteredLogs.length > 0 ? (
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
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Object Affected</TableHead>
                  <TableHead>IP Address</TableHead>
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