import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
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
  admin: "bg-chart-1/10 text-chart-1",
};

export default function Members() {
  const { t } = useTranslation();

  const columns = [
    {
      header: t("members.member"),
      accessor: (row: Member) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 body-small font-semibold text-primary">
            {row.avatar}
          </div>
          <div>
            <p className="font-medium text-foreground">{row.name}</p>
            <p className="caption-small text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: t("members.role"),
      accessor: (row: Member) => (
        <span className={`rounded-full px-2.5 py-1 caption-small font-medium capitalize ${roleColors[row.role]}`}>
          {row.role}
        </span>
      ),
    },
    {
      header: t("common.status"),
      accessor: (row: Member) => (
        <StatusBadge
          variant={row.status === "active" ? "active" : row.status === "pending" ? "pending" : "error"}
        >
          {row.status}
        </StatusBadge>
      ),
    },
    {
      header: t("members.joinedAt"),
      accessor: "joinedAt" as keyof Member,
      sortable: true,
    },
    {
      header: t("members.lastActive"),
      accessor: "lastActive" as keyof Member,
    },
    {
      header: t("common.actions"),
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
              {t("members.viewProfile")}
            </DropdownMenuItem>
            {row.status === "pending" && (
              <DropdownMenuItem className="text-success">
                <UserCheck className="mr-2 h-4 w-4" />
                {t("members.approve")}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Shield className="mr-2 h-4 w-4" />
              {t("members.promoteToModerator")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <UserX className="mr-2 h-4 w-4" />
              {row.status === "suspended" ? t("members.remove") : t("members.suspend")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-20",
    },
  ];

  return (
    <AdminLayout title={t("members.title")} subtitle={t("members.subtitle")}>
      {/* Top Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder={t("members.searchPlaceholder")}
            className="h-10 w-64 rounded-lg border border-input bg-background px-4 body-small transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <select className="rounded-lg border border-input bg-background px-3 py-2 body-small">
            <option value="">{t("common.all")} {t("common.status")}</option>
            <option value="active">{t("members.active")}</option>
            <option value="pending">{t("members.pending")}</option>
            <option value="suspended">{t("members.suspended")}</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            {t("members.exportMembers")}
          </Button>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            {t("members.inviteMember")}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="body-small text-muted-foreground">{t("members.total")}</p>
          <p className="heading-xsmall text-foreground">1,284</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="body-small text-muted-foreground">{t("members.active")}</p>
          <p className="heading-xsmall text-success">1,156</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="body-small text-muted-foreground">{t("members.pending")}</p>
          <p className="heading-xsmall text-chart-1">28</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="body-small text-muted-foreground">{t("members.suspended")}</p>
          <p className="heading-xsmall text-destructive">12</p>
        </div>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={members} />
    </AdminLayout>
  );
}
