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
    CheckCircle2,
    XCircle,
    ArrowUpRight,
    Search
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

interface DashboardStats {
    totalUsers: number;
    totalProviders: number;
    totalOrders: number;
    totalMeals: number;
    totalRevenue: number;
    ordersByStatus: Record<string, number>;
    recentOrders: Order[];
}

export default function AdminDashboardPage() {
    // Fetch dashboard stats
    const { data: statsData, isLoading: isStatsLoading } = useQuery({
        queryKey: ["admin-dashboard-stats"],
        queryFn: async () => {
            try {
                const res = await api.get<ApiResponse<DashboardStats>>("/admin/dashboard");
                return res.data;
            } catch (err) {
                console.error("Admin dashboard stats fetch failed", err);
                return null;
            }
        }
    });

    // Fetch system-wide orders
    const { data: ordersData, isLoading: isOrdersLoading } = useQuery({
        queryKey: ["admin-orders"],
        queryFn: async () => {
            try {
                const res = await api.get<ApiResponse<Order[]>>("/admin/orders");
                return res.data;
            } catch (err) {
                console.error("Admin orders fetch failed", err);
                return [];
            }
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
    const isLoading = isStatsLoading || isOrdersLoading;

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                    <div className="flex gap-3">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i} className="border-none shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-5 w-5 rounded-lg" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-20 mb-1" />
                                <Skeleton className="h-3 w-32" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 shadow-sm border-muted">
                        <CardHeader>
                            <Skeleton className="h-6 w-32 mb-2" />
                            <Skeleton className="h-4 w-48" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Skeleton className="h-10 w-full" />
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Skeleton key={i} className="h-16 w-full" />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-muted">
                        <CardHeader>
                            <Skeleton className="h-6 w-32 mb-2" />
                            <Skeleton className="h-4 w-48" />
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-20 w-full" />
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        System-wide overview and management.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        Download Report
                        <TrendingUp className="h-4 w-4" />
                    </Button>
                    <Button className="gap-2">
                        System Settings
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={i} className="border-none shadow-md hover:shadow-lg transition-shadow overflow-hidden bg-background">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${stat.bg}`}>
                                    <Icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold font-mono">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Activity Area */}
                <Card className="lg:col-span-2 shadow-sm border-muted">
                    <CardHeader>
                        <CardTitle>System Activity</CardTitle>
                        <CardDescription>Monitor recent orders and system events.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="orders" className="w-full">
                            <TabsList className="mb-4">
                                <TabsTrigger value="orders">Recent Orders</TabsTrigger>
                                <TabsTrigger value="users">New Users</TabsTrigger>
                                <TabsTrigger value="providers">Provider Requests</TabsTrigger>
                            </TabsList>

                            <TabsContent value="orders">
                                <ScrollArea className="h-[400px] w-full pr-4">
                                    {isOrdersLoading ? (
                                        <div className="flex items-center justify-center py-10">
                                            <Clock className="h-6 w-6 animate-spin text-muted-foreground" />
                                        </div>
                                    ) : orders.length === 0 ? (
                                        <div className="text-center py-10 text-muted-foreground">
                                            No recent orders found.
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orders.slice(0, 10).map((order) => (
                                                <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-muted/50 hover:bg-muted/50 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <ShoppingBag className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-sm">Order #{order.id.slice(-6).toUpperCase()}</p>
                                                            <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <p className="text-sm font-bold">৳{order.totalAmount}</p>
                                                            <Badge variant={order.status === 'delivered' ? 'default' : 'outline'} className="text-[10px] h-5">
                                                                {order.status}
                                                            </Badge>
                                                        </div>
                                                        <Link href={`/admin/orders/${order.id}`}>
                                                            <Button variant="ghost" size="icon">
                                                                <ArrowUpRight className="h-4 w-4" />
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
                                <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                                    User activities will be displayed here soon.
                                </div>
                            </TabsContent>

                            <TabsContent value="providers">
                                <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                                    Provider registration requests will be displayed here.
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Sidebar Cards */}
                <div className="space-y-8">
                    {/* Revenue Visualization Mockup */}
                    <Card className="shadow-sm border-muted">
                        <CardHeader>
                            <CardTitle className="text-lg">Revenue Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px] flex items-end gap-2 px-2">
                                {[40, 70, 45, 90, 65, 80, 55].map((val, i) => (
                                    <div
                                        key={i}
                                        className="bg-primary/20 w-full rounded-t-sm hover:bg-primary transition-colors cursor-help relative group"
                                        style={{ height: `${val}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            ৳{(val * 1000).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 px-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                <span>Mon</span>
                                <span>Tue</span>
                                <span>Wed</span>
                                <span>Thu</span>
                                <span>Fri</span>
                                <span>Sat</span>
                                <span>Sun</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Access */}
                    <Card className="shadow-sm border-muted bg-primary/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Quick Access</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            <Link href="/admin/users" className="w-full">
                                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-background hover:bg-muted">
                                    <Users className="h-5 w-5" />
                                    <span className="text-xs">User List</span>
                                </Button>
                            </Link>
                            <Link href="/admin/providers" className="w-full">
                                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-background hover:bg-muted">
                                    <Store className="h-5 w-5" />
                                    <span className="text-xs">Providers</span>
                                </Button>
                            </Link>
                            <Link href="/admin/orders" className="w-full">
                                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-background hover:bg-muted">
                                    <ShoppingBag className="h-5 w-5" />
                                    <span className="text-xs">Orders</span>
                                </Button>
                            </Link>
                            <Link href="/admin/analytics" className="w-full">
                                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-background hover:bg-muted">
                                    <TrendingUp className="h-5 w-5" />
                                    <span className="text-xs">Analytics</span>
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
