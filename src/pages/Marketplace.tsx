import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useT } from "@/hooks/useT";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, ShoppingBag, BarChart3, RefreshCw } from "lucide-react";
import { Listing, ListingFormData } from "@/types/marketplace";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { CreateEditListingModal } from "@/components/marketplace/CreateEditListingModal";
import { ListingDetailsModal } from "@/components/marketplace/ListingDetailsModal";
import { OrdersDrawer } from "@/components/marketplace/OrdersDrawer";
import { DeleteListingModal } from "@/components/marketplace/DeleteListingModal";
import { MarketplaceAnalyticsWidget } from "@/components/marketplace/MarketplaceAnalyticsWidget";
import { toast } from "@/hooks/use-toast";
import { vendorService } from "@/services/graphql/vendor/operations";
import type { ProductDTO, ServicePackageDTO } from "@/types/vendor-service";

function mapProductToListing(p: ProductDTO): Listing {
  const status: Listing["status"] =
    p.status === "PUBLISHED" ? "published" : p.status === "ARCHIVED" ? "unpublished" : "draft";
  return {
    id: p.id,
    title: p.title,
    type: "product",
    description: p.description,
    category: p.tags?.[0] ?? "",
    tags: p.tags ?? [],
    price: p.price,
    currency: p.currency,
    inventory: p.inventoryCount,
    unlimitedInventory: p.inventoryCount === 0,
    allowPreorders: false,
    status,
    publishNow: false,
    allowReviews: false,
    isFeatured: false,
    mainImage: p.images?.[0],
    galleryImages: p.images?.slice(1) ?? [],
    orders: 0,
    revenue: 0,
    views: 0,
    reviewCount: 0,
    createdAt: new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    updatedAt: new Date(p.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  };
}

function mapServiceToListing(s: ServicePackageDTO): Listing {
  const status: Listing["status"] =
    s.status === "PUBLISHED" ? "published" : "draft";
  return {
    id: s.id,
    title: s.title,
    type: "service",
    description: s.description,
    category: s.benefits?.[0] ?? "Service",
    tags: s.benefits ?? [],
    price: s.basePrice,
    currency: s.currency,
    unlimitedInventory: true,
    allowPreorders: false,
    status,
    publishNow: false,
    allowReviews: false,
    isFeatured: false,
    galleryImages: [],
    orders: 0,
    revenue: 0,
    views: 0,
    reviewCount: 0,
    createdAt: new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    updatedAt: new Date(s.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  };
}


export default function Marketplace() {
  const location = useLocation();
  const t = useT();
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const fetchListings = useCallback(async () => {
    setListingsLoading(true);
    try {
      const [productsResult, servicesResult] = await Promise.all([
        vendorService.listVendorProducts(undefined, undefined, 100, 0),
        vendorService.listVendorServicePackages(undefined, undefined, 100, 0),
      ]);
      setListings([
        ...(productsResult.items ?? []).map(mapProductToListing),
        ...(servicesResult.items ?? []).map(mapServiceToListing),
      ]);
    } catch {
      setListings([]);
    } finally {
      setListingsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchListings();
  }, [fetchListings]);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [ordersDrawerOpen, setOrdersDrawerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);

  // Filter and sort listings
  const filteredListings = listings
    .filter((listing) => {
      const matchesSearch = 
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || listing.status === statusFilter;
      const matchesType = typeFilter === "all" || listing.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  // Stats
  const activeListings = listings.filter(l => l.status === "published").length;
  const totalOrders = listings.reduce((sum, l) => sum + l.orders, 0);
  const totalRevenue = listings.reduce((sum, l) => sum + l.revenue, 0);
  const lowStockItems = listings.filter(l => 
    l.type === "product" && !l.unlimitedInventory && (l.inventory || 0) < 20
  ).length;

  // Handlers
  const handleViewDetails = (listing: Listing) => {
    setSelectedListing(listing);
    setDetailsDrawerOpen(true);
  };

  const handleEdit = (listing: Listing) => {
    setEditingListing(listing);
    setCreateModalOpen(true);
  };

  const handleTogglePublish = (listing: Listing) => {
    toast({
      title: listing.status === "published" ? "Listing Unpublished" : "Listing Published",
      description: listing.status === "published" 
        ? "Your listing is now hidden from users." 
        : "Your listing is now live in the marketplace.",
    });
  };

  const handleViewOrders = (listing: Listing) => {
    setSelectedListing(listing);
    setOrdersDrawerOpen(true);
  };

  const handleDelete = (listing: Listing) => {
    setListingToDelete(listing);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    toast({
      title: "Listing Deleted",
      description: "The listing has been permanently deleted.",
    });
    setDeleteModalOpen(false);
    setListingToDelete(null);
  };

  const handleCreateSubmit = (data: ListingFormData) => {
    toast({
      title: editingListing ? "Listing Updated" : "Listing Created",
      description: editingListing 
        ? "Your changes have been saved."
        : data.publishNow 
          ? "Your listing is now live!" 
          : "Listing saved as draft.",
    });
    setEditingListing(null);
  };

  return (
    <AdminLayout title={t.marketplaceTitle} subtitle={t.marketplaceSubtitle}>
      {/* Top Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.searchListings}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder={t.statusPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allStatus}</SelectItem>
              <SelectItem value="published">{t.published}</SelectItem>
              <SelectItem value="draft">{t.draft}</SelectItem>
              <SelectItem value="unpublished">{t.unpublished}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={t.typePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allTypes}</SelectItem>
              <SelectItem value="product">{t.product}</SelectItem>
              <SelectItem value="service">{t.service}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t.sortPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t.newestFirst}</SelectItem>
              <SelectItem value="oldest">{t.oldestFirst}</SelectItem>
              <SelectItem value="price-low">{t.priceLowToHigh}</SelectItem>
              <SelectItem value="price-high">{t.priceHighToLow}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          {t.addProductService}
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">{t.activeListings}</p>
          <p className="text-2xl font-bold text-foreground">{activeListings}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">{t.totalOrders}</p>
          <p className="text-2xl font-bold text-primary">{totalOrders}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">{t.revenueAllTime}</p>
          <p className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">{t.lowStockItems}</p>
          <p className="text-2xl font-bold text-foreground">{lowStockItems}</p>
        </div>
      </div>

      {/* Tabs for Listings & Analytics */}
      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="listings" className="gap-2">
            <ShoppingBag className="h-4 w-4" />
            {t.listings}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            {t.analytics}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings">
          {/* Listings Grid */}
          {listingsLoading ? (
            <div className="flex items-center justify-center py-16 border border-dashed border-border rounded-lg">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredListings.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredListings.map((listing, index) => (
                <div
                  key={listing.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ListingCard
                    listing={listing}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEdit}
                    onTogglePublish={handleTogglePublish}
                    onDelete={handleDelete}
                    onViewOrders={handleViewOrders}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-border rounded-lg">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Products or Services</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first product or service to your association's marketplace.
              </p>
              <Button onClick={() => setCreateModalOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Product/Service
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <MarketplaceAnalyticsWidget />
        </TabsContent>
      </Tabs>

      {/* Modals & Drawers */}
      <CreateEditListingModal
        open={createModalOpen}
        onOpenChange={(open) => {
          setCreateModalOpen(open);
          if (!open) setEditingListing(null);
        }}
        listing={editingListing}
        onSubmit={handleCreateSubmit}
      />

      <ListingDetailsModal
        open={detailsDrawerOpen}
        onOpenChange={setDetailsDrawerOpen}
        listing={selectedListing}
        onEdit={handleEdit}
        onTogglePublish={handleTogglePublish}
        onViewOrders={handleViewOrders}
        onDelete={handleDelete}
      />

      <OrdersDrawer
        open={ordersDrawerOpen}
        onOpenChange={setOrdersDrawerOpen}
        listing={selectedListing}
      />

      <DeleteListingModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        listing={listingToDelete}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
