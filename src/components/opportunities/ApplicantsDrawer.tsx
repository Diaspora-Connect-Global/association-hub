import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Download,
  MoreHorizontal,
  Eye,
  XCircle,
  CheckCircle,
  Users,
  RefreshCw,
} from "lucide-react";
import type {
  ApplicationStatusEnum,
  ApplicationType,
  OpportunityType,
} from "@/services/graphql/opportunities";

interface ApplicantsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity: OpportunityType | null;
  applications: ApplicationType[];
  loading?: boolean;
  onRefresh: () => void;
  onViewApplication: (application: ApplicationType) => void;
  onReview: (application: ApplicationType) => void;
  onReject: (application: ApplicationType) => void;
  onAccept: (application: ApplicationType) => void;
  onExport: () => void;
}

const statusColors: Record<ApplicationStatusEnum, string> = {
  PENDING: "secondary",
  REVIEWING: "default",
  ACCEPTED: "default",
  REJECTED: "destructive",
  WITHDRAWN: "secondary",
};

function formatEnumLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

export function ApplicantsDrawer({
  open,
  onOpenChange,
  opportunity,
  applications,
  loading = false,
  onRefresh,
  onViewApplication,
  onReview,
  onReject,
  onAccept,
  onExport,
}: ApplicantsDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);

  const filteredApplicants = applications.filter((application) => {
    if (
      searchQuery &&
      !application.applicantId.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !application.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (statusFilter !== "all" && application.status !== statusFilter) return false;
    return true;
  });

  const handleSelectApplicant = (id: string) => {
    setSelectedApplicants((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedApplicants(
      selectedApplicants.length === filteredApplicants.length
        ? []
        : filteredApplicants.map((application) => application.id)
    );
  };

  if (!opportunity) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Applications
          </SheetTitle>
          <p className="text-sm text-muted-foreground">For opportunity: {opportunity.title}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by applicant ID or application ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REVIEWING">Reviewing</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" className="gap-2" onClick={onExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-220px)]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-sm text-muted-foreground">
              Loading applications...
            </div>
          ) : filteredApplicants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No applications yet</h3>
              <p className="text-sm text-muted-foreground">Applications will appear here after members apply.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedApplicants.length === filteredApplicants.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reviewed</TableHead>
                  <TableHead className="w-16">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplicants.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedApplicants.includes(application.id)}
                        onCheckedChange={() => handleSelectApplicant(application.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{application.applicantId}</p>
                        <p className="text-xs text-muted-foreground">Application ID: {application.id}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(application.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[application.status] as any} className="capitalize">
                        {formatEnumLabel(application.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {application.reviewedAt ? (
                        <span className="text-sm">{formatDate(application.reviewedAt)}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewApplication(application)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View application
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onReview(application)}>
                            <Users className="mr-2 h-4 w-4" />
                            Move to reviewing
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAccept(application)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Accept
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onReject(application)}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
