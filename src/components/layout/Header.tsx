import { Bell, Search, HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/hooks/useT";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const associations = [
  { id: "1", name: "Ghana Tech Community", logo: "🇬🇭" },
  { id: "2", name: "African Developers Network", logo: "🌍" },
  { id: "3", name: "Diaspora Business Hub", logo: "💼" },
];

export function Header({ title, subtitle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssociation, setSelectedAssociation] = useState(associations[0]);
  const [isAssociationOpen, setIsAssociationOpen] = useState(false);
  const t = useT();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side: Association Selector + Title */}
        <div className="flex items-center gap-6">
          {/* Association Selector */}
          <div className="relative">
            <button
              onClick={() => setIsAssociationOpen(!isAssociationOpen)}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 transition-colors hover:bg-muted"
            >
              <span className="text-xl">{selectedAssociation.logo}</span>
              <div className="text-left hidden sm:block">
                <p className="label-small text-foreground line-clamp-1 max-w-[160px]">
                  {selectedAssociation.name}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform flex-shrink-0",
                  isAssociationOpen && "rotate-180"
                )}
              />
            </button>

            {isAssociationOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 animate-fade-in rounded-lg border border-border bg-card p-2 shadow-lg z-50">
                <p className="px-3 py-2 caption-small uppercase tracking-wider text-muted-foreground">
                  {t.switchAssociation}
                </p>
                {associations.map((assoc) => (
                  <button
                    key={assoc.id}
                    onClick={() => {
                      setSelectedAssociation(assoc);
                      setIsAssociationOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2 body-small transition-colors",
                      selectedAssociation.id === assoc.id
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <span className="text-lg">{assoc.logo}</span>
                    <span className="line-clamp-1">{assoc.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-border hidden md:block" />

          {/* Title */}
          <div className="hidden md:block">
            <h1 className="page-title">{title}</h1>
            {subtitle && <p className="body-small text-muted-foreground">{subtitle}</p>}
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={t.search + "..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-search w-64 pl-10"
            />
          </div>

          {/* Help */}
          <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <HelpCircle className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive caption-small text-primary-foreground">
              3
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
