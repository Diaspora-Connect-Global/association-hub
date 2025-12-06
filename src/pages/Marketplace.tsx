import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tag, Package, MoreHorizontal, Edit, Trash2, Eye, ShoppingBag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Listing {
  id: string;
  title: string;
  type: "product" | "service";
  category: string;
  price: number;
  currency: string;
  stock: number | null;
  orders: number;
  status: "published" | "draft" | "suspended";
  image: string;
  createdAt: string;
}

const listings: Listing[] = [
  {
    id: "1",
    title: "Ghana Tech Community T-Shirt",
    type: "product",
    category: "Apparel",
    price: 25,
    currency: "USD",
    stock: 150,
    orders: 42,
    status: "published",
    image: "👕",
    createdAt: "Nov 10, 2024",
  },
  {
    id: "2",
    title: "Business Consultation (1 Hour)",
    type: "service",
    category: "Consulting",
    price: 100,
    currency: "USD",
    stock: null,
    orders: 18,
    status: "published",
    image: "💼",
    createdAt: "Oct 22, 2024",
  },
  {
    id: "3",
    title: "Annual Membership Pin",
    type: "product",
    category: "Accessories",
    price: 15,
    currency: "USD",
    stock: 200,
    orders: 89,
    status: "published",
    image: "📌",
    createdAt: "Sep 15, 2024",
  },
  {
    id: "4",
    title: "Mentorship Program Access",
    type: "service",
    category: "Education",
    price: 250,
    currency: "USD",
    stock: null,
    orders: 12,
    status: "draft",
    image: "🎓",
    createdAt: "Dec 01, 2024",
  },
  {
    id: "5",
    title: "Cultural Artifacts Collection",
    type: "product",
    category: "Art",
    price: 75,
    currency: "USD",
    stock: 0,
    orders: 35,
    status: "suspended",
    image: "🎨",
    createdAt: "Aug 30, 2024",
  },
];

const statusMap = {
  published: "active" as const,
  draft: "inactive" as const,
  suspended: "error" as const,
};

export default function Marketplace() {
  return (
    <AdminLayout title="Marketplace" subtitle="Manage your association's products and services">
      {/* Top Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search listings..."
            className="input-search w-64"
          />
          <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="">All Types</option>
            <option value="product">Products</option>
            <option value="service">Services</option>
          </select>
          <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <Button className="gap-2">
          <Tag className="h-4 w-4" />
          Create Listing
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active Listings</p>
          <p className="text-2xl font-bold text-foreground">34</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-bold text-primary">196</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Revenue (All Time)</p>
          <p className="text-2xl font-bold text-success">$18,450</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Low Stock Items</p>
          <p className="text-2xl font-bold text-warning">3</p>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {listings.map((listing, index) => (
          <div
            key={listing.id}
            className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slide-up"
            style={{ animationDelay: `${index * 75}ms` }}
          >
            {/* Image */}
            <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <span className="text-6xl">{listing.image}</span>
              <div className="absolute left-3 top-3">
                <span className="rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium capitalize text-foreground">
                  {listing.type}
                </span>
              </div>
              <div className="absolute right-3 top-3">
                <StatusBadge variant={statusMap[listing.status]}>
                  {listing.status}
                </StatusBadge>
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
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">
                  ${listing.price}
                </span>
                {listing.type === "product" && (
                  <span
                    className={`text-sm ${
                      listing.stock === 0
                        ? "text-destructive"
                        : listing.stock && listing.stock < 20
                        ? "text-warning"
                        : "text-muted-foreground"
                    }`}
                  >
                    {listing.stock === 0 ? "Out of stock" : `${listing.stock} in stock`}
                  </span>
                )}
              </div>

              {/* Orders */}
              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <ShoppingBag className="h-4 w-4" />
                <span>{listing.orders} orders</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs text-muted-foreground">
                  Created {listing.createdAt}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Listing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Package className="mr-2 h-4 w-4" />
                      View Orders
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
