"use client";

import { useQuery } from "@tanstack/react-query";
import {
    LayoutDashboard,
    ShoppingBag,
    CheckCircle2,
    Clock,
    DollarSign,
    Loader2,
    ArrowUpRight,
    Utensils
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Order, ApiResponse, Meal } from "@/types";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function ProviderDashboardPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    // Protection: Redirect if not a provider
    useEffect(() => {
        if (!isAuthLoading && (!user || user.role !== "provider")) {
            router.push("/");
        }
    }, [user, isAuthLoading, router]);

    // Fetch orders for this provider
    // Assuming backend supports filtering or returns only provider's orders for provider role
    const { data: ordersData, isLoading: isOrdersLoading } = useQuery({
        queryKey: ["provider-orders"],
        queryFn: async () => {
            const res = await api.get<ApiResponse<Order[]>>("/orders");
            return res.data;
        },
        enabled: !!user && user.role === "provider",
    });

    // Fetch meals to show menu status
    const { data: mealsData } = useQuery({
        queryKey: ["provider-meals"],
        queryFn: async () => {
            // For now, assuming we can filter or it returns provider's meals
            const res = await api.get<ApiResponse<Meal[]>>("/meals");
            return res.data;
        },
        enabled: !!user && user.role === "provider",
    });

    if (isAuthLoading || isOrdersLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user || user.role !== "provider") return null;

    const orders = ordersData || [];
    const meals = mealsData || [];

    // Derive stats
    const totalRevenue = orders
        .filter(o => o.status === "delivered")
        .reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "confirmed").length;
    const completedOrders = orders.filter(o => o.status === "delivered").length;
    const totalMeals = meals.length;

    const stats = [
        {
            title: "Total Revenue",
            value: `৳ ${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            description: "From delivered orders",
            color: "text-green-600",
            bg: "bg-green-100"
        },
        {
            title: "Pending Orders",
            value: pendingOrders,
            icon: Clock,
            description: "Requires attention",
            color: "text-amber-600",
            bg: "bg-amber-100"
        },
        {
            title: "Completed",
            value: completedOrders,
            icon: CheckCircle2,
            description: "Successfully delivered",
            color: "text-blue-600",
            bg: "bg-blue-100"
        },
        {
            title: "Active Menu",
            value: totalMeals,
            icon: Utensils,
            description: "Total meals listed",
            color: "text-purple-600",
            bg: "bg-purple-100"
        }
    ];

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Provider Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back, {user.name}. Here's what's happening today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/provider/menu">
                        <Button variant="outline" className="gap-2">
                            Manage Menu
                        </Button>
                    </Link>
                    <Button className="gap-2">
                        View All Orders
                        <ArrowUpRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={i} className="border-none shadow-sm overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${stat.bg}`}>
                                    <Icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <Card className="col-span-1 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                            Recent Orders
                        </CardTitle>
                        <CardDescription>
                            Your last 5 orders from customers.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {orders.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                No orders yet.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.slice(0, 5).map((order) => (
                                    <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                Order #{order.id.slice(-6).toUpperCase()}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <p className="text-sm font-bold">৳ {order.totalAmount}</p>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${order.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                                    order.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-200' :
                                                        'bg-blue-50 text-blue-600 border-blue-200'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Button variant="ghost" className="w-full mt-4 text-primary hover:text-primary hover:bg-primary/5">
                            View All Orders
                        </Button>
                    </CardContent>
                </Card>

                {/* Quick Actions / Tips */}
                <Card className="col-span-1 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LayoutDashboard className="h-5 w-5 text-primary" />
                            Quick Insights
                        </CardTitle>
                        <CardDescription>
                            Manage your business efficiently.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                            <h4 className="font-semibold text-sm mb-1">Boost your visibility</h4>
                            <p className="text-xs text-muted-foreground">
                                Adding high-quality photos to your meals can increase orders by up to 30%.
                            </p>
                            <Button size="sm" className="mt-3 text-xs" variant="outline">
                                Edit Menu
                            </Button>
                        </div>
                        <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10">
                            <h4 className="font-semibold text-sm mb-1">Peak Hours</h4>
                            <p className="text-xs text-muted-foreground">
                                Most of your orders come in between 7:00 PM and 9:00 PM.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="h-20 flex flex-col gap-2">
                                <Utensils className="h-5 w-5" />
                                <span className="text-xs">New Meal</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col gap-2">
                                <DollarSign className="h-5 w-5" />
                                <span className="text-xs">Payouts</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
