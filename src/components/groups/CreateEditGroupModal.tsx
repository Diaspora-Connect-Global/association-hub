import { useState } from "react";
import { Group, GroupFormData, GroupPrivacy, NotificationSetting } from "@/types/groups";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Lock, Globe, Bell, BellOff, AtSign } from "lucide-react";

interface CreateEditGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group?: Group | null;
  onSubmit: (data: GroupFormData) => void;
}

export function CreateEditGroupModal({
  open,
  onOpenChange,
  group,
  onSubmit,
}: CreateEditGroupModalProps) {
  const [formData, setFormData] = useState<GroupFormData>({
    name: group?.name || "",
    description: group?.description || "",
    avatar: null,
    privacy: group?.privacy || "private",
    defaultNotifications: group?.defaultNotifications || "all",
  });

  const updateField = <K extends keyof GroupFormData>(field: K, value: GroupFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    onSubmit(formData);
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {group ? "Edit Group" : "Create Group"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name *</Label>
            <Input
              id="name"
              placeholder="Enter a unique group name"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional description about the group"
              rows={3}
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Group Avatar / Icon</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Privacy *</Label>
            <Select
              value={formData.privacy}
              onValueChange={(value: GroupPrivacy) => updateField("privacy", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Private
                  </div>
                </SelectItem>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Public
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {formData.privacy === "private" 
                ? "Only added members can join this group."
                : "Anyone in the association can join this group."}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Default Notifications</Label>
            <Select
              value={formData.defaultNotifications}
              onValueChange={(value: NotificationSetting) => updateField("defaultNotifications", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    All Messages
                  </div>
                </SelectItem>
                <SelectItem value="mentions">
                  <div className="flex items-center gap-2">
                    <AtSign className="h-4 w-4" />
                    Mentions Only
                  </div>
                </SelectItem>
                <SelectItem value="muted">
                  <div className="flex items-center gap-2">
                    <BellOff className="h-4 w-4" />
                    Muted
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.name.trim()}>
            Save Group
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
