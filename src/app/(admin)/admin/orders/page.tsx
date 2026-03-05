"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    ShoppingBag,
    Search,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { ApiResponse, Order } from "@/types";

const statusColors: Record<string, string> = {
    PLACED: "bg-yellow-100 text-yellow-800",
    placed: "bg-yellow-100 text-yellow-800",
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    PREPARING: "bg-blue-100 text-blue-800",
    preparing: "bg-blue-100 text-blue-800",
    READY: "bg-green-100 text-green-800",
    ready: "bg-green-100 text-green-800",
    DELIVERED: "bg-green-100 text-green-800",
    delivered: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    const { data: ordersData, isLoading } = useQuery({
        queryKey: ["admin-orders", statusFilter, sortBy],
        queryFn: async () => {
            try {
                const params = new URLSearchParams();
                if (statusFilter !== "all") params.append("status", statusFilter.toUpperCase());
                params.append("limit", "100");

                const res = await api.get<ApiResponse<Order[]>>(
                    `/admin/orders?${params.toString()}`
                );
                return res.data;
            } catch (err) {
                console.error("Orders fetch failed", err);
                return [];
            }
        }
    });

    const orders = (ordersData || []).filter(order =>
        search === "" ||
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
        order.totalAmount.toString().includes(search)
    );

    const stats = [
        {
            label: "Total Orders",
            value: ordersData?.length || 0,
            color: "text-blue-600"
        },
        {
            label: "Delivered",
            value: ordersData?.filter(o => o.status.toUpperCase() === "DELIVERED").length || 0,
            color: "text-green-600"
        },
        {
            label: "Pending",
            value: ordersData?.filter(o => ["PLACED", "PREPARING", "READY"].includes(o.status.toUpperCase())).length || 0,
            color: "text-yellow-600"
        },
        {
            label: "Cancelled",
            value: ordersData?.filter(o => o.status.toUpperCase() === "CANCELLED").length || 0,
            color: "text-red-600"
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Order Management</h1>
                <p className="text-muted-foreground mt-1">Monitor and manage all system orders.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label} className="border-none shadow-md">
                        <CardContent className="pt-6">
                            <div className={`text-3xl font-bold ${stat.color}`}>
                                {stat.value}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters & Search */}
            <Card className="shadow-sm border-muted">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-2 block">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by order ID, customer name, or amount..."
                                    className="pl-10"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="md:w-48">
                            <label className="text-sm font-medium mb-2 block">Status</label>
                            <select
                                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Statuses</option>
                                <option value="PLACED">Placed</option>
                                <option value="PREPARING">Preparing</option>
                                <option value="READY">Ready</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                        <div className="md:w-48">
                            <label className="text-sm font-medium mb-2 block">Sort By</label>
                            <select
                                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card className="shadow-sm border-muted overflow-hidden">
                <CardHeader className="pb-4">
                    <CardTitle>System Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No orders found matching your filters.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-8"></TableHead>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Provider</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => (
                                        <>
                                            <TableRow
                                                key={order.id}
                                                className="hover:bg-muted/30 cursor-pointer"
                                                onClick={() => setExpandedOrderId(
                                                    expandedOrderId === order.id ? null : order.id
                                                )}
                                            >
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                                        {expandedOrderId === order.id ? (
                                                            <ChevronUp className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </TableCell>
                                                <TableCell className="font-mono text-sm">
                                                    {order.id.slice(-8).toUpperCase()}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-medium">{order.customer?.name || "Anonymous"}</span>
                                                </TableCell>
                                                <TableCell>
                                                    {order.providerProfile?.businessName || "Unknown"}
                                                </TableCell>
                                                <TableCell className="font-bold">
                                                    ৳{order.totalAmount.toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={statusColors[order.status] || "bg-gray-100 text-gray-800"}>
                                                        {order.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                            {expandedOrderId === order.id && (
                                                <TableRow key={`${order.id}-detail`}>
                                                    <TableCell colSpan={7} className="bg-muted/20 p-4">
                                                        <div className="space-y-3">
                                                            <h4 className="font-semibold text-sm">Order Items</h4>
                                                            {order.items && order.items.length > 0 ? (
                                                                <div className="grid gap-2">
                                                                    {order.items.map((item) => (
                                                                        <div key={item.id} className="flex justify-between items-center text-sm bg-background p-2 rounded-md border">
                                                                            <span>{item.meal?.name || "Unknown meal"}</span>
                                                                            <span className="text-muted-foreground">
                                                                                x{item.quantity} — ৳{((item.price || item.meal?.price || 0) * item.quantity).toFixed(2)}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-muted-foreground">No items data available for this order.</p>
                                                            )}
                                                            <div className="flex gap-4 text-xs text-muted-foreground pt-2 border-t">
                                                                <span>Delivery: {order.deliveryAddress || "N/A"}</span>
                                                                {order.notes && <span>Notes: {order.notes}</span>}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
