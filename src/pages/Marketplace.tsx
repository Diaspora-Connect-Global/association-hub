import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  return (
    <AdminLayout title={t("marketplace.title")} subtitle={t("marketplace.subtitle")}>
      {/* Top Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder={t("marketplace.searchPlaceholder")}
            className="h-10 w-64 rounded-lg border border-input bg-background px-4 body-small transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <select className="rounded-lg border border-input bg-background px-3 py-2 body-small">
            <option value="">{t("common.all")} Types</option>
            <option value="product">{t("marketplace.type.product")}</option>
            <option value="service">{t("marketplace.type.service")}</option>
          </select>
        </div>
        <Button className="gap-2">
          <Tag className="h-4 w-4" />
          {t("marketplace.createListing")}
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="body-small text-muted-foreground">{t("marketplace.activeListings")}</p>
          <p className="heading-xsmall text-foreground">34</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="body-small text-muted-foreground">{t("marketplace.totalOrders")}</p>
          <p className="heading-xsmall text-primary">196</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="body-small text-muted-foreground">{t("marketplace.revenueAllTime")}</p>
          <p className="heading-xsmall text-success">$18,450</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="body-small text-muted-foreground">{t("marketplace.lowStockItems")}</p>
          <p className="heading-xsmall text-chart-1">3</p>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {listings.map((listing, index) => (
          <div
            key={listing.id}
            className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 75}ms` }}
          >
            {/* Image */}
            <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <span className="text-6xl">{listing.image}</span>
              <div className="absolute left-3 top-3">
                <span className="rounded-full bg-background/90 px-2.5 py-1 caption-small font-medium capitalize text-foreground">
                  {t(`marketplace.type.${listing.type}`)}
                </span>
              </div>
              <div className="absolute right-3 top-3">
                <StatusBadge variant={statusMap[listing.status]}>
                  {t(`marketplace.status.${listing.status}`)}
                </StatusBadge>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="mb-1 label-small text-foreground line-clamp-1">
                {listing.title}
              </h3>
              <p className="mb-3 body-small text-muted-foreground">
                {listing.category}
              </p>

              {/* Price & Stock */}
              <div className="mb-4 flex items-center justify-between">
                <span className="label-medium text-foreground">
                  ${listing.price}
                </span>
                {listing.type === "product" && (
                  <span
                    className={`body-small ${
                      listing.stock === 0
                        ? "text-destructive"
                        : listing.stock && listing.stock < 20
                        ? "text-chart-1"
                        : "text-muted-foreground"
                    }`}
                  >
                    {listing.stock === 0 ? t("marketplace.outOfStock") : `${listing.stock} ${t("marketplace.inStock")}`}
                  </span>
                )}
              </div>

              {/* Orders */}
              <div className="mb-4 flex items-center gap-2 body-small text-muted-foreground">
                <ShoppingBag className="h-4 w-4" />
                <span>{listing.orders} {t("marketplace.orders")}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="caption-small text-muted-foreground">
                  {listing.createdAt}
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
                      {t("marketplace.viewListing")}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      {t("common.edit")}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Package className="mr-2 h-4 w-4" />
                      {t("marketplace.viewOrders")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t("common.delete")}
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
