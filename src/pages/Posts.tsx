import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostsTable } from "@/components/posts/PostsTable";
import { PostsCardView } from "@/components/posts/PostsCardView";
import { CreateEditPostModal } from "@/components/posts/CreateEditPostModal";
import { PostDrawer } from "@/components/posts/PostDrawer";
import { DeletePostModal } from "@/components/posts/DeletePostModal";
import { SchedulePostModal } from "@/components/posts/SchedulePostModal";
import { BulkActionsBar } from "@/components/posts/BulkActionsBar";
import { Plus, RefreshCw, LayoutList, LayoutGrid, Search } from "lucide-react";
import { Post, Comment } from "@/types/posts";
import { toast } from "@/hooks/use-toast";

// Mock data
const mockPosts: Post[] = [
  {
    id: "1",
    title: "Welcome to our December Newsletter!",
    excerpt: "Check out the latest updates from our community including upcoming events and member highlights...",
    body: "Full newsletter content here...",
    author: "Akua Mensah",
    authorAvatar: "AM",
    media: "image",
    comments: 24,
    reactions: 156,
    saves: 12,
    impressions: 1240,
    status: "published",
    visibility: "members",
    pinned: true,
    allowComments: true,
    allowReactions: true,
    publishedAt: "Dec 01, 2024",
    createdAt: "Dec 01, 2024",
    updatedAt: "Dec 01, 2024",
    tags: ["newsletter", "december"],
  },
  {
    id: "2",
    title: "Annual General Meeting Announcement",
    excerpt: "Join us for our 2024 AGM where we'll discuss the year's achievements and plan for 2025...",
    author: "Kofi Asante",
    authorAvatar: "KA",
    media: "text",
    comments: 42,
    reactions: 89,
    status: "published",
    visibility: "members",
    pinned: false,
    allowComments: true,
    allowReactions: true,
    publishedAt: "Nov 28, 2024",
    createdAt: "Nov 28, 2024",
    updatedAt: "Nov 28, 2024",
    tags: ["agm", "meeting"],
  },
  {
    id: "3",
    title: "Member Spotlight: Ama Serwaa",
    excerpt: "This month we're featuring Ama Serwaa, a software engineer who has been making waves...",
    author: "Efua Osei",
    authorAvatar: "EO",
    media: "video",
    comments: 18,
    reactions: 234,
    status: "published",
    visibility: "public",
    pinned: false,
    allowComments: true,
    allowReactions: true,
    publishedAt: "Nov 25, 2024",
    createdAt: "Nov 25, 2024",
    updatedAt: "Nov 25, 2024",
  },
  {
    id: "4",
    title: "Tech Industry Insights Report 2024",
    excerpt: "Our latest report on the tech industry in Ghana and opportunities for diaspora members...",
    author: "Akua Mensah",
    authorAvatar: "AM",
    media: "image",
    comments: 0,
    reactions: 0,
    status: "draft",
    visibility: "members",
    pinned: false,
    allowComments: true,
    allowReactions: true,
    publishedAt: null,
    createdAt: "Dec 02, 2024",
    updatedAt: "Dec 02, 2024",
  },
  {
    id: "5",
    title: "Cultural Festival Photos",
    excerpt: "Highlights from our recent cultural festival celebrating Ghanaian heritage...",
    author: "Yaw Boateng",
    authorAvatar: "YB",
    media: "image",
    comments: 5,
    reactions: 45,
    status: "scheduled",
    visibility: "public",
    pinned: false,
    allowComments: true,
    allowReactions: true,
    publishedAt: null,
    scheduledAt: "Dec 10, 2024",
    createdAt: "Nov 30, 2024",
    updatedAt: "Nov 30, 2024",
  },
];

const mockComments: Comment[] = [
  { id: "1", postId: "1", author: "John Doe", authorAvatar: "JD", content: "Great newsletter!", createdAt: "2h ago", flagged: false },
  { id: "2", postId: "1", author: "Jane Smith", authorAvatar: "JS", content: "Looking forward to the events!", createdAt: "3h ago", flagged: false },
  { id: "3", postId: "2", author: "Mike Johnson", authorAvatar: "MJ", content: "Will there be virtual attendance?", createdAt: "1d ago", flagged: true, flagReason: "spam" },
];

export default function Posts() {
  const [posts] = useState<Post[]>(mockPosts);
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [mediaFilter, setMediaFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPost, setDrawerPost] = useState<Post | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePost, setDeletePost] = useState<Post | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [schedulePost, setSchedulePost] = useState<Post | null>(null);

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter !== "all" && post.status !== statusFilter) return false;
    if (mediaFilter !== "all" && post.media !== mediaFilter) return false;
    if (visibilityFilter !== "all" && post.visibility !== visibilityFilter) return false;
    return true;
  });

  const handleSelectPost = (postId: string) => {
    setSelectedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    setSelectedPosts(selectedPosts.length === filteredPosts.length ? [] : filteredPosts.map((p) => p.id));
  };

  const handleOpenDrawer = (post: Post) => {
    setDrawerPost(post);
    setDrawerOpen(true);
  };

  const handleSavePost = (postData: Partial<Post>, action: string) => {
    toast({ title: `Post ${action === "draft" ? "saved as draft" : action === "schedule" ? "scheduled" : "published"}` });
  };

  return (
    <AdminLayout title="Posts" subtitle="Create and manage association posts">
      {/* Top Controls Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Search and Filters */}
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={mediaFilter} onValueChange={setMediaFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Media" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Media</SelectItem>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
          <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="members">Members</SelectItem>
              <SelectItem value="public">Public</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Right: View Toggle and Actions */}
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "card")}>
            <TabsList className="h-9">
              <TabsTrigger value="list" className="px-3">
                <LayoutList className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="card" className="px-3">
                <LayoutGrid className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button className="gap-2" onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Post</span>
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Posts</p>
          <p className="text-2xl font-semibold text-foreground">{posts.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Published</p>
          <p className="text-2xl font-semibold text-foreground">{posts.filter(p => p.status === "published").length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Drafts</p>
          <p className="text-2xl font-semibold text-foreground">{posts.filter(p => p.status === "draft").length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Scheduled</p>
          <p className="text-2xl font-semibold text-foreground">{posts.filter(p => p.status === "scheduled").length}</p>
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredPosts.length} of {posts.length} posts
        </p>
      </div>

      {/* Posts View */}
      {viewMode === "list" ? (
        <PostsTable
          posts={filteredPosts}
          selectedPosts={selectedPosts}
          onSelectPost={handleSelectPost}
          onSelectAll={handleSelectAll}
          onOpenDrawer={handleOpenDrawer}
          onEdit={(post) => { setEditPost(post); setCreateModalOpen(true); }}
          onTogglePublish={(post) => toast({ title: `Post ${post.status === "published" ? "unpublished" : "published"}` })}
          onSchedule={(post) => { setSchedulePost(post); setScheduleModalOpen(true); }}
          onTogglePin={(post) => toast({ title: `Post ${post.pinned ? "unpinned" : "pinned"}` })}
          onDelete={(post) => { setDeletePost(post); setDeleteModalOpen(true); }}
        />
      ) : (
        <PostsCardView
          posts={filteredPosts}
          onOpenDrawer={handleOpenDrawer}
          onEdit={(post) => { setEditPost(post); setCreateModalOpen(true); }}
          onTogglePublish={(post) => toast({ title: `Post ${post.status === "published" ? "unpublished" : "published"}` })}
          onTogglePin={(post) => toast({ title: `Post ${post.pinned ? "unpinned" : "pinned"}` })}
          onDelete={(post) => { setDeletePost(post); setDeleteModalOpen(true); }}
        />
      )}

      {/* Modals */}
      <CreateEditPostModal
        open={createModalOpen}
        onOpenChange={(open) => { setCreateModalOpen(open); if (!open) setEditPost(null); }}
        post={editPost}
        onSave={handleSavePost}
      />
      <PostDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        post={drawerPost}
        comments={mockComments.filter((c) => c.postId === drawerPost?.id)}
        onEdit={() => { setEditPost(drawerPost); setCreateModalOpen(true); setDrawerOpen(false); }}
        onTogglePublish={() => toast({ title: "Publish toggled" })}
        onTogglePin={() => toast({ title: "Pin toggled" })}
        onHide={() => toast({ title: "Post hidden" })}
        onDelete={() => { setDeletePost(drawerPost); setDeleteModalOpen(true); }}
        onOpenAnalytics={() => toast({ title: "Analytics opened" })}
      />
      <DeletePostModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        post={deletePost}
        onConfirm={() => { toast({ title: "Post deleted" }); setDeleteModalOpen(false); }}
      />
      <SchedulePostModal
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
        post={schedulePost}
        onConfirm={(date) => toast({ title: `Post scheduled for ${date.toLocaleDateString()}` })}
      />
      <BulkActionsBar
        selectedCount={selectedPosts.length}
        onClearSelection={() => setSelectedPosts([])}
        onBulkPublish={() => toast({ title: `${selectedPosts.length} posts published` })}
        onBulkUnpublish={() => toast({ title: `${selectedPosts.length} posts unpublished` })}
        onBulkDelete={() => toast({ title: `${selectedPosts.length} posts deleted` })}
        onBulkExport={() => toast({ title: `Exporting ${selectedPosts.length} posts` })}
      />
    </AdminLayout>
  );
}
