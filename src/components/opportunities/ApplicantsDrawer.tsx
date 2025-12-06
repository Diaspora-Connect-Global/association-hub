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
  ChevronDown,
  MoreHorizontal,
  Eye,
  Star,
  MessageCircle,
  XCircle,
  CheckCircle,
  Users,
} from "lucide-react";
import { Opportunity, Applicant, ApplicantStatus } from "@/types/opportunities";

interface ApplicantsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity: Opportunity | null;
  applicants: Applicant[];
  onViewApplication: (applicant: Applicant) => void;
  onShortlist: (applicant: Applicant) => void;
  onMessage: (applicant: Applicant) => void;
  onReject: (applicant: Applicant) => void;
  onMarkHired: (applicant: Applicant) => void;
  onExport: () => void;
}

const statusColors: Record<ApplicantStatus, string> = {
  pending: "secondary",
  shortlisted: "default",
  rejected: "destructive",
  hired: "default",
  withdrawn: "secondary",
};

export function ApplicantsDrawer({
  open,
  onOpenChange,
  opportunity,
  applicants,
  onViewApplication,
  onShortlist,
  onMessage,
  onReject,
  onMarkHired,
  onExport,
}: ApplicantsDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);

  const filteredApplicants = applicants.filter((a) => {
    if (searchQuery && !a.name.toLowerCase().includes(searchQuery.toLowerCase()) && !a.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    return true;
  });

  const handleSelectApplicant = (id: string) => {
    setSelectedApplicants((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedApplicants(
      selectedApplicants.length === filteredApplicants.length
        ? []
        : filteredApplicants.map((a) => a.id)
    );
  };

  if (!opportunity) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Applicants
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            For: {opportunity.title}
          </p>

          {/* Controls */}
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone"
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2" onClick={onExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            {selectedApplicants.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    Bulk Actions
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Star className="mr-2 h-4 w-4" />
                    Shortlist Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-220px)]">
          {filteredApplicants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No applicants yet</h3>
              <p className="text-sm text-muted-foreground">
                Applicants will appear here after your opportunity is published
              </p>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Applied At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead className="w-16">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedApplicants.includes(applicant.id)}
                        onCheckedChange={() => handleSelectApplicant(applicant.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{applicant.name}</p>
                        <p className="text-xs text-muted-foreground">{applicant.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {applicant.appliedAt}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[applicant.status] as any} className="capitalize">
                        {applicant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {applicant.screeningScore !== undefined ? (
                        <span className="text-sm">{applicant.screeningScore}%</span>
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
                          <DropdownMenuItem onClick={() => onViewApplication(applicant)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Application
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onShortlist(applicant)}>
                            <Star className="mr-2 h-4 w-4" />
                            Shortlist
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onMessage(applicant)}>
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Message
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onReject(applicant)}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onMarkHired(applicant)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark Hired
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
