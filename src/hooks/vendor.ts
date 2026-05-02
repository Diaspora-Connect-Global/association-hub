// Vendor Service Custom Hooks
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { vendorService } from "@/services/graphql/vendor/operations";
import type {
  CreateVendorInput,
  CreateProductInput,
  UpdateProductInput,
  CreateServicePackageInput,
  AddMilestoneInput,
  RequestPayoutInput,
  RequestVendorUploadUrlInput,
  SuspendVendorInput,
  UpdateVendorEscrowSettingsInput,
} from "@/types/vendor-service";

// ============ FETCH HOOKS ============

export const useGetMyVendor = () => {
  const { toast } = useToast();
  const query = useQuery({
    queryKey: ["myVendor"],
    queryFn: () => vendorService.getMyVendor(),
  });

  useEffect(() => {
    if (query.error) {
      const message =
        query.error instanceof Error ? query.error.message : "Failed to fetch vendor";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  }, [query.error, toast]);

  return {
    vendor: query.data ?? null,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    fetchMyVendor: query.refetch,
  };
};

export const useGetVendor = (vendorId: string) => {
  const { toast } = useToast();
  const query = useQuery({
    queryKey: ["vendor", vendorId],
    queryFn: () => vendorService.getVendor(vendorId),
    enabled: !!vendorId,
  });

  useEffect(() => {
    if (query.error) {
      const message =
        query.error instanceof Error ? query.error.message : "Failed to fetch vendor";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  }, [query.error, toast]);

  return {
    vendor: query.data ?? null,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    fetchVendor: query.refetch,
  };
};

export const useGetVendorDashboard = (vendorId?: string) => {
  const { toast } = useToast();
  const query = useQuery({
    queryKey: ["vendorDashboard", vendorId],
    queryFn: () => vendorService.getVendorDashboard(vendorId),
  });

  useEffect(() => {
    if (query.error) {
      const message =
        query.error instanceof Error ? query.error.message : "Failed to fetch dashboard";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  }, [query.error, toast]);

  return {
    dashboard: query.data ?? null,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    fetchDashboard: query.refetch,
  };
};

export const useGetVendorEligibility = (vendorId?: string) => {
  const { toast } = useToast();
  const query = useQuery({
    queryKey: ["vendorEligibility", vendorId],
    queryFn: () => vendorService.getVendorEligibility(vendorId),
  });

  useEffect(() => {
    if (query.error) {
      const message =
        query.error instanceof Error ? query.error.message : "Failed to fetch eligibility";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  }, [query.error, toast]);

  return {
    eligibility: query.data ?? null,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    fetchEligibility: query.refetch,
  };
};

export const useListVendorProducts = (
  vendorId?: string,
  status?: string,
  limit: number = 20,
) => {
  const { toast } = useToast();
  const query = useQuery({
    queryKey: ["vendorProducts", vendorId, status, limit],
    queryFn: () => vendorService.listVendorProducts(vendorId, status, limit, 0),
  });

  useEffect(() => {
    if (query.error) {
      const message =
        query.error instanceof Error ? query.error.message : "Failed to fetch products";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  }, [query.error, toast]);

  return {
    products: query.data ?? null,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    fetchProducts: query.refetch,
  };
};

export const useListVendorServicePackages = (
  vendorId?: string,
  status?: string,
  limit: number = 20,
) => {
  const { toast } = useToast();
  const query = useQuery({
    queryKey: ["vendorServicePackages", vendorId, status, limit],
    queryFn: () => vendorService.listVendorServicePackages(vendorId, status, limit, 0),
  });

  useEffect(() => {
    if (query.error) {
      const message =
        query.error instanceof Error ? query.error.message : "Failed to fetch packages";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  }, [query.error, toast]);

  return {
    packages: query.data ?? null,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    fetchPackages: query.refetch,
  };
};

export const useListVendorOrders = (
  vendorId?: string,
  status?: string,
  limit: number = 20,
) => {
  const { toast } = useToast();
  const query = useQuery({
    queryKey: ["vendorOrders", vendorId, status, limit],
    queryFn: () => vendorService.listVendorOrders(vendorId, status, limit, 0),
  });

  useEffect(() => {
    if (query.error) {
      const message =
        query.error instanceof Error ? query.error.message : "Failed to fetch orders";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  }, [query.error, toast]);

  return {
    orders: query.data ?? null,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    fetchOrders: query.refetch,
  };
};

export const useGetVendorEscrowSettings = (vendorId: string | null) => {
  const { toast } = useToast();
  const query = useQuery({
    queryKey: ["vendorEscrowSettings", vendorId],
    queryFn: () => vendorService.getVendorEscrowSettings(vendorId!),
    enabled: !!vendorId,
  });

  useEffect(() => {
    if (query.error) {
      const message =
        query.error instanceof Error ? query.error.message : "Failed to fetch escrow settings";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  }, [query.error, toast]);

  return {
    settings: query.data ?? null,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    fetchSettings: query.refetch,
  };
};

// ============ MUTATION HOOKS ============

export const useCreateVendor = () => {
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (input: CreateVendorInput) => vendorService.createVendor(input),
    onSuccess: () => {
      toast({ title: "Success", description: "Vendor profile created successfully" });
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to create vendor";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  return {
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    createVendor: mutation.mutateAsync,
  };
};

export const useRequestVendorUploadUrl = () => {
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (input: RequestVendorUploadUrlInput) =>
      vendorService.requestVendorUploadUrl(input),
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to request upload URL";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  return {
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    requestUploadUrl: mutation.mutateAsync,
  };
};

export const useUploadFileToGCS = () => {
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: async ({ uploadUrl, file }: { uploadUrl: string; file: File }) => {
      setProgress(0);
      await vendorService.uploadFileToGCS(uploadUrl, file);
      setProgress(100);
      return true;
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to upload file";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  const uploadFile = (uploadUrl: string, file: File) =>
    mutation.mutateAsync({ uploadUrl, file });

  return {
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    progress,
    uploadFile,
  };
};

export const useCreateProduct = () => {
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (input: CreateProductInput) => vendorService.createProduct(input),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product created successfully (status: DRAFT)",
      });
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to create product";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  return {
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    createProduct: mutation.mutateAsync,
  };
};

export const useUpdateProduct = () => {
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (input: UpdateProductInput) => vendorService.updateProduct(input),
    onSuccess: (success) => {
      if (success) {
        toast({ title: "Success", description: "Product updated successfully" });
      }
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to update product";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  return {
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    updateProduct: mutation.mutateAsync,
  };
};

export const usePublishProduct = () => {
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (productId: string) => vendorService.publishProduct(productId),
    onSuccess: (success) => {
      if (success) {
        toast({ title: "Success", description: "Product published successfully" });
      }
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to publish product";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  return {
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    publishProduct: mutation.mutateAsync,
  };
};

export const useDeleteProduct = () => {
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (productId: string) => vendorService.deleteProduct(productId),
    onSuccess: (success) => {
      if (success) {
        toast({ title: "Success", description: "Product deleted successfully" });
      }
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to delete product";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  return {
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    deleteProduct: mutation.mutateAsync,
  };
};

export const useCreateServicePackage = () => {
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (input: CreateServicePackageInput) =>
      vendorService.createServicePackage(input),
    onSuccess: () => {
      toast({ title: "Success", description: "Service package created successfully" });
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to create service package";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  return {
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    createServicePackage: mutation.mutateAsync,
  };
};

export const useAddMilestone = () => {
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (input: AddMilestoneInput) => vendorService.addMilestone(input),
    onSuccess: () => {
      toast({ title: "Success", description: "Milestone added successfully" });
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to add milestone";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  return {
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    addMilestone: mutation.mutateAsync,
  };
};

export const usePublishServicePackage = () => {
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (packageId: string) => vendorService.publishServicePackage(packageId),
    onSuccess: (success) => {
      if (success) {
        toast({ title: "Success", description: "Service package published successfully" });
      }
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Failed to publish service package";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  return {
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    publishServicePackage: mutation.mutateAsync,
  };
};

export const useRequestPayout = () => {
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (input: RequestPayoutInput) => vendorService.requestPayout(input),
    onSuccess: () => {
      toast({ title: "Success", description: "Payout request submitted successfully" });
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to request payout";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  return {
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    requestPayout: mutation.mutateAsync,
  };
};

export const useSuspendVendor = () => {
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (input: SuspendVendorInput) => vendorService.suspendVendor(input),
    onSuccess: (success) => {
      if (success) {
        toast({ title: "Success", description: "Vendor suspended successfully" });
      }
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to suspend vendor";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  return {
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    suspendVendor: mutation.mutateAsync,
  };
};

export const useReinstateVendor = () => {
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (vendorId: string) => vendorService.reinstateVendor(vendorId),
    onSuccess: (success) => {
      if (success) {
        toast({ title: "Success", description: "Vendor reinstated successfully" });
      }
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to reinstate vendor";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  return {
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    reinstateVendor: mutation.mutateAsync,
  };
};

export const useUpdateVendorEscrowSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: UpdateVendorEscrowSettingsInput) =>
      vendorService.updateVendorEscrowSettings(input),
    onSuccess: (_result, variables) => {
      toast({ title: "Success", description: "Escrow settings saved successfully" });
      void queryClient.invalidateQueries({
        queryKey: ["vendorEscrowSettings", variables.vendorId],
      });
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to save escrow settings";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  return {
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    updateEscrowSettings: mutation.mutateAsync,
  };
};
