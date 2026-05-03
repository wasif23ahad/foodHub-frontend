"use client";

export const dynamic = "force-dynamic";

import { useAuth } from "@/components/providers/auth-provider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  UserCircle,
  Loader2,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { api } from "@/lib/api";
import { ApiResponse, ProviderProfile } from "@/types";

const sidebarLinks = [
  { label: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
  { label: "Menu", href: "/provider/menu", icon: Utensils },
  { label: "Orders", href: "/provider/orders", icon: ShoppingBag },
  { label: "Profile", href: "/provider/profile", icon: UserCircle },
];

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!user || user.role.toUpperCase() !== "PROVIDER") {
      router.push("/login");
      return;
    }

    if (pathname === "/provider/setup") {
      setProfileChecked(true);
      return;
    }

    api.get<ApiResponse<ProviderProfile>>("/provider/profile")
      .then((body) => {
        if (!body.data) {
          router.push("/provider/setup");
        } else {
          setProfileChecked(true);
        }
      })
      .catch(() => {
        router.push("/provider/setup");
      });
  }, [user, isLoading, router, pathname]);

  if (isLoading || !user || user.role.toUpperCase() !== "PROVIDER" || (pathname !== "/provider/setup" && !profileChecked)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-bold text-muted-foreground animate-pulse uppercase tracking-[0.2em]">Initialising Seller Portal</p>
        </div>
      </div>
    );
  }

  if (pathname === "/provider/setup") {
    return <main className="flex-1 bg-muted/30 min-h-screen">{children}</main>;
  }

  return (
    <DashboardShell 
      brandLabel="FoodHub Seller" 
      brandIcon={Utensils} 
      items={sidebarLinks}
    >
      {children}
    </DashboardShell>
  );
}
