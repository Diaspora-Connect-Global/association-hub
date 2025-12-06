import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, MessageCircle, Bookmark, Eye, Flag, Lightbulb, ExternalLink } from "lucide-react";
import { Post, Comment } from "@/types/posts";

interface PostAnalyticsWidgetProps {
  selectedPost: Post | null;
  recentComments: Comment[];
  onOpenModerationQueue: () => void;
}

export function PostAnalyticsWidget({
  selectedPost,
  recentComments,
  onOpenModerationQueue,
}: PostAnalyticsWidgetProps) {
  return (
    <div className="w-80 flex-shrink-0 space-y-4">
      {/* Post Analytics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            Post Analytics {selectedPost ? `(${selectedPost.title.slice(0, 20)}...)` : "(Select a post)"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedPost ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Heart className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-semibold">{selectedPost.reactions}</p>
                  <p className="text-xs text-muted-foreground">Reactions</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <MessageCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-semibold">{selectedPost.comments}</p>
                  <p className="text-xs text-muted-foreground">Comments</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Bookmark className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-semibold">{selectedPost.saves || 0}</p>
                  <p className="text-xs text-muted-foreground">Saves</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Eye className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-semibold">{selectedPost.impressions || 0}</p>
                  <p className="text-xs text-muted-foreground">Impressions</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Click on a post to view its analytics
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent Comments / Moderation Queue */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Recent Comments</CardTitle>
            <Button variant="ghost" size="sm" onClick={onOpenModerationQueue}>
              <Flag className="mr-1 h-3.5 w-3.5" />
              Queue
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            {recentComments.length > 0 ? (
              <div className="space-y-3">
                {recentComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-lg border border-border p-2.5"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-medium">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {comment.createdAt}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {comment.content}
                    </p>
                    {comment.flagged && (
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-warning">
                        <Flag className="h-3 w-3" />
                        Flagged
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent comments</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Best posting times: Tuesdays 10:00-12:00
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Recommended image size: 1200x630px
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Add alt text for accessibility
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Image posts get 2x more engagement
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
