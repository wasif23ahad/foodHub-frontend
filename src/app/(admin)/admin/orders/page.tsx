"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    ShoppingBag,
    Search,
    ChevronDown,
    ChevronUp,
    Filter,
    Calendar,
    ArrowUpDown,
    CheckCircle2,
    Clock,
    XCircle,
    Package
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
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { ApiResponse, Order } from "@/types";
import { EmptyState } from "@/components/dashboard/empty-state";

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

    const { data: ordersData, isLoading, error } = useQuery({
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
            label: "Total Flow",
            value: ordersData?.length || 0,
            color: "text-blue-500",
            icon: Package
        },
        {
            label: "Delivered",
            value: ordersData?.filter(o => o.status.toUpperCase() === "DELIVERED").length || 0,
            color: "text-emerald-500",
            icon: CheckCircle2
        },
        {
            label: "In Transit",
            value: ordersData?.filter(o => ["PLACED", "PREPARING", "READY"].includes(o.status.toUpperCase())).length || 0,
            color: "text-amber-500",
            icon: Clock
        },
        {
            label: "Bounced",
            value: ordersData?.filter(o => o.status.toUpperCase() === "CANCELLED").length || 0,
            color: "text-rose-500",
            icon: XCircle
        }
    ];

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <EmptyState
                    icon={ShoppingBag}
                    title="Error loading orders"
                    description="We couldn't sync with the order server. Please try again later."
                >
                    <Button onClick={() => window.location.reload()} className="mt-4 rounded-xl font-bold border-2" variant="outline">Retry Sync</Button>
                </EmptyState>
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Global Order Stream</h1>
                    <p className="text-muted-foreground mt-1 font-medium italic">Track every culinary transaction across the platform.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label} className="border-border bg-card rounded-[2rem] shadow-sm overflow-hidden group hover:border-primary/20 transition-all">
                            <CardContent className="pt-8 pb-8 px-8 flex items-center justify-between">
                                <div>
                                    <div className={`text-4xl font-black ${stat.color} tabular-nums tracking-tighter`}>
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

            {/* Filters & Search */}
            <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search by Order ID, customer name, or transaction amount..."
                        className="pl-12 h-14 bg-card border-2 border-border rounded-2xl focus:border-primary/20 focus:ring-primary/10 transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-14 w-full sm:w-48 rounded-2xl border-2 border-border bg-card px-4 py-2 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/10 outline-none hover:border-primary/50 transition-colors">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-2">
                            <SelectItem value="all" className="font-bold rounded-xl">All Statuses</SelectItem>
                            <SelectItem value="PLACED" className="font-bold rounded-xl">Placed</SelectItem>
                            <SelectItem value="PREPARING" className="font-bold rounded-xl">Preparing</SelectItem>
                            <SelectItem value="READY" className="font-bold rounded-xl">Ready</SelectItem>
                            <SelectItem value="DELIVERED" className="font-bold rounded-xl">Delivered</SelectItem>
                            <SelectItem value="CANCELLED" className="font-bold rounded-xl">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as "newest" | "oldest")}>
                        <SelectTrigger className="h-14 w-full sm:w-48 rounded-2xl border-2 border-border bg-card px-4 py-2 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/10 outline-none hover:border-primary/50 transition-colors">
                            <SelectValue placeholder="Sort Order" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-2">
                            <SelectItem value="newest" className="font-bold rounded-xl">Newest First</SelectItem>
                            <SelectItem value="oldest" className="font-bold rounded-xl">Oldest First</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-[2.5rem] border-2 border-border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto" data-lenis-prevent>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 border-b-2 border-border hover:bg-muted/30 transition-none">
                                <TableHead className="w-16 px-8"></TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Order Identity</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Parties</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Transaction</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={6} className="px-8 py-6">
                                            <Skeleton className="h-12 w-full rounded-xl" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-24 text-center">
                                        <EmptyState
                                            icon={ShoppingBag}
                                            title="No orders found"
                                            description={search ? `No activity matching "${search}".` : "The order ledger is currently empty."}
                                        />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => (
                                    <React.Fragment key={order.id}>
                                        <TableRow
                                            className={cn(
                                                "hover:bg-muted/30 cursor-pointer transition-all group/row border-b border-border/50",
                                                expandedOrderId === order.id && "bg-primary/5"
                                            )}
                                            onClick={() => setExpandedOrderId(
                                                expandedOrderId === order.id ? null : order.id
                                            )}
                                        >
                                            <TableCell className="px-8 py-6">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                                                    expandedOrderId === order.id ? "bg-primary text-white" : "bg-muted text-muted-foreground group-hover/row:bg-primary/10 group-hover/row:text-primary"
                                                )}>
                                                    {expandedOrderId === order.id ? (
                                                        <ChevronUp className="h-5 w-5" />
                                                    ) : (
                                                        <ChevronDown className="h-5 w-5" />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-8 py-6">
                                                <div className="font-mono text-xs font-black text-muted-foreground tracking-tighter group-hover/row:text-primary transition-colors">
                                                    #{order.id.slice(-8).toUpperCase()}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">ID Reference</div>
                                            </TableCell>
                                            <TableCell className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-foreground text-base leading-tight">
                                                        {order.customer?.name || "Anonymous User"}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground font-black mt-1 uppercase tracking-widest flex items-center gap-2">
                                                        To: {order.providerProfile?.businessName || "Private Kitchen"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-8 py-6">
                                                <div className="font-black text-foreground tabular-nums text-xl leading-none">
                                                    ৳{order.totalAmount.toFixed(0)}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">Gross Total</div>
                                            </TableCell>
                                            <TableCell className="px-8 py-6">
                                                <StatusPill value={mapStatus(order.status)} />
                                            </TableCell>
                                            <TableCell className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground font-bold">
                                                    <Calendar className="h-4 w-4 opacity-40 text-primary" />
                                                    {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {expandedOrderId === order.id && (
                                            <TableRow key={`${order.id}-detail`} className="bg-primary/2">
                                                <TableCell colSpan={6} className="px-12 py-10 border-y-2 border-primary/10 shadow-inner">
                                                    <div className="grid lg:grid-cols-2 gap-12 max-w-5xl">
                                                        <div className="space-y-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                                                    <ShoppingBag className="h-5 w-5" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-black text-lg text-foreground">Manifest Detail</h4>
                                                                    <p className="text-xs text-muted-foreground font-medium italic">Itemized order breakdown</p>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-3">
                                                                {order.orderItems && order.orderItems.length > 0 ? (
                                                                    order.orderItems.map((item) => (
                                                                        <div key={item.id} className="flex justify-between items-center p-4 bg-card rounded-[1.25rem] border-2 border-border/50 group/item hover:border-primary/20 transition-all">
                                                                            <div className="flex flex-col">
                                                                                <span className="font-black text-foreground group-hover/item:text-primary transition-colors">{item.meal?.name || "System Record"}</span>
                                                                                <span className="text-xs text-muted-foreground font-bold">Quantity: {item.quantity} units</span>
                                                                            </div>
                                                                            <span className="font-black text-foreground tabular-nums text-lg">
                                                                                ৳{((item.unitPrice || item.meal?.price || 0) * item.quantity).toFixed(0)}
                                                                            </span>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <div className="p-8 text-center border-2 border-dashed rounded-[1.5rem] text-muted-foreground font-medium">
                                                                        No itemized records available for this transaction.
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-8">
                                                            <div className="p-8 bg-card rounded-[2rem] border-2 border-border shadow-sm space-y-6">
                                                                <div className="space-y-1">
                                                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Logistics Destination</div>
                                                                    <div className="text-sm font-bold text-foreground leading-relaxed italic">"{order.deliveryAddress || "Self Pickup / Unknown"}"</div>
                                                                </div>
                                                                {order.notes && (
                                                                    <div className="space-y-1">
                                                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Order Directive</div>
                                                                        <div className="text-sm font-bold text-foreground leading-relaxed p-4 bg-muted/50 rounded-2xl border border-border/50">
                                                                            {order.notes}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className="pt-4 border-t-2 border-border/50 flex justify-between items-end">
                                                                    <div className="space-y-1">
                                                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Settlement Status</div>
                                                                        <Badge className="bg-emerald-500/10 text-emerald-600 border-2 border-emerald-500/20 font-black px-4 rounded-xl">PAID VIA SSLCOMMERZ</Badge>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Gross Total</div>
                                                                        <div className="text-3xl font-black text-primary">৳{order.totalAmount.toFixed(0)}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
