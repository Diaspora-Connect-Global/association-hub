import { useState } from "react";
import { Ticket, TicketComment, TicketStatus, TicketPriority } from "@/types/tickets";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  UserCog, 
  Edit, 
  CheckCircle, 
  Bell, 
  Send,
  Paperclip,
  MessageCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TicketDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket | null;
  onAssign: (ticket: Ticket) => void;
  onChangeStatus: (ticket: Ticket) => void;
  onClose: (ticket: Ticket) => void;
}

const statusColors: Record<TicketStatus, "default" | "secondary" | "outline" | "destructive"> = {
  open: "destructive",
  in_progress: "default",
  resolved: "secondary",
  closed: "outline",
};

const priorityColors: Record<TicketPriority, "default" | "secondary" | "outline" | "destructive"> = {
  low: "outline",
  medium: "secondary",
  high: "default",
  urgent: "destructive",
};

// Mock comments
const mockComments: TicketComment[] = [
  {
    id: "c1",
    ticketId: "1",
    authorId: "admin1",
    authorName: "Support Admin",
    content: "Thank you for reaching out. We're looking into this issue.",
    isInternal: false,
    createdAt: "Dec 1, 2024 10:30 AM",
  },
  {
    id: "c2",
    ticketId: "1",
    authorId: "admin1",
    authorName: "Support Admin",
    content: "Internal note: Escalated to technical team.",
    isInternal: true,
    createdAt: "Dec 1, 2024 11:00 AM",
  },
];

export function TicketDetailsModal({
  open,
  onOpenChange,
  ticket,
  onAssign,
  onChangeStatus,
  onClose,
}: TicketDetailsModalProps) {
  const [newComment, setNewComment] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  if (!ticket) return null;

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    toast({
      title: "Comment Added",
      description: isInternal ? "Internal note added." : "Comment sent to user.",
    });
    setNewComment("");
  };

  const handleNotifyUser = () => {
    toast({
      title: "User Notified",
      description: "A notification has been sent to the user.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Ticket #{ticket.id}
            <Badge variant={statusColors[ticket.status]} className="capitalize">
              {ticket.status.replace("_", " ")}
            </Badge>
            <Badge variant={priorityColors[ticket.priority]} className="capitalize">
              {ticket.priority}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 pb-4">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border border-border bg-muted/30">
              <div>
                <p className="text-xs text-muted-foreground">User</p>
                <p className="text-sm font-medium">{ticket.userName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{ticket.userEmail}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="text-sm font-medium capitalize">{ticket.category.replace("_", " ")}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Assigned To</p>
                <p className="text-sm font-medium">{ticket.assignedToName || "Unassigned"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm font-medium">{ticket.createdAt}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="text-sm font-medium">{ticket.updatedAt}</p>
              </div>
            </div>

            {/* Issue Description */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Subject</h4>
              <p className="text-sm text-foreground">{ticket.subject}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Description</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
            </div>

            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-1.5">
                  <Paperclip className="h-4 w-4" />
                  Attachments
                </h4>
                <div className="flex flex-wrap gap-2">
                  {ticket.attachments.map((attachment, index) => (
                    <Button key={index} variant="outline" size="sm">
                      {attachment}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => onAssign(ticket)}>
                <UserCog className="h-4 w-4 mr-1.5" />
                Assign
              </Button>
              <Button variant="outline" size="sm" onClick={() => onChangeStatus(ticket)}>
                <Edit className="h-4 w-4 mr-1.5" />
                Change Status
              </Button>
              {ticket.status !== "closed" && (
                <Button variant="outline" size="sm" onClick={() => onClose(ticket)}>
                  <CheckCircle className="h-4 w-4 mr-1.5" />
                  Close Ticket
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleNotifyUser}>
                <Bell className="h-4 w-4 mr-1.5" />
                Notify User
              </Button>
            </div>

            <Separator />

            {/* Comments Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4" />
                Comments
              </h4>

              {mockComments.length > 0 ? (
                <div className="space-y-3">
                  {mockComments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-3 rounded-lg border ${
                        comment.isInternal
                          ? "border-yellow-500/30 bg-yellow-500/5"
                          : "border-border bg-muted/30"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={comment.authorPhoto} />
                          <AvatarFallback className="text-[10px]">
                            {comment.authorName.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{comment.authorName}</span>
                            {comment.isInternal && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                Internal
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No comments yet</p>
              )}

              {/* Add Comment */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={2}
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded border-border"
                    />
                    Internal note (not visible to user)
                  </label>
                  <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                    <Send className="h-4 w-4 mr-1.5" />
                    Add Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}