import { useState } from "react";
import { Milestone, EscrowOrder, EscrowStatus, MilestoneStatus } from "@/types/escrow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CheckCircle2,
  Clock,
  DollarSign,
  Plus,
  Shield,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useT } from "@/hooks/useT";

interface EscrowMilestonesSectionProps {
  escrowOrder: EscrowOrder;
  isAdmin?: boolean;
  isBuyer?: boolean;
  onMilestoneComplete?: (milestoneId: string) => void;
  onMilestoneRelease?: (milestoneId: string) => void;
  onAddMilestone?: (milestone: Omit<Milestone, "id" | "orderId" | "status" | "amount" | "confirmedByBuyer" | "createdAt">) => void;
  onDeleteMilestone?: (milestoneId: string) => void;
  onDispute?: (reason: string) => void;
}

const statusVariants: Record<MilestoneStatus, "active" | "pending" | "warning" | "error" | "inactive" | "success"> = {
  pending: "inactive",
  in_progress: "pending",
  completed: "warning",
  released: "active",
  disputed: "error",
};

const escrowStatusVariants: Record<EscrowStatus, "active" | "pending" | "warning" | "error" | "inactive" | "success"> = {
  held: "pending",
  partially_released: "warning",
  fully_released: "active",
  disputed: "error",
  refunded: "inactive",
};

export function EscrowMilestonesSection({
  escrowOrder,
  isAdmin = false,
  isBuyer = false,
  onMilestoneComplete,
  onMilestoneRelease,
  onAddMilestone,
  onDeleteMilestone,
  onDispute,
}: EscrowMilestonesSectionProps) {
  const t = useT();
  const [addMilestoneOpen, setAddMilestoneOpen] = useState(false);
  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false);
  const [confirmReleaseId, setConfirmReleaseId] = useState<string | null>(null);
  
  // Form states
  const [newMilestoneName, setNewMilestoneName] = useState("");
  const [newMilestoneDesc, setNewMilestoneDesc] = useState("");
  const [newMilestonePercent, setNewMilestonePercent] = useState("");
  const [newMilestoneDueDate, setNewMilestoneDueDate] = useState("");
  const [disputeReason, setDisputeReason] = useState("");

  const releasedPercentage = escrowOrder.milestones
    .filter((m) => m.status === "released")
    .reduce((sum, m) => sum + m.percentage, 0);

  const totalMilestonePercentage = escrowOrder.milestones.reduce((sum, m) => sum + m.percentage, 0);
  const remainingPercentage = 100 - totalMilestonePercentage;

  const currencySymbol = escrowOrder.currency === "USD" ? "$" : escrowOrder.currency === "EUR" ? "€" : "₵";

  // Status label helper
  const getStatusLabel = (status: MilestoneStatus): string => {
    switch (status) {
      case "pending": return t.pendingMilestone;
      case "in_progress": return t.inProgressMilestone;
      case "completed": return t.completedMilestone;
      case "released": return t.releasedMilestone;
      case "disputed": return t.disputedMilestone;
      default: return status;
    }
  };

  const getEscrowStatusLabel = (status: EscrowStatus): string => {
    switch (status) {
      case "held": return t.held;
      case "partially_released": return t.partiallyReleased;
      case "fully_released": return t.fullyReleased;
      case "disputed": return t.disputed;
      case "refunded": return t.refunded;
      default: return status;
    }
  };

  const handleAddMilestone = () => {
    if (!newMilestoneName.trim() || !newMilestonePercent) {
      toast({
        title: t.error,
        description: t.milestoneName + " & " + t.milestonePercentage,
        variant: "destructive",
      });
      return;
    }

    const percentage = parseFloat(newMilestonePercent);
    if (percentage <= 0 || percentage > remainingPercentage) {
      toast({
        title: t.error,
        description: `${t.milestonePercentage}: 1-${remainingPercentage}%`,
        variant: "destructive",
      });
      return;
    }

    onAddMilestone?.({
      name: newMilestoneName,
      description: newMilestoneDesc || undefined,
      percentage,
      dueDate: newMilestoneDueDate || undefined,
    });

    setNewMilestoneName("");
    setNewMilestoneDesc("");
    setNewMilestonePercent("");
    setNewMilestoneDueDate("");
    setAddMilestoneOpen(false);

    toast({
      title: t.success,
      description: `"${newMilestoneName}" ${t.addMilestone}`,
    });
  };

  const handleConfirmRelease = (milestoneId: string) => {
    onMilestoneRelease?.(milestoneId);
    setConfirmReleaseId(null);
    toast({
      title: t.success,
      description: t.releasePayment,
    });
  };

  const handleDispute = () => {
    if (!disputeReason.trim()) {
      toast({
        title: t.error,
        description: t.disputeReason,
        variant: "destructive",
      });
      return;
    }

    onDispute?.(disputeReason);
    setDisputeDialogOpen(false);
    setDisputeReason("");
    toast({
      title: t.success,
      description: t.raiseDispute,
    });
  };

  return (
    <div className="space-y-4">
      {/* Escrow Summary */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-5 w-5 text-primary" />
          <h4 className="font-semibold text-foreground">{t.escrowProtection}</h4>
          <StatusBadge variant={escrowStatusVariants[escrowOrder.status]}>
            {getEscrowStatusLabel(escrowOrder.status)}
          </StatusBadge>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">{t.total}</p>
            <p className="text-lg font-bold text-foreground">
              {currencySymbol}{escrowOrder.totalAmount.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">{t.heldAmount}</p>
            <p className="text-lg font-bold text-primary">
              {currencySymbol}{escrowOrder.heldAmount.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">{t.releasedAmount}</p>
            <p className="text-lg font-bold text-green-600">
              {currencySymbol}{escrowOrder.releasedAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{t.releasePayment}</span>
            <span>{releasedPercentage}%</span>
          </div>
          <Progress value={releasedPercentage} className="h-2" />
        </div>
      </div>

      <Separator />

      {/* Milestones List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t.milestones} ({escrowOrder.milestones.length})
          </h4>
          {isAdmin && remainingPercentage > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddMilestoneOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              {t.addMilestone}
            </Button>
          )}
        </div>

        {escrowOrder.milestones.length === 0 ? (
          <div className="text-center py-8 border border-dashed rounded-lg">
            <DollarSign className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">{t.milestones}</p>
            {isAdmin && (
              <Button
                variant="link"
                size="sm"
                className="mt-2"
                onClick={() => setAddMilestoneOpen(true)}
              >
                {t.addMilestone}
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {escrowOrder.milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className="p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        #{index + 1}
                      </span>
                      <h5 className="font-medium text-foreground">{milestone.name}</h5>
                      <StatusBadge variant={statusVariants[milestone.status]}>
                        {getStatusLabel(milestone.status)}
                      </StatusBadge>
                    </div>
                    {milestone.description && (
                      <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        <DollarSign className="h-3 w-3 inline" />
                        {currencySymbol}{milestone.amount.toFixed(2)} ({milestone.percentage}%)
                      </span>
                      {milestone.dueDate && (
                        <span className="text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {milestone.dueDate}
                        </span>
                      )}
                      {milestone.releasedAt && (
                        <span className="text-green-600">
                          <CheckCircle2 className="h-3 w-3 inline mr-1" />
                          {t.releasedMilestone}: {milestone.releasedAt}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Admin can mark as complete */}
                    {isAdmin && milestone.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onMilestoneComplete?.(milestone.id)}
                      >
                        {t.completedMilestone}
                      </Button>
                    )}

                    {/* Buyer can confirm release */}
                    {isBuyer && milestone.status === "completed" && !milestone.confirmedByBuyer && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setConfirmReleaseId(milestone.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        {t.confirmRelease}
                      </Button>
                    )}

                    {/* Admin can delete pending milestones */}
                    {isAdmin && milestone.status === "pending" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onDeleteMilestone?.(milestone.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {remainingPercentage > 0 && escrowOrder.milestones.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            {remainingPercentage}% {t.milestonePercentage}
          </p>
        )}
      </div>

      {/* Dispute Section */}
      {isBuyer && escrowOrder.status !== "disputed" && escrowOrder.status !== "refunded" && (
        <>
          <Separator />
          <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20">
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-muted-foreground">{t.disputeOrder}?</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={() => setDisputeDialogOpen(true)}
            >
              {t.raiseDispute}
            </Button>
          </div>
        </>
      )}

      {/* Add Milestone Dialog */}
      <Dialog open={addMilestoneOpen} onOpenChange={setAddMilestoneOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.addMilestone}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">{t.milestoneName} *</label>
              <Input
                placeholder={t.milestoneName}
                value={newMilestoneName}
                onChange={(e) => setNewMilestoneName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t.milestoneDescription}</label>
              <Textarea
                placeholder={t.milestoneDescription}
                value={newMilestoneDesc}
                onChange={(e) => setNewMilestoneDesc(e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">{t.milestonePercentage} (max {remainingPercentage}%) *</label>
                <Input
                  type="number"
                  min={1}
                  max={remainingPercentage}
                  placeholder="25"
                  value={newMilestonePercent}
                  onChange={(e) => setNewMilestonePercent(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t.date}</label>
                <Input
                  type="date"
                  value={newMilestoneDueDate}
                  onChange={(e) => setNewMilestoneDueDate(e.target.value)}
                />
              </div>
            </div>
            {newMilestonePercent && (
              <p className="text-sm text-muted-foreground">
                {t.total}: {currencySymbol}{((parseFloat(newMilestonePercent) / 100) * escrowOrder.totalAmount).toFixed(2)}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddMilestoneOpen(false)}>
              {t.cancel}
            </Button>
            <Button onClick={handleAddMilestone}>{t.addMilestone}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Release Dialog */}
      <AlertDialog open={!!confirmReleaseId} onOpenChange={() => setConfirmReleaseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.confirmRelease}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.releasePayment}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmReleaseId && handleConfirmRelease(confirmReleaseId)}>
              {t.confirmRelease}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dispute Dialog */}
      <Dialog open={disputeDialogOpen} onOpenChange={setDisputeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {t.raiseDispute}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t.disputeReason}
            </p>
            <Textarea
              placeholder={t.disputeReason}
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisputeDialogOpen(false)}>
              {t.cancel}
            </Button>
            <Button variant="destructive" onClick={handleDispute}>
              {t.raiseDispute}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
