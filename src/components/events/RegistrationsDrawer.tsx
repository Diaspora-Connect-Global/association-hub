import { useCallback, useEffect, useState } from "react";
import { Event } from "@/types/events";
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
  MoreHorizontal,
  CheckCircle,
  UserX,
  Users,
  Loader2,
} from "lucide-react";
import { useT } from "@/hooks/useT";
import { toast } from "@/hooks/use-toast";
import {
  adminGetEventRegistrations,
  markRegistrationCheckedIn,
  removeEventRegistration,
  type EventRegistrationRow,
} from "@/services/graphql/events/operations";

interface RegistrationsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
}

/** The backend registration carries a single `status` string; derive whether
 *  the attendee has been checked in from it (the check-in mutation updates it). */
function isCheckedIn(status: string): boolean {
  const s = status.toUpperCase();
  return s === "CHECKED_IN" || s === "CHECKEDIN" || s === "ATTENDED";
}

function isCancelled(status: string): boolean {
  const s = status.toUpperCase();
  return s === "CANCELLED" || s === "CANCELED" || s === "REFUNDED";
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? value
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function displayName(reg: EventRegistrationRow): string {
  const first = reg.user?.firstName ?? "";
  const last = reg.user?.lastName ?? "";
  const name = `${first} ${last}`.trim();
  return name || reg.userId;
}

export function RegistrationsDrawer({
  open,
  onOpenChange,
  event,
}: RegistrationsDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [checkInFilter, setCheckInFilter] = useState<string>("all");
  const [registrations, setRegistrations] = useState<EventRegistrationRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const t = useT();

  const fetchRegistrations = useCallback(async () => {
    if (!event) return;
    setLoading(true);
    try {
      const result = await adminGetEventRegistrations(event.id, 1, 100);
      setRegistrations(result.registrations ?? []);
    } catch {
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  }, [event]);

  useEffect(() => {
    if (open && event) {
      void fetchRegistrations();
    }
  }, [open, event, fetchRegistrations]);

  const handleCheckIn = async (reg: EventRegistrationRow) => {
    setBusyId(reg.id);
    try {
      await markRegistrationCheckedIn(reg.id);
      toast({ title: t.checkedIn });
      await fetchRegistrations();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to check in attendee.",
        variant: "destructive",
      });
    } finally {
      setBusyId(null);
    }
  };

  const handleRemove = async (reg: EventRegistrationRow) => {
    setBusyId(reg.id);
    try {
      await removeEventRegistration(reg.id);
      toast({ title: t.removeAttendee });
      await fetchRegistrations();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to remove attendee.",
        variant: "destructive",
      });
    } finally {
      setBusyId(null);
    }
  };

  if (!event) return null;

  const filteredRegistrations = registrations.filter((reg) => {
    const name = displayName(reg).toLowerCase();
    const email = (reg.user?.email ?? "").toLowerCase();
    const matchesSearch =
      name.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase());

    const checkedIn = isCheckedIn(reg.status);
    const paid = !isCancelled(reg.status) && !!reg.totalAmount;

    const matchesPayment =
      paymentFilter === "all" ||
      (paymentFilter === "paid" && paid) ||
      (paymentFilter === "pending" && !paid && !isCancelled(reg.status)) ||
      (paymentFilter === "refunded" && isCancelled(reg.status));
    const matchesCheckIn =
      checkInFilter === "all" ||
      (checkInFilter === "checked-in" && checkedIn) ||
      (checkInFilter === "not-checked-in" && !checkedIn);

    return matchesSearch && matchesPayment && matchesCheckIn;
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t.registrations}</SheetTitle>
          <p className="text-sm text-muted-foreground">{t.forEvent}: {event.title}</p>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t.searchAttendees}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            {event.isPaid && (
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={t.payment} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allPayments}</SelectItem>
                  <SelectItem value="paid">{t.paidStatus}</SelectItem>
                  <SelectItem value="pending">{t.pending}</SelectItem>
                  <SelectItem value="refunded">{t.refundedPayment}</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Select value={checkInFilter} onValueChange={setCheckInFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={t.status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allCheckInStatus}</SelectItem>
                <SelectItem value="checked-in">{t.checkedIn}</SelectItem>
                <SelectItem value="not-checked-in">{t.notCheckedIn}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12 border border-dashed border-border rounded-lg">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredRegistrations.length > 0 ? (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>{t.attendee}</TableHead>
                    <TableHead>{t.contact}</TableHead>
                    {event.isPaid && <TableHead>{t.payment}</TableHead>}
                    <TableHead>{t.status}</TableHead>
                    <TableHead>{t.registeredAt}</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((registration) => {
                    const name = displayName(registration);
                    const checkedIn = isCheckedIn(registration.status);
                    const cancelled = isCancelled(registration.status);
                    return (
                      <TableRow key={registration.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={registration.user?.avatarUrl ?? undefined} />
                              <AvatarFallback>
                                {name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{registration.user?.email ?? "—"}</p>
                          </div>
                        </TableCell>
                        {event.isPaid && (
                          <TableCell>
                            <StatusBadge
                              variant={cancelled ? "inactive" : registration.totalAmount ? "active" : "warning"}
                            >
                              {cancelled
                                ? t.refundedPayment
                                : registration.totalAmount
                                ? `${registration.currency ?? ""} ${registration.totalAmount}`.trim()
                                : t.pending}
                            </StatusBadge>
                          </TableCell>
                        )}
                        <TableCell>
                          <StatusBadge variant={checkedIn ? "active" : "inactive"}>
                            {checkedIn ? t.checkedIn : t.notCheckedIn}
                          </StatusBadge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(registration.registeredAt)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                disabled={busyId === registration.id}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                disabled={checkedIn || busyId === registration.id}
                                onClick={() => void handleCheckIn(registration)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                {t.markAsCheckedIn}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                disabled={busyId === registration.id}
                                onClick={() => void handleRemove(registration)}
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                {t.removeAttendee}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <h3 className="text-lg font-medium text-foreground mb-1">{t.noRegistrationsYet}</h3>
              <p className="text-sm text-muted-foreground">
                {t.shareEventToAttract}
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
