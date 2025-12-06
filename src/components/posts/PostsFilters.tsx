import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, FileText, Clock, Pin, Search, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { useT } from "@/hooks/useT";

interface PostsFiltersProps {
  onCreatePost: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  mediaFilter: string;
  onMediaChange: (value: string) => void;
  visibilityFilter: string;
  onVisibilityChange: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onNavigate: (view: string) => void;
}

export function PostsFilters({
  onCreatePost,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  mediaFilter,
  onMediaChange,
  visibilityFilter,
  onVisibilityChange,
  dateRange,
  onDateRangeChange,
  onNavigate,
}: PostsFiltersProps) {
  const t = useT();

  return (
    <div className="w-80 flex-shrink-0 space-y-6">
      {/* Post Actions Section */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-4 text-sm font-semibold text-foreground">{t.postActions}</h3>
        <div className="space-y-2">
          <Button onClick={onCreatePost} className="w-full justify-start gap-2">
            <Plus className="h-4 w-4" />
            {t.createPost}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => onNavigate("drafts")}
          >
            <FileText className="h-4 w-4" />
            {t.drafts}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => onNavigate("scheduled")}
          >
            <Clock className="h-4 w-4" />
            {t.scheduled}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => onNavigate("pinned")}
          >
            <Pin className="h-4 w-4" />
            {t.pinned}
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-4 text-sm font-semibold text-foreground">{t.filters}</h3>
        <div className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">{t.search}</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">{t.status}</Label>
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder={t.all} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.all}</SelectItem>
                <SelectItem value="published">{t.published}</SelectItem>
                <SelectItem value="draft">{t.draft}</SelectItem>
                <SelectItem value="scheduled">{t.scheduled}</SelectItem>
                <SelectItem value="archived">{t.archived}</SelectItem>
                <SelectItem value="removed">{t.removed}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Media Type */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">{t.mediaType}</Label>
            <Select value={mediaFilter} onValueChange={onMediaChange}>
              <SelectTrigger>
                <SelectValue placeholder={t.all} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.all}</SelectItem>
                <SelectItem value="text">{t.text}</SelectItem>
                <SelectItem value="image">{t.image}</SelectItem>
                <SelectItem value="video">{t.video}</SelectItem>
                <SelectItem value="link">{t.link}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">{t.visibility}</Label>
            <Select value={visibilityFilter} onValueChange={onVisibilityChange}>
              <SelectTrigger>
                <SelectValue placeholder={t.all} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.all}</SelectItem>
                <SelectItem value="members">{t.membersOnly}</SelectItem>
                <SelectItem value="public">{t.public}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">{t.dateRange}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, yyyy")
                    )
                  ) : (
                    t.pickDateRange
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={onDateRangeChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Clear Filters */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground"
            onClick={() => {
              onSearchChange("");
              onStatusChange("all");
              onMediaChange("all");
              onVisibilityChange("all");
              onDateRangeChange(undefined);
            }}
          >
            {t.clearAllFilters}
          </Button>
        </div>
      </div>
    </div>
  );
}
