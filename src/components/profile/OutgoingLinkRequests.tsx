import { useState } from "react";
import { Loader2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useT } from "@/hooks/useT";
import { cn } from "@/lib/utils";
import { useAssociationLinkRequests, useUnlinkCommunity } from "@/hooks/adminProfile";
import type { AssociationLinkRequest } from "@/services/graphql/association/operations";
import type { TranslationKeys } from "@/lib/translations";
import { safeServerMessage } from "@/lib/graphqlErrors";

interface OutgoingLinkRequestsProps {
  associationId: string | null;
}

const STATUS_STYLE: Record<string, string> = {
  PENDING: "surface-warning text-warning",
  ACTIVE: "surface-success text-success",
  REJECTED: "surface-danger text-danger",
};

function statusLabel(status: string, t: TranslationKeys): string {
  switch (status) {
    case "ACTIVE":
      return t.linkRequestStatusApproved;
    case "REJECTED":
      return t.linkRequestStatusDeclined;
    default:
      return t.linkRequestStatusPending;
  }
}

/**
 * The link requests this association has sent to communities, with their status.
 * Rendered inside the Communities tab, so the list is fetched only when that tab is open.
 */
export function OutgoingLinkRequests({ associationId }: OutgoingLinkRequestsProps) {
  const t = useT();
  const { requests, loading, error, refetch } = useAssociationLinkRequests(associationId);
  const withdraw = useUnlinkCommunity(associationId);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const nameOf = (request: AssociationLinkRequest) =>
    request.communityName?.trim() || t.unknownCommunity;

  const handleWithdraw = (request: AssociationLinkRequest) => {
    setWithdrawingId(request.communityId);
    withdraw.mutate(request.communityId, {
      onSuccess: (result) => {
        if (result?.success === false) {
          toast({
            title: t.withdrawFailed,
            description: safeServerMessage(result.message, t.withdrawFailed),
            variant: "destructive",
          });
          return;
        }
        toast({ title: t.linkRequestWithdrawn, description: nameOf(request) });
      },
      // Refusals are toasted by the hook with the server's message.
      onSettled: () => setWithdrawingId(null),
    });
  };

  return (
    <section aria-labelledby="outgoing-link-requests-heading" className="mt-8">
      <h3 id="outgoing-link-requests-heading" className="section-header">
        {t.outgoingLinkRequests}
      </h3>
      <p className="body-small text-muted-foreground mb-4">{t.outgoingLinkRequestsDesc}</p>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th scope="col" className="px-6 py-4 text-left label-small text-muted-foreground">
                {t.communityName}
              </th>
              <th scope="col" className="px-6 py-4 text-left label-small text-muted-foreground">
                {t.status}
              </th>
              <th scope="col" className="px-6 py-4 text-left label-small text-muted-foreground">
                {t.actions}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center body-small text-muted-foreground">
                  <span role="status" className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    {t.loading}
                  </span>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center body-small text-danger">
                  <span role="alert">{t.linkRequestsLoadError}</span>{" "}
                  <Button variant="link" size="sm" onClick={() => void refetch()}>
                    {t.linkRequestsRetry}
                  </Button>
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center body-small text-muted-foreground">
                  {t.noOutgoingLinkRequests}
                </td>
              </tr>
            ) : (
              requests.map((request) => {
                const name = nameOf(request);
                const isWithdrawing = withdrawingId === request.communityId;
                return (
                  <tr key={request.communityId} className="border-b border-border last:border-b-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {request.communityAvatarUrl ? (
                          <img
                            src={request.communityAvatarUrl}
                            alt=""
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted caption-small"
                          >
                            {name.charAt(0).toUpperCase()}
                          </span>
                        )}
                        <div>
                          <p className="label-small">{name}</p>
                          {request.requestedAt && (
                            <p className="caption-small text-muted-foreground">
                              {t.requestedOn.replace(
                                "{date}",
                                new Date(request.requestedAt).toLocaleDateString(),
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 caption-small",
                          STATUS_STYLE[request.status] ?? STATUS_STYLE.PENDING,
                        )}
                      >
                        {statusLabel(request.status, t)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {request.status === "PENDING" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-destructive hover:text-destructive"
                          disabled={withdraw.isPending}
                          aria-label={t.withdrawRequestAria.replace("{name}", name)}
                          onClick={() => handleWithdraw(request)}
                        >
                          {isWithdrawing ? (
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          ) : (
                            <Undo2 className="h-4 w-4" aria-hidden="true" />
                          )}
                          {t.withdrawRequest}
                        </Button>
                      ) : (
                        <span className="body-small text-muted-foreground" aria-hidden="true">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
