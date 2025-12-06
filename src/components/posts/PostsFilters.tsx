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
  return (
    <div className="w-80 flex-shrink-0 space-y-6">
      {/* Post Actions Section */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Post Actions</h3>
        <div className="space-y-2">
          <Button onClick={onCreatePost} className="w-full justify-start gap-2">
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => onNavigate("drafts")}
          >
            <FileText className="h-4 w-4" />
            Drafts
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => onNavigate("scheduled")}
          >
            <Clock className="h-4 w-4" />
            Scheduled
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => onNavigate("pinned")}
          >
            <Pin className="h-4 w-4" />
            Pinned
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Filters</h3>
        <div className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search title, body, tags"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Status</Label>
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="removed">Removed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Media Type */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Media Type</Label>
            <Select value={mediaFilter} onValueChange={onMediaChange}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="link">Link</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Visibility</Label>
            <Select value={visibilityFilter} onValueChange={onVisibilityChange}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="members">Members</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Date Range</Label>
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
                    "Pick a date range"
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
            Clear All Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
