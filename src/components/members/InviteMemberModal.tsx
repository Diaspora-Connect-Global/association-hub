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
import { useT } from "@/hooks/useT";

interface InviteMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMemberModal({ open, onOpenChange }: InviteMemberModalProps) {
  const t = useT();
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    toast({
      title: t.invitationSent,
      description: `${t.inviteSentTo} ${inviteMethod === "email" ? email : phone}`,
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
          <DialogTitle className="label-large text-text-primary">{t.inviteMember}</DialogTitle>
          <DialogDescription className="body-small text-text-secondary">
            {t.shareLinkNote}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="label-small text-text-primary">{t.inviteVia}</Label>
            <Select value={inviteMethod} onValueChange={(v) => setInviteMethod(v as "email" | "phone" | "link")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="surface-default">
                <SelectItem value="email">{t.email}</SelectItem>
                <SelectItem value="phone">{t.phoneNumber}</SelectItem>
                <SelectItem value="link">{t.shareableLink}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {inviteMethod === "email" && (
            <div className="space-y-2">
              <Label className="label-small text-text-primary">{t.emailAddress}</Label>
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
              <Label className="label-small text-text-primary">{t.phoneNumber}</Label>
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
              <Label className="label-small text-text-primary">{t.joinLink}</Label>
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
                {t.shareLinkNote}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {t.cancel}
          </Button>
          {inviteMethod !== "link" && (
            <Button 
              onClick={handleSendInvite} 
              disabled={isLoading || (inviteMethod === "email" ? !email : !phone)}
            >
              {isLoading ? t.sending : t.sendInvite}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
