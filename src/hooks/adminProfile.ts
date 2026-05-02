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
  assignAssociationAdmin,
  removeAssociationAdmin,
} from "@/services/graphql/association/operations";

export const useGetCurrentAdmin = () => {
  const { toast } = useToast();
  const query = useQuery({
    queryKey: ["currentAdmin"],
    queryFn: getCurrentAdmin,
  });

  useEffect(() => {
    if (query.error) {
      const message =
        query.error instanceof Error ? query.error.message : "Failed to fetch profile";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  }, [query.error, toast]);

  return {
    profile: query.data ?? null,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    fetchProfile: query.refetch,
  };
};

export const useUpdateAdminProfile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: UpdateAdminProfileInput) => updateAdminProfile(input),
    onSuccess: (result) => {
      if (result.success) {
        toast({ title: "Success", description: result.message || "Profile updated" });
        void queryClient.invalidateQueries({ queryKey: ["currentAdmin"] });
      }
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to update profile";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  return {
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
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
    error: query.error instanceof Error ? query.error.message : null,
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
    error: query.error instanceof Error ? query.error.message : null,
  };
};

export const useGetAssociationAvatarUploadUrl = () => {
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (associationId: string) => getAssociationAvatarUploadUrl(associationId),
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to get upload URL";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  return {
    mutate: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
};

export const useLinkCommunity = (associationId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (communityId: string) =>
      linkCommunityToAssociation(associationId!, communityId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["linkedCommunities", associationId] });
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to link community";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
};

export const useUnlinkCommunity = (associationId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (communityId: string) =>
      unlinkCommunityFromAssociation(associationId!, communityId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["linkedCommunities", associationId] });
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to unlink community";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
};

export const useAssignAssociationAdmin = (associationId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role?: string }) =>
      assignAssociationAdmin(associationId!, userId, role),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["associationAdmins", associationId] });
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to assign admin";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
};

export const useRemoveAssociationAdmin = (associationId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (adminId: string) => removeAssociationAdmin(associationId!, adminId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["associationAdmins", associationId] });
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to remove admin";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
};

// ── Password & 2FA hooks ──────────────────────────────────────────────────────

export const useUpdateAdminPassword = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await updateAdminPassword(currentPassword, newPassword);
        if (result.success) {
          toast({ title: "Success", description: result.message || "Password updated successfully" });
        } else {
          const msg = result.message || "Failed to update password";
          setError(msg);
          toast({ title: "Error", description: msg, variant: "destructive" });
        }
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to update password";
        setError(msg);
        toast({ title: "Error", description: msg, variant: "destructive" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  return { changePassword, loading, error };
};

export const useAdminAvatarUpload = () => {
  const { toast } = useToast();
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
          throw new Error(`Upload failed: ${res.statusText}`);
        }
        return readUrl;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Avatar upload failed";
        setError(msg);
        toast({ title: "Error", description: msg, variant: "destructive" });
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [toast],
  );

  return { uploadAvatar, uploading, error };
};

export const useEnableTwoFactor = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initEnable = useCallback(
    async (method: "APP" | "SMS"): Promise<TwoFactorResponse> => {
      setLoading(true);
      setError(null);
      try {
        const result = await enableTwoFactor(method);
        if (!result.success) {
          const msg = result.message || "Failed to initiate 2FA";
          setError(msg);
          toast({ title: "Error", description: msg, variant: "destructive" });
        }
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to initiate 2FA";
        setError(msg);
        toast({ title: "Error", description: msg, variant: "destructive" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  return { initEnable, loading, error };
};

export const useVerifyTwoFactor = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyCode = useCallback(
    async (code: string): Promise<{ success: boolean; message?: string }> => {
      setLoading(true);
      setError(null);
      try {
        const result = await verifyTwoFactor(code);
        if (result.success) {
          toast({ title: "Success", description: result.message || "2FA verified successfully" });
        } else {
          const msg = result.message || "Invalid verification code";
          setError(msg);
          toast({ title: "Error", description: msg, variant: "destructive" });
        }
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Verification failed";
        setError(msg);
        toast({ title: "Error", description: msg, variant: "destructive" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  return { verifyCode, loading, error };
};

export const useGetAssociationAnalytics = (
  associationId: string | null,
  period?: string
) => {
  const { toast } = useToast();
  const query = useQuery({
    queryKey: ["associationAnalytics", associationId, period],
    queryFn: () => getAssociationAnalytics(associationId!, period),
    enabled: !!associationId,
  });

  useEffect(() => {
    if (query.error) {
      const message =
        query.error instanceof Error ? query.error.message : "Failed to fetch analytics";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  }, [query.error, toast]);

  return {
    analytics: query.data ?? null,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch,
  };
};

export const useDisableTwoFactor = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doDisable = useCallback(async (): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    setError(null);
    try {
      const result = await disableTwoFactor();
      if (result.success) {
        toast({ title: "Success", description: result.message || "2FA has been disabled" });
      } else {
        const msg = result.message || "Failed to disable 2FA";
        setError(msg);
        toast({ title: "Error", description: msg, variant: "destructive" });
      }
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to disable 2FA";
      setError(msg);
      toast({ title: "Error", description: msg, variant: "destructive" });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { doDisable, loading, error };
};
