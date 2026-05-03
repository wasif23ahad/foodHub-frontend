"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
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
import { StatusPill } from "@/components/dashboard/badges";
import { cn } from "@/lib/utils";
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

const mapStatus = (status: string): any => {
    const s = status.toLowerCase();
    if (s === "placed") return "pending";
    if (s === "confirmed") return "preparing";
    return s;
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
                        <div className="space-y-4 p-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-20">
                            <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                            <p className="font-semibold text-foreground">No orders found</p>
                            <p className="text-sm text-muted-foreground">Try adjusting your filters.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50 transition-none">
                                        <TableHead className="w-8"></TableHead>
                                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order ID</TableHead>
                                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</TableHead>
                                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Provider</TableHead>
                                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</TableHead>
                                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => (
                                        <React.Fragment key={order.id}>
                                            <TableRow
                                                className={cn(
                                                    "hover:bg-muted/30 cursor-pointer transition-colors",
                                                    expandedOrderId === order.id && "bg-muted/20"
                                                )}
                                                onClick={() => setExpandedOrderId(
                                                    expandedOrderId === order.id ? null : order.id
                                                )}
                                            >
                                                <TableCell className="px-4 py-4">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted/50">
                                                        {expandedOrderId === order.id ? (
                                                            <ChevronUp className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </TableCell>
                                                <TableCell className="px-4 py-4 font-mono text-xs text-muted-foreground">
                                                    #{order.id.slice(-8).toUpperCase()}
                                                </TableCell>
                                                <TableCell className="px-4 py-4">
                                                    <div className="font-semibold text-foreground leading-tight">{order.customer?.name || "Anonymous"}</div>
                                                    <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-bold">Customer</div>
                                                </TableCell>
                                                <TableCell className="px-4 py-4">
                                                    <div className="font-medium text-foreground leading-tight">{order.providerProfile?.businessName || "Unknown"}</div>
                                                    <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-bold">Kitchen</div>
                                                </TableCell>
                                                <TableCell className="px-4 py-4 font-bold text-foreground tabular-nums text-sm">
                                                    ৳{order.totalAmount.toFixed(0)}
                                                </TableCell>
                                                <TableCell className="px-4 py-4">
                                                    <StatusPill value={mapStatus(order.status)} />
                                                </TableCell>
                                                <TableCell className="px-4 py-4 text-sm text-muted-foreground font-medium">
                                                    {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </TableCell>
                                            </TableRow>
                                            {expandedOrderId === order.id && (
                                                <TableRow key={`${order.id}-detail`} className="bg-muted/10">
                                                    <TableCell colSpan={7} className="px-4 py-6 border-y border-border/50 shadow-inner">
                                                        <div className="space-y-6 max-w-2xl">
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Order Summary</h4>
                                                                <div className="h-px flex-1 bg-border/50" />
                                                            </div>
                                                            {order.orderItems && order.orderItems.length > 0 ? (
                                                                <div className="grid gap-3">
                                                                    {order.orderItems.map((item) => (
                                                                        <div key={item.id} className="flex justify-between items-center text-sm bg-card p-3 rounded-xl border border-border shadow-sm">
                                                                            <div className="flex flex-col">
                                                                                <span className="font-semibold text-foreground">{item.meal?.name || "Unknown meal"}</span>
                                                                                <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                                                                            </div>
                                                                            <span className="font-bold text-foreground tabular-nums">
                                                                                ৳{((item.unitPrice || item.meal?.price || 0) * item.quantity).toFixed(0)}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-muted-foreground py-4 text-center border-2 border-dashed rounded-xl">No item details found for this order.</p>
                                                            )}
                                                            <div className="grid grid-cols-2 gap-8 pt-4 border-t border-border/50">
                                                                <div className="space-y-1">
                                                                    <div className="text-[10px] font-black uppercase text-muted-foreground">Delivery Address</div>
                                                                    <div className="text-sm font-medium text-foreground">{order.deliveryAddress || "N/A"}</div>
                                                                </div>
                                                                {order.notes && (
                                                                    <div className="space-y-1">
                                                                        <div className="text-[10px] font-black uppercase text-muted-foreground">Order Notes</div>
                                                                        <div className="text-sm font-medium text-foreground italic">"{order.notes}"</div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
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
