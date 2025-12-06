import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { UserPlus, Download, MoreHorizontal, Eye, UserCheck, UserX, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "member" | "moderator" | "admin";
  status: "active" | "pending" | "suspended";
  joinedAt: string;
  lastActive: string;
}

const members: Member[] = [
  {
    id: "1",
    name: "Kofi Asante",
    email: "kofi.asante@email.com",
    avatar: "KA",
    role: "member",
    status: "active",
    joinedAt: "Nov 15, 2024",
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "Ama Serwaa",
    email: "ama.serwaa@email.com",
    avatar: "AS",
    role: "moderator",
    status: "active",
    joinedAt: "Oct 22, 2024",
    lastActive: "5 minutes ago",
  },
  {
    id: "3",
    name: "Kwame Mensah",
    email: "kwame.m@email.com",
    avatar: "KM",
    role: "member",
    status: "pending",
    joinedAt: "Dec 01, 2024",
    lastActive: "Never",
  },
  {
    id: "4",
    name: "Efua Osei",
    email: "efua.osei@email.com",
    avatar: "EO",
    role: "admin",
    status: "active",
    joinedAt: "Sep 10, 2024",
    lastActive: "1 day ago",
  },
  {
    id: "5",
    name: "Yaw Boateng",
    email: "yaw.b@email.com",
    avatar: "YB",
    role: "member",
    status: "suspended",
    joinedAt: "Aug 05, 2024",
    lastActive: "2 weeks ago",
  },
];

const roleColors = {
  member: "bg-muted text-muted-foreground",
  moderator: "bg-primary/10 text-primary",
  admin: "bg-accent/10 text-accent",
};

export default function Members() {
  const columns = [
    {
      header: "Member",
      accessor: (row: Member) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {row.avatar}
          </div>
          <div>
            <p className="font-medium text-foreground">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: (row: Member) => (
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${roleColors[row.role]}`}>
          {row.role}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (row: Member) => (
        <StatusBadge
          variant={row.status === "active" ? "active" : row.status === "pending" ? "pending" : "error"}
        >
          {row.status}
        </StatusBadge>
      ),
    },
    {
      header: "Joined At",
      accessor: "joinedAt" as keyof Member,
      sortable: true,
    },
    {
      header: "Last Active",
      accessor: "lastActive" as keyof Member,
    },
    {
      header: "Actions",
      accessor: (row: Member) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Profile
            </DropdownMenuItem>
            {row.status === "pending" && (
              <DropdownMenuItem className="text-success">
                <UserCheck className="mr-2 h-4 w-4" />
                Approve
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Shield className="mr-2 h-4 w-4" />
              Promote to Moderator
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <UserX className="mr-2 h-4 w-4" />
              {row.status === "suspended" ? "Remove" : "Suspend"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-20",
    },
  ];

  return (
    <AdminLayout title="Members" subtitle="Manage association membership">
      {/* Top Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search members..."
            className="input-search w-64"
          />
          <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
          <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="">All Roles</option>
            <option value="member">Member</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Members</p>
          <p className="text-2xl font-bold text-foreground">1,284</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-success">1,156</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Pending Approval</p>
          <p className="text-2xl font-bold text-warning">28</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Suspended</p>
          <p className="text-2xl font-bold text-destructive">12</p>
        </div>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={members} />
    </AdminLayout>
  );
}
