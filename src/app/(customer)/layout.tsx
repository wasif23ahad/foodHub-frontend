"use client";

import { 
  ShoppingBag, 
  User, 
  Heart, 
  LayoutDashboard,
  Settings
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

const menuItems = [
  {
    label: "Dashboard",
    href: "/profile",
    icon: LayoutDashboard,
  },
  {
    label: "My Orders",
    href: "/orders",
    icon: ShoppingBag,
  },
  {
    label: "Favorites",
    href: "/favorites",
    icon: Heart,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell 
      brandLabel="FoodHub Customer" 
      brandIcon={User} 
      items={menuItems}
    >
      {children}
    </DashboardShell>
  );
}
