import { useState } from "react";
import { TicketFormData, TicketCategory, TicketPriority } from "@/types/tickets";
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
import { Loader2, Paperclip, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useT } from "@/hooks/useT";

interface CreateTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TicketFormData) => void;
}

export function CreateTicketModal({
  open,
  onOpenChange,
  onSubmit,
}: CreateTicketModalProps) {
  const t = useT();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TicketFormData>({
    userName: "",
    userEmail: "",
    category: "general",
    priority: "medium",
    subject: "",
    description: "",
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  const categoryOptions: { value: TicketCategory; label: string }[] = [
    { value: "technical", label: t.technical },
    { value: "billing", label: t.billing },
    { value: "product_inquiry", label: t.productInquiry },
    { value: "general", label: t.general },
  ];

  const priorityOptions: { value: TicketPriority; label: string }[] = [
    { value: "low", label: t.low },
    { value: "medium", label: t.medium },
    { value: "high", label: t.high },
    { value: "urgent", label: t.urgent },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.userName || !formData.userEmail || !formData.subject || !formData.description) {
      toast({
        title: t.validationError,
        description: t.fillRequiredFields,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({ ...formData, attachments });
      setIsSubmitting(false);
      onOpenChange(false);
      resetForm();
      toast({
        title: t.ticketCreated,
        description: t.ticketCreatedDesc,
      });
    }, 1000);
  };

  const resetForm = () => {
    setFormData({
      userName: "",
      userEmail: "",
      category: "general",
      priority: "medium",
      subject: "",
      description: "",
    });
    setAttachments([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.createSupportTicket}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userName">{t.userName} *</Label>
              <Input
                id="userName"
                placeholder={t.enterUserName}
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userEmail">{t.email} *</Label>
              <Input
                id="userEmail"
                type="email"
                placeholder={t.enterUserEmail}
                value={formData.userEmail}
                onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t.category} *</Label>
              <Select
                value={formData.category}
                onValueChange={(value: TicketCategory) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t.priority} *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: TicketPriority) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">{t.subject} *</Label>
            <Input
              id="subject"
              placeholder={t.briefSummary}
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t.description} *</Label>
            <Textarea
              id="description"
              placeholder={t.detailedExplanation}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>{t.attachments}</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Paperclip className="h-4 w-4 mr-1.5" />
                {t.addFiles}
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted text-xs"
                  >
                    <span className="max-w-[150px] truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
              {t.createTicket}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}