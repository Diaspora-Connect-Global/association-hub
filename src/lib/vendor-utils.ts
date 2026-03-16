// Vendor Service Utilities
import { vendorService } from "@/services/graphql/vendor/operations";
import type {
  RequestVendorUploadUrlInput,
  CreateProductInput,
  FileUploadType,
} from "@/types/vendor-service";

/**
 * Full file upload flow: request signed URL, upload to GCS, return readUrl
 */
export async function uploadFileAndGetUrl(
  vendorId: string,
  file: File,
  fileType: FileUploadType
): Promise<string> {
  // Step 1: Request signed upload URL from backend
  const uploadUrlResponse = await vendorService.requestVendorUploadUrl({
    vendorId,
    fileName: file.name,
    contentType: file.type,
    fileType,
  });

  const { uploadUrl, readUrl } = uploadUrlResponse;

  // Step 2: Upload directly to GCS
  await vendorService.uploadFileToGCS(uploadUrl, file);

  // Step 3: Return the readUrl for use in product/logo fields
  return readUrl;
}

/**
 * Upload multiple files (e.g., product images)
 */
export async function uploadMultipleFiles(
  vendorId: string,
  files: File[],
  fileType: FileUploadType
): Promise<string[]> {
  const readUrls = await Promise.all(
    files.map((file) => uploadFileAndGetUrl(vendorId, file, fileType))
  );
  return readUrls;
}

/**
 * Validate vendor eligibility before publishing or requesting payout
 */
export interface EligibilityCheckResult {
  canSell: boolean;
  canReceivePayout: boolean;
  missingRequirements: string[];
}

export function checkEligibilityFromResponse(
  canSell: boolean,
  canReceivePayout: boolean,
  verifiedPayoutAccounts: number,
  activeSuspensionCount: number
): EligibilityCheckResult {
  const missingRequirements: string[] = [];

  if (!canSell) {
    if (activeSuspensionCount > 0) {
      missingRequirements.push("Vendor is currently suspended");
    } else {
      missingRequirements.push("Vendor is not eligible to sell");
    }
  }

  if (!canReceivePayout) {
    if (verifiedPayoutAccounts === 0) {
      missingRequirements.push("No verified payout account");
    } else {
      missingRequirements.push("KYC verification required");
    }
  }

  return {
    canSell,
    canReceivePayout,
    missingRequirements,
  };
}

/**
 * Format currency with symbol
 */
export const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  CHF: "CHF",
  JPY: "¥",
  CNY: "¥",
  NGN: "₦",
  KES: "KSh",
  ZAR: "R",
  GHS: "₵",
  XOF: "CFA",
  XAF: "FCFA",
};

export function formatPrice(amount: number, currency: string): string {
  const symbol = currencySymbols[currency] || currency;
  return `${symbol}${amount.toFixed(2)}`;
}

/**
 * Pagination helper
 */
export interface PaginationState {
  limit: number;
  offset: number;
  totalCount: number;
}

export function getNextPaginationOffset(state: PaginationState): number {
  const nextOffset = state.offset + state.limit;
  const maxOffset = Math.max(0, state.totalCount - 1);
  return Math.min(nextOffset, maxOffset);
}

export function getPreviousPaginationOffset(state: PaginationState): number {
  return Math.max(0, state.offset - state.limit);
}

export function isLastPage(state: PaginationState): boolean {
  return state.offset + state.limit >= state.totalCount;
}

export function isFirstPage(state: PaginationState): boolean {
  return state.offset === 0;
}

/**
 * Vendor status labels and colors
 */
export const vendorStatusConfig = {
  DRAFT: { label: "Draft", color: "gray", icon: "⚪" },
  ACTIVE: { label: "Active", color: "green", icon: "✅" },
  KYC_PENDING: { label: "KYC Pending", color: "yellow", icon: "⏳" },
  SUSPENDED: { label: "Suspended", color: "red", icon: "🚫" },
};

/**
 * Product status labels and colors
 */
export const productStatusConfig = {
  DRAFT: { label: "Draft", color: "gray", icon: "📝" },
  PUBLISHED: { label: "Published", color: "green", icon: "📢" },
  ARCHIVED: { label: "Archived", color: "gray", icon: "📦" },
};

/**
 * Order status labels and colors
 */
export const orderStatusConfig = {
  CREATED: { label: "Created", color: "blue", icon: "📋" },
  SHIPPED: { label: "Shipped", color: "orange", icon: "🚚" },
  DELIVERED: { label: "Delivered", color: "green", icon: "✅" },
  REFUNDED: { label: "Refunded", color: "red", icon: "↩️" },
};

/**
 * Determine if a product/service can be edited
 */
export function canEditProduct(status: string): boolean {
  return status === "DRAFT";
}

/**
 * Calculate total milestones percentage
 */
export function calculateMilestonesTotal(milestones: Array<{ percentageOfTotal: number }>): number {
  return milestones.reduce((sum, m) => sum + m.percentageOfTotal, 0);
}

/**
 * Validate milestones sum to 100%
 */
export function validateMilestonePercentages(
  milestones: Array<{ percentageOfTotal: number }>
): { valid: boolean; total: number } {
  const total = calculateMilestonesTotal(milestones);
  return {
    valid: Math.abs(total - 100) < 0.01, // Allow for floating point rounding
    total,
  };
}
