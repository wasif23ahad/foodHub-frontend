"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Package, ShoppingBag, Clock, XCircle, Truck, ArrowUpRight, Search, Store } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/dashboard/empty-state";
import { api } from "@/lib/api";
import { Order, ApiResponse, OrderStatus } from "@/types";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case "PLACED": return "bg-amber-500 text-white border-none";
        case "PREPARING": return "bg-purple-500 text-white border-none";
        case "READY": return "bg-indigo-500 text-white border-none";
        case "DELIVERED": return "bg-emerald-500 text-white border-none";
        case "CANCELLED": return "bg-rose-500 text-white border-none";
        default: return "bg-muted text-muted-foreground border-none";
    }
};

const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
        case "PLACED": return Clock;
        case "PREPARING": return Package;
        case "READY": return ShoppingBag;
        case "DELIVERED": return Truck;
        case "CANCELLED": return XCircle;
        default: return Clock;
    }
};

export default function OrderHistoryPage() {
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuth();
    const [search, setSearch] = useState("");

    const { data: orders, isLoading } = useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const res = await api.get<ApiResponse<Order[]>>("/orders");
            return res.data;
        },
        enabled: !!user,
    });

    useEffect(() => {
        if (!isAuthLoading && !user) {
            router.push("/login?redirect=/orders");
        }
    }, [isAuthLoading, user, router]);

    const filtered = (orders ?? []).filter((o: any) =>
        !search ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        ((o.orderItems || o.items) ?? []).some((i: any) => 
            i.meal?.name?.toLowerCase().includes(search.toLowerCase())
        )
    );

    if (isAuthLoading || isLoading) {
        return (
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-48 w-full rounded-3xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground">My Orders</h1>
                    <p className="text-muted-foreground mt-1 font-medium italic">Track your delicious journeys.</p>
                </div>
                
                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                        placeholder="Search orders..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-12 h-12 bg-card border-border border-2 rounded-2xl focus:border-primary/20 focus:ring-primary/10 transition-all font-medium"
                    />
                </div>
            </div>

            {filtered.length === 0 ? (
                <EmptyState
                    icon={ShoppingBag}
                    title={search ? "No matching orders" : "No orders yet!"}
                    description={
                        search
                            ? `We couldn't find any orders matching "${search}".`
                            : "Your plate is empty. Explore our amazing collection of meals and start ordering now!"
                    }
                    action={search ? undefined : { label: "Start Ordering", href: "/meals" }}
                />
            ) : (
                <div className="grid gap-6">
                    {filtered.map((order) => {
                        const StatusIcon = getStatusIcon(order.status);
                        const items = order.orderItems || (order as any).items || [];

                        return (
                            <Card key={order.id} className="group border-border bg-card rounded-[2.5rem] overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 duration-500">
                                <div className="flex flex-col md:flex-row">
                                    {/* Sidebar of card */}
                                    <div className={cn(
                                        "w-full md:w-48 p-8 flex flex-col items-center justify-center text-center relative",
                                        getStatusColor(order.status)
                                    )}>
                                        <div className="bg-white/20 p-4 rounded-3xl mb-4 backdrop-blur-md">
                                            <StatusIcon className="h-10 w-10 text-white" />
                                        </div>
                                        <span className="font-black text-xs uppercase tracking-widest text-white/90">
                                            {order.status}
                                        </span>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-16 w-px bg-white/20 hidden md:block" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-8">
                                        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-black text-foreground">
                                                        Order #{order.id.slice(-6).toUpperCase()}
                                                    </h3>
                                                    <Badge variant="outline" className="rounded-lg font-bold border-2 text-muted-foreground border-border">
                                                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Store className="h-4 w-4" />
                                                    <span className="text-sm font-bold">
                                                        {(order.provider || order.providerProfile)?.businessName || "FoodHub Kitchen"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-left md:text-right">
                                                <div className="text-3xl font-black text-primary tracking-tighter">
                                                    ৳ {order.totalAmount}
                                                </div>
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                                    Total Paid
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-muted/30 rounded-3xl p-6 mb-8 border border-border/50">
                                            <div className="space-y-3">
                                                {items.slice(0, 2).map((item: any) => (
                                                    <div key={item.id} className="flex justify-between items-center">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center font-black text-xs shadow-sm border border-border">
                                                                {item.quantity}x
                                                            </div>
                                                            <span className="font-bold text-foreground text-sm">
                                                                {item.meal?.name || "Delicious Meal"}
                                                            </span>
                                                        </div>
                                                        <span className="font-bold text-foreground">
                                                            ৳ {(item.unitPrice || item.price) * item.quantity}
                                                        </span>
                                                    </div>
                                                ))}
                                                {items.length > 2 && (
                                                    <p className="text-xs font-bold text-primary italic pl-11">
                                                        + {items.length - 2} more items
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-4">
                                            <Link href={`/orders/${order.id}`} className="flex-1">
                                                <Button variant="outline" className="w-full h-12 rounded-2xl border-2 font-black hover:bg-primary hover:text-white hover:border-primary transition-all">
                                                    Track Order
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-muted hover:bg-muted/80 transition-colors">
                                                <ArrowUpRight className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
