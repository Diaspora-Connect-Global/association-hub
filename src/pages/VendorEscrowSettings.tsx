import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Shield,
  Save,
  Loader2,
  Plus,
  Trash2,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Info,
  Milestone,
  Settings2,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { useTranslation } from "@/lib/translations";
import {
  VendorEscrowSettings as VendorEscrowSettingsType,
  VendorMilestoneTemplate,
  defaultVendorEscrowSettings,
  currencyInfo,
  Currency,
} from "@/types/vendor";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

const mockVendorSettings: VendorEscrowSettingsType = {
  ...defaultVendorEscrowSettings,
  vendorId: "vendor-001",
  escrowEnabled: true,
  autoReleaseAfterDays: 14,
  requireBuyerConfirmation: true,
  disputeWindowDays: 7,
  escrowFeePercentage: 2.5,
  minimumOrderAmountForEscrow: 100,
  currency: "USD",
  defaultMilestones: [
    {
      id: "ms-1",
      name: "Initial Deposit",
      description: "Payment confirmation and order acceptance",
      percentage: 30,
      order: 1,
    },
    {
      id: "ms-2",
      name: "Production Complete",
      description: "Order production/preparation finished",
      percentage: 40,
      order: 2,
    },
    {
      id: "ms-3",
      name: "Delivery Confirmed",
      description: "Order delivered and accepted by buyer",
      percentage: 30,
      order: 3,
    },
  ],
};

export default function VendorEscrowSettings() {
  const { settings: appSettings } = useSettings();
  const t = useTranslation(appSettings.language);
  
  const [settings, setSettings] = useState<VendorEscrowSettingsType>(mockVendorSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [milestoneToDelete, setMilestoneToDelete] = useState<string | null>(null);
  const [newMilestone, setNewMilestone] = useState<Partial<VendorMilestoneTemplate>>({
    name: "",
    description: "",
    percentage: 0,
  });
  const [showAddMilestone, setShowAddMilestone] = useState(false);

  const totalPercentage = settings.defaultMilestones.reduce((sum, m) => sum + m.percentage, 0);
  const remainingPercentage = 100 - totalPercentage;

  const handleSave = async () => {
    if (settings.escrowEnabled && totalPercentage !== 100) {
      toast({
        title: t.error,
        description: t.milestones + " " + t.milestonePercentage + " = 100%",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast({
      title: t.settingsSaved,
      description: t.escrowSettings,
    });
  };

  const handleAddMilestone = () => {
    if (!newMilestone.name || newMilestone.percentage === undefined || newMilestone.percentage <= 0) {
      toast({
        title: t.error,
        description: t.milestoneName + " & " + t.milestonePercentage,
        variant: "destructive",
      });
      return;
    }

    if (newMilestone.percentage > remainingPercentage) {
      toast({
        title: t.error,
        description: `${remainingPercentage}% max`,
        variant: "destructive",
      });
      return;
    }

    const milestone: VendorMilestoneTemplate = {
      id: `ms-${Date.now()}`,
      name: newMilestone.name,
      description: newMilestone.description,
      percentage: newMilestone.percentage,
      order: settings.defaultMilestones.length + 1,
    };

    setSettings((prev) => ({
      ...prev,
      defaultMilestones: [...prev.defaultMilestones, milestone],
    }));

    setNewMilestone({ name: "", description: "", percentage: 0 });
    setShowAddMilestone(false);
    
    toast({
      title: t.success,
      description: `"${milestone.name}" ${t.addMilestone}`,
    });
  };

  const handleDeleteMilestone = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      defaultMilestones: prev.defaultMilestones
        .filter((m) => m.id !== id)
        .map((m, idx) => ({ ...m, order: idx + 1 })),
    }));
    setShowDeleteDialog(false);
    setMilestoneToDelete(null);
    toast({
      title: t.success,
      description: t.deleteMilestone,
    });
  };

  const handleUpdateMilestone = (id: string, field: keyof VendorMilestoneTemplate, value: string | number) => {
    setSettings((prev) => ({
      ...prev,
      defaultMilestones: prev.defaultMilestones.map((m) =>
        m.id === id ? { ...m, [field]: value } : m
      ),
    }));
  };

  const moveMilestone = (id: string, direction: "up" | "down") => {
    const milestones = [...settings.defaultMilestones];
    const index = milestones.findIndex((m) => m.id === id);
    
    if (direction === "up" && index > 0) {
      [milestones[index - 1], milestones[index]] = [milestones[index], milestones[index - 1]];
    } else if (direction === "down" && index < milestones.length - 1) {
      [milestones[index], milestones[index + 1]] = [milestones[index + 1], milestones[index]];
    }

    setSettings((prev) => ({
      ...prev,
      defaultMilestones: milestones.map((m, idx) => ({ ...m, order: idx + 1 })),
    }));
  };

  return (
    <AdminLayout title={t.escrowMilestones} subtitle={t.secureTransactions}>
      <TooltipProvider>
        <div className="max-w-4xl space-y-6">
          {/* Escrow Overview Card */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    {t.escrowProtection}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {t.secureTransactions}
                  </CardDescription>
                </div>
                <Switch
                  checked={settings.escrowEnabled}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, escrowEnabled: checked }))
                  }
                />
              </div>
            </CardHeader>
            {settings.escrowEnabled && (
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background border">
                    <div className="p-2 rounded-full bg-green-500/10">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.buyerProtected}</p>
                      <p className="text-xs text-muted-foreground">{t.fundsHeldUntilDelivery}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background border">
                    <div className="p-2 rounded-full bg-blue-500/10">
                      <Clock className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{settings.disputeWindowDays} {t.disputeWindow}</p>
                      <p className="text-xs text-muted-foreground">{t.timeToRaiseIssues}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background border">
                    <div className="p-2 rounded-full bg-amber-500/10">
                      <DollarSign className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{settings.escrowFeePercentage}% {t.escrowFee}</p>
                      <p className="text-xs text-muted-foreground">{t.perTransaction}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {settings.escrowEnabled && (
            <>
              {/* Milestones Configuration */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Milestone className="h-5 w-5" />
                        {t.defaultMilestoneTemplate}
                      </CardTitle>
                      <CardDescription>
                        {t.setUpStandardMilestones}
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setShowAddMilestone(true)}
                      disabled={remainingPercentage <= 0}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {t.addMilestone}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t.totalAllocation}</span>
                      <span className={totalPercentage === 100 ? "text-green-500 font-medium" : "text-amber-500 font-medium"}>
                        {totalPercentage}% / 100%
                      </span>
                    </div>
                    <Progress 
                      value={totalPercentage} 
                      className={totalPercentage === 100 ? "[&>div]:bg-green-500" : "[&>div]:bg-amber-500"}
                    />
                    {totalPercentage !== 100 && (
                      <div className="flex items-center gap-2 text-xs text-amber-600">
                        <AlertCircle className="h-3 w-3" />
                        {t.milestones} = 100%
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Milestones List */}
                  <div className="space-y-3">
                    {settings.defaultMilestones.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Milestone className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>{t.milestones}</p>
                        <p className="text-sm">{t.addMilestone}</p>
                      </div>
                    ) : (
                      settings.defaultMilestones.map((milestone, index) => (
                        <div
                          key={milestone.id}
                          className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => moveMilestone(milestone.id, "up")}
                              disabled={index === 0}
                            >
                              <ArrowUpDown className="h-3 w-3 rotate-180" />
                            </Button>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                              {milestone.order}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => moveMilestone(milestone.id, "down")}
                              disabled={index === settings.defaultMilestones.length - 1}
                            >
                              <ArrowUpDown className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex-1 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="md:col-span-2">
                                <Label className="text-xs text-muted-foreground">{t.milestoneName}</Label>
                                <Input
                                  value={milestone.name}
                                  onChange={(e) => handleUpdateMilestone(milestone.id, "name", e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">{t.milestonePercentage}</Label>
                                <div className="relative mt-1">
                                  <Input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={milestone.percentage}
                                    onChange={(e) => handleUpdateMilestone(milestone.id, "percentage", parseInt(e.target.value) || 0)}
                                    className="pr-8"
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">{t.milestoneDescription}</Label>
                              <Textarea
                                value={milestone.description || ""}
                                onChange={(e) => handleUpdateMilestone(milestone.id, "description", e.target.value)}
                                placeholder={t.milestoneDescription}
                                className="mt-1 min-h-[60px]"
                              />
                            </div>
                          </div>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  setMilestoneToDelete(milestone.id);
                                  setShowDeleteDialog(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{t.deleteMilestone}</TooltipContent>
                          </Tooltip>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add New Milestone Form */}
                  {showAddMilestone && (
                    <>
                      <Separator />
                      <div className="p-4 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{t.milestone}</h4>
                          <Badge variant="secondary">{remainingPercentage}%</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <Label>{t.milestoneName} *</Label>
                            <Input
                              value={newMilestone.name}
                              onChange={(e) => setNewMilestone((prev) => ({ ...prev, name: e.target.value }))}
                              placeholder={t.milestoneName}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>{t.milestonePercentage} *</Label>
                            <div className="relative mt-1">
                              <Input
                                type="number"
                                min="1"
                                max={remainingPercentage}
                                value={newMilestone.percentage || ""}
                                onChange={(e) => setNewMilestone((prev) => ({ ...prev, percentage: parseInt(e.target.value) || 0 }))}
                                placeholder="0"
                                className="pr-8"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label>{t.milestoneDescription}</Label>
                          <Textarea
                            value={newMilestone.description || ""}
                            onChange={(e) => setNewMilestone((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder={t.milestoneDescription}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowAddMilestone(false)}>
                            {t.cancel}
                          </Button>
                          <Button onClick={handleAddMilestone}>
                            <Plus className="h-4 w-4 mr-1" />
                            {t.addMilestone}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Escrow Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5" />
                    {t.escrowConfiguration}
                  </CardTitle>
                  <CardDescription>
                    {t.fineTuneEscrowSettings}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label>{t.preferredCurrency}</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3.5 w-3.5 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>{t.currencyForEscrow}</TooltipContent>
                        </Tooltip>
                      </div>
                      <Select
                        value={settings.currency}
                        onValueChange={(value: Currency) =>
                          setSettings((prev) => ({ ...prev, currency: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(currencyInfo) as Currency[]).map((code) => (
                            <SelectItem key={code} value={code}>
                              <span className="flex items-center gap-2">
                                <span className="font-mono">{currencyInfo[code].symbol}</span>
                                <span>{code}</span>
                                <span className="text-muted-foreground">- {currencyInfo[code].name}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label>{t.minimumOrderAmount}</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3.5 w-3.5 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>{t.ordersBelowSkipEscrow}</TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {currencyInfo[settings.currency].symbol}
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={settings.minimumOrderAmountForEscrow}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              minimumOrderAmountForEscrow: parseFloat(e.target.value) || 0,
                            }))
                          }
                          className="pl-8"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label>{t.autoReleaseAfterDays}</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3.5 w-3.5 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            {t.autoReleaseNote}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        type="number"
                        min="0"
                        max="90"
                        value={settings.autoReleaseAfterDays}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            autoReleaseAfterDays: parseInt(e.target.value) || 0,
                          }))
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        {settings.autoReleaseAfterDays === 0
                          ? t.manualReleaseOnly
                          : `${settings.autoReleaseAfterDays} ${t.autoReleaseAfterDays}`}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label>{t.disputeWindowDays}</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3.5 w-3.5 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>{t.daysToDispute}</TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        type="number"
                        min="1"
                        max="30"
                        value={settings.disputeWindowDays}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            disputeWindowDays: parseInt(e.target.value) || 7,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t.requireBuyerConfirmation}</Label>
                      <p className="text-xs text-muted-foreground">
                        {t.buyerMustConfirm}
                      </p>
                    </div>
                    <Switch
                      checked={settings.requireBuyerConfirmation}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({ ...prev, requireBuyerConfirmation: checked }))
                      }
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-primary mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{t.escrowFeeInfo}</p>
                        <p className="text-xs text-muted-foreground">
                          {settings.escrowFeePercentage}% {t.escrowFeeDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Save Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline">{t.cancel}</Button>
            <Button onClick={handleSave} disabled={isSaving || (settings.escrowEnabled && totalPercentage !== 100)}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-1.5" />
              )}
              {t.saveSettings}
            </Button>
          </div>
        </div>

        {/* Delete Milestone Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t.deleteMilestone}?</AlertDialogTitle>
              <AlertDialogDescription>
                {t.milestoneDescription}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => milestoneToDelete && handleDeleteMilestone(milestoneToDelete)}
              >
                {t.delete}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TooltipProvider>
    </AdminLayout>
  );
}
