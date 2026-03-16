// Vendor Service Custom Hooks
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { vendorService } from "@/services/graphql/vendor/operations";
import type {
  VendorDTO,
  ProductDTO,
  ServicePackageDTO,
  VendorDashboardDTO,
  VendorEligibilityDTO,
  ProductListPaginatedDTO,
  ServicePackageListPaginatedDTO,
  VendorOrderListPaginatedDTO,
  CreateVendorInput,
  CreateProductInput,
  UpdateProductInput,
  CreateServicePackageInput,
  AddMilestoneInput,
  RequestPayoutInput,
  RequestVendorUploadUrlInput,
  SuspendVendorInput,
  UploadUrlDTO,
} from "@/types/vendor-service";

// ============ FETCH HOOKS ============

export const useGetMyVendor = () => {
  const [vendor, setVendor] = useState<VendorDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMyVendor = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vendorService.getMyVendor();
      setVendor(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch vendor";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { vendor, loading, error, fetchMyVendor };
};

export const useGetVendor = (vendorId: string) => {
  const [vendor, setVendor] = useState<VendorDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchVendor = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vendorService.getVendor(vendorId);
      setVendor(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch vendor";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [vendorId, toast]);

  return { vendor, loading, error, fetchVendor };
};

export const useGetVendorDashboard = (vendorId?: string) => {
  const [dashboard, setDashboard] = useState<VendorDashboardDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vendorService.getVendorDashboard(vendorId);
      setDashboard(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch dashboard";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [vendorId, toast]);

  return { dashboard, loading, error, fetchDashboard };
};

export const useGetVendorEligibility = (vendorId?: string) => {
  const [eligibility, setEligibility] = useState<VendorEligibilityDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEligibility = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vendorService.getVendorEligibility(vendorId);
      setEligibility(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch eligibility";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [vendorId, toast]);

  return { eligibility, loading, error, fetchEligibility };
};

export const useListVendorProducts = (
  vendorId?: string,
  status?: string,
  limit: number = 20
) => {
  const [products, setProducts] = useState<ProductListPaginatedDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = useCallback(
    async (offset: number = 0) => {
      setLoading(true);
      setError(null);
      try {
        const data = await vendorService.listVendorProducts(
          vendorId,
          status,
          limit,
          offset
        );
        setProducts(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch products";
        setError(message);
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [vendorId, status, limit, toast]
  );

  return { products, loading, error, fetchProducts };
};

export const useListVendorServicePackages = (
  vendorId?: string,
  status?: string,
  limit: number = 20
) => {
  const [packages, setPackages] = useState<ServicePackageListPaginatedDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPackages = useCallback(
    async (offset: number = 0) => {
      setLoading(true);
      setError(null);
      try {
        const data = await vendorService.listVendorServicePackages(
          vendorId,
          status,
          limit,
          offset
        );
        setPackages(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch packages";
        setError(message);
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [vendorId, status, limit, toast]
  );

  return { packages, loading, error, fetchPackages };
};

export const useListVendorOrders = (
  vendorId?: string,
  status?: string,
  limit: number = 20
) => {
  const [orders, setOrders] = useState<VendorOrderListPaginatedDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOrders = useCallback(
    async (offset: number = 0) => {
      setLoading(true);
      setError(null);
      try {
        const data = await vendorService.listVendorOrders(
          vendorId,
          status,
          limit,
          offset
        );
        setOrders(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch orders";
        setError(message);
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [vendorId, status, limit, toast]
  );

  return { orders, loading, error, fetchOrders };
};

// ============ MUTATION HOOKS ============

export const useCreateVendor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const createVendor = useCallback(
    async (input: CreateVendorInput) => {
      setLoading(true);
      setError(null);
      try {
        const vendorId = await vendorService.createVendor(input);
        toast({
          title: "Success",
          description: "Vendor profile created successfully",
        });
        return vendorId;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create vendor";
        setError(message);
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return { loading, error, createVendor };
};

export const useRequestVendorUploadUrl = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const requestUploadUrl = useCallback(
    async (input: RequestVendorUploadUrlInput) => {
      setLoading(true);
      setError(null);
      try {
        const uploadUrl = await vendorService.requestVendorUploadUrl(input);
        return uploadUrl;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to request upload URL";
        setError(message);
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return { loading, error, requestUploadUrl };
};

export const useUploadFileToGCS = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const uploadFile = useCallback(
    async (uploadUrl: string, file: File) => {
      setLoading(true);
      setError(null);
      setProgress(0);
      try {
        await vendorService.uploadFileToGCS(uploadUrl, file);
        setProgress(100);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to upload file";
        setError(message);
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return { loading, error, progress, uploadFile };
};

export const useCreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const createProduct = useCallback(
    async (input: CreateProductInput) => {
      setLoading(true);
      setError(null);
      try {
        const productId = await vendorService.createProduct(input);
        toast({
          title: "Success",
          description: "Product created successfully (status: DRAFT)",
        });
        return productId;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create product";
        setError(message);
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return { loading, error, createProduct };
};

export const useUpdateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const updateProduct = useCallback(
    async (input: UpdateProductInput) => {
      setLoading(true);
      setError(null);
      try {
        const success = await vendorService.updateProduct(input);
        if (success) {
          toast({
            title: "Success",
            description: "Product updated successfully",
          });
        }
        return success;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update product";
        setError(message);
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return { loading, error, updateProduct };
};

export const usePublishProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const publishProduct = useCallback(
    async (productId: string) => {
      setLoading(true);
      setError(null);
      try {
        const success = await vendorService.publishProduct(productId);
        if (success) {
          toast({
            title: "Success",
            description: "Product published successfully",
          });
        }
        return success;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to publish product";
        setError(message);
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return { loading, error, publishProduct };
};

export const useDeleteProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const deleteProduct = useCallback(
    async (productId: string) => {
      setLoading(true);
      setError(null);
      try {
        const success = await vendorService.deleteProduct(productId);
        if (success) {
          toast({
            title: "Success",
            description: "Product deleted successfully",
          });
        }
        return success;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete product";
        setError(message);
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return { loading, error, deleteProduct };
};

export const useCreateServicePackage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const createServicePackage = useCallback(
    async (input: CreateServicePackageInput) => {
      setLoading(true);
      setError(null);
      try {
        const packageId = await vendorService.createServicePackage(input);
        toast({
          title: "Success",
          description: "Service package created successfully",
        });
        return packageId;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create service package";
        setError(message);
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return { loading, error, createServicePackage };
};

export const useAddMilestone = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const addMilestone = useCallback(
    async (input: AddMilestoneInput) => {
      setLoading(true);
      setError(null);
      try {
        const milestoneId = await vendorService.addMilestone(input);
        toast({
          title: "Success",
          description: "Milestone added successfully",
        });
        return milestoneId;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to add milestone";
        setError(message);
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return { loading, error, addMilestone };
};

export const usePublishServicePackage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const publishServicePackage = useCallback(
    async (packageId: string) => {
      setLoading(true);
      setError(null);
      try {
        const success = await vendorService.publishServicePackage(packageId);
        if (success) {
          toast({
            title: "Success",
            description: "Service package published successfully",
          });
        }
        return success;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to publish service package";
        setError(message);
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return { loading, error, publishServicePackage };
};

export const useRequestPayout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const requestPayout = useCallback(
    async (input: RequestPayoutInput) => {
      setLoading(true);
      setError(null);
      try {
        const payoutId = await vendorService.requestPayout(input);
        toast({
          title: "Success",
          description: "Payout request submitted successfully",
        });
        return payoutId;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to request payout";
        setError(message);
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return { loading, error, requestPayout };
};

export const useSuspendVendor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const suspendVendor = useCallback(
    async (input: SuspendVendorInput) => {
      setLoading(true);
      setError(null);
      try {
        const success = await vendorService.suspendVendor(input);
        if (success) {
          toast({
            title: "Success",
            description: "Vendor suspended successfully",
          });
        }
        return success;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to suspend vendor";
        setError(message);
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return { loading, error, suspendVendor };
};

export const useReinstateVendor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const reinstateVendor = useCallback(
    async (vendorId: string) => {
      setLoading(true);
      setError(null);
      try {
        const success = await vendorService.reinstateVendor(vendorId);
        if (success) {
          toast({
            title: "Success",
            description: "Vendor reinstated successfully",
          });
        }
        return success;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to reinstate vendor";
        setError(message);
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return { loading, error, reinstateVendor };
};
