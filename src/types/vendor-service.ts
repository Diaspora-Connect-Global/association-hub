// Vendor Service Types - Based on Frontend Integration Guide

export type VendorType = "INDIVIDUAL" | "BUSINESS";
export type VendorStatus = "DRAFT" | "ACTIVE" | "KYC_PENDING" | "SUSPENDED";
export type ProductType = "PHYSICAL" | "DIGITAL";
export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type OrderStatus = "CREATED" | "SHIPPED" | "DELIVERED" | "REFUNDED";
export type FileUploadType = "product" | "logo" | "download";

// ============ Vendor DTOs ============

export interface PayoutAccount {
  id: string;
  provider: string;
  currency: string;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
  verifiedAt?: string;
}

export interface VendorCapability {
  type: string;
  enabled: boolean;
}

export interface VendorDTO {
  id: string;
  userId: string;
  displayName: string;
  description: string;
  type: VendorType;
  status: VendorStatus;
  logoUrl?: string;
  rating: number;
  completedOrders: number;
  capabilities: VendorCapability[];
  payoutAccounts: PayoutAccount[];
  createdAt: string;
  updatedAt: string;
}

// ============ Product DTOs ============

export interface ProductDTO {
  id: string;
  vendorId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  inventoryCount: number;
  productType: ProductType;
  status: ProductStatus;
  shippingProfileId?: string;
  downloadUrl?: string;
  images: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductListPaginatedDTO {
  totalCount: number;
  items: ProductDTO[];
}

// ============ Service Package DTOs ============

export interface Milestone {
  id: string;
  title: string;
  description: string;
  percentageOfTotal: number;
  estimatedDays: number;
  deliverables: string[];
  order: number;
}

export interface ServicePackageDTO {
  id: string;
  vendorId: string;
  title: string;
  description: string;
  basePrice: number;
  currency: string;
  estimatedDuration: number;
  status: ProductStatus;
  benefits: string[];
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export interface ServicePackageListPaginatedDTO {
  totalCount: number;
  items: ServicePackageDTO[];
}

// ============ Order DTOs ============

export interface VendorOrderDTO {
  id: string;
  vendorId: string;
  buyerId: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorOrderListPaginatedDTO {
  totalCount: number;
  items: VendorOrderDTO[];
}

// ============ Dashboard DTOs ============

export interface VendorDashboardDTO {
  id: string;
  userId: string;
  displayName: string;
  totalSales: number;
  totalEarnings: number;
  averageRating: number;
  totalRatings: number;
  completedOrders: number;
  status: VendorStatus;
}

// ============ Eligibility DTOs ============

export interface VendorEligibilityDTO {
  vendorId: string;
  canSell: boolean;
  canReceivePayout: boolean;
  isCompliant: boolean;
  status: VendorStatus;
  payoutAccountCount: number;
  verifiedPayoutAccounts: number;
  activeSuspensionCount: number;
}

// ============ File Upload DTOs ============

export interface UploadUrlDTO {
  uploadUrl: string;
  readUrl: string;
  objectKey: string;
}

// ============ Payout DTOs ============

export interface PayoutRequestDTO {
  id: string;
  vendorId: string;
  amount: number;
  currency: string;
  status: string;
  requestedAt: string;
  processedAt?: string;
}

// ============ Mutation Inputs ============

export interface CreateVendorInput {
  vendorType: VendorType;
  displayName: string;
  description: string;
}

export interface CreateProductInput {
  vendorId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  inventoryCount: number;
  productType: ProductType;
  shippingProfileId?: string;
  downloadUrl?: string;
  images: string[];
  tags: string[];
}

export interface UpdateProductInput {
  productId: string;
  title: string;
  description: string;
  price: number;
  inventoryCount: number;
  images?: string[];
  tags?: string[];
}

export interface CreateServicePackageInput {
  vendorId: string;
  title: string;
  description: string;
  basePrice: number;
  currency: string;
  estimatedDuration: number;
  benefits: string[];
}

export interface AddMilestoneInput {
  packageId: string;
  title: string;
  description: string;
  percentageOfTotal: number;
  estimatedDays: number;
  deliverables: string[];
  order: number;
}

export interface RequestPayoutInput {
  vendorId: string;
  amount: number;
  currency: string;
}

export interface RequestVendorUploadUrlInput {
  vendorId: string;
  fileName: string;
  contentType: string;
  fileType: FileUploadType;
}

export interface SuspendVendorInput {
  vendorId: string;
  reason: string;
}
