import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, ShieldMinus, ShieldPlus, UserMinus, UserPlus } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { useT } from "@/hooks/useT";
import { getAdminAssociationId } from "@/stores/adminAuthStore";
import { useAssociationAdminStore } from "@/stores/associationAdminStore";
import {
  approveMembership,
  blockMember,
  getAssociationMembers,
  getPendingMembershipRequests,
  inviteMember,
  rejectMembership,
  removeMember,
  suspendMember,
  unsuspendMember,
  updateMemberRole,
  type AssociationMemberType,
  type PendingMembershipRequestType,
  type MembershipStatus,
  type MemberRole,
} from "@/services/graphql/association";

type MembersTab = "ACTIVE" | "PENDING" | "SUSPENDED";

function getMemberDisplayName(
  member: Pick<AssociationMemberType, "fullName" | "displayName" | "firstName" | "lastName" | "userId">
): string {
  const full = member.fullName?.trim();
  if (full) return full;
  const display = member.displayName?.trim();
  if (display) return display;
  const combined = [member.firstName, member.lastName].filter(Boolean).join(" ").trim();
  if (combined) return combined;
  return member.userId;
}

function getInitials(
  input: string | Pick<AssociationMemberType, "fullName" | "displayName" | "firstName" | "lastName" | "userId">
): string {
  if (typeof input === "string") {
    return input.slice(0, 2).toUpperCase();
  }
  const name = getMemberDisplayName(input);
  if (name === input.userId) return input.userId.slice(0, 2).toUpperCase();
  const parts = name.split(/\s+/).filter(Boolean);
  const initials =
    parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0]?.slice(0, 2) ?? "";
  return initials.toUpperCase();
}

export default function Members() {
  const t = useT();
  const associationId = useMemo(() => getAdminAssociationId(), []);
  const [tab, setTab] = useState<MembersTab>("ACTIVE");
  const [loading, setLoading] = useState(false);
  const [activeMembers, setActiveMembers] = useState<AssociationMemberType[]>([]);
  const [suspendedMembers, setSuspendedMembers] = useState<AssociationMemberType[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingMembershipRequestType[]>([]);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [inviteUserId, setInviteUserId] = useState("");
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const setPendingRequestsCount = useAssociationAdminStore((state) => state.setPendingRequestsCount);

  const loadMembers = useCallback(async () => {
    if (!associationId) return;

    setLoading(true);
    try {
      const [active, suspended, pending] = await Promise.all([
        getAssociationMembers({ associationId, page: 1, limit: 50, status: "ACTIVE" }),
        getAssociationMembers({ associationId, page: 1, limit: 50, status: "SUSPENDED" }),
        getPendingMembershipRequests({ entityId: associationId, entityType: "ASSOCIATION", page: 1, limit: 50 }),
      ]);

      setActiveMembers(active.members);
      setSuspendedMembers(suspended.members);
      setPendingRequests(pending.requests);
      setPendingTotal(pending.total ?? 0);
      setPendingRequestsCount(pending.total ?? 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load members.";
      toast({ title: "Members load failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [associationId, setPendingRequestsCount]);

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  const runMemberAction = useCallback(
    async (userId: string, action: () => Promise<{ success: boolean; message: string | null }>, successMessage: string) => {
      setBusyUserId(userId);
      try {
        const result = await action();
        if (!result.success) {
          throw new Error(result.message ?? "Action failed");
        }
        toast({ title: successMessage, description: result.message ?? userId });
        await loadMembers();
      } catch (err) {
        toast({
          title: "Action failed",
          description: err instanceof Error ? err.message : "Please try again.",
          variant: "destructive",
        });
      } finally {
        setBusyUserId(null);
      }
    },
    [loadMembers]
  );

  const handleChangeRole = (userId: string, role: MemberRole) => {
    if (!associationId) return;
    void runMemberAction(
      userId,
      () => updateMemberRole({ entityId: associationId, entityType: "ASSOCIATION", userId, role }),
      "Role updated"
    );
  };

  const handleToggleSuspend = (userId: string, status: MembershipStatus) => {
    if (!associationId) return;
    if (status === "ACTIVE") {
      void runMemberAction(
        userId,
        () => suspendMember({ entityId: associationId, entityType: "ASSOCIATION", userId, reason: "Suspended by association admin" }),
        "Member suspended"
      );
      return;
    }

    void runMemberAction(
      userId,
      () => unsuspendMember({ entityId: associationId, entityType: "ASSOCIATION", userId }),
      "Member unsuspended"
    );
  };

  const handleRemove = (userId: string) => {
    if (!associationId) return;
    void runMemberAction(
      userId,
      () => removeMember({ entityId: associationId, entityType: "ASSOCIATION", userId, reason: "Removed by association admin" }),
      "Member removed"
    );
  };

  const handleBlock = (userId: string) => {
    if (!associationId) return;
    void runMemberAction(
      userId,
      () => blockMember({ entityId: associationId, entityType: "ASSOCIATION", userId }),
      "Member blocked"
    );
  };

  const handleApprove = (userId: string) => {
    if (!associationId) return;
    void runMemberAction(
      userId,
      () => approveMembership({ entityId: associationId, entityType: "ASSOCIATION", userId }),
      "Request approved"
    );
  };

  const handleReject = (userId: string) => {
    if (!associationId) return;
    void runMemberAction(
      userId,
      () => rejectMembership({ entityId: associationId, entityType: "ASSOCIATION", userId }),
      "Request rejected"
    );
  };

  const handleInvite = async () => {
    if (!associationId || !inviteUserId.trim()) return;
    await runMemberAction(
      inviteUserId.trim(),
      () => inviteMember({ entityId: associationId, entityType: "ASSOCIATION", userId: inviteUserId.trim() }),
      "Invite sent"
    );
    setInviteUserId("");
  };

  const renderMemberRows = (members: AssociationMemberType[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">No members found.</TableCell>
          </TableRow>
        ) : (
          members.map((member) => {
            const displayName = getMemberDisplayName(member);
            const hasName = displayName !== member.userId;
            return (
            <TableRow key={member.userId}>
              <TableCell>
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-9 w-9 shrink-0">
                    {member.avatarUrl ? (
                      <AvatarImage src={member.avatarUrl} alt={displayName} />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                      {getInitials(member)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex flex-col">
                    {hasName ? (
                      <>
                        <span className="text-sm font-medium text-foreground truncate">
                          {displayName}
                        </span>
                        {member.email ? (
                          <span className="text-xs text-muted-foreground truncate">
                            {member.email}
                          </span>
                        ) : (
                          <span className="font-mono text-[11px] text-muted-foreground truncate">
                            {member.userId}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="font-mono text-xs text-muted-foreground truncate">
                        {member.userId}
                      </span>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>{member.status}</TableCell>
              <TableCell>{new Date(member.joinedAt).toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {member.status === "ACTIVE" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleSuspend(member.userId, member.status)}
                      disabled={busyUserId === member.userId}
                    >
                      <ShieldMinus className="mr-1 h-4 w-4" />
                      Suspend
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleSuspend(member.userId, member.status)}
                      disabled={busyUserId === member.userId}
                    >
                      <ShieldPlus className="mr-1 h-4 w-4" />
                      Unsuspend
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleChangeRole(member.userId, member.role === "MEMBER" ? "MODERATOR" : "MEMBER")}
                    disabled={busyUserId === member.userId}
                  >
                    {member.role === "MEMBER" ? "Make moderator" : "Set member"}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemove(member.userId)}
                    disabled={busyUserId === member.userId}
                  >
                    <UserMinus className="mr-1 h-4 w-4" />
                    Remove
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleBlock(member.userId)}
                    disabled={busyUserId === member.userId}
                  >
                    Block
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );

  return (
    <AdminLayout title={t.membersTitle} subtitle={`Pending requests: ${pendingTotal}`}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Invite user</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              value={inviteUserId}
              onChange={(e) => setInviteUserId(e.target.value)}
              placeholder="User UUID"
            />
            <Button onClick={() => void handleInvite()} disabled={!inviteUserId.trim() || loading}>
              <UserPlus className="mr-1 h-4 w-4" />
              Invite
            </Button>
            <Button variant="outline" onClick={() => void loadMembers()} disabled={loading}>
              <RefreshCw className={`mr-1 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          {(["ACTIVE", "PENDING", "SUSPENDED"] as MembersTab[]).map((value) => (
            <Button
              key={value}
              variant={tab === value ? "default" : "outline"}
              onClick={() => setTab(value)}
            >
              {value === "PENDING" ? `${value} (${pendingTotal})` : value}
            </Button>
          ))}
        </div>

        <Card>
          <CardContent className="pt-6">
            {tab === "ACTIVE" && renderMemberRows(activeMembers)}
            {tab === "SUSPENDED" && renderMemberRows(suspendedMembers)}
            {tab === "PENDING" && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Requested at</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No pending membership requests.
                      </TableCell>
                    </TableRow>
                  ) : (
                    pendingRequests.map((request) => (
                      <TableRow key={request.userId}>
                        <TableCell className="font-medium">{request.userId}</TableCell>
                        <TableCell>{new Date(request.requestedAt).toLocaleString()}</TableCell>
                        <TableCell>{request.message || "—"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(request.userId)}
                              disabled={busyUserId === request.userId}
                            >
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(request.userId)}
                              disabled={busyUserId === request.userId}
                            >
                              Approve
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
