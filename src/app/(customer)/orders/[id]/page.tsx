"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
    ArrowLeft,
    Package,
    ShoppingBag,
    Clock,
    XCircle,
    Truck,
    MapPin,
    MessageSquare,
    CheckCircle2,
    Star,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { Order, ApiResponse, OrderStatus } from "@/types";
import { useAuth } from "@/components/providers/auth-provider";
import { getMediaUrl } from "@/lib/utils";

const STATUS_STEPS: OrderStatus[] = ["PLACED", "PREPARING", "READY", "DELIVERED"];

const STATUS_META: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
    PLACED: { label: "Order Placed", color: "bg-yellow-500/10 text-yellow-600 border-yellow-200", icon: Clock },
    PREPARING: { label: "Preparing", color: "bg-purple-500/10 text-purple-600 border-purple-200", icon: Package },
    READY: { label: "Ready", color: "bg-indigo-500/10 text-indigo-600 border-indigo-200", icon: ShoppingBag },
    DELIVERED: { label: "Delivered", color: "bg-green-500/10 text-green-600 border-green-200", icon: CheckCircle2 },
    CANCELLED: { label: "Cancelled", color: "bg-red-500/10 text-red-600 border-red-200", icon: XCircle },
};

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user, isLoading: isAuthLoading } = useAuth();
    const orderId = params.id as string;

    // Review state
    const [reviewRating, setReviewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [hasReviewed, setHasReviewed] = useState(false);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    useEffect(() => {
        if (!isAuthLoading && !user) {
            router.push(`/login?redirect=/orders/${orderId}`);
        }
    }, [isAuthLoading, user, router, orderId]);

    if (!user) {
        return null;
    }

    const { data: order, isLoading, error } = useQuery({
        queryKey: ["order", orderId],
        queryFn: async () => {
            const res = await api.get<ApiResponse<Order>>(`/orders/${orderId}`);
            return res.data;
        },
        enabled: !!orderId && !!user,
    });

    const cancelMutation = useMutation({
        mutationFn: () => api.patch(`/orders/${orderId}/cancel`, {}),
        onSuccess: () => {
            toast.success("Order cancelled successfully");
            queryClient.invalidateQueries({ queryKey: ["order", orderId] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to cancel order");
        },
    });

    const handleReviewSubmit = async () => {
        if (reviewRating === 0) {
            toast.error("Please select a star rating");
            return;
        }
        setIsSubmittingReview(true);
        try {
            await api.post(`/orders/${orderId}/reviews`, {
                rating: reviewRating,
                comment: reviewComment || undefined,
            });
            toast.success("Thank you for your review!");
            setHasReviewed(true);
        } catch (err: any) {
            toast.error(err.message || "Failed to submit review");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    if (isLoading || isAuthLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <Skeleton className="h-8 w-32 mb-8" />
                <div className="space-y-6">
                    <Skeleton className="h-40 w-full rounded-xl" />
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <p className="text-muted-foreground mb-4">Order not found or could not be loaded.</p>
                <Link href="/orders">
                    <Button variant="outline">Back to Orders</Button>
                </Link>
            </div>
        );
    }

    const meta = STATUS_META[order.status];
    const StatusIcon = meta.icon;
    const isCancelled = order.status === "CANCELLED";
    const currentStepIndex = STATUS_STEPS.indexOf(order.status);
    const provider = order.providerProfile || order.provider;
    const orderItems = order.orderItems || order.items || [];

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
                <Link href="/orders">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
                    <p className="text-sm text-muted-foreground">
                        Placed on {format(new Date(order.createdAt), "PPP 'at' p")}
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Status Card */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Order Status</CardTitle>
                            <Badge variant="outline" className={meta.color}>
                                <StatusIcon className="w-3 h-3 mr-1.5" />
                                {meta.label}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {!isCancelled ? (
                            <div className="flex items-center gap-0">
                                {STATUS_STEPS.map((step, i) => {
                                    const stepMeta = STATUS_META[step];
                                    const StepIcon = stepMeta.icon;
                                    const done = i <= currentStepIndex;
                                    return (
                                        <div key={step} className="flex items-center flex-1 last:flex-none">
                                            <div className={`flex flex-col items-center gap-1 ${done ? "text-primary" : "text-muted-foreground/40"}`}>
                                                <div className={`h-9 w-9 rounded-full flex items-center justify-center border-2 ${done ? "border-primary bg-primary/10" : "border-muted-foreground/20 bg-muted"}`}>
                                                    <StepIcon className="h-4 w-4" />
                                                </div>
                                                <span className="text-[10px] font-medium text-center leading-tight w-14">{stepMeta.label}</span>
                                            </div>
                                            {i < STATUS_STEPS.length - 1 && (
                                                <div className={`h-0.5 flex-1 mb-5 mx-1 ${i < currentStepIndex ? "bg-primary" : "bg-muted-foreground/20"}`} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-red-500">This order was cancelled.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Items</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {orderItems.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3">
                                    {item.meal?.image && (
                                        <img
                                            src={getMediaUrl(item.meal.image)}
                                            alt={item.meal.name}
                                            className="h-12 w-12 rounded-lg object-cover"
                                        />
                                    )}
                                    <div>
                                        <p className="font-medium">{item.meal?.name || "Deleted Meal"}</p>
                                        <p className="text-muted-foreground">৳ {item.unitPrice || item.price} × {item.quantity}</p>
                                    </div>
                                </div>
                                <span className="font-semibold">৳ {((item.unitPrice || item.price) * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}

                        <Separator />

                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Subtotal</span>
                            <span>৳ {(order.totalAmount - 60).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Delivery Fee</span>
                            <span>৳ 60.00</span>
                        </div>
                        <div className="flex justify-between font-bold text-base pt-1 border-t">
                            <span>Total</span>
                            <span className="text-primary">৳ {Number(order.totalAmount).toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Delivery Info */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Delivery Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                            <span>{order.deliveryAddress}</span>
                        </div>
                        {(order as any).deliveryNotes && (
                            <div className="flex items-start gap-3">
                                <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                <span>{(order as any).deliveryNotes}</span>
                            </div>
                        )}
                        {provider && (
                            <div className="flex items-start gap-3">
                                <Truck className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                <span>Fulfilled by <span className="font-medium">{provider.businessName}</span></span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Rate Your Order — shown only for DELIVERED orders */}
                {order.status === "DELIVERED" && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                Rate Your Order
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {hasReviewed ? (
                                <div className="flex items-center gap-3 text-sm text-muted-foreground py-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                    <span>Thanks for your feedback! Your review has been submitted.</span>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">How was your experience with this order?</p>
                                    {/* Star Selector */}
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                id={`review-star-${star}`}
                                                className="focus:outline-none transition-transform hover:scale-110"
                                                onClick={() => setReviewRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                                            >
                                                <Star
                                                    className={`w-8 h-8 transition-colors ${
                                                        star <= (hoverRating || reviewRating)
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "text-slate-200"
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    {/* Comment */}
                                    <Textarea
                                        id="review-comment"
                                        placeholder="Share your experience (optional)..."
                                        className="resize-none"
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        rows={3}
                                    />
                                    <Button
                                        id="submit-review-btn"
                                        onClick={handleReviewSubmit}
                                        disabled={isSubmittingReview || reviewRating === 0}
                                        className="w-full sm:w-auto"
                                    >
                                        {isSubmittingReview ? "Submitting..." : "Submit Review"}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Actions */}
                {order.status === "PLACED" && (
                    <Button
                        variant="destructive"
                        className="w-full"
                        disabled={cancelMutation.isPending}
                        onClick={() => cancelMutation.mutate()}
                    >
                        {cancelMutation.isPending ? "Cancelling..." : "Cancel Order"}
                    </Button>
                )}
            </div>
        </div>
    );
}
