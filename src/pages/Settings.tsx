import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { SectionTabs } from "@/components/layout/SectionTabs";
import { JoinMembershipSection } from "@/components/JoinMembershipSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useT } from "@/hooks/useT";
import { getAdminAssociationId } from "@/stores/adminAuthStore";
import { useAssociationAdminStore } from "@/stores/associationAdminStore";
import { getAssociation, updateAssociationServices } from "@/services/graphql/association";
import { ServiceCheckboxGrid } from "@/components/services/ServiceCheckboxGrid";
import { resolveEnabledServices, sortServiceKeys } from "@/constants/communityServices";
import { graphqlErrorMessage } from "@/lib/graphqlErrors";

/**
 * The "Services" tab of the Settings section: which services the association
 * offers, and its join link. Name, description, join policy, visibility and
 * avatar are edited on the Profile tab (this page used to repeat them).
 */
export default function Settings() {
  const t = useT();
  const associationId = useMemo(() => getAdminAssociationId(), []);
  const setAssociation = useAssociationAdminStore((state) => state.setAssociation);
  const association = useAssociationAdminStore((state) => state.association);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSavingServices, setIsSavingServices] = useState(false);

  const loadSettings = useCallback(async () => {
    if (!associationId) return;
    try {
      const data = await getAssociation(associationId);
      setAssociation(data);
      setSelectedServices(resolveEnabledServices(data.enabledServices));
    } catch (err) {
      toast({
        title: "Settings load failed",
        description: graphqlErrorMessage(err, "Unable to load association settings."),
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
        description: graphqlErrorMessage(err, t.servicesSaveFailed),
        variant: "destructive",
      });
    } finally {
      setIsSavingServices(false);
    }
  };

  return (
    <AdminLayout title={t.settings}>
      <SectionTabs section="settings" labelKey="settings" />
      <div className="max-w-3xl space-y-6">
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
            entityName={association?.name || "this association"}
          />
        )}
      </div>
    </AdminLayout>
  );
}
