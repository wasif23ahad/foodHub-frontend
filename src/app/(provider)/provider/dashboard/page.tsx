"use client";

export const dynamic = "force-dynamic";

import { useQuery } from "@tanstack/react-query";
import {
    LayoutDashboard,
    ShoppingBag,
    CheckCircle2,
    Clock,
    DollarSign,
    Loader2,
    ArrowUpRight,
    Utensils,
    TrendingUp
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { api } from "@/lib/api";
import { Order, ApiResponse, Meal } from "@/types";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { CustomLineChart, CustomBarChart } from "@/components/ui/charts";

interface ProviderAnalytics {
    timeSeries: Array<{ date: string; revenue: number; orders: number }>;
    topMeals: Array<{ name: string; orders: number }>;
}

export default function ProviderDashboardPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    // Protection: Redirect if not a provider
    useEffect(() => {
        if (!isAuthLoading && (!user || user.role?.toLowerCase() !== "provider")) {
            router.push("/");
        }
    }, [user, isAuthLoading, router]);

    // Fetch orders for this provider
    const { data: ordersData, isLoading: isOrdersLoading } = useQuery({
        queryKey: ["provider-orders"],
        queryFn: async () => {
            const res = await api.get<ApiResponse<Order[]>>("/provider/orders");
            return res.data;
        },
        enabled: !!user && user.role?.toLowerCase() === "provider",
    });

    // Fetch analytics data (charts)
    const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery({
        queryKey: ["provider-analytics"],
        queryFn: async () => {
            const res = await api.get<ApiResponse<ProviderAnalytics>>("/analytics/provider?days=30");
            return res.data;
        },
        enabled: !!user && user.role?.toLowerCase() === "provider",
    });

    // Fetch meals to show menu status
    const { data: mealsData } = useQuery({
        queryKey: ["provider-meals"],
        queryFn: async () => {
            const res = await api.get<ApiResponse<Meal[]>>("/provider/meals");
            return res.data;
        },
        enabled: !!user && user.role?.toLowerCase() === "provider",
    });

    if (isAuthLoading || isOrdersLoading || isAnalyticsLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!user || user.role?.toLowerCase() !== "provider") return null;

    const orders = ordersData || [];
    const meals = mealsData || [];

    const totalRevenue = orders
        .filter(o => o.status === "DELIVERED")
        .reduce((sum, o) => sum + Number(o.totalAmount), 0);

    const pendingOrders = orders.filter(o => o.status === "PLACED" || o.status === "PREPARING").length;
    const completedOrders = orders.filter(o => o.status === "DELIVERED").length;
    const totalMealsCount = meals.length;

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
            value: totalMealsCount,
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
                    <h1 className="text-3xl font-black tracking-tight">Provider Dashboard</h1>
                    <p className="text-muted-foreground mt-1 font-medium">
                        Welcome back, {user.name}. Here's your kitchen performance.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/provider/menu">
                        <Button variant="outline" className="gap-2 font-bold rounded-xl border-2">
                            Manage Menu
                        </Button>
                    </Link>
                    <Link href="/provider/orders">
                        <Button className="gap-2 font-bold rounded-xl shadow-lg shadow-primary/20">
                            View All Orders
                            <ArrowUpRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={i} className="border-none shadow-md overflow-hidden bg-background hover:shadow-lg transition-all group">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2.5 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                                    <Icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black tracking-tighter">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1 font-semibold">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-lg border-none bg-background rounded-3xl overflow-hidden">
                    <CardHeader className="border-b border-muted/50 pb-6">
                        <CardTitle className="text-xl font-bold">Revenue History</CardTitle>
                        <CardDescription>Earnings over the last 30 days.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <CustomLineChart 
                            data={analyticsData?.timeSeries || []} 
                            xKey="date" 
                            yKey="revenue" 
                            height={300} 
                        />
                    </CardContent>
                </Card>

                <Card className="shadow-lg border-none bg-background rounded-3xl overflow-hidden">
                    <CardHeader className="border-b border-muted/50 pb-6">
                        <CardTitle className="text-xl font-bold">Top Selling Meals</CardTitle>
                        <CardDescription>Most popular items in your menu.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <CustomBarChart 
                            data={analyticsData?.topMeals || []} 
                            xKey="name" 
                            yKey="orders" 
                            height={300} 
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <Card className="lg:col-span-2 shadow-lg border-none bg-background rounded-3xl overflow-hidden">
                    <CardHeader className="border-b border-muted/50">
                        <CardTitle className="flex items-center gap-2 text-xl font-bold">
                            <ShoppingBag className="h-6 w-6 text-primary" />
                            Recent Orders
                        </CardTitle>
                        <CardDescription>
                            Manage your incoming orders.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {orders.length === 0 ? (
                            <div className="py-12">
                                <EmptyState
                                    icon={ShoppingBag}
                                    title="No orders yet"
                                    description="Start promoting your kitchen and share your unique flavors with the world!"
                                />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.slice(0, 5).map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-muted/20 hover:bg-muted/50 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <ShoppingBag className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">Order #{order.id.slice(-6).toUpperCase()}</p>
                                                <p className="text-xs text-muted-foreground font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-sm font-black text-foreground">৳{order.totalAmount}</p>
                                                <Badge className={`text-[10px] h-5 font-black uppercase ${
                                                    order.status === 'DELIVERED' ? 'bg-emerald-500 hover:bg-emerald-600' : 
                                                    order.status === 'PLACED' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-primary hover:bg-primary/90'
                                                }`}>
                                                    {order.status}
                                                </Badge>
                                            </div>
                                            <Link href={`/provider/orders/${order.id}`}>
                                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary hover:text-white transition-colors">
                                                    <ArrowUpRight className="h-5 w-5" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Link href="/provider/orders" className="w-full">
                            <Button variant="ghost" className="w-full mt-6 text-primary font-bold hover:bg-primary/5 rounded-xl">
                                View Full History
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Growth Tips */}
                <Card className="shadow-lg border-none bg-primary/5 rounded-3xl overflow-hidden">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl font-bold">
                            <LayoutDashboard className="h-6 w-6 text-primary" />
                            Growth Hub
                        </CardTitle>
                        <CardDescription>
                            Tips to increase your sales.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="p-5 rounded-2xl bg-white border border-primary/10 shadow-sm">
                            <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-emerald-500" />
                                Boost Visibility
                            </h4>
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                Adding high-quality photos to your menu items can increase orders by up to 30%.
                            </p>
                            <Link href="/provider/menu">
                                <Button size="sm" className="mt-4 text-xs font-bold rounded-lg" variant="outline">
                                    Update Menu
                                </Button>
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <Link href="/provider/menu">
                                <Button variant="outline" className="w-full h-24 flex flex-col gap-3 bg-background hover:bg-primary/10 hover:border-primary/20 transition-all rounded-2xl border-2">
                                    <Utensils className="h-5 w-5 text-primary" />
                                    <span className="text-xs font-bold uppercase tracking-tighter">New Meal</span>
                                </Button>
                            </Link>
                            <Link href="/provider/profile">
                                <Button variant="outline" className="w-full h-24 flex flex-col gap-3 bg-background hover:bg-primary/10 hover:border-primary/20 transition-all rounded-2xl border-2">
                                    <LayoutDashboard className="h-5 w-5 text-amber-500" />
                                    <span className="text-xs font-bold uppercase tracking-tighter">Profile</span>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
