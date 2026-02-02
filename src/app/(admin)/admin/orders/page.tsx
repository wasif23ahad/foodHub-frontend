"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    ShoppingBag,
    Search,
    Eye
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
import Link from "next/link";

const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    preparing: "bg-blue-100 text-blue-800",
    ready: "bg-green-100 text-green-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

    const { data: ordersData, isLoading } = useQuery({
        queryKey: ["admin-orders", statusFilter, sortBy],
        queryFn: async () => {
            try {
                const params = new URLSearchParams();
                if (statusFilter !== "all") params.append("status", statusFilter);
                params.append("sortBy", sortBy);

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
            value: ordersData?.filter(o => o.status === "delivered").length || 0,
            color: "text-green-600"
        },
        {
            label: "Pending",
            value: ordersData?.filter(o => ["pending", "confirmed", "preparing", "ready"].includes(o.status)).length || 0,
            color: "text-yellow-600"
        },
        {
            label: "Cancelled",
            value: ordersData?.filter(o => o.status === "cancelled").length || 0,
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
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="preparing">Preparing</option>
                                <option value="ready">Ready</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
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
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Provider</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow key={order.id} className="hover:bg-muted/30">
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
                                                <Badge className={statusColors[order.status]}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Link href={`/admin/orders/${order.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
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
