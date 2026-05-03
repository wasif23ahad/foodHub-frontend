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
    Filter,
    PackageCheck,
    UtensilsCrossed,
    Banknote
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
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { ApiResponse, Order } from "@/types";
import { toast } from "sonner";
import { EmptyState } from "@/components/dashboard/empty-state";

const statusConfig: Record<string, { next?: string, label: string }> = {
    PLACED: { next: "PREPARING", label: "Accept Order" },
    PREPARING: { next: "READY", label: "Mark Ready" },
    READY: { next: "DELIVERED", label: "Complete Delivery" },
    DELIVERED: { label: "Delivered" },
    CANCELLED: { label: "Cancelled" },
};

export default function ProviderOrdersPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const queryClient = useQueryClient();

    const { data: ordersData, isLoading, error } = useQuery({
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
            toast.success("Order status synchronized successfully");
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
        { label: "Active Pipeline", value: (ordersData || []).filter(o => ["PLACED", "PREPARING", "READY"].includes(o.status.toUpperCase())).length, color: "text-blue-500", icon: Clock },
        { label: "Serving", value: (ordersData || []).filter(o => o.status === "PREPARING").length, color: "text-amber-500", icon: ChefHat },
        { label: "Fulfilled", value: (ordersData || []).filter(o => o.status === "DELIVERED").length, color: "text-emerald-500", icon: PackageCheck },
        { label: "Net Revenue", value: `৳${(ordersData || []).filter(o => o.status === "DELIVERED").reduce((sum, o) => sum + o.totalAmount, 0).toFixed(0)}`, color: "text-primary", icon: Banknote },
    ];

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <EmptyState
                    icon={ShoppingBag}
                    title="Order Sync Failed"
                    description="We couldn't reach your kitchen's order stream. Please refresh."
                >
                    <Button onClick={() => window.location.reload()} className="mt-4 rounded-xl font-bold border-2" variant="outline">Refresh Stream</Button>
                </EmptyState>
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Kitchen Pipeline</h1>
                    <p className="text-muted-foreground mt-1 font-medium italic">Manage active orders and update culinary status.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label} className="border-border bg-card rounded-[2rem] shadow-sm overflow-hidden group">
                            <CardContent className="pt-8 pb-8 px-8 flex items-center justify-between">
                                <div>
                                    <div className={`text-3xl font-black ${stat.color} tabular-nums tracking-tighter`}>
                                        {stat.value}
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-2">{stat.label}</p>
                                </div>
                                <div className={`p-4 rounded-2xl ${stat.color} bg-current/10 group-hover:scale-110 transition-transform`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search by Order ID or customer identity..."
                        className="pl-12 h-14 bg-card border-2 border-border rounded-2xl focus:border-primary/20 focus:ring-primary/10 transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="relative w-full lg:w-56">
                        <select
                            className="h-14 w-full rounded-2xl border-2 border-border bg-card px-4 py-2 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/10 outline-none appearance-none cursor-pointer hover:border-primary/50 transition-colors"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Phases</option>
                            <option value="PLACED">Placed</option>
                            <option value="PREPARING">Preparing</option>
                            <option value="READY">Ready</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                        <Filter className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-[2.5rem] border-2 border-border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 border-b-2 border-border hover:bg-muted/30 transition-none">
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Order Reference</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Customer</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Manifest</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Settlement</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Phase</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Workflow Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={6} className="px-8 py-6">
                                            <Skeleton className="h-14 w-full rounded-2xl" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-24 text-center">
                                        <EmptyState
                                            icon={ShoppingBag}
                                            title="No Orders Found"
                                            description={search ? `No activity matching "${search}".` : "Your kitchen pipeline is currently clear."}
                                        />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => {
                                    const config = statusConfig[order.status.toUpperCase()] || statusConfig["PLACED"];
                                    const nextStatus = config.next;
                                    const itemsCount = (order.orderItems || order.items)?.length || 0;

                                    return (
                                        <TableRow key={order.id} className="hover:bg-muted/30 transition-all group/row border-b border-border/50">
                                            <TableCell className="px-8 py-6">
                                                <div className="font-mono text-xs font-black text-muted-foreground tracking-tighter group-hover/row:text-primary transition-colors">
                                                    #{order.id.slice(-8).toUpperCase()}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground font-black mt-1 uppercase tracking-widest">ID Ref</div>
                                            </TableCell>
                                            <TableCell className="px-8 py-6">
                                                <div className="font-black text-foreground text-lg leading-tight">{order.customer?.name || "Anonymous Buyer"}</div>
                                                <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest font-black">Verified Customer</div>
                                            </TableCell>
                                            <TableCell className="px-8 py-6">
                                                <Badge variant="outline" className="rounded-xl px-4 py-1.5 font-bold border-2 border-primary/10 bg-muted/50 text-foreground">
                                                    {itemsCount} item{itemsCount !== 1 ? 's' : ''}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-8 py-6 font-black text-foreground tabular-nums text-xl">
                                                ৳{order.totalAmount.toFixed(0)}
                                            </TableCell>
                                            <TableCell className="px-8 py-6">
                                                <StatusPill value={order.status} />
                                            </TableCell>
                                            <TableCell className="px-8 py-6 text-right">
                                                {nextStatus ? (
                                                    <Button
                                                        className="h-12 rounded-xl font-black px-6 shadow-lg shadow-primary/10 hover:scale-105 transition-transform bg-primary text-white"
                                                        onClick={() =>
                                                            updateStatusMutation.mutate({
                                                                orderId: order.id,
                                                                status: nextStatus,
                                                            })
                                                        }
                                                        disabled={updateStatusMutation.isPending}
                                                    >
                                                        {updateStatusMutation.isPending ? "Syncing..." : config.label}
                                                    </Button>
                                                ) : order.status.toUpperCase() === "CANCELLED" ? (
                                                    <Badge className="bg-rose-500/10 text-rose-600 border-2 border-rose-500/20 font-black px-4 py-2 rounded-xl uppercase tracking-widest text-[10px]">
                                                        Order Terminated
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-emerald-500/10 text-emerald-600 border-2 border-emerald-500/20 font-black px-4 py-2 rounded-xl uppercase tracking-widest text-[10px]">
                                                        Successfully Fulfilled
                                                    </Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
