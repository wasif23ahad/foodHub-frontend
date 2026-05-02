"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, MapPin, Package, Phone, User } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { ApiResponse, Order, OrderStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
    PLACED: "PREPARING",
    PREPARING: "READY",
    READY: "DELIVERED",
};

export default function ProviderOrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const orderId = params?.id as string;

    const { data: order, isLoading } = useQuery({
        queryKey: ["provider-order", orderId],
        queryFn: async () => {
            const res = await api.get<ApiResponse<Order>>(`/provider/orders/${orderId}`);
            return res.data;
        },
        enabled: !!orderId,
    });

    const updateStatus = useMutation({
        mutationFn: async (status: OrderStatus) => {
            const res = await api.patch<ApiResponse<Order>>(`/provider/orders/${orderId}/status`, { status });
            return res.data;
        },
        onSuccess: (updated) => {
            queryClient.setQueryData(["provider-order", orderId], updated);
            queryClient.invalidateQueries({ queryKey: ["provider-orders-own"] });
            toast.success("Order status updated");
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to update order status");
        },
    });

    if (isLoading) {
        return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (!order) {
        return <div className="p-8 text-center text-muted-foreground">Order not found.</div>;
    }

    const nextStatus = NEXT_STATUS[order.status];
    const items = order.orderItems || [];

    return (
        <div className="container mx-auto max-w-5xl space-y-6 p-6">
            <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Order #{order.id.slice(-8).toUpperCase()}</h1>
                    <p className="text-muted-foreground">Placed {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge className="px-4 py-2 text-sm">{order.status}</Badge>
                    {nextStatus && (
                        <Button disabled={updateStatus.isPending} onClick={() => updateStatus.mutate(nextStatus)}>
                            Mark as {nextStatus.charAt(0) + nextStatus.slice(1).toLowerCase()}
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> Items</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between rounded-xl border p-4">
                                <div>
                                    <p className="font-semibold">{item.meal?.name || "Meal"}</p>
                                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                </div>
                                <p className="font-bold">BDT {((item.unitPrice || item.price || 0) * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>BDT {order.totalAmount.toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Delivery</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex gap-3">
                            <User className="h-4 w-4 text-primary" />
                            <span>{order.customer?.name || "Customer"}</span>
                        </div>
                        <div className="flex gap-3">
                            <Phone className="h-4 w-4 text-primary" />
                            <span>{order.customer?.phone || "Phone included in address if provided"}</span>
                        </div>
                        <div className="flex gap-3">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{order.deliveryAddress}</span>
                        </div>
                        {order.notes && <p className="rounded-xl bg-muted p-3">{order.notes}</p>}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
