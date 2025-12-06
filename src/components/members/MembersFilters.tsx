import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MembersFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  paymentFilter: string;
  onPaymentChange: (value: string) => void;
  roleFilter: string;
  onRoleChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  isPaidAssociation?: boolean;
}

export function MembersFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  paymentFilter,
  onPaymentChange,
  roleFilter,
  onRoleChange,
  sortBy,
  onSortChange,
  isPaidAssociation = false,
}: MembersFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        <Input
          type="text"
          placeholder="Search by name, phone, or email"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Membership Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="pending">Pending Approval</SelectItem>
          <SelectItem value="suspended">Suspended</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
          <SelectItem value="left">Left Association</SelectItem>
        </SelectContent>
      </Select>

      {isPaidAssociation && (
        <Select value={paymentFilter} onValueChange={onPaymentChange}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payment</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
            <SelectItem value="expired">Payment Expired</SelectItem>
            <SelectItem value="subscription_active">Subscription Active</SelectItem>
            <SelectItem value="subscription_failed">Subscription Failed</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Select value={roleFilter} onValueChange={onRoleChange}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="sub-admin">Sub-admin</SelectItem>
          <SelectItem value="member">Member</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name_asc">Name A-Z</SelectItem>
          <SelectItem value="name_desc">Name Z-A</SelectItem>
          <SelectItem value="date_newest">Join Date (Newest)</SelectItem>
          <SelectItem value="date_oldest">Join Date (Oldest)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
