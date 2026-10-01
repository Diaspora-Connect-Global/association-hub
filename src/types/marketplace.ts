export type ListingType = "product" | "service";
export type ListingStatus = "published" | "draft" | "unpublished";

export interface Listing {
  id: string;
  title: string;
  type: ListingType;
  description: string;
  category: string;
  tags: string[];
  /** Integer minor units (pesewas, cents), as the API sends it — ÷100 only at display. */
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
  /** null: no data source for it yet — shown as "Not available", never as 0. */
  orders: number | null;
  revenue: number | null;
  views: number | null;
  averageRating?: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
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
