import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Globe, 
  Palette, 
  Bell, 
  Accessibility, 
  Shield, 
  Save,
  RotateCcw,
  Loader2,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Monitor,
  Wallet
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { useTranslation } from "@/lib/translations";
import { 
  Language, 
  Theme, 
  FontSize, 
  SessionTimeout,
  languageLabels,
  themeLabels,
  fontSizeLabels,
  sessionTimeoutLabels
} from "@/types/settings";
import { AdminCurrencySettings } from "@/components/settings/AdminCurrencySettings";
import { Currency } from "@/types/vendor";
import { useNavigate } from "react-router-dom";

const themeIcons: Record<Theme, React.ReactNode> = {
  light: <Sun className="h-4 w-4" />,
  dark: <Moon className="h-4 w-4" />,
  system: <Monitor className="h-4 w-4" />,
};

export default function Settings() {
  const navigate = useNavigate();
  const { 
    settings, 
    updateLanguage, 
    updateTheme, 
    updateNotifications, 
    updateAccessibility, 
    updateSecurity,
    saveSettings,
    resetSettings
  } = useSettings();
  
  const t = useTranslation(settings.language);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [defaultCurrency, setDefaultCurrency] = useState<Currency>("USD");

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      saveSettings();
      setIsSaving(false);
      toast({
        title: t.settingsSaved,
        description: new Date().toLocaleTimeString(),
      });
    }, 1000);
  };

  const handleReset = () => {
    resetSettings();
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults.",
    });
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <AdminLayout title={t.settingsTitle} subtitle={t.settingsSubtitle}>
      <div className="max-w-3xl space-y-6">
        {/* Language & Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t.languageAppearance}
            </CardTitle>
            <CardDescription>{t.languageAppearanceDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>{t.language}</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value: Language) => updateLanguage(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(languageLabels) as Language[]).map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {languageLabels[lang]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t.theme}</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value: Theme) => updateTheme(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(themeLabels) as Theme[]).map((theme) => (
                      <SelectItem key={theme} value={theme}>
                        <div className="flex items-center gap-2">
                          {themeIcons[theme]}
                          {themeLabels[theme]}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {t.notifications}
            </CardTitle>
            <CardDescription>{t.notificationsDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>{t.emailNotifications}</Label>
                <p className="text-xs text-muted-foreground">
                  Receive email updates for orders, tickets, and alerts.
                </p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(checked) => updateNotifications("email", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>{t.pushNotifications}</Label>
                <p className="text-xs text-muted-foreground">
                  Real-time push notifications in your browser.
                </p>
              </div>
              <Switch
                checked={settings.notifications.push}
                onCheckedChange={(checked) => updateNotifications("push", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>{t.smsNotifications}</Label>
                <p className="text-xs text-muted-foreground">
                  SMS alerts for critical updates.
                </p>
              </div>
              <Switch
                checked={settings.notifications.sms}
                onCheckedChange={(checked) => updateNotifications("sms", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Accessibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Accessibility className="h-5 w-5" />
              {t.accessibility}
            </CardTitle>
            <CardDescription>{t.accessibilityDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t.fontSize}</Label>
              <Select
                value={settings.accessibility.fontSize}
                onValueChange={(value: FontSize) => updateAccessibility("fontSize", value)}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(fontSizeLabels) as FontSize[]).map((size) => (
                    <SelectItem key={size} value={size}>
                      {fontSizeLabels[size]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>{t.highContrastMode}</Label>
                <p className="text-xs text-muted-foreground">
                  Increase contrast for better visibility.
                </p>
              </div>
              <Switch
                checked={settings.accessibility.highContrast}
                onCheckedChange={(checked) => updateAccessibility("highContrast", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>{t.screenReaderSupport}</Label>
                <p className="text-xs text-muted-foreground">
                  Optimize for screen reader accessibility.
                </p>
              </div>
              <Switch
                checked={settings.accessibility.screenReaderSupport}
                onCheckedChange={(checked) => updateAccessibility("screenReaderSupport", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t.securityPrivacy}
            </CardTitle>
            <CardDescription>{t.securityPrivacyDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>{t.changePassword}</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {newPassword && (
                <Button size="sm" onClick={handlePasswordChange}>
                  Update Password
                </Button>
              )}
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>{t.twoFactorAuth}</Label>
                <p className="text-xs text-muted-foreground">
                  Add an extra layer of security to your account.
                </p>
              </div>
              <Switch
                checked={settings.security.twoFactorEnabled}
                onCheckedChange={(checked) => updateSecurity("twoFactorEnabled", checked)}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>{t.sessionTimeout}</Label>
              <Select
                value={settings.security.sessionTimeout}
                onValueChange={(value: SessionTimeout) => updateSecurity("sessionTimeout", value)}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(sessionTimeoutLabels) as SessionTimeout[]).map((timeout) => (
                    <SelectItem key={timeout} value={timeout}>
                      {sessionTimeoutLabels[timeout]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Currency & Exchange Rates (Admin) */}
        <AdminCurrencySettings 
          defaultCurrency={defaultCurrency} 
          onCurrencyChange={setDefaultCurrency} 
        />

        {/* Vendor Escrow Settings Link */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Escrow & Payments
            </CardTitle>
            <CardDescription>
              Configure escrow milestones and payment release settings for vendors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/vendor-escrow-settings")}>
              <Wallet className="h-4 w-4 mr-2" />
              Manage Escrow Settings
            </Button>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-1.5" />
            Reset to Defaults
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">{t.cancel}</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-1.5" />
              )}
              {t.saveSettings}
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}