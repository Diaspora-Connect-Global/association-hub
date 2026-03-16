# Vendor Service Integration — Quick Reference

## 📍 Files & What They Do

```
src/
├── types/
│   └── vendor-service.ts              ← All TypeScript types & interfaces
├── services/graphql/vendor/
│   └── operations.ts                  ← GraphQL queries/mutations + API client
├── hooks/
│   └── vendor.ts                      ← React hooks for components
├── lib/
│   └── vendor-utils.ts                ← Helper functions & utilities
└── vendor/
    ├── index.ts                       ← Barrel exports (import everything here)
    ├── README.md                      ← Complete guide & architecture
    ├── EXAMPLES.md                    ← 10 copy-paste code examples
    └── CHEATSHEET.ts                  ← Quick reference
```

---

## 🎯 Basic Usage

### Option 1: Single-line import (recommended)
```typescript
import { useGetMyVendor, useCreateVendor, uploadFileAndGetUrl } from "@/vendor";
```

### Option 2: Specific imports
```typescript
import { useGetMyVendor } from "@/hooks/vendor";
import type { VendorDTO } from "@/types/vendor-service";
```

### Option 3: Direct API calls
```typescript
import { vendorService } from "@/services/graphql/vendor/operations";

const vendor = await vendorService.getMyVendor();
```

---

## 📚 Go-To Resources

| Need | File | What's Inside |
|------|------|---------------|
| **Copy-paste code** | [EXAMPLES.md](src/vendor/EXAMPLES.md) | 10 complete examples |
| **API reference** | [README.md](src/vendor/README.md) | All operations documented |
| **Type definitions** | [vendor-service.ts](src/types/vendor-service.ts) | All TypeScript interfaces |
| **Custom hooks** | [vendor.ts](src/hooks/vendor.ts) | 22 pre-made hooks |
| **Utilities** | [vendor-utils.ts](src/lib/vendor-utils.ts) | Helper functions |

---

## 🚀 Common Tasks

### Check if user is a vendor
```typescript
const { vendor, fetchMyVendor } = useGetMyVendor();

useEffect(() => { fetchMyVendor(); }, [fetchMyVendor]);
```

### Create a vendor
```typescript
const { createVendor } = useCreateVendor();

await createVendor({
  vendorType: "INDIVIDUAL",
  displayName: "My Shop",
  description: "Description here"
});
```

### Upload images
```typescript
import { uploadMultipleFiles } from "@/vendor";

const urls = await uploadMultipleFiles(vendorId, imageFiles, "product");
```

### Create product
```typescript
const { createProduct } = useCreateProduct();

await createProduct({
  vendorId,
  title: "Product Name",
  price: 50,
  currency: "GHS",
  images: urls,
  // ... more fields
});
```

### Publish product
```typescript
const { publishProduct } = usePublishProduct();

await publishProduct(productId); // DRAFT → PUBLISHED
```

### Request payout
```typescript
const { requestPayout } = useRequestPayout();

await requestPayout({
  vendorId,
  amount: 500,
  currency: "GHS"
});
```

---

## 📊 All Available Hooks

### Fetch Hooks (read data)
- `useGetMyVendor` — Get your vendor profile
- `useGetVendor(vendorId)` — Get any vendor
- `useGetVendorDashboard(vendorId?)` — Get analytics
- `useGetVendorEligibility(vendorId?)` — Check compliance
- `useListVendorProducts(vendorId?, status?, limit)` — List products
- `useListVendorServicePackages(vendorId?, status?, limit)` — List services
- `useListVendorOrders(vendorId?, status?, limit)` — List orders

### Mutation Hooks (write data)
- `useCreateVendor` — Create vendor profile
- `useRequestVendorUploadUrl` — Get upload URL
- `useUploadFileToGCS` — Upload file to GCS
- `useCreateProduct` — Create product (DRAFT)
- `useUpdateProduct` — Update product
- `usePublishProduct` — Publish product (DRAFT → PUBLISHED)
- `useDeleteProduct` — Delete product
- `useCreateServicePackage` — Create service
- `useAddMilestone` — Add milestone to service
- `usePublishServicePackage` — Publish service
- `useRequestPayout` — Request payout
- `useSuspendVendor` — Admin: suspend vendor
- `useReinstateVendor` — Admin: reinstate vendor

---

## 🛠️ Utilities

### File Upload
```typescript
import { uploadFileAndGetUrl, uploadMultipleFiles } from "@/vendor";

const logoUrl = await uploadFileAndGetUrl(vendorId, logoFile, "logo");
const imageUrls = await uploadMultipleFiles(vendorId, imageFiles, "product");
```

### Formatting
```typescript
import { formatPrice, currencySymbols } from "@/vendor";

formatPrice(100, "GHS");  // "₵100.00"
currencySymbols["GHS"];   // "₵"
```

### Status Config
```typescript
import { vendorStatusConfig, productStatusConfig, orderStatusConfig } from "@/vendor";

const config = vendorStatusConfig["ACTIVE"];
// { label: "Active", color: "green", icon: "✅" }
```

### Pagination
```typescript
import {
  getNextPaginationOffset,
  getPreviousPaginationOffset,
  isLastPage,
  isFirstPage
} from "@/vendor";
```

### Validation
```typescript
import {
  checkEligibilityFromResponse,
  validateMilestonePercentages,
  canEditProduct
} from "@/vendor";

const check = checkEligibilityFromResponse(canSell, canReceivePayout, ...);
const valid = validateMilestonePercentages(milestones);
```

---

## 🎯 Hook Pattern

All hooks follow this pattern:

```typescript
// Fetch hook
const { data, loading, error, fetchData } = useHook();

// Use effect to fetch on mount
useEffect(() => { fetchData(); }, [fetchData]);

// Show UI based on state
if (loading) return <Loading />;
if (error) return <Error message={error} />;
return <Component data={data} />;

// Mutation hook
const { loading, error, mutate } = useMutationHook();

// Call mutation
try {
  await mutate(input);
} catch (err) {
  // Handle error
}
```

**All hooks automatically:**
- Show toast notifications on success/error
- Set loading states
- Handle errors gracefully
- Provide refetch functions

---

## 📖 Documentation Files

| File | Content |
|------|---------|
| [README.md](src/vendor/README.md) | 350+ lines of detailed guide |
| [EXAMPLES.md](src/vendor/EXAMPLES.md) | 250+ lines of code examples |
| [vendor-service.ts](src/types/vendor-service.ts) | Type definitions with comments |
| [operations.ts](src/services/graphql/vendor/operations.ts) | GraphQL operations |
| [vendor.ts](src/hooks/vendor.ts) | Hooks with documentation |

---

## ⚡ Common Errors & Solutions

| Error | Solution |
|-------|----------|
| `"Vendor not found"` | User hasn't created vendor profile yet |
| `"Not eligible to sell"` | Check `getVendorEligibility` & complete KYC |
| `"Cannot publish"` | Product must be in DRAFT status |
| `"Unauthorized"` | Missing/invalid JWT token |
| `"File upload failed"` | Check file size and type |

---

## 🔗 Import Paths

```typescript
// Types
import type { VendorDTO, ProductDTO } from "@/types/vendor-service";

// Service
import { vendorService } from "@/services/graphql/vendor/operations";

// Hooks
import { useGetMyVendor, useCreateProduct } from "@/hooks/vendor";

// Utils
import { uploadFileAndGetUrl, formatPrice } from "@/lib/vendor-utils";

// Or use barrel export (easiest):
import {
  VendorDTO, ProductDTO,
  useGetMyVendor, useCreateProduct,
  uploadFileAndGetUrl, formatPrice
} from "@/vendor";
```

---

## ✨ Next Steps

1. **Read** [EXAMPLES.md](src/vendor/EXAMPLES.md) for copy-paste code
2. **Review** [README.md](src/vendor/README.md) for full API docs
3. **Start** building vendor pages using the hooks
4. **Reference** this file for quick lookups

---

**Questions?** Check the relevant documentation file above.

Happy coding! 🚀
