import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  User,
  Shield,
  Upload,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Phone,
  Trash2,
} from "lucide-react";
import { useT } from "@/hooks/useT";
import {
  useGetCurrentAdmin,
  useUpdateAdminProfile,
  useUpdateAdminPassword,
  useAdminAvatarUpload,
  useEnableTwoFactor,
  useVerifyTwoFactor,
  useDisableTwoFactor,
} from "@/hooks/adminProfile";

// ── Schemas ─────────────────────────────────────────────────────────────────

const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  phone: z.string().max(20).optional().or(z.literal("")),
});
type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type PasswordValues = z.infer<typeof passwordSchema>;

// ── 2FA dialog state machine ─────────────────────────────────────────────────
type TwoFAStep = "choose-method" | "show-qr" | "enter-otp";

// ── Component ────────────────────────────────────────────────────────────────

export default function AdminProfile() {
  const t = useT();

  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Avatar upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  // 2FA enable dialog
  const [twoFADialogOpen, setTwoFADialogOpen] = useState(false);
  const [twoFAStep, setTwoFAStep] = useState<TwoFAStep>("choose-method");
  const [twoFAMethod, setTwoFAMethod] = useState<"APP" | "SMS">("APP");
  const [twoFAQrCode, setTwoFAQrCode] = useState<string>("");
  const [otpValue, setOtpValue] = useState("");

  // 2FA disable confirmation dialog
  const [disableTwoFADialogOpen, setDisableTwoFADialogOpen] = useState(false);

  // Hooks
  const { profile, loading: profileLoading, fetchProfile } = useGetCurrentAdmin();
  const { loading: saving, saveProfile } = useUpdateAdminProfile();
  const { changePassword, loading: changingPassword } = useUpdateAdminPassword();
  const { uploadAvatar, uploading } = useAdminAvatarUpload();
  const { initEnable, loading: enablingTwoFA } = useEnableTwoFactor();
  const { verifyCode, loading: verifyingTwoFA } = useVerifyTwoFactor();
  const { doDisable, loading: disablingTwoFA } = useDisableTwoFactor();

  // ── Personal Info Form ───────────────────────────────────────────────────
  const {
    register: registerPersonal,
    handleSubmit: handleSubmitPersonal,
    reset: resetPersonalForm,
    formState: { errors: personalErrors, isSubmitting: isSubmittingPersonal },
  } = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: { firstName: "", lastName: "", phone: "" },
  });

  // ── Password Form ────────────────────────────────────────────────────────
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  // Populate personal form and avatar when profile loads
  useEffect(() => {
    if (!profile) return;
    resetPersonalForm({
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      phone: profile.phone ?? "",
    });
    setAvatarUrl(profile.avatarUrl ?? "");
  }, [profile, resetPersonalForm]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSave = async (values: PersonalInfoValues) => {
    await saveProfile({
      firstName: values.firstName || undefined,
      lastName: values.lastName || undefined,
      phone: values.phone || undefined,
      avatarUrl: avatarUrl || undefined,
    });
  };

  const handleAvatarFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const readUrl = await uploadAvatar(file);
        setAvatarUrl(readUrl);
        await saveProfile({ avatarUrl: readUrl });
      } finally {
        // reset the input so the same file can be re-selected
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [uploadAvatar, saveProfile],
  );

  const handleRemovePhoto = async () => {
    setAvatarUrl("");
    await saveProfile({ avatarUrl: "" });
  };

  const handlePasswordChange = async (values: PasswordValues) => {
    try {
      await changePassword(values.currentPassword, values.newPassword);
      resetPasswordForm();
    } catch {
      // error toast already shown by hook
    }
  };

  // ── 2FA helpers ───────────────────────────────────────────────────────────

  const handleToggle2FA = () => {
    if (profile?.twoFactorEnabled) {
      setDisableTwoFADialogOpen(true);
    } else {
      setTwoFAStep("choose-method");
      setOtpValue("");
      setTwoFAQrCode("");
      setTwoFADialogOpen(true);
    }
  };

  const handleProceedMethod = async () => {
    try {
      const result = await initEnable(twoFAMethod);
      if (result.success) {
        if (twoFAMethod === "APP") {
          setTwoFAQrCode(result.qrCode ?? "");
          setTwoFAStep("show-qr");
        } else {
          setTwoFAStep("enter-otp");
        }
      }
    } catch {
      // error toast already shown by hook
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const result = await verifyCode(otpValue);
      if (result.success) {
        setTwoFADialogOpen(false);
        setOtpValue("");
        void fetchProfile();
      }
    } catch {
      // error toast already shown by hook
    }
  };

  const handleConfirmDisable2FA = async () => {
    try {
      const result = await doDisable();
      if (result.success) {
        setDisableTwoFADialogOpen(false);
        void fetchProfile();
      }
    } catch {
      // error toast already shown by hook
    }
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const firstInitial = profile?.firstName?.[0] ?? "";
  const lastInitial = profile?.lastName?.[0] ?? "";
  const initials = `${firstInitial}${lastInitial}`.toUpperCase();
  const twoFactorEnabled = profile?.twoFactorEnabled ?? false;

  return (
    <AdminLayout
      title="My Profile"
      subtitle="Manage your personal information and security settings"
    >
      {/* Hidden file input for avatar */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarFileChange}
      />

      {/* Header Actions */}
      <div className="mb-6 flex items-center justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => resetPersonalForm()}
          disabled={saving || profileLoading || isSubmittingPersonal}
        >
          {t.cancel}
        </Button>
        <Button
          onClick={handleSubmitPersonal(handleSave)}
          disabled={saving || profileLoading || isSubmittingPersonal || uploading}
        >
          {saving || isSubmittingPersonal ? t.loading : t.saveChanges}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-lg max-w-md">
          <TabsTrigger value="personal" className="flex items-center gap-2 body-small">
            <User className="h-4 w-4" />
            Personal Info
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 body-small">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* ── Personal Information Tab ─────────────────────────────────── */}
        <TabsContent value="personal">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6">
              <h3 className="section-header">Personal Information</h3>
              <p className="body-small text-muted-foreground mt-1">
                Update your personal details and profile picture.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Avatar */}
              <div className="space-y-4 lg:col-span-2">
                <Label className="label-small">Profile Picture</Label>
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24 border-4 border-primary/20">
                    <AvatarImage
                      src={avatarUrl}
                      alt={`${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4" />
                      {uploading ? "Uploading…" : "Upload New Photo"}
                    </Button>
                    {avatarUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-destructive hover:text-destructive"
                        disabled={saving || uploading}
                        onClick={handleRemovePhoto}
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove Photo
                      </Button>
                    )}
                    <p className="caption-small text-muted-foreground">
                      JPG, PNG or GIF. Max 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="label-small">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder={profileLoading ? "—" : "Enter your first name"}
                  disabled={profileLoading}
                  {...registerPersonal("firstName")}
                />
                {personalErrors.firstName && (
                  <p className="text-xs text-destructive mt-1">
                    {personalErrors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="label-small">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder={profileLoading ? "—" : "Enter your last name"}
                  disabled={profileLoading}
                  {...registerPersonal("lastName")}
                />
                {personalErrors.lastName && (
                  <p className="text-xs text-destructive mt-1">
                    {personalErrors.lastName.message}
                  </p>
                )}
              </div>

              {/* Email (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="label-small flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile?.email ?? ""}
                  readOnly
                  placeholder={profileLoading ? "—" : "your@email.com"}
                  className="bg-muted cursor-default"
                />
                <p className="caption-small text-muted-foreground">
                  Used for login and notifications.
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="label-small flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={profileLoading ? "—" : "+233 55 555 5555"}
                  disabled={profileLoading}
                  {...registerPersonal("phone")}
                />
                {personalErrors.phone && (
                  <p className="text-xs text-destructive mt-1">
                    {personalErrors.phone.message}
                  </p>
                )}
                <p className="caption-small text-muted-foreground">
                  Optional. Used for SMS notifications and 2FA.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Security Tab ──────────────────────────────────────────────── */}
        <TabsContent value="security">
          <div className="space-y-6">
            {/* Password Change */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-6">
                <h3 className="section-header">{t.changePassword}</h3>
                <p className="body-small text-muted-foreground mt-1">
                  Update your password to keep your account secure.
                </p>
              </div>

              <div className="grid gap-4 max-w-md">
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="label-small">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      className="pr-10"
                      {...registerPassword("currentPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-xs text-destructive mt-1">
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="label-small">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="pr-10"
                      {...registerPassword("newPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-xs text-destructive mt-1">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                  <p className="caption-small text-muted-foreground">
                    Must be at least 8 characters.
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="label-small">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="pr-10"
                      {...registerPassword("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-xs text-destructive mt-1">
                      {passwordErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleSubmitPassword(handlePasswordChange)}
                  disabled={changingPassword || isSubmittingPassword}
                  className="w-fit mt-2"
                >
                  {changingPassword || isSubmittingPassword ? t.loading : "Update Password"}
                </Button>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-6">
                <h3 className="section-header">{t.twoFactorAuth}</h3>
                <p className="body-small text-muted-foreground mt-1">
                  Add an extra layer of security to your account.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Smartphone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="label-small">Two-Factor Authentication</p>
                      <p className="caption-small text-muted-foreground">
                        {twoFactorEnabled
                          ? "Enabled — Your account is secured with 2FA"
                          : "Not enabled — Enable for extra security"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={handleToggle2FA}
                    disabled={enablingTwoFA || disablingTwoFA || profileLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Enable 2FA Dialog ───────────────────────────────────────────────── */}
      <Dialog open={twoFADialogOpen} onOpenChange={setTwoFADialogOpen}>
        <DialogContent className="max-w-sm">
          {twoFAStep === "choose-method" && (
            <>
              <DialogHeader>
                <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
                <DialogDescription>
                  Choose how you want to receive authentication codes.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-3 py-2">
                <button
                  onClick={() => setTwoFAMethod("APP")}
                  className={`flex items-center gap-3 rounded-lg border p-4 transition-colors text-left ${
                    twoFAMethod === "APP"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Smartphone className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="label-small">Authenticator App</p>
                    <p className="caption-small text-muted-foreground">
                      Google Authenticator, Authy, etc.
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setTwoFAMethod("SMS")}
                  className={`flex items-center gap-3 rounded-lg border p-4 transition-colors text-left ${
                    twoFAMethod === "SMS"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Mail className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="label-small">SMS</p>
                    <p className="caption-small text-muted-foreground">
                      Receive codes via text message
                    </p>
                  </div>
                </button>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setTwoFADialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleProceedMethod} disabled={enablingTwoFA}>
                  {enablingTwoFA ? t.loading : "Continue"}
                </Button>
              </DialogFooter>
            </>
          )}

          {twoFAStep === "show-qr" && (
            <>
              <DialogHeader>
                <DialogTitle>Scan QR Code</DialogTitle>
                <DialogDescription>
                  Scan this QR code with your authenticator app, then enter the 6-digit code it
                  generates.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col items-center gap-4 py-2">
                {twoFAQrCode ? (
                  <img
                    src={twoFAQrCode}
                    alt="2FA QR Code"
                    className="h-48 w-48 rounded-lg border border-border"
                  />
                ) : (
                  <div className="h-48 w-48 rounded-lg border border-border bg-muted flex items-center justify-center">
                    <p className="caption-small text-muted-foreground">No QR code available</p>
                  </div>
                )}

                <div className="w-full space-y-2">
                  <Label htmlFor="otp-qr" className="label-small">
                    Verification Code
                  </Label>
                  <Input
                    id="otp-qr"
                    placeholder="000000"
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="text-center tracking-widest text-lg"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setTwoFAStep("choose-method")}>
                  Back
                </Button>
                <Button
                  onClick={handleVerifyOtp}
                  disabled={otpValue.length < 6 || verifyingTwoFA}
                >
                  {verifyingTwoFA ? t.loading : "Verify"}
                </Button>
              </DialogFooter>
            </>
          )}

          {twoFAStep === "enter-otp" && (
            <>
              <DialogHeader>
                <DialogTitle>Enter SMS Code</DialogTitle>
                <DialogDescription>
                  A 6-digit code has been sent to your phone number. Enter it below to complete
                  setup.
                </DialogDescription>
              </DialogHeader>

              <div className="py-2 space-y-2">
                <Label htmlFor="otp-sms" className="label-small">
                  Verification Code
                </Label>
                <Input
                  id="otp-sms"
                  placeholder="000000"
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="text-center tracking-widest text-lg"
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setTwoFAStep("choose-method")}>
                  Back
                </Button>
                <Button
                  onClick={handleVerifyOtp}
                  disabled={otpValue.length < 6 || verifyingTwoFA}
                >
                  {verifyingTwoFA ? t.loading : "Verify"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Disable 2FA Confirmation ────────────────────────────────────────── */}
      <AlertDialog open={disableTwoFADialogOpen} onOpenChange={setDisableTwoFADialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disable Two-Factor Authentication?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the extra layer of security from your account. You can re-enable it
              at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={disablingTwoFA}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDisable2FA}
              disabled={disablingTwoFA}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {disablingTwoFA ? t.loading : "Disable 2FA"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
