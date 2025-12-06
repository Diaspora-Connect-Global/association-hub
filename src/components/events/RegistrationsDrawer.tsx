import { useState } from "react";
import { Event, EventRegistration } from "@/types/events";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Send, 
  UserX,
  Users
} from "lucide-react";

interface RegistrationsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
}

// Mock registrations data
const mockRegistrations: EventRegistration[] = [
  {
    id: "1",
    eventId: "1",
    userId: "u1",
    userName: "John Doe",
    userEmail: "john@example.com",
    userPhone: "+1 234 567 8900",
    paymentStatus: "paid",
    checkInStatus: "checked-in",
    registeredAt: "Dec 1, 2024",
  },
  {
    id: "2",
    eventId: "1",
    userId: "u2",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    userPhone: "+1 234 567 8901",
    paymentStatus: "paid",
    checkInStatus: "not-checked-in",
    registeredAt: "Dec 2, 2024",
  },
  {
    id: "3",
    eventId: "1",
    userId: "u3",
    userName: "Mike Johnson",
    userEmail: "mike@example.com",
    userPhone: "+1 234 567 8902",
    paymentStatus: "pending",
    checkInStatus: "not-checked-in",
    registeredAt: "Dec 3, 2024",
  },
];

export function RegistrationsDrawer({
  open,
  onOpenChange,
  event,
}: RegistrationsDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [checkInFilter, setCheckInFilter] = useState<string>("all");

  if (!event) return null;

  const filteredRegistrations = mockRegistrations.filter((reg) => {
    const matchesSearch = 
      reg.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.userPhone?.includes(searchQuery);
    
    const matchesPayment = paymentFilter === "all" || reg.paymentStatus === paymentFilter;
    const matchesCheckIn = checkInFilter === "all" || reg.checkInStatus === checkInFilter;

    return matchesSearch && matchesPayment && matchesCheckIn;
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Registrations</SheetTitle>
          <p className="text-sm text-muted-foreground">For: {event.title}</p>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search attendees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            {event.isPaid && (
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Select value={checkInFilter} onValueChange={setCheckInFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Check-in" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="checked-in">Checked In</SelectItem>
                <SelectItem value="not-checked-in">Not Checked In</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Table */}
          {filteredRegistrations.length > 0 ? (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Attendee</TableHead>
                    <TableHead>Contact</TableHead>
                    {event.isPaid && <TableHead>Payment</TableHead>}
                    <TableHead>Check-in</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={registration.userPhoto} />
                            <AvatarFallback>
                              {registration.userName.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{registration.userName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{registration.userEmail}</p>
                          <p className="text-muted-foreground">{registration.userPhone}</p>
                        </div>
                      </TableCell>
                      {event.isPaid && (
                        <TableCell>
                          <StatusBadge
                            variant={
                              registration.paymentStatus === "paid"
                                ? "active"
                                : registration.paymentStatus === "pending"
                                ? "warning"
                                : "inactive"
                            }
                          >
                            {registration.paymentStatus}
                          </StatusBadge>
                        </TableCell>
                      )}
                      <TableCell>
                        <StatusBadge
                          variant={registration.checkInStatus === "checked-in" ? "active" : "inactive"}
                        >
                          {registration.checkInStatus === "checked-in" ? "Checked In" : "Not Checked In"}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {registration.registeredAt}
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
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Checked In
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="mr-2 h-4 w-4" />
                              Resend Ticket
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <UserX className="mr-2 h-4 w-4" />
                              Remove Attendee
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
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <h3 className="text-lg font-medium text-foreground mb-1">No registrations yet</h3>
              <p className="text-sm text-muted-foreground">
                Share this event to attract participants.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
