import { useState } from "react";
import { Ticket, TicketStatus, TicketPriority, TicketCategory, TicketFormData } from "@/types/tickets";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  PlusCircle, 
  Download, 
  Search, 
  MoreHorizontal,
  Eye,
  UserCog,
  Edit,
  MessageCircle,
  CheckCircle,
  CalendarIcon,
  Ticket as TicketIcon,
  Clock,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { CreateTicketModal } from "@/components/tickets/CreateTicketModal";
import { TicketDetailsModal } from "@/components/tickets/TicketDetailsModal";
import { AssignTicketModal } from "@/components/tickets/AssignTicketModal";
import { StatusModal } from "@/components/tickets/StatusModal";
import { CloseTicketModal } from "@/components/tickets/CloseTicketModal";
import { TicketsAnalyticsWidget } from "@/components/tickets/TicketsAnalyticsWidget";
import { useT } from "@/hooks/useT";

// Mock data
const mockTickets: Ticket[] = [
  {
    id: "TKT-001",
    userId: "u1",
    userName: "John Doe",
    userEmail: "john@example.com",
    category: "technical",
    priority: "high",
    status: "open",
    subject: "Cannot access dashboard",
    description: "I'm unable to access my dashboard after logging in. The page keeps loading indefinitely.",
    assignedTo: "admin1",
    assignedToName: "Support Admin",
    createdAt: "Dec 1, 2024",
    updatedAt: "Dec 2, 2024",
  },
  {
    id: "TKT-002",
    userId: "u2",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    category: "billing",
    priority: "urgent",
    status: "in_progress",
    subject: "Incorrect charge on my account",
    description: "I was charged twice for my subscription this month. Please refund the extra charge.",
    assignedTo: "admin2",
    assignedToName: "Jane Manager",
    createdAt: "Dec 2, 2024",
    updatedAt: "Dec 3, 2024",
  },
  {
    id: "TKT-003",
    userId: "u3",
    userName: "Mike Johnson",
    userEmail: "mike@example.com",
    category: "product_inquiry",
    priority: "medium",
    status: "resolved",
    subject: "Feature request: Dark mode",
    description: "Would love to see a dark mode option in the application.",
    createdAt: "Nov 28, 2024",
    updatedAt: "Dec 1, 2024",
  },
  {
    id: "TKT-004",
    userId: "u4",
    userName: "Sarah Williams",
    userEmail: "sarah@example.com",
    category: "general",
    priority: "low",
    status: "closed",
    subject: "General inquiry about services",
    description: "I'd like to know more about your enterprise plans.",
    closedAt: "Nov 30, 2024",
    createdAt: "Nov 25, 2024",
    updatedAt: "Nov 30, 2024",
  },
];

const statusColors: Record<TicketStatus, "default" | "secondary" | "outline" | "destructive"> = {
  open: "destructive",
  in_progress: "default",
  resolved: "secondary",
  closed: "outline",
};

const priorityColors: Record<TicketPriority, "default" | "secondary" | "outline" | "destructive"> = {
  low: "outline",
  medium: "secondary",
  high: "default",
  urgent: "destructive",
};

export default function Tickets() {
  const t = useT();
  const [tickets] = useState<Ticket[]>(mockTickets);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [assignedFilter, setAssignedFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  
  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter;
    const matchesAssigned = assignedFilter === "all" || ticket.assignedTo === assignedFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesAssigned;
  });

  const handleSelectAll = (checked: boolean) => {
    setSelectedTickets(checked ? filteredTickets.map((t) => t.id) : []);
  };

  const handleSelectTicket = (ticketId: string, checked: boolean) => {
    setSelectedTickets(
      checked ? [...selectedTickets, ticketId] : selectedTickets.filter((id) => id !== ticketId)
    );
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Tickets are being exported to CSV.",
    });
  };

  const handleCreateTicket = (data: TicketFormData) => {
    console.log("Creating ticket:", data);
  };

  const openDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDetailsModalOpen(true);
  };

  const openAssign = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setAssignModalOpen(true);
  };

  const openStatusChange = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setStatusModalOpen(true);
  };

  const openCloseTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setCloseModalOpen(true);
  };

  // Stats
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === "open").length;
  const inProgressTickets = tickets.filter((t) => t.status === "in_progress").length;
  const resolvedTickets = tickets.filter((t) => t.status === "resolved").length;

  return (
    <AdminLayout title={t.ticketsTitle} subtitle={t.ticketsSubtitle}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Support Tickets</h1>
            <p className="text-sm text-muted-foreground">
              Manage and respond to support requests from users.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowAnalytics(!showAnalytics)}>
              <TrendingUp className="h-4 w-4 mr-1.5" />
              {showAnalytics ? "Hide Analytics" : "Analytics"}
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1.5" />
              Export
            </Button>
            <Button onClick={() => setCreateModalOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Create Ticket
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <TicketIcon className="h-4 w-4" />
                Total Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalTickets}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-destructive" />
                Open
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">{openTickets}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{inProgressTickets}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Resolved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-500">{resolvedTickets}</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics */}
        {showAnalytics && <TicketsAnalyticsWidget />}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, user, or subject"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="billing">Billing</SelectItem>
              <SelectItem value="product_inquiry">Product Inquiry</SelectItem>
              <SelectItem value="general">General</SelectItem>
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

        {/* Tickets Table */}
        {filteredTickets.length > 0 ? (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedTickets.length === filteredTickets.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTickets.includes(ticket.id)}
                        onCheckedChange={(checked) => handleSelectTicket(ticket.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={ticket.userPhoto} />
                          <AvatarFallback className="text-[10px]">
                            {ticket.userName.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{ticket.userName}</p>
                          <p className="text-xs text-muted-foreground">{ticket.userEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm capitalize">{ticket.category.replace("_", " ")}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm max-w-[200px] truncate block">{ticket.subject}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={priorityColors[ticket.priority]} className="capitalize">
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[ticket.status]} className="capitalize">
                        {ticket.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{ticket.assignedToName || "Unassigned"}</span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{ticket.createdAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openDetails(ticket)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openAssign(ticket)}>
                            <UserCog className="mr-2 h-4 w-4" />
                            Assign
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openStatusChange(ticket)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Change Status
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDetails(ticket)}>
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Add Comment
                          </DropdownMenuItem>
                          {ticket.status !== "closed" && (
                            <DropdownMenuItem onClick={() => openCloseTicket(ticket)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Close Ticket
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-lg">
            <TicketIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No Tickets Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Tickets will appear here when users submit issues or inquiries.
            </p>
            <Button onClick={() => setCreateModalOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Create Ticket
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateTicketModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreateTicket}
      />
      <TicketDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        ticket={selectedTicket}
        onAssign={openAssign}
        onChangeStatus={openStatusChange}
        onClose={openCloseTicket}
      />
      <AssignTicketModal
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        ticket={selectedTicket}
      />
      <StatusModal
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
        ticket={selectedTicket}
      />
      <CloseTicketModal
        open={closeModalOpen}
        onOpenChange={setCloseModalOpen}
        ticket={selectedTicket}
      />
    </AdminLayout>
  );
}