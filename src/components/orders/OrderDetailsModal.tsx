import { useState } from "react";
import { Order } from "@/types/marketplace";
import { EscrowOrder, Milestone } from "@/types/escrow";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EscrowMilestonesSection } from "./EscrowMilestonesSection";
import { 
  CheckCircle, 
  RefreshCw, 
  XCircle, 
  Bell,
  Package,
  User,
  Mail,
  Phone,
  Shield,
} from "lucide-react";
import { useT } from "@/hooks/useT";

interface OrderDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onMarkFulfilled: (order: Order) => void;
  onRefund: (order: Order) => void;
  onCancel: (order: Order) => void;
  onNotify: (order: Order, message: string) => void;
}

// Mock escrow data - in production this would come from the backend
const getMockEscrowOrder = (order: Order): EscrowOrder | null => {
  if (!order.isEscrow) return null;
  
  return {
    id: `ESC-${order.id}`,
    orderId: order.id,
    totalAmount: order.totalAmount,
    heldAmount: order.escrowHeldAmount ?? order.totalAmount * 0.5,
    releasedAmount: order.escrowReleasedAmount ?? order.totalAmount * 0.5,
    currency: order.currency,
    status: order.escrowStatus ?? "held",
    vendorId: order.vendorId ?? "v1",
    vendorName: order.vendorName ?? "Tech Solutions Ltd",
    buyerId: order.userId,
    buyerName: order.userName,
    milestones: [
      {
        id: "m1",
        orderId: order.id,
        name: "Initial Deposit",
        description: "Funds secured upon order confirmation",
        percentage: 30,
        amount: order.totalAmount * 0.3,
        status: "released",
        confirmedByBuyer: true,
        releasedAt: "Dec 1, 2024",
        createdAt: "Dec 1, 2024",
      },
      {
        id: "m2",
        orderId: order.id,
        name: "Product/Service Delivery",
        description: "Release upon successful delivery",
        percentage: 50,
        amount: order.totalAmount * 0.5,
        status: "completed",
        confirmedByBuyer: false,
        createdAt: "Dec 1, 2024",
      },
      {
        id: "m3",
        orderId: order.id,
        name: "Final Approval",
        description: "Final payment after buyer satisfaction",
        percentage: 20,
        amount: order.totalAmount * 0.2,
        status: "pending",
        confirmedByBuyer: false,
        createdAt: "Dec 1, 2024",
      },
    ],
    createdAt: order.orderDate,
    updatedAt: order.orderDate,
  };
};

export function OrderDetailsModal({
  open,
  onOpenChange,
  order,
  onMarkFulfilled,
  onRefund,
  onCancel,
  onNotify,
}: OrderDetailsModalProps) {
  const t = useT();
  const [notes, setNotes] = useState("");
  const [sendToCustomer, setSendToCustomer] = useState(false);
  const [escrowOrder, setEscrowOrder] = useState<EscrowOrder | null>(null);

  // Initialize escrow order when order changes
  useState(() => {
    if (order) {
      setEscrowOrder(getMockEscrowOrder(order));
    }
  });

  if (!order) return null;

  const currencySymbol = order.currency === "USD" ? "$" : order.currency === "EUR" ? "€" : "₵";

  const canFulfill = order.fulfillmentStatus === "pending" && order.paymentStatus === "paid";
  const canRefund = order.paymentStatus === "paid" && order.fulfillmentStatus !== "cancelled";
  const canCancel = order.fulfillmentStatus === "pending";

  // Get or create escrow order
  const currentEscrowOrder = escrowOrder || getMockEscrowOrder(order);

  const handleSaveNotes = () => {
    if (sendToCustomer && notes.trim()) {
      onNotify(order, notes);
    }
    setNotes("");
    setSendToCustomer(false);
  };

  const handleMilestoneComplete = (milestoneId: string) => {
    if (!currentEscrowOrder) return;
    setEscrowOrder({
      ...currentEscrowOrder,
      milestones: currentEscrowOrder.milestones.map((m) =>
        m.id === milestoneId ? { ...m, status: "completed", completedAt: new Date().toLocaleDateString() } : m
      ),
    });
  };

  const handleMilestoneRelease = (milestoneId: string) => {
    if (!currentEscrowOrder) return;
    const milestone = currentEscrowOrder.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;

    const newReleasedAmount = currentEscrowOrder.releasedAmount + milestone.amount;
    const newHeldAmount = currentEscrowOrder.heldAmount - milestone.amount;

    setEscrowOrder({
      ...currentEscrowOrder,
      releasedAmount: newReleasedAmount,
      heldAmount: newHeldAmount,
      status: newHeldAmount <= 0 ? "fully_released" : "partially_released",
      milestones: currentEscrowOrder.milestones.map((m) =>
        m.id === milestoneId
          ? { ...m, status: "released", confirmedByBuyer: true, releasedAt: new Date().toLocaleDateString() }
          : m
      ),
    });
  };

  const handleAddMilestone = (data: Omit<Milestone, "id" | "orderId" | "status" | "amount" | "confirmedByBuyer" | "createdAt">) => {
    if (!currentEscrowOrder) return;
    const newMilestone: Milestone = {
      id: `m${Date.now()}`,
      orderId: order.id,
      name: data.name,
      description: data.description,
      percentage: data.percentage,
      amount: (data.percentage / 100) * currentEscrowOrder.totalAmount,
      status: "pending",
      dueDate: data.dueDate,
      confirmedByBuyer: false,
      createdAt: new Date().toLocaleDateString(),
    };

    setEscrowOrder({
      ...currentEscrowOrder,
      milestones: [...currentEscrowOrder.milestones, newMilestone],
    });
  };

  const handleDeleteMilestone = (milestoneId: string) => {
    if (!currentEscrowOrder) return;
    setEscrowOrder({
      ...currentEscrowOrder,
      milestones: currentEscrowOrder.milestones.filter((m) => m.id !== milestoneId),
    });
  };

  const handleDispute = (reason: string) => {
    if (!currentEscrowOrder) return;
    setEscrowOrder({
      ...currentEscrowOrder,
      status: "disputed",
      disputeReason: reason,
      disputedAt: new Date().toISOString(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {t.orderDetails}
            {order.isEscrow && (
              <span className="inline-flex items-center gap-1 text-xs font-normal bg-primary/10 text-primary px-2 py-1 rounded-full">
                <Shield className="h-3 w-3" />
                Escrow Protected
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Order Details</TabsTrigger>
            <TabsTrigger value="escrow" disabled={!order.isEscrow}>
              <Shield className="h-4 w-4 mr-1" />
              Escrow & Milestones
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-4">
            {/* Customer Information */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                {t.customerInformation}
              </h4>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={undefined} />
                  <AvatarFallback>
                    {order.userName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-foreground">{order.userName}</p>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {order.userEmail}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    +1 234 567 8900
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Order Information */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" />
                {t.orderInformation}
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.orderId}</span>
                  <span className="font-mono font-medium">{order.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.orderDate}</span>
                  <span>{order.orderDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.productService}</span>
                  <span className="font-medium">{order.listingTitle}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.qty}</span>
                  <span>{order.quantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.unitPrice}</span>
                  <span>{currencySymbol}{(order.totalAmount / order.quantity).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm font-medium">
                  <span>{t.totalAmount}</span>
                  <span className="text-lg">{currencySymbol}{order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{t.paymentStatus}</span>
                  <StatusBadge
                    variant={
                      order.paymentStatus === "paid"
                        ? "active"
                        : order.paymentStatus === "pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {order.paymentStatus}
                  </StatusBadge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{t.orderStatus}</span>
                  <StatusBadge
                    variant={
                      order.fulfillmentStatus === "fulfilled"
                        ? "active"
                        : order.fulfillmentStatus === "pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {order.fulfillmentStatus}
                  </StatusBadge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">{t.actions}</h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!canFulfill}
                  onClick={() => onMarkFulfilled(order)}
                >
                  <CheckCircle className="h-4 w-4 mr-1.5" />
                  {t.markFulfilled}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!canRefund}
                  onClick={() => onRefund(order)}
                >
                  <RefreshCw className="h-4 w-4 mr-1.5" />
                  {t.refund}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!canCancel}
                  onClick={() => onCancel(order)}
                  className="text-destructive hover:text-destructive"
                >
                  <XCircle className="h-4 w-4 mr-1.5" />
                  {t.cancel}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNotify(order, "Order update notification")}
                >
                  <Bell className="h-4 w-4 mr-1.5" />
                  {t.notify}
                </Button>
              </div>
            </div>

            <Separator />

            {/* Notes */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">{t.notes}</h4>
              <Textarea
                placeholder={t.addNotesPlaceholder}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <Switch
                    id="send-to-customer"
                    checked={sendToCustomer}
                    onCheckedChange={setSendToCustomer}
                  />
                  <Label htmlFor="send-to-customer" className="text-sm">
                    {t.sendToCustomer}
                  </Label>
                </div>
                <Button size="sm" onClick={handleSaveNotes} disabled={!notes.trim()}>
                  {t.saveNotes}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="escrow" className="mt-4">
            {currentEscrowOrder && (
              <EscrowMilestonesSection
                escrowOrder={currentEscrowOrder}
                isAdmin={true}
                isBuyer={false}
                onMilestoneComplete={handleMilestoneComplete}
                onMilestoneRelease={handleMilestoneRelease}
                onAddMilestone={handleAddMilestone}
                onDeleteMilestone={handleDeleteMilestone}
                onDispute={handleDispute}
              />
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
