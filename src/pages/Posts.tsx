import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PostsTable } from "@/components/posts/PostsTable";
import { PostsCardView } from "@/components/posts/PostsCardView";
import { DeletePostModal } from "@/components/posts/DeletePostModal";
import { MentionTextarea } from "@/components/posts/MentionTextarea";
import { CommentsTree } from "@/components/posts/CommentsTree";
import {
  Plus,
  RefreshCw,
  LayoutList,
  LayoutGrid,
  Search,
  Loader2,
  FileText,
  FileVideo,
  Heart,
  MessageSquare,
  X,
} from "lucide-react";
import type { Post as UiPost } from "@/types/posts";
import { toast } from "@/hooks/use-toast";
import { getAdminAssociationId } from "@/stores/adminAuthStore";
import { useAdminAuthStore } from "@/stores/adminAuthStore";
import { associationPostService } from "@/services/associationPostService";
import type {
  AttachmentType,
  MentionInput,
  Post as ApiPost,
  PostAttachment,
  PostVisibility,
} from "@/services/graphql/posts";

// -------------------------------------------------------------------------
// Local visibility option for the composer: Public vs Association-only
// -------------------------------------------------------------------------

type PostVisibilityOption = "ASSOCIATION" | "PUBLIC";
type ComposerMode = "create" | "edit";

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

function normalizeVisibilityOption(
  visibility: PostVisibility | undefined,
): PostVisibilityOption {
  const upper = (visibility ?? "").toString().toUpperCase();
  return upper === "PUBLIC" ? "PUBLIC" : "ASSOCIATION";
}

function mapApiVisibilityToUi(visibility: PostVisibility | undefined): UiPost["visibility"] {
  const upper = (visibility ?? "").toString().toUpperCase();
  return upper === "PUBLIC" ? "public" : "members";
}

function mapApiStatusToUi(status: ApiPost["status"] | string | undefined): UiPost["status"] {
  const s = (status ?? "").toString().toLowerCase();
  if (s === "active") return "published";
  if (s === "draft") return "draft";
  if (s === "hidden") return "removed";
  if (s === "deleted") return "removed";
  // Backwards-compat for any older PostStatus enum strings
  if (s === "published") return "published";
  if (s === "archived") return "archived";
  if (s === "removed") return "removed";
  if (s === "pending_review") return "pending_review";
  return "draft";
}

function mapApiToUi(p: ApiPost): UiPost {
  const text = p.text ?? "";
  const firstLine = text.split("\n").find((line) => line.trim().length > 0) ?? "Untitled post";
  const attachments = p.attachments ?? [];
  const hasMedia = attachments.length > 0;
  const firstAttachmentType = attachments[0]?.type;
  const media: UiPost["media"] =
    firstAttachmentType === "IMAGE"
      ? "image"
      : firstAttachmentType === "VIDEO"
        ? "video"
        : hasMedia
          ? "image"
          : "text";

  return {
    id: p.id,
    title: firstLine.slice(0, 80),
    excerpt: text.length > 160 ? `${text.slice(0, 160)}...` : text,
    body: text,
    author: p.authorId ?? "",
    authorAvatar: (p.authorId ?? "").slice(0, 2).toUpperCase() || "AS",
    media,
    comments: p.engagementCounts?.comments ?? 0,
    reactions: p.engagementCounts?.likes ?? 0,
    saves: p.engagementCounts?.saves ?? 0,
    impressions: 0,
    status: mapApiStatusToUi(p.status),
    visibility: mapApiVisibilityToUi(p.visibility),
    pinned: false,
    allowComments: true,
    allowReactions: true,
    publishedAt: formatBackendDate(p.createdAt),
    createdAt: formatBackendDate(p.createdAt),
    updatedAt: p.updatedAt ? formatBackendDate(p.updatedAt) : formatBackendDate(p.createdAt),
    attachments,
  };
}

function attachmentFileName(att: PostAttachment): string {
  if (att.objectKey) {
    const parts = att.objectKey.split("/");
    return parts[parts.length - 1] || att.objectKey;
  }
  if (att.url) {
    try {
      const u = new URL(att.url);
      const parts = u.pathname.split("/");
      return parts[parts.length - 1] || att.url;
    } catch {
      return att.url;
    }
  }
  return att.id;
}

function resolveAttachmentType(file: File): AttachmentType {
  if (file.type.startsWith("image/")) return "IMAGE";
  if (file.type.startsWith("video/")) return "VIDEO";
  return "DOCUMENT";
}

function fileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// -------------------------------------------------------------------------
// Component
// -------------------------------------------------------------------------

export default function Posts() {
  const location = useLocation();
  const t = useT();
  const admin = useAdminAuthStore((state) => state.admin);
  const associationId = useMemo(() => getAdminAssociationId(), []);
  const canManagePosts = Boolean(
    associationId &&
      (admin?.scopeType === "ASSOCIATION" || admin === null /* fallback */),
  );

  const [posts, setPosts] = useState<UiPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [mediaFilter, setMediaFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");

  // Composer state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [composerMode, setComposerMode] = useState<ComposerMode>("create");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<PostVisibilityOption>("ASSOCIATION");
  const [mentions, setMentions] = useState<MentionInput[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // View modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewPost, setViewPost] = useState<UiPost | null>(null);

  // Delete
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePostState, setDeletePostState] = useState<UiPost | null>(null);

  // ---------------------------------------------------------------------
  // Attachment preview URLs (revoked on unmount)
  // ---------------------------------------------------------------------

  const previewUrls = useMemo(() => {
    const urls: Record<string, string> = {};
    selectedFiles.forEach((file) => {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        urls[fileKey(file)] = URL.createObjectURL(file);
      }
    });
    return urls;
  }, [selectedFiles]);

  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const addFiles = (incoming: File[]) => {
    if (incoming.length === 0) return;
    setSelectedFiles((prev) => {
      const existing = new Set(prev.map(fileKey));
      const merged = [...prev];
      incoming.forEach((file) => {
        const key = fileKey(file);
        if (!existing.has(key)) {
          existing.add(key);
          merged.push(file);
        }
      });
      return merged;
    });
  };

  const removeFile = (key: string) => {
    setSelectedFiles((prev) => prev.filter((file) => fileKey(file) !== key));
  };

  // ---------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------

  const loadPosts = useCallback(async () => {
    if (!associationId) return;
    setLoading(true);
    try {
      const feed = await associationPostService.getAssociationFeed(associationId, 50, 0);
      const mapped = feed.posts.map(mapApiToUi);
      setPosts(mapped);

      // The backend feed's engagementCounts.comments has historically been
      // unreliable (often 0 even when comments exist). The post-feed-service
      // was fixed to return real counts, but we keep this belt-and-suspenders
      // fan-out so admins always see an accurate number.
      const counts = await Promise.all(
        mapped.map((p) =>
          associationPostService
            .postComments(p.id, 100, 0)
            .then((cs) => cs.reduce((sum, c) => sum + 1 + (c.replyCount ?? 0), 0))
            .catch(() => null),
        ),
      );
      setPosts((prev) =>
        prev.map((p) => {
          const i = mapped.findIndex((m) => m.id === p.id);
          const derived = i >= 0 ? counts[i] : null;
          return derived != null && derived > p.comments
            ? { ...p, comments: derived }
            : p;
        }),
      );
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

  useEffect(() => {
    if (location.state?.openCreate) {
      openCreate();
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  // ---------------------------------------------------------------------
  // Filter posts
  // ---------------------------------------------------------------------

  const filteredPosts = posts.filter((post) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !post.title.toLowerCase().includes(q) &&
        !post.excerpt.toLowerCase().includes(q) &&
        !(post.body ?? "").toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (statusFilter !== "all" && post.status !== statusFilter) return false;
    if (mediaFilter !== "all" && post.media !== mediaFilter) return false;
    if (visibilityFilter !== "all" && post.visibility !== visibilityFilter) return false;
    return true;
  });

  // ---------------------------------------------------------------------
  // Composer handlers
  // ---------------------------------------------------------------------

  const resetComposer = () => {
    setContent("");
    setSelectedFiles([]);
    setVisibility("ASSOCIATION");
    setMentions([]);
    setComposerMode("create");
    setEditingPostId(null);
  };

  const openCreate = () => {
    resetComposer();
    setCreateModalOpen(true);
  };

  const openEdit = (post: UiPost) => {
    setComposerMode("edit");
    setEditingPostId(post.id);
    setContent(post.body ?? post.excerpt ?? "");
    setVisibility(post.visibility === "public" ? "PUBLIC" : "ASSOCIATION");
    setMentions([]);
    setSelectedFiles([]);
    setCreateModalOpen(true);
  };

  const handleComposerOpenChange = (open: boolean) => {
    setCreateModalOpen(open);
    if (!open) resetComposer();
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Post content is required",
        description: "Enter post text before saving.",
        variant: "destructive",
      });
      return;
    }

    if (composerMode === "edit") {
      if (!editingPostId) return;
      setSubmitting(true);
      try {
        await associationPostService.editPost({
          id: editingPostId,
          text: content.trim(),
          visibility,
        });
        const updated = await associationPostService.post(editingPostId);
        setPosts((prev) =>
          prev.map((p) => (p.id === editingPostId ? mapApiToUi(updated) : p)),
        );
        setCreateModalOpen(false);
        resetComposer();
        toast({ title: "Post updated", description: "Your changes are saved." });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update post";
        toast({ title: "Update failed", description: message, variant: "destructive" });
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!associationId) {
      toast({
        title: "Missing association",
        description: "No association context found.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const attachments = await Promise.all(
        selectedFiles.map((file) =>
          associationPostService.uploadAttachment({
            file,
            type: resolveAttachmentType(file),
          }),
        ),
      );

      const mentionedUserIds = mentions
        .filter((m) => m.entityType === "USER")
        .map((m) => m.entityId);

      const result = await associationPostService.createAssociationPost({
        associationId,
        text: content.trim(),
        visibility,
        attachments,
        mentionedUserIds,
        mentions,
      });

      const created = await associationPostService.post(result.id);
      setPosts((prev) => [mapApiToUi(created), ...prev]);
      setCreateModalOpen(false);
      resetComposer();
      toast({ title: "Post published", description: "Your post is now live." });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to publish post";
      toast({ title: "Publish failed", description: message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------
  // Delete handler — uses adminDeletePost since post is association-authored
  // ---------------------------------------------------------------------

  const handleDeleteConfirm = async () => {
    if (!deletePostState) return;
    setDeleting(true);
    try {
      const ok = await associationPostService.adminDeletePost(deletePostState.id);
      if (!ok) throw new Error("Delete failed");
      setPosts((prev) => prev.filter((p) => p.id !== deletePostState.id));
      toast({ title: "Post deleted" });
      setDeleteModalOpen(false);
      setDeletePostState(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed.";
      toast({ title: "Error deleting post", description: message, variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  // ---------------------------------------------------------------------
  // Other handlers (kept light — backend support varies)
  // ---------------------------------------------------------------------

  const handleSelectPost = (postId: string) => {
    setSelectedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId],
    );
  };

  const handleSelectAll = () => {
    setSelectedPosts(
      selectedPosts.length === filteredPosts.length ? [] : filteredPosts.map((p) => p.id),
    );
  };

  const handleOpenDrawer = async (post: UiPost) => {
    setViewPost(post);
    setViewModalOpen(true);
    try {
      const [fresh, topLevel] = await Promise.all([
        associationPostService.post(post.id),
        associationPostService.postComments(post.id, 100, 0).catch(() => []),
      ]);
      const mapped = mapApiToUi(fresh);
      const derived = topLevel.reduce((sum, c) => sum + 1 + (c.replyCount ?? 0), 0);
      mapped.comments = Math.max(mapped.comments, derived);
      setViewPost(mapped);
      setPosts((prev) => prev.map((p) => (p.id === mapped.id ? mapped : p)));
    } catch {
      // keep stale snapshot if refresh fails
    }
  };

  const handleTogglePublish = async (post: UiPost) => {
    try {
      if (post.status === "published") {
        const ok = await associationPostService.hidePost(post.id);
        if (!ok) throw new Error("Hide failed");
        toast({ title: "Post hidden", description: "The post is no longer visible." });
      } else {
        const targetVisibility = post.visibility === "public" ? "PUBLIC" : "ASSOCIATION";
        await associationPostService.publishPost(post.id, targetVisibility);
        toast({ title: "Post published", description: "The post is now visible." });
      }
      const refreshed = await associationPostService.post(post.id);
      setPosts((prev) => prev.map((p) => (p.id === post.id ? mapApiToUi(refreshed) : p)));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Action failed";
      toast({ title: "Could not update post", description: message, variant: "destructive" });
    }
  };

  const handleTogglePin = (post: UiPost) => {
    toast({
      title: post.pinned ? "Post unpinned" : "Post pinned",
      description: "Pinning is not wired to the backend yet.",
    });
  };

  return (
    <AdminLayout title={t.postsTitle} subtitle={t.postsSubtitle}>
      {/* Top Controls Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => void loadPosts()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            className="gap-2"
            onClick={openCreate}
            disabled={!canManagePosts}
          >
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

      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          {t.showingXOfYPosts
            .replace("{filtered}", filteredPosts.length.toString())
            .replace("{total}", posts.length.toString())}
        </p>
      </div>

      {/* Posts View */}
      {loading ? (
        <div className="py-16 text-center text-muted-foreground">
          <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
          Loading posts…
        </div>
      ) : viewMode === "list" ? (
        <PostsTable
          posts={filteredPosts}
          selectedPosts={selectedPosts}
          onSelectPost={handleSelectPost}
          onSelectAll={handleSelectAll}
          onOpenDrawer={handleOpenDrawer}
          onEdit={openEdit}
          onTogglePublish={handleTogglePublish}
          onSchedule={() =>
            toast({ title: "Scheduling is not available yet" })
          }
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
          onEdit={openEdit}
          onTogglePublish={handleTogglePublish}
          onTogglePin={handleTogglePin}
          onDelete={(post) => {
            setDeletePostState(post);
            setDeleteModalOpen(true);
          }}
        />
      )}

      {/* Composer Dialog */}
      <Dialog open={createModalOpen} onOpenChange={handleComposerOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="font-display">
              {composerMode === "edit" ? t.editPost : t.createPost}
            </DialogTitle>
            <DialogDescription>
              {composerMode === "edit"
                ? "Update the post text or change who can see it."
                : "Share an announcement with your association."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="post-content">Content</Label>
              <MentionTextarea
                id="post-content"
                placeholder="Write your post content... Type @ to mention a user, community or association."
                rows={6}
                value={content}
                onChange={setContent}
                onMentionsChange={setMentions}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="post-visibility">Visibility</Label>
              <Select
                value={visibility}
                onValueChange={(value) => setVisibility(value as PostVisibilityOption)}
              >
                <SelectTrigger id="post-visibility">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ASSOCIATION">Association only</SelectItem>
                  <SelectItem value="PUBLIC">Public</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {visibility === "ASSOCIATION"
                  ? "Only members of this association can see this post."
                  : "Anyone can see this post."}
              </p>
            </div>

            {composerMode === "create" && (
              <div className="space-y-2">
                <Label htmlFor="post-files">Attachments</Label>
                <Input
                  ref={fileInputRef}
                  id="post-files"
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                  onChange={(event) => {
                    const files = event.target.files
                      ? Array.from(event.target.files)
                      : [];
                    addFiles(files);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                />
                {selectedFiles.length > 0 && (
                  <>
                    <p className="text-xs text-muted-foreground">
                      {selectedFiles.length} file{selectedFiles.length === 1 ? "" : "s"} selected
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedFiles.map((file) => {
                        const key = fileKey(file);
                        const previewUrl = previewUrls[key];
                        const isImage = file.type.startsWith("image/");
                        const isVideo = file.type.startsWith("video/");
                        return (
                          <div
                            key={key}
                            className="relative group rounded-md border border-border bg-muted/30 overflow-hidden aspect-square"
                          >
                            {isImage && previewUrl ? (
                              <img
                                src={previewUrl}
                                alt={file.name}
                                className="h-full w-full object-cover"
                              />
                            ) : isVideo && previewUrl ? (
                              <video
                                src={previewUrl}
                                className="h-full w-full object-cover"
                                muted
                                playsInline
                              />
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-muted-foreground">
                                {isVideo ? (
                                  <FileVideo className="h-6 w-6" />
                                ) : (
                                  <FileText className="h-6 w-6" />
                                )}
                                <p className="line-clamp-2 text-center text-[10px] leading-tight">
                                  {file.name}
                                </p>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => removeFile(key)}
                              className="absolute right-1 top-1 rounded-full bg-background/80 p-0.5 text-foreground opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                              aria-label={`Remove ${file.name}`}
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 py-1">
                              <p className="truncate text-[10px] text-white">{file.name}</p>
                              <p className="text-[10px] text-white/80">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {composerMode === "edit" ? "Save changes" : "Publish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-display">{viewPost?.title}</DialogTitle>
            <DialogDescription>
              Posted on {viewPost?.createdAt}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 overflow-y-auto flex-1">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{viewPost?.comments} comments</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{viewPost?.reactions} likes</span>
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground whitespace-pre-wrap">{viewPost?.body}</p>
            </div>
            {viewPost && (viewPost.attachments?.length ?? 0) > 0 && (
              <div className="space-y-2 pt-2 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground">
                  Attachments ({viewPost.attachments?.length ?? 0})
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {(viewPost.attachments ?? []).map((att) => {
                    const name = attachmentFileName(att);
                    if (att.type === "IMAGE" && att.url) {
                      return (
                        <a
                          key={att.id}
                          href={att.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block overflow-hidden rounded-md border border-border bg-muted/30"
                        >
                          <img
                            src={att.url}
                            alt={name}
                            className="aspect-square w-full object-cover"
                          />
                        </a>
                      );
                    }
                    if (att.type === "VIDEO" && att.url) {
                      return (
                        <video
                          key={att.id}
                          src={att.url}
                          controls
                          className="aspect-square w-full rounded-md border border-border bg-black object-cover"
                        />
                      );
                    }
                    if (att.type === "AUDIO" && att.url) {
                      return (
                        <audio
                          key={att.id}
                          src={att.url}
                          controls
                          className="col-span-2 w-full sm:col-span-3"
                        />
                      );
                    }
                    return (
                      <a
                        key={att.id}
                        href={att.url ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="flex aspect-square flex-col items-center justify-center gap-2 rounded-md border border-border bg-muted/30 p-3 text-center text-xs text-muted-foreground hover:bg-muted/50"
                      >
                        <FileText className="h-6 w-6" />
                        <span className="line-clamp-3 break-all">{name}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
            {viewPost && (
              <div className="space-y-2 pt-2 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground">Comments</h3>
                <CommentsTree postId={viewPost.id} />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeletePostModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        post={deletePostState}
        onConfirm={handleDeleteConfirm}
      />
      {deleting && null}
    </AdminLayout>
  );
}
