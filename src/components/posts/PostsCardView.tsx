import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Edit, Pin, Trash2, ToggleLeft, ToggleRight, Globe, Users, Image as ImageIcon, Video, FileText } from "lucide-react";
import { Post } from "@/types/posts";

interface PostsCardViewProps {
  posts: Post[];
  onOpenDrawer: (post: Post) => void;
  onEdit: (post: Post) => void;
  onTogglePublish: (post: Post) => void;
  onTogglePin: (post: Post) => void;
  onDelete: (post: Post) => void;
}

const statusMap = {
  published: "active" as const,
  draft: "inactive" as const,
  scheduled: "pending" as const,
  archived: "inactive" as const,
  removed: "inactive" as const,
  pending_review: "pending" as const,
};

export function PostsCardView({
  posts,
  onOpenDrawer,
  onEdit,
  onTogglePublish,
  onTogglePin,
  onDelete,
}: PostsCardViewProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16">
        <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold text-foreground">No posts yet</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Create your first post to engage members
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <Card
          key={post.id}
          className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5"
          onClick={() => onOpenDrawer(post)}
        >
          {/* Image Banner */}
          {post.media === "image" && (
            <div className="relative h-40 overflow-hidden rounded-t-lg bg-muted">
              <div className="flex h-full items-center justify-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              </div>
              {post.pinned && (
                <div className="absolute right-2 top-2 rounded-full bg-primary p-1.5">
                  <Pin className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
              )}
            </div>
          )}
          {post.media === "video" && (
            <div className="relative h-40 overflow-hidden rounded-t-lg bg-muted">
              <div className="flex h-full items-center justify-center">
                <Video className="h-12 w-12 text-muted-foreground" />
              </div>
              {post.pinned && (
                <div className="absolute right-2 top-2 rounded-full bg-primary p-1.5">
                  <Pin className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
              )}
            </div>
          )}

          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground line-clamp-2">{post.title}</h3>
              {post.pinned && post.media !== "image" && post.media !== "video" && (
                <Pin className="h-4 w-4 flex-shrink-0 text-primary" />
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
          </CardHeader>

          <CardContent className="pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge variant={statusMap[post.status]} className="text-xs">
                {post.status.replace("_", " ")}
              </StatusBadge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {post.visibility === "public" ? (
                  <Globe className="h-3.5 w-3.5" />
                ) : (
                  <Users className="h-3.5 w-3.5" />
                )}
                <span className="capitalize">{post.visibility}</span>
              </div>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{post.author}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{post.publishedAt || "Draft"}</span>
            </div>
          </CardContent>

          <CardFooter
            className="border-t border-border pt-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex w-full justify-between gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => onEdit(post)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => onTogglePublish(post)}
              >
                {post.status === "published" ? (
                  <ToggleLeft className="h-4 w-4" />
                ) : (
                  <ToggleRight className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => onTogglePin(post)}
              >
                <Pin className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-destructive hover:text-destructive"
                onClick={() => onDelete(post)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
