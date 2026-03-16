# Vendor Service Integration

This directory contains the complete frontend integration for the Vendor Service GraphQL API. It includes type definitions, GraphQL operations, custom hooks, and utility functions.

## File Structure

```
src/
├── types/
│   └── vendor-service.ts          # TypeScript types & interfaces
├── services/graphql/vendor/
│   └── operations.ts              # GraphQL queries & mutations + service functions
├── hooks/
│   └── vendor.ts                  # Custom React hooks
├── lib/
│   └── vendor-utils.ts            # Utility functions
└── vendor/
    └── index.ts                   # Barrel exports
```

## Quick Start

### Import Everything

```typescript
import {
  // Types
  VendorDTO,
  ProductDTO,
  ServicePackageDTO,
  // Hooks
  useGetMyVendor,
  useCreateProduct,
  useRequestPayout,
  // Utils
  uploadFileAndGetUrl,
  formatPrice,
  vendorStatusConfig,
} from "@/vendor";
```

### Or import specific modules

```typescript
// Types
import type { VendorDTO, ProductListPaginatedDTO } from "@/types/vendor-service";

// Service
import { vendorService } from "@/services/graphql/vendor/operations";

// Hooks
import { useCreateVendor, useListVendorProducts } from "@/hooks/vendor";

// Utils
import { uploadFileAndGetUrl, formatPrice } from "@/lib/vendor-utils";
```

---

## Key Features

### 1. **Type-Safe GraphQL Operations**

All GraphQL operations are defined in [src/services/graphql/vendor/operations.ts](src/services/graphql/vendor/operations.ts) and fully typed.

**Queries:**
- `getVendor(vendorId)` - Get public vendor profile
- `getMyVendor()` - Get authenticated user's vendor
- `getVendorDashboard(vendorId?)` - Sales analytics
- `getVendorEligibility(vendorId?)` - Compliance status
- `listVendorProducts(vendorId?, status?, limit, offset)` - Paginated products
- `listVendorServicePackages(vendorId?, status?, limit, offset)` - Paginated services
- `listVendorOrders(vendorId?, status?, limit, offset)` - Paginated orders

**Mutations:**
- `createVendor(vendorType, displayName, description)` - Create vendor profile
- `requestVendorUploadUrl(...)` - Get signed GCS URL
- `createProduct(...)` - Create product (DRAFT status)
- `updateProduct(...)` - Update product fields
- `publishProduct(productId)` - Make product visible (DRAFT → PUBLISHED)
- `deleteProduct(productId)` - Hard delete
- `createServicePackage(...)` - Create service package
- `addMilestone(...)` - Add milestone to package
- `publishServicePackage(packageId)` - Publish service
- `requestPayout(vendorId, amount, currency)` - Request payout
- `suspendVendor(vendorId, reason)` - Admin: suspend vendor
- `reinstateVendor(vendorId)` - Admin: reinstate vendor

### 2. **Custom React Hooks**

All hooks in [src/hooks/vendor.ts](src/hooks/vendor.ts) follow the pattern:

```typescript
const { data, loading, error, fetch/mutate } = useHook();
```

**Fetch hooks** (queries):
```typescript
const { vendor, loading, error, fetchMyVendor } = useGetMyVendor();
const { products, loading, error, fetchProducts } = useListVendorProducts(vendorId, status);
const { eligibility, loading, error, fetchEligibility } = useGetVendorEligibility();
```

**Mutation hooks**:
```typescript
const { loading, error, createVendor } = useCreateVendor();
const { loading, error, uploadFile } = useUploadFileToGCS();
const { loading, error, publishProduct } = usePublishProduct();
const { loading, error, requestPayout } = useRequestPayout();
```

All hooks automatically show toast notifications on success/error.

### 3. **File Upload Utilities**

The guide specifies client-side direct upload to GCS. Use the helper:

```typescript
import { uploadFileAndGetUrl, uploadMultipleFiles } from "@/vendor";

// Single file
const readUrl = await uploadFileAndGetUrl(vendorId, logoFile, "logo");

// Multiple files (e.g., product images)
const readUrls = await uploadMultipleFiles(vendorId, imageFiles, "product");

// Then use in mutations:
await createProduct({
  vendorId,
  title: "My Product",
  images: readUrls,
  // ...other fields
});
```

### 4. **Status & Config Constants**

Pre-defined configurations for UI rendering:

```typescript
import {
  vendorStatusConfig,    // DRAFT, ACTIVE, KYC_PENDING, SUSPENDED
  productStatusConfig,   // DRAFT, PUBLISHED, ARCHIVED
  orderStatusConfig,     // CREATED, SHIPPED, DELIVERED, REFUNDED
  currencySymbols,       // GHS, USD, EUR, etc.
} from "@/vendor";

// Usage
const vendor = { status: "ACTIVE" };
const config = vendorStatusConfig[vendor.status];
console.log(config.label);  // "Active"
console.log(config.icon);   // "✅"
console.log(config.color);  // "green"
```

### 5. **Eligibility & Validation Helpers**

```typescript
import {
  checkEligibilityFromResponse,
  validateMilestonePercentages,
  canEditProduct,
} from "@/vendor";

// After fetching eligibility
const result = checkEligibilityFromResponse(
  canSell,
  canReceivePayout,
  verifiedPayoutAccounts,
  activeSuspensionCount
);

if (!result.canSell) {
  console.log(result.missingRequirements);
  // ["Vendor is currently suspended"]
}

// Validate milestone percentages
const milestones = [
  { percentageOfTotal: 50 },
  { percentageOfTotal: 50 },
];
const validation = validateMilestonePercentages(milestones);
if (!validation.valid) {
  console.error(`Milestones total ${validation.total}%, must be 100%`);
}
```

---

## Common Use Cases

### Onboard a New Vendor

```typescript
import { useCreateVendor, useGetMyVendor, uploadFileAndGetUrl } from "@/vendor";

function VendorOnboarding() {
  const { createVendor, loading: creatingVendor } = useCreateVendor();
  const { vendor, fetchMyVendor } = useGetMyVendor();

  const handleCreateVendor = async () => {
    // 1. Create vendor profile
    const vendorId = await createVendor({
      vendorType: "INDIVIDUAL",
      displayName: "Kwame Designs",
      description: "Custom kente and ankara fashion",
    });

    // 2. Upload logo
    const logoUrl = await uploadFileAndGetUrl(vendorId, logoFile, "logo");

    // 3. Update vendor with logo (if updateVendorProfile exists)
    // await updateVendorProfile(vendorId, { logoUrl });

    // 4. Refresh vendor data
    await fetchMyVendor();
  };

  return (
    <button onClick={handleCreateVendor} disabled={creatingVendor}>
      Create Vendor
    </button>
  );
}
```

### List & Publish Products

```typescript
import {
  useListVendorProducts,
  usePublishProduct,
  uploadMultipleFiles,
  useCreateProduct,
} from "@/vendor";

function ProductManagement({ vendorId }) {
  const { products, fetchProducts } = useListVendorProducts(vendorId);
  const { createProduct, loading: creating } = useCreateProduct();
  const { publishProduct, loading: publishing } = usePublishProduct();

  const handleCreateProduct = async (formData) => {
    // 1. Upload images
    const imageUrls = await uploadMultipleFiles(
      vendorId,
      formData.images,
      "product"
    );

    // 2. Create product
    const productId = await createProduct({
      vendorId,
      title: formData.title,
      description: formData.description,
      price: formData.price,
      currency: "GHS",
      inventoryCount: formData.quantity,
      productType: "PHYSICAL",
      images: imageUrls,
      tags: formData.tags,
    });

    // 3. Refresh products list
    await fetchProducts();
  };

  const handlePublish = async (productId) => {
    await publishProduct(productId);
    await fetchProducts();
  };

  return (
    <div>
      {products?.items.map((product) => (
        <div key={product.id}>
          <h3>{product.title}</h3>
          <p>Status: {product.status}</p>
          {product.status === "DRAFT" && (
            <button
              onClick={() => handlePublish(product.id)}
              disabled={publishing}
            >
              Publish
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Check Eligibility & Request Payout

```typescript
import {
  useGetVendorEligibility,
  useRequestPayout,
  checkEligibilityFromResponse,
} from "@/vendor";

function PayoutRequest({ vendorId }) {
  const { eligibility, fetchEligibility } = useGetVendorEligibility(vendorId);
  const { requestPayout, loading } = useRequestPayout();

  useEffect(() => {
    fetchEligibility();
  }, []);

  const handleRequestPayout = async () => {
    if (!eligibility) return;

    const check = checkEligibilityFromResponse(
      eligibility.canSell,
      eligibility.canReceivePayout,
      eligibility.verifiedPayoutAccounts,
      eligibility.activeSuspensionCount
    );

    if (!check.canReceivePayout) {
      alert("Requirements: " + check.missingRequirements.join(", "));
      return;
    }

    const payoutId = await requestPayout({
      vendorId,
      amount: 500,
      currency: "GHS",
    });
    console.log("Payout requested:", payoutId);
  };

  return (
    <div>
      {eligibility && (
        <>
          <p>Can Receive Payout: {eligibility.canReceivePayout ? "✅" : "❌"}</p>
          <button onClick={handleRequestPayout} disabled={loading}>
            Request Payout
          </button>
        </>
      )}
    </div>
  );
}
```

### Service Package with Milestones

```typescript
import {
  useCreateServicePackage,
  useAddMilestone,
  usePublishServicePackage,
  validateMilestonePercentages,
} from "@/vendor";

function ServicePackageForm({ vendorId }) {
  const { createServicePackage } = useCreateServicePackage();
  const { addMilestone } = useAddMilestone();
  const { publishServicePackage } = usePublishServicePackage();

  const handleCreatePackage = async (formData) => {
    // 1. Create package
    const packageId = await createServicePackage({
      vendorId,
      title: "UI/UX Design Service",
      description: "Complete design package",
      basePrice: 500,
      currency: "GHS",
      estimatedDuration: 14,
      benefits: ["3 revisions", "Source files included"],
    });

    // 2. Add milestones
    const milestones = [
      {
        title: "Research & Wireframes",
        description: "Initial research phase",
        percentageOfTotal: 30,
        estimatedDays: 4,
        deliverables: ["Wireframes", "Research report"],
        order: 1,
      },
      {
        title: "Final Delivery",
        description: "Design completion",
        percentageOfTotal: 70,
        estimatedDays: 10,
        deliverables: ["Design files", "Handoff doc"],
        order: 2,
      },
    ];

    // Validate total = 100%
    const validation = validateMilestonePercentages(milestones);
    if (!validation.valid) {
      console.error(`Milestones must total 100%, got ${validation.total}%`);
      return;
    }

    for (const milestone of milestones) {
      await addMilestone({
        packageId,
        ...milestone,
      });
    }

    // 3. Publish
    await publishServicePackage(packageId);
  };

  return <form onSubmit={(e) => handleCreatePackage(new FormData(e.currentTarget))} />;
}
```

### Admin: Suspend/Reinstate Vendor

```typescript
import { useSuspendVendor, useReinstateVendor } from "@/vendor";

function AdminVendorManagement({ vendorId }) {
  const { suspendVendor, loading: suspending } = useSuspendVendor();
  const { reinstateVendor, loading: reinstating } = useReinstateVendor();

  const handleSuspend = async () => {
    await suspendVendor({
      vendorId,
      reason: "Violation of terms of service",
    });
  };

  const handleReinstate = async () => {
    await reinstateVendor(vendorId);
  };

  return (
    <div>
      <button onClick={handleSuspend} disabled={suspending}>
        Suspend Vendor
      </button>
      <button onClick={handleReinstate} disabled={reinstating}>
        Reinstate Vendor
      </button>
    </div>
  );
}
```

---

## Pagination Pattern

All list queries use offset-based pagination:

```typescript
const { products, fetchProducts } = useListVendorProducts(
  vendorId,
  "PUBLISHED",
  20 // limit
);

// Fetch first page
await fetchProducts(0); // offset

// Fetch next page
if (products && products.totalCount > 0) {
  const nextOffset = products.items.length;
  await fetchProducts(nextOffset);
}
```

Helper utilities:

```typescript
import {
  getNextPaginationOffset,
  getPreviousPaginationOffset,
  isLastPage,
  isFirstPage,
} from "@/vendor";

const pagination = {
  limit: 20,
  offset: 0,
  totalCount: products.totalCount,
};

if (!isLastPage(pagination)) {
  const nextOffset = getNextPaginationOffset(pagination);
  // ...fetch next page
}
```

---

## Error Handling

All mutations and queries automatically handle errors:

1. GraphQL errors are caught
2. Toast notification shown to user
3. Error state available in hook
4. Error is re-thrown for additional handling

```typescript
const { loading, error, createProduct } = useCreateProduct();

try {
  await createProduct(input);
} catch (err) {
  // Handle error further if needed
  console.error("Product creation failed", err);
}

// Or use error state
if (error) {
  <p className="text-red-500">{error}</p>;
}
```

---

## Status Values Reference

### Vendor Status
- `DRAFT` - Newly created
- `ACTIVE` - Operational
- `KYC_PENDING` - Awaiting verification
- `SUSPENDED` - Blocked by admin

### Product/Service Status
- `DRAFT` - Not visible
- `PUBLISHED` - Live
- `ARCHIVED` - Hidden

### Order Status
- `CREATED` - Placed
- `SHIPPED` - Dispatched
- `DELIVERED` - Received
- `REFUNDED` - Cancelled

### Product Type
- `PHYSICAL` - Ships goods (requires `shippingProfileId`)
- `DIGITAL` - Download (requires `downloadUrl`)

### File Upload Type
- `"product"` - Product images
- `"logo"` - Vendor logo
- `"download"` - Digital product files

---

## Type Safety

All types are fully defined in [src/types/vendor-service.ts](src/types/vendor-service.ts):

```typescript
import type {
  VendorDTO,
  ProductDTO,
  ServicePackageDTO,
  VendorOrderDTO,
  VendorDashboardDTO,
  VendorEligibilityDTO,
  UploadUrlDTO,
  CreateVendorInput,
  CreateProductInput,
  // ... and more
} from "@/vendor";
```

---

## Architecture

```
Frontend Component
       │
       ├── useHook()  ──┐
       │                 │
       │              Custom Hooks
       │              [src/hooks/vendor.ts]
       │                 │
       └─────────────────┼──────────┐
                         │          │
                  vendorService     │
                [operations.ts]     │
                         │          │
              GraphQL Queries/Mutations
                         │          │
                  GraphQL Client   │
                         │          │
                    API Gateway    │
                     [:3000]        │
                         │          │
                   Vendor Service   │
                     [:5008]        │
                         │          │
                    PostgreSQL     │
                       ├── GCS Bucket
                       └── (uploads)
                         
                 Utility Functions
              [src/lib/vendor-utils.ts]
                    │
        uploadFileAndGetUrl()
        formatPrice()
        validateMilestonePercentages()
        vendorStatusConfig
        ... etc
```

---

## Next Steps

1. **Create vendor management pages** in `src/pages/` (Vendors.tsx, VendorDashboard.tsx, etc.)
2. **Build vendor forms** in `src/components/vendors/` (CreateVendorForm, ProductForm, etc.)
3. **Add admin suspension UI** for moderators
4. **Integrate with payout & KYC systems** for compliance
5. **Add analytics & reporting** using the dashboard queries

---

For more details, see the [Vendor Service Frontend Integration Guide](../../../docs/VENDOR_INTEGRATION.md).
