import { useMemo, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Download,
  Search,
  Users,
  FileText,
  Briefcase,
  Calendar as CalendarLucide,
  ShoppingBag,
  ShoppingCart,
  HelpCircle,
  RefreshCw,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useT } from "@/hooks/useT";
import { getAdminAssociationId } from "@/stores/adminAuthStore";
import { useGetAssociationAnalytics } from "@/hooks/adminProfile";

// ── Period mapping ────────────────────────────────────────────────────────────

const PERIOD_OPTIONS = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "1y", label: "Last year" },
] as const;

// ── Skeleton card ─────────────────────────────────────────────────────────────

function MetricSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-28" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16" />
      </CardContent>
    </Card>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Analytics() {
  const t = useT();
  const associationId = useMemo(() => getAdminAssociationId(), []);

  const [period, setPeriod] = useState<string>("30d");
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { analytics, loading, error, refetch } = useGetAssociationAnalytics(
    associationId,
    period
  );

  const handleExport = () => {
    toast({
      title: t.exportReportButton,
      description: "Analytics report is being generated and will download shortly.",
    });
  };

  const handleRefresh = () => {
    void refetch();
    toast({
      title: t.refreshButton,
      description: "Analytics data has been updated.",
    });
  };

  const metricsConfig = [
    {
      key: "users",
      title: t.totalUsersLabel,
      icon: Users,
      value: analytics?.totalMembers ?? 0,
      sub: analytics ? `+${analytics.newMembersThisPeriod} this period` : undefined,
    },
    {
      key: "posts",
      title: t.activePostsLabel,
      icon: FileText,
      value: analytics?.totalPosts ?? 0,
      sub: analytics ? `+${analytics.newPostsThisPeriod} this period` : undefined,
    },
    {
      key: "opportunities",
      title: t.opportunities,
      icon: Briefcase,
      value: analytics?.activeOpportunities ?? 0,
    },
    {
      key: "events",
      title: t.eventsCreated,
      icon: CalendarLucide,
      value: analytics?.totalEvents ?? 0,
    },
    {
      key: "revenue",
      title: "Total Revenue",
      icon: DollarSign,
      value: analytics?.totalRevenue ?? 0,
      format: (v: number) =>
        v.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
    },
    {
      key: "products",
      title: t.productsServices,
      icon: ShoppingBag,
      value: 0,
    },
    {
      key: "orders",
      title: t.ordersCompleted,
      icon: ShoppingCart,
      value: 0,
    },
    {
      key: "tickets",
      title: t.supportTicketsLabel,
      icon: HelpCircle,
      value: 0,
    },
  ];

  return (
    <AdminLayout title={t.analyticsTitle} subtitle={t.analyticsSubtitle}>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Period selector */}
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERIOD_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
              {t.refreshButton}
            </Button>
          </div>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-1.5" />
            {t.exportReportButton}
          </Button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Could not load analytics: {error}</span>
          </div>
        )}

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <MetricSkeleton key={i} />)
            : metricsConfig.map((metric) => (
                <Card key={metric.key}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      <metric.icon className="h-4 w-4" />
                      {metric.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {metric.format
                        ? metric.format(metric.value)
                        : metric.value.toLocaleString()}
                    </p>
                    {metric.sub && (
                      <p className="text-xs text-muted-foreground mt-0.5">{metric.sub}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">{t.overviewTab}</TabsTrigger>
            <TabsTrigger value="users">{t.usersTab}</TabsTrigger>
            <TabsTrigger value="content">{t.contentTab}</TabsTrigger>
            <TabsTrigger value="commerce">{t.commerceTab}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Member growth */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t.userGrowthOverTime}</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-[250px] w-full" />
                  ) : analytics?.memberGrowthData && analytics.memberGrowthData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={analytics.memberGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name="Members"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[250px] text-sm text-muted-foreground">
                      No growth data available for this period
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Activity data */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Activity Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-[250px] w-full" />
                  ) : analytics?.activityData && analytics.activityData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={analytics.activityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Activity" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[250px] text-sm text-muted-foreground">
                      No activity data available for this period
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t.opportunitiesByStatus}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[250px] text-sm text-muted-foreground">
                  Historical data not yet available
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t.eventsParticipation}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[250px] text-sm text-muted-foreground">
                  Historical data not yet available
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.userGrowthOverTime}</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[350px] w-full" />
                ) : analytics?.memberGrowthData && analytics.memberGrowthData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={analytics.memberGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Members"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[350px] text-sm text-muted-foreground">
                    No growth data available for this period
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t.postsByCategory}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
                  Historical data not yet available
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Support Tickets by Status</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
                  Historical data not yet available
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="commerce" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Orders by Category &amp; Status</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[350px] text-sm text-muted-foreground">
                Historical data not yet available
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Filters for Table */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user, post, order..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              <SelectItem value="users">Users</SelectItem>
              <SelectItem value="posts">Posts</SelectItem>
              <SelectItem value="opportunities">Opportunities</SelectItem>
              <SelectItem value="events">Events</SelectItem>
              <SelectItem value="marketplace">Marketplace</SelectItem>
              <SelectItem value="orders">Orders</SelectItem>
              <SelectItem value="groups">Groups</SelectItem>
              <SelectItem value="tickets">Support Tickets</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Detailed Analytics Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Detailed Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Date</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Item / Object</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 8 }).map((__, j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
