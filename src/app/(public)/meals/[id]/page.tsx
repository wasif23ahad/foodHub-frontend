"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Meal, ApiResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Minus, Plus, ShoppingCart, Store, ArrowLeft, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart-store";
import { useAuth } from "@/components/providers/auth-provider";
import { getMediaUrl } from "@/lib/utils";
import { format } from "date-fns";

interface Review {
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        image?: string;
    };
}

interface ReviewsResponse {
    reviews: Review[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        averageRating: number;
    };
}

function StarDisplay({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
    const cls = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`${cls} ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}`}
                />
            ))}
        </div>
    );
}

export default function MealDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const mealId = params?.id as string;
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);
    const { user } = useAuth();
    const isCustomer = !user || user?.role?.toUpperCase() === "CUSTOMER";

    const { data: apiMeal, isLoading, error } = useQuery({
        queryKey: ["meal", mealId],
        queryFn: async () => {
            try {
                const res = await api.get<ApiResponse<Meal>>(`/meals/${mealId}`);
                return res.data;
            } catch (err: any) {
                console.error("Fetch details error:", err);
                throw err;
            }
        },
        enabled: !!mealId,
        retry: 1
    });

    const { data: reviewsData, isLoading: isLoadingReviews } = useQuery({
        queryKey: ["meal-reviews", mealId],
        queryFn: async () => {
            // api.get returns res.json() directly — the full HTTP body:
            // { success: true, data: [...reviews], meta: { page, total, ... } }
            const body = await api.get<{ success: boolean; data: Review[]; meta: ReviewsResponse["meta"] }>(`/meals/${mealId}/reviews`);
            return body;
        },
        enabled: !!mealId,
    });

    const meal = apiMeal;
    const reviews = reviewsData?.data || [];
    const totalReviews = reviewsData?.meta?.total ?? 0;

    const handleAddToCart = () => {
        if (!meal) return;
        addItem(meal, quantity);
        toast.success(`Added ${quantity} ${meal.name} to cart`);
    };

    const increment = () => setQuantity((q) => q + 1);
    const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

    if (isLoading && !meal) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Button variant="ghost" className="mb-6" disabled>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Meals
                </Button>
                <div className="grid md:grid-cols-2 gap-8">
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-12 w-40 mt-8" />
                    </div>
                </div>
            </div>
        );
    }

    if (!meal) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Meal not found</h2>
                <p className="text-muted-foreground mb-8">
                    The meal you are looking for does not exist or has been removed.
                </p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    const hasRating = meal.avgRating && meal.avgRating > 0;

    return (
        <div className="container mx-auto px-4 py-8">
            <Button
                variant="ghost"
                className="mb-6 hover:bg-transparent hover:text-primary p-0"
                onClick={() => router.back()}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Meals
            </Button>

            <div className="grid md:grid-cols-2 gap-10 items-start">
                {/* Image Section */}
                <div className="relative aspect-square md:aspect-4/3 rounded-2xl overflow-hidden shadow-lg border bg-muted">
                    {meal.image ? (
                        <Image
                            src={getMediaUrl(meal.image)}
                            alt={meal.name}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
                            No Image
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <Badge variant="secondary" className="uppercase tracking-wide text-xs">
                                        {meal.category?.name || "Meal"}
                                    </Badge>
                                    {meal.dietaryPreference && meal.dietaryPreference !== "REGULAR" && (
                                        <Badge variant="outline" className="uppercase tracking-wide text-xs border-primary/30 text-primary bg-primary/5">
                                            {meal.dietaryPreference.replace("_", " ")}
                                        </Badge>
                                    )}
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                    {meal.name}
                                </h1>
                            </div>
                            {/* Rating display — only show if actual ratings exist */}
                            {hasRating ? (
                                <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                                    <Star className="h-5 w-5 text-primary fill-primary" />
                                    <span className="font-bold text-primary">{meal.avgRating!.toFixed(1)}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full">
                                    <Star className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground font-medium">No ratings yet</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground mt-2">
                            <Store className="h-4 w-4" />
                            <span>Provided by</span>
                            <Link
                                href={`/providers/${meal.providerProfileId}`}
                                className="font-medium text-foreground hover:underline hover:text-primary transition-colors"
                            >
                                {meal.providerProfile?.businessName || "Unknown Provider"}
                            </Link>
                        </div>
                    </div>

                    <div className="text-3xl font-bold text-primary">
                        ৳ {meal.price}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">Description</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {meal.description || "No description available for this delicious meal."}
                        </p>
                    </div>

                    {/* Actions — only for customers */}
                    {isCustomer && (
                    <div className="bg-card border p-6 rounded-xl shadow-sm space-y-6 mt-8">
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Quantity</span>
                            <div className="flex items-center gap-4 bg-muted/50 rounded-lg p-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={decrement}
                                    disabled={quantity <= 1}
                                    className="h-8 w-8"
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="font-bold w-4 text-center">{quantity}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={increment}
                                    className="h-8 w-8"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <Button id="add-to-cart-btn" size="lg" className="w-full text-lg font-semibold shadow-lg shadow-primary/20" onClick={handleAddToCart}>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Add to Cart — ৳ {(meal.price * quantity).toFixed(2)}
                        </Button>
                    </div>
                    )}
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-12">
                <Separator className="mb-8" />
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <MessageSquare className="h-6 w-6 text-primary" />
                        Customer Reviews
                        {totalReviews > 0 && (
                            <span className="text-lg font-normal text-muted-foreground">({totalReviews})</span>
                        )}
                    </h2>
                    {hasRating && (
                        <div className="flex items-center gap-2">
                            <StarDisplay rating={Math.round(meal.avgRating!)} size="md" />
                            <span className="font-bold text-lg">{meal.avgRating!.toFixed(1)}</span>
                            <span className="text-muted-foreground text-sm">/ 5</span>
                        </div>
                    )}
                </div>

                {isLoadingReviews ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-24 w-full rounded-xl" />
                        ))}
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
                        <Star className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                        <p className="text-muted-foreground font-medium">No reviews yet</p>
                        <p className="text-sm text-muted-foreground/70 mt-1">Be the first to review this meal after ordering!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-card border rounded-xl p-5 space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                            {review.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{review.user.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {format(new Date(review.createdAt), "PPP")}
                                            </p>
                                        </div>
                                    </div>
                                    <StarDisplay rating={review.rating} />
                                </div>
                                {review.comment && (
                                    <p className="text-sm text-muted-foreground leading-relaxed pl-12">
                                        {review.comment}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
