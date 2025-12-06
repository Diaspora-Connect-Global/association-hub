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
  Edit2,
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

  const handleAddMilestone = () => {
    if (!newMilestoneName.trim() || !newMilestonePercent) {
      toast({
        title: "Validation Error",
        description: "Please provide milestone name and percentage.",
        variant: "destructive",
      });
      return;
    }

    const percentage = parseFloat(newMilestonePercent);
    if (percentage <= 0 || percentage > remainingPercentage) {
      toast({
        title: "Invalid Percentage",
        description: `Percentage must be between 1 and ${remainingPercentage}%.`,
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
      title: "Milestone Added",
      description: `"${newMilestoneName}" milestone has been added.`,
    });
  };

  const handleConfirmRelease = (milestoneId: string) => {
    onMilestoneRelease?.(milestoneId);
    setConfirmReleaseId(null);
    toast({
      title: "Funds Released",
      description: "The milestone funds have been released to the vendor.",
    });
  };

  const handleDispute = () => {
    if (!disputeReason.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a reason for the dispute.",
        variant: "destructive",
      });
      return;
    }

    onDispute?.(disputeReason);
    setDisputeDialogOpen(false);
    setDisputeReason("");
    toast({
      title: "Dispute Raised",
      description: "Your dispute has been submitted for review.",
    });
  };

  return (
    <div className="space-y-4">
      {/* Escrow Summary */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-5 w-5 text-primary" />
          <h4 className="font-semibold text-foreground">Escrow Protected</h4>
          <StatusBadge variant={escrowStatusVariants[escrowOrder.status]}>
            {escrowOrder.status.replace("_", " ")}
          </StatusBadge>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Total Amount</p>
            <p className="text-lg font-bold text-foreground">
              {currencySymbol}{escrowOrder.totalAmount.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Held in Escrow</p>
            <p className="text-lg font-bold text-primary">
              {currencySymbol}{escrowOrder.heldAmount.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Released</p>
            <p className="text-lg font-bold text-green-600">
              {currencySymbol}{escrowOrder.releasedAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Release Progress</span>
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
            Milestones ({escrowOrder.milestones.length})
          </h4>
          {isAdmin && remainingPercentage > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddMilestoneOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Milestone
            </Button>
          )}
        </div>

        {escrowOrder.milestones.length === 0 ? (
          <div className="text-center py-8 border border-dashed rounded-lg">
            <DollarSign className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No milestones defined yet.</p>
            {isAdmin && (
              <Button
                variant="link"
                size="sm"
                className="mt-2"
                onClick={() => setAddMilestoneOpen(true)}
              >
                Add the first milestone
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
                        {milestone.status.replace("_", " ")}
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
                          Due: {milestone.dueDate}
                        </span>
                      )}
                      {milestone.releasedAt && (
                        <span className="text-green-600">
                          <CheckCircle2 className="h-3 w-3 inline mr-1" />
                          Released: {milestone.releasedAt}
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
                        Mark Complete
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
                        Confirm & Release
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
            {remainingPercentage}% remaining to be allocated to milestones
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
              <span className="text-muted-foreground">Issue with this order?</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={() => setDisputeDialogOpen(true)}
            >
              Raise Dispute
            </Button>
          </div>
        </>
      )}

      {/* Add Milestone Dialog */}
      <Dialog open={addMilestoneOpen} onOpenChange={setAddMilestoneOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Milestone</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Milestone Name *</label>
              <Input
                placeholder="e.g., Design Approval"
                value={newMilestoneName}
                onChange={(e) => setNewMilestoneName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe what needs to be completed..."
                value={newMilestoneDesc}
                onChange={(e) => setNewMilestoneDesc(e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Percentage (max {remainingPercentage}%) *</label>
                <Input
                  type="number"
                  min={1}
                  max={remainingPercentage}
                  placeholder="e.g., 25"
                  value={newMilestonePercent}
                  onChange={(e) => setNewMilestonePercent(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Due Date</label>
                <Input
                  type="date"
                  value={newMilestoneDueDate}
                  onChange={(e) => setNewMilestoneDueDate(e.target.value)}
                />
              </div>
            </div>
            {newMilestonePercent && (
              <p className="text-sm text-muted-foreground">
                Amount: {currencySymbol}{((parseFloat(newMilestonePercent) / 100) * escrowOrder.totalAmount).toFixed(2)}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddMilestoneOpen(false)}>
              {t.cancel}
            </Button>
            <Button onClick={handleAddMilestone}>Add Milestone</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Release Dialog */}
      <AlertDialog open={!!confirmReleaseId} onOpenChange={() => setConfirmReleaseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Fund Release</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to release the funds for this milestone? This action cannot be undone.
              The vendor will receive the payment once you confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmReleaseId && handleConfirmRelease(confirmReleaseId)}>
              Yes, Release Funds
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
              Raise a Dispute
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please describe the issue with this order. Our team will review your dispute
              and the escrowed funds will be held until resolution.
            </p>
            <Textarea
              placeholder="Describe the problem in detail..."
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
              Submit Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
