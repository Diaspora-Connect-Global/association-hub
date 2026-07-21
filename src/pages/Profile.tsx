import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Info,
  Mail,
  Users,
  CreditCard,
  Network,
  Shield,
  Upload,
  Trash2,
  Plus,
  Eye,
  Link2,
  User,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useT } from "@/hooks/useT";
import { getAdminAssociationId } from "@/stores/adminAuthStore";
import {
  getAssociation,
  updateAssociation,
  getAssociationAvatarUploadUrl,
  getAssociationCoverUploadUrl,
  uploadAssociationAvatar,
} from "@/services/graphql/association/operations";
import type { JoinPolicy, AssociationVisibility } from "@/services/graphql/association/types";
import {
  useGetCurrentAdmin,
  useGetLinkedCommunities,
  useGetAssociationAdmins,
  useLinkCommunity,
  useUnlinkCommunity,
  useAssignAssociationAdmin,
  useRemoveAssociationAdmin,
} from "@/hooks/adminProfile";

// ── Constants ────────────────────────────────────────────────────────────────

const associationTypes = [
  "NGO",
  "Club",
  "Church",
  "Community Organization",
  "Youth Group",
  "Cultural Group",
  "Professional Network",
  "Other",
];

const countries = [
  "Ghana",
  "Nigeria",
  "Kenya",
  "South Africa",
  "United Kingdom",
  "United States",
  "Germany",
  "France",
  "Netherlands",
  "Belgium",
];

const currencies = ["USD", "EUR", "GBP", "GHS", "NGN", "ZAR"];

// ── Schema ───────────────────────────────────────────────────────────────────

const associationSchema = z.object({
  associationName: z.string().min(1, "Association name is required").max(100),
  description: z.string().max(2000).optional().or(z.literal("")),
  associationType: z.string().min(1),
  privacyType: z.enum(["Public", "Private"]),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  contactPhone: z.string().max(20).optional().or(z.literal("")),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  address: z.string().max(200).optional().or(z.literal("")),
  countriesServed: z.array(z.string()),
  joinPolicy: z.string().min(1),
  whoCanPost: z.string().min(1),
  paidAssociation: z.boolean(),
  paymentType: z.string(),
  paymentAmount: z.string(),
  subscriptionPeriod: z.string(),
  paymentCurrency: z.string(),
});
type AssociationFormValues = z.infer<typeof associationSchema>;

// ── Component ────────────────────────────────────────────────────────────────

export default function Profile() {
  const t = useT();
  const associationId = useMemo(() => getAdminAssociationId(), []);
  const { profile: adminProfile, loading: adminLoading } = useGetCurrentAdmin();
  const { communities: linkedCommunities } = useGetLinkedCommunities(associationId);
  const { admins } = useGetAssociationAdmins(associationId);

  // ── Hooks for community/admin mutations ───────────────────────────────────
  const linkCommunity = useLinkCommunity(associationId);
  const unlinkCommunity = useUnlinkCommunity(associationId);
  const assignAdmin = useAssignAssociationAdmin(associationId);
  const removeAdmin = useRemoveAssociationAdmin(associationId);

  // ── Upload refs ───────────────────────────────────────────────────────────
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);

  // ── Link community dialog state ───────────────────────────────────────────
  const [linkCommunityDialogOpen, setLinkCommunityDialogOpen] = useState(false);
  const [linkCommunityId, setLinkCommunityId] = useState("");

  // ── Assign admin dialog state ─────────────────────────────────────────────
  const [assignAdminDialogOpen, setAssignAdminDialogOpen] = useState(false);
  const [assignAdminUserId, setAssignAdminUserId] = useState("");
  const [assignAdminRole, setAssignAdminRole] = useState<"ADMIN" | "MODERATOR">("ADMIN");

  // ── Remove admin confirm state ────────────────────────────────────────────
  const [removeAdminTarget, setRemoveAdminTarget] = useState<{ id: string; name: string } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AssociationFormValues>({
    resolver: zodResolver(associationSchema),
    defaultValues: {
      associationName: "",
      description: "",
      associationType: "Professional Network",
      privacyType: "Public",
      contactEmail: "",
      contactPhone: "",
      website: "",
      address: "",
      countriesServed: [],
      joinPolicy: "Open (Anyone Can Join)",
      whoCanPost: "Admins Only",
      paidAssociation: false,
      paymentType: "One-time",
      paymentAmount: "",
      subscriptionPeriod: "Monthly",
      paymentCurrency: "USD",
    },
  });

  const paidAssociation = watch("paidAssociation");
  const paymentType = watch("paymentType");
  const countriesServed = watch("countriesServed");

  // The raw policy as loaded. This 2-option form can only express OPEN vs APPROVAL;
  // if the association is INVITE_ONLY or PAID we preserve it instead of downgrading.
  const loadedJoinPolicyRef = useRef<JoinPolicy | null>(null);

  useEffect(() => {
    if (!associationId) return;
    void getAssociation(associationId).then((assoc) => {
      loadedJoinPolicyRef.current = (assoc.joinPolicy as JoinPolicy) ?? null;
      reset((prev) => ({
        ...prev,
        associationName: assoc.name,
        description: assoc.description ?? "",
        privacyType: assoc.visibility === "PUBLIC" ? "Public" : "Private",
        joinPolicy: assoc.joinPolicy === "OPEN" ? "Open (Anyone Can Join)" : "Approval Required",
      }));
    });
  }, [associationId, reset]);

  const onSubmit = async (values: AssociationFormValues) => {
    if (!associationId) return;
    try {
      const parsedPaymentAmount = parseFloat(values.paymentAmount);
      await updateAssociation({
        id: associationId,
        name: values.associationName,
        description: values.description || undefined,
        visibility: (values.privacyType === "Public" ? "PUBLIC" : "PRIVATE") as AssociationVisibility,
        // This form offers only Open vs Approval. If the association is INVITE_ONLY
        // or PAID, don't overwrite it (would downgrade); otherwise map to the real
        // backend enum — APPROVAL, not the old "REQUEST" which the backend rejects.
        joinPolicy:
          loadedJoinPolicyRef.current === "INVITE_ONLY" || loadedJoinPolicyRef.current === "PAID"
            ? undefined
            : ((values.joinPolicy === "Open (Anyone Can Join)" ? "OPEN" : "APPROVAL") as JoinPolicy),
        // Contact tab
        contactEmail: values.contactEmail || undefined,
        contactPhone: values.contactPhone || undefined,
        website: values.website || undefined,
        address: values.address || undefined,
        // Basic info tab
        countriesServed: values.countriesServed.length > 0 ? values.countriesServed : undefined,
        associationType: values.associationType || undefined,
        // Membership tab
        whoCanPost: values.whoCanPost || undefined,
        // Payment tab
        paidAssociation: values.paidAssociation,
        ...(values.paidAssociation && {
          paymentType: values.paymentType || undefined,
          paymentAmount: !isNaN(parsedPaymentAmount) && values.paymentAmount !== "" ? parsedPaymentAmount : undefined,
          subscriptionPeriod: values.subscriptionPeriod || undefined,
          paymentCurrency: values.paymentCurrency || undefined,
        }),
      });
      toast({ title: t.success, description: t.settingsSaved });
    } catch (err) {
      toast({
        title: "Save failed",
        description: err instanceof Error ? err.message : "Could not save changes.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    reset();
    toast({ title: t.cancel, description: "Changes discarded." });
  };

  // ── Logo upload handler ───────────────────────────────────────────────────
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !associationId) return;
    setLogoUploading(true);
    try {
      const { uploadUrl, fileKey } = await getAssociationAvatarUploadUrl(associationId);
      await uploadAssociationAvatar(uploadUrl, file);
      // Build the read URL from the fileKey (S3 CDN pattern used by this codebase)
      const readUrl = fileKey;
      setValue("associationName", watch("associationName")); // touch form to mark dirty
      // Store avatarKey via updateAssociation so the server records the new avatar
      await updateAssociation({ id: associationId, avatarKey: fileKey });
      toast({ title: "Success", description: "Logo uploaded successfully." });
      // readUrl can be used for a future <img> preview; suppressing unused-var warning below
      void readUrl;
      // Reset so the same file can be re-selected
      e.target.value = "";
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Could not upload logo.",
        variant: "destructive",
      });
    } finally {
      setLogoUploading(false);
    }
  };

  // ── Banner (cover) upload handler ─────────────────────────────────────────
  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !associationId) return;
    setBannerUploading(true);
    try {
      const { uploadUrl } = await getAssociationCoverUploadUrl(associationId);
      await uploadAssociationAvatar(uploadUrl, file);
      toast({ title: "Success", description: "Banner uploaded successfully." });
      e.target.value = "";
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Could not upload banner.",
        variant: "destructive",
      });
    } finally {
      setBannerUploading(false);
    }
  };

  // ── Link community handlers ───────────────────────────────────────────────
  const handleLinkCommunityConfirm = () => {
    if (!linkCommunityId.trim()) return;
    linkCommunity.mutate(linkCommunityId.trim(), {
      onSuccess: () => {
        setLinkCommunityDialogOpen(false);
        setLinkCommunityId("");
        toast({ title: "Success", description: "Community linked." });
      },
    });
  };

  // ── Assign admin handlers ─────────────────────────────────────────────────
  const handleAssignAdminConfirm = () => {
    if (!assignAdminUserId.trim()) return;
    assignAdmin.mutate(
      { userId: assignAdminUserId.trim(), role: assignAdminRole },
      {
        onSuccess: () => {
          setAssignAdminDialogOpen(false);
          setAssignAdminUserId("");
          setAssignAdminRole("ADMIN");
          toast({ title: "Success", description: "Admin assigned." });
        },
      }
    );
  };

  // ── Remove admin handlers ─────────────────────────────────────────────────
  const handleRemoveAdminConfirm = () => {
    if (!removeAdminTarget) return;
    removeAdmin.mutate(removeAdminTarget.id, {
      onSuccess: () => {
        setRemoveAdminTarget(null);
        toast({ title: "Success", description: "Admin removed." });
      },
    });
  };

  return (
    <AdminLayout title={t.associationProfileSettings} subtitle={t.associationProfileSubtitle}>
      <div className="mb-6 flex items-center justify-end gap-3">
        <Button variant="outline" onClick={handleCancel}>
          {t.cancel}
        </Button>
        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? t.loading : t.saveChanges}
        </Button>
      </div>

      <Tabs defaultValue="basic_info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-muted p-1 rounded-lg">
          <TabsTrigger value="basic_info" className="flex items-center gap-2 body-small">
            <Info className="h-4 w-4" />
            <span className="hidden lg:inline">{t.basicInfo}</span>
          </TabsTrigger>
          <TabsTrigger value="contact_info" className="flex items-center gap-2 body-small">
            <Mail className="h-4 w-4" />
            <span className="hidden lg:inline">{t.contactInfo}</span>
          </TabsTrigger>
          <TabsTrigger value="membership" className="flex items-center gap-2 body-small">
            <Users className="h-4 w-4" />
            <span className="hidden lg:inline">{t.membership}</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2 body-small">
            <CreditCard className="h-4 w-4" />
            <span className="hidden lg:inline">{t.payment}</span>
          </TabsTrigger>
          <TabsTrigger value="communities" className="flex items-center gap-2 body-small">
            <Network className="h-4 w-4" />
            <span className="hidden lg:inline">{t.communities}</span>
          </TabsTrigger>
          <TabsTrigger value="admins" className="flex items-center gap-2 body-small">
            <Shield className="h-4 w-4" />
            <span className="hidden lg:inline">{t.admins}</span>
          </TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic_info">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6">
              <h3 className="section-header">{t.associationIdentity}</h3>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="label-small">
                  {t.associationName} *
                </Label>
                <Input id="name" {...register("associationName")} />
                {errors.associationName && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.associationName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="label-small">{t.associationType} *</Label>
                <Controller
                  control={control}
                  name="associationType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {associationTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className="label-small">{t.privacyType} *</Label>
                <Controller
                  control={control}
                  name="privacyType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="Public">{t.publicType}</SelectItem>
                        <SelectItem value="Private">{t.privateType}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="description" className="label-small">
                  {t.description}
                </Label>
                <Textarea id="description" rows={4} maxLength={2000} {...register("description")} />
              </div>

              <div className="space-y-2">
                <Label className="label-small">{t.logo}</Label>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted">
                    {logoUploading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={logoInputRef}
                    className="hidden"
                    onChange={(e) => { void handleLogoChange(e); }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={logoUploading}
                    onClick={() => logoInputRef.current?.click()}
                  >
                    {logoUploading ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-1" /> Uploading…</>
                    ) : (
                      t.uploadLogo
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="label-small">{t.bannerImage}</Label>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-32 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted">
                    {bannerUploading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={bannerInputRef}
                    className="hidden"
                    onChange={(e) => { void handleBannerChange(e); }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={bannerUploading}
                    onClick={() => bannerInputRef.current?.click()}
                  >
                    {bannerUploading ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-1" /> Uploading…</>
                    ) : (
                      t.uploadBanner
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Contact Information Tab */}
        <TabsContent value="contact_info">
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-6">
                <h3 className="section-header">{t.primaryContactDetails}</h3>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email" className="label-small">
                    {t.contactEmail}
                  </Label>
                  <Input id="email" type="email" {...register("contactEmail")} />
                  {errors.contactEmail && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.contactEmail.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="label-small">
                    {t.contactPhone}
                  </Label>
                  <Input id="phone" type="tel" {...register("contactPhone")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="label-small">
                    {t.website}
                  </Label>
                  <Input id="website" type="url" {...register("website")} />
                  {errors.website && (
                    <p className="text-xs text-destructive mt-1">{errors.website.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="label-small">
                    {t.address}
                  </Label>
                  <Input id="address" {...register("address")} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-6">
                <h3 className="section-header">{t.countriesServed}</h3>
              </div>

              <div className="space-y-2">
                <Select
                  onValueChange={(value) => {
                    if (!countriesServed.includes(value)) {
                      setValue("countriesServed", [...countriesServed, value]);
                    }
                  }}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder={t.countriesServed} />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-3">
                  {countriesServed.map((country) => (
                    <span
                      key={country}
                      className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 caption-small"
                    >
                      {country}
                      <button
                        className="ml-1 text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          setValue(
                            "countriesServed",
                            countriesServed.filter((c) => c !== country)
                          )
                        }
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Membership Settings Tab */}
        <TabsContent value="membership">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6">
              <h3 className="section-header">{t.memberPolicies}</h3>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <Label className="label-small">{t.joinPolicy} *</Label>
                <Controller
                  control={control}
                  name="joinPolicy"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="Open (Anyone Can Join)">{t.openAnyone}</SelectItem>
                        <SelectItem value="Approval Required">{t.approvalRequired}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className="label-small">{t.whoCanPost} *</Label>
                <Controller
                  control={control}
                  name="whoCanPost"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="Admins Only">{t.adminsOnly}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6">
              <h3 className="section-header">{t.payment}</h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="label-small">{t.paidAssociation}</p>
                </div>
                <Controller
                  control={control}
                  name="paidAssociation"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>

              {paidAssociation && (
                <div className="grid gap-6 lg:grid-cols-2 animate-fade-in">
                  <div className="space-y-2">
                    <Label className="label-small">{t.paymentType}</Label>
                    <Controller
                      control={control}
                      name="paymentType"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover z-50">
                            <SelectItem value="One-time">{t.oneTime}</SelectItem>
                            <SelectItem value="Subscription">{t.subscription}</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="label-small">{t.paymentAmount}</Label>
                    <Input type="number" min="1" {...register("paymentAmount")} />
                  </div>

                  {paymentType === "Subscription" && (
                    <div className="space-y-2">
                      <Label className="label-small">{t.subscriptionPeriod}</Label>
                      <Controller
                        control={control}
                        name="subscriptionPeriod"
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="bg-background">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover z-50">
                              <SelectItem value="Monthly">{t.monthly}</SelectItem>
                              <SelectItem value="Quarterly">{t.quarterly}</SelectItem>
                              <SelectItem value="Yearly">{t.yearly}</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="label-small">{t.paymentCurrency}</Label>
                    <Controller
                      control={control}
                      name="paymentCurrency"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover z-50">
                            {currencies.map((currency) => (
                              <SelectItem key={currency} value={currency}>
                                {currency}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Communities Tab */}
        <TabsContent value="communities">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="section-header">{t.linkedCommunities}</h3>
              </div>
              <Button className="gap-2" onClick={() => setLinkCommunityDialogOpen(true)}>
                <Link2 className="h-4 w-4" />
                {t.linkCommunities}
              </Button>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">
                      {t.communityName}
                    </th>
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">
                      {t.type}
                    </th>
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">
                      {t.countriesServed}
                    </th>
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">
                      {t.status}
                    </th>
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">
                      {t.actions}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {linkedCommunities.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center body-small text-muted-foreground"
                      >
                        No linked communities yet.
                      </td>
                    </tr>
                  ) : (
                    linkedCommunities.map((community) => (
                      <tr key={community.id} className="border-b border-border">
                        <td className="px-6 py-4 label-small">{community.name}</td>
                        <td className="px-6 py-4 body-small text-muted-foreground">—</td>
                        <td className="px-6 py-4 body-small text-muted-foreground">
                          {community.memberCount != null
                            ? `${community.memberCount} members`
                            : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full surface-success text-success px-2.5 py-0.5 caption-small">
                            {community.visibility}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Eye className="h-4 w-4" />
                              {t.view}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1 text-destructive hover:text-destructive"
                              disabled={unlinkCommunity.isPending}
                              onClick={() => unlinkCommunity.mutate(community.id)}
                            >
                              {unlinkCommunity.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                              {t.unlink}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Link Community Dialog */}
          <Dialog open={linkCommunityDialogOpen} onOpenChange={setLinkCommunityDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Link a Community</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <Label className="label-small">Community ID</Label>
                <Input
                  placeholder="Enter community ID"
                  value={linkCommunityId}
                  onChange={(e) => setLinkCommunityId(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => { setLinkCommunityDialogOpen(false); setLinkCommunityId(""); }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleLinkCommunityConfirm}
                  disabled={linkCommunity.isPending || !linkCommunityId.trim()}
                >
                  {linkCommunity.isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-1" /> Linking…</>
                  ) : (
                    "Link Community"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Admins Tab */}
        <TabsContent value="admins">
          <div className="rounded-xl border border-border bg-card p-6 mb-6">
            <div className="mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="section-header">Your Admin Identity</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="caption-small text-muted-foreground mb-1">Name</p>
                <p className="label-small">
                  {adminLoading
                    ? "—"
                    : `${adminProfile?.firstName ?? ""} ${adminProfile?.lastName ?? ""}`.trim() ||
                      "—"}
                </p>
              </div>
              <div>
                <p className="caption-small text-muted-foreground mb-1">Email</p>
                <p className="label-small">
                  {adminLoading ? "—" : (adminProfile?.email ?? "—")}
                </p>
              </div>
              <div>
                <p className="caption-small text-muted-foreground mb-1">Phone</p>
                <p className="label-small">
                  {adminLoading ? "—" : (adminProfile?.phone ?? "—")}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="section-header">{t.manageAdmins}</h3>
              </div>
              <Button className="gap-2" onClick={() => setAssignAdminDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                {t.assignNewAdmin}
              </Button>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">
                      {t.name}
                    </th>
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">
                      {t.email}
                    </th>
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">
                      {t.role}
                    </th>
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">
                      {t.status}
                    </th>
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">
                      {t.actions}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {admins.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center body-small text-muted-foreground"
                      >
                        No admins found.
                      </td>
                    </tr>
                  ) : (
                    admins.map((admin) => {
                      const displayName = admin.displayName ?? admin.email ?? admin.userId;
                      const initials = displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2);
                      const isPrimary =
                        admin.role === "PRIMARY_ADMIN" || admin.role === "Primary Admin";
                      return (
                        <tr key={admin.id} className="border-b border-border">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground caption-small font-semibold">
                                {initials}
                              </div>
                              <span className="label-small">{displayName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 body-small text-muted-foreground">
                            {admin.email ?? "—"}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-0.5 caption-small",
                                isPrimary
                                  ? "surface-info text-info"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {isPrimary ? t.primaryAdmin : t.admin}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center rounded-full surface-success text-success px-2.5 py-0.5 caption-small">
                              {t.active}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1 text-destructive hover:text-destructive"
                              disabled={isPrimary || removeAdmin.isPending}
                              onClick={() =>
                                !isPrimary &&
                                setRemoveAdminTarget({ id: admin.id, name: displayName })
                              }
                            >
                              {removeAdmin.isPending && removeAdminTarget?.id === admin.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                              {t.remove}
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Assign Admin Dialog */}
          <Dialog open={assignAdminDialogOpen} onOpenChange={setAssignAdminDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign New Admin</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label className="label-small">User ID</Label>
                  <Input
                    placeholder="Enter user ID"
                    value={assignAdminUserId}
                    onChange={(e) => setAssignAdminUserId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="label-small">Role</Label>
                  <Select
                    value={assignAdminRole}
                    onValueChange={(v) => setAssignAdminRole(v as "ADMIN" | "MODERATOR")}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="MODERATOR">Moderator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => { setAssignAdminDialogOpen(false); setAssignAdminUserId(""); }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignAdminConfirm}
                  disabled={assignAdmin.isPending || !assignAdminUserId.trim()}
                >
                  {assignAdmin.isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-1" /> Assigning…</>
                  ) : (
                    "Assign Admin"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Remove Admin Confirmation */}
          <AlertDialog
            open={!!removeAdminTarget}
            onOpenChange={(open) => { if (!open) setRemoveAdminTarget(null); }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Admin</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove{" "}
                  <strong>{removeAdminTarget?.name}</strong> as an admin? This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRemoveAdminConfirm}
                  disabled={removeAdmin.isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {removeAdmin.isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-1" /> Removing…</>
                  ) : (
                    "Remove"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
