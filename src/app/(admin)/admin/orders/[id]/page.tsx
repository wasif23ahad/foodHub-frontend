"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, MapPin, Package, Store, User } from "lucide-react";

import { api } from "@/lib/api";
import { ApiResponse, Order } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AdminOrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params?.id as string;

    const { data: order, isLoading } = useQuery({
        queryKey: ["admin-order", orderId],
        queryFn: async () => {
            const res = await api.get<ApiResponse<Order>>(`/admin/orders/${orderId}`);
            return res.data;
        },
        enabled: !!orderId,
    });

    if (isLoading) {
        return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (!order) {
        return <div className="p-8 text-center text-muted-foreground">Order not found.</div>;
    }

    const items = order.orderItems || [];

    return (
        <div className="space-y-6">
            <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Order #{order.id.slice(-8).toUpperCase()}</h1>
                    <p className="text-muted-foreground">Created {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <Badge className="w-fit px-4 py-2 text-sm">{order.status}</Badge>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> Order Items</CardTitle>
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

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Customer</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p className="font-semibold">{order.customer?.name || "Customer"}</p>
                            <p className="text-muted-foreground">{order.customer?.email}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Store className="h-5 w-5" /> Provider</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p className="font-semibold">{order.providerProfile?.businessName || "Provider"}</p>
                            <p className="text-muted-foreground">{order.providerProfile?.user?.email}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Delivery</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            {order.deliveryAddress}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
