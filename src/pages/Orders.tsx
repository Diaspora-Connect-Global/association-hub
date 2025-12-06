import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  Download, 
  MoreHorizontal, 
  Eye, 
  CheckCircle, 
  RefreshCw, 
  XCircle, 
  Bell,
  BarChart3,
  Package
} from "lucide-react";
import { Order } from "@/types/marketplace";
import { OrderDetailsModal } from "@/components/orders/OrderDetailsModal";
import { CancelOrderModal } from "@/components/orders/CancelOrderModal";
import { OrdersAnalyticsWidget } from "@/components/orders/OrdersAnalyticsWidget";
import { toast } from "@/hooks/use-toast";
import { useT } from "@/hooks/useT";

// Mock orders data
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    listingId: "1",
    listingTitle: "Ghana Tech Community T-Shirt",
    userId: "u1",
    userName: "John Doe",
    userEmail: "john@example.com",
    quantity: 2,
    totalAmount: 50,
    currency: "USD",
    paymentStatus: "paid",
    fulfillmentStatus: "fulfilled",
    orderDate: "Dec 1, 2024",
  },
  {
    id: "ORD-002",
    listingId: "1",
    listingTitle: "Ghana Tech Community T-Shirt",
    userId: "u2",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    quantity: 1,
    totalAmount: 25,
    currency: "USD",
    paymentStatus: "paid",
    fulfillmentStatus: "pending",
    orderDate: "Dec 2, 2024",
  },
  {
    id: "ORD-003",
    listingId: "2",
    listingTitle: "Business Consultation (1 Hour)",
    userId: "u3",
    userName: "Mike Johnson",
    userEmail: "mike@example.com",
    quantity: 1,
    totalAmount: 100,
    currency: "USD",
    paymentStatus: "paid",
    fulfillmentStatus: "pending",
    orderDate: "Dec 3, 2024",
  },
  {
    id: "ORD-004",
    listingId: "3",
    listingTitle: "Annual Membership Pin",
    userId: "u4",
    userName: "Sarah Williams",
    userEmail: "sarah@example.com",
    quantity: 3,
    totalAmount: 45,
    currency: "USD",
    paymentStatus: "pending",
    fulfillmentStatus: "pending",
    orderDate: "Dec 3, 2024",
  },
  {
    id: "ORD-005",
    listingId: "1",
    listingTitle: "Ghana Tech Community T-Shirt",
    userId: "u5",
    userName: "David Brown",
    userEmail: "david@example.com",
    quantity: 1,
    totalAmount: 25,
    currency: "USD",
    paymentStatus: "refunded",
    fulfillmentStatus: "cancelled",
    orderDate: "Nov 28, 2024",
  },
  {
    id: "ORD-006",
    listingId: "4",
    listingTitle: "Mentorship Program Access",
    userId: "u6",
    userName: "Emily Chen",
    userEmail: "emily@example.com",
    quantity: 1,
    totalAmount: 250,
    currency: "USD",
    paymentStatus: "paid",
    fulfillmentStatus: "fulfilled",
    orderDate: "Nov 25, 2024",
  },
  {
    id: "ORD-007",
    listingId: "2",
    listingTitle: "Business Consultation (1 Hour)",
    userId: "u7",
    userName: "Robert Taylor",
    userEmail: "robert@example.com",
    quantity: 2,
    totalAmount: 200,
    currency: "USD",
    paymentStatus: "paid",
    fulfillmentStatus: "fulfilled",
    orderDate: "Nov 20, 2024",
  },
  {
    id: "ORD-008",
    listingId: "5",
    listingTitle: "Cultural Artifacts Collection",
    userId: "u8",
    userName: "Lisa Anderson",
    userEmail: "lisa@example.com",
    quantity: 1,
    totalAmount: 75,
    currency: "USD",
    paymentStatus: "paid",
    fulfillmentStatus: "pending",
    orderDate: "Dec 4, 2024",
  },
];

export default function Orders() {
  const t = useT();
  const [orders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // Modal states
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.listingTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesOrderStatus = orderStatusFilter === "all" || order.fulfillmentStatus === orderStatusFilter;
    const matchesPaymentStatus = paymentStatusFilter === "all" || order.paymentStatus === paymentStatusFilter;

    return matchesSearch && matchesOrderStatus && matchesPaymentStatus;
  });

  // Stats
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.fulfillmentStatus === "pending").length;
  const fulfilledOrders = orders.filter(o => o.fulfillmentStatus === "fulfilled").length;
  const totalRevenue = orders.filter(o => o.paymentStatus === "paid").reduce((sum, o) => sum + o.totalAmount, 0);
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / orders.filter(o => o.paymentStatus === "paid").length : 0;

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  // Action handlers
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const handleMarkFulfilled = (order: Order) => {
    toast({
      title: t.completedOrders,
      description: `Order ${order.id} has been marked as fulfilled.`,
    });
    setDetailsModalOpen(false);
  };

  const handleRefund = (order: Order) => {
    toast({
      title: "Order Refunded",
      description: `Order ${order.id} has been refunded.`,
    });
    setDetailsModalOpen(false);
  };

  const handleCancelOrder = (order: Order) => {
    setSelectedOrder(order);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    toast({
      title: t.cancel,
      description: `Order ${selectedOrder?.id} has been cancelled.`,
    });
    setCancelModalOpen(false);
    setDetailsModalOpen(false);
  };

  const handleBulkAction = (action: string) => {
    toast({
      title: `Bulk Action: ${action}`,
      description: `Applied to ${selectedOrders.length} orders.`,
    });
    setSelectedOrders([]);
  };

  const handleExport = () => {
    toast({
      title: t.export,
      description: "Your orders are being exported to CSV.",
    });
  };

  return (
    <AdminLayout title={t.ordersTitle} subtitle={t.ordersSubtitle}>
      {/* Top Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`${t.search}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-72"
            />
          </div>
          <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={t.allStatus} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allStatus}</SelectItem>
              <SelectItem value="pending">{t.pendingOrders}</SelectItem>
              <SelectItem value="fulfilled">{t.completedOrders}</SelectItem>
              <SelectItem value="cancelled">{t.cancel}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={t.payment} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allStatus}</SelectItem>
              <SelectItem value="paid">{t.paid}</SelectItem>
              <SelectItem value="pending">{t.pendingOrders}</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          {t.export} {t.orders}
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-5">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">{t.totalOrders}</p>
          <p className="text-2xl font-bold text-foreground">{totalOrdersCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">{t.pendingOrders}</p>
          <p className="text-2xl font-bold text-primary">{pendingOrdersCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">{t.completedOrders}</p>
          <p className="text-2xl font-bold text-foreground">{fulfilledOrders}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">{t.totalRevenueAllTime}</p>
          <p className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Avg. Order Value</p>
          <p className="text-2xl font-bold text-foreground">${avgOrderValue.toFixed(2)}</p>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="mb-4 flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
          <span className="text-sm font-medium">{selectedOrders.length} selected</span>
          <Button variant="outline" size="sm" onClick={() => handleBulkAction("Mark Fulfilled")}>
            <CheckCircle className="h-4 w-4 mr-1.5" />
            Mark Fulfilled
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleBulkAction("Cancel")}>
            <XCircle className="h-4 w-4 mr-1.5" />
            {t.cancel}
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleBulkAction("Notify")}>
            <Bell className="h-4 w-4 mr-1.5" />
            Notify
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSelectedOrders([])}>
            Clear
          </Button>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="orders" className="gap-2">
            <Package className="h-4 w-4" />
            {t.orders}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            {t.analytics}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          {filteredOrders.length > 0 ? (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>{t.product}/{t.service}</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>{t.payment}</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={(checked) => handleSelectOrder(order.id, !!checked)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">{order.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-xs">
                              {order.userName.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{order.userName}</p>
                            <p className="text-xs text-muted-foreground">{order.userEmail}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{order.listingTitle}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell className="font-medium">${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{order.orderDate}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                              <Eye className="mr-2 h-4 w-4" />
                              {t.view}
                            </DropdownMenuItem>
                            {order.fulfillmentStatus === "pending" && order.paymentStatus === "paid" && (
                              <DropdownMenuItem onClick={() => handleMarkFulfilled(order)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark Fulfilled
                              </DropdownMenuItem>
                            )}
                            {order.paymentStatus === "paid" && order.fulfillmentStatus !== "cancelled" && (
                              <DropdownMenuItem onClick={() => handleRefund(order)}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Refund
                              </DropdownMenuItem>
                            )}
                            {order.fulfillmentStatus === "pending" && (
                              <DropdownMenuItem 
                                onClick={() => handleCancelOrder(order)}
                                className="text-destructive"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                {t.cancel}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-border rounded-lg">
              <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{t.noResults}</h3>
              <p className="text-muted-foreground">
                Orders will appear here when customers make purchases.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <OrdersAnalyticsWidget />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <OrderDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        order={selectedOrder}
        onMarkFulfilled={handleMarkFulfilled}
        onRefund={handleRefund}
        onCancel={handleCancelOrder}
        onNotify={(order, msg) => toast({ title: "Notification sent" })}
      />

      <CancelOrderModal
        open={cancelModalOpen}
        onOpenChange={setCancelModalOpen}
        order={selectedOrder}
        onConfirm={handleConfirmCancel}
      />
    </AdminLayout>
  );
}
