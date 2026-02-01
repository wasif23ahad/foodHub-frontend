"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ShoppingBag, ArrowRight, Star } from "lucide-react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";
import { useCartStore } from "@/stores/cart-store";

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const paramOrderId = searchParams.get("orderId");

    // Auth Check
    const { user } = useAuth();
    const { clearCart } = useCartStore();

    // State
    const [orderId, setOrderId] = useState<string | null>(paramOrderId);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [isLoadingId, setIsLoadingId] = useState(false);

    // Effect: Resolve Order ID (Param or Fetch Latest)
    useEffect(() => {
        if (paramOrderId) {
            setOrderId(paramOrderId);
            setTimeout(() => setIsReviewOpen(true), 1500); // Auto-open if param exists
        } else if (user) {
            // Fallback: Fetch latest order only if logged in
            const fetchLatestOrder = async () => {
                setIsLoadingId(true);
                try {
                    // Check if we can get the latest order
                    const res = await api.get<{ data: { orders: { id: string }[] } }>("/orders?limit=1");

                    // Handle different response structures gracefully
                    // @ts-ignore - API response type safety might vary
                    const orders = res.data?.orders || res.orders || [];

                    if (orders.length > 0) {
                        console.log("Fetched latest order ID:", orders[0].id);
                        setOrderId(orders[0].id);
                    }
                } catch (error) {
                    console.error("Failed to fetch latest order:", error);
                } finally {
                    setIsLoadingId(false);
                }
            };
            fetchLatestOrder();
        }
    }, [paramOrderId, user]);

    useEffect(() => {
        // Clear cart on mount
        clearCart();

        // Trigger confetti on mount
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    const handleRatingSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a star rating");
            return;
        }

        if (!orderId) return;

        setIsSubmittingReview(true);
        try {
            await api.post(`/orders/${orderId}/reviews`, {
                rating,
                comment,
            });
            toast.success("Thank you for your feedback!");
            setIsReviewOpen(false);
        } catch (error: any) {
            toast.error(error.message || "Failed to submit review");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
            >
                <Card className="text-center shadow-2xl border-primary/10 overflow-hidden">
                    <CardHeader className="bg-primary/5 pb-8 pt-10">
                        <div className="flex justify-center mb-4">
                            <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <CheckCircle2 className="h-14 w-14" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold text-foreground">Order Placed!</CardTitle>
                        <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
                            Thank you for your order. We&apos;ve received it and are preparing your meal.
                        </p>
                    </CardHeader>
                    <CardContent className="py-10 space-y-4">
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <h3 className="font-semibold text-lg mb-2">What&apos;s next?</h3>
                            <ul className="text-sm text-muted-foreground space-y-3 text-left">
                                <li className="flex items-start gap-3">
                                    <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-[10px] font-bold">1</div>
                                    <span>The provider will confirm your order shortly.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-[10px] font-bold">2</div>
                                    <span>You can track your order status in your dashboard.</span>
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 pt-4 pb-10">
                        {/* Always show View Orders */}
                        <Link href="/orders" className="w-full">
                            <Button variant="outline" className="w-full h-12 rounded-full border-2">
                                <ShoppingBag className="mr-2 h-4 w-4" /> View My Orders
                            </Button>
                        </Link>

                        {/* Rate Button with Auth Logic */}
                        <Button
                            variant="secondary"
                            className="w-full h-12 rounded-full bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-700"
                            onClick={async () => {
                                if (!user) {
                                    router.push("/login?callbackUrl=/checkout/success");
                                    return;
                                }

                                if (orderId) {
                                    setIsReviewOpen(true);
                                } else {
                                    // Manual fetch on click
                                    const toastId = toast.loading("Finding your order...");
                                    try {
                                        const res = await api.get<{ data: { orders: { id: string }[] } }>("/orders?limit=1");
                                        // Handle potential structure variations
                                        // @ts-ignore
                                        const orders = res.data?.orders || res.orders || [];

                                        if (orders.length > 0) {
                                            setOrderId(orders[0].id);
                                            setIsReviewOpen(true);
                                            toast.dismiss(toastId);
                                        } else {
                                            toast.error("No recent orders found to rate!", { id: toastId });
                                        }
                                    } catch (e) {
                                        console.error(e);
                                        toast.error("Could not find your order.", { id: toastId });
                                    }
                                }
                            }}
                        >
                            <Star className="mr-2 h-4 w-4 fill-yellow-400" />
                            {user ? "Rate Your Experience" : "Login to Rate"}
                        </Button>

                        <Link href="/meals" className="w-full">
                            <Button className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                                Browse More Meals <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </motion.div>

            {/* Review Modal */}
            <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl">Rate your Experience</DialogTitle>
                        <DialogDescription className="text-center">
                            How was your ordering experience? Your feedback helps us improve.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-6 py-6">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none transition-transform hover:scale-110"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                >
                                    <Star
                                        className={`w-10 h-10 ${star <= (hoverRating || rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-slate-200"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <Textarea
                            placeholder="Tell us what you liked or how we can improve..."
                            className="min-h-[100px]"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                    <DialogFooter className="sm:justify-center">
                        <Button type="button" variant="secondary" onClick={() => setIsReviewOpen(false)}>
                            Skip
                        </Button>
                        <Button
                            type="button"
                            onClick={handleRatingSubmit}
                            disabled={isSubmittingReview || rating === 0}
                            className="bg-primary text-white"
                        >
                            {isSubmittingReview ? "Submitting..." : "Submit Review"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
