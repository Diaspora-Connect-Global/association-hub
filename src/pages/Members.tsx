import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, ShieldMinus, ShieldPlus, UserMinus, UserPlus } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { JoinPolicyBanner } from "@/components/JoinPolicyBanner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  getAssociation,
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
import { userLabel } from "@/lib/userLabel";
import { inviteOutcome } from "@/lib/inviteOutcome";
// ClientError.message embeds the whole request (ids included): show server messages only.
import { graphqlErrorMessage, isPermissionRefusal } from "@/lib/graphqlErrors";
import { PersonPicker } from "@/components/pickers/PersonPicker";
import type { PersonSearchResult } from "@/services/graphql/association/peopleSearch";

type MembersTab = "ACTIVE" | "PENDING" | "SUSPENDED";

// Rows fetched per page. The gateway hard-caps a member/pending page at 200;
// keep this under that so `hasMore` reliably drives the "Load more" control.
const PAGE_SIZE = 50;

type MemberNameFields = Pick<AssociationMemberType, "fullName" | "displayName" | "firstName" | "lastName" | "userId"> & {
  email?: string | null;
};

/**
 * The member's human name, or "" when none is known. Never the user id — user
 * ids must not be displayed to anyone (product rule); callers fall back to the
 * email, then the translated "Unknown user".
 */
function getMemberDisplayName(member: MemberNameFields): string {
  const combined = [member.firstName, member.lastName].filter(Boolean).join(" ").trim();
  return userLabel({ name: member.fullName?.trim() || member.displayName?.trim() || combined }, "");
}

function getInitials(input: string | MemberNameFields): string {
  if (typeof input === "string") {
    return input.slice(0, 2).toUpperCase();
  }
  const name = getMemberDisplayName(input);
  if (!name) return input.email?.trim() ? input.email.trim().slice(0, 2).toUpperCase() : "?";
  const parts = name.split(/\s+/).filter(Boolean);
  const initials =
    parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0]?.slice(0, 2) ?? "";
  return initials.toUpperCase();
}

function getPendingDisplayName(request: PendingMembershipRequestType): string {
  return userLabel({ name: request.displayName?.trim() || request.fullName?.trim() }, "");
}

export default function Members() {
  const t = useT();
  const associationId = useMemo(() => getAdminAssociationId(), []);
  const [tab, setTab] = useState<MembersTab>("ACTIVE");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState<MembersTab | null>(null);
  const [activeMembers, setActiveMembers] = useState<AssociationMemberType[]>([]);
  const [activeTotal, setActiveTotal] = useState(0);
  const [activeHasMore, setActiveHasMore] = useState(false);
  const [suspendedMembers, setSuspendedMembers] = useState<AssociationMemberType[]>([]);
  const [suspendedTotal, setSuspendedTotal] = useState(0);
  const [suspendedHasMore, setSuspendedHasMore] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<PendingMembershipRequestType[]>([]);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [pendingHasMore, setPendingHasMore] = useState(false);
  const [invitee, setInvitee] = useState<PersonSearchResult | null>(null);
  const [inviting, setInviting] = useState(false);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const setPendingRequestsCount = useAssociationAdminStore((state) => state.setPendingRequestsCount);
  const association = useAssociationAdminStore((state) => state.association);
  const setAssociation = useAssociationAdminStore((state) => state.setAssociation);

  const loadMembers = useCallback(async () => {
    if (!associationId) return;

    setLoading(true);
    try {
      const [active, suspended, pending] = await Promise.all([
        getAssociationMembers({ associationId, offset: 0, limit: PAGE_SIZE, status: "ACTIVE" }),
        getAssociationMembers({ associationId, offset: 0, limit: PAGE_SIZE, status: "SUSPENDED" }),
        getPendingMembershipRequests({ entityId: associationId, entityType: "ASSOCIATION", offset: 0, limit: PAGE_SIZE }),
      ]);

      setActiveMembers(active.members);
      setActiveTotal(active.total ?? active.members.length);
      setActiveHasMore(active.hasMore ?? false);
      setSuspendedMembers(suspended.members);
      setSuspendedTotal(suspended.total ?? suspended.members.length);
      setSuspendedHasMore(suspended.hasMore ?? false);
      setPendingRequests(pending.requests);
      setPendingTotal(pending.total ?? 0);
      setPendingHasMore(pending.hasMore ?? false);
      setPendingRequestsCount(pending.total ?? 0);
    } catch (err) {
      const message = graphqlErrorMessage(err, "Failed to load members.");
      toast({ title: "Members load failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [associationId, setPendingRequestsCount]);

  const loadMore = useCallback(
    async (which: MembersTab) => {
      if (!associationId) return;
      setLoadingMore(which);
      try {
        if (which === "ACTIVE") {
          const res = await getAssociationMembers({
            associationId,
            offset: activeMembers.length,
            limit: PAGE_SIZE,
            status: "ACTIVE",
          });
          setActiveMembers((prev) => [...prev, ...res.members]);
          setActiveTotal(res.total ?? activeMembers.length + res.members.length);
          setActiveHasMore(res.hasMore ?? false);
        } else if (which === "SUSPENDED") {
          const res = await getAssociationMembers({
            associationId,
            offset: suspendedMembers.length,
            limit: PAGE_SIZE,
            status: "SUSPENDED",
          });
          setSuspendedMembers((prev) => [...prev, ...res.members]);
          setSuspendedTotal(res.total ?? suspendedMembers.length + res.members.length);
          setSuspendedHasMore(res.hasMore ?? false);
        } else {
          const res = await getPendingMembershipRequests({
            entityId: associationId,
            entityType: "ASSOCIATION",
            offset: pendingRequests.length,
            limit: PAGE_SIZE,
          });
          setPendingRequests((prev) => [...prev, ...res.requests]);
          setPendingTotal(res.total ?? pendingRequests.length + res.requests.length);
          setPendingHasMore(res.hasMore ?? false);
        }
      } catch (err) {
        const message = graphqlErrorMessage(err, "Failed to load more.");
        toast({ title: "Load more failed", description: message, variant: "destructive" });
      } finally {
        setLoadingMore(null);
      }
    },
    [associationId, activeMembers.length, suspendedMembers.length, pendingRequests.length]
  );

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  useEffect(() => {
    if (!associationId || association) return;
    void getAssociation(associationId)
      .then((data) => setAssociation(data))
      .catch(() => {
        /* banner is best-effort context; ignore load errors */
      });
  }, [associationId, association, setAssociation]);

  const runMemberAction = useCallback(
    async (
      userId: string,
      action: () => Promise<{ success: boolean; message: string | null }>,
      successMessage: string,
      /** Shown instead of the raw server text when the server refuses for lack of permission. */
      refusalMessage?: string,
    ) => {
      setBusyUserId(userId);
      try {
        const result = await action();
        if (!result.success) {
          throw new Error(result.message ?? "Action failed");
        }
        toast({ title: successMessage, description: result.message ?? undefined });
        await loadMembers();
      } catch (err) {
        const refused = Boolean(refusalMessage) && isPermissionRefusal(err);
        toast({
          title: refused ? t.roleChangeRefusedTitle : "Action failed",
          description: refused ? refusalMessage : graphqlErrorMessage(err, "Please try again."),
          variant: "destructive",
        });
      } finally {
        setBusyUserId(null);
      }
    },
    [loadMembers, t.roleChangeRefusedTitle]
  );

  const handleChangeRole = (userId: string, role: MemberRole) => {
    if (!associationId) return;
    void runMemberAction(
      userId,
      () => updateMemberRole({ entityId: associationId, entityType: "ASSOCIATION", userId, role }),
      "Role updated",
      t.roleChangeRefusedDesc
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
      () => rejectMembership({ entityId: associationId, entityType: "ASSOCIATION", userId, reason: "Declined by admin" }),
      "Request rejected"
    );
  };

  const handleInvite = async () => {
    if (!associationId || !invitee || inviting) return;
    const name = userLabel({ name: invitee.displayName, username: invitee.username }, t.unknownUser);
    setInviting(true);
    try {
      // The person is picked by name; their id is sent behind the scenes.
      const result = await inviteMember({ entityId: associationId, entityType: "ASSOCIATION", userId: invitee.id });
      // "Already a member" / "already asked to join" come back as normal replies, not errors.
      const outcome = inviteOutcome(result?.status);
      const copy = {
        invited: [t.inviteSentTitle, t.inviteSentDesc],
        alreadyMember: [t.inviteAlreadyMemberTitle, t.inviteAlreadyMemberDesc],
        alreadyRequested: [t.inviteAlreadyRequestedTitle, t.inviteAlreadyRequestedDesc],
      }[outcome];
      toast({ title: copy[0], description: copy[1].replace("{name}", () => name) });
      setInvitee(null);
      if (outcome !== "alreadyMember") await loadMembers();
    } catch (err) {
      toast({
        title: t.inviteFailed,
        description: graphqlErrorMessage(err, t.inviteFailed),
        variant: "destructive",
      });
    } finally {
      setInviting(false);
    }
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
            const hasName = displayName !== "";
            return (
            <TableRow key={member.userId}>
              <TableCell>
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-9 w-9 shrink-0">
                    {member.avatarUrl ? (
                      <AvatarImage src={member.avatarUrl} alt={displayName || member.email || ""} />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                      {getInitials(member)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex flex-col">
                    {/* User ids are never displayed: name + email, else email, else "Unknown user". */}
                    <span className="text-sm font-medium text-foreground truncate">
                      {displayName || member.email || t.unknownUser}
                    </span>
                    {hasName && member.email ? (
                      <span className="text-xs text-muted-foreground truncate">
                        {member.email}
                      </span>
                    ) : null}
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

  const renderPagination = (
    loaded: number,
    total: number,
    hasMore: boolean,
    which: MembersTab,
    unit: "members" | "requests"
  ) => {
    if (loaded === 0) return null;
    const template = unit === "members" ? t.showingXOfYMembers : t.showingXOfYRequests;
    return (
      <div className="flex items-center justify-between gap-3 pt-4">
        <span className="text-xs text-muted-foreground">
          {template.replace("{loaded}", loaded.toString()).replace("{total}", total.toString())}
        </span>
        {hasMore && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => void loadMore(which)}
            disabled={loadingMore !== null}
          >
            {loadingMore === which ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                {t.loadingMore}
              </>
            ) : (
              t.loadMore
            )}
          </Button>
        )}
      </div>
    );
  };

  return (
    <AdminLayout title={t.membersTitle} subtitle={`Pending requests: ${pendingTotal}`}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Invite user</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 sm:flex-row sm:items-start">
            <PersonPicker
              className="flex-1"
              label={t.invitePersonLabel}
              value={invitee}
              onChange={setInvitee}
              disabled={inviting}
            />
            <Button className="sm:mt-6" onClick={() => void handleInvite()} disabled={!invitee || inviting || loading}>
              {inviting ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <UserPlus className="mr-1 h-4 w-4" aria-hidden="true" />
              )}
              {t.sendInvite}
            </Button>
            <Button className="sm:mt-6" variant="outline" onClick={() => void loadMembers()} disabled={loading}>
              <RefreshCw className={`mr-1 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </CardContent>
        </Card>

        {association && (
          <JoinPolicyBanner joinPolicy={association.joinPolicy} entityLabel="association" />
        )}

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
            {tab === "ACTIVE" && (
              <>
                {renderMemberRows(activeMembers)}
                {renderPagination(activeMembers.length, activeTotal, activeHasMore, "ACTIVE", "members")}
              </>
            )}
            {tab === "SUSPENDED" && (
              <>
                {renderMemberRows(suspendedMembers)}
                {renderPagination(suspendedMembers.length, suspendedTotal, suspendedHasMore, "SUSPENDED", "members")}
              </>
            )}
            {tab === "PENDING" && (
              <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
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
                    pendingRequests.map((request) => {
                      const displayName = getPendingDisplayName(request);
                      const hasName = displayName !== "";
                      return (
                      <TableRow key={request.userId}>
                        <TableCell>
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar className="h-9 w-9 shrink-0">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                                {getInitials({
                                  userId: request.userId,
                                  fullName: hasName ? displayName : null,
                                  displayName: null,
                                  firstName: null,
                                  lastName: null,
                                  email: request.email,
                                })}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex flex-col">
                              {/* User ids are never displayed. */}
                              <span className="text-sm font-medium text-foreground truncate">
                                {displayName || request.email || t.unknownUser}
                              </span>
                              {hasName && request.email ? (
                                <span className="text-xs text-muted-foreground truncate">
                                  {request.email}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </TableCell>
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
                      );
                    })
                  )}
                </TableBody>
              </Table>
              {renderPagination(pendingRequests.length, pendingTotal, pendingHasMore, "PENDING", "requests")}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
