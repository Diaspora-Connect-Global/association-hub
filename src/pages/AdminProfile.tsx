import { useState } from "react";
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

export default function AdminProfile() {
  const t = useT();
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "Akua",
    lastName: "Mensah",
    email: "akua@example.com",
    phone: "+233 55 123 4567",
    avatarUrl: "",
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    twoFactorMethod: "app",
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    toast({
      title: t.settingsSaved,
      description: "Your profile has been updated successfully.",
    });
  };

  const handlePasswordChange = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    if (securityData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setSecurityData({
      ...securityData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
  };

  const handleEnable2FA = () => {
    setSecurityData({ ...securityData, twoFactorEnabled: !securityData.twoFactorEnabled });
    toast({
      title: securityData.twoFactorEnabled ? "2FA Disabled" : "2FA Enabled",
      description: securityData.twoFactorEnabled
        ? "Two-factor authentication has been disabled."
        : "Two-factor authentication has been enabled.",
    });
  };

  const getInitials = () => {
    return `${formData.firstName[0] || ""}${formData.lastName[0] || ""}`.toUpperCase();
  };

  return (
    <AdminLayout
      title="My Profile"
      subtitle="Manage your personal information and security settings"
    >
      {/* Header Actions */}
      <div className="mb-6 flex items-center justify-end gap-3">
        <Button variant="outline" onClick={() => toast({ title: t.cancel, description: "Changes discarded." })}>
          {t.cancel}
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? t.loading : t.saveChanges}
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
                    <AvatarImage src={formData.avatarUrl} alt={`${formData.firstName} ${formData.lastName}`} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                      {getInitials()}
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
                <Label htmlFor="firstName" className="label-small">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Enter your first name"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="label-small">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Enter your last name"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="label-small flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
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
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+233 55 555 5555"
                />
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
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="label-small">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={securityData.currentPassword}
                      onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="label-small">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="caption-small text-muted-foreground">
                    Must be at least 8 characters.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="label-small">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button onClick={handlePasswordChange} disabled={isSaving} className="w-fit mt-2">
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
                        {securityData.twoFactorEnabled
                          ? "Enabled - Your account is secured with 2FA"
                          : "Not enabled - Enable for extra security"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={securityData.twoFactorEnabled}
                    onCheckedChange={handleEnable2FA}
                  />
                </div>

                {securityData.twoFactorEnabled && (
                  <div className="rounded-lg border border-border p-4 animate-fade-in">
                    <p className="label-small mb-3">2FA Method</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        onClick={() => setSecurityData({ ...securityData, twoFactorMethod: "app" })}
                        className={`flex items-center gap-3 rounded-lg border p-4 transition-colors ${
                          securityData.twoFactorMethod === "app"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Smartphone className="h-5 w-5" />
                        <div className="text-left">
                          <p className="label-small">Authenticator App</p>
                          <p className="caption-small text-muted-foreground">Google Auth, Authy, etc.</p>
                        </div>
                      </button>
                      <button
                        onClick={() => setSecurityData({ ...securityData, twoFactorMethod: "sms" })}
                        className={`flex items-center gap-3 rounded-lg border p-4 transition-colors ${
                          securityData.twoFactorMethod === "sms"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Mail className="h-5 w-5" />
                        <div className="text-left">
                          <p className="label-small">SMS</p>
                          <p className="caption-small text-muted-foreground">Receive codes via SMS</p>
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
