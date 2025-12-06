import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useT } from "@/hooks/useT";

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
  const t = useT();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        <Input
          type="text"
          placeholder={t.searchByNamePhoneEmail}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder={t.membershipStatus} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.allStatus}</SelectItem>
          <SelectItem value="active">{t.active}</SelectItem>
          <SelectItem value="pending">{t.pendingApproval}</SelectItem>
          <SelectItem value="suspended">{t.suspended}</SelectItem>
          <SelectItem value="rejected">{t.rejected}</SelectItem>
          <SelectItem value="left">{t.leftAssociation}</SelectItem>
        </SelectContent>
      </Select>

      {isPaidAssociation && (
        <Select value={paymentFilter} onValueChange={onPaymentChange}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder={t.paymentStatus} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.allPayment}</SelectItem>
            <SelectItem value="paid">{t.paidStatus}</SelectItem>
            <SelectItem value="unpaid">{t.unpaidStatus}</SelectItem>
            <SelectItem value="expired">{t.expiredStatus}</SelectItem>
            <SelectItem value="subscription_active">{t.subscriptionActive}</SelectItem>
            <SelectItem value="subscription_failed">{t.subscriptionFailed}</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Select value={roleFilter} onValueChange={onRoleChange}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder={t.role} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.allRoles}</SelectItem>
          <SelectItem value="admin">{t.admin}</SelectItem>
          <SelectItem value="sub-admin">{t.subAdmin}</SelectItem>
          <SelectItem value="member">{t.member}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder={t.sortBy} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name_asc">{t.nameAZ}</SelectItem>
          <SelectItem value="name_desc">{t.nameZA}</SelectItem>
          <SelectItem value="date_newest">{t.joinDateNewest}</SelectItem>
          <SelectItem value="date_oldest">{t.joinDateOldest}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
