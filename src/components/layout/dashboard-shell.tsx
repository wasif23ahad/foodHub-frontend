"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface DashboardShellProps {
  brandLabel: string;            // e.g. "FoodHub Seller" / "FoodHub Admin"
  brandIcon: LucideIcon;
  items: SidebarItem[];
  children: ReactNode;
}

export function DashboardShell({ brandLabel, brandIcon: BrandIcon, items, children }: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6">
      {/* Sidebar header */}
      <div className="px-6 mb-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-primary rounded-lg shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <BrandIcon className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight">
            FoodHub <span className="text-primary italic font-serif">{brandLabel.split(" ")[1]}</span>
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar nav — scrollable if items overflow */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-200",
                active
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 translate-x-1"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar footer — Logout always visible */}
      <div className="px-4 mt-auto pt-6 border-t border-border/50">
        <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-2xl bg-muted/30">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <span className="text-primary font-black text-sm">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-foreground truncate">
              {user?.name ?? "User"}
            </p>
            <p className="text-[10px] font-bold text-muted-foreground truncate uppercase tracking-widest">
              {user?.role}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-2xl transition-all h-12"
          onClick={() => logout()}
        >
          <LogOut className="h-5 w-5" />
          <span className="font-bold">Logout</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* SIDEBAR — fixed on desktop, drawer on mobile */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <SidebarContent />
      </aside>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* MAIN CONTENT Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 w-full">
        {/* Desktop/Mobile Top Header */}
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-md px-4 md:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="rounded-xl"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <BrandIcon className="h-5 w-5 text-primary" />
              <span className="font-black text-lg tracking-tight">FoodHub</span>
            </Link>
          </div>

          <div className="flex-1 hidden lg:block" />

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="h-8 w-[1px] bg-border mx-1" />
            <div className="hidden sm:flex items-center gap-3 pl-2">
                <div className="text-right">
                    <p className="text-xs font-black text-foreground leading-none mb-1">{user?.name}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{user?.role}</p>
                </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 lg:p-12 animate-in fade-in duration-500">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
