import { useState } from "react";
import { Listing, ListingFormData, ListingType } from "@/types/marketplace";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Upload, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/hooks/useT";

interface CreateEditListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing?: Listing | null;
  onSubmit: (data: ListingFormData) => void;
}

const categories = ["Electronics", "Clothing", "Food", "Training", "Consulting", "Art", "Accessories", "Other"];

export function CreateEditListingModal({
  open,
  onOpenChange,
  listing,
  onSubmit,
}: CreateEditListingModalProps) {
  const t = useT();
  
  const steps = [
    { id: 1, title: t.basicInformationStep },
    { id: 2, title: t.pricingInventory },
    { id: 3, title: t.visibilityOptions },
  ];
  
  const [currentStep, setCurrentStep] = useState(1);
  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState<ListingFormData>({
    title: listing?.title || "",
    type: listing?.type || "product",
    description: listing?.description || "",
    category: listing?.category || "",
    tags: listing?.tags || [],
    mainImage: null,
    galleryImages: [],
    price: listing?.price || 0,
    currency: listing?.currency || "USD",
    inventory: listing?.inventory || 0,
    unlimitedInventory: listing?.unlimitedInventory || false,
    allowPreorders: listing?.allowPreorders || false,
    publishNow: false,
    allowReviews: listing?.allowReviews ?? true,
    isFeatured: listing?.isFeatured || false,
  });

  const updateField = <K extends keyof ListingFormData>(field: K, value: ListingFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        updateField("tags", [...formData.tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    updateField("tags", formData.tags.filter(t => t !== tag));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (asDraft: boolean = false) => {
    onSubmit({ ...formData, publishNow: !asDraft && formData.publishNow });
    onOpenChange(false);
    setCurrentStep(1);
  };

  const handleClose = () => {
    onOpenChange(false);
    setCurrentStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {listing ? t.editListing : t.addListing}
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    currentStep > step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <span className="text-xs mt-1 text-muted-foreground hidden sm:block">
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-16 sm:w-24 h-0.5 mx-2",
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-4 min-h-[320px]">
          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">{t.title} *</Label>
                <Input
                  id="title"
                  placeholder={t.enterProductServiceName}
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.type} *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: ListingType) => updateField("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">{t.product}</SelectItem>
                    <SelectItem value="service">{t.service}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t.description} *</Label>
                <Textarea
                  id="description"
                  placeholder={t.enterDetailedDescription}
                  rows={4}
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.category}</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => updateField("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectCategory} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t.tags}</Label>
                <Input
                  placeholder={t.typeAndPressEnter}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                />
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t.mainImageRequired} *</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">{t.clickUploadOrDrag}</p>
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.currency}</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => updateField("currency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GHS">GHS (₵)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">{t.ticketPrice} *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price || ""}
                    onChange={(e) => updateField("price", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              {formData.type === "product" && (
                <>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <Label>{t.unlimitedInventory}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t.noStockLimit}
                      </p>
                    </div>
                    <Switch
                      checked={formData.unlimitedInventory}
                      onCheckedChange={(checked) => updateField("unlimitedInventory", checked)}
                    />
                  </div>

                  {!formData.unlimitedInventory && (
                    <div className="space-y-2">
                      <Label htmlFor="inventory">{t.inventoryQuantity}</Label>
                      <Input
                        id="inventory"
                        type="number"
                        min="0"
                        placeholder={t.quantityAvailable}
                        value={formData.inventory || ""}
                        onChange={(e) => updateField("inventory", parseInt(e.target.value) || 0)}
                      />
                    </div>
                  )}
                </>
              )}

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <Label>{t.allowPreorders}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.acceptOrdersBeforeStock}
                  </p>
                </div>
                <Switch
                  checked={formData.allowPreorders}
                  onCheckedChange={(checked) => updateField("allowPreorders", checked)}
                />
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <Label>{t.publishNow}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.makeListingVisible}
                  </p>
                </div>
                <Switch
                  checked={formData.publishNow}
                  onCheckedChange={(checked) => updateField("publishNow", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <Label>{t.allowReviews}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.letCustomersReview}
                  </p>
                </div>
                <Switch
                  checked={formData.allowReviews}
                  onCheckedChange={(checked) => updateField("allowReviews", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <Label>{t.featuredListing}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.highlightListing}
                  </p>
                </div>
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => updateField("isFeatured", checked)}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t.back}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              {t.cancel}
            </Button>
            {currentStep < steps.length ? (
              <Button onClick={handleNext}>
                {t.next}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => handleSubmit(true)}>
                  {t.saveDraftListing}
                </Button>
                <Button onClick={() => handleSubmit(false)}>
                  {listing ? t.saveChanges : t.saveAndPublish}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
