import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="min-h-screen bg-background">
        <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
        <div className={cn(
          "transition-all duration-300",
          collapsed ? "ml-16" : "ml-64"
        )}>
          <Header 
            title={title} 
            subtitle={subtitle} 
            sidebarCollapsed={collapsed}
            onToggleSidebar={toggleSidebar}
          />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}