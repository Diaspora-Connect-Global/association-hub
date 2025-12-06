import { useState } from "react";
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
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useT } from "@/hooks/useT";

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

const linkedCommunities = [
  { id: "1", name: "African Tech Network", type: "Professional", countries: "Global", status: "Active" },
  { id: "2", name: "Ghanaian Diaspora Europe", type: "Cultural", countries: "Europe", status: "Active" },
];

const admins = [
  { id: "1", name: "Akua Mensah", email: "akua@example.com", role: "Primary Admin", status: "Active" },
  { id: "2", name: "Kofi Asante", email: "kofi@example.com", role: "Admin", status: "Active" },
];

export default function Profile() {
  const t = useT();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    associationName: "Ghana Tech Community",
    description: "A vibrant community connecting Ghanaian tech professionals across the globe.",
    associationType: "Professional Network",
    privacyType: "Public",
    contactEmail: "info@ghanatechcommunity.org",
    contactPhone: "+233 55 123 4567",
    website: "https://ghanatechcommunity.org",
    address: "Accra, Ghana",
    countriesServed: ["Ghana", "United Kingdom", "United States"],
    joinPolicy: "Open (Anyone Can Join)",
    whoCanPost: "Admins Only",
    paidAssociation: false,
    paymentType: "One-time",
    paymentAmount: "",
    subscriptionPeriod: "Monthly",
    paymentCurrency: "USD",
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    toast({
      title: t.success,
      description: t.settingsSaved,
    });
  };

  const handleCancel = () => {
    toast({
      title: t.cancel,
      description: t.settingsSaved,
    });
  };

  return (
    <AdminLayout title={t.associationProfileSettings} subtitle={t.associationProfileSubtitle}>
      <div className="mb-6 flex items-center justify-end gap-3">
        <Button variant="outline" onClick={handleCancel}>
          {t.cancel}
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? t.loading : t.saveChanges}
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
                <Label htmlFor="name" className="label-small">{t.associationName} *</Label>
                <Input
                  id="name"
                  value={formData.associationName}
                  onChange={(e) => setFormData({ ...formData, associationName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="label-small">{t.associationType} *</Label>
                <Select
                  value={formData.associationType}
                  onValueChange={(value) => setFormData({ ...formData, associationType: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {associationTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="label-small">{t.privacyType} *</Label>
                <Select
                  value={formData.privacyType}
                  onValueChange={(value) => setFormData({ ...formData, privacyType: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="Public">{t.publicType}</SelectItem>
                    <SelectItem value="Private">{t.privateType}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="description" className="label-small">{t.description}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  maxLength={2000}
                />
              </div>

              <div className="space-y-2">
                <Label className="label-small">{t.logo}</Label>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <Button variant="outline" size="sm">{t.uploadLogo}</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="label-small">{t.bannerImage}</Label>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-32 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <Button variant="outline" size="sm">{t.uploadBanner}</Button>
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
                  <Label htmlFor="email" className="label-small">{t.contactEmail}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="label-small">{t.contactPhone}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="label-small">{t.website}</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="label-small">{t.address}</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-6">
                <h3 className="section-header">{t.countriesServed}</h3>
              </div>

              <div className="space-y-2">
                <Select>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder={t.countriesServed} />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.countriesServed.map((country) => (
                    <span key={country} className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 caption-small">
                      {country}
                      <button className="ml-1 text-muted-foreground hover:text-foreground">×</button>
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
                <Select
                  value={formData.joinPolicy}
                  onValueChange={(value) => setFormData({ ...formData, joinPolicy: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="Open (Anyone Can Join)">{t.openAnyone}</SelectItem>
                    <SelectItem value="Approval Required">{t.approvalRequired}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="label-small">{t.whoCanPost} *</Label>
                <Select
                  value={formData.whoCanPost}
                  onValueChange={(value) => setFormData({ ...formData, whoCanPost: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="Admins Only">{t.adminsOnly}</SelectItem>
                  </SelectContent>
                </Select>
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
                <Switch
                  checked={formData.paidAssociation}
                  onCheckedChange={(checked) => setFormData({ ...formData, paidAssociation: checked })}
                />
              </div>

              {formData.paidAssociation && (
                <div className="grid gap-6 lg:grid-cols-2 animate-fade-in">
                  <div className="space-y-2">
                    <Label className="label-small">{t.paymentType}</Label>
                    <Select
                      value={formData.paymentType}
                      onValueChange={(value) => setFormData({ ...formData, paymentType: value })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="One-time">{t.oneTime}</SelectItem>
                        <SelectItem value="Subscription">{t.subscription}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="label-small">{t.paymentAmount}</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.paymentAmount}
                      onChange={(e) => setFormData({ ...formData, paymentAmount: e.target.value })}
                    />
                  </div>

                  {formData.paymentType === "Subscription" && (
                    <div className="space-y-2">
                      <Label className="label-small">{t.subscriptionPeriod}</Label>
                      <Select
                        value={formData.subscriptionPeriod}
                        onValueChange={(value) => setFormData({ ...formData, subscriptionPeriod: value })}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover z-50">
                          <SelectItem value="Monthly">{t.monthly}</SelectItem>
                          <SelectItem value="Quarterly">{t.quarterly}</SelectItem>
                          <SelectItem value="Yearly">{t.yearly}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="label-small">{t.paymentCurrency}</Label>
                    <Select
                      value={formData.paymentCurrency}
                      onValueChange={(value) => setFormData({ ...formData, paymentCurrency: value })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {currencies.map((currency) => (
                          <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              <Button className="gap-2">
                <Link2 className="h-4 w-4" />
                {t.linkCommunities}
              </Button>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">{t.communityName}</th>
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">{t.type}</th>
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">{t.countriesServed}</th>
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">{t.status}</th>
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {linkedCommunities.map((community) => (
                    <tr key={community.id} className="border-b border-border">
                      <td className="px-6 py-4 label-small">{community.name}</td>
                      <td className="px-6 py-4 body-small text-muted-foreground">{community.type}</td>
                      <td className="px-6 py-4 body-small text-muted-foreground">{community.countries}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full surface-success text-success px-2.5 py-0.5 caption-small">
                          {community.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Eye className="h-4 w-4" />
                            {t.view}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            {t.unlink}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Admins Tab */}
        <TabsContent value="admins">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="section-header">{t.manageAdmins}</h3>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {t.assignNewAdmin}
              </Button>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">{t.name}</th>
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">{t.email}</th>
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">{t.role}</th>
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">{t.status}</th>
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.id} className="border-b border-border">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground caption-small font-semibold">
                            {admin.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="label-small">{admin.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 body-small text-muted-foreground">{admin.email}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 caption-small",
                          admin.role === "Primary Admin" ? "surface-info text-info" : "bg-muted text-muted-foreground"
                        )}>
                          {admin.role === "Primary Admin" ? t.primaryAdmin : t.admin}
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
                          disabled={admin.role === "Primary Admin"}
                        >
                          <Trash2 className="h-4 w-4" />
                          {t.remove}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
