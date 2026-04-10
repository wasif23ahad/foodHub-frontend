"use client";

export const dynamic = "force-dynamic";

import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Loader2,
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  UserCircle,
  LogOut,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { api } from "@/lib/api";
import { ApiResponse, ProviderProfile } from "@/types";

const sidebarLinks = [
  { name: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
  { name: "Menu", href: "/provider/menu", icon: Utensils },
  { name: "Orders", href: "/provider/orders", icon: ShoppingBag },
  { name: "Profile", href: "/provider/profile", icon: UserCircle },
];

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // Not a provider → redirect to login
    if (!user || user.role.toUpperCase() !== "PROVIDER") {
      router.push("/login");
      return;
    }

    // On setup page — no need to check profile
    if (pathname === "/provider/setup") {
      setProfileChecked(true);
      return;
    }

    // Check if provider profile exists via API
    api.get<ApiResponse<ProviderProfile>>("/provider/profile")
      .then((body) => {
        if (!body.data) {
          router.push("/provider/setup");
        } else {
          setProfileChecked(true);
        }
      })
      .catch(() => {
        // Error (404 / network) = no profile
        router.push("/provider/setup");
      });
  }, [user, isLoading, router, pathname]);

  // Show spinner while: auth loading, no user, wrong role, or profile check pending
  if (isLoading || !user || user.role.toUpperCase() !== "PROVIDER" || (pathname !== "/provider/setup" && !profileChecked)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If on setup page, render children without sidebar
  if (pathname === "/provider/setup") {
    return <main className="flex-1 bg-muted/30">{children}</main>;
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6">
      <div className="px-6 mb-8">
        <Link href="/provider/dashboard" className="flex items-center gap-2">
          <div className="p-1.5 bg-primary rounded-lg">
            <Utensils className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            FoodHub <span className="text-primary italic">Seller</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={() => logout()}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-background">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b bg-background px-4 flex items-center justify-between">
          <Link href="/provider/dashboard" className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-lg">
              <Utensils className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              FoodHub <span className="text-primary italic">Seller</span>
            </span>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
