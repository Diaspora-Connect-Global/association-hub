import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Pin,
  Trash2,
  Clock,
  Image,
  Video,
  Link2,
  FileText,
  Globe,
  Users,
  MessageCircle,
  Heart,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Post } from "@/types/posts";

interface PostsTableProps {
  posts: Post[];
  selectedPosts: string[];
  onSelectPost: (postId: string) => void;
  onSelectAll: () => void;
  onOpenDrawer: (post: Post) => void;
  onEdit: (post: Post) => void;
  onTogglePublish: (post: Post) => void;
  onSchedule: (post: Post) => void;
  onTogglePin: (post: Post) => void;
  onDelete: (post: Post) => void;
}

const mediaIcons = {
  none: FileText,
  text: FileText,
  image: Image,
  video: Video,
  link: Link2,
};

const statusMap = {
  published: "active" as const,
  draft: "inactive" as const,
  scheduled: "pending" as const,
  archived: "inactive" as const,
  removed: "inactive" as const,
  pending_review: "pending" as const,
};

export function PostsTable({
  posts,
  selectedPosts,
  onSelectPost,
  onSelectAll,
  onOpenDrawer,
  onEdit,
  onTogglePublish,
  onSchedule,
  onTogglePin,
  onDelete,
}: PostsTableProps) {
  const allSelected = posts.length > 0 && selectedPosts.length === posts.length;
  const someSelected = selectedPosts.length > 0 && selectedPosts.length < posts.length;

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
    <div className="rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onSelectAll}
                aria-label="Select all posts"
                className={someSelected ? "opacity-50" : ""}
              />
            </TableHead>
            <TableHead className="w-24">Status</TableHead>
            <TableHead className="min-w-[300px]">Title / Excerpt</TableHead>
            <TableHead className="w-20">Media</TableHead>
            <TableHead className="w-32">Author</TableHead>
            <TableHead className="w-24">Visibility</TableHead>
            <TableHead className="w-28">Engagement</TableHead>
            <TableHead className="w-32">Published At</TableHead>
            <TableHead className="w-16">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => {
            const MediaIcon = mediaIcons[post.media] || FileText;
            const isSelected = selectedPosts.includes(post.id);

            return (
              <TableRow
                key={post.id}
                className="cursor-pointer"
                onClick={() => onOpenDrawer(post)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onSelectPost(post.id)}
                    aria-label={`Select ${post.title}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <StatusBadge variant={statusMap[post.status]}>
                      {post.status.replace("_", " ")}
                    </StatusBadge>
                    {post.pinned && <Pin className="h-3.5 w-3.5 text-primary" />}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground line-clamp-1">{post.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <MediaIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs capitalize text-muted-foreground">{post.media}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {post.authorAvatar}
                    </div>
                    <span className="text-sm">{post.author}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {post.visibility === "public" ? (
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Users className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-xs capitalize text-muted-foreground">
                      {post.visibility}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs">{post.reactions}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs">{post.comments}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{post.publishedAt || "—"}</span>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onOpenDrawer(post)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Open Drawer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(post)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onTogglePublish(post)}>
                        {post.status === "published" ? (
                          <>
                            <ToggleLeft className="mr-2 h-4 w-4" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <ToggleRight className="mr-2 h-4 w-4" />
                            Publish
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSchedule(post)}>
                        <Clock className="mr-2 h-4 w-4" />
                        Schedule
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onTogglePin(post)}>
                        <Pin className="mr-2 h-4 w-4" />
                        {post.pinned ? "Unpin" : "Pin to Top"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(post)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
