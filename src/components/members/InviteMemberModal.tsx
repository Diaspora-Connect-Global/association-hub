import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface InviteMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMemberModal({ open, onOpenChange }: InviteMemberModalProps) {
  const [inviteMethod, setInviteMethod] = useState<"email" | "phone" | "link">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inviteLink = "https://app.example.com/join/abc123xyz";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    toast({
      title: "Invitation sent successfully",
      description: inviteMethod === "email" 
        ? `Invite sent to ${email}` 
        : `Invite sent to ${phone}`,
    });
    
    onOpenChange(false);
    setEmail("");
    setPhone("");
  };

  const handleClose = () => {
    onOpenChange(false);
    setEmail("");
    setPhone("");
    setInviteMethod("email");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md surface-default">
        <DialogHeader>
          <DialogTitle className="label-large text-text-primary">Invite Member</DialogTitle>
          <DialogDescription className="body-small text-text-secondary">
            Send an invitation to join your association.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="label-small text-text-primary">Invite Via</Label>
            <Select value={inviteMethod} onValueChange={(v) => setInviteMethod(v as "email" | "phone" | "link")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="surface-default">
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone Number</SelectItem>
                <SelectItem value="link">Shareable Link</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {inviteMethod === "email" && (
            <div className="space-y-2">
              <Label className="label-small text-text-primary">Email Address</Label>
              <Input
                type="email"
                placeholder="member@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          {inviteMethod === "phone" && (
            <div className="space-y-2">
              <Label className="label-small text-text-primary">Phone Number</Label>
              <Input
                type="tel"
                placeholder="+233 55 555 5555"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          )}

          {inviteMethod === "link" && (
            <div className="space-y-2">
              <Label className="label-small text-text-primary">Join Link</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={inviteLink}
                  className="flex-1 surface-subtle"
                />
                <Button variant="outline" size="icon" onClick={handleCopyLink}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="caption-small text-text-secondary">
                Share this link with anyone you want to invite.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {inviteMethod !== "link" && (
            <Button 
              onClick={handleSendInvite} 
              disabled={isLoading || (inviteMethod === "email" ? !email : !phone)}
            >
              {isLoading ? "Sending..." : "Send Invite"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
