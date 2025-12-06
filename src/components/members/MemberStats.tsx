interface MemberStatsProps {
  totalMembers: number;
  activeMembers: number;
  pendingMembers: number;
  suspendedMembers: number;
}

export function MemberStats({
  totalMembers,
  activeMembers,
  pendingMembers,
  suspendedMembers,
}: MemberStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-4">
      <div className="rounded-lg border border-border-subtle surface-default p-4">
        <p className="caption-small text-text-secondary">Total Members</p>
        <p className="heading-small text-text-primary">{totalMembers.toLocaleString()}</p>
      </div>
      <div className="rounded-lg border border-border-subtle surface-default p-4">
        <p className="caption-small text-text-secondary">Active</p>
        <p className="heading-small text-text-success">{activeMembers.toLocaleString()}</p>
      </div>
      <div className="rounded-lg border border-border-subtle surface-default p-4">
        <p className="caption-small text-text-secondary">Pending Approval</p>
        <p className="heading-small text-text-warning">{pendingMembers.toLocaleString()}</p>
      </div>
      <div className="rounded-lg border border-border-subtle surface-default p-4">
        <p className="caption-small text-text-secondary">Suspended</p>
        <p className="heading-small text-text-danger">{suspendedMembers.toLocaleString()}</p>
      </div>
    </div>
  );
}
