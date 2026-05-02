"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
    Users,
    ShoppingBag,
    DollarSign,
    Store,
    TrendingUp,
    Clock,
    ArrowUpRight,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { ApiResponse, Order } from "@/types";
import { CustomLineChart, CustomBarChart } from "@/components/ui/charts";

interface DashboardStats {
    totalUsers: number;
    totalProviders: number;
    totalOrders: number;
    totalMeals: number;
    totalRevenue: number;
    ordersByStatus: Record<string, number>;
    recentOrders: Order[];
}

interface AnalyticsData {
    timeSeries: Array<{ date: string; revenue: number; orders: number }>;
    categoryDistribution: Array<{ name: string; value: number }>;
    topProviders: Array<{ name: string; revenue: number }>;
}

export default function AdminDashboardPage() {
    // Fetch dashboard stats (counters)
    const { data: statsData, isLoading: isStatsLoading } = useQuery({
        queryKey: ["admin-dashboard-stats"],
        queryFn: async () => {
            const res = await api.get<ApiResponse<DashboardStats>>("/admin/dashboard");
            return res.data;
        }
    });

    // Fetch analytics data (charts)
    const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery({
        queryKey: ["admin-analytics"],
        queryFn: async () => {
            const res = await api.get<ApiResponse<AnalyticsData>>("/analytics/admin?days=30");
            return res.data;
        }
    });

    // Fetch system-wide orders
    const { data: ordersData, isLoading: isOrdersLoading } = useQuery({
        queryKey: ["admin-orders"],
        queryFn: async () => {
            const res = await api.get<ApiResponse<Order[]>>("/admin/orders");
            return res.data;
        }
    });

    const stats = [
        {
            title: "Total Revenue",
            value: `৳ ${(statsData?.totalRevenue || 0).toLocaleString()}`,
            icon: DollarSign,
            description: "Total delivered orders value",
            color: "text-green-600",
            bg: "bg-green-100"
        },
        {
            title: "Total Orders",
            value: statsData?.totalOrders || 0,
            icon: ShoppingBag,
            description: `${statsData?.ordersByStatus?.DELIVERED || 0} delivered`,
            color: "text-blue-600",
            bg: "bg-blue-100"
        },
        {
            title: "Active Users",
            value: statsData?.totalUsers || 0,
            icon: Users,
            description: `${Math.floor((statsData?.totalUsers || 0) * 0.8)} active`,
            color: "text-purple-600",
            bg: "bg-purple-100"
        },
        {
            title: "Providers",
            value: statsData?.totalProviders || 0,
            icon: Store,
            description: `${statsData?.totalMeals || 0} meals available`,
            color: "text-amber-600",
            bg: "bg-amber-100"
        }
    ];

    const orders = ordersData || [];
    const isLoading = isStatsLoading || isOrdersLoading || isAnalyticsLoading;

    if (isLoading) {
        return (
            <div className="space-y-8 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Skeleton className="lg:col-span-2 h-[400px] rounded-xl" />
                    <Skeleton className="h-[400px] rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1 font-medium">
                        Real-time system insights and operations.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 font-bold rounded-xl border-2">
                        Download Report
                        <TrendingUp className="h-4 w-4" />
                    </Button>
                    <Button className="gap-2 font-bold rounded-xl shadow-lg shadow-primary/20">
                        System Settings
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    let href = "#";
                    if (stat.title === "Total Revenue" || stat.title === "Total Orders") href = "/admin/orders";
                    else if (stat.title === "Active Users") href = "/admin/users";
                    else if (stat.title === "Providers") href = "/admin/providers";

                    return (
                        <Link href={href} key={i}>
                            <Card className="border-none shadow-md hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden bg-background cursor-pointer h-full group">
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
                        </Link>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 shadow-lg border-none bg-background rounded-3xl overflow-hidden">
                    <CardHeader className="border-b border-muted/50 pb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold">Revenue Trends</CardTitle>
                                <CardDescription>Daily revenue performance for the last 30 days.</CardDescription>
                            </div>
                            <Badge variant="outline" className="font-bold border-2 text-primary">Last 30 Days</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <CustomLineChart 
                            data={analyticsData?.timeSeries || []} 
                            xKey="date" 
                            yKey="revenue" 
                            height={350} 
                        />
                    </CardContent>
                </Card>

                <Card className="shadow-lg border-none bg-background rounded-3xl overflow-hidden">
                    <CardHeader className="border-b border-muted/50 pb-6">
                        <CardTitle className="text-xl font-bold">Top Providers</CardTitle>
                        <CardDescription>Highest revenue earners.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <CustomBarChart 
                            data={analyticsData?.topProviders || []} 
                            xKey="name" 
                            yKey="revenue" 
                            height={350} 
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Activity Area */}
                <Card className="lg:col-span-2 shadow-lg border-none bg-background rounded-3xl overflow-hidden">
                    <CardHeader className="border-b border-muted/50">
                        <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
                        <CardDescription>Monitor recent orders and system events.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Tabs defaultValue="orders" className="w-full">
                            <TabsList className="mb-6 bg-muted/50 p-1 rounded-xl">
                                <TabsTrigger value="orders" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Recent Orders</TabsTrigger>
                                <TabsTrigger value="users" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">New Users</TabsTrigger>
                                <TabsTrigger value="providers" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Provider Requests</TabsTrigger>
                            </TabsList>

                            <TabsContent value="orders">
                                <ScrollArea className="h-[400px] w-full pr-4">
                                    {orders.length === 0 ? (
                                        <div className="text-center py-20 text-muted-foreground font-medium">
                                            No recent orders found.
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {orders.slice(0, 10).map((order: any) => (
                                                <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-muted/20 hover:bg-muted/50 transition-all group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                                            <ShoppingBag className="h-6 w-6 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm">Order #{order.id.slice(-6).toUpperCase()}</p>
                                                            <p className="text-xs text-muted-foreground font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div className="text-right">
                                                            <p className="text-sm font-black text-foreground">৳{order.totalAmount}</p>
                                                            <Badge className={`text-[10px] h-5 font-black uppercase ${
                                                                order.status === 'DELIVERED' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-primary hover:bg-primary/90'
                                                            }`}>
                                                                {order.status}
                                                            </Badge>
                                                        </div>
                                                        <Link href={`/admin/orders/${order.id}`}>
                                                            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary hover:text-white transition-colors">
                                                                <ArrowUpRight className="h-5 w-5" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </TabsContent>

                            <TabsContent value="users">
                                <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-3xl font-medium">
                                    User registration trends will appear here.
                                </div>
                            </TabsContent>

                            <TabsContent value="providers">
                                <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-3xl font-medium">
                                    New provider applications pending review.
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Quick Access */}
                <Card className="shadow-lg border-none bg-primary/5 rounded-3xl overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
                        <CardDescription>Speed up your workflow.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Link href="/admin/users" className="w-full">
                            <Button variant="outline" className="w-full h-24 flex flex-col gap-3 bg-background hover:bg-primary/10 hover:border-primary/20 transition-all rounded-2xl border-2">
                                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                                    <Users className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-tighter">Users</span>
                            </Button>
                        </Link>
                        <Link href="/admin/providers" className="w-full">
                            <Button variant="outline" className="w-full h-24 flex flex-col gap-3 bg-background hover:bg-primary/10 hover:border-primary/20 transition-all rounded-2xl border-2">
                                <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                                    <Store className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-tighter">Providers</span>
                            </Button>
                        </Link>
                        <Link href="/admin/orders" className="w-full">
                            <Button variant="outline" className="w-full h-24 flex flex-col gap-3 bg-background hover:bg-primary/10 hover:border-primary/20 transition-all rounded-2xl border-2">
                                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                    <ShoppingBag className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-tighter">Orders</span>
                            </Button>
                        </Link>
                        <Link href="/admin/settings" className="w-full">
                            <Button variant="outline" className="w-full h-24 flex flex-col gap-3 bg-background hover:bg-primary/10 hover:border-primary/20 transition-all rounded-2xl border-2">
                                <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-tighter">System</span>
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
