import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  getCurrentAdmin,
  updateAdminProfile,
  getLinkedCommunities,
  getAssociationAdmins,
} from "@/services/graphql/adminProfile/operations";
import type { UpdateAdminProfileInput } from "@/services/graphql/adminProfile";

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
