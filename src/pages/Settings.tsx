import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
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
import { getAdminAssociationId } from "@/stores/adminAuthStore";
import { useAssociationAdminStore } from "@/stores/associationAdminStore";
import {
  getAssociation,
  getAssociationAvatarUploadUrl,
  updateAssociation,
  uploadAssociationAvatar,
  type AssociationVisibility,
  type JoinPolicy,
} from "@/services/graphql/association";

const joinPolicyLabels: Record<JoinPolicy, string> = {
  OPEN: "Public — Anyone can join",
  REQUEST: "Request to Join",
  INVITE_ONLY: "Invite Only",
};

export default function Settings() {
  const associationId = useMemo(() => getAdminAssociationId(), []);
  const setAssociation = useAssociationAdminStore((state) => state.setAssociation);
  const association = useAssociationAdminStore((state) => state.association);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [joinPolicy, setJoinPolicy] = useState<JoinPolicy>("REQUEST");
  const [visibility, setVisibility] = useState<AssociationVisibility>("PUBLIC");

  const loadSettings = useCallback(async () => {
    if (!associationId) return;
    try {
      const data = await getAssociation(associationId);
      setAssociation(data);
      setName(data.name);
      setDescription(data.description ?? "");
      setJoinPolicy(data.joinPolicy);
      setVisibility(data.visibility);
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

  const handleSave = async () => {
    if (!associationId) return;
    setIsSaving(true);

    try {
      const updated = await updateAssociation({
        id: associationId,
        name,
        description,
        joinPolicy,
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
                    {(Object.keys(joinPolicyLabels) as JoinPolicy[]).map((policy) => (
                      <SelectItem key={policy} value={policy}>
                        {joinPolicyLabels[policy]}
                      </SelectItem>
                    ))}
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
      </div>
    </AdminLayout>
  );
}