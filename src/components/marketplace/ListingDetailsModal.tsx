import { Listing } from "@/types/marketplace";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Edit, 
  ToggleLeft, 
  Trash2, 
  ShoppingCart,
  Eye,
  DollarSign,
  Package,
  Star,
  MessageSquare
} from "lucide-react";

interface ListingDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: Listing | null;
  onEdit: (listing: Listing) => void;
  onTogglePublish: (listing: Listing) => void;
  onViewOrders: (listing: Listing) => void;
  onDelete: (listing: Listing) => void;
}

const statusVariants: Record<string, "active" | "inactive" | "pending"> = {
  published: "active",
  draft: "pending",
  unpublished: "inactive",
};

export function ListingDetailsModal({
  open,
  onOpenChange,
  listing,
  onEdit,
  onTogglePublish,
  onViewOrders,
  onDelete,
}: ListingDetailsModalProps) {
  if (!listing) return null;

  const currencySymbol = listing.currency === "USD" ? "$" : listing.currency === "EUR" ? "€" : "₵";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Listing Details</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 pb-6">
          <div className="mt-4 space-y-6">
            {/* Image */}
            <div className="relative h-48 rounded-lg overflow-hidden bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              {listing.mainImage ? (
                <img src={listing.mainImage} alt={listing.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-7xl">{listing.mainImageEmoji || "📦"}</span>
              )}
            </div>

            {/* Header Info */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-semibold text-foreground">{listing.title}</h2>
                <StatusBadge variant={statusVariants[listing.status]}>
                  {listing.status}
                </StatusBadge>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">{listing.type}</Badge>
                <Badge variant="secondary">{listing.category}</Badge>
                {listing.isFeatured && (
                  <Badge className="bg-primary">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-foreground">
                  {currencySymbol}{listing.price.toFixed(2)}
                </span>
                {listing.type === "product" && (
                  <span className="text-sm text-muted-foreground">
                    {listing.unlimitedInventory 
                      ? "Unlimited stock" 
                      : `${listing.inventory} in stock`}
                  </span>
                )}
              </div>

              {listing.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {listing.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(listing)}>
                <Edit className="h-4 w-4 mr-1.5" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => onTogglePublish(listing)}>
                <ToggleLeft className="h-4 w-4 mr-1.5" />
                {listing.status === "published" ? "Unpublish" : "Publish"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => onViewOrders(listing)}>
                <ShoppingCart className="h-4 w-4 mr-1.5" />
                Orders
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onDelete(listing)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Delete
              </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {listing.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Statistics</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg border border-border bg-card">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Eye className="h-4 w-4" />
                        <span className="text-xs">Views</span>
                      </div>
                      <p className="text-lg font-semibold text-foreground">{listing.views}</p>
                    </div>
                    <div className="p-3 rounded-lg border border-border bg-card">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <ShoppingCart className="h-4 w-4" />
                        <span className="text-xs">Orders</span>
                      </div>
                      <p className="text-lg font-semibold text-foreground">{listing.orders}</p>
                    </div>
                    <div className="p-3 rounded-lg border border-border bg-card">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-xs">Revenue</span>
                      </div>
                      <p className="text-lg font-semibold text-foreground">
                        {currencySymbol}{listing.revenue.toLocaleString()}
                      </p>
                    </div>
                    {listing.type === "product" && (
                      <div className="p-3 rounded-lg border border-border bg-card">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Package className="h-4 w-4" />
                          <span className="text-xs">Inventory</span>
                        </div>
                        <p className="text-lg font-semibold text-foreground">
                          {listing.unlimitedInventory ? "∞" : listing.inventory}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Click "Orders" button above to view all orders</p>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4">
                {listing.allowReviews ? (
                  listing.reviewCount > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 fill-primary text-primary" />
                        <span className="text-lg font-semibold">{listing.averageRating?.toFixed(1)}</span>
                        <span className="text-muted-foreground">({listing.reviewCount} reviews)</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No reviews yet</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Reviews are disabled for this listing</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}