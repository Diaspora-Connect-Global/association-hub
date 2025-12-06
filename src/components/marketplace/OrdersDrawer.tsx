import { useState } from "react";
import { Listing, Order } from "@/types/marketplace";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Download, 
  MoreHorizontal, 
  CheckCircle, 
  RefreshCw, 
  XCircle,
  Eye,
  ShoppingCart
} from "lucide-react";

interface OrdersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: Listing | null;
}

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
    listingId: "1",
    listingTitle: "Ghana Tech Community T-Shirt",
    userId: "u3",
    userName: "Mike Johnson",
    userEmail: "mike@example.com",
    quantity: 3,
    totalAmount: 75,
    currency: "USD",
    paymentStatus: "pending",
    fulfillmentStatus: "pending",
    orderDate: "Dec 3, 2024",
  },
  {
    id: "ORD-004",
    listingId: "1",
    listingTitle: "Ghana Tech Community T-Shirt",
    userId: "u4",
    userName: "Sarah Williams",
    userEmail: "sarah@example.com",
    quantity: 1,
    totalAmount: 25,
    currency: "USD",
    paymentStatus: "refunded",
    fulfillmentStatus: "cancelled",
    orderDate: "Nov 28, 2024",
  },
];

export function OrdersDrawer({
  open,
  onOpenChange,
  listing,
}: OrdersDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [fulfillmentFilter, setFulfillmentFilter] = useState<string>("all");

  if (!listing) return null;

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = 
      order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;
    const matchesFulfillment = fulfillmentFilter === "all" || order.fulfillmentStatus === fulfillmentFilter;

    return matchesSearch && matchesPayment && matchesFulfillment;
  });

  const currencySymbol = listing.currency === "USD" ? "$" : listing.currency === "EUR" ? "€" : "₵";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-4xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Orders</SheetTitle>
          <p className="text-sm text-muted-foreground">For: {listing.title}</p>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders by user, email, or order ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={fulfillmentFilter} onValueChange={setFulfillmentFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Fulfillment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="fulfilled">Fulfilled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Table */}
          {filteredOrders.length > 0 ? (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Fulfillment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.id}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{order.userName}</p>
                          <p className="text-muted-foreground">{order.userEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell className="font-medium">
                        {currencySymbol}{order.totalAmount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          variant={
                            order.paymentStatus === "paid"
                              ? "active"
                              : order.paymentStatus === "pending"
                              ? "warning"
                              : "inactive"
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
                      <TableCell className="text-muted-foreground text-sm">
                        {order.orderDate}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Fulfilled
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Refund
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <h3 className="text-lg font-medium text-foreground mb-1">No orders yet</h3>
              <p className="text-sm text-muted-foreground">
                Orders will appear here after your product/service is purchased.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
