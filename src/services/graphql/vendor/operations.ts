// Vendor Service GraphQL Operations
import { getGraphQLClient } from "@/core/graphql-client";
import type {
  VendorDTO,
  ProductDTO,
  ServicePackageDTO,
  VendorOrderDTO,
  VendorDashboardDTO,
  VendorEligibilityDTO,
  UploadUrlDTO,
  PayoutRequestDTO,
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
} from "@/types/vendor-service";

// ============ QUERIES ============

const GET_VENDOR = /* GraphQL */ `
  query GetVendor($vendorId: String!) {
    getVendor(vendorId: $vendorId) {
      id
      userId
      displayName
      description
      type
      status
      logoUrl
      rating
      completedOrders
      capabilities {
        type
        enabled
      }
      payoutAccounts {
        id
        provider
        currency
        isDefault
        isVerified
        createdAt
        verifiedAt
      }
      createdAt
      updatedAt
    }
  }
`;

const GET_MY_VENDOR = /* GraphQL */ `
  query GetMyVendor {
    getMyVendor {
      id
      userId
      displayName
      description
      type
      status
      logoUrl
      rating
      completedOrders
      capabilities {
        type
        enabled
      }
      payoutAccounts {
        id
        provider
        currency
        isDefault
        isVerified
        createdAt
        verifiedAt
      }
      createdAt
      updatedAt
    }
  }
`;

const GET_VENDOR_DASHBOARD = /* GraphQL */ `
  query GetVendorDashboard($vendorId: String) {
    getVendorDashboard(vendorId: $vendorId) {
      id
      userId
      displayName
      totalSales
      totalEarnings
      averageRating
      totalRatings
      completedOrders
      status
    }
  }
`;

const GET_VENDOR_ELIGIBILITY = /* GraphQL */ `
  query GetVendorEligibility($vendorId: String) {
    getVendorEligibility(vendorId: $vendorId) {
      vendorId
      canSell
      canReceivePayout
      isCompliant
      status
      payoutAccountCount
      verifiedPayoutAccounts
      activeSuspensionCount
    }
  }
`;

const LIST_VENDOR_PRODUCTS = /* GraphQL */ `
  query ListVendorProducts(
    $vendorId: String
    $status: String
    $limit: Int
    $offset: Int
  ) {
    listVendorProducts(
      vendorId: $vendorId
      status: $status
      limit: $limit
      offset: $offset
    ) {
      totalCount
      items {
        id
        vendorId
        title
        description
        price
        currency
        inventoryCount
        productType
        status
        shippingProfileId
        downloadUrl
        images
        tags
        createdAt
        updatedAt
      }
    }
  }
`;

const LIST_VENDOR_SERVICE_PACKAGES = /* GraphQL */ `
  query ListVendorServicePackages(
    $vendorId: String
    $status: String
    $limit: Int
    $offset: Int
  ) {
    listVendorServicePackages(
      vendorId: $vendorId
      status: $status
      limit: $limit
      offset: $offset
    ) {
      totalCount
      items {
        id
        vendorId
        title
        description
        basePrice
        currency
        estimatedDuration
        status
        benefits
        milestones {
          id
          title
          description
          percentageOfTotal
          estimatedDays
          deliverables
          order
        }
        createdAt
        updatedAt
      }
    }
  }
`;

const LIST_VENDOR_ORDERS = /* GraphQL */ `
  query ListVendorOrders(
    $vendorId: String
    $status: String
    $limit: Int
    $offset: Int
  ) {
    listVendorOrders(
      vendorId: $vendorId
      status: $status
      limit: $limit
      offset: $offset
    ) {
      totalCount
      items {
        id
        vendorId
        buyerId
        status
        totalAmount
        currency
        createdAt
        updatedAt
      }
    }
  }
`;

// ============ MUTATIONS ============

const CREATE_VENDOR = /* GraphQL */ `
  mutation CreateVendor(
    $vendorType: String!
    $displayName: String!
    $description: String!
  ) {
    createVendor(
      vendorType: $vendorType
      displayName: $displayName
      description: $description
    )
  }
`;

const REQUEST_VENDOR_UPLOAD_URL = /* GraphQL */ `
  mutation RequestVendorUploadUrl(
    $vendorId: String!
    $fileName: String!
    $contentType: String!
    $fileType: String!
  ) {
    requestVendorUploadUrl(
      vendorId: $vendorId
      fileName: $fileName
      contentType: $contentType
      fileType: $fileType
    ) {
      uploadUrl
      readUrl
      objectKey
    }
  }
`;

const CREATE_PRODUCT = /* GraphQL */ `
  mutation CreateProduct(
    $vendorId: String!
    $title: String!
    $description: String!
    $price: Float!
    $currency: String!
    $inventoryCount: Int!
    $productType: String!
    $shippingProfileId: String
    $downloadUrl: String
    $images: [String!]
    $tags: [String!]
  ) {
    createProduct(
      vendorId: $vendorId
      title: $title
      description: $description
      price: $price
      currency: $currency
      inventoryCount: $inventoryCount
      productType: $productType
      shippingProfileId: $shippingProfileId
      downloadUrl: $downloadUrl
      images: $images
      tags: $tags
    )
  }
`;

const UPDATE_PRODUCT = /* GraphQL */ `
  mutation UpdateProduct(
    $productId: String!
    $title: String!
    $description: String!
    $price: Float!
    $inventoryCount: Int!
    $images: [String!]
    $tags: [String!]
  ) {
    updateProduct(
      productId: $productId
      title: $title
      description: $description
      price: $price
      inventoryCount: $inventoryCount
      images: $images
      tags: $tags
    )
  }
`;

const PUBLISH_PRODUCT = /* GraphQL */ `
  mutation PublishProduct($productId: String!) {
    publishProduct(productId: $productId)
  }
`;

const DELETE_PRODUCT = /* GraphQL */ `
  mutation DeleteProduct($productId: String!) {
    deleteProduct(productId: $productId)
  }
`;

const CREATE_SERVICE_PACKAGE = /* GraphQL */ `
  mutation CreateServicePackage(
    $vendorId: String!
    $title: String!
    $description: String!
    $basePrice: Float!
    $currency: String!
    $estimatedDuration: Int!
    $benefits: [String!]
  ) {
    createServicePackage(
      vendorId: $vendorId
      title: $title
      description: $description
      basePrice: $basePrice
      currency: $currency
      estimatedDuration: $estimatedDuration
      benefits: $benefits
    )
  }
`;

const ADD_MILESTONE = /* GraphQL */ `
  mutation AddMilestone(
    $packageId: String!
    $title: String!
    $description: String!
    $percentageOfTotal: Float!
    $estimatedDays: Int!
    $deliverables: [String!]!
    $order: Int!
  ) {
    addMilestone(
      packageId: $packageId
      title: $title
      description: $description
      percentageOfTotal: $percentageOfTotal
      estimatedDays: $estimatedDays
      deliverables: $deliverables
      order: $order
    )
  }
`;

const PUBLISH_SERVICE_PACKAGE = /* GraphQL */ `
  mutation PublishServicePackage($packageId: String!) {
    publishServicePackage(packageId: $packageId)
  }
`;

const REQUEST_PAYOUT = /* GraphQL */ `
  mutation RequestPayout(
    $vendorId: String!
    $amount: Float!
    $currency: String!
  ) {
    requestPayout(vendorId: $vendorId, amount: $amount, currency: $currency)
  }
`;

const SUSPEND_VENDOR = /* GraphQL */ `
  mutation SuspendVendor($vendorId: String!, $reason: String!) {
    suspendVendor(vendorId: $vendorId, reason: $reason)
  }
`;

const REINSTATE_VENDOR = /* GraphQL */ `
  mutation ReinstateVendor($vendorId: String!) {
    reinstateVendor(vendorId: $vendorId)
  }
`;

// ============ API FUNCTIONS ============

export const vendorService = {
  // Queries
  async getVendor(vendorId: string): Promise<VendorDTO> {
    const client = getGraphQLClient();
    const { getVendor } = await client.request<{ getVendor: VendorDTO }>(
      GET_VENDOR,
      { vendorId }
    );
    return getVendor;
  },

  async getMyVendor(): Promise<VendorDTO | null> {
    const client = getGraphQLClient();
    const { getMyVendor } = await client.request<{ getMyVendor: VendorDTO | null }>(
      GET_MY_VENDOR
    );
    return getMyVendor;
  },

  async getVendorDashboard(vendorId?: string): Promise<VendorDashboardDTO> {
    const client = getGraphQLClient();
    const { getVendorDashboard } = await client.request<{
      getVendorDashboard: VendorDashboardDTO;
    }>(GET_VENDOR_DASHBOARD, { vendorId });
    return getVendorDashboard;
  },

  async getVendorEligibility(vendorId?: string): Promise<VendorEligibilityDTO> {
    const client = getGraphQLClient();
    const { getVendorEligibility } = await client.request<{
      getVendorEligibility: VendorEligibilityDTO;
    }>(GET_VENDOR_ELIGIBILITY, { vendorId });
    return getVendorEligibility;
  },

  async listVendorProducts(
    vendorId?: string,
    status?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<ProductListPaginatedDTO> {
    const client = getGraphQLClient();
    const { listVendorProducts } = await client.request<{
      listVendorProducts: ProductListPaginatedDTO;
    }>(LIST_VENDOR_PRODUCTS, { vendorId, status, limit, offset });
    return listVendorProducts;
  },

  async listVendorServicePackages(
    vendorId?: string,
    status?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<ServicePackageListPaginatedDTO> {
    const client = getGraphQLClient();
    const { listVendorServicePackages } = await client.request<{
      listVendorServicePackages: ServicePackageListPaginatedDTO;
    }>(LIST_VENDOR_SERVICE_PACKAGES, { vendorId, status, limit, offset });
    return listVendorServicePackages;
  },

  async listVendorOrders(
    vendorId?: string,
    status?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<VendorOrderListPaginatedDTO> {
    const client = getGraphQLClient();
    const { listVendorOrders } = await client.request<{
      listVendorOrders: VendorOrderListPaginatedDTO;
    }>(LIST_VENDOR_ORDERS, { vendorId, status, limit, offset });
    return listVendorOrders;
  },

  // Mutations
  async createVendor(input: CreateVendorInput): Promise<string> {
    const client = getGraphQLClient();
    const { createVendor } = await client.request<{ createVendor: string }>(
      CREATE_VENDOR,
      {
        vendorType: input.vendorType,
        displayName: input.displayName,
        description: input.description,
      }
    );
    return createVendor;
  },

  async requestVendorUploadUrl(input: RequestVendorUploadUrlInput): Promise<UploadUrlDTO> {
    const client = getGraphQLClient();
    const { requestVendorUploadUrl } = await client.request<{
      requestVendorUploadUrl: UploadUrlDTO;
    }>(REQUEST_VENDOR_UPLOAD_URL, {
      vendorId: input.vendorId,
      fileName: input.fileName,
      contentType: input.contentType,
      fileType: input.fileType,
    });
    return requestVendorUploadUrl;
  },

  async uploadFileToGCS(uploadUrl: string, file: File): Promise<void> {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    }
  },

  async createProduct(input: CreateProductInput): Promise<string> {
    const client = getGraphQLClient();
    const { createProduct } = await client.request<{ createProduct: string }>(
      CREATE_PRODUCT,
      {
        vendorId: input.vendorId,
        title: input.title,
        description: input.description,
        price: input.price,
        currency: input.currency,
        inventoryCount: input.inventoryCount,
        productType: input.productType,
        shippingProfileId: input.shippingProfileId,
        downloadUrl: input.downloadUrl,
        images: input.images,
        tags: input.tags,
      }
    );
    return createProduct;
  },

  async updateProduct(input: UpdateProductInput): Promise<boolean> {
    const client = getGraphQLClient();
    const { updateProduct } = await client.request<{ updateProduct: boolean }>(
      UPDATE_PRODUCT,
      {
        productId: input.productId,
        title: input.title,
        description: input.description,
        price: input.price,
        inventoryCount: input.inventoryCount,
        images: input.images,
        tags: input.tags,
      }
    );
    return updateProduct;
  },

  async publishProduct(productId: string): Promise<boolean> {
    const client = getGraphQLClient();
    const { publishProduct } = await client.request<{ publishProduct: boolean }>(
      PUBLISH_PRODUCT,
      { productId }
    );
    return publishProduct;
  },

  async deleteProduct(productId: string): Promise<boolean> {
    const client = getGraphQLClient();
    const { deleteProduct } = await client.request<{ deleteProduct: boolean }>(
      DELETE_PRODUCT,
      { productId }
    );
    return deleteProduct;
  },

  async createServicePackage(input: CreateServicePackageInput): Promise<string> {
    const client = getGraphQLClient();
    const { createServicePackage } = await client.request<{
      createServicePackage: string;
    }>(CREATE_SERVICE_PACKAGE, {
      vendorId: input.vendorId,
      title: input.title,
      description: input.description,
      basePrice: input.basePrice,
      currency: input.currency,
      estimatedDuration: input.estimatedDuration,
      benefits: input.benefits,
    });
    return createServicePackage;
  },

  async addMilestone(input: AddMilestoneInput): Promise<string> {
    const client = getGraphQLClient();
    const { addMilestone } = await client.request<{ addMilestone: string }>(
      ADD_MILESTONE,
      {
        packageId: input.packageId,
        title: input.title,
        description: input.description,
        percentageOfTotal: input.percentageOfTotal,
        estimatedDays: input.estimatedDays,
        deliverables: input.deliverables,
        order: input.order,
      }
    );
    return addMilestone;
  },

  async publishServicePackage(packageId: string): Promise<boolean> {
    const client = getGraphQLClient();
    const { publishServicePackage } = await client.request<{
      publishServicePackage: boolean;
    }>(PUBLISH_SERVICE_PACKAGE, { packageId });
    return publishServicePackage;
  },

  async requestPayout(input: RequestPayoutInput): Promise<string> {
    const client = getGraphQLClient();
    const { requestPayout } = await client.request<{ requestPayout: string }>(
      REQUEST_PAYOUT,
      {
        vendorId: input.vendorId,
        amount: input.amount,
        currency: input.currency,
      }
    );
    return requestPayout;
  },

  async suspendVendor(input: SuspendVendorInput): Promise<boolean> {
    const client = getGraphQLClient();
    const { suspendVendor } = await client.request<{ suspendVendor: boolean }>(
      SUSPEND_VENDOR,
      {
        vendorId: input.vendorId,
        reason: input.reason,
      }
    );
    return suspendVendor;
  },

  async reinstateVendor(vendorId: string): Promise<boolean> {
    const client = getGraphQLClient();
    const { reinstateVendor } = await client.request<{ reinstateVendor: boolean }>(
      REINSTATE_VENDOR,
      { vendorId }
    );
    return reinstateVendor;
  },
};
