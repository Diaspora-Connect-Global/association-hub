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

// Mock data
const linkedCommunities = [
  { id: "1", name: "African Tech Network", type: "Professional", countries: "Global", status: "Active" },
  { id: "2", name: "Ghanaian Diaspora Europe", type: "Cultural", countries: "Europe", status: "Active" },
];

const admins = [
  { id: "1", name: "Akua Mensah", email: "akua@example.com", role: "Primary Admin", status: "Active" },
  { id: "2", name: "Kofi Asante", email: "kofi@example.com", role: "Admin", status: "Active" },
];

export default function Profile() {
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
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    toast({
      title: "Success",
      description: "Association profile updated successfully.",
    });
  };

  const handleCancel = () => {
    toast({
      title: "Cancelled",
      description: "Changes discarded.",
    });
  };

  return (
    <AdminLayout title="Association Profile & Settings" subtitle="Manage your association's identity, privacy, monetization, branding, admin assignments and linked communities.">
      {/* Header Actions */}
      <div className="mb-6 flex items-center justify-end gap-3">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="basic_info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-muted p-1 rounded-lg">
          <TabsTrigger value="basic_info" className="flex items-center gap-2 body-small">
            <Info className="h-4 w-4" />
            <span className="hidden lg:inline">Basic Info</span>
          </TabsTrigger>
          <TabsTrigger value="contact_info" className="flex items-center gap-2 body-small">
            <Mail className="h-4 w-4" />
            <span className="hidden lg:inline">Contact</span>
          </TabsTrigger>
          <TabsTrigger value="membership" className="flex items-center gap-2 body-small">
            <Users className="h-4 w-4" />
            <span className="hidden lg:inline">Membership</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2 body-small">
            <CreditCard className="h-4 w-4" />
            <span className="hidden lg:inline">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="communities" className="flex items-center gap-2 body-small">
            <Network className="h-4 w-4" />
            <span className="hidden lg:inline">Communities</span>
          </TabsTrigger>
          <TabsTrigger value="admins" className="flex items-center gap-2 body-small">
            <Shield className="h-4 w-4" />
            <span className="hidden lg:inline">Admins</span>
          </TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic_info">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6">
              <h3 className="section-header">Association Identity</h3>
              <p className="body-small text-muted-foreground mt-1">
                Update your association's core information and classification.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Association Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="label-small">Association Name *</Label>
                <Input
                  id="name"
                  value={formData.associationName}
                  onChange={(e) => setFormData({ ...formData, associationName: e.target.value })}
                  placeholder="e.g. Ghana Union Antwerp"
                />
                <p className="caption-small text-muted-foreground">
                  Your association's official name as displayed to users.
                </p>
              </div>

              {/* Type of Association */}
              <div className="space-y-2">
                <Label className="label-small">Type of Association *</Label>
                <Select
                  value={formData.associationType}
                  onValueChange={(value) => setFormData({ ...formData, associationType: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {associationTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="caption-small text-muted-foreground">
                  Used for categorization and filtering across the platform.
                </p>
              </div>

              {/* Privacy Type */}
              <div className="space-y-2">
                <Label className="label-small">Privacy Type *</Label>
                <Select
                  value={formData.privacyType}
                  onValueChange={(value) => setFormData({ ...formData, privacyType: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select privacy" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="Public">Public</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                  </SelectContent>
                </Select>
                <p className="caption-small text-muted-foreground">
                  Public associations are open to join. Private associations require approval.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="description" className="label-small">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your association's purpose, activities, mission..."
                  rows={4}
                  maxLength={2000}
                />
                <p className="caption-small text-muted-foreground">
                  Displayed on the association's public page. ({formData.description.length}/2000)
                </p>
              </div>

              {/* Logo Upload */}
              <div className="space-y-2">
                <Label className="label-small">Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Upload Logo</Button>
                    <p className="caption-small text-muted-foreground mt-1">
                      Square logo (1:1). Max 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Banner Upload */}
              <div className="space-y-2">
                <Label className="label-small">Banner Image</Label>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-32 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Upload Banner</Button>
                    <p className="caption-small text-muted-foreground mt-1">
                      16:9 ratio. Max 10MB.
                    </p>
                  </div>
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
                <h3 className="section-header">Primary Contact Details</h3>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email" className="label-small">Contact Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="association@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="label-small">Contact Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="+233 55 555 5555"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="label-small">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://www.yourassociation.org"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="label-small">Address / Location</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street, City, Country"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-6">
                <h3 className="section-header">Countries Served</h3>
                <p className="body-small text-muted-foreground mt-1">
                  Specify the countries your association provides services or representation for.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="label-small">Countries Served *</Label>
                <Select>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select one or more countries" />
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
              <h3 className="section-header">Member Policies</h3>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <Label className="label-small">Join Policy *</Label>
                <Select
                  value={formData.joinPolicy}
                  onValueChange={(value) => setFormData({ ...formData, joinPolicy: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select policy" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="Open (Anyone Can Join)">Open (Anyone Can Join)</SelectItem>
                    <SelectItem value="Approval Required">Approval Required</SelectItem>
                  </SelectContent>
                </Select>
                <p className="caption-small text-muted-foreground">
                  If set to approval, join requests will appear in the membership dashboard.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="label-small">Who Can Post *</Label>
                <Select
                  value={formData.whoCanPost}
                  onValueChange={(value) => setFormData({ ...formData, whoCanPost: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="Admins Only">Admins Only</SelectItem>
                  </SelectContent>
                </Select>
                <p className="caption-small text-muted-foreground">
                  MVP restricts posting to association admins.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Payment & Monetization Tab */}
        <TabsContent value="payment">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6">
              <h3 className="section-header">Association Payment Configuration</h3>
              <p className="body-small text-muted-foreground mt-1">
                Set pricing if your association charges for membership.
              </p>
            </div>

            <div className="space-y-6">
              {/* Paid Association Toggle */}
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="label-small">Paid Association</p>
                  <p className="caption-small text-muted-foreground">
                    Enable if your association requires payment to join.
                  </p>
                </div>
                <Switch
                  checked={formData.paidAssociation}
                  onCheckedChange={(checked) => setFormData({ ...formData, paidAssociation: checked })}
                />
              </div>

              {formData.paidAssociation && (
                <div className="grid gap-6 lg:grid-cols-2 animate-fade-in">
                  <div className="space-y-2">
                    <Label className="label-small">Payment Type</Label>
                    <Select
                      value={formData.paymentType}
                      onValueChange={(value) => setFormData({ ...formData, paymentType: value })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="One-time">One-time</SelectItem>
                        <SelectItem value="Subscription">Subscription</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="caption-small text-muted-foreground">
                      One-time: Members pay once. Subscription: Recurring payment.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount" className="label-small">Payment Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      value={formData.paymentAmount}
                      onChange={(e) => setFormData({ ...formData, paymentAmount: e.target.value })}
                      placeholder="Enter amount"
                    />
                  </div>

                  {formData.paymentType === "Subscription" && (
                    <div className="space-y-2">
                      <Label className="label-small">Subscription Period</Label>
                      <Select
                        value={formData.subscriptionPeriod}
                        onValueChange={(value) => setFormData({ ...formData, subscriptionPeriod: value })}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover z-50">
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Quarterly">Quarterly</SelectItem>
                          <SelectItem value="Yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="label-small">Payment Currency</Label>
                    <Select
                      value={formData.paymentCurrency}
                      onValueChange={(value) => setFormData({ ...formData, paymentCurrency: value })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select currency" />
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

        {/* Linked Communities Tab */}
        <TabsContent value="communities">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="section-header">Communities Connected to This Association</h3>
                <p className="body-small text-muted-foreground mt-1">
                  This association can belong to 0 or many communities.
                </p>
              </div>
              <Button className="gap-2">
                <Link2 className="h-4 w-4" />
                Link Communities
              </Button>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">Community Name</th>
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">Type</th>
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">Countries</th>
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">Status</th>
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {linkedCommunities.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center body-medium text-muted-foreground">
                        No communities linked yet.
                      </td>
                    </tr>
                  ) : (
                    linkedCommunities.map((community) => (
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
                              View
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                              Unlink
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
        </TabsContent>

        {/* Admin Assignment Tab */}
        <TabsContent value="admins">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="section-header">Manage Association Admins</h3>
                <p className="body-small text-muted-foreground mt-1">
                  Assign and remove administrators responsible for managing your association.
                </p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Assign New Admin
              </Button>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">Admin Name</th>
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">Email</th>
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">Role</th>
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">Status</th>
                    <th className="px-6 py-4 text-left label-small text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center body-medium text-muted-foreground">
                        No admins assigned yet.
                      </td>
                    </tr>
                  ) : (
                    admins.map((admin) => (
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
                            {admin.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full surface-success text-success px-2.5 py-0.5 caption-small">
                            {admin.status}
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
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
