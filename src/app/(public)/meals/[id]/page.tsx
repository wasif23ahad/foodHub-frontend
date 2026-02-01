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
import { Star, Minus, Plus, ShoppingCart, Store, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart-store";

export default function MealDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const mealId = params?.id as string;
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

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

    const meal = apiMeal;

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
                <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border bg-muted">
                    {meal.image ? (
                        <Image
                            src={meal.image}
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
                                <Badge variant="secondary" className="mb-2 uppercase tracking-wide text-xs">
                                    {meal.category?.name || "Meal"}
                                </Badge>
                                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                    {meal.name}
                                </h1>
                            </div>
                            <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                                <Star className="h-5 w-5 text-primary fill-primary" />
                                <span className="font-bold text-primary">{meal.rating || 4.5}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground mt-2">
                            <Store className="h-4 w-4" />
                            <span>Provided by</span>
                            <Link
                                href={`/providers/${meal.providerId}`}
                                className="font-medium text-foreground hover:underline hover:text-primary transition-colors"
                            >
                                {meal.provider?.businessName || "Unknown Provider"}
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

                    {/* Actions */}
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

                        <Button size="lg" className="w-full text-lg font-semibold shadow-lg shadow-primary/20" onClick={handleAddToCart}>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Add to Cart — ৳ {(meal.price * quantity).toFixed(2)}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
