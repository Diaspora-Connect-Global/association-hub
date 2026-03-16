# Vendor Service — Code Examples & Cheat Sheet

Copy-paste ready examples for common vendor operations.

## Example 1: Check if user is a vendor

```typescript
import { useGetMyVendor } from "@/vendor";
import { useEffect } from "react";

export function CheckVendorStatus() {
  const { vendor, loading, fetchMyVendor } = useGetMyVendor();

  useEffect(() => {
    fetchMyVendor();
  }, [fetchMyVendor]);

  if (loading) return <div>Loading...</div>;
  if (!vendor) return <div>Not a vendor yet. Create a vendor profile.</div>;
  return <div>Vendor: {vendor.displayName} ({vendor.status})</div>;
}
```

## Example 2: Create a vendor with form

```typescript
import { useCreateVendor } from "@/vendor";
import { useState } from "react";

export function CreateVendorForm() {
  const { createVendor, loading, error } = useCreateVendor();
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createVendor({
      vendorType: "INDIVIDUAL",
      displayName,
      description,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Display Name"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button disabled={loading}>
        {loading ? "Creating..." : "Create Vendor"}
      </button>
      {error && <p className="text-red">{error}</p>}
    </form>
  );
}
```

## Example 3: Upload product images and create product

```typescript
import { vendorService, uploadMultipleFiles } from "@/vendor";

export async function createProductWithImages(
  vendorId: string,
  formData: {
    title: string;
    description: string;
    price: number;
    inventory: number;
    images: File[];
  }
) {
  // Upload all images in parallel
  const imageUrls = await uploadMultipleFiles(
    vendorId,
    formData.images,
    "product"
  );

  // Create product with uploaded image URLs
  const productId = await vendorService.createProduct({
    vendorId,
    title: formData.title,
    description: formData.description,
    price: formData.price,
    currency: "GHS",
    inventoryCount: formData.inventory,
    productType: "PHYSICAL",
    images: imageUrls,
    tags: [],
  });

  return productId;
}
```

## Example 4: List and publish products

```typescript
import { useListVendorProducts, usePublishProduct } from "@/vendor";
import { useEffect } from "react";

export function ProductList({ vendorId }: { vendorId: string }) {
  const { products, fetchProducts, loading } = useListVendorProducts(
    vendorId,
    "DRAFT", // Show only unpublished
    10 // Limit
  );
  const { publishProduct, loading: publishing } = usePublishProduct();

  useEffect(() => {
    fetchProducts(0); // Fetch first page
  }, [fetchProducts]);

  const handlePublish = async (productId: string) => {
    await publishProduct(productId);
    await fetchProducts(0); // Refresh
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      {products?.items.map((product) => (
        <div key={product.id}>
          <h3>{product.title}</h3>
          <p>${product.price.toFixed(2)}</p>
          <button
            onClick={() => handlePublish(product.id)}
            disabled={publishing}
          >
            Publish
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Example 5: Check eligibility and request payout

```typescript
import {
  useGetVendorEligibility,
  useRequestPayout,
  checkEligibilityFromResponse,
} from "@/vendor";
import { useEffect } from "react";

export function PayoutSection({ vendorId }: { vendorId: string }) {
  const { eligibility, fetchEligibility } = useGetVendorEligibility(vendorId);
  const { requestPayout, loading } = useRequestPayout();

  useEffect(() => {
    fetchEligibility();
  }, [fetchEligibility]);

  const handleRequestPayout = async () => {
    if (!eligibility) return;

    const check = checkEligibilityFromResponse(
      eligibility.canSell,
      eligibility.canReceivePayout,
      eligibility.verifiedPayoutAccounts,
      eligibility.activeSuspensionCount
    );

    if (!check.canReceivePayout) {
      alert("Missing: " + check.missingRequirements.join(", "));
      return;
    }

    await requestPayout({
      vendorId,
      amount: 500,
      currency: "GHS",
    });
  };

  if (!eligibility) return <div>Loading eligibility...</div>;

  return (
    <div>
      <p>
        Can Receive Payout:{" "}
        {eligibility.canReceivePayout ? "✅ Yes" : "❌ No"}
      </p>
      {eligibility.canReceivePayout ? (
        <button onClick={handleRequestPayout} disabled={loading}>
          Request Payout
        </button>
      ) : (
        <p>Complete KYC and add a verified payout account first.</p>
      )}
    </div>
  );
}
```

## Example 6: Vendor status badge

```typescript
import { vendorStatusConfig } from "@/vendor";

export function VendorStatusBadge({ status }: { status: string }) {
  const config =
    vendorStatusConfig[status as keyof typeof vendorStatusConfig];
  return (
    <span className={`badge badge-${config.color}`}>
      {config.icon} {config.label}
    </span>
  );
}
```

## Example 7: Upload single file (e.g., logo)

```typescript
import { uploadFileAndGetUrl } from "@/vendor";

export async function uploadVendorLogo(
  vendorId: string,
  logoFile: File
): Promise<string> {
  const logoUrl = await uploadFileAndGetUrl(vendorId, logoFile, "logo");
  // Now use logoUrl to update vendor profile
  // await updateVendorProfile(vendorId, { logoUrl });
  return logoUrl;
}
```

## Example 8: Create service package with milestones

```typescript
import { vendorService } from "@/vendor";

export async function createServiceWithMilestones(
  vendorId: string,
  serviceData: {
    title: string;
    description: string;
    basePrice: number;
    estimatedDuration: number;
    benefits: string[];
    milestones: Array<{
      title: string;
      description: string;
      percentageOfTotal: number;
      estimatedDays: number;
      deliverables: string[];
      order: number;
    }>;
  }
) {
  // 1. Create package
  const packageId = await vendorService.createServicePackage({
    vendorId,
    title: serviceData.title,
    description: serviceData.description,
    basePrice: serviceData.basePrice,
    currency: "GHS",
    estimatedDuration: serviceData.estimatedDuration,
    benefits: serviceData.benefits,
  });

  // 2. Add milestones
  for (const milestone of serviceData.milestones) {
    await vendorService.addMilestone({
      packageId,
      ...milestone,
    });
  }

  // 3. Publish
  await vendorService.publishServicePackage(packageId);

  return packageId;
}
```

## Example 9: Paginated product list

```typescript
import { useListVendorProducts } from "@/vendor";
import { useEffect, useState } from "react";

export function PaginatedProductList({ vendorId }: { vendorId: string }) {
  const [page, setPage] = useState(0);
  const LIMIT = 10;

  const { products, fetchProducts, loading } = useListVendorProducts(
    vendorId,
    "PUBLISHED",
    LIMIT
  );

  useEffect(() => {
    fetchProducts(page * LIMIT);
  }, [page, fetchProducts]);

  const hasNextPage =
    products && page * LIMIT + products.items.length < products.totalCount;
  const hasPrevPage = page > 0;

  return (
    <div>
      {products?.items.map((product) => (
        <div key={product.id}>{product.title}</div>
      ))}

      <button onClick={() => setPage(page - 1)} disabled={!hasPrevPage}>
        Previous
      </button>
      <span>Page {page + 1}</span>
      <button onClick={() => setPage(page + 1)} disabled={!hasNextPage}>
        Next
      </button>
    </div>
  );
}
```

## Example 10: Digital product with download

```typescript
import { vendorService, uploadFileAndGetUrl } from "@/vendor";

export async function createDigitalProduct(
  vendorId: string,
  formData: {
    title: string;
    description: string;
    price: number;
    downloadFile: File;
  }
) {
  // 1. Upload digital file
  const downloadUrl = await uploadFileAndGetUrl(
    vendorId,
    formData.downloadFile,
    "download"
  );

  // 2. Create DIGITAL product (no inventory needed)
  const productId = await vendorService.createProduct({
    vendorId,
    title: formData.title,
    description: formData.description,
    price: formData.price,
    currency: "GHS",
    inventoryCount: 999999, // Unlimited for digital
    productType: "DIGITAL",
    downloadUrl, // Required for DIGITAL
    images: [], // Optional for digital
    tags: [],
  });

  return productId;
}
```

---

## Format Currency

```typescript
import { formatPrice } from "@/vendor";

const price = formatPrice(100, "GHS");
console.log(price); // ₵100.00
```

## Validate Milestone Percentages

```typescript
import { validateMilestonePercentages } from "@/vendor";

const milestones = [
  { percentageOfTotal: 50 },
  { percentageOfTotal: 50 },
];

const validation = validateMilestonePercentages(milestones);
if (!validation.valid) {
  console.error(`Total ${validation.total}%, must be 100%`);
}
```

## Check Payout Eligibility

```typescript
import { checkEligibilityFromResponse } from "@/vendor";

const check = checkEligibilityFromResponse(
  canSell,
  canReceivePayout,
  verifiedPayoutAccounts,
  activeSuspensionCount
);

if (!check.canReceivePayout) {
  console.log("Missing requirements:");
  check.missingRequirements.forEach((req) => console.log("  -", req));
}
```
