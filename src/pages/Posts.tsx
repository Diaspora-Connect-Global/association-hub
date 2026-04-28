import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { useT } from "@/hooks/useT";
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
import { PostModal } from "@/components/posts/PostModal";
import { DeletePostModal } from "@/components/posts/DeletePostModal";
import { SchedulePostModal } from "@/components/posts/SchedulePostModal";
import { BulkActionsBar } from "@/components/posts/BulkActionsBar";
import { Plus, RefreshCw, LayoutList, LayoutGrid, Search } from "lucide-react";
import { Post, Comment } from "@/types/posts";
import { toast } from "@/hooks/use-toast";
import { getAdminAssociationId } from "@/stores/adminAuthStore";
import {
  getAssociationPosts,
  publishPost,
  deletePost,
  editPost as editPostMutation,
  hidePost,
  createPost,
  type PostType as BackendPost,
} from "@/services/graphql/posts/operations";

// -------------------------------------------------------------------------
// Helpers: map backend PostType → UI Post type
// -------------------------------------------------------------------------

function formatBackendDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}

function mapBackendStatus(status: BackendPost["status"]): Post["status"] {
  switch (status) {
    case "PUBLISHED":
      return "published";
    case "ARCHIVED":
      return "archived";
    case "REMOVED":
      return "removed";
    case "PENDING_REVIEW":
      return "pending_review";
    case "DRAFT":
    default:
      return "draft";
  }
}

function mapBackendVisibility(visibility: BackendPost["visibility"]): Post["visibility"] {
  if (visibility === "PUBLIC") return "public";
  return "members";
}

function mapBackendToUiPost(p: BackendPost): Post {
  return {
    id: p.id,
    title: p.text?.slice(0, 80) ?? "",
    excerpt: p.text?.slice(0, 160) ?? "",
    body: p.text,
    author: p.authorId ?? "",
    authorAvatar: (p.authorId ?? "").slice(0, 2).toUpperCase() || "??",
    media: "text",
    comments: p.commentsCount ?? 0,
    reactions: p.likesCount ?? 0,
    saves: 0,
    impressions: p.viewsCount ?? 0,
    status: mapBackendStatus(p.status),
    visibility: mapBackendVisibility(p.visibility),
    pinned: false,
    allowComments: true,
    allowReactions: true,
    publishedAt: p.status === "PUBLISHED" ? formatBackendDate(p.updatedAt) : null,
    createdAt: formatBackendDate(p.createdAt),
    updatedAt: formatBackendDate(p.updatedAt),
  };
}

// -------------------------------------------------------------------------
// Component
// -------------------------------------------------------------------------

export default function Posts() {
  const location = useLocation();
  const t = useT();
  const associationId = useMemo(() => getAdminAssociationId(), []);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
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
  const [deletePostState, setDeletePostState] = useState<Post | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [schedulePost, setSchedulePost] = useState<Post | null>(null);

  // -----------------------------------------------------------------------
  // Data fetching
  // -----------------------------------------------------------------------

  const loadPosts = useCallback(async () => {
    if (!associationId) return;
    setLoading(true);
    try {
      const backendPosts = await getAssociationPosts(associationId, 100, 0);
      setPosts(backendPosts.map(mapBackendToUiPost));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load posts.";
      toast({ title: "Error loading posts", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [associationId]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  // Handle quick action navigation
  useEffect(() => {
    if (location.state?.openCreate) {
      setCreateModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // -----------------------------------------------------------------------
  // Filter posts
  // -----------------------------------------------------------------------

  const filteredPosts = posts.filter((post) => {
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter !== "all" && post.status !== statusFilter) return false;
    if (mediaFilter !== "all" && post.media !== mediaFilter) return false;
    if (visibilityFilter !== "all" && post.visibility !== visibilityFilter) return false;
    return true;
  });

  // -----------------------------------------------------------------------
  // Handlers
  // -----------------------------------------------------------------------

  const handleSelectPost = (postId: string) => {
    setSelectedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId],
    );
  };

  const handleSelectAll = () => {
    setSelectedPosts(selectedPosts.length === filteredPosts.length ? [] : filteredPosts.map((p) => p.id));
  };

  const handleOpenDrawer = (post: Post) => {
    setDrawerPost(post);
    setDrawerOpen(true);
  };

  const handleTogglePublish = async (post: Post) => {
    try {
      if (post.status === "published") {
        await hidePost(post.id, "Unpublished by admin");
        toast({ title: "Post unpublished" });
      } else {
        await publishPost(post.id);
        toast({ title: "Post published" });
      }
      await loadPosts();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Action failed.";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  const handleTogglePin = (post: Post) => {
    // Pin is a UI-only concept for now — no backend RPC yet
    toast({ title: post.pinned ? "Post unpinned" : "Post pinned" });
  };

  const handleDeleteConfirm = async () => {
    if (!deletePostState) return;
    try {
      await deletePost(deletePostState.id);
      toast({ title: "Post deleted" });
      setDeleteModalOpen(false);
      setDeletePostState(null);
      await loadPosts();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed.";
      toast({ title: "Error deleting post", description: message, variant: "destructive" });
    }
  };

  const handleSavePost = async (postData: Partial<Post>, action: string) => {
    if (!associationId) return;
    try {
      if (editPost?.id) {
        // Update existing post
        await editPostMutation({ postId: editPost.id, text: postData.body ?? postData.excerpt ?? "" });
        if (action === "publish") {
          await publishPost(editPost.id);
        }
      } else {
        // Create new post
        const created = await createPost({
          authorId: associationId,
          authorType: "ASSOCIATION",
          text: postData.body ?? postData.excerpt ?? postData.title ?? "",
          visibility: postData.visibility === "public" ? "PUBLIC" : "MEMBERS_ONLY",
        });
        if (action === "publish") {
          await publishPost(created.id);
        }
      }
      toast({
        title: `Post ${action === "draft" ? "saved as draft" : action === "schedule" ? "scheduled" : "published"}`,
      });
      await loadPosts();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save post.";
      toast({ title: "Error saving post", description: message, variant: "destructive" });
    }
  };

  return (
    <AdminLayout title={t.postsTitle} subtitle={t.postsSubtitle}>
      {/* Top Controls Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Search and Filters */}
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t.searchPosts}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder={t.statusPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allStatus}</SelectItem>
              <SelectItem value="published">{t.published}</SelectItem>
              <SelectItem value="draft">{t.draft}</SelectItem>
              <SelectItem value="scheduled">{t.scheduled}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={mediaFilter} onValueChange={setMediaFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder={t.mediaPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allMedia}</SelectItem>
              <SelectItem value="text">{t.text}</SelectItem>
              <SelectItem value="image">{t.image}</SelectItem>
              <SelectItem value="video">{t.video}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder={t.visibilityPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.all}</SelectItem>
              <SelectItem value="members">{t.membersOnly}</SelectItem>
              <SelectItem value="public">{t.public}</SelectItem>
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
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => void loadPosts()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button className="gap-2" onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t.newPost}</span>
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">{t.totalPosts}</p>
          <p className="text-2xl font-semibold text-foreground">{posts.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">{t.published}</p>
          <p className="text-2xl font-semibold text-foreground">
            {posts.filter((p) => p.status === "published").length}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">{t.drafts}</p>
          <p className="text-2xl font-semibold text-foreground">
            {posts.filter((p) => p.status === "draft").length}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">{t.scheduled}</p>
          <p className="text-2xl font-semibold text-foreground">
            {posts.filter((p) => p.status === "scheduled").length}
          </p>
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          {t.showingXOfYPosts
            .replace("{filtered}", filteredPosts.length.toString())
            .replace("{total}", posts.length.toString())}
        </p>
      </div>

      {/* Posts View */}
      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Loading posts…</div>
      ) : viewMode === "list" ? (
        <PostsTable
          posts={filteredPosts}
          selectedPosts={selectedPosts}
          onSelectPost={handleSelectPost}
          onSelectAll={handleSelectAll}
          onOpenDrawer={handleOpenDrawer}
          onEdit={(post) => {
            setEditPost(post);
            setCreateModalOpen(true);
          }}
          onTogglePublish={handleTogglePublish}
          onSchedule={(post) => {
            setSchedulePost(post);
            setScheduleModalOpen(true);
          }}
          onTogglePin={handleTogglePin}
          onDelete={(post) => {
            setDeletePostState(post);
            setDeleteModalOpen(true);
          }}
        />
      ) : (
        <PostsCardView
          posts={filteredPosts}
          onOpenDrawer={handleOpenDrawer}
          onEdit={(post) => {
            setEditPost(post);
            setCreateModalOpen(true);
          }}
          onTogglePublish={handleTogglePublish}
          onTogglePin={handleTogglePin}
          onDelete={(post) => {
            setDeletePostState(post);
            setDeleteModalOpen(true);
          }}
        />
      )}

      {/* Modals */}
      <CreateEditPostModal
        open={createModalOpen}
        onOpenChange={(open) => {
          setCreateModalOpen(open);
          if (!open) setEditPost(null);
        }}
        post={editPost}
        onSave={handleSavePost}
      />
      <PostModal
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        post={drawerPost}
        comments={[] as Comment[]}
        onEdit={() => {
          setEditPost(drawerPost);
          setCreateModalOpen(true);
          setDrawerOpen(false);
        }}
        onTogglePublish={() => drawerPost && handleTogglePublish(drawerPost)}
        onTogglePin={() => drawerPost && handleTogglePin(drawerPost)}
        onHide={async () => {
          if (!drawerPost) return;
          try {
            await hidePost(drawerPost.id, "Hidden by admin");
            toast({ title: "Post hidden" });
            await loadPosts();
          } catch {
            toast({ title: "Failed to hide post", variant: "destructive" });
          }
        }}
        onDelete={() => {
          setDeletePostState(drawerPost);
          setDeleteModalOpen(true);
        }}
        onOpenAnalytics={() => toast({ title: "Analytics opened" })}
      />
      <DeletePostModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        post={deletePostState}
        onConfirm={handleDeleteConfirm}
      />
      <SchedulePostModal
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
        post={schedulePost}
        onConfirm={(date) =>
          toast({ title: `Post scheduled for ${date.toLocaleDateString()}` })
        }
      />
      <BulkActionsBar
        selectedCount={selectedPosts.length}
        onClearSelection={() => setSelectedPosts([])}
        onBulkPublish={async () => {
          try {
            await Promise.all(selectedPosts.map((id) => publishPost(id)));
            toast({ title: `${selectedPosts.length} posts published` });
            setSelectedPosts([]);
            await loadPosts();
          } catch {
            toast({ title: "Bulk publish failed", variant: "destructive" });
          }
        }}
        onBulkUnpublish={async () => {
          try {
            await Promise.all(selectedPosts.map((id) => hidePost(id, "Bulk unpublished by admin")));
            toast({ title: `${selectedPosts.length} posts unpublished` });
            setSelectedPosts([]);
            await loadPosts();
          } catch {
            toast({ title: "Bulk unpublish failed", variant: "destructive" });
          }
        }}
        onBulkDelete={async () => {
          try {
            await Promise.all(selectedPosts.map((id) => deletePost(id)));
            toast({ title: `${selectedPosts.length} posts deleted` });
            setSelectedPosts([]);
            await loadPosts();
          } catch {
            toast({ title: "Bulk delete failed", variant: "destructive" });
          }
        }}
        onBulkExport={() => toast({ title: `Exporting ${selectedPosts.length} posts` })}
      />
    </AdminLayout>
  );
}
