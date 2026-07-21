import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { JoinMembershipSection } from "@/components/JoinMembershipSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, UploadCloud } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useT } from "@/hooks/useT";
import { getAdminAssociationId } from "@/stores/adminAuthStore";
import { useAssociationAdminStore } from "@/stores/associationAdminStore";
import {
  getAssociation,
  getAssociationAvatarUploadUrl,
  updateAssociation,
  updateAssociationServices,
  uploadAssociationAvatar,
  type AssociationVisibility,
  type JoinPolicy,
} from "@/services/graphql/association";
import { ServiceCheckboxGrid } from "@/components/services/ServiceCheckboxGrid";
import { resolveEnabledServices, sortServiceKeys } from "@/constants/communityServices";

// Selectable access policies (PAID is managed where a price can be set, not here).
const joinPolicyLabels: Record<Exclude<JoinPolicy, "PAID">, string> = {
  OPEN: "Public — Anyone can join",
  APPROVAL: "Request to Join",
  INVITE_ONLY: "Invite Only",
};

// Backend now returns APPROVAL; older data / other UIs may send REQUEST.
function normalizeJoinPolicy(value?: string): JoinPolicy {
  const v = (value ?? "OPEN").toUpperCase();
  if (v === "APPROVAL" || v === "INVITE_ONLY" || v === "OPEN" || v === "PAID") return v as JoinPolicy;
  if (v === "REQUEST" || v === "APPROVAL_REQUIRED") return "APPROVAL";
  return "OPEN";
}

export default function Settings() {
  const t = useT();
  const associationId = useMemo(() => getAdminAssociationId(), []);
  const setAssociation = useAssociationAdminStore((state) => state.setAssociation);
  const association = useAssociationAdminStore((state) => state.association);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [joinPolicy, setJoinPolicy] = useState<JoinPolicy>("OPEN");
  const [visibility, setVisibility] = useState<AssociationVisibility>("PUBLIC");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSavingServices, setIsSavingServices] = useState(false);

  const loadSettings = useCallback(async () => {
    if (!associationId) return;
    try {
      const data = await getAssociation(associationId);
      setAssociation(data);
      setName(data.name);
      setDescription(data.description ?? "");
      setJoinPolicy(normalizeJoinPolicy(data.joinPolicy));
      setVisibility(data.visibility);
      setSelectedServices(resolveEnabledServices(data.enabledServices));
    } catch (err) {
      toast({
        title: "Settings load failed",
        description: err instanceof Error ? err.message : "Unable to load association settings.",
        variant: "destructive",
      });
    }
  }, [associationId, setAssociation]);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  // Re-sync the local selection whenever the loaded association changes.
  useEffect(() => {
    if (association) {
      setSelectedServices(resolveEnabledServices(association.enabledServices));
    }
  }, [association]);

  const handleSaveServices = async () => {
    if (!associationId) return;
    setIsSavingServices(true);
    try {
      const result = await updateAssociationServices({
        associationId,
        services: sortServiceKeys(selectedServices),
      });
      if (association) {
        setAssociation({ ...association, enabledServices: result.enabledServices });
      }
      toast({ title: t.servicesSaved, description: t.servicesSavedDesc });
    } catch (err) {
      toast({
        title: t.servicesSaveFailed,
        description: err instanceof Error ? err.message : t.servicesSaveFailed,
        variant: "destructive",
      });
    } finally {
      setIsSavingServices(false);
    }
  };

  const handleSave = async () => {
    if (!associationId) return;
    setIsSaving(true);

    try {
      const updated = await updateAssociation({
        id: associationId,
        name,
        description,
        // Don't overwrite a paid association's policy here — there's no price field,
        // so it would silently drop paid status. PAID isn't selectable anyway.
        joinPolicy: joinPolicy === "PAID" ? undefined : joinPolicy,
        visibility,
      });
      setAssociation(updated);
      toast({ title: "Settings saved", description: "Association details updated successfully." });
    } catch (err) {
      toast({
        title: "Save failed",
        description: err instanceof Error ? err.message : "Unable to save association settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !associationId) return;

    setIsUploadingAvatar(true);
    try {
      const upload = await getAssociationAvatarUploadUrl(associationId);
      await uploadAssociationAvatar(upload.uploadUrl, file);
      const updated = await updateAssociation({ id: associationId, avatarKey: upload.fileKey });
      setAssociation(updated);
      toast({
        title: "Avatar updated",
        description: "The association avatar was uploaded successfully.",
      });
      event.target.value = "";
    } catch (err) {
      toast({
        title: "Avatar upload failed",
        description: err instanceof Error ? err.message : "Unable to upload avatar.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <AdminLayout title="Settings" subtitle="Edit your association details and avatar">
      <div className="max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit details</CardTitle>
            <CardDescription>
              Configure association identity, join policy, and visibility.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="association-name">Association name</Label>
              <Input id="association-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="association-description">Description</Label>
              <Input
                id="association-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your association"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Join policy</Label>
                <Select value={joinPolicy} onValueChange={(value: JoinPolicy) => setJoinPolicy(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(joinPolicyLabels) as Array<Exclude<JoinPolicy, "PAID">>).map((policy) => (
                      <SelectItem key={policy} value={policy}>
                        {joinPolicyLabels[policy]}
                      </SelectItem>
                    ))}
                    {/* Shown only for an already-paid association; price is managed elsewhere. */}
                    {joinPolicy === "PAID" && (
                      <SelectItem value="PAID" disabled>Paid (managed elsewhere)</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select
                  value={visibility}
                  onValueChange={(value: AssociationVisibility) => setVisibility(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLIC">Public</SelectItem>
                    <SelectItem value="PRIVATE">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={() => void handleSave()} disabled={isSaving || !name.trim()}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save details
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Association avatar</CardTitle>
            <CardDescription>Upload an image to update your association avatar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {association?.avatarUrl ? (
              <img
                src={association.avatarUrl}
                alt={association.name}
                className="h-20 w-20 rounded-full border object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border text-sm text-muted-foreground">
                No avatar
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="association-avatar">Select image</Label>
              <Input
                id="association-avatar"
                type="file"
                accept="image/*"
                onChange={(event) => void handleAvatarChange(event)}
                disabled={isUploadingAvatar}
              />
            </div>

            <Button variant="outline" disabled={isUploadingAvatar}>
              {isUploadingAvatar ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="mr-2 h-4 w-4" />
              )}
              {isUploadingAvatar ? "Uploading..." : "Upload new avatar"}
            </Button>
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle>{t.servicesTitle}</CardTitle>
            <CardDescription>{t.servicesDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ServiceCheckboxGrid
              value={selectedServices}
              onChange={setSelectedServices}
              disabled={isSavingServices}
            />

            <Button
              onClick={() => void handleSaveServices()}
              disabled={isSavingServices || !associationId}
            >
              {isSavingServices ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isSavingServices ? t.servicesSaving : t.servicesSave}
            </Button>
          </CardContent>
        </Card>

        {associationId && (
          <JoinMembershipSection
            entityId={associationId}
            entityType="ASSOCIATION"
            entityName={name || "this association"}
          />
        )}
      </div>
    </AdminLayout>
  );
}