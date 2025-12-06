import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit,
  Pin,
  ToggleLeft,
  ToggleRight,
  BarChart3,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  EyeOff,
  Trash2,
  Flag,
  FileText,
  Globe,
  Users,
  Calendar,
  Clock,
} from "lucide-react";
import { Post, Comment } from "@/types/posts";

interface PostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
  comments: Comment[];
  onEdit: () => void;
  onTogglePublish: () => void;
  onTogglePin: () => void;
  onHide: () => void;
  onDelete: () => void;
  onOpenAnalytics: () => void;
}

const statusMap = {
  published: "active" as const,
  draft: "inactive" as const,
  scheduled: "pending" as const,
  archived: "inactive" as const,
  removed: "inactive" as const,
  pending_review: "pending" as const,
};

export function PostModal({
  open,
  onOpenChange,
  post,
  comments,
  onEdit,
  onTogglePublish,
  onTogglePin,
  onHide,
  onDelete,
  onOpenAnalytics,
}: PostModalProps) {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl line-clamp-2">{post.title}</DialogTitle>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge variant={statusMap[post.status]}>
                  {post.status.replace("_", " ")}
                </StatusBadge>
                {post.pinned && (
                  <Badge variant="secondary" className="gap-1">
                    <Pin className="h-3 w-3" />
                    Pinned
                  </Badge>
                )}
                <Badge variant="outline" className="gap-1">
                  {post.visibility === "public" ? (
                    <Globe className="h-3 w-3" />
                  ) : (
                    <Users className="h-3 w-3" />
                  )}
                  {post.visibility}
                </Badge>
              </div>
            </div>
          </div>

          {/* Author & Date */}
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {post.authorAvatar}
              </div>
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {post.publishedAt || post.createdAt}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={onEdit}>
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={onTogglePublish}>
              {post.status === "published" ? (
                <>
                  <ToggleLeft className="h-4 w-4" />
                  Unpublish
                </>
              ) : (
                <>
                  <ToggleRight className="h-4 w-4" />
                  Publish
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={onTogglePin}>
              <Pin className="h-4 w-4" />
              {post.pinned ? "Unpin" : "Pin"}
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={onOpenAnalytics}>
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
          </div>
        </DialogHeader>

        <Separator />

        <ScrollArea className="flex-1 px-6 pb-6">
          <Tabs defaultValue="content" className="mt-4">
            <TabsList className="mb-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="moderation">Moderation</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground">{post.excerpt}</p>
                {post.body && (
                  <div className="mt-4 rounded-lg bg-muted/50 p-4">
                    <p className="whitespace-pre-wrap">{post.body}</p>
                  </div>
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Media Placeholder */}
              {(post.media === "image" || post.media === "video") && (
                <div className="rounded-lg bg-muted/50 p-8 text-center">
                  <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {post.media === "image" ? "Image gallery" : "Video player"} would appear here
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Engagement Tab */}
            <TabsContent value="engagement" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border p-4 text-center">
                  <Heart className="mx-auto mb-2 h-6 w-6 text-primary" />
                  <p className="text-2xl font-semibold">{post.reactions}</p>
                  <p className="text-xs text-muted-foreground">Reactions</p>
                </div>
                <div className="rounded-lg border border-border p-4 text-center">
                  <MessageCircle className="mx-auto mb-2 h-6 w-6 text-primary" />
                  <p className="text-2xl font-semibold">{post.comments}</p>
                  <p className="text-xs text-muted-foreground">Comments</p>
                </div>
                <div className="rounded-lg border border-border p-4 text-center">
                  <Bookmark className="mx-auto mb-2 h-6 w-6 text-primary" />
                  <p className="text-2xl font-semibold">{post.saves || 0}</p>
                  <p className="text-xs text-muted-foreground">Saves</p>
                </div>
                <div className="rounded-lg border border-border p-4 text-center">
                  <Share2 className="mx-auto mb-2 h-6 w-6 text-primary" />
                  <p className="text-2xl font-semibold">0</p>
                  <p className="text-xs text-muted-foreground">Shares</p>
                </div>
              </div>

              {/* Comments Preview */}
              <div className="space-y-2">
                <h4 className="font-medium">Recent Comments</h4>
                {comments.length > 0 ? (
                  <div className="space-y-2">
                    {comments.slice(0, 5).map((comment) => (
                      <div key={comment.id} className="rounded-lg border border-border p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No comments yet</p>
                )}
              </div>
            </TabsContent>

            {/* Moderation Tab */}
            <TabsContent value="moderation" className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2" onClick={onHide}>
                  <EyeOff className="h-4 w-4" />
                  Hide Post
                  <span className="ml-auto text-xs text-muted-foreground">
                    Removes from feed, keeps record
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Post
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Flag className="h-4 w-4" />
                  View All Flags
                  <Badge variant="secondary" className="ml-auto">
                    0
                  </Badge>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  Add Note
                </Button>
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Post created</p>
                    <p className="text-xs text-muted-foreground">{post.createdAt} by {post.author}</p>
                  </div>
                </div>
                {post.publishedAt && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <ToggleRight className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Post published</p>
                      <p className="text-xs text-muted-foreground">{post.publishedAt}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <Edit className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last updated</p>
                    <p className="text-xs text-muted-foreground">{post.updatedAt}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Version History</h4>
                <p className="text-sm text-muted-foreground">
                  Last 10 versions are kept. Click to view or restore.
                </p>
                <Button variant="link" className="px-0 text-sm">
                  View version history →
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}