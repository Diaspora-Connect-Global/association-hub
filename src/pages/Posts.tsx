import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Plus, MoreHorizontal, Eye, Edit, Pin, Trash2, MessageCircle, Heart, Image, Video } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  authorAvatar: string;
  media: "none" | "image" | "video";
  comments: number;
  likes: number;
  status: "published" | "draft" | "pending";
  pinned: boolean;
  createdAt: string;
}

const posts: Post[] = [
  {
    id: "1",
    title: "Welcome to our December Newsletter!",
    excerpt: "Check out the latest updates from our community including upcoming events and member highlights...",
    author: "Akua Mensah",
    authorAvatar: "AM",
    media: "image",
    comments: 24,
    likes: 156,
    status: "published",
    pinned: true,
    createdAt: "Dec 01, 2024",
  },
  {
    id: "2",
    title: "Annual General Meeting Announcement",
    excerpt: "Join us for our 2024 AGM where we'll discuss the year's achievements and plan for 2025...",
    author: "Kofi Asante",
    authorAvatar: "KA",
    media: "none",
    comments: 42,
    likes: 89,
    status: "published",
    pinned: false,
    createdAt: "Nov 28, 2024",
  },
  {
    id: "3",
    title: "Member Spotlight: Ama Serwaa",
    excerpt: "This month we're featuring Ama Serwaa, a software engineer who has been making waves...",
    author: "Efua Osei",
    authorAvatar: "EO",
    media: "video",
    comments: 18,
    likes: 234,
    status: "published",
    pinned: false,
    createdAt: "Nov 25, 2024",
  },
  {
    id: "4",
    title: "Tech Industry Insights Report 2024",
    excerpt: "Our latest report on the tech industry in Ghana and opportunities for diaspora members...",
    author: "Akua Mensah",
    authorAvatar: "AM",
    media: "image",
    comments: 0,
    likes: 0,
    status: "draft",
    pinned: false,
    createdAt: "Dec 02, 2024",
  },
  {
    id: "5",
    title: "Cultural Festival Photos",
    excerpt: "Highlights from our recent cultural festival celebrating Ghanaian heritage...",
    author: "Yaw Boateng",
    authorAvatar: "YB",
    media: "image",
    comments: 5,
    likes: 45,
    status: "pending",
    pinned: false,
    createdAt: "Nov 30, 2024",
  },
];

const mediaIcons = {
  none: null,
  image: Image,
  video: Video,
};

const statusMap = {
  published: "active" as const,
  draft: "inactive" as const,
  pending: "pending" as const,
};

export default function Posts() {
  const { t } = useTranslation();

  const columns = [
    {
      header: t("posts.post"),
      accessor: (row: Post) => (
        <div className="flex items-start gap-3">
          {row.pinned && (
            <Pin className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
          )}
          <div className="min-w-0">
            <p className="font-medium text-foreground line-clamp-1">{row.title}</p>
            <p className="body-small text-muted-foreground line-clamp-1">{row.excerpt}</p>
          </div>
        </div>
      ),
      className: "max-w-md",
    },
    {
      header: t("posts.author"),
      accessor: (row: Post) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 caption-small font-semibold text-primary">
            {row.authorAvatar}
          </div>
          <span className="body-small">{row.author}</span>
        </div>
      ),
    },
    {
      header: t("posts.media"),
      accessor: (row: Post) => {
        const Icon = mediaIcons[row.media];
        return Icon ? (
          <div className="flex items-center gap-1.5">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="body-small capitalize text-muted-foreground">{row.media}</span>
          </div>
        ) : (
          <span className="body-small text-muted-foreground">—</span>
        );
      },
    },
    {
      header: t("posts.engagement"),
      accessor: (row: Post) => (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <span className="body-small">{row.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <span className="body-small">{row.comments}</span>
          </div>
        </div>
      ),
    },
    {
      header: t("common.status"),
      accessor: (row: Post) => (
        <StatusBadge variant={statusMap[row.status]}>{row.status}</StatusBadge>
      ),
    },
    {
      header: t("posts.created"),
      accessor: "createdAt" as keyof Post,
      sortable: true,
    },
    {
      header: t("common.actions"),
      accessor: (row: Post) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              {t("posts.viewPost")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              {t("common.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pin className="mr-2 h-4 w-4" />
              {row.pinned ? t("posts.unpin") : t("posts.pinToTop")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageCircle className="mr-2 h-4 w-4" />
              {t("posts.viewComments")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              {t("common.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-20",
    },
  ];

  return (
    <AdminLayout title={t("posts.title")} subtitle={t("posts.subtitle")}>
      {/* Top Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder={t("posts.searchPlaceholder")}
            className="h-10 w-64 rounded-lg border border-input bg-background px-4 body-small transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <select className="rounded-lg border border-input bg-background px-3 py-2 body-small">
            <option value="">{t("common.all")} {t("common.status")}</option>
            <option value="published">{t("posts.published")}</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {t("posts.createPost")}
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="body-small text-muted-foreground">{t("posts.total")}</p>
          <p className="heading-xsmall text-foreground">342</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="body-small text-muted-foreground">{t("posts.published")}</p>
          <p className="heading-xsmall text-success">298</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="body-small text-muted-foreground">{t("posts.engagement")}</p>
          <p className="heading-xsmall text-primary">12.4K</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="body-small text-muted-foreground">{t("posts.pendingReview")}</p>
          <p className="heading-xsmall text-chart-1">8</p>
        </div>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={posts} />
    </AdminLayout>
  );
}
