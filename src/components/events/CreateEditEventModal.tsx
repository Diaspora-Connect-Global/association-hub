import { useEffect, useState } from "react";
import { Event, EventFormData, EventType } from "@/types/events";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, Upload, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/hooks/useT";
import { PLATFORM_BASE_CURRENCY } from "@/lib/money";
import { RegistrationSection } from "@/components/events/RegistrationFormBuilder";
import {
  defaultFieldDrafts,
  fieldsToDrafts,
  formSignature,
  normalizeRegistrationLink,
  validateDrafts,
} from "@/lib/eventRegistrationForm";
import { MAX_LOCATION_FIELD, validatePhysicalLocation } from "@/lib/eventLocation";
import { COVER_ALLOWED_TYPES, validateCoverFile } from "@/lib/eventCoverImage";
import { EventCoverImage } from "@/components/events/EventCoverImage";
import { makeEvRegText } from "@/lib/eventRegistrationText";

const LOCATION_INPUTS = [
  { key: "venue", autoComplete: "organization", span: "sm:col-span-2", label: "eventVenue", ph: "eventVenuePh" },
  { key: "address", autoComplete: "street-address", span: "sm:col-span-2", label: "eventAddress", ph: "eventAddressPh" },
  { key: "city", autoComplete: "address-level2", span: "", label: "eventCity", ph: "eventCityPh" },
  { key: "country", autoComplete: "country-name", span: "", label: "eventCountry", ph: "eventCountryPh" },
] as const;

/** Preview of the picked cover; the object URL lives only here and is revoked, never saved. */
function PickedPreview({ file, alt }: { file: File; alt: string }) {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  return url ? <img src={url} alt={alt} className="h-full w-full object-cover" /> : null;
}

interface CreateEditEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event | null;
  onSubmit: (data: EventFormData) => void;
}

export function CreateEditEventModal({
  open,
  onOpenChange,
  event,
  onSubmit,
}: CreateEditEventModalProps) {
  const t = useT();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EventFormData>({
    title: event?.title || "",
    description: event?.description || "",
    bannerImage: null,
    date: event?.date ? new Date(event.date) : undefined,
    startTime: event?.startTime || "",
    endTime: event?.endTime || "",
    eventType: event?.eventType || "in-person",
    venue: event?.venue || "",
    address: event?.address || "",
    city: event?.city || "",
    country: event?.country || "",
    virtualLink: event?.virtualLink || "",
    isPaid: event?.isPaid || false,
    // Saved prices are integer minor units; the form edits major units. Divide,
    // never round — rounding here would become a write on the next save.
    ticketPrice: event?.ticketPrice != null ? event.ticketPrice / 100 : 0,
    currency: event?.currency || PLATFORM_BASE_CURRENCY,
    hasParticipantLimit: event?.hasParticipantLimit || false,
    maxParticipants: event?.maxParticipants || 100,
    publishNow: false,
    notifyMembers: true,
    allowComments: true,
    // A new event starts with the four default fields; an edited one carries what is saved.
    registrationMode: event?.registrationMode ?? "IN_APP",
    registrationLink: event?.registrationLink ?? "",
    registrationFields: event ? fieldsToDrafts(event.registrationFields) : defaultFieldDrafts(),
    registrationLoaded: !event || !event.registrationLoadFailed,
    registrationBaseline: event && !event.registrationLoadFailed ? formSignature(fieldsToDrafts(event.registrationFields)) : null,
    savedRegistrationMode: event && !event.registrationLoadFailed ? (event.registrationMode ?? "IN_APP") : null,
    registeredCount: event?.registeredCount ?? 0,
  });
  const [registrationShowErrors, setRegistrationShowErrors] = useState(false);
  const [locationAttempted, setLocationAttempted] = useState(false);
  const [coverError, setCoverError] = useState<"type" | "size" | null>(null);
  const locationErrors = formData.eventType === "in-person" ? validatePhysicalLocation(formData) : {};

  const steps = [
    { id: 1, title: t.basicInformation },
    { id: 2, title: t.scheduleLocation },
    { id: 3, title: t.ticketingCapacity },
    { id: 4, title: t.evRegTitle },
    { id: 5, title: t.visibilitySettings },
  ];

  const updateField = <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  /** The registration part can be saved: a usable website, or a valid form. */
  const registrationProblem = (() => {
    if (event && !formData.registrationLoaded) return null; // nothing about registration is sent
    if (formData.registrationMode === "EXTERNAL") {
      return normalizeRegistrationLink(formData.registrationLink) ? null : makeEvRegText(t)("urlInvalid");
    }
    return validateDrafts(formData.registrationFields).ok ? null : makeEvRegText(t)("err_form");
  })();

  const handleSubmit = () => {
    if (Object.keys(locationErrors).length > 0) {
      // Keep the dialog open on the Schedule & Location step so nothing typed is lost.
      setLocationAttempted(true);
      setCurrentStep(2);
      return;
    }
    if (registrationProblem) {
      // Keep the dialog open on the Registration step so nothing typed is lost.
      setRegistrationShowErrors(true);
      setCurrentStep(4);
      return;
    }
    onSubmit(formData);
    onOpenChange(false);
    setCurrentStep(1);
  };

  const handleClose = () => {
    onOpenChange(false);
    setCurrentStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {event ? t.editEventLabel : t.createEvent}
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    currentStep > step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <span className="text-xs mt-1 text-muted-foreground hidden sm:block">
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-6 sm:w-16 h-0.5 mx-1 sm:mx-2",
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-4 min-h-[300px]">
          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">{t.eventTitle} *</Label>
                <Input
                  id="title"
                  placeholder={t.enterEventTitle}
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t.eventDescription} *</Label>
                <Textarea
                  id="description"
                  placeholder={t.enterEventDescription}
                  rows={5}
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.bannerImageLabel}</Label>
                <Label
                  htmlFor="eventCover"
                  className="block cursor-pointer rounded-lg border-2 border-dashed border-border p-4 text-center transition-colors hover:border-primary/50 focus-within:ring-2 focus-within:ring-ring"
                >
                  <div className="mb-2 aspect-video max-h-40 overflow-hidden rounded-md bg-muted">
                    {formData.bannerImage ? (
                      <PickedPreview file={formData.bannerImage} alt={t.bannerImageLabel} />
                    ) : event?.bannerImage ? (
                      <EventCoverImage src={event.bannerImage} title={event.title} />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Upload className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formData.bannerImage ? formData.bannerImage.name : t.clickToUpload}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">{t.imageFormat}</span>
                  <input
                    id="eventCover"
                    type="file"
                    className="sr-only"
                    accept={COVER_ALLOWED_TYPES.join(",")}
                    aria-describedby={coverError ? "eventCover-error" : undefined}
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      e.target.value = "";
                      if (!file) return;
                      const problem = validateCoverFile(file);
                      setCoverError(problem);
                      if (!problem) updateField("bannerImage", file);
                    }}
                  />
                </Label>
                {coverError && (
                  <p id="eventCover-error" className="text-xs text-destructive" role="alert">
                    {coverError === "type" ? t.coverTypeError : t.coverSizeError}
                  </p>
                )}
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="space-y-2">
                <Label>{t.eventDate} *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : t.pickDate}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => updateField("date", date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">{t.startTime} *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => updateField("startTime", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">{t.endTime} *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => updateField("endTime", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t.eventTypeLabel} *</Label>
                <Select
                  value={formData.eventType}
                  onValueChange={(value: EventType) => updateField("eventType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-person">{t.inPerson}</SelectItem>
                    <SelectItem value="virtual">{t.virtual}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.eventType === "in-person" ? (
                <fieldset className="space-y-3">
                  <legend className="mb-2 text-sm font-medium">{t.eventLocationLegend}</legend>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {LOCATION_INPUTS.map(({ key, autoComplete, span, label, ph }) => {
                      const err = locationAttempted ? locationErrors[key] : undefined;
                      const errId = `event-${key}-error`;
                      return (
                        <div key={key} className={`space-y-2 ${span}`}>
                          <Label htmlFor={`event-${key}`}>{t[label]} *</Label>
                          <Input
                            id={`event-${key}`}
                            placeholder={t[ph]}
                            value={formData[key]}
                            maxLength={MAX_LOCATION_FIELD}
                            autoComplete={autoComplete}
                            required
                            aria-invalid={err ? true : undefined}
                            aria-describedby={err ? errId : undefined}
                            onChange={(e) => updateField(key, e.target.value)}
                          />
                          {err && (
                            <p id={errId} className="text-xs text-destructive" role="alert">
                              {err === "required" ? t.eventLocationRequired : t.eventLocationTooLong}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </fieldset>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="virtualLink">{t.virtualLinkLabel}</Label>
                  <Input
                    id="virtualLink"
                    type="url"
                    placeholder={t.addVirtualLink}
                    value={formData.virtualLink}
                    onChange={(e) => updateField("virtualLink", e.target.value)}
                  />
                </div>
              )}
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <Label>{t.isPaidEvent}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.enableTicketPrice}
                  </p>
                </div>
                <Switch
                  checked={formData.isPaid}
                  onCheckedChange={(checked) => updateField("isPaid", checked)}
                />
              </div>
              {formData.isPaid && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t.currency}</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => updateField("currency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GHS">GHS (₵)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ticketPrice">{`${t.ticketPrice} (${formData.currency})`}</Label>
                    <Input
                      id="ticketPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.ticketPrice || ""}
                      onChange={(e) => updateField("ticketPrice", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <Label>{t.limitParticipants}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.setMaxAttendees}
                  </p>
                </div>
                <Switch
                  checked={formData.hasParticipantLimit}
                  onCheckedChange={(checked) => updateField("hasParticipantLimit", checked)}
                />
              </div>
              {formData.hasParticipantLimit && (
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">{t.maxParticipants}</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    min="1"
                    placeholder="E.g., 200"
                    value={formData.maxParticipants || ""}
                    onChange={(e) => updateField("maxParticipants", parseInt(e.target.value) || 0)}
                  />
                </div>
              )}
            </>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <RegistrationSection
                mode={event ? "edit" : "create"}
                form={formData}
                onChange={(patch) => setFormData((prev) => ({ ...prev, ...patch }))}
                showErrors={registrationShowErrors}
              />
              {registrationShowErrors && registrationProblem && (
                <p className="text-sm text-destructive" role="alert">{registrationProblem}</p>
              )}
            </div>
          )}

          {currentStep === 5 && (
            <>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <Label>{t.publishEventNow}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.makeEventVisible}
                  </p>
                </div>
                <Switch
                  checked={formData.publishNow}
                  onCheckedChange={(checked) => updateField("publishNow", checked)}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <Label>{t.sendNotification}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.notifyAllMembers}
                  </p>
                </div>
                <Switch
                  checked={formData.notifyMembers}
                  onCheckedChange={(checked) => updateField("notifyMembers", checked)}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <Label>{t.allowCommentsLabel}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.letMembersComment}
                  </p>
                </div>
                <Switch
                  checked={formData.allowComments}
                  onCheckedChange={(checked) => updateField("allowComments", checked)}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t.back}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              {t.cancel}
            </Button>
            {currentStep < steps.length ? (
              <Button onClick={handleNext}>
                {t.next}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                {event ? t.saveChanges : t.createEvent}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
