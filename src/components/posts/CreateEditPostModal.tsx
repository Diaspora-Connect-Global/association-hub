import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Image as ImageIcon,
  Video,
  X,
  CalendarIcon,
  Upload,
  Eye,
  Save,
  Clock,
  Send,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Post } from "@/types/posts";
import { toast } from "@/hooks/use-toast";

interface CreateEditPostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: Post | null;
  onSave: (post: Partial<Post>, action: "draft" | "publish" | "schedule") => void;
}

export function CreateEditPostModal({
  open,
  onOpenChange,
  post,
  onSave,
}: CreateEditPostModalProps) {
  const isEdit = !!post;
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [visibility, setVisibility] = useState<"members" | "public">("members");
  const [allowComments, setAllowComments] = useState(true);
  const [allowReactions, setAllowReactions] = useState(true);
  const [pinned, setPinned] = useState(false);
  const [notifyMembers, setNotifyMembers] = useState(true);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>();
  const [requireReview, setRequireReview] = useState(false);
  const [contentWarning, setContentWarning] = useState<"none" | "sensitive" | "age_restricted">("none");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Reset form when modal opens/closes or post changes
  useEffect(() => {
    if (open) {
      if (post) {
        setTitle(post.title);
        setBody(post.body || "");
        setTags(post.tags || []);
        setVisibility(post.visibility);
        setAllowComments(post.allowComments);
        setAllowReactions(post.allowReactions);
        setPinned(post.pinned);
        setContentWarning(post.contentWarning || "none");
      } else {
        // Reset to defaults for new post
        setTitle("");
        setBody("");
        setTags([]);
        setVisibility("members");
        setAllowComments(true);
        setAllowReactions(true);
        setPinned(false);
        setNotifyMembers(true);
        setScheduleDate(undefined);
        setRequireReview(false);
        setContentWarning("none");
        setUploadedImages([]);
        setUploadedVideo(null);
      }
    }
  }, [open, post]);

  // Autosave simulation
  useEffect(() => {
    if (open && (title || body)) {
      const interval = setInterval(() => {
        setLastSaved(new Date());
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [open, title, body]);

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 10 && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = (action: "draft" | "publish" | "schedule") => {
    if (action !== "draft" && !title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title before publishing.",
        variant: "destructive",
      });
      return;
    }

    if (action !== "draft" && !body.trim() && uploadedImages.length === 0 && !uploadedVideo) {
      toast({
        title: "Content Required",
        description: "Please add body text or media before publishing.",
        variant: "destructive",
      });
      return;
    }

    const postData: Partial<Post> = {
      title,
      body,
      tags,
      visibility,
      allowComments,
      allowReactions,
      pinned,
      contentWarning,
      media: uploadedVideo ? "video" : uploadedImages.length > 0 ? "image" : "text",
      status: action === "draft" ? "draft" : action === "schedule" ? "scheduled" : "published",
      scheduledAt: action === "schedule" && scheduleDate ? scheduleDate.toISOString() : null,
    };

    onSave(postData, action);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>{isEdit ? "Edit Post" : "Create Post"}</DialogTitle>
          {lastSaved && (
            <p className="text-xs text-muted-foreground">
              Draft saved at {format(lastSaved, "h:mm a")}
            </p>
          )}
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <Tabs defaultValue="content" className="px-6">
            <TabsList className="mb-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="options">Options</TabsTrigger>
              <TabsTrigger value="moderation">Moderation</TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Short, descriptive title (max 150 chars)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, 150))}
                  maxLength={150}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {title.length}/150
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Body</Label>
                <Textarea
                  id="body"
                  placeholder="Write your post here... Use @ to mention, # for tags"
                  value={body}
                  onChange={(e) => setBody(e.target.value.slice(0, 5000))}
                  rows={8}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {body.length}/5000
                </p>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" variant="secondary" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">{tags.length}/10 tags</p>
              </div>

              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select value={visibility} onValueChange={(v) => setVisibility(v as "members" | "public")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="members">Members Only</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Members limits visibility to association members only
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Comments</Label>
                  <p className="text-xs text-muted-foreground">Let members comment on this post</p>
                </div>
                <Switch checked={allowComments} onCheckedChange={setAllowComments} />
              </div>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-4">
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <Upload className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                <p className="mb-2 font-medium">Upload Images or Video</p>
                <p className="mb-4 text-sm text-muted-foreground">
                  Max 8 images (10MB each) or 1 video (500MB). Cannot mix both.
                </p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" className="gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Upload Images
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Video className="h-4 w-4" />
                    Upload Video
                  </Button>
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm font-medium mb-2">Accessibility Requirement</p>
                <p className="text-xs text-muted-foreground">
                  All images require alt text for accessibility. You'll be prompted to add descriptions after upload.
                </p>
              </div>
            </TabsContent>

            {/* Options Tab */}
            <TabsContent value="options" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Pin to Top</Label>
                  <p className="text-xs text-muted-foreground">
                    Only one pinned post allowed. Pinning will unpin previous.
                  </p>
                </div>
                <Checkbox checked={pinned} onCheckedChange={(c) => setPinned(!!c)} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Reactions</Label>
                  <p className="text-xs text-muted-foreground">Let members react to this post</p>
                </div>
                <Switch checked={allowReactions} onCheckedChange={setAllowReactions} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notify Members</Label>
                  <p className="text-xs text-muted-foreground">
                    Send in-app & email notifications based on preferences
                  </p>
                </div>
                <Switch checked={notifyMembers} onCheckedChange={setNotifyMembers} />
              </div>

              <div className="space-y-2">
                <Label>Schedule Publish</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !scheduleDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduleDate ? format(scheduleDate, "PPP 'at' p") : "Set schedule (optional)"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={scheduleDate} onSelect={setScheduleDate} />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">
                  Set a future date/time to auto-publish
                </p>
              </div>
            </TabsContent>

            {/* Moderation Tab */}
            <TabsContent value="moderation" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Review Before Publish</Label>
                  <p className="text-xs text-muted-foreground">
                    Post will be pending until approved
                  </p>
                </div>
                <Switch checked={requireReview} onCheckedChange={setRequireReview} />
              </div>

              <div className="space-y-2">
                <Label>Content Warning</Label>
                <Select value={contentWarning} onValueChange={(v) => setContentWarning(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="sensitive">Contains Sensitive Content</SelectItem>
                    <SelectItem value="age_restricted">Age 18+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {contentWarning !== "none" && (
                <div className="flex items-start gap-2 rounded-lg bg-warning/10 p-3">
                  <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Posts with content warnings will display a warning before showing content
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t border-border">
          <div className="flex w-full justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button variant="ghost" className="gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" className="gap-2" onClick={() => handleSubmit("draft")}>
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
              {scheduleDate && (
                <Button variant="secondary" className="gap-2" onClick={() => handleSubmit("schedule")}>
                  <Clock className="h-4 w-4" />
                  Schedule
                </Button>
              )}
              <Button className="gap-2" onClick={() => handleSubmit("publish")}>
                <Send className="h-4 w-4" />
                Publish
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
