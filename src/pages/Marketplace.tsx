import { useState, useEffect } from "react";
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
import { PlusCircle, Search, ShoppingBag, BarChart3 } from "lucide-react";
import { Listing, ListingFormData } from "@/types/marketplace";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { CreateEditListingModal } from "@/components/marketplace/CreateEditListingModal";
import { ListingDetailsModal } from "@/components/marketplace/ListingDetailsModal";
import { OrdersDrawer } from "@/components/marketplace/OrdersDrawer";
import { DeleteListingModal } from "@/components/marketplace/DeleteListingModal";
import { MarketplaceAnalyticsWidget } from "@/components/marketplace/MarketplaceAnalyticsWidget";
import { toast } from "@/hooks/use-toast";

// Mock data
const mockListings: Listing[] = [
  {
    id: "1",
    title: "Ghana Tech Community T-Shirt",
    type: "product",
    description: "Premium quality cotton t-shirt with the official Ghana Tech Community logo. Available in multiple sizes.",
    category: "Clothing",
    tags: ["apparel", "merchandise", "community"],
    price: 25,
    currency: "USD",
    inventory: 150,
    unlimitedInventory: false,
    allowPreorders: false,
    status: "published",
    publishNow: true,
    allowReviews: true,
    isFeatured: true,
    mainImageEmoji: "👕",
    galleryImages: [],
    orders: 42,
    revenue: 1050,
    views: 890,
    averageRating: 4.8,
    reviewCount: 28,
    createdAt: "Nov 10, 2024",
    updatedAt: "Dec 1, 2024",
  },
  {
    id: "2",
    title: "Business Consultation (1 Hour)",
    type: "service",
    description: "One-on-one business consultation with experienced mentors. Get personalized advice for your venture.",
    category: "Consulting",
    tags: ["business", "mentorship", "professional"],
    price: 100,
    currency: "USD",
    unlimitedInventory: true,
    allowPreorders: true,
    status: "published",
    publishNow: true,
    allowReviews: true,
    isFeatured: false,
    mainImageEmoji: "💼",
    galleryImages: [],
    orders: 18,
    revenue: 1800,
    views: 456,
    averageRating: 4.9,
    reviewCount: 12,
    createdAt: "Oct 22, 2024",
    updatedAt: "Nov 15, 2024",
  },
  {
    id: "3",
    title: "Annual Membership Pin",
    type: "product",
    description: "Exclusive membership pin for 2024 members. Limited edition collectible.",
    category: "Accessories",
    tags: ["collectible", "membership", "exclusive"],
    price: 15,
    currency: "USD",
    inventory: 200,
    unlimitedInventory: false,
    allowPreorders: false,
    status: "published",
    publishNow: true,
    allowReviews: true,
    isFeatured: false,
    mainImageEmoji: "📌",
    galleryImages: [],
    orders: 89,
    revenue: 1335,
    views: 1200,
    averageRating: 4.7,
    reviewCount: 45,
    createdAt: "Sep 15, 2024",
    updatedAt: "Oct 20, 2024",
  },
  {
    id: "4",
    title: "Mentorship Program Access",
    type: "service",
    description: "6-month mentorship program with industry experts. Includes weekly sessions and resources.",
    category: "Training",
    tags: ["education", "mentorship", "career"],
    price: 250,
    currency: "USD",
    unlimitedInventory: true,
    allowPreorders: true,
    status: "draft",
    publishNow: false,
    allowReviews: true,
    isFeatured: false,
    mainImageEmoji: "🎓",
    galleryImages: [],
    orders: 12,
    revenue: 3000,
    views: 320,
    reviewCount: 0,
    createdAt: "Dec 01, 2024",
    updatedAt: "Dec 01, 2024",
  },
  {
    id: "5",
    title: "Cultural Artifacts Collection",
    type: "product",
    description: "Handcrafted cultural artifacts from local artisans. Each piece tells a unique story.",
    category: "Art",
    tags: ["art", "culture", "handmade"],
    price: 75,
    currency: "USD",
    inventory: 0,
    unlimitedInventory: false,
    allowPreorders: true,
    status: "unpublished",
    publishNow: false,
    allowReviews: true,
    isFeatured: false,
    mainImageEmoji: "🎨",
    galleryImages: [],
    orders: 35,
    revenue: 2625,
    views: 780,
    averageRating: 4.6,
    reviewCount: 18,
    createdAt: "Aug 30, 2024",
    updatedAt: "Nov 10, 2024",
  },
];

export default function Marketplace() {
  const location = useLocation();
  const t = useT();
  const [listings] = useState<Listing[]>(mockListings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

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
    <AdminLayout title="Marketplace" subtitle="Manage your association's products and services">
      {/* Top Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="unpublished">Unpublished</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="service">Service</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Product/Service
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active Listings</p>
          <p className="text-2xl font-bold text-foreground">{activeListings}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-bold text-primary">{totalOrders}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Revenue (All Time)</p>
          <p className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Low Stock Items</p>
          <p className="text-2xl font-bold text-foreground">{lowStockItems}</p>
        </div>
      </div>

      {/* Tabs for Listings & Analytics */}
      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="listings" className="gap-2">
            <ShoppingBag className="h-4 w-4" />
            Listings
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings">
          {/* Listings Grid */}
          {filteredListings.length > 0 ? (
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
