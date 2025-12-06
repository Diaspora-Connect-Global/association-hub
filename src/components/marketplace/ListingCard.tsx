import { Listing } from "@/types/marketplace";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  ToggleLeft, 
  Trash2, 
  ShoppingCart,
  Package,
  Star
} from "lucide-react";

interface ListingCardProps {
  listing: Listing;
  onViewDetails: (listing: Listing) => void;
  onEdit: (listing: Listing) => void;
  onTogglePublish: (listing: Listing) => void;
  onDelete: (listing: Listing) => void;
  onViewOrders: (listing: Listing) => void;
}

const statusVariants: Record<string, "active" | "inactive" | "pending"> = {
  published: "active",
  draft: "pending",
  unpublished: "inactive",
};

export function ListingCard({
  listing,
  onViewDetails,
  onEdit,
  onTogglePublish,
  onDelete,
  onViewOrders,
}: ListingCardProps) {
  const isLowStock = listing.type === "product" && 
    !listing.unlimitedInventory && 
    listing.inventory !== undefined && 
    listing.inventory < 20;
  
  const isOutOfStock = listing.type === "product" && 
    !listing.unlimitedInventory && 
    listing.inventory === 0;

  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image */}
      <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-muted to-muted/50">
        {listing.mainImage ? (
          <img src={listing.mainImage} alt={listing.title} className="h-full w-full object-cover" />
        ) : (
          <span className="text-6xl">{listing.mainImageEmoji || "📦"}</span>
        )}
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium capitalize text-foreground">
            {listing.type}
          </span>
        </div>
        <div className="absolute right-3 top-3 flex flex-col gap-1 items-end">
          <StatusBadge variant={statusVariants[listing.status]}>
            {listing.status}
          </StatusBadge>
          {listing.isFeatured && (
            <span className="flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-xs font-medium text-primary-foreground">
              <Star className="h-3 w-3" />
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-1 font-semibold text-foreground line-clamp-1">
          {listing.title}
        </h3>
        <p className="mb-3 text-sm text-muted-foreground">
          {listing.category}
        </p>

        {/* Price & Stock */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">
            {listing.currency === "USD" ? "$" : listing.currency === "EUR" ? "€" : "₵"}
            {listing.price.toFixed(2)}
          </span>
          {listing.type === "product" && (
            <span
              className={`text-sm ${
                isOutOfStock
                  ? "text-destructive"
                  : isLowStock
                  ? "text-warning"
                  : "text-muted-foreground"
              }`}
            >
              {listing.unlimitedInventory 
                ? "Unlimited" 
                : isOutOfStock 
                  ? "Out of stock" 
                  : `${listing.inventory} in stock`}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <ShoppingCart className="h-4 w-4" />
            <span>{listing.orders} orders</span>
          </div>
          {listing.allowReviews && listing.reviewCount > 0 && (
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span>{listing.averageRating?.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">
            {listing.createdAt}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onViewDetails(listing)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(listing)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Listing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTogglePublish(listing)}>
                <ToggleLeft className="mr-2 h-4 w-4" />
                {listing.status === "published" ? "Unpublish" : "Publish"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewOrders(listing)}>
                <Package className="mr-2 h-4 w-4" />
                View Orders
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(listing)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Listing
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
