import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Eye, Edit, Pin, Trash2, MessageCircle, Heart, Image, Video } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

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
  const columns = [
    {
      header: "Post",
      accessor: (row: Post) => (
        <div className="flex items-start gap-3">
          {row.pinned && (
            <Pin className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
          )}
          <div className="min-w-0">
            <p className="font-medium text-foreground line-clamp-1">{row.title}</p>
            <p className="text-sm text-muted-foreground line-clamp-1">{row.excerpt}</p>
          </div>
        </div>
      ),
      className: "max-w-md",
    },
    {
      header: "Author",
      accessor: (row: Post) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {row.authorAvatar}
          </div>
          <span className="text-sm">{row.author}</span>
        </div>
      ),
    },
    {
      header: "Media",
      accessor: (row: Post) => {
        const Icon = mediaIcons[row.media];
        return Icon ? (
          <div className="flex items-center gap-1.5">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm capitalize text-muted-foreground">{row.media}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        );
      },
    },
    {
      header: "Engagement",
      accessor: (row: Post) => (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{row.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{row.comments}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row: Post) => (
        <StatusBadge variant={statusMap[row.status]}>{row.status}</StatusBadge>
      ),
    },
    {
      header: "Created",
      accessor: "createdAt" as keyof Post,
      sortable: true,
    },
    {
      header: "Actions",
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
              View Post
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pin className="mr-2 h-4 w-4" />
              {row.pinned ? "Unpin" : "Pin to Top"}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageCircle className="mr-2 h-4 w-4" />
              View Comments
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-20",
    },
  ];

  return (
    <AdminLayout title="Posts" subtitle="Create and manage association posts">
      {/* Top Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search posts..."
            className="input-search w-64"
          />
          <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
          </select>
          <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="">All Media</option>
            <option value="text">Text Only</option>
            <option value="image">With Images</option>
            <option value="video">With Video</option>
          </select>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Post
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Posts</p>
          <p className="text-2xl font-bold text-foreground">342</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Published</p>
          <p className="text-2xl font-bold text-success">298</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Engagement</p>
          <p className="text-2xl font-bold text-primary">12.4K</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Pending Review</p>
          <p className="text-2xl font-bold text-warning">8</p>
        </div>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={posts} />
    </AdminLayout>
  );
}
