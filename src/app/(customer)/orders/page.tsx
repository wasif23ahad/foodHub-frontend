"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Package, ShoppingBag, Clock, XCircle, Truck, ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { Order, ApiResponse, OrderStatus } from "@/types";
import { useAuth } from "@/components/providers/auth-provider";

const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case "PLACED": return "bg-amber-500 text-white border-none shadow-sm shadow-amber-200";
        case "PREPARING": return "bg-purple-500 text-white border-none shadow-sm shadow-purple-200";
        case "READY": return "bg-indigo-500 text-white border-none shadow-sm shadow-indigo-200";
        case "DELIVERED": return "bg-emerald-500 text-white border-none shadow-sm shadow-emerald-200";
        case "CANCELLED": return "bg-rose-500 text-white border-none shadow-sm shadow-rose-200";
        default: return "bg-slate-500 text-white border-none";
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

    const { data: orders, isLoading, error } = useQuery({
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

    if (!user) {
        return null;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">My Orders</h1>
                    <p className="text-slate-500 mt-1 font-medium italic">Track your delicious journeys.</p>
                </div>
                
                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input 
                        placeholder="Search orders..." 
                        className="pl-12 h-12 bg-white border-2 border-slate-100 rounded-2xl focus:border-primary/20 focus:ring-primary/10 transition-all font-medium"
                    />
                </div>
            </div>

            {!orders || orders.length === 0 ? (
                <Card className="border-none shadow-xl shadow-slate-100 bg-white rounded-[2.5rem] overflow-hidden py-20 flex flex-col items-center justify-center text-center">
                    <div className="bg-primary/5 p-10 rounded-full mb-8 relative">
                        <ShoppingBag className="h-16 w-16 text-primary" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-black mb-4 text-slate-900">No Orders Yet!</h2>
                    <p className="text-slate-500 mb-10 max-w-sm font-medium">
                        Your plate is empty. Explore our amazing collection of meals and start ordering now!
                    </p>
                    <Link href="/meals">
                        <Button size="lg" className="rounded-2xl h-14 px-10 font-black shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                            Start Ordering
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {orders.map((order) => {
                        const StatusIcon = getStatusIcon(order.status);
                        const items = order.orderItems || (order as any).items || [];

                        return (
                            <Card key={order.id} className="group border-none shadow-lg shadow-slate-100 bg-white rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 duration-500">
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
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-16 w-1 bg-white/20 rounded-full hidden md:block" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-8">
                                        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-black text-slate-900">
                                                        Order #{order.id.slice(-6).toUpperCase()}
                                                    </h3>
                                                    <Badge variant="outline" className="rounded-lg font-bold border-2 text-slate-400">
                                                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-500">
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
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                    Total Paid
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50/50 rounded-3xl p-6 mb-8">
                                            <div className="space-y-3">
                                                {items.slice(0, 2).map((item: any) => (
                                                    <div key={item.id} className="flex justify-between items-center">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-black text-xs shadow-sm border border-slate-100">
                                                                {item.quantity}x
                                                            </div>
                                                            <span className="font-bold text-slate-700 text-sm">
                                                                {item.meal?.name || "Delicious Meal"}
                                                            </span>
                                                        </div>
                                                        <span className="font-bold text-slate-900">
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
                                                <Button variant="outline" className="w-full h-12 rounded-2xl border-2 font-black group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                                                    Track Order
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-colors">
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

// Helper for class merging
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}

const Store = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
        <path d="M2 7h20"/>
        <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/>
    </svg>
);
