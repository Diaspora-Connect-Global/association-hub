import { Order } from "@/types/marketplace";
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
import { 
  CheckCircle, 
  RefreshCw, 
  XCircle, 
  Bell,
  Package,
  User,
  Mail,
  Phone
} from "lucide-react";
import { useState } from "react";
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

  if (!order) return null;

  const currencySymbol = order.currency === "USD" ? "$" : order.currency === "EUR" ? "€" : "₵";

  const canFulfill = order.fulfillmentStatus === "pending" && order.paymentStatus === "paid";
  const canRefund = order.paymentStatus === "paid" && order.fulfillmentStatus !== "cancelled";
  const canCancel = order.fulfillmentStatus === "pending";

  const handleSaveNotes = () => {
    if (sendToCustomer && notes.trim()) {
      onNotify(order, notes);
    }
    setNotes("");
    setSendToCustomer(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.orderDetails}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}