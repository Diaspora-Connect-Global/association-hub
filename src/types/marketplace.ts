export type ListingType = "product" | "service";
export type ListingStatus = "published" | "draft" | "unpublished";
export type PaymentStatus = "paid" | "pending" | "refunded";
export type FulfillmentStatus = "fulfilled" | "pending" | "cancelled";

export interface Listing {
  id: string;
  title: string;
  type: ListingType;
  description: string;
  category: string;
  tags: string[];
  price: number;
  currency: string;
  inventory?: number;
  unlimitedInventory: boolean;
  allowPreorders: boolean;
  status: ListingStatus;
  publishNow: boolean;
  allowReviews: boolean;
  isFeatured: boolean;
  mainImage?: string;
  mainImageEmoji?: string;
  galleryImages: string[];
  orders: number;
  revenue: number;
  views: number;
  averageRating?: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  listingId: string;
  listingTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  quantity: number;
  totalAmount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  orderDate: string;
  // Escrow fields
  isEscrow?: boolean;
  escrowStatus?: "held" | "partially_released" | "fully_released" | "disputed" | "refunded";
  escrowHeldAmount?: number;
  escrowReleasedAmount?: number;
  vendorId?: string;
  vendorName?: string;
}

export interface Review {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  createdAt: string;
  isVisible: boolean;
}

export interface ListingFormData {
  title: string;
  type: ListingType;
  description: string;
  category: string;
  tags: string[];
  mainImage?: File | null;
  galleryImages: File[];
  price: number;
  currency: string;
  inventory: number;
  unlimitedInventory: boolean;
  allowPreorders: boolean;
  publishNow: boolean;
  allowReviews: boolean;
  isFeatured: boolean;
}
