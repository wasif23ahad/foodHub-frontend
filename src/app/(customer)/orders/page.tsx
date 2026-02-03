"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, Package, ShoppingBag, Clock, CheckCircle2, XCircle, Truck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { Order, ApiResponse, OrderStatus } from "@/types";

const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case "pending": return "bg-yellow-500/10 text-yellow-600 border-yellow-200 hover:bg-yellow-500/20";
        case "confirmed": return "bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500/20";
        case "preparing": return "bg-purple-500/10 text-purple-600 border-purple-200 hover:bg-purple-500/20";
        case "ready": return "bg-indigo-500/10 text-indigo-600 border-indigo-200 hover:bg-indigo-500/20";
        case "delivered": return "bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20";
        case "cancelled": return "bg-red-500/10 text-red-600 border-red-200 hover:bg-red-500/20";
        default: return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
};

const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
        case "pending": return Clock;
        case "confirmed": return CheckCircle2;
        case "preparing": return Package;
        case "ready": return ShoppingBag;
        case "delivered": return Truck;
        case "cancelled": return XCircle;
        default: return Clock;
    }
};

export default function OrderHistoryPage() {
    const { data: orders, isLoading, error } = useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            try {
                const res = await api.get<ApiResponse<Order[]>>("/orders");
                return res.data;
            } catch (err) {
                console.error("Failed to fetch orders:", err);
                // Return empty array on error for now to show empty state/error UI
                throw err;
            }
        },
    });

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Skeleton className="h-10 w-48 mb-8" />
                <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="overflow-hidden border-none shadow-sm">
                            <CardHeader className="bg-muted/30 pb-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-40" />
                                        <Skeleton className="h-4 w-64" />
                                    </div>
                                    <div className="text-right space-y-2">
                                        <Skeleton className="h-8 w-24 ml-auto" />
                                        <Skeleton className="h-4 w-16 ml-auto" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <Skeleton className="h-4 w-20" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-red-500">
                Failed to load orders. Please try again later.
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
                <div className="bg-muted/50 p-6 rounded-full mb-6">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold mb-2">No Past Orders</h1>
                <p className="text-muted-foreground mb-8 max-w-sm">
                    You haven't placed any orders yet.
                </p>
                <Link href="/meals">
                    <Button size="lg">Start Ordering</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>

            <div className="space-y-6">
                {orders.map((order) => {
                    const StatusIcon = getStatusIcon(order.status);

                    return (
                        <Card key={order.id} className="overflow-hidden">
                            <CardHeader className="bg-muted/30 pb-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <span>Order #{order.id.slice(0, 8).toUpperCase()}</span>
                                            <Badge variant="outline" className={getStatusColor(order.status)}>
                                                <StatusIcon className="w-3 h-3 mr-1" />
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </Badge>
                                        </CardTitle>
                                        <CardDescription className="mt-1">
                                            Placed on {format(new Date(order.createdAt), "PPP 'at' p")}
                                        </CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-primary">
                                            ৳ {order.totalAmount}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {order.items?.length || 0} Items
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Items</h4>
                                        {order.items?.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center text-sm">
                                                <span>
                                                    <span className="font-bold mr-2">{item.quantity}x</span>
                                                    {item.meal?.name || "Deleted Meal"}
                                                </span>
                                                <span>৳ {item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Provider</span>
                                        <span className="font-medium">{order.provider?.businessName || "Unknown Provider"}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
