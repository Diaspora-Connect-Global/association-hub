import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useT } from "@/hooks/useT";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OpportunitiesTable } from "@/components/opportunities/OpportunitiesTable";
import { OpportunitiesCardView } from "@/components/opportunities/OpportunitiesCardView";
import {
  CreateEditOpportunityModal,
  type OpportunityFormValues,
} from "@/components/opportunities/CreateEditOpportunityModal";
import { OpportunityModal } from "@/components/opportunities/OpportunityModal";
import { ApplicantsDrawer } from "@/components/opportunities/ApplicantsDrawer";
import { ApplicationModal } from "@/components/opportunities/ApplicationModal";
import { DeleteOpportunityModal } from "@/components/opportunities/DeleteOpportunityModal";
import { RejectApplicantModal } from "@/components/opportunities/RejectApplicantModal";
import { OpportunityBulkActionsBar } from "@/components/opportunities/OpportunityBulkActionsBar";
import { useAdminAuthStore } from "@/stores/adminAuthStore";
import {
  acceptApplication,
  closeOpportunity,
  createOpportunity,
  deleteOpportunity as deleteOpportunityRequest,
  getApplication,
  getApplications,
  getOpportunity,
  listOpportunities,
  publishOpportunity,
  rejectApplication,
  reviewApplication,
  setOpportunityPriority,
  updateOpportunity,
  type ApplicationDetailType,
  type ApplicationType,
  type CreateOpportunityInput,
  type OpportunityListItemType,
  type OpportunityStatusEnum,
  type OpportunityType,
  type OpportunityTypeEnum,
  type PriorityLevelEnum,
  type UpdateOpportunityInput,
} from "@/services/graphql/opportunities";
import { toast } from "@/hooks/use-toast";
import { LayoutGrid, LayoutList, Loader2, Plus, RefreshCw, Search } from "lucide-react";

function parseCsvList(value: string): string[] | undefined {
  const items = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : undefined;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (/403|forbidden/i.test(error.message)) {
      return "Forbidden: this admin can only manage opportunities owned by their association.";
    }
    return error.message;
  }

  return "Something went wrong.";
}

function buildCreateInput(values: OpportunityFormValues, associationId: string): CreateOpportunityInput {
  return {
    ownerType: "ASSOCIATION",
    ownerId: associationId,
    type: values.type,
    category: values.category,
    title: values.title.trim(),
    description: values.description.trim(),
    visibility: values.visibility,
    applicationMethod: values.applicationMethod,
    responsibilities: values.responsibilities.trim() || undefined,
    requirements: values.requirements.trim() || undefined,
    workMode: values.workMode || undefined,
    engagementType: values.engagementType || undefined,
    location: values.location.trim() || undefined,
    externalLink: values.applicationMethod === "EXTERNAL_LINK" ? values.externalLink.trim() : undefined,
    applicationEmail: values.applicationMethod === "EMAIL_REQUEST" ? values.applicationEmail.trim() : undefined,
    salaryMin: values.salaryMin ? Number(values.salaryMin) : undefined,
    salaryMax: values.salaryMax ? Number(values.salaryMax) : undefined,
    salaryCurrency: values.salaryCurrency.trim() || undefined,
    deadline: values.deadline || undefined,
    subCategory: values.subCategory.trim() || undefined,
    skills: parseCsvList(values.skillsText),
    tags: parseCsvList(values.tagsText),
  };
}

function buildUpdateInput(values: OpportunityFormValues): UpdateOpportunityInput {
  const input: UpdateOpportunityInput = {};

  if (values.title.trim()) input.title = values.title.trim();
  if (values.description.trim()) input.description = values.description.trim();
  if (values.responsibilities.trim()) input.responsibilities = values.responsibilities.trim();
  if (values.requirements.trim()) input.requirements = values.requirements.trim();
  if (values.workMode) input.workMode = values.workMode;
  if (values.engagementType) input.engagementType = values.engagementType;
  if (values.location.trim()) input.location = values.location.trim();
  if (values.salaryMin) input.salaryMin = Number(values.salaryMin);
  if (values.salaryMax) input.salaryMax = Number(values.salaryMax);
  if (values.salaryCurrency.trim()) input.salaryCurrency = values.salaryCurrency.trim();
  if (values.deadline) input.deadline = values.deadline;
  if (values.subCategory.trim()) input.subCategory = values.subCategory.trim();

  const skills = parseCsvList(values.skillsText);
  if (skills) input.skills = skills;

  const tags = parseCsvList(values.tagsText);
  if (tags) input.tags = tags;

  if (values.applicationMethod) {
    input.applicationMethod = values.applicationMethod;
    if (values.applicationMethod === "EXTERNAL_LINK") {
      input.externalLink = values.externalLink.trim();
    }
    if (values.applicationMethod === "EMAIL_REQUEST") {
      input.applicationEmail = values.applicationEmail.trim();
    }
  }

  return input;
}

export default function Opportunities() {
  const t = useT();
  const admin = useAdminAuthStore((state) => state.admin);
  const associationId = admin?.scopeType === "ASSOCIATION" ? admin.scopeId : null;

  const [opportunities, setOpportunities] = useState<OpportunityListItemType[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OpportunityStatusEnum>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | OpportunityTypeEnum>("all");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editOpportunity, setEditOpportunity] = useState<OpportunityType | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerOpportunity, setDrawerOpportunity] = useState<OpportunityType | null>(null);
  const [applicantsDrawerOpen, setApplicantsDrawerOpen] = useState(false);
  const [applicationsOpportunity, setApplicationsOpportunity] = useState<OpportunityType | null>(null);
  const [applications, setApplications] = useState<ApplicationType[]>([]);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationDetailType | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteOpportunityTarget, setDeleteOpportunityTarget] = useState<OpportunityListItemType | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectApplicationTarget, setRejectApplicationTarget] = useState<ApplicationType | null>(null);

  const loadOpportunities = async () => {
    if (!associationId) return;

    setLoading(true);
    try {
      const response = await listOpportunities({
        limit: 100,
        offset: 0,
        ownerType: "ASSOCIATION",
        ownerId: associationId,
        searchTerm: searchQuery.trim() || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        type: typeFilter === "all" ? undefined : typeFilter,
      });

      setOpportunities(response.opportunities);
      setSelectedOpportunities((previous) =>
        previous.filter((id) => response.opportunities.some((opportunity) => opportunity.id === id))
      );
    } catch (error) {
      toast({ title: "Unable to load opportunities", description: getErrorMessage(error), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOpportunities();
  }, [associationId, searchQuery, statusFilter, typeFilter]);

  const openOpportunityDetails = async (opportunityId: string) => {
    setDrawerOpen(true);
    setDrawerLoading(true);
    try {
      const detail = await getOpportunity(opportunityId);
      if (!detail) throw new Error("Opportunity not found.");
      setDrawerOpportunity(detail);
    } catch (error) {
      setDrawerOpen(false);
      toast({ title: "Unable to load opportunity", description: getErrorMessage(error), variant: "destructive" });
    } finally {
      setDrawerLoading(false);
    }
  };

  const loadApplications = async (opportunity: OpportunityType) => {
    setApplicationsOpportunity(opportunity);
    setApplicantsDrawerOpen(true);
    setApplicationsLoading(true);
    try {
      const response = await getApplications({
        opportunityId: opportunity.id,
        limit: 100,
        offset: 0,
      });
      setApplications(response.applications);
    } catch (error) {
      toast({ title: "Unable to load applications", description: getErrorMessage(error), variant: "destructive" });
    } finally {
      setApplicationsLoading(false);
    }
  };

  const handleOpenDrawer = async (opportunity: OpportunityListItemType) => {
    await openOpportunityDetails(opportunity.id);
  };

  const handleEditOpportunity = async (opportunity: OpportunityListItemType) => {
    setSubmitting(true);
    try {
      const detail = await getOpportunity(opportunity.id);
      if (!detail) throw new Error("Opportunity not found.");
      setEditOpportunity(detail);
      setCreateModalOpen(true);
    } catch (error) {
      toast({ title: "Unable to load opportunity", description: getErrorMessage(error), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveOpportunity = async (values: OpportunityFormValues, action: "draft" | "publish") => {
    if (!associationId) {
      toast({ title: "Association scope missing", description: "This page requires an association admin session.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      if (editOpportunity) {
        if (editOpportunity.status !== "DRAFT" && editOpportunity.status !== "CLOSED") {
          await closeOpportunity(editOpportunity.id, "Closed temporarily for update");
        }

        const input = buildUpdateInput(values);
        await updateOpportunity(editOpportunity.id, input);

        if (action === "publish") {
          await publishOpportunity(editOpportunity.id);
        }

        toast({ title: action === "publish" ? "Opportunity updated and published" : "Opportunity updated" });
      } else {
        const created = await createOpportunity(buildCreateInput(values, associationId));

        if (action === "publish") {
          await publishOpportunity(created.id);
        }

        toast({ title: action === "publish" ? "Opportunity created and published" : "Opportunity saved as draft" });
      }

      setCreateModalOpen(false);
      setEditOpportunity(null);
      await loadOpportunities();

      if (drawerOpportunity) {
        const refreshed = await getOpportunity(drawerOpportunity.id);
        setDrawerOpportunity(refreshed);
      }
    } catch (error) {
      toast({ title: "Unable to save opportunity", description: getErrorMessage(error), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (opportunity: OpportunityListItemType) => {
    try {
      if (opportunity.status === "PUBLISHED") {
        await closeOpportunity(opportunity.id, "Closed by association admin");
        toast({ title: "Opportunity closed" });
      } else {
        await publishOpportunity(opportunity.id);
        toast({ title: "Opportunity published" });
      }

      await loadOpportunities();

      if (drawerOpportunity?.id === opportunity.id) {
        const refreshed = await getOpportunity(opportunity.id);
        setDrawerOpportunity(refreshed);
      }
    } catch (error) {
      toast({ title: "Unable to update lifecycle", description: getErrorMessage(error), variant: "destructive" });
    }
  };

  const handleCloseOpportunity = async (opportunity: OpportunityListItemType | OpportunityType) => {
    try {
      await closeOpportunity(opportunity.id, "Closed by association admin");
      toast({ title: "Opportunity closed" });
      await loadOpportunities();

      if (drawerOpportunity?.id === opportunity.id) {
        const refreshed = await getOpportunity(opportunity.id);
        setDrawerOpportunity(refreshed);
      }
    } catch (error) {
      toast({ title: "Unable to close opportunity", description: getErrorMessage(error), variant: "destructive" });
    }
  };

  const handleDeleteOpportunity = async () => {
    if (!deleteOpportunityTarget) return;

    try {
      await deleteOpportunityRequest(deleteOpportunityTarget.id);
      toast({ title: "Opportunity deleted" });
      setDeleteModalOpen(false);
      setDeleteOpportunityTarget(null);
      await loadOpportunities();
    } catch (error) {
      toast({ title: "Unable to delete opportunity", description: getErrorMessage(error), variant: "destructive" });
    }
  };

  const handleOpenApplications = async (opportunity: OpportunityListItemType | OpportunityType) => {
    try {
      const detail = "description" in opportunity ? opportunity : await getOpportunity(opportunity.id);
      if (!detail) throw new Error("Opportunity not found.");
      await loadApplications(detail);
    } catch (error) {
      toast({ title: "Unable to load opportunity", description: getErrorMessage(error), variant: "destructive" });
    }
  };

  const handleViewApplication = async (application: ApplicationType) => {
    try {
      const detail = await getApplication(application.id);
      if (!detail) throw new Error("Application not found.");
      setSelectedApplication(detail);
      setApplicationModalOpen(true);
    } catch (error) {
      toast({ title: "Unable to load application", description: getErrorMessage(error), variant: "destructive" });
    }
  };

  const refreshApplicationViews = async (applicationId?: string) => {
    if (applicationsOpportunity) {
      await loadApplications(applicationsOpportunity);
    }

    if (applicationId && applicationModalOpen) {
      const refreshed = await getApplication(applicationId);
      setSelectedApplication(refreshed);
    }
  };

  const handleReviewApplication = async (application: ApplicationType | ApplicationDetailType, notes?: string) => {
    try {
      await reviewApplication({ applicationId: application.id, notes: notes || undefined });
      toast({ title: "Application moved to reviewing" });
      await refreshApplicationViews(application.id);
    } catch (error) {
      toast({ title: "Unable to review application", description: getErrorMessage(error), variant: "destructive" });
    }
  };

  const handleAcceptApplication = async (application: ApplicationType | ApplicationDetailType, notes?: string) => {
    try {
      await acceptApplication(application.id, notes || undefined);
      toast({ title: "Application accepted" });
      await refreshApplicationViews(application.id);
    } catch (error) {
      toast({ title: "Unable to accept application", description: getErrorMessage(error), variant: "destructive" });
    }
  };

  const handleRejectApplication = async (reason: string) => {
    if (!rejectApplicationTarget) return;

    try {
      await rejectApplication(rejectApplicationTarget.id, reason || undefined);
      toast({ title: "Application rejected" });
      setRejectModalOpen(false);
      setRejectApplicationTarget(null);
      await refreshApplicationViews(rejectApplicationTarget.id);
    } catch (error) {
      toast({ title: "Unable to reject application", description: getErrorMessage(error), variant: "destructive" });
    }
  };

  const handleSetPriority = async (priority: PriorityLevelEnum) => {
    if (!drawerOpportunity) return;

    try {
      await setOpportunityPriority(drawerOpportunity.id, priority);
      toast({ title: "Priority updated" });
      const refreshed = await getOpportunity(drawerOpportunity.id);
      setDrawerOpportunity(refreshed);
      await loadOpportunities();
    } catch (error) {
      toast({ title: "Unable to update priority", description: getErrorMessage(error), variant: "destructive" });
    }
  };

  const handleExportApplications = () => {
    if (applications.length === 0) {
      toast({ title: "No applications to export" });
      return;
    }

    const rows = [
      ["applicationId", "applicantId", "status", "createdAt", "reviewedAt"],
      ...applications.map((application) => [
        application.id,
        application.applicantId,
        application.status,
        application.createdAt,
        application.reviewedAt ?? "",
      ]),
    ];

    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll("\"", '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "applications.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSelectOpportunity = (id: string) => {
    setSelectedOpportunities((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedOpportunities(
      selectedOpportunities.length === opportunities.length ? [] : opportunities.map((opportunity) => opportunity.id)
    );
  };

  const runBulkLifecycleAction = async (action: "publish" | "close") => {
    if (selectedOpportunities.length === 0) return;

    try {
      await Promise.all(
        selectedOpportunities.map((id) =>
          action === "publish"
            ? publishOpportunity(id)
            : closeOpportunity(id, "Closed by association admin")
        )
      );
      toast({ title: `${selectedOpportunities.length} opportunities ${action === "publish" ? "published" : "closed"}` });
      setSelectedOpportunities([]);
      await loadOpportunities();
    } catch (error) {
      toast({ title: "Bulk action failed", description: getErrorMessage(error), variant: "destructive" });
    }
  };

  const openCount = useMemo(
    () => opportunities.filter((opportunity) => opportunity.status === "PUBLISHED").length,
    [opportunities]
  );

  const totalApplications = useMemo(
    () => opportunities.reduce((total, opportunity) => total + opportunity.applicationCount, 0),
    [opportunities]
  );

  const highPriorityCount = useMemo(
    () => opportunities.filter((opportunity) => opportunity.priorityLevel === "HIGH").length,
    [opportunities]
  );

  if (!associationId) {
    return (
      <AdminLayout title={t.opportunitiesTitle} subtitle={t.opportunitiesSubtitle}>
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          This page requires an authenticated association admin session. Ownership and scope are enforced by the JWT.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={t.opportunitiesTitle} subtitle={t.opportunitiesSubtitle}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t.searchOpportunities}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder={t.statusPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allStatus}</SelectItem>
              <SelectItem value="DRAFT">{t.draft}</SelectItem>
              <SelectItem value="PUBLISHED">{t.published}</SelectItem>
              <SelectItem value="CLOSED">{t.closed}</SelectItem>
              <SelectItem value="ARCHIVED">{t.archived}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as typeof typeFilter)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder={t.typePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allTypes}</SelectItem>
              <SelectItem value="EMPLOYMENT">Employment</SelectItem>
              <SelectItem value="FELLOWSHIP">Fellowship</SelectItem>
              <SelectItem value="GRANT">Grant</SelectItem>
              <SelectItem value="PROGRAM">Program</SelectItem>
              <SelectItem value="SCHOLARSHIP">Scholarship</SelectItem>
              <SelectItem value="VOLUNTEER">Volunteer</SelectItem>
              <SelectItem value="CONTRACT">Contract</SelectItem>
              <SelectItem value="INITIATIVE">Initiative</SelectItem>
              <SelectItem value="INVESTMENT">Investment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "card")}>
            <TabsList className="h-9">
              <TabsTrigger value="list" className="px-3">
                <LayoutList className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="card" className="px-3">
                <LayoutGrid className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => void loadOpportunities()} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
          <Button className="gap-2" onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t.newOpportunity}</span>
          </Button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">{t.totalOpportunities}</p>
          <p className="text-2xl font-semibold text-foreground">{opportunities.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">{t.open}</p>
          <p className="text-2xl font-semibold text-foreground">{openCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">{t.totalApplicants}</p>
          <p className="text-2xl font-semibold text-foreground">{totalApplications}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">High Priority</p>
          <p className="text-2xl font-semibold text-foreground">{highPriorityCount}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          {t.showingXOfYOpportunities.replace("{filtered}", opportunities.length.toString()).replace("{total}", opportunities.length.toString())}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-border bg-card py-16 text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading opportunities...
        </div>
      ) : viewMode === "list" ? (
        <OpportunitiesTable
          opportunities={opportunities}
          selectedOpportunities={selectedOpportunities}
          onSelectOpportunity={handleSelectOpportunity}
          onSelectAll={handleSelectAll}
          onOpenDrawer={(opportunity) => void handleOpenDrawer(opportunity)}
          onEdit={(opportunity) => void handleEditOpportunity(opportunity)}
          onTogglePublish={(opportunity) => void handleTogglePublish(opportunity)}
          onClose={(opportunity) => void handleCloseOpportunity(opportunity)}
          onViewApplicants={(opportunity) => void handleOpenApplications(opportunity)}
          onDelete={(opportunity) => {
            setDeleteOpportunityTarget(opportunity);
            setDeleteModalOpen(true);
          }}
        />
      ) : (
        <OpportunitiesCardView
          opportunities={opportunities}
          onOpenDrawer={(opportunity) => void handleOpenDrawer(opportunity)}
          onEdit={(opportunity) => void handleEditOpportunity(opportunity)}
          onTogglePublish={(opportunity) => void handleTogglePublish(opportunity)}
          onViewApplicants={(opportunity) => void handleOpenApplications(opportunity)}
          onDelete={(opportunity) => {
            setDeleteOpportunityTarget(opportunity);
            setDeleteModalOpen(true);
          }}
        />
      )}

      <CreateEditOpportunityModal
        open={createModalOpen}
        onOpenChange={(open) => {
          setCreateModalOpen(open);
          if (!open) setEditOpportunity(null);
        }}
        opportunity={editOpportunity}
        submitting={submitting}
        onSave={handleSaveOpportunity}
      />

      <OpportunityModal
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        opportunity={drawerOpportunity}
        onEdit={() => {
          if (!drawerOpportunity) return;
          setEditOpportunity(drawerOpportunity);
          setCreateModalOpen(true);
          setDrawerOpen(false);
        }}
        onTogglePublish={() => {
          if (!drawerOpportunity) return;
          void handleTogglePublish(drawerOpportunity);
        }}
        onClose={() => {
          if (!drawerOpportunity) return;
          void handleCloseOpportunity(drawerOpportunity);
        }}
        onViewApplicants={() => {
          if (!drawerOpportunity) return;
          void handleOpenApplications(drawerOpportunity);
        }}
        onSetPriority={(priority) => void handleSetPriority(priority)}
      />

      {drawerLoading && drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60">
          <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
            Loading opportunity...
          </div>
        </div>
      )}

      <ApplicantsDrawer
        open={applicantsDrawerOpen}
        onOpenChange={setApplicantsDrawerOpen}
        opportunity={applicationsOpportunity}
        applications={applications}
        loading={applicationsLoading}
        onRefresh={() => {
          if (!applicationsOpportunity) return;
          void loadApplications(applicationsOpportunity);
        }}
        onViewApplication={(application) => void handleViewApplication(application)}
        onReview={(application) => void handleReviewApplication(application)}
        onReject={(application) => {
          setRejectApplicationTarget(application);
          setRejectModalOpen(true);
        }}
        onAccept={(application) => void handleAcceptApplication(application)}
        onExport={handleExportApplications}
      />

      <ApplicationModal
        open={applicationModalOpen}
        onOpenChange={setApplicationModalOpen}
        application={selectedApplication}
        onReview={(notes) => {
          if (!selectedApplication) return;
          void handleReviewApplication(selectedApplication, notes);
        }}
        onAccept={(notes) => {
          if (!selectedApplication) return;
          void handleAcceptApplication(selectedApplication, notes);
        }}
        onReject={() => {
          if (!selectedApplication) return;
          const target = applications.find((application) => application.id === selectedApplication.id);
          if (target) {
            setRejectApplicationTarget(target);
            setRejectModalOpen(true);
          }
        }}
      />

      <DeleteOpportunityModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        opportunity={deleteOpportunityTarget}
        onConfirm={() => void handleDeleteOpportunity()}
      />

      <RejectApplicantModal
        open={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
        applicant={rejectApplicationTarget}
        onConfirm={(reason) => void handleRejectApplication(reason)}
      />

      <OpportunityBulkActionsBar
        selectedCount={selectedOpportunities.length}
        onClearSelection={() => setSelectedOpportunities([])}
        onBulkPublish={() => void runBulkLifecycleAction("publish")}
        onBulkClose={() => void runBulkLifecycleAction("close")}
        onBulkArchive={() => toast({ title: "Archive is not available for association admins in this UI." })}
        onBulkExport={() => handleExportApplications()}
      />
    </AdminLayout>
  );
}
