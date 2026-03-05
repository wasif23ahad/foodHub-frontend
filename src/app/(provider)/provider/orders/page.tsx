"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    ShoppingBag,
    Search,
    Clock,
    CheckCircle,
    ChefHat,
    Truck,
    XCircle,
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
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { ApiResponse, Order } from "@/types";
import { toast } from "sonner";

const statusConfig: Record<string, { color: string; icon: React.ElementType; next?: string }> = {
    PLACED: { color: "bg-yellow-100 text-yellow-800", icon: Clock, next: "PREPARING" },
    PREPARING: { color: "bg-blue-100 text-blue-800", icon: ChefHat, next: "READY" },
    READY: { color: "bg-green-100 text-green-800", icon: CheckCircle, next: "DELIVERED" },
    DELIVERED: { color: "bg-emerald-100 text-emerald-800", icon: Truck },
    CANCELLED: { color: "bg-red-100 text-red-800", icon: XCircle },
};

export default function ProviderOrdersPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const queryClient = useQueryClient();

    const { data: ordersData, isLoading } = useQuery({
        queryKey: ["provider-orders-own", statusFilter],
        queryFn: async () => {
            try {
                const params = new URLSearchParams();
                if (statusFilter !== "all") params.append("status", statusFilter);
                params.append("limit", "100");

                const res = await api.get<ApiResponse<Order[]>>(
                    `/provider/orders?${params.toString()}`
                );
                return res.data;
            } catch (err: any) {
                if (err.message?.includes("profile not found")) {
                    return [];
                }
                console.error("Orders fetch failed:", err);
                return [];
            }
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
            return api.patch<ApiResponse<Order>>(`/provider/orders/${orderId}/status`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["provider-orders-own"] });
            toast.success("Order status updated");
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to update order status");
        }
    });

    const orders = (ordersData || []).filter(order =>
        search === "" ||
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customer?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const stats = [
        { label: "Total Orders", value: ordersData?.length || 0, color: "text-blue-600" },
        { label: "Pending", value: (ordersData || []).filter(o => o.status === "PLACED").length, color: "text-yellow-600" },
        { label: "Preparing", value: (ordersData || []).filter(o => o.status === "PREPARING").length, color: "text-blue-600" },
        { label: "Delivered", value: (ordersData || []).filter(o => o.status === "DELIVERED").length, color: "text-green-600" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <p className="text-muted-foreground mt-1">Manage your incoming orders and update their status.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label} className="border-none shadow-md">
                        <CardContent className="pt-6">
                            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-background p-4 rounded-xl border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by order ID or customer..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <select
                    className="h-10 min-w-[160px] rounded-md border border-input bg-background px-3 py-2 text-sm"
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

            {/* Orders Table */}
            <Card className="shadow-sm border-muted overflow-hidden">
                <CardHeader>
                    <CardTitle>Your Orders</CardTitle>
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
                            <p>No orders found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => {
                                        const config = statusConfig[order.status.toUpperCase()] || statusConfig["PLACED"];
                                        const StatusIcon = config.icon;
                                        const nextStatus = config.next;

                                        return (
                                            <TableRow key={order.id} className="hover:bg-muted/30">
                                                <TableCell className="font-mono text-sm">
                                                    {order.id.slice(-8).toUpperCase()}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {order.customer?.name || "Customer"}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {(order.orderItems || order.items)?.length || 0} item{((order.orderItems || order.items)?.length || 0) !== 1 ? 's' : ''}
                                                </TableCell>
                                                <TableCell className="font-bold">
                                                    ৳{order.totalAmount.toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={config.color + " border-none"}>
                                                        <StatusIcon className="h-3 w-3 mr-1" />
                                                        {order.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {nextStatus ? (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                updateStatusMutation.mutate({
                                                                    orderId: order.id,
                                                                    status: nextStatus,
                                                                })
                                                            }
                                                            disabled={updateStatusMutation.isPending}
                                                        >
                                                            Mark as {nextStatus.charAt(0) + nextStatus.slice(1).toLowerCase()}
                                                        </Button>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">Completed</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
