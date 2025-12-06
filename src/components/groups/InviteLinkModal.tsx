import { useState } from "react";
import { Group } from "@/types/groups";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Link2, 
  Copy, 
  RefreshCw, 
  Check,
  ExternalLink,
  Clock,
  Users
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface InviteLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: Group | null;
}

export function InviteLinkModal({
  open,
  onOpenChange,
  group,
}: InviteLinkModalProps) {
  const [inviteLinkEnabled, setInviteLinkEnabled] = useState(true);
  const [expiration, setExpiration] = useState("never");
  const [maxUses, setMaxUses] = useState("unlimited");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!group) return null;

  // Mock invite link
  const inviteLink = `https://app.association.com/invite/grp-${group.id}-${Math.random().toString(36).substring(2, 8)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast({
        title: "Link Copied",
        description: "Invite link has been copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRegenerateLink = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Link Regenerated",
        description: "A new invite link has been created. Previous link is now invalid.",
      });
    }, 1000);
  };

  const handleToggleLink = (enabled: boolean) => {
    setInviteLinkEnabled(enabled);
    toast({
      title: enabled ? "Invite Link Enabled" : "Invite Link Disabled",
      description: enabled 
        ? "Anyone with the link can now join this group." 
        : "The invite link is now inactive.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Invite Link
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{group.name}</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
            <div>
              <p className="font-medium text-sm">Enable Invite Link</p>
              <p className="text-xs text-muted-foreground">
                Anyone with the link can join this group
              </p>
            </div>
            <Switch
              checked={inviteLinkEnabled}
              onCheckedChange={handleToggleLink}
            />
          </div>

          {inviteLinkEnabled && (
            <>
              {/* Invite Link Display */}
              <div className="space-y-2">
                <Label>Invite Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={inviteLink}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyLink}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Link Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Expiration
                  </Label>
                  <Select value={expiration} onValueChange={setExpiration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="24h">24 hours</SelectItem>
                      <SelectItem value="7d">7 days</SelectItem>
                      <SelectItem value="30d">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    Max Uses
                  </Label>
                  <Select value={maxUses} onValueChange={setMaxUses}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                      <SelectItem value="1">1 use</SelectItem>
                      <SelectItem value="5">5 uses</SelectItem>
                      <SelectItem value="10">10 uses</SelectItem>
                      <SelectItem value="25">25 uses</SelectItem>
                      <SelectItem value="50">50 uses</SelectItem>
                      <SelectItem value="100">100 uses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleRegenerateLink}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  <RefreshCw className={`h-4 w-4 mr-1.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  Regenerate Link
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(inviteLink, '_blank')}
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-1.5" />
                  Preview
                </Button>
              </div>

              {/* Info */}
              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground">
                  <strong>Note:</strong> Regenerating the link will invalidate the previous one. 
                  Anyone who had the old link will no longer be able to use it to join.
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}