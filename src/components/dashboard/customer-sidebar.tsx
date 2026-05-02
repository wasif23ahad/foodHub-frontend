"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingBag, 
  User, 
  Settings, 
  Heart, 
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

export function CustomerSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-100 w-64 pt-8">
      <div className="px-6 mb-8">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">My Account</h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-transform group-hover:scale-110",
                isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
              )} />
              <span className="font-bold text-sm">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-50">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-bold text-sm">Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
