"use client";

export const dynamic = "force-dynamic";

import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Settings,
  Tags,
  Store,
  Utensils,
  Loader2,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Providers", href: "/admin/providers", icon: Store },
  { label: "Meals", href: "/admin/meals", icon: Utensils },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role.toUpperCase() !== "ADMIN")) {
      router.push("/admin/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role.toUpperCase() !== "ADMIN") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-bold text-muted-foreground animate-pulse uppercase tracking-[0.2em]">Initialising Admin Portal</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardShell 
      brandLabel="FoodHub Admin" 
      brandIcon={ShoppingBag} 
      items={sidebarLinks}
    >
      {children}
    </DashboardShell>
  );
}
