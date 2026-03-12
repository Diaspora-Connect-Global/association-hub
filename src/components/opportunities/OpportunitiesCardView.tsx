import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Edit, Trash2, ToggleRight, Users, Briefcase, Calendar, Flag } from "lucide-react";
import type { OpportunityListItemType, OpportunityTypeEnum } from "@/services/graphql/opportunities";
import { useT } from "@/hooks/useT";

interface OpportunitiesCardViewProps {
  opportunities: OpportunityListItemType[];
  onOpenDrawer: (opp: OpportunityListItemType) => void;
  onEdit: (opp: OpportunityListItemType) => void;
  onTogglePublish: (opp: OpportunityListItemType) => void;
  onViewApplicants: (opp: OpportunityListItemType) => void;
  onDelete: (opp: OpportunityListItemType) => void;
}

const statusMap = {
  PUBLISHED: "active" as const,
  DRAFT: "inactive" as const,
  CLOSED: "inactive" as const,
  ARCHIVED: "inactive" as const,
};

function formatEnumLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value: string | null): string {
  if (!value) return "Open";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString();
}

export function OpportunitiesCardView({
  opportunities,
  onOpenDrawer,
  onEdit,
  onTogglePublish,
  onViewApplicants,
  onDelete,
}: OpportunitiesCardViewProps) {
  const t = useT();

  const typeLabels: Record<OpportunityTypeEnum, string> = {
    EMPLOYMENT: "Employment",
    SCHOLARSHIP: "Scholarship",
    INVESTMENT: "Investment",
    FELLOWSHIP: "Fellowship",
    INITIATIVE: "Initiative",
    GRANT: "Grant",
    PROGRAM: "Program",
    VOLUNTEER: "Volunteer",
    CONTRACT: "Contract",
  };

  if (opportunities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16">
        <Briefcase className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold text-foreground">{t.noOpportunitiesYet}</h3>
        <p className="mb-4 text-sm text-muted-foreground">{t.noOpportunitiesYetDesc}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {opportunities.map((opp) => (
        <Card
          key={opp.id}
          className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5"
          onClick={() => onOpenDrawer(opp)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <Badge variant="secondary" className="capitalize">
                {typeLabels[opp.type] ?? formatEnumLabel(opp.type)}
              </Badge>
              <StatusBadge variant={statusMap[opp.status]} className="text-xs">
                {formatEnumLabel(opp.status)}
              </StatusBadge>
            </div>
            <h3 className="mt-2 font-semibold text-foreground line-clamp-2">{opp.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{formatEnumLabel(opp.category)}</p>
          </CardHeader>

          <CardContent className="pb-3">
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>{opp.applicationCount} {t.applicantsLabel}</span>
              </div>
              <div className="flex items-center gap-1">
                <Flag className="h-3.5 w-3.5" />
                <span>{formatEnumLabel(opp.priorityLevel)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(opp.closedAt)}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t border-border pt-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex w-full justify-between gap-1">
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => onEdit(opp)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => onTogglePublish(opp)}>
                <ToggleRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => onViewApplicants(opp)}>
                <Users className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-destructive hover:text-destructive"
                onClick={() => onDelete(opp)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}