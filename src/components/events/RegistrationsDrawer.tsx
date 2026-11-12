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
  ClipboardList,
  Download,
} from "lucide-react";
import { useT } from "@/hooks/useT";
import { useSettings } from "@/contexts/SettingsContext";
import { formatMinorUnits } from "@/lib/money";
import { toast } from "@/hooks/use-toast";
import {
  getEventRegistrations,
  getAllEventRegistrations,
  getEventRegistrationSetup,
  getEventTickets,
  markRegistrationCheckedIn,
  removeEventRegistration,
  type EventRegistrationRow,
  type EventRegistrationFormField,
} from "@/services/graphql/events/operations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { answerText, buildCsv, downloadCsv, parseFormResponses, registrantEmail } from "@/lib/eventRegistrationCsv";
import { makeEvRegText, registrationFieldName, type EvRegText } from "@/lib/eventRegistrationText";
import { userLabel } from "@/lib/userLabel";
import { graphqlErrorMessage } from "@/lib/graphqlErrors";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventNetworkingTabs } from "@/components/events/networking/EventNetworkingTabs";
import { RegistrationStatusBadge } from "@/components/events/networking/RegistrationStatusBadge";
import { paymentLabelOverride, registrationStatusLabel } from "@/lib/eventNetworking";

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

/** Attendee's name, else email, else `unknown` — user ids are never displayed. */
function displayName(reg: EventRegistrationRow, unknown: string): string {
  const first = reg.user?.firstName ?? "";
  const last = reg.user?.lastName ?? "";
  return userLabel({ name: `${first} ${last}`.trim(), email: registrantEmail(reg.user?.email, reg.formResponsesJson) }, unknown);
}

/** Question label for display: default fields translated, the organiser's own as typed. */
function questionLabel(f: EventRegistrationFormField, tx: EvRegText): string {
  return registrationFieldName(f, tx);
}

/** Question → answer for one registrant (blank answers left out, never ids). */
function AnswersList({
  registration,
  fields,
  tx,
}: {
  registration: EventRegistrationRow | null;
  fields: EventRegistrationFormField[];
  tx: EvRegText;
}) {
  const words = { yes: tx("yes"), no: tx("no") };
  const answers = parseFormResponses(registration?.formResponsesJson);
  const answered = fields
    .map((f) => ({ f, text: answerText(answers[f.id], f, words) }))
    .filter(({ text }) => text !== "");
  if (answered.length === 0) return <p className="text-sm text-muted-foreground">{tx("noAnswers")}</p>;
  return (
    <dl className="space-y-3">
      {answered.map(({ f, text }) => (
        <div key={f.id}>
          <dt className="text-xs text-muted-foreground break-words">{questionLabel(f, tx)}</dt>
          <dd className="text-sm text-foreground whitespace-pre-wrap break-words">{text}</dd>
        </div>
      ))}
    </dl>
  );
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
  const [ticketNames, setTicketNames] = useState<Map<string, string>>(new Map());
  const [formFields, setFormFields] = useState<EventRegistrationFormField[]>([]);
  const [answersFor, setAnswersFor] = useState<EventRegistrationRow | null>(null);
  const [exporting, setExporting] = useState(false);
  const t = useT();
  const tx = makeEvRegText(t);
  const { settings } = useSettings();

  const fetchRegistrations = useCallback(async () => {
    if (!event) return;
    setLoading(true);
    try {
      // The owning entity's admins may read their own event's registrants here;
      // the adminGet… query is for platform admins only.
      const [result, setup, tickets] = await Promise.all([
        getEventRegistrations(event.id, 100, 0),
        getEventRegistrationSetup(event.id).catch(() => null),
        getEventTickets(event.id).catch(() => [] as { id: string; name: string }[]),
      ]);
      setTicketNames(new Map(tickets.map((tk): [string, string] => [tk.id, tk.name])));
      setRegistrations(result.registrations ?? []);
      setFormFields(setup?.registrationFormFields ?? []);
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
        description: graphqlErrorMessage(err, "Failed to check in attendee."),
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
        description: graphqlErrorMessage(err, "Failed to remove attendee."),
        variant: "destructive",
      });
    } finally {
      setBusyId(null);
    }
  };

  const handleExport = async () => {
    if (!event) return;
    setExporting(true);
    try {
      const rows = await getAllEventRegistrations(event.id);
      if (rows.length === 0) {
        toast({ title: tx("nothingToExport") });
        return;
      }
      const words = { yes: tx("yes"), no: tx("no") };
      const headers = [
        tx("colName"),
        tx("colEmail"),
        tx("colRegistered"),
        tx("colTicket"),
        tx("csvQuantity"),
        tx("colRegistration"),
        ...(event.isPaid ? [tx("colPayment")] : []),
        tx("colCheckIn"),
        ...formFields.map((f) => questionLabel(f, tx)),
      ];
      const body = rows.map((reg) => {
        const answers = parseFormResponses(reg.formResponsesJson);
        return [
          displayName(reg, t.unknownUser),
          registrantEmail(reg.user?.email, reg.formResponsesJson),
          reg.registeredAt ? new Date(reg.registeredAt).toLocaleString(settings.language) : "",
          (reg.ticketId && ticketNames.get(reg.ticketId)) || "",
          String(reg.quantity ?? ""),
          registrationStatusLabel(reg.registrationStatus || reg.status),
          ...(event.isPaid
            ? [
                isCancelled(reg.status)
                  ? t.refundedPayment
                  : paymentLabelOverride(reg.registrationStatus || reg.status) !== null || !reg.totalAmount
                  ? t.pending
                  : Number.isFinite(Number(reg.totalAmount))
                  ? formatMinorUnits(Number(reg.totalAmount), reg.currency ?? event.currency, settings.language)
                  : t.pending,
              ]
            : []),
          isCheckedIn(reg.status) ? t.checkedIn : t.notCheckedIn,
          ...formFields.map((f) => answerText(answers[f.id], f, words)),
        ];
      });
      const slug = event.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "event";
      downloadCsv(buildCsv(headers, body), `${slug}-registrations.csv`);
    } catch {
      toast({ title: "Error", description: tx("exportFailed"), variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  if (!event) return null;

  const filteredRegistrations = registrations.filter((reg) => {
    const name = displayName(reg, t.unknownUser).toLowerCase();
    const email = registrantEmail(reg.user?.email, reg.formResponsesJson).toLowerCase();
    const matchesSearch =
      name.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase());

    const checkedIn = isCheckedIn(reg.status);
    // An awaiting-approval / waitlisted / declined registration has not been paid, whatever its amount.
    const paid = !isCancelled(reg.status) && !!reg.totalAmount && paymentLabelOverride(reg.registrationStatus || reg.status) === null;

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

        <Tabs defaultValue="registrations" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
            <TabsTrigger value="manage">Approvals &amp; staff</TabsTrigger>
          </TabsList>
          <TabsContent value="registrations">
            <div className="mt-4 space-y-4">
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
                <Button
                  type="button"
                  variant="outline"
                  disabled={exporting}
                  onClick={() => void handleExport()}
                >
                  {exporting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                  )}
                  {tx("exportCsv")}
                </Button>
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
                        <TableHead>Registration</TableHead>
                        <TableHead>{t.status}</TableHead>
                        <TableHead>{t.registeredAt}</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRegistrations.map((registration) => {
                        const name = displayName(registration, t.unknownUser);
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
                                <p>{registrantEmail(registration.user?.email, registration.formResponsesJson) || "—"}</p>
                              </div>
                            </TableCell>
                            {event.isPaid && (
                              <TableCell>
                                <StatusBadge
                                  variant={cancelled ? "inactive" : registration.totalAmount ? "active" : "warning"}
                                >
                                  {cancelled
                                    ? t.refundedPayment
                                    : paymentLabelOverride(registration.registrationStatus || registration.status) !== null
                                    ? t.pending
                                    : registration.totalAmount
                                    ? // Integer minor units (a string), in the registration's currency, else the event's.
                                      Number.isFinite(Number(registration.totalAmount))
                                      ? formatMinorUnits(Number(registration.totalAmount), registration.currency ?? event.currency, settings.language)
                                      : t.pending
                                    : t.pending}
                                </StatusBadge>
                              </TableCell>
                            )}
                            <TableCell>
                              <RegistrationStatusBadge status={registration.registrationStatus || registration.status} />
                              {registration.waitlistPosition != null && (
                                <span className="ml-1 text-xs text-muted-foreground">#{registration.waitlistPosition}</span>
                              )}
                            </TableCell>
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
                                  <DropdownMenuItem onClick={() => setAnswersFor(registration)}>
                                    <ClipboardList className="mr-2 h-4 w-4" />
                                    {tx("viewAnswers")}
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
          </TabsContent>
          <TabsContent value="manage" className="mt-4">
            <EventNetworkingTabs eventId={event.id} onChanged={() => void fetchRegistrations()} />
          </TabsContent>
        </Tabs>
      </SheetContent>

      <Dialog open={!!answersFor} onOpenChange={(v) => !v && setAnswersFor(null)}>
        <DialogContent className="sm:max-w-[520px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{tx("answersTitle")}</DialogTitle>
            <DialogDescription>
              {tx("answersFor", { name: answersFor ? displayName(answersFor, t.unknownUser) : "" })}
            </DialogDescription>
          </DialogHeader>
          <AnswersList registration={answersFor} fields={formFields} tx={tx} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnswersFor(null)}>
              {tx("close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}
