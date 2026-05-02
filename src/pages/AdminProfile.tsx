import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
  User,
  Shield,
  Upload,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Phone,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useT } from "@/hooks/useT";
import { useGetCurrentAdmin, useUpdateAdminProfile } from "@/hooks/adminProfile";

// ── Schemas ─────────────────────────────────────────────────────────────────

const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  phone: z.string().max(20).optional().or(z.literal("")),
  avatarUrl: z.string().optional().or(z.literal("")),
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

// ── Component ────────────────────────────────────────────────────────────────

export default function AdminProfile() {
  const t = useT();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 2FA local state (not a form field)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState("app");

  const { profile, loading: profileLoading } = useGetCurrentAdmin();
  const { loading: saving, saveProfile } = useUpdateAdminProfile();

  // ── Personal Info Form ───────────────────────────────────────────────────
  const {
    register: registerPersonal,
    handleSubmit: handleSubmitPersonal,
    reset: resetPersonalForm,
    formState: { errors: personalErrors, isSubmitting: isSubmittingPersonal },
  } = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      avatarUrl: "",
    },
  });

  // ── Password Form ────────────────────────────────────────────────────────
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Populate personal form when profile loads
  useEffect(() => {
    if (!profile) return;
    resetPersonalForm({
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      phone: profile.phone ?? "",
      avatarUrl: profile.avatarUrl ?? "",
    });
    setTwoFactorEnabled(profile.twoFactorEnabled);
  }, [profile, resetPersonalForm]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSave = async (values: PersonalInfoValues) => {
    await saveProfile({
      firstName: values.firstName || undefined,
      lastName: values.lastName || undefined,
      phone: values.phone || undefined,
      avatarUrl: values.avatarUrl || undefined,
    });
  };

  const handlePasswordChange = async (_values: PasswordValues) => {
    toast({
      title: "Profile data not yet available from API",
      description: "Password change is not yet supported.",
    });
  };

  const handleEnable2FA = () => {
    setTwoFactorEnabled((prev) => !prev);
    toast({
      title: twoFactorEnabled ? "2FA Disabled" : "2FA Enabled",
      description: twoFactorEnabled
        ? "Two-factor authentication has been disabled."
        : "Two-factor authentication has been enabled.",
    });
  };

  // Derive initials from the current form values via a watch-free approach:
  // We read directly from the form's registered refs via a controlled read.
  // Since we need the live values for the avatar, we use a separate small
  // watch — but to keep it simple we just use the profile object for initials
  // (avatar section is display-only, not interactive in the current code).
  const firstInitial = profile?.firstName?.[0] ?? "";
  const lastInitial = profile?.lastName?.[0] ?? "";
  const initials = `${firstInitial}${lastInitial}`.toUpperCase();

  return (
    <AdminLayout
      title="My Profile"
      subtitle="Manage your personal information and security settings"
    >
      {/* Header Actions — submits the personal info form */}
      <div className="mb-6 flex items-center justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => toast({ title: t.cancel, description: "Changes discarded." })}
        >
          {t.cancel}
        </Button>
        <Button
          onClick={handleSubmitPersonal(handleSave)}
          disabled={saving || profileLoading || isSubmittingPersonal}
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

        {/* Personal Information Tab */}
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
                      src={profile?.avatarUrl ?? ""}
                      alt={`${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </Button>
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

              {/* Email (read-only — not a form field) */}
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

        {/* Security Tab */}
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
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
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
                      onClick={() => setShowNewPassword(!showNewPassword)}
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

                {/* Confirm New Password */}
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  disabled={saving || isSubmittingPassword}
                  className="w-fit mt-2"
                >
                  Update Password
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
                          ? "Enabled - Your account is secured with 2FA"
                          : "Not enabled - Enable for extra security"}
                      </p>
                    </div>
                  </div>
                  <Switch checked={twoFactorEnabled} onCheckedChange={handleEnable2FA} />
                </div>

                {twoFactorEnabled && (
                  <div className="rounded-lg border border-border p-4 animate-fade-in">
                    <p className="label-small mb-3">2FA Method</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        onClick={() => setTwoFactorMethod("app")}
                        className={`flex items-center gap-3 rounded-lg border p-4 transition-colors ${
                          twoFactorMethod === "app"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Smartphone className="h-5 w-5" />
                        <div className="text-left">
                          <p className="label-small">Authenticator App</p>
                          <p className="caption-small text-muted-foreground">
                            Google Auth, Authy, etc.
                          </p>
                        </div>
                      </button>
                      <button
                        onClick={() => setTwoFactorMethod("sms")}
                        className={`flex items-center gap-3 rounded-lg border p-4 transition-colors ${
                          twoFactorMethod === "sms"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Mail className="h-5 w-5" />
                        <div className="text-left">
                          <p className="label-small">SMS</p>
                          <p className="caption-small text-muted-foreground">
                            Receive codes via SMS
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
