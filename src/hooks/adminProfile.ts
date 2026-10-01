import { useCallback, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  getCurrentAdmin,
  updateAdminProfile,
  getLinkedCommunities,
  getAssociationAdmins,
  updateAdminPassword,
  requestAdminAvatarUploadUrl,
  enableTwoFactor,
  verifyTwoFactor,
  disableTwoFactor,
} from "@/services/graphql/adminProfile/operations";
import type { UpdateAdminProfileInput } from "@/services/graphql/adminProfile";
import type { TwoFactorResponse } from "@/services/graphql/adminProfile/operations";
import {
  getAssociationAvatarUploadUrl,
  getAssociationAnalytics,
  linkCommunityToAssociation,
  unlinkCommunityFromAssociation,
  getAssociationLinkRequests,
  assignAssociationAdmin,
  removeAssociationAdmin,
} from "@/services/graphql/association/operations";
import {
  graphqlErrorMessage,
  graphqlErrorText,
  isPermissionRefusal,
  safeServerMessage,
} from "@/lib/graphqlErrors";
import { useT } from "@/hooks/useT";

export const useGetCurrentAdmin = () => {
  const { toast } = useToast();
  const t = useT();
  const query = useQuery({
    queryKey: ["currentAdmin"],
    queryFn: getCurrentAdmin,
  });

  useEffect(() => {
    if (query.error) {
      const message = graphqlErrorMessage(query.error, t.profileLoadFailed);
      toast({ title: t.error, description: message, variant: "destructive" });
    }
  }, [query.error, toast, t]);

  return {
    profile: query.data ?? null,
    loading: query.isLoading,
    error: graphqlErrorText(query.error, t.profileLoadFailed),
    fetchProfile: query.refetch,
  };
};

export const useUpdateAdminProfile = () => {
  const { toast } = useToast();
  const t = useT();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: UpdateAdminProfileInput) => updateAdminProfile(input),
    onSuccess: (result) => {
      if (result.success) {
        toast({ title: "Success", description: safeServerMessage(result.message, "Profile updated") });
        void queryClient.invalidateQueries({ queryKey: ["currentAdmin"] });
      } else {
        // A refusal resolves with success: false — it must not pass silently.
        toast({
          title: t.error,
          description: safeServerMessage(result.message, t.profileUpdateFailed),
          variant: "destructive",
        });
      }
    },
    onError: (err) => {
      const message = graphqlErrorMessage(err, t.profileUpdateFailed);
      toast({ title: t.error, description: message, variant: "destructive" });
    },
  });

  return {
    loading: mutation.isPending,
    error: graphqlErrorText(mutation.error, t.profileUpdateFailed),
    saveProfile: mutation.mutateAsync,
  };
};

export const useGetLinkedCommunities = (associationId: string | null) => {
  const query = useQuery({
    queryKey: ["linkedCommunities", associationId],
    queryFn: () => getLinkedCommunities(associationId!),
    enabled: !!associationId,
  });

  return {
    communities: query.data ?? [],
    loading: query.isLoading,
    error: graphqlErrorText(query.error, "Failed to load linked communities"),
  };
};

export const useGetAssociationAdmins = (associationId: string | null) => {
  const query = useQuery({
    queryKey: ["associationAdmins", associationId],
    queryFn: () => getAssociationAdmins(associationId!),
    enabled: !!associationId,
  });

  return {
    admins: query.data?.admins ?? [],
    loading: query.isLoading,
    error: graphqlErrorText(query.error, "Failed to load admins"),
  };
};

export const useGetAssociationAvatarUploadUrl = () => {
  const { toast } = useToast();
  const t = useT();
  const mutation = useMutation({
    mutationFn: (associationId: string) => getAssociationAvatarUploadUrl(associationId),
    onError: (err) => {
      const message = graphqlErrorMessage(err, t.uploadStartFailed);
      toast({ title: t.error, description: message, variant: "destructive" });
    },
  });

  return {
    mutate: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: graphqlErrorText(mutation.error, t.uploadStartFailed),
  };
};

/**
 * Link requests this association has sent (PENDING / ACTIVE / REJECTED).
 * `enabled` lets the caller fetch only while the list is on screen.
 */
export const useAssociationLinkRequests = (associationId: string | null, enabled = true) => {
  const query = useQuery({
    queryKey: ["associationLinkRequests", associationId],
    queryFn: () => getAssociationLinkRequests(associationId!),
    enabled: enabled && !!associationId,
  });

  return {
    requests: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? graphqlErrorMessage(query.error, "Failed to load link requests") : null,
    refetch: query.refetch,
  };
};

/** A link or unlink changes both the linked list and the outgoing request list. */
const invalidateLinkQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  associationId: string | null,
) => {
  void queryClient.invalidateQueries({ queryKey: ["linkedCommunities", associationId] });
  void queryClient.invalidateQueries({ queryKey: ["associationLinkRequests", associationId] });
};

export const useLinkCommunity = (associationId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (communityId: string) =>
      linkCommunityToAssociation(associationId!, communityId),
    onSuccess: () => {
      invalidateLinkQueries(queryClient, associationId);
    },
    onError: (err) => {
      const message = graphqlErrorMessage(err, "Failed to link community");
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: graphqlErrorText(mutation.error, "Failed to link community"),
  };
};

export const useUnlinkCommunity = (associationId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (communityId: string) =>
      unlinkCommunityFromAssociation(associationId!, communityId),
    onSuccess: () => {
      invalidateLinkQueries(queryClient, associationId);
    },
    onError: (err) => {
      const message = graphqlErrorMessage(err, "Failed to unlink community");
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: graphqlErrorText(mutation.error, "Failed to unlink community"),
  };
};

export const useAssignAssociationAdmin = (associationId: string | null) => {
  const { toast } = useToast();
  const t = useT();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role?: string }) =>
      assignAssociationAdmin(associationId!, userId, role),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["associationAdmins", associationId] });
    },
    onError: (err) => {
      // assignMemberRole is refused for console accounts until the gateway forwards
      // the console's admin claim — say that plainly rather than echo the server.
      if (isPermissionRefusal(err)) {
        toast({ title: t.roleChangeRefusedTitle, description: t.roleChangeRefusedDesc, variant: "destructive" });
        return;
      }
      toast({ title: "Error", description: graphqlErrorMessage(err, t.assignAdminFailed), variant: "destructive" });
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: graphqlErrorText(mutation.error, t.assignAdminFailed),
  };
};

export const useRemoveAssociationAdmin = (associationId: string | null) => {
  const { toast } = useToast();
  const t = useT();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    /** Demotes by USER id (assignMemberRole → MEMBER). */
    mutationFn: (adminUserId: string) => removeAssociationAdmin(associationId!, adminUserId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["associationAdmins", associationId] });
    },
    onError: (err) => {
      if (isPermissionRefusal(err)) {
        toast({ title: t.roleChangeRefusedTitle, description: t.roleChangeRefusedDesc, variant: "destructive" });
        return;
      }
      toast({ title: "Error", description: graphqlErrorMessage(err, t.removeAdminFailed), variant: "destructive" });
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: graphqlErrorText(mutation.error, t.removeAdminFailed),
  };
};

// ── Password & 2FA hooks ──────────────────────────────────────────────────────

export const useUpdateAdminPassword = () => {
  const { toast } = useToast();
  const t = useT();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await updateAdminPassword(currentPassword, newPassword);
        if (result.success) {
          toast({ title: "Success", description: safeServerMessage(result.message, "Password updated successfully") });
        } else {
          const msg = safeServerMessage(result.message, t.passwordUpdateFailed);
          setError(msg);
          toast({ title: t.error, description: msg, variant: "destructive" });
        }
        return result;
      } catch (err) {
        // ClientError.message would echo the request — both passwords included.
        const msg = graphqlErrorMessage(err, t.passwordUpdateFailed);
        setError(msg);
        toast({ title: t.error, description: msg, variant: "destructive" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast, t],
  );

  return { changePassword, loading, error };
};

export const useAdminAvatarUpload = () => {
  const { toast } = useToast();
  const t = useT();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadAvatar = useCallback(
    async (file: File): Promise<string> => {
      setUploading(true);
      setError(null);
      try {
        const { uploadUrl, readUrl } = await requestAdminAvatarUploadUrl(file.name, file.type);
        const res = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });
        if (!res.ok) {
          throw new Error(t.avatarUploadFailed);
        }
        return readUrl;
      } catch (err) {
        const msg = graphqlErrorMessage(err, t.avatarUploadFailed);
        setError(msg);
        toast({ title: t.error, description: msg, variant: "destructive" });
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [toast, t],
  );

  return { uploadAvatar, uploading, error };
};

export const useEnableTwoFactor = () => {
  const { toast } = useToast();
  const t = useT();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initEnable = useCallback(
    async (method: "APP" | "SMS"): Promise<TwoFactorResponse> => {
      setLoading(true);
      setError(null);
      try {
        const result = await enableTwoFactor(method);
        if (!result.success) {
          const msg = safeServerMessage(result.message, t.twoFactorEnableFailed);
          setError(msg);
          toast({ title: t.error, description: msg, variant: "destructive" });
        }
        return result;
      } catch (err) {
        const msg = graphqlErrorMessage(err, t.twoFactorEnableFailed);
        setError(msg);
        toast({ title: t.error, description: msg, variant: "destructive" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast, t],
  );

  return { initEnable, loading, error };
};

export const useVerifyTwoFactor = () => {
  const { toast } = useToast();
  const t = useT();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyCode = useCallback(
    async (code: string): Promise<{ success: boolean; message?: string }> => {
      setLoading(true);
      setError(null);
      try {
        const result = await verifyTwoFactor(code);
        if (result.success) {
          toast({ title: "Success", description: safeServerMessage(result.message, "2FA verified successfully") });
        } else {
          const msg = safeServerMessage(result.message, t.twoFactorVerifyFailed);
          setError(msg);
          toast({ title: t.error, description: msg, variant: "destructive" });
        }
        return result;
      } catch (err) {
        const msg = graphqlErrorMessage(err, t.twoFactorVerifyFailed);
        setError(msg);
        toast({ title: t.error, description: msg, variant: "destructive" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast, t],
  );

  return { verifyCode, loading, error };
};

export const useGetAssociationAnalytics = (
  associationId: string | null,
  period?: string
) => {
  const { toast } = useToast();
  const t = useT();
  const query = useQuery({
    queryKey: ["associationAnalytics", associationId, period],
    queryFn: () => getAssociationAnalytics(associationId!, period),
    enabled: !!associationId,
  });

  useEffect(() => {
    if (query.error) {
      // Never ClientError.message: it embeds the request (the association id included).
      const message = graphqlErrorMessage(query.error, t.analyticsLoadFailed);
      toast({ title: t.error, description: message, variant: "destructive" });
    }
  }, [query.error, toast, t]);

  return {
    analytics: query.data ?? null,
    loading: query.isLoading,
    error: graphqlErrorText(query.error, t.analyticsLoadFailed),
    refetch: query.refetch,
  };
};

export const useDisableTwoFactor = () => {
  const { toast } = useToast();
  const t = useT();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doDisable = useCallback(async (): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    setError(null);
    try {
      const result = await disableTwoFactor();
      if (result.success) {
        toast({ title: "Success", description: safeServerMessage(result.message, "2FA has been disabled") });
      } else {
        const msg = safeServerMessage(result.message, t.twoFactorDisableFailed);
        setError(msg);
        toast({ title: t.error, description: msg, variant: "destructive" });
      }
      return result;
    } catch (err) {
      const msg = graphqlErrorMessage(err, t.twoFactorDisableFailed);
      setError(msg);
      toast({ title: t.error, description: msg, variant: "destructive" });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast, t]);

  return { doDisable, loading, error };
};
