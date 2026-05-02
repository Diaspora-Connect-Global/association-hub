import { useState, useEffect, useMemo } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Search,
  CalendarIcon,
  Users,
  FileText,
  Briefcase,
  Calendar as CalendarLucide,
  ShoppingBag,
  ShoppingCart,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useT } from "@/hooks/useT";
import { getAdminAssociationId } from "@/stores/adminAuthStore";
import { getAssociationStats } from "@/services/graphql/association/operations";

const getMetricsConfig = (t: ReturnType<typeof useT>, totalMembers: number) => [
  { key: "users", title: t.totalUsersLabel, icon: Users, value: totalMembers },
  { key: "posts", title: t.activePostsLabel, icon: FileText, value: 0 },
  { key: "opportunities", title: t.opportunities, icon: Briefcase, value: 0 },
  { key: "events", title: t.eventsCreated, icon: CalendarLucide, value: 0 },
  { key: "products", title: t.productsServices, icon: ShoppingBag, value: 0 },
  { key: "orders", title: t.ordersCompleted, icon: ShoppingCart, value: 0 },
  { key: "groups", title: t.activeGroupsLabel, icon: Users, value: 0 },
  { key: "tickets", title: t.supportTicketsLabel, icon: HelpCircle, value: 0 },
];

export default function Analytics() {
  const t = useT();
  const associationId = useMemo(() => getAdminAssociationId(), []);
  const [stats, setStats] = useState<{ totalMembers: number; activeMembers: number; pendingRequests: number } | null>(null);

  useEffect(() => {
    if (!associationId) return;
    void getAssociationStats(associationId).then(setStats).catch(() => {/* keep null */});
  }, [associationId]);

  const metricsConfig = getMetricsConfig(t, stats?.totalMembers ?? 0);
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState("month");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const handleExport = () => {
    toast({
      title: t.exportReportButton,
      description: "Analytics report is being generated and will download shortly.",
    });
  };

  const handleRefresh = () => {
    toast({
      title: t.refreshButton,
      description: "Analytics data has been updated.",
    });
  };

  return (
    <AdminLayout title={t.analyticsTitle} subtitle={t.analyticsSubtitle}>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">{t.today}</SelectItem>
                <SelectItem value="week">{t.thisWeek}</SelectItem>
                <SelectItem value="month">{t.thisMonth}</SelectItem>
                <SelectItem value="quarter">{t.thisQuarter}</SelectItem>
                <SelectItem value="year">{t.thisYear}</SelectItem>
                <SelectItem value="custom">{t.customRange}</SelectItem>
              </SelectContent>
            </Select>
            {dateRangeFilter === "custom" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="h-4 w-4 mr-1.5" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      "Pick dates"
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
            )}
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-1.5" />
              {t.refreshButton}
            </Button>
          </div>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-1.5" />
            {t.exportReportButton}
          </Button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metricsConfig.map((metric) => (
            <Card key={metric.key}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <metric.icon className="h-4 w-4" />
                  {metric.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{metric.value.toLocaleString()}</p>
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t.userGrowthOverTime}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[250px] text-sm text-muted-foreground">
                  Historical data not yet available
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
                  <CardTitle className="text-base">{t.postsByCategory}</CardTitle>
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
              <CardContent className="flex items-center justify-center h-[350px] text-sm text-muted-foreground">
                Historical data not yet available
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
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                      No data available
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}