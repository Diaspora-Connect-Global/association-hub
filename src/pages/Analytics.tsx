import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
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
  Eye,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useT } from "@/hooks/useT";

// Mock data for charts
const userGrowthData = [
  { month: "Jan", users: 120 },
  { month: "Feb", users: 145 },
  { month: "Mar", users: 178 },
  { month: "Apr", users: 210 },
  { month: "May", users: 265 },
  { month: "Jun", users: 320 },
];

const postsByCategoryData = [
  { category: "Announcements", count: 45 },
  { category: "News", count: 32 },
  { category: "Events", count: 28 },
  { category: "Resources", count: 22 },
  { category: "Discussions", count: 38 },
];

const opportunitiesStatusData = [
  { name: "Open", value: 35, color: "hsl(var(--primary))" },
  { name: "In Progress", value: 25, color: "hsl(var(--secondary))" },
  { name: "Filled", value: 45, color: "hsl(142, 76%, 36%)" },
  { name: "Closed", value: 15, color: "hsl(var(--muted-foreground))" },
];

const ordersData = [
  { category: "Products", pending: 12, completed: 45, cancelled: 5 },
  { category: "Services", pending: 8, completed: 32, cancelled: 3 },
  { category: "Events", pending: 15, completed: 78, cancelled: 8 },
  { category: "Courses", pending: 6, completed: 28, cancelled: 2 },
];

const eventsParticipationData = [
  { month: "Jan", participants: 85 },
  { month: "Feb", participants: 120 },
  { month: "Mar", participants: 95 },
  { month: "Apr", participants: 165 },
  { month: "May", participants: 210 },
  { month: "Jun", participants: 280 },
];

const ticketsByStatusData = [
  { status: "Open", count: 15 },
  { status: "In Progress", count: 25 },
  { status: "Resolved", count: 45 },
  { status: "Closed", count: 35 },
];

const detailedAnalyticsData = [
  { date: "Dec 5, 2024", module: "Posts", item: "Annual Report 2024", category: "Announcement", action: "Published", user: "John Doe", value: 1 },
  { date: "Dec 5, 2024", module: "Events", item: "Holiday Networking", category: "Social", action: "Created", user: "Jane Smith", value: 1 },
  { date: "Dec 4, 2024", module: "Orders", item: "Premium Membership", category: "Services", action: "Completed", user: "Mike Johnson", value: 150 },
  { date: "Dec 4, 2024", module: "Opportunities", item: "Software Engineer", category: "Jobs", action: "Filled", user: "Sarah Williams", value: 1 },
  { date: "Dec 3, 2024", module: "Groups", item: "Tech Enthusiasts", category: "Community", action: "Created", user: "Alex Turner", value: 1 },
];

const metricsConfig = [
  { key: "users", title: "Total Users", icon: Users, value: 1247, change: 12.5, changeType: "increase" },
  { key: "posts", title: "Active Posts", icon: FileText, value: 324, change: 8.2, changeType: "increase" },
  { key: "opportunities", title: "Opportunities", icon: Briefcase, value: 89, change: -2.4, changeType: "decrease" },
  { key: "events", title: "Events Created", icon: CalendarLucide, value: 56, change: 15.8, changeType: "increase" },
  { key: "products", title: "Products/Services", icon: ShoppingBag, value: 178, change: 5.3, changeType: "increase" },
  { key: "orders", title: "Orders Completed", icon: ShoppingCart, value: 432, change: 22.1, changeType: "increase" },
  { key: "groups", title: "Active Groups", icon: Users, value: 28, change: 3.6, changeType: "increase" },
  { key: "tickets", title: "Support Tickets", icon: HelpCircle, value: 67, change: -8.5, changeType: "decrease" },
];

export default function Analytics() {
  const t = useT();
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState("month");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Analytics report is being generated and will download shortly.",
    });
  };

  const handleRefresh = () => {
    toast({
      title: "Data Refreshed",
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
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
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
              Refresh
            </Button>
          </div>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-1.5" />
            Export Report
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
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold">{metric.value.toLocaleString()}</p>
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    metric.changeType === "increase" ? "text-green-600" : "text-destructive"
                  )}>
                    {metric.changeType === "increase" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(metric.change)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="commerce">Commerce</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* User Growth */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">User Growth Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                      <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Opportunities by Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Opportunities by Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={opportunitiesStatusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                      >
                        {opportunitiesStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Posts by Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Posts by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={postsByCategoryData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="category" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                      <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Events Participation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Events Participation Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={eventsParticipationData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                      <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Line type="monotone" dataKey="participants" stroke="hsl(142, 76%, 36%)" strokeWidth={2} dot={{ fill: "hsl(142, 76%, 36%)" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">User Growth Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                    <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} name="Total Users" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Posts by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={postsByCategoryData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                      <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} width={100} className="text-muted-foreground" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Support Tickets by Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ticketsByStatusData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="status" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                      <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="commerce" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Orders by Category & Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={ordersData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                    <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="pending" stackId="a" fill="hsl(45, 93%, 47%)" name="Pending" />
                    <Bar dataKey="completed" stackId="a" fill="hsl(142, 76%, 36%)" name="Completed" />
                    <Bar dataKey="cancelled" stackId="a" fill="hsl(var(--destructive))" name="Cancelled" />
                  </BarChart>
                </ResponsiveContainer>
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
                  {detailedAnalyticsData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-sm">{row.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{row.module}</Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium">{row.item}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{row.category}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{row.action}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{row.user}</TableCell>
                      <TableCell className="text-sm font-medium">{row.value}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}